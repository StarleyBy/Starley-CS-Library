document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
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

    // Function to handle URL query parameters
    function handleUrlQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            searchInput.value = query;
            // Wait for the index to load before searching
            if (lunrIndex) {
                performSearch(query);
            }
        }
    }

    // Function to detect language of the query
    function detectLanguage(text) {
        if (/[а-яА-Я]/.test(text)) {
            return 'russian';
        }
        if (/[\u0590-\u05FF]/.test(text)) {
            return 'hebrew';
        }
        return 'english'; // Default for other languages or if no specific characters are found
    }

    // Load the search index and document store
    Promise.all([
        fetch('lunr-index.json').then(res => res.json()),
        fetch('document-store.json').then(res => res.json())
    ]).then(([indexData, storeData]) => {
        lunrIndex = lunr.Index.load(indexData);
        docStore = storeData;
        console.log('Lunr index and document store loaded successfully.');
        handleUrlQuery();
    }).catch(error => {
        console.error('Error loading search data:', error);
        resultsContainer.innerHTML = '<p>Error loading search data.</p>';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    function performSearch(query) {
        if (!lunrIndex || !docStore) {
            resultsContainer.innerHTML = '<p>Search index is not loaded yet. Please wait.</p>';
            return;
        }

        resultsContainer.innerHTML = '';
        
        const detectedLanguage = detectLanguage(query);

        const searchResults = lunrIndex.query(function (q) {
            // Add the main query terms for title and content fields
            query.split(' ').forEach(term => {
                // Add exact term match
                q.term(term, { fields: ['title', 'content'] });
                // Add fuzzy match for slight typos (e.g., 1 character difference)
                q.term(term, { fields: ['title', 'content'], editDistance: 1 });
            });

            // Apply language filter
            if (detectedLanguage === 'russian') {
                q.term('russian', { fields: ['language'], presence: lunr.Query.presence.REQUIRED });
            } else if (detectedLanguage === 'hebrew') {
                q.term('hebrew', { fields: ['language'], presence: lunr.Query.presence.REQUIRED });
            } else { // English or other, search original and starley editions
                // For English, we want to match either 'original' or 'starley' editions
                q.term('original', { fields: ['language'], presence: lunr.Query.presence.OPTIONAL });
                q.term('starley', { fields: ['language'], presence: lunr.Query.presence.OPTIONAL });
                // If query is very short, and language cannot be identified, we don't want to over-filter
                // but this logic assumes "English" is default.
            }
        });
        
        if (searchResults.length > 0) {
            searchResults.forEach(result => {
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
                        <h3 class="result-title">${doc.bookTitle} - ${doc.chapterTitle}</a> <small>(Score: ${result.score.toFixed(2)})</small></h3>
                        <p class="snippet">${doc.snippet}</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                }
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }

    // --- Modal Logic ---

    // Open modal when a result is clicked
    resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.result-item');
        if (resultItem) {
            const query = searchInput.value.trim();
            openModal(resultItem.dataset, query);
        }
    });

    function openModal(data, query) {
        modalTitle.textContent = `${data.bookTitle} - ${data.chapterTitle}`;
        modalBody.innerHTML = '<p>Loading...</p>';
        
        const readerLink = `../reader.html?book=${data.bookId}&chapter=${data.chapterId}&edition=${data.edition}`;
        readFullButton.href = readerLink;
        
        // Construct path to markdown file based on edition
        const editionSuffix = EDITION_SUFFIX_MAP[data.edition] || '.md'; // Default to .md if not found
        const chapterFileName = `${data.chapterId}${editionSuffix}`;
        const markdownPath = `../${data.bookId}/chapters/${data.chapterId}/${chapterFileName}`;

        fetch(markdownPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                let highlightedText = text;
                if (query) {
                    // Use a regex to find all occurrences of the query, case-insensitively
                    const regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                    highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
                }

                // Marked options for base URL to resolve relative assets (e.g., images)
                const baseUrlForAssets = markdownPath.substring(0, markdownPath.lastIndexOf('/') + 1);
                const markedOptions = {
                    baseUrl: baseUrlForAssets // Set the base URL for relative assets
                };

                modalBody.innerHTML = marked.parse(highlightedText, markedOptions);
            })
            .catch(error => {
                modalBody.innerHTML = `<p>Could not load chapter content. Please try opening it in full mode.</p><p><small>Error: ${error.message}</small></p>`;
                console.error('Error fetching chapter content:', error);
            });

        modal.style.display = 'block';
    }

    // Close modal logic
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
