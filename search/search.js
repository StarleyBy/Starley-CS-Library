document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    let lunrIndex, docStore;

    const EDITION_SUFFIX_MAP = {
        'original': '.md',
        'russian': '-ru.md',
        'hebrew': '-he.md',
        'starley': '-starley.md'
    };

    // Modal elements
    const modal = document.getElementById('chapterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const readFullButton = document.getElementById('readFullButton');
    const closeButton = document.querySelector('.close-button');

    function showLoading(isLoading, message = 'Loading search index...') {
        if (isLoading) {
            loadingIndicator.style.display = 'flex';
            loadingIndicator.innerHTML = `<div class="spinner"></div><span>${message}</span>`;
            resultsContainer.style.opacity = '0.5';
        } else {
            loadingIndicator.style.display = 'none';
            resultsContainer.style.opacity = '1';
        }
    }

    function handleUrlQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            searchInput.value = query;
            if (lunrIndex) performSearch(query);
        }
    }

    function detectLanguage(text) {
        if (/[а-яА-Я]/.test(text)) return 'russian';
        if (/[\u0590-\u05FF]/.test(text)) return 'hebrew';
        return 'english';
    }

    // Load the search index and document store
    showLoading(true);
    Promise.all([
        fetch('lunr-index.json').then(res => res.json()),
        fetch('document-store.json').then(res => res.json())
    ]).then(([indexData, storeData]) => {
        lunrIndex = lunr.Index.load(indexData);
        docStore = storeData;
        showLoading(false);
        handleUrlQuery();
    }).catch(error => {
        console.error('Error loading search data:', error);
        showLoading(false);
        resultsContainer.innerHTML = '<div class="error">Error loading search data. Please try refreshing the page.</div>';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) performSearch(query);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) performSearch(query);
        }
    });

    function stripMarkdownOnClient(markdown) {
        if (!markdown) return '';
        return markdown
            .replace(/^(#+\s.*)$/gm, ' ')
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '')
            .replace(/^>\s?.*$/gm, ' ')
            .replace(/^(\s*(-|\*|\d+\.))\s/gm, ' ')
            .replace(/^-{3,}$/gm, ' ')
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function createSmartSnippet(text, query) {
        if (!text) return '';
        const terms = query.split(/\s+/).filter(t => t.length > 1);
        if (terms.length === 0) return text.substring(0, 300) + '...';

        let firstIndex = -1;
        for (const term of terms) {
            const idx = text.toLowerCase().indexOf(term.toLowerCase());
            if (idx !== -1 && (firstIndex === -1 || idx < firstIndex)) {
                firstIndex = idx;
            }
        }

        if (firstIndex === -1) return text.substring(0, 300) + '...';

        const snippetLength = 300;
        const start = Math.max(0, firstIndex - 150);
        const end = Math.min(text.length, start + snippetLength);
        
        let snippet = text.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        terms.forEach(term => {
            const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            snippet = snippet.replace(regex, '<mark>$1</mark>');
        });

        return snippet;
    }

    function fetchSnippet(docId, query, containerElement) {
        const doc = docStore[docId];
        const editionSuffix = EDITION_SUFFIX_MAP[doc.edition] || '.md';
        const markdownPath = `../${doc.bookId}/chapters/${doc.chapterId}/${doc.chapterId}${editionSuffix}`;

        fetch(markdownPath)
            .then(res => res.text())
            .then(markdown => {
                const plainText = stripMarkdownOnClient(markdown);
                const snippet = createSmartSnippet(plainText, query);
                containerElement.innerHTML = snippet;
            })
            .catch(() => {
                containerElement.innerHTML = '<span style="color: #999;">Error loading snippet...</span>';
            });
    }

    function performSearch(query) {
        if (!lunrIndex || !docStore) return;

        resultsContainer.innerHTML = '';
        const detectedLanguage = detectLanguage(query);

        const searchResults = lunrIndex.query(function (q) {
            query.split(/\s+/).filter(t => t.length > 1).forEach(term => {
                q.term(term, { fields: ['title', 'content'] });
                q.term(term, { fields: ['title', 'content'], editDistance: 1 });
            });

            if (detectedLanguage === 'russian') {
                q.term('russian', { fields: ['language'], presence: lunr.Query.presence.REQUIRED });
            } else if (detectedLanguage === 'hebrew') {
                q.term('hebrew', { fields: ['language'], presence: lunr.Query.presence.REQUIRED });
            } else {
                q.term('original', { fields: ['language'], presence: lunr.Query.presence.OPTIONAL });
                q.term('starley', { fields: ['language'], presence: lunr.Query.presence.OPTIONAL });
            }
        });
        
        if (searchResults.length > 0) {
            // Limit to top 30 results for performance
            const topResults = searchResults.slice(0, 30);
            
            topResults.forEach(result => {
                const doc = docStore[result.ref];
                if (doc) {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.dataset.bookId = doc.bookId;
                    resultItem.dataset.chapterId = doc.chapterId;
                    resultItem.dataset.edition = doc.edition;
                    resultItem.dataset.bookTitle = doc.bookTitle;
                    resultItem.dataset.chapterTitle = doc.chapterTitle;

                    resultItem.innerHTML = `
                        <h3 class="result-title">${doc.bookTitle} - ${doc.chapterTitle} <small>Score: ${result.score.toFixed(1)}</small></h3>
                        <p class="snippet" id="snippet-${result.ref}">Loading snippet...</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                    
                    // Asynchronously fetch snippet
                    fetchSnippet(result.ref, query, resultItem.querySelector('.snippet'));
                }
            });
        } else {
            resultsContainer.innerHTML = '<div class="loading">No results found for your query. Try different keywords.</div>';
        }
    }

    // --- Modal Logic ---

    resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.result-item');
        if (resultItem) {
            const query = searchInput.value.trim();
            openModal(resultItem.dataset, query);
        }
    });

    function openModal(data, query) {
        modalTitle.textContent = `${data.bookTitle} - ${data.chapterTitle}`;
        modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>Loading chapter content...</div>';
        
        const readerLink = `../reader.html?book=${data.bookId}&chapter=${data.chapterId}&edition=${data.edition}`;
        readFullButton.href = readerLink;
        
        const editionSuffix = EDITION_SUFFIX_MAP[data.edition] || '.md';
        const chapterFileName = `${data.chapterId}${editionSuffix}`;
        const markdownPath = `../${data.bookId}/chapters/${data.chapterId}/${chapterFileName}`;

        fetch(markdownPath)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.text();
            })
            .then(text => {
                let highlightedText = text;
                if (query) {
                    const terms = query.split(/\s+/).filter(t => t.length > 1);
                    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
                    sortedTerms.forEach(term => {
                        const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
                        highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
                    });
                }

                const baseUrlForAssets = markdownPath.substring(0, markdownPath.lastIndexOf('/') + 1);
                modalBody.innerHTML = marked.parse(highlightedText, { baseUrl: baseUrlForAssets });
                modal.style.display = 'block';
            })
            .catch(error => {
                modalBody.innerHTML = `<div class="error">Could not load chapter content.<br><small>Error: ${error.message}</small></div>`;
                modal.style.display = 'block';
            });
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});
