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
    let viewMode = 'book'; // 'book' или 'all'

    const EDITION_SUFFIX_MAP = {
        'original': '.md',
        'russian': '-ru.md',
        'hebrew': '-he.md',
        'starley': '-starley.md'
    };

    const modal = document.getElementById('chapterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
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

    // View mode toggle
    const viewToggle = document.getElementById('viewToggle');
    const viewByBookBtn = document.getElementById('viewByBook');
    const viewAllBtn = document.getElementById('viewAll');

    viewByBookBtn.addEventListener('click', () => {
        viewMode = 'book';
        viewByBookBtn.classList.add('active');
        viewAllBtn.classList.remove('active');
        if (currentQuery) {
            performSearch(currentQuery, false);
        }
    });

    viewAllBtn.addEventListener('click', () => {
        viewMode = 'all';
        viewAllBtn.classList.add('active');
        viewByBookBtn.classList.remove('active');
        if (currentQuery) {
            performSearch(currentQuery, false);
        }
    });

    // ==================== SEARCH ALGORITHM ====================

    function searchDocument(query, doc) {
        const queryTerms = tokenizeQuery(query);
        if (queryTerms.length === 0) return null;

        let score = 0;
        const matchedTerms = [];
        const totalOccurrences = [];

        // Проверяем совпадения отдельных терминов (только значимые слова)
        for (const term of queryTerms) {
            if (doc.w && doc.w[term]) {
                const count = doc.w[term];
                matchedTerms.push(term);
                totalOccurrences.push(count);
                
                // Бонус за длину совпавшего слова (более длинные слова важнее)
                score += Math.min(15, term.length * 1.5);
            }
        }

        // Если нет совпадений - возвращаем null
        if (matchedTerms.length === 0) {
            return null;
        }

        // Бонус за совпадение ВСЕХ значимых терминов
        if (matchedTerms.length === queryTerms.length) {
            score += 100; // Увеличенный бонус
        }

        // Бонус за совпадение большинства терминов (пропорционально)
        const matchRatio = matchedTerms.length / queryTerms.length;
        score += Math.floor(matchRatio * 50); // Увеличенный бонус

        // TF (term frequency) - плотность совпадений
        const sumOccurrences = totalOccurrences.reduce((a, b) => a + b, 0);
        const termDensity = sumOccurrences / doc.len;
        score += Math.min(30, Math.floor(termDensity * 1000)); // Увеличенный лимит

        // Бонус за короткие документы (более релевантные)
        if (doc.len < 1000) {
            score += 15;
        } else if (doc.len < 3000) {
            score += 10;
        } else if (doc.len < 5000) {
            score += 5;
        }

        return {
            score: Math.round(score * 10) / 10,
            matchedTerms,
            totalOccurrences: sumOccurrences,
            hasAllTerms: matchedTerms.length === queryTerms.length
        };
    }

    // Проверяет наличие точной фразы в тексте и возвращает бонус
    function checkPhraseInText(text, query) {
        const lowerText = text.toLowerCase();
        const terms = tokenizeQuery(query);
        
        // Фильтруем только значимые слова (исключаем стоп-слова уже исключены в tokenizeQuery)
        if (terms.length < 1) return { bonus: 0, type: 'none' };
        
        // Для одиночных слов проверяем обычное вхождение
        if (terms.length === 1) {
            if (lowerText.includes(terms[0])) {
                return { bonus: 100, type: 'single' };
            }
            return { bonus: 0, type: 'none' };
        }
        
        // Для фраз из 2+ слов: проверяем точную фразу (без стоп-слов)
        const exactPhrase = terms.join(' ');
        if (lowerText.includes(exactPhrase)) {
            // Огромный бонус за точное совпадение значимых слов!
            return { bonus: 1000, type: 'exact' };
        }
        
        // Проверяем близость слов (в пределах 3 слов друг от друга)
        // Это очень строгая проверка - слова должны быть рядом
        const escapedTerms = terms.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        
        // Для 2 слов: проверяем близость в пределах 2 слов
        if (terms.length === 2) {
            const proximityRegex = new RegExp(
                escapedTerms[0] + '\\s+(?:\\w+\\s+){0,2}' + escapedTerms[1],
                'i'
            );
            if (proximityRegex.test(lowerText)) {
                return { bonus: 500, type: 'proximity' };
            }
        }
        
        // Для 3+ слов: проверяем что все слова в пределах 5 слов
        if (terms.length >= 3) {
            const proximityRegex = new RegExp(
                escapedTerms.join('\\s+(?:\\w+\\s+){0,5}'),
                'i'
            );
            if (proximityRegex.test(lowerText)) {
                return { bonus: 600, type: 'proximity' };
            }
        }
        
        // Проверяем порядок слов (не обязательно рядом)
        let lastIndex = -1;
        let allInOrder = true;
        for (const term of terms) {
            const index = lowerText.indexOf(term, lastIndex + 1);
            if (index === -1 || index < lastIndex) {
                allInOrder = false;
                break;
            }
            lastIndex = index;
        }
        
        if (allInOrder && terms.length >= 2) {
            return { bonus: 200, type: 'ordered' };
        }
        
        // Если слова есть но не в порядке - маленький бонус
        const allTermsFound = terms.every(term => lowerText.includes(term));
        if (allTermsFound && terms.length >= 2) {
            return { bonus: 100, type: 'scattered' };
        }
        
        return { bonus: 0, type: 'none' };
    }

    async function enhanceResultsWithPhraseSearch(results, query) {
        // Для топ-50 результатов проверяем точные фразы
        const topResults = results.slice(0, 50);
        const enhancements = new Map();
        
        await Promise.all(topResults.map(async (result, index) => {
            const editionSuffix = EDITION_SUFFIX_MAP[result.edition] || '.md';
            const markdownPath = `../${result.bookId}/chapters/${result.chapterId}/${result.chapterId}${editionSuffix}`;
            
            try {
                let content = contentCache[result.docId];
                if (!content) {
                    const response = await fetch(markdownPath);
                    if (!response.ok) return;
                    content = await response.text();
                    contentCache[result.docId] = content;
                }
                
                const phraseResult = checkPhraseInText(content, query);
                if (phraseResult.bonus > 0) {
                    enhancements.set(result.docId, {
                        bonus: phraseResult.bonus,
                        type: phraseResult.type,
                        originalScore: result.score
                    });
                    result.score = Math.round((result.score + phraseResult.bonus) * 10) / 10;
                    result.phraseMatch = phraseResult.type === 'exact' || phraseResult.type === 'proximity';
                    result.phraseType = phraseResult.type;
                }
            } catch (error) {
                // Игнорируем ошибки загрузки
            }
        }));
        
        // Пересортировываем результаты с учетом бонусов
        results.sort((a, b) => b.score - a.score);
        
        return results;
    }

    async function performSearch(query, resetPage = true) {
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
                    docId: doc.id,
                    bookId: doc.b,
                    chapterId: doc.c,
                    chapterTitle: doc.ct || doc.c,
                    bookTitle: doc.bt || doc.b,
                    edition: doc.e,
                    language: doc.l,
                    contentLength: doc.len,
                    words: doc.w,
                    ...searchResult
                });
            }
        }

        // Сортируем по начальному score
        scoredResults.sort((a, b) => b.score - a.score);
        currentResults = scoredResults;

        // Улучшаем результаты фразовым поиском (если запрос содержит 2+ слов)
        if (tokens.length >= 2) {
            showLoading('Checking phrase matches...');
            await enhanceResultsWithPhraseSearch(scoredResults, query);
            hideLoading();
        }

        const endTime = performance.now();
        const searchTime = ((endTime - startTime) / 1000).toFixed(2);

        // Отображаем результаты в зависимости от режима
        if (viewMode === 'book') {
            const groupedResults = groupResultsByBook(scoredResults);
            displayResults(groupedResults, scoredResults.length, searchTime, 'book');
        } else {
            displayResults(scoredResults, scoredResults.length, searchTime, 'all');
        }
    }

    // ==================== DISPLAY RESULTS ====================

    function groupResultsByBook(results) {
        const bookMap = new Map();
        
        for (const result of results) {
            if (!bookMap.has(result.bookId)) {
                bookMap.set(result.bookId, {
                    bookId: result.bookId,
                    bookTitle: result.bookTitle,
                    language: result.language,
                    edition: result.edition,
                    chapters: [],
                    bestScore: result.score
                });
            }
            bookMap.get(result.bookId).chapters.push(result);
        }
        
        // Конвертируем в массив и сортируем по лучшему score в каждой книге
        return Array.from(bookMap.values()).sort((a, b) => b.bestScore - a.bestScore);
    }

    function displayResults(results, totalResults, searchTime, mode) {
        resultsContainer.innerHTML = '';
        
        if (totalResults === 0 || results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <strong>No results found</strong><br>
                    Try different keywords or adjust filters
                </div>
            `;
            resultsInfo.textContent = '0 results';
            paginationContainer.innerHTML = '';
            viewToggle.style.display = 'none';
            return;
        }

        // Показываем toggle только если есть результаты
        viewToggle.style.display = 'flex';

        const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
        const startIdx = (currentPage - 1) * RESULTS_PER_PAGE;
        const endIdx = Math.min(startIdx + RESULTS_PER_PAGE, totalResults);

        resultsInfo.textContent = `Found ${totalResults} results in ${searchTime}s (showing ${startIdx + 1}-${endIdx})`;

        if (mode === 'book') {
            // Режим: группировка по книгам
            let displayedCount = 0;
            for (const bookGroup of results) {
                if (displayedCount >= RESULTS_PER_PAGE) break;
                
                const bookItem = createBookGroupItem(bookGroup);
                resultsContainer.appendChild(bookItem);
                displayedCount++;
            }
        } else {
            // Режим: все результаты подряд
            const pageResults = results.slice(startIdx, endIdx);
            pageResults.forEach(result => {
                const resultItem = createResultItem(result);
                resultsContainer.appendChild(resultItem);
            });
        }

        renderPagination(totalPages);
    }

    function createResultItem(result) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.docId = result.docId;
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
                    ${result.phraseType ? createPhraseBadge(result.phraseType) : ''}
                    <span class="result-score ${result.phraseMatch ? 'phrase-match' : ''}">⭐ ${result.score.toFixed(1)}</span>
                </div>
            </div>
            <div class="result-snippets" id="snippets-${result.docId}">
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
        const container = document.getElementById(`snippets-${result.docId}`);
        if (!container) return;

        const editionSuffix = EDITION_SUFFIX_MAP[result.edition] || '.md';
        const markdownPath = `../${result.bookId}/chapters/${result.chapterId}/${result.chapterId}${editionSuffix}`;

        try {
            let content = contentCache[result.docId];
            if (!content) {
                const response = await fetch(markdownPath);
                if (!response.ok) throw new Error('Failed to load');
                content = await response.text();
                contentCache[result.docId] = content;
            }

            const snippets = extractSnippets(content, result, currentQuery);
            container.innerHTML = snippets;
        } catch (error) {
            container.innerHTML = '<div class="error">Could not load snippets</div>';
        }
    }

    function createPhraseBadge(phraseType) {
        if (!phraseType || phraseType === 'none') return '';
        
        const badges = {
            'exact': '<span class="phrase-badge exact">🎯 Exact Phrase</span>',
            'proximity': '<span class="phrase-badge proximity">📍 Words Nearby</span>',
            'ordered': '<span class="phrase-badge ordered">➡️ In Order</span>',
            'scattered': '<span class="phrase-badge scattered">🔵 All Words Found</span>',
            'single': '<span class="phrase-badge single">✓ Found</span>'
        };
        
        return badges[phraseType] || '';
    }

    function getPhraseSymbol(phraseType) {
        const symbols = {
            'exact': '🎯',
            'proximity': '📍',
            'ordered': '➡️',
            'scattered': '🔵',
            'single': '✓'
        };
        return symbols[phraseType] || '';
    }

    function createBookGroupItem(bookGroup) {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-group';
        
        const bestChapter = bookGroup.chapters[0];
        const chapterCount = bookGroup.chapters.length;
        const maxVisibleChapters = 3;
        
        // Проверяем есть ли фразовые совпадения
        const hasPhraseMatch = bookGroup.chapters.some(ch => ch.phraseMatch);
        
        bookItem.innerHTML = `
            <div class="book-group-header">
                <h3 class="book-title">📚 ${bookGroup.bookTitle}</h3>
                <div class="book-meta">
                    <span class="chapter-count">📄 ${chapterCount} chapter${chapterCount > 1 ? 's' : ''} matched</span>
                    ${hasPhraseMatch ? createPhraseBadge(bestChapter.phraseType) : ''}
                    <span class="result-score ${hasPhraseMatch ? 'phrase-match' : ''}">⭐ ${bookGroup.bestScore.toFixed(1)}</span>
                </div>
            </div>
            <div class="chapter-list">
                ${bookGroup.chapters.slice(0, maxVisibleChapters).map(ch => `
                    <div class="chapter-item" 
                         data-doc-id="${ch.docId}"
                         data-book-id="${ch.bookId}"
                         data-chapter-id="${ch.chapterId}"
                         data-edition="${ch.edition}"
                         data-book-title="${ch.bookTitle}"
                         data-chapter-title="${ch.chapterTitle}">
                        <span class="chapter-title-link">${ch.chapterTitle}</span>
                        <span class="chapter-score ${ch.phraseMatch ? 'phrase-match' : ''}">
                            ⭐ ${ch.score.toFixed(1)}
                            ${ch.phraseType ? getPhraseSymbol(ch.phraseType) : ''}
                        </span>
                    </div>
                `).join('')}
                ${chapterCount > maxVisibleChapters ? `<div class="more-chapters">+${chapterCount - maxVisibleChapters} more chapters in this book...</div>` : ''}
            </div>
            <div class="book-group-snippet"></div>
        `;

        // Загружаем сниппеты для лучшей главы
        if (bookGroup.chapters.length > 0) {
            loadSnippetsForBookGroup(bookItem, bestChapter);
        }

        return bookItem;
    }

    function loadSnippetsForBookGroup(container, result) {
        const editionSuffix = EDITION_SUFFIX_MAP[result.edition] || '.md';
        const markdownPath = `../${result.bookId}/chapters/${result.chapterId}/${result.chapterId}${editionSuffix}`;

        fetch(markdownPath)
            .then(res => res.text())
            .then(content => {
                const snippets = extractSnippets(content, result, currentQuery);
                const snippetContainer = container.querySelector('.book-group-snippet');
                if (snippetContainer) {
                    snippetContainer.innerHTML = snippets;
                }
            })
            .catch(() => {
                const snippetContainer = container.querySelector('.book-group-snippet');
                if (snippetContainer) {
                    snippetContainer.innerHTML = '<div class="error">Could not load preview</div>';
                }
            });
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
        
        // Chapter item в book group
        if (e.target.closest('.chapter-item')) {
            const chapterItem = e.target.closest('.chapter-item');
            openModal(chapterItem.dataset, currentQuery);
        }
        
        // Click on result item itself
        const resultItem = e.target.closest('.result-item');
        if (resultItem && !e.target.classList.contains('button')) {
            openModal(resultItem.dataset, currentQuery);
        }
    });

    // Добавляем обработчик для chapter-item с делегированием
    resultsContainer.addEventListener('click', (e) => {
        const chapterItem = e.target.closest('.chapter-item');
        if (chapterItem) {
            openModal({
                docId: chapterItem.dataset.docId,
                bookId: chapterItem.dataset.bookId,
                chapterId: chapterItem.dataset.chapterId,
                edition: chapterItem.dataset.edition,
                bookTitle: chapterItem.dataset.bookTitle,
                chapterTitle: chapterItem.dataset.chapterTitle
            }, currentQuery);
        }
    });

    function openModal(data, query) {
        modalTitle.textContent = `${data.bookTitle} - ${data.chapterTitle}`;
        modalBody.innerHTML = '<div class="loading"><div class="spinner"></div>Loading chapter content...</div>';

        const readerLink = `../reader.html?book=${data.bookId}&chapter=${data.chapterId}&edition=${data.edition}`;
        
        // Создаем футер с кнопкой и текстом
        const footerHTML = `
            <button class="button button-primary footer-cta-button" onclick="window.open('${readerLink}', '_blank')">
                📖 Open Full Chapter
            </button>
            <div class="modal-footer-text">
                Opens in new tab with full navigation
            </div>
        `;
        
        // Обновляем футер
        const modalFooter = document.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.innerHTML = footerHTML;
        }

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
        
        // Принудительно ограничиваем ширину всего контента
        enforceMobileWidth();
        
        // Раскрываем и подсвечиваем <details> с искомым текстом
        if (query) {
            const highlightedCount = highlightAndOpenDetails(query);
            
            // Показываем информацию о найденных контейнерах
            if (highlightedCount > 0) {
                const infoBar = document.createElement('div');
                infoBar.className = 'search-details-info';
                infoBar.innerHTML = `
                    🔍 <strong>${highlightedCount} section${highlightedCount > 1 ? 's' : ''}</strong> found with search terms. 
                    They are highlighted in green and automatically expanded.
                `;
                modalBody.insertBefore(infoBar, modalBody.firstChild);
            }
        }
        
        modal.style.display = 'block';
        modalBody.scrollTop = 0;
    }

    // Принудительно ограничивает ширину элементов внутри модалки
    function enforceMobileWidth() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        // Принудительно ограничиваем все элементы
        const elements = modalBody.querySelectorAll('*');
        elements.forEach(el => {
            el.style.maxWidth = '100%';
            el.style.boxSizing = 'border-box';
        });

        // Особая обработка для таблиц
        const tables = modalBody.querySelectorAll('table');
        tables.forEach(table => {
            const wrapper = document.createElement('div');
            wrapper.style.overflowX = 'auto';
            wrapper.style.maxWidth = '100%';
            wrapper.style.webkitOverflowScrolling = 'touch';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });

        // Обработка для pre блоков
        const preBlocks = modalBody.querySelectorAll('pre');
        preBlocks.forEach(pre => {
            pre.style.overflowX = 'auto';
            pre.style.maxWidth = '100%';
            pre.style.whiteSpace = 'pre-wrap';
            pre.style.wordWrap = 'break-word';
        });

        // Обработка для изображений
        const images = modalBody.querySelectorAll('img');
        images.forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
        });
    }

    function highlightAndOpenDetails(query) {
        const terms = tokenizeQuery(query);
        if (terms.length === 0) return 0;

        const detailsElements = modalBody.querySelectorAll('details');
        let hasMatchedDetails = false;
        let matchedCount = 0;

        detailsElements.forEach(detailsEl => {
            const detailsContent = detailsEl.querySelector('.details-content') || detailsEl;
            const textContent = detailsContent.textContent.toLowerCase();
            
            // Проверяем есть ли хотя бы один термин в этом details
            const matchedTerms = terms.filter(term => 
                textContent.includes(term.toLowerCase())
            );

            if (matchedTerms.length > 0) {
                hasMatchedDetails = true;
                matchedCount++;
                
                // Раскрываем контейнер
                detailsEl.setAttribute('open', '');
                detailsEl.classList.add('search-highlighted');
                
                // Добавляем информацию о найденных терминах
                const searchTerm = matchedTerms.slice(0, 3).join(', ');
                detailsEl.dataset.searchTerms = searchTerm;

                // Добавляем подсветку к первым вхождениям
                highlightTermsInElement(detailsContent, terms);
            }
        });

        // Если есть подсвеченные details, скроллим к первому
        if (hasMatchedDetails) {
            const firstHighlighted = modalBody.querySelector('details.search-highlighted');
            if (firstHighlighted) {
                setTimeout(() => {
                    firstHighlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }

        return matchedCount;
    }

    function highlightTermsInElement(element, terms) {
        // Находим все текстовые узлы и подсвечиваем термины
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            let modified = false;
            let newText = text;

            terms.forEach(term => {
                const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
                if (regex.test(text)) {
                    newText = newText.replace(regex, '<mark class="details-highlight">$1</mark>');
                    modified = true;
                }
            });

            if (modified) {
                const span = document.createElement('span');
                span.innerHTML = newText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
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
