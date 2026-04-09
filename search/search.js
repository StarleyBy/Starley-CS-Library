document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsInfo = document.getElementById('resultsInfo');
    const paginationContainer = document.getElementById('paginationContainer');
    const filterBook = document.getElementById('filterBook');
    const filterLanguage = document.getElementById('filterLanguage');
    const filterCategory = document.getElementById('filterCategory');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const filtersSection = document.getElementById('filtersSection');

    let searchIndex = null;
    let searchConfig = null;
    let currentResults = [];
    let currentPage = 1;
    const RESULTS_PER_PAGE = 20;
    let currentQuery = '';
    let contentCache = {};

    const EDITION_SUFFIX_MAP = {
        'original': '.md',
        'russian': '-ru.md',
        'hebrew': '-he.md',
        'starley': '-starley.md'
    };

    const modal = document.getElementById('chapterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const readFullButton = document.getElementById('readFullButton');
    const closeButton = document.querySelector('.close-button');

    // ==================== DETECTION & TOKENIZATION ====================

    function detectLanguage(text) {
        if (/[\u0400-\u04FF]/.test(text)) return 'russian';
        if (/[\u0590-\u05FF]/.test(text)) return 'hebrew';
        return 'english';
    }

    function tokenizeQuery(query) {
        return query.toLowerCase()
            .replace(/[^\w\s\u0400-\u04FF\u0590-\u05FF-]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 1);
    }

    function escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // ==================== LOADING & INITIALIZATION ====================

    function showLoading(message = 'Loading search index...') {
        loadingIndicator.style.display = 'flex';
        loadingIndicator.innerHTML = `<div class="spinner"></div><span>${message}</span>`;
        resultsContainer.style.opacity = '0.3';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
        resultsContainer.style.opacity = '1';
    }

    async function loadIndex() {
        showLoading('Loading search index...');
        try {
            const [indexRes, configRes] = await Promise.all([
                fetch('search-index.json'),
                fetch('search-config.json')
            ]);

            if (!indexRes.ok || !configRes.ok) {
                throw new Error('Index files not found');
            }

            searchIndex = await indexRes.json();
            searchConfig = await configRes.json();

            hideLoading();
            populateFilters();
            handleUrlQuery();
        } catch (error) {
            console.error('Error loading search:', error);
            hideLoading();
            resultsContainer.innerHTML = `
                <div class="error">
                    <strong>Error loading search data</strong><br>
                    Please run: <code>node search/generate-search-index.js</code><br>
                    <small>${error.message}</small>
                </div>
            `;
        }
    }

    // ==================== FILTERS ====================

    function populateFilters() {
        if (!searchConfig) return;

        // Books
        Object.entries(searchConfig.books).forEach(([id, book]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = book.title;
            filterBook.appendChild(option);
        });

        // Categories
        Object.entries(searchConfig.categories).forEach(([id, cat]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = cat.title;
            filterCategory.appendChild(option);
        });

        // Languages
        const languages = [
            { value: '', label: 'All Languages' },
            { value: 'english', label: 'English' },
            { value: 'russian', label: 'Русский' },
            { value: 'hebrew', label: 'עברית' }
        ];
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.value;
            option.textContent = lang.label;
            filterLanguage.appendChild(option);
        });

        filtersSection.style.display = 'block';
    }

    function getActiveFilters() {
        return {
            book: filterBook.value,
            language: filterLanguage.value,
            category: filterCategory.value
        };
    }

    function applyFilters() {
        currentPage = 1;
        if (currentQuery) {
            performSearch(currentQuery, false);
        }
    }

    clearFiltersBtn.addEventListener('click', () => {
        filterBook.value = '';
        filterLanguage.value = '';
        filterCategory.value = '';
        applyFilters();
    });

    filterBook.addEventListener('change', applyFilters);
    filterLanguage.addEventListener('change', applyFilters);
    filterCategory.addEventListener('change', applyFilters);

    // ==================== SEARCH ALGORITHM ====================

    function searchDocument(query, doc) {
        const queryTerms = tokenizeQuery(query);
        if (queryTerms.length === 0) return null;

        let score = 0;
        const matchedTerms = [];
        const totalOccurrences = [];

        // Проверяем совпадения отдельных терминов
        for (const term of queryTerms) {
            if (doc.w && doc.w[term]) {
                const count = doc.w[term];
                matchedTerms.push(term);
                totalOccurrences.push(count);
                
                // Бонус за длину совпавшего слова
                score += Math.min(20, term.length * 2);
            }
        }

        // Если нет совпадений - возвращаем null
        if (matchedTerms.length === 0) {
            return null;
        }

        // Бонус за совпадение всех терминов
        if (matchedTerms.length === queryTerms.length) {
            score += 50;
        }

        // Бонус за совпадение большинства терминов
        const matchRatio = matchedTerms.length / queryTerms.length;
        score += Math.floor(matchRatio * 30);

        // TF (term frequency) - плотность совпадений
        const sumOccurrences = totalOccurrences.reduce((a, b) => a + b, 0);
        const termDensity = sumOccurrences / doc.len;
        score += Math.min(25, Math.floor(termDensity * 1000));

        // Бонус за короткие документы (более релевантные)
        if (doc.len < 1000) {
            score += 10;
        } else if (doc.len < 3000) {
            score += 5;
        }

        return {
            score: Math.round(score * 10) / 10,
            matchedTerms,
            totalOccurrences: sumOccurrences
        };
    }

    function performSearch(query, resetPage = true) {
        if (!searchIndex) return;

        if (resetPage) {
            currentPage = 1;
        }
        currentQuery = query;

        const tokens = tokenizeQuery(query);
        if (tokens.length === 0) {
            resultsContainer.innerHTML = '<div class="info">Please enter at least 2 characters to search.</div>';
            resultsInfo.textContent = '';
            paginationContainer.innerHTML = '';
            return;
        }

        const filters = getActiveFilters();
        const startTime = performance.now();

        // Поиск по всем документам
        const scoredResults = [];
        
        for (const doc of searchIndex.documents) {
            // Применяем фильтры
            if (filters.book && doc.b !== filters.book) continue;
            if (filters.language && doc.l !== filters.language) continue;
            if (filters.category) {
                const bookInfo = searchConfig.books[doc.b];
                if (!bookInfo || bookInfo.category !== filters.category) continue;
            }

            const searchResult = searchDocument(query, doc);
            if (searchResult) {
                scoredResults.push({
                    bookId: doc.b,
                    chapterId: doc.c,
                    edition: doc.e,
                    language: doc.l,
                    contentLength: doc.len,
                    words: doc.w,
                    ...searchResult
                });
            }
        }

        // Сортируем по релевантности (score)
        scoredResults.sort((a, b) => b.score - a.score);
        currentResults = scoredResults;

        const endTime = performance.now();
        const searchTime = ((endTime - startTime) / 1000).toFixed(2);

        // Отображаем результаты
        displayResults(scoredResults, searchTime);
    }

    // ==================== DISPLAY RESULTS ====================

    function displayResults(results, searchTime) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <strong>No results found</strong><br>
                    Try different keywords or adjust filters
                </div>
            `;
            resultsInfo.textContent = '0 results';
            paginationContainer.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
        const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
        const endIdx = Math.min(startIdx + RESULTS_PER_PAGE, results.length);
        const pageResults = results.slice(startIdx, endIdx);

        resultsInfo.textContent = `Found ${results.length} results in ${searchTime}s (showing ${startIdx + 1}-${endIdx})`;

        pageResults.forEach(result => {
            const resultItem = createResultItem(result);
            resultsContainer.appendChild(resultItem);
        });

        renderPagination(totalPages);
    }

    function createResultItem(result) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.docId = result.id;
        resultItem.dataset.bookId = result.bookId;
        resultItem.dataset.chapterId = result.chapterId;
        resultItem.dataset.edition = result.edition;
        resultItem.dataset.bookTitle = result.bookTitle;
        resultItem.dataset.chapterTitle = result.chapterTitle;

        const bookInfo = searchConfig.books[result.bookId];
        const categoryInfo = bookInfo ? searchConfig.categories[bookInfo.category] : null;

        resultItem.innerHTML = `
            <div class="result-header">
                <h3 class="result-title">${result.chapterTitle}</h3>
                <div class="result-meta">
                    <span class="result-book">📚 ${result.bookTitle}</span>
                    ${categoryInfo ? `<span class="result-category">${categoryInfo.title}</span>` : ''}
                    <span class="result-edition">🏷️ ${result.edition}</span>
                    <span class="result-score">⭐ ${result.score.toFixed(1)}</span>
                </div>
            </div>
            <div class="result-snippets" id="snippets-${result.id}">
                <div class="loading-snippet">Loading snippets...</div>
            </div>
            <div class="result-footer">
                <button class="button button-secondary view-chapter-btn">View Chapter</button>
            </div>
        `;

        // Асинхронно загружаем сниппеты
        loadSnippets(result);

        return resultItem;
    }

    async function loadSnippets(result) {
        const container = document.getElementById(`snippets-${result.id}`);
        if (!container) return;

        const doc = result;
        const editionSuffix = EDITION_SUFFIX_MAP[doc.edition] || '.md';
        const markdownPath = `../${doc.bookId}/chapters/${doc.chapterId}/${doc.chapterId}${editionSuffix}`;

        try {
            // Проверяем кэш
            let content = contentCache[doc.id];
            if (!content) {
                const response = await fetch(markdownPath);
                if (!response.ok) throw new Error('Failed to load');
                content = await response.text();
                contentCache[doc.id] = content;
            }

            const snippets = extractSnippets(content, result, currentQuery);
            container.innerHTML = snippets;
        } catch (error) {
            container.innerHTML = '<div class="error">Could not load snippets</div>';
        }
    }

    function extractSnippets(fullMarkdown, result, query) {
        const plainText = stripMarkdownForSnippet(fullMarkdown);
        const terms = tokenizeQuery(query);
        
        if (terms.length === 0) {
            return `<div class="snippet">${plainText.substring(0, 200)}...</div>`;
        }

        // Находим все вхождения терминов
        const allMatches = [];
        const lowerText = plainText.toLowerCase();
        
        for (const term of terms) {
            let startIndex = 0;
            while (true) {
                const index = lowerText.indexOf(term, startIndex);
                if (index === -1 || allMatches.length >= 5) break;
                allMatches.push({ start: index, end: index + term.length });
                startIndex = index + 1;
            }
        }

        if (allMatches.length === 0) {
            return `<div class="snippet">${plainText.substring(0, 200)}...</div>`;
        }

        // Создаем сниппеты из найденных совпадений
        const snippets = allMatches.slice(0, 3).map(match => {
            const snippet = extractContext(plainText, match, 120);
            return highlightTerms(snippet, query);
        });

        return snippets.map((s, i) => `<div class="snippet">${i > 0 ? '...' : ''}${s}</div>`).join('');
    }

    function extractContext(text, position, contextLength = 100) {
        const start = Math.max(0, position.start - contextLength);
        const end = Math.min(text.length, position.end + contextLength);
        let snippet = text.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';
        return snippet;
    }

    function highlightTerms(text, query) {
        const terms = tokenizeQuery(query);
        if (terms.length === 0) return text;

        // Сортируем по длине (длинные сначала) чтобы избежать вложенных тегов
        const sortedTerms = [...new Set(terms)].sort((a, b) => b.length - a.length);
        
        let highlighted = text;
        for (const term of sortedTerms) {
            const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        }
        
        return highlighted;
    }

    function stripMarkdownForSnippet(markdown) {
        if (!markdown) return '';
        return markdown
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/^(#+\s.*)$/gm, ' ')
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '')
            .replace(/^>\s?.*$/gm, ' ')
            .replace(/^(\s*(-|\*|\d+\.))\s/gm, ' ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        // Previous button
        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'button button-secondary';
            prevBtn.textContent = '← Prev';
            prevBtn.addEventListener('click', () => {
                currentPage--;
                performSearch(currentQuery, false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(prevBtn);
        }

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.className = 'button button-secondary';
            firstBtn.textContent = '1';
            firstBtn.addEventListener('click', () => {
                currentPage = 1;
                performSearch(currentQuery, false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `button ${i === currentPage ? 'button-primary' : 'button-secondary'}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                performSearch(currentQuery, false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(pageBtn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'ellipsis';
                ellipsis.textContent = '...';
                pagination.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.className = 'button button-secondary';
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener('click', () => {
                currentPage = totalPages;
                performSearch(currentQuery, false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(lastBtn);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'button button-secondary';
            nextBtn.textContent = 'Next →';
            nextBtn.addEventListener('click', () => {
                currentPage++;
                performSearch(currentQuery, false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pagination.appendChild(nextBtn);
        }

        paginationContainer.appendChild(pagination);
    }

    // ==================== MODAL ====================

    resultsContainer.addEventListener('click', async (e) => {
        // View Chapter button
        if (e.target.classList.contains('view-chapter-btn')) {
            const resultItem = e.target.closest('.result-item');
            if (resultItem) {
                openModal(resultItem.dataset, currentQuery);
            }
        }
        
        // Click on result item itself
        const resultItem = e.target.closest('.result-item');
        if (resultItem && !e.target.classList.contains('button')) {
            openModal(resultItem.dataset, currentQuery);
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

        // Проверяем кэш
        if (contentCache[data.docId]) {
            displayModalContent(contentCache[data.docId], query);
        } else {
            fetch(markdownPath)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.text();
                })
                .then(text => {
                    contentCache[data.docId] = text;
                    displayModalContent(text, query);
                })
                .catch(error => {
                    modalBody.innerHTML = `<div class="error">Could not load chapter content.<br><small>Error: ${error.message}</small></div>`;
                    modal.style.display = 'block';
                });
        }
    }

    function displayModalContent(markdown, query) {
        let highlightedText = markdown;
        if (query) {
            const terms = tokenizeQuery(query);
            const sortedTerms = [...new Set(terms)].sort((a, b) => b.length - a.length);
            sortedTerms.forEach(term => {
                const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
            });
        }

        const baseUrlForAssets = `../books/`;
        modalBody.innerHTML = marked.parse(highlightedText, { baseUrl: baseUrlForAssets });
        modal.style.display = 'block';
        modalBody.scrollTop = 0;
    }

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // ==================== URL QUERY HANDLING ====================

    function handleUrlQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            searchInput.value = query;
            performSearch(query);
        } else {
            resultsContainer.innerHTML = '<div class="info">Enter a search query above to begin searching.</div>';
        }
    }

    // ==================== EVENT LISTENERS ====================

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query.length >= 2) performSearch(query);
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query.length >= 2) performSearch(query);
        }
    });

    // Debounced search при вводе
    let searchTimeout;
    searchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        const query = event.target.value.trim();
        
        if (query.length >= 3) {
            searchTimeout = setTimeout(() => performSearch(query), 500);
        } else if (query.length === 0) {
            resultsContainer.innerHTML = '<div class="info">Enter a search query above to begin searching.</div>';
            resultsInfo.textContent = '';
            paginationContainer.innerHTML = '';
        }
    });

    // ==================== INITIALIZATION ====================

    loadIndex();
});
