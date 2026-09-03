/**
 * Spotlight Search 2.0 UI Controller & Hybrid Search Engine
 * Human Book Titles, Rich Thematic Topic Emojis & Deduplicated Multi-Book Select
 * Starley Medical Library
 */

(function () {
  const STOP_WORDS = new Set([
    // English Stopwords
    'to','this','the','a','an','and','or','in','on','at','for','of','with','by','from','is','are','was','were',
    'be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must',
    'can','that','these','those','it','its','what','which','who','whom','when','where','why','how','not','no',
    'so','if','then','than','too','very','just','about','above','below','between','into','through','during','before','after','out','up','down','over','under',
    // Russian Stopwords
    'и','на','в','с','по','за','из','к','о','от','до','для','при','обе','бы','же','ли','так','или','но','а','у','со','об','это','как','все','также','что'
  ]);

  class SearchUI {
    constructor() {
      this.worker = null;
      this.currentQuery = '';
      this.selectedCategories = new Set(); // Empty Set = All Topics
      this.selectedBooks = new Set();      // Empty Set = All Books
      this.currentLang = 'all';
      this.results = [];
      this.selectedIndex = 0;
      this.debounceTimer = null;
      this.isWorkerReady = false;
      this.contentCache = {};

      // Fallback Main Thread Data
      this.searchIndexData = null;
      this.searchConfigData = null;
      this.thesaurusData = null;
      this.isFallbackReady = false;

      this.initDOM();
      this.initEngine();
      this.bindEvents();
    }

    initDOM() {
      this.searchInput = document.getElementById('search-input') || document.getElementById('searchInput');
      this.resultsPane = document.getElementById('spotlight-results-pane') || document.getElementById('resultsContainer');
      this.previewPane = document.getElementById('spotlight-preview-pane');

      this.statusBadge = document.getElementById('search-status-badge');
      this.statusIcon = document.getElementById('search-status-icon');
      this.statusText = document.getElementById('search-status-text') || document.getElementById('resultsInfo');

      // Multi-Select Elements: Topics
      this.topicMultiBtn = document.getElementById('topic-multi-btn');
      this.topicMultiLabel = document.getElementById('topic-multi-label');
      this.topicMultiPopover = document.getElementById('topic-multi-popover');
      this.topicCheckboxesList = document.getElementById('topic-checkboxes-list');
      this.topicSelectAll = document.getElementById('topic-select-all');
      this.topicClearAll = document.getElementById('topic-clear-all');

      // Multi-Select Elements: Books
      this.bookMultiBtn = document.getElementById('book-multi-btn');
      this.bookMultiLabel = document.getElementById('book-multi-label');
      this.bookMultiPopover = document.getElementById('book-multi-popover');
      this.bookCheckboxesList = document.getElementById('book-checkboxes-list');
      this.bookSelectAll = document.getElementById('book-select-all');
      this.bookClearAll = document.getElementById('book-clear-all');

      this.langSelect = document.getElementById('filter-lang');
      this.filterChips = document.querySelectorAll('.spotlight-chip');

      // Mobile & Navigation Elements
      this.tabResults = document.getElementById('tab-results');
      this.tabPreview = document.getElementById('tab-preview');
      this.hudGrid = document.querySelector('.spotlight-hud-grid');
      this.countBadge = document.getElementById('results-count-badge');
      this.btnBackReader = document.getElementById('btn-back-reader');
    }

    initEngine() {
      let workerCreated = false;

      if (window.Worker && location.protocol !== 'file:') {
        try {
          this.worker = new Worker('./search-worker.js');
          this.worker.postMessage({ type: 'INIT', baseUrl: './' });

          this.worker.onmessage = (e) => {
            const { type, results, query, documentCount, config, message } = e.data;

            if (type === 'READY') {
              this.isWorkerReady = true;
              this.searchConfigData = config;
              this.populateCategoryMultiSelect(config);
              this.populateBookMultiSelect();
              this.updateStatusText(`Ready (${documentCount} chapters)`, false);
              if (this.searchInput && this.searchInput.value.trim()) {
                this.performSearch(this.searchInput.value);
              }
            } else if (type === 'RESULTS') {
              if (query === this.currentQuery) {
                this.results = results || [];
                this.selectedIndex = 0;
                this.renderResults();
              }
            } else if (type === 'ERROR') {
              console.warn('[SearchUI] Worker error, switching to Main Thread engine:', message);
              this.initFallbackEngine();
            }
          };

          workerCreated = true;
        } catch (err) {
          console.warn('[SearchUI] Web Worker blocked, using Main Thread engine:', err);
        }
      }

      if (!workerCreated) {
        this.initFallbackEngine();
      }
    }

    async initFallbackEngine() {
      this.updateStatusText('Loading search index...', true);
      try {
        const [indexRes, configRes, thesaurusRes] = await Promise.all([
          fetch('./search-index.json'),
          fetch('./search-config.json').catch(() => null),
          fetch('./thesaurus.json').catch(() => null)
        ]);

        if (!indexRes.ok) {
          throw new Error(`HTTP ${indexRes.status} loading search-index.json`);
        }

        this.searchIndexData = await indexRes.json();
        if (configRes && configRes.ok) {
          this.searchConfigData = await configRes.json();
        }
        if (thesaurusRes && thesaurusRes.ok) {
          this.thesaurusData = await thesaurusRes.json();
        }

        this.isFallbackReady = true;
        const docs = this.searchIndexData.documents || this.searchIndexData.items || [];
        this.populateCategoryMultiSelect(this.searchConfigData);
        this.populateBookMultiSelect();
        this.updateStatusText(`Ready (${docs.length} chapters indexed)`, false);

        if (this.searchInput && this.searchInput.value.trim()) {
          this.performSearch(this.searchInput.value);
        }
      } catch (err) {
        console.error('[SearchUI MainThread Engine Error]', err);
        this.updateStatusText('Error loading search index', false);
      }
    }

    populateCategoryMultiSelect(config) {
      if (!this.topicCheckboxesList || !config || !config.categories) return;

      let html = '';
      Object.entries(config.categories).forEach(([key, cat]) => {
        const checked = this.selectedCategories.has(key) ? 'checked' : '';
        html += `
          <label class="multi-checkbox-item">
            <input type="checkbox" value="${key}" ${checked}>
            <span>${cat.icon || '🏷️'} ${escapeHtml(cat.title)}</span>
          </label>
        `;
      });

      this.topicCheckboxesList.innerHTML = html;
      this.updateTopicLabel();
    }

    populateBookMultiSelect() {
      if (!this.bookCheckboxesList || !this.searchConfigData || !this.searchConfigData.books) return;

      let html = '';
      const selectedCatsArray = Array.from(this.selectedCategories);
      const seenBookTitles = new Set();

      Object.entries(this.searchConfigData.books).forEach(([bookPath, book]) => {
        const bookTitle = book.title || bookPath.split('/').pop();
        if (seenBookTitles.has(bookTitle)) return; // DEDUPLICATE BY FULL TITLE
        seenBookTitles.add(bookTitle);

        const bookCat = (book.category || '').toLowerCase().replace(/-/g, '_');

        // Show book if no category selected OR if book matches one of selected categories
        const matchesCategory = selectedCatsArray.length === 0 || selectedCatsArray.some(c => c === bookCat || bookPath.includes(c));

        if (matchesCategory) {
          const checked = this.selectedBooks.has(bookPath) ? 'checked' : '';
          html += `
            <label class="multi-checkbox-item">
              <input type="checkbox" value="${escapeHtml(bookPath)}" ${checked}>
              <span>📖 ${escapeHtml(bookTitle)}</span>
            </label>
          `;
        }
      });

      this.bookCheckboxesList.innerHTML = html || '<div style="padding:8px; font-size:0.8rem; opacity:0.6;">No books in selected topics</div>';

      // Prune books that are no longer visible
      const visibleBookPaths = new Set(Array.from(this.bookCheckboxesList.querySelectorAll('input[type="checkbox"]')).map(i => i.value));
      Array.from(this.selectedBooks).forEach(b => {
        if (!visibleBookPaths.has(b)) {
          this.selectedBooks.delete(b);
        }
      });

      this.updateBookLabel();
    }

    updateTopicLabel() {
      if (!this.topicMultiLabel) return;
      const count = this.selectedCategories.size;
      if (count === 0) {
        this.topicMultiLabel.textContent = 'All Topics';
      } else if (count === 1) {
        const singleKey = Array.from(this.selectedCategories)[0];
        const cat = this.searchConfigData?.categories?.[singleKey];
        const title = cat?.title || singleKey;
        const icon = cat?.icon || '🏷️';
        this.topicMultiLabel.textContent = `${icon} ${title}`;
      } else {
        this.topicMultiLabel.textContent = `🏷️ Topics (${count})`;
      }
    }

    updateBookLabel() {
      if (!this.bookMultiLabel) return;
      const count = this.selectedBooks.size;
      if (count === 0) {
        this.bookMultiLabel.textContent = 'All Books';
      } else if (count === 1) {
        const singlePath = Array.from(this.selectedBooks)[0];
        const title = this.searchConfigData?.books?.[singlePath]?.title || singlePath.split('/').pop();
        this.bookMultiLabel.textContent = `📖 ${title}`;
      } else {
        this.bookMultiLabel.textContent = `📖 Books (${count})`;
      }
    }

    updateStatusText(msg, isSearching = false) {
      if (this.statusText) {
        this.statusText.textContent = msg;
      }

      if (this.statusBadge) {
        this.statusBadge.classList.toggle('is-searching', isSearching);
      }

      if (this.statusIcon) {
        if (isSearching) {
          this.statusIcon.className = 'fas fa-spinner fa-spin';
        } else {
          this.statusIcon.className = 'fas fa-check-circle';
        }
      }
    }

    switchMobileTab(tab) {
      if (this.tabResults && this.tabPreview && this.hudGrid) {
        if (tab === 'preview') {
          this.tabResults.classList.remove('is-active');
          this.tabPreview.classList.add('is-active');
          this.hudGrid.classList.add('show-mobile-preview');
        } else {
          this.tabResults.classList.add('is-active');
          this.tabPreview.classList.remove('is-active');
          this.hudGrid.classList.remove('show-mobile-preview');
        }
      }
    }

    bindEvents() {
      // Back to Reader Button
      if (this.btnBackReader) {
        this.btnBackReader.addEventListener('click', (e) => {
          e.preventDefault();
          const lastUrl = sessionStorage.getItem('last_reader_url');
          if (lastUrl) {
            window.location.href = lastUrl;
          } else {
            window.location.href = '../reader.html';
          }
        });
      }

      // Topic Multi-Select Popover Toggle
      if (this.topicMultiBtn) {
        this.topicMultiBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = this.topicMultiPopover.style.display !== 'none';
          this.topicMultiPopover.style.display = isOpen ? 'none' : 'flex';
          if (this.bookMultiPopover) this.bookMultiPopover.style.display = 'none';
        });
      }

      // Book Multi-Select Popover Toggle
      if (this.bookMultiBtn) {
        this.bookMultiBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = this.bookMultiPopover.style.display !== 'none';
          this.bookMultiPopover.style.display = isOpen ? 'none' : 'flex';
          if (this.topicMultiPopover) this.topicMultiPopover.style.display = 'none';
        });
      }

      // Close Popovers on Click Outside
      document.addEventListener('click', (e) => {
        if (this.topicMultiPopover && !e.target.closest('#topic-multi-dropdown')) {
          this.topicMultiPopover.style.display = 'none';
        }
        if (this.bookMultiPopover && !e.target.closest('#book-multi-dropdown')) {
          this.bookMultiPopover.style.display = 'none';
        }
      });

      // Topic Checkboxes Change Event
      if (this.topicCheckboxesList) {
        this.topicCheckboxesList.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
            const val = e.target.value;
            if (e.target.checked) {
              this.selectedCategories.add(val);
            } else {
              this.selectedCategories.delete(val);
            }
            this.updateTopicLabel();
            this.populateBookMultiSelect();

            if (this.filterChips) {
              this.filterChips.forEach(c => {
                const chipFilter = c.dataset.filter || 'all';
                c.classList.toggle('is-active', chipFilter === 'all' ? this.selectedCategories.size === 0 : this.selectedCategories.has(chipFilter));
              });
            }

            this.performSearch(this.currentQuery);
          }
        });
      }

      // Topic Select All / Clear All
      if (this.topicSelectAll) {
        this.topicSelectAll.addEventListener('click', () => {
          if (this.topicCheckboxesList) {
            this.topicCheckboxesList.querySelectorAll('input[type="checkbox"]').forEach(i => {
              i.checked = true;
              this.selectedCategories.add(i.value);
            });
            this.updateTopicLabel();
            this.populateBookMultiSelect();
            this.performSearch(this.currentQuery);
          }
        });
      }
      if (this.topicClearAll) {
        this.topicClearAll.addEventListener('click', () => {
          if (this.topicCheckboxesList) {
            this.topicCheckboxesList.querySelectorAll('input[type="checkbox"]').forEach(i => {
              i.checked = false;
            });
            this.selectedCategories.clear();
            this.updateTopicLabel();
            this.populateBookMultiSelect();
            this.performSearch(this.currentQuery);
          }
        });
      }

      // Book Checkboxes Change Event
      if (this.bookCheckboxesList) {
        this.bookCheckboxesList.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
            const val = e.target.value;
            if (e.target.checked) {
              this.selectedBooks.add(val);
            } else {
              this.selectedBooks.delete(val);
            }
            this.updateBookLabel();
            this.performSearch(this.currentQuery);
          }
        });
      }

      // Book Select All / Clear All
      if (this.bookSelectAll) {
        this.bookSelectAll.addEventListener('click', () => {
          if (this.bookCheckboxesList) {
            this.bookCheckboxesList.querySelectorAll('input[type="checkbox"]').forEach(i => {
              i.checked = true;
              this.selectedBooks.add(i.value);
            });
            this.updateBookLabel();
            this.performSearch(this.currentQuery);
          }
        });
      }
      if (this.bookClearAll) {
        this.bookClearAll.addEventListener('click', () => {
          if (this.bookCheckboxesList) {
            this.bookCheckboxesList.querySelectorAll('input[type="checkbox"]').forEach(i => {
              i.checked = false;
            });
            this.selectedBooks.clear();
            this.updateBookLabel();
            this.performSearch(this.currentQuery);
          }
        });
      }

      // Filter Chips Click Event
      if (this.filterChips) {
        this.filterChips.forEach(chip => {
          chip.addEventListener('click', () => {
            this.filterChips.forEach(c => c.classList.remove('is-active'));
            chip.classList.add('is-active');

            const filterVal = chip.dataset.filter || 'all';
            this.selectedCategories.clear();

            if (filterVal !== 'all') {
              this.selectedCategories.add(filterVal);
            }

            this.populateCategoryMultiSelect(this.searchConfigData);
            this.populateBookMultiSelect();
            this.performSearch(this.currentQuery);
          });
        });
      }

      if (this.langSelect) {
        this.langSelect.addEventListener('change', (e) => {
          this.currentLang = e.target.value;
          this.performSearch(this.currentQuery);
        });
      }

      if (this.tabResults) {
        this.tabResults.addEventListener('click', () => this.switchMobileTab('results'));
      }
      if (this.tabPreview) {
        this.tabPreview.addEventListener('click', () => this.switchMobileTab('preview'));
      }

      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          clearTimeout(this.debounceTimer);
          const val = e.target.value;
          this.debounceTimer = setTimeout(() => {
            this.performSearch(val);
          }, 150);
        });
      }

      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (this.searchInput) {
            this.searchInput.focus();
            this.searchInput.select();
          }
        } else if (e.key === 'ArrowDown') {
          if (this.results.length > 0) {
            e.preventDefault();
            this.selectedIndex = Math.min(this.results.length - 1, this.selectedIndex + 1);
            this.updateSelection();
          }
        } else if (e.key === 'ArrowUp') {
          if (this.results.length > 0) {
            e.preventDefault();
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.updateSelection();
          }
        } else if (e.key === 'Enter') {
          if (this.results[this.selectedIndex]) {
            e.preventDefault();
            this.navigateToResult(this.results[this.selectedIndex]);
          }
        } else if (e.key === 'Escape') {
          if (this.searchInput) {
            this.searchInput.blur();
          }
        }
      });

      if (this.resultsPane) {
        this.resultsPane.addEventListener('mouseover', (e) => {
          const item = e.target.closest('.spotlight-item');
          if (item && item.dataset.index !== undefined) {
            const idx = parseInt(item.dataset.index, 10);
            if (idx !== this.selectedIndex) {
              this.selectedIndex = idx;
              this.updateSelection(false);
            }
          }
        });

        this.resultsPane.addEventListener('click', (e) => {
          const item = e.target.closest('.spotlight-item');
          const expandBtn = e.target.closest('.spotlight-expand-btn');

          if (expandBtn) {
            e.stopPropagation();
            const card = expandBtn.closest('.spotlight-item');
            if (card) {
              const accordion = card.querySelector('.spotlight-mobile-accordion');
              if (accordion) {
                const isExpanded = accordion.classList.toggle('is-open');
                expandBtn.textContent = isExpanded ? '▲ Hide' : '▼ Preview';
                if (isExpanded) {
                  const idx = parseInt(card.dataset.index, 10);
                  this.loadMobileAccordionSnippet(card, this.results[idx]);
                }
              }
            }
            return;
          }

          if (item && item.dataset.index !== undefined) {
            const idx = parseInt(item.dataset.index, 10);
            if (this.results[idx]) {
              this.selectedIndex = idx;
              this.updateSelection(true);
              if (window.innerWidth < 768) {
                this.switchMobileTab('preview');
              }
            }
          }
        });
      }
    }

    performSearch(query) {
      this.currentQuery = (query || '').trim();
      if (!this.currentQuery) {
        this.results = [];
        this.renderResults();
        return;
      }

      this.updateStatusText(`Searching for "${this.currentQuery}"...`, true);

      const categoryFilter = this.selectedCategories.size > 0 ? Array.from(this.selectedCategories) : 'all';
      const bookFilter = this.selectedBooks.size > 0 ? Array.from(this.selectedBooks) : 'all';

      if (this.isWorkerReady && this.worker) {
        this.worker.postMessage({
          type: 'SEARCH',
          query: this.currentQuery,
          category: categoryFilter,
          book: bookFilter,
          lang: this.currentLang
        });
      } else if (this.isFallbackReady) {
        setTimeout(() => {
          this.executeMainThreadSearch();
        }, 10);
      }
    }

    executeMainThreadSearch() {
      if (!this.searchIndexData) return;
      const docs = this.searchIndexData.documents || this.searchIndexData.items || [];
      const cleanQuery = stripDiacritics(this.currentQuery.toLowerCase().replace(/[^\w\s\u0400-\u04FF\u0590-\u05FF-]/g, ' ').trim());
      const allTokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);

      if (allTokens.length === 0) {
        this.results = [];
        this.renderResults();
        return;
      }

      const sigTokens = allTokens.length > 2 ? allTokens.filter(t => !STOP_WORDS.has(t) && t.length > 2) : allTokens;
      const evalTokens = sigTokens.length > 0 ? sigTokens : allTokens;
      const expandedTokens = expandTokens(evalTokens, this.thesaurusData);
      const matched = [];

      const categoryFilterArray = Array.from(this.selectedCategories);
      const bookFilterArray = Array.from(this.selectedBooks);

      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];

        // Language Filter
        if (this.currentLang !== 'all') {
          const docLang = (doc.l || doc.lang || doc.e || '').toLowerCase();
          if (this.currentLang === 'russian' && !['russian', 'ru'].includes(docLang)) continue;
          if (this.currentLang === 'english' && !['english', 'en', 'original'].includes(docLang)) continue;
          if (this.currentLang === 'hebrew' && !['hebrew', 'he'].includes(docLang)) continue;
        }

        // Multi-Book Filter
        if (bookFilterArray.length > 0) {
          if (!bookFilterArray.includes(doc.b)) continue;
        }

        // Multi-Topic Embedded Category Filter (doc.cat)
        if (categoryFilterArray.length > 0) {
          const docCat = (doc.cat || '').toLowerCase().replace(/-/g, '_');
          const docB = (doc.b || '').toLowerCase();
          const isMatch = categoryFilterArray.some(cat => {
            const normCat = cat.toLowerCase().replace(/-/g, '_');
            return docCat === normCat || docB.includes(normCat) || docB.includes(cat.replace(/_/g, '-'));
          });
          if (!isMatch) continue;
        }

        const bookTitle = stripDiacritics((doc.bt || doc.title || '').toLowerCase());
        const chapterTitle = stripDiacritics((doc.ct || doc.heading || '').toLowerCase());
        const wordsMap = doc.w || {};

        let score = 0;
        let matchedWords = new Set();
        let primaryMatchTerm = '';
        let matchedSigCount = 0;

        evalTokens.forEach(token => {
          let found = false;
          if (bookTitle.includes(token)) {
            score += 200;
            found = true;
          }
          if (chapterTitle.includes(token)) {
            score += 150;
            found = true;
          }

          for (const [word, count] of Object.entries(wordsMap)) {
            const cleanWord = stripDiacritics(word.toLowerCase());
            if (cleanWord === token) {
              score += (Math.min(count, 4) * 35) + (token.length * 4);
              found = true;
              matchedWords.add(word);
              if (!primaryMatchTerm) primaryMatchTerm = word;
            } else if (cleanWord.includes(token)) {
              score += (Math.min(count, 3) * 10) + token.length;
              found = true;
              matchedWords.add(word);
              if (!primaryMatchTerm) primaryMatchTerm = word;
            }
          }

          if (found) {
            matchedSigCount++;
            if (!primaryMatchTerm) primaryMatchTerm = token;
          }
        });

        expandedTokens.forEach(expToken => {
          if (!evalTokens.includes(expToken)) {
            if (bookTitle.includes(expToken)) score += 40;
            if (chapterTitle.includes(expToken)) score += 30;

            for (const [word, count] of Object.entries(wordsMap)) {
              const cleanWord = stripDiacritics(word.toLowerCase());
              if (cleanWord.includes(expToken)) {
                score += (Math.min(count, 3) * 6);
                matchedWords.add(word);
                if (!primaryMatchTerm) primaryMatchTerm = word;
              }
            }
          }
        });

        if (score > 0 && matchedSigCount > 0) {
          if (evalTokens.length > 1) {
            const ratio = matchedSigCount / evalTokens.length;
            score = score * Math.pow(ratio, 3.5);

            if (matchedSigCount === evalTokens.length) {
              score += 5000;
            }
            if (bookTitle.includes(cleanQuery) || chapterTitle.includes(cleanQuery)) {
              score += 15000;
            }
          }

          let sourceId = 'Book';
          if (doc.b) {
            const parts = doc.b.split('/');
            sourceId = parts[parts.length - 1].toUpperCase();
          }

          matched.push({
            id: doc.id,
            bookId: doc.b,
            chapterId: doc.c,
            title: doc.bt || 'Book Chapter',
            heading: doc.ct || `Chapter ${doc.c}`,
            edition: doc.e || 'original',
            lang: doc.l || 'english',
            score: Math.round(score),
            matchedWords: Array.from(matchedWords),
            matchTerm: primaryMatchTerm || evalTokens[0],
            queryPhrase: cleanQuery,
            sourceId: sourceId
          });
        }
      }

      matched.sort((a, b) => b.score - a.score);
      this.results = matched.slice(0, 60);
      this.selectedIndex = 0;
      this.renderResults();
    }

    renderResults() {
      if (!this.resultsPane) return;

      if (this.countBadge) {
        this.countBadge.textContent = this.results.length;
      }

      if (!this.currentQuery) {
        this.resultsPane.innerHTML = `
          <div class="spotlight-empty">
            <i class="fas fa-search" style="font-size:2.2rem; opacity:0.3; margin-bottom:10px;"></i>
            <p>Type keywords to search across books, journals & quizzes...</p>
          </div>`;
        if (this.previewPane) {
          this.previewPane.innerHTML = `<div class="spotlight-preview-placeholder">Select a result to inspect live snippet preview</div>`;
        }
        this.updateStatusText('Ready', false);
        return;
      }

      if (this.results.length === 0) {
        this.resultsPane.innerHTML = `
          <div class="spotlight-empty">
            <i class="fas fa-exclamation-circle" style="font-size:2.2rem; opacity:0.3; margin-bottom:10px;"></i>
            <p>No results found for "${escapeHtml(this.currentQuery)}"</p>
            <div style="font-size:0.8rem; margin-top:6px; opacity:0.7;">Try resetting Topic or Book filters</div>
          </div>`;
        if (this.previewPane) {
          this.previewPane.innerHTML = `<div class="spotlight-preview-placeholder">No matching content found</div>`;
        }
        this.updateStatusText(`0 results for "${this.currentQuery}"`, false);
        return;
      }

      this.updateStatusText(`Found ${this.results.length} results`, false);

      let html = '';
      this.results.forEach((item, index) => {
        const isSelected = index === this.selectedIndex;
        const scorePercent = Math.min(100, Math.max(15, Math.round((item.score / 150) * 100)));
        const langBadge = (item.lang || item.edition || 'en').toUpperCase().slice(0, 2);

        html += `
          <div class="spotlight-item ${isSelected ? 'is-selected' : ''}" data-index="${index}">
            <div class="spotlight-item-header">
              <div class="spotlight-item-badges">
                <span class="spotlight-badge badge-source">${escapeHtml(item.sourceId)}</span>
                <span class="spotlight-badge badge-lang">${langBadge}</span>
              </div>
              <div class="spotlight-score-bar" title="Relevance Score: ${item.score}">
                <div class="spotlight-score-fill" style="width: ${scorePercent}%;"></div>
              </div>
            </div>
            <h4 class="spotlight-item-title">${highlightMatch(escapeHtml(item.title), this.currentQuery)}</h4>
            <div class="spotlight-item-heading">${highlightMatch(escapeHtml(item.heading), this.currentQuery)}</div>
            <button class="spotlight-expand-btn">▼ Preview</button>
            <div class="spotlight-mobile-accordion">
              <div class="spotlight-snippet-box">Loading snippet...</div>
            </div>
          </div>
        `;
      });

      this.resultsPane.innerHTML = html;
      this.renderPreview(this.results[this.selectedIndex]);
    }

    updateSelection(scrollList = true) {
      const items = this.resultsPane.querySelectorAll('.spotlight-item');
      items.forEach((item, idx) => {
        const selected = idx === this.selectedIndex;
        item.classList.toggle('is-selected', selected);
        if (selected && scrollList) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });

      if (this.results[this.selectedIndex]) {
        this.renderPreview(this.results[this.selectedIndex]);
      }
    }

    async fetchMarkdownContent(item) {
      if (!item) return '';
      if (this.contentCache[item.id]) {
        return this.contentCache[item.id];
      }

      const editionSuffixes = {
        'original': '.md',
        'russian': '-ru.md',
        'hebrew': '-he.md',
        'starley': '-starley.md'
      };
      const suffix = editionSuffixes[item.edition] || '.md';
      const relPath = `../${item.bookId}/chapters/${item.chapterId}/${item.chapterId}${suffix}`;

      try {
        const res = await fetch(relPath);
        if (!res.ok) return '';
        const text = await res.text();
        this.contentCache[item.id] = text;
        return text;
      } catch (e) {
        return '';
      }
    }

    async renderPreview(item) {
      if (!this.previewPane || !item) return;

      const langBadge = (item.lang || item.edition || 'en').toUpperCase();
      const targetUrl = this.buildTargetUrl(item);

      this.previewPane.innerHTML = `
        <div class="spotlight-preview-header">
          <div>
            <span class="spotlight-badge badge-source">${escapeHtml(item.sourceId)}</span>
            <span class="spotlight-badge badge-lang">${langBadge}</span>
            <h3 class="spotlight-preview-title">${escapeHtml(item.title)}</h3>
            <div class="spotlight-preview-subtitle">${escapeHtml(item.heading)}</div>
          </div>
        </div>
        <div class="spotlight-preview-body">
          <div class="spotlight-snippet-box"><i class="fas fa-spinner fa-spin"></i> Loading live snippet preview...</div>
        </div>
        <div class="spotlight-preview-footer">
          <a href="${targetUrl}" class="spotlight-jump-btn">Open Chapter in Reader →</a>
        </div>
      `;

      const rawMarkdown = await this.fetchMarkdownContent(item);
      const snippetText = extractSnippetFromMarkdown(rawMarkdown, this.currentQuery || item.matchTerm);

      const snippetBox = this.previewPane.querySelector('.spotlight-snippet-box');
      if (snippetBox) {
        if (snippetText) {
          let renderedHtml = '';
          if (typeof window.marked !== 'undefined') {
            renderedHtml = window.marked.parse(snippetText);
          } else {
            renderedHtml = escapeHtml(snippetText);
          }
          snippetBox.innerHTML = highlightMatch(renderedHtml, this.currentQuery);
        } else {
          snippetBox.innerHTML = `<p>Matched query: <strong>${escapeHtml(this.currentQuery)}</strong>. Click button below to open chapter in reader.</p>`;
        }
      }
    }

    async loadMobileAccordionSnippet(cardEl, item) {
      if (!cardEl || !item) return;
      const accordionBox = cardEl.querySelector('.spotlight-mobile-accordion .spotlight-snippet-box');
      if (!accordionBox) return;

      const rawMarkdown = await this.fetchMarkdownContent(item);
      const snippetText = extractSnippetFromMarkdown(rawMarkdown, this.currentQuery || item.matchTerm);

      if (snippetText) {
        let renderedHtml = '';
        if (typeof window.marked !== 'undefined') {
          renderedHtml = window.marked.parse(snippetText);
        } else {
          renderedHtml = escapeHtml(snippetText);
        }
        accordionBox.innerHTML = highlightMatch(renderedHtml, this.currentQuery);
      } else {
        accordionBox.innerHTML = `<p>Matched query: <strong>${escapeHtml(this.currentQuery)}</strong></p>`;
      }
    }

    buildTargetUrl(item) {
      const editionParam = item.edition ? `&edition=${encodeURIComponent(item.edition)}` : '';
      const hlParam = item.matchTerm ? `&hl=${encodeURIComponent(item.matchTerm)}` : '';
      return `../reader.html?book=${encodeURIComponent(item.bookId)}&chapter=${encodeURIComponent(item.chapterId)}${editionParam}${hlParam}`;
    }

    navigateToResult(item) {
      if (!item) return;
      const targetUrl = this.buildTargetUrl(item);
      window.location.href = targetUrl;
    }
  }

  // Helpers
  function stripDiacritics(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function tokenize(text) {
    if (!text) return [];
    const clean = stripDiacritics(text.toLowerCase())
      .replace(/[^\w\u0400-\u04FF\u0590-\u05FF-]/g, ' ');
    return clean.split(/\s+/).filter(t => t.length > 1);
  }

  function expandTokens(queryTokens, thesaurusData) {
    const expanded = new Set(queryTokens);
    if (thesaurusData && thesaurusData.terms) {
      thesaurusData.terms.forEach(term => {
        const allSynonyms = [
          ...(term.en || []),
          ...(term.ru || []),
          ...(term.he || [])
        ].map(s => stripDiacritics(s.toLowerCase()));

        queryTokens.forEach(token => {
          if (allSynonyms.some(s => s.includes(token) || token.includes(s))) {
            allSynonyms.forEach(syn => {
              tokenize(syn).forEach(st => expanded.add(st));
            });
          }
        });
      });
    }
    return Array.from(expanded);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatch(htmlOrText, query) {
    if (!htmlOrText || !query) return htmlOrText;
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
    const evalTerms = terms.length > 0 ? terms : query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (evalTerms.length === 0) return htmlOrText;

    const pattern = new RegExp(`(${evalTerms.map(t => escapeRegExp(t)).join('|')})`, 'gi');
    return htmlOrText.replace(pattern, '<mark class="spotlight-mark">$1</mark>');
  }

  function extractSnippetFromMarkdown(markdown, query) {
    if (!markdown) return '';

    let cleanMd = markdown
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\|?\s*:?-+:?\s*\|/g, ' ')
      .replace(/\|/g, ' ')
      .replace(/^#+\s+/gm, '')
      .replace(/\s+/g, ' ');

    const lower = cleanMd.toLowerCase();
    const cleanQuery = (query || '').toLowerCase().trim();

    let matchIndex = lower.indexOf(cleanQuery);

    if (matchIndex === -1) {
      const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
      const evalTerms = terms.length > 0 ? terms : cleanQuery.split(/\s+/).filter(t => t.length > 1);
      for (const term of evalTerms) {
        const idx = lower.indexOf(term);
        if (idx !== -1) {
          matchIndex = idx;
          break;
        }
      }
    }

    if (matchIndex === -1) {
      return cleanMd.slice(0, 350) + '...';
    }

    const start = Math.max(0, matchIndex - 140);
    const end = Math.min(cleanMd.length, matchIndex + 220);

    return (start > 0 ? '...' : '') + cleanMd.substring(start, end).trim() + (end < cleanMd.length ? '...' : '');
  }

  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('search-input') || document.getElementById('searchInput')) {
      window.searchUI = new SearchUI();
    }
  });
})();
