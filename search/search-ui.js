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
    // Russian Stopwords & Noise words
    'и','на','в','с','по','за','из','к','о','от','до','для','при','обе','бы','же','ли','так','или','но','а','у','со','об','это','как','все','также','что',
    'после','поводу','предмет','отношении','связи','через','между','около','путем','согласно','время','место','целью','случае','относительно','наряду','ряду',
    'данном','данных','который','которая','которое','которые','были','была','было','быть','того','этого','этом','этой','этих'
  ]);

  function stemRussianWord(word) {
    if (!word || typeof word !== 'string' || word.length < 3) return word;
    let w = word.toLowerCase();
    w = w.replace(/(ами|ями|ов|ев|ей|ям|ам|ах|ях|ом|ем|ой|ей|ею|ою|ый|ий|ой|ая|яя|ое|ее|ые|ие|ых|их|ым|им|ыми|ими|ого|его|ому|ему|у|ю|а|я|о|е|и|ы|ь)$/i, '');
    return w.length >= 2 ? w : word;
  }

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

      // Match occurrence counter state
      this.currentMatchIndex = 0;
      this.totalMatchesCount = 0;
      this.currentMatchMarks = [];

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
      this.promptChips = document.querySelectorAll('.spotlight-prompt-chip');

      // Mobile & Navigation Elements
      this.tabResults = document.getElementById('tab-results');
      this.tabPreview = document.getElementById('tab-preview');
      this.hudGrid = document.querySelector('.spotlight-hud-grid');
      this.countBadge = document.getElementById('results-count-badge');
      this.btnBackReader = document.getElementById('btn-back-reader');
      this.btnReindex = document.getElementById('btn-reindex-inventory');
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
              this.updateStatusText(`Inventory ready (${documentCount} items indexed)`, false);
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
        this.updateStatusText(`Inventory ready (${docs.length} items indexed)`, false);

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
        if (seenBookTitles.has(bookTitle)) return;
        seenBookTitles.add(bookTitle);

        const bookCat = (book.category || '').toLowerCase().replace(/-/g, '_');
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
      // Re-index / Inventory Button
      if (this.btnReindex) {
        this.btnReindex.addEventListener('click', (e) => {
          e.preventDefault();
          this.updateStatusText('Re-indexing inventory...', true);
          try {
            indexedDB.deleteDatabase('StarleySearchCache');
          } catch(e) {}
          if (this.worker) {
            this.worker.postMessage({ type: 'INIT', baseUrl: './' });
          } else {
            this.initFallbackEngine();
          }
        });
      }

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

      // Prompt Helper Chips Click Event
      if (this.promptChips) {
        this.promptChips.forEach(chip => {
          chip.addEventListener('click', () => {
            const directive = chip.dataset.prompt;
            if (!directive || !this.searchInput) return;

            let curVal = this.searchInput.value.trim();

            if (directive === 'exact') {
              if (curVal.startsWith('"') && curVal.endsWith('"')) {
                curVal = curVal.slice(1, -1);
              } else {
                curVal = `"${curVal}"`;
              }
            } else if (!curVal.includes(directive)) {
              curVal = `${directive} ${curVal}`.trim();
            }

            this.searchInput.value = curVal;
            this.searchInput.focus();
            this.performSearch(curVal);
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
          if (e.shiftKey) {
            this.navigateMatchPrev();
          } else {
            const activeInput = document.activeElement;
            if (activeInput && activeInput.id === 'search-input') {
              if (this.totalMatchesCount > 0) {
                e.preventDefault();
                this.navigateMatchNext();
              }
            } else if (this.results[this.selectedIndex]) {
              e.preventDefault();
              this.navigateToResult(this.results[this.selectedIndex]);
            }
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

        if (this.currentLang !== 'all') {
          const docLang = (doc.l || doc.lang || doc.e || '').toLowerCase();
          if (this.currentLang === 'russian' && !['russian', 'ru'].includes(docLang)) continue;
          if (this.currentLang === 'english' && !['english', 'en', 'original'].includes(docLang)) continue;
          if (this.currentLang === 'hebrew' && !['hebrew', 'he'].includes(docLang)) continue;
        }

        if (bookFilterArray.length > 0) {
          if (!bookFilterArray.includes(doc.b)) continue;
        }

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
          const stemmedToken = stemRussianWord(token);

          if (bookTitle.includes(token) || (stemmedToken && bookTitle.includes(stemmedToken))) {
            score += 200;
            found = true;
          }
          if (chapterTitle.includes(token) || (stemmedToken && chapterTitle.includes(stemmedToken))) {
            score += 150;
            found = true;
          }

          for (const [word, count] of Object.entries(wordsMap)) {
            const cleanWord = stripDiacritics(word.toLowerCase());
            const cleanStemmedWord = stemRussianWord(cleanWord);

            if (cleanWord === token || (stemmedToken && cleanStemmedWord === stemmedToken)) {
              score += (Math.min(count, 5) * 45) + (token.length * 5);
              found = true;
              matchedWords.add(word);
              if (!primaryMatchTerm) primaryMatchTerm = word;
            } else if (cleanWord.includes(token) || (stemmedToken && cleanWord.includes(stemmedToken))) {
              score += (Math.min(count, 3) * 12) + token.length;
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
            score = score * Math.pow(ratio, 4.0);

            if (matchedSigCount === evalTokens.length) {
              score += 5000;
            }
            if (bookTitle.includes(cleanQuery) || chapterTitle.includes(cleanQuery)) {
              score += 15000;
            }
          }

          let sourceId = doc.type === 'quiz' ? 'QUIZ' : 'Book';
          if (doc.type !== 'quiz' && doc.b) {
            const parts = doc.b.split('/');
            sourceId = parts[parts.length - 1].toUpperCase();
          }

          matched.push({
            id: doc.id,
            type: doc.type || 'book',
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
            sourceId: sourceId,
            quizFile: doc.quizFile || null,
            qId: doc.qId || null,
            qRu: doc.qRu || null,
            qEn: doc.qEn || null,
            optRu: doc.optRu || null,
            optEn: doc.optEn || null,
            ans: doc.ans || null
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
            <p>Type keywords or directives to search chapters & quiz questions...</p>
          </div>`;
        if (this.previewPane) {
          this.previewPane.innerHTML = `<div class="spotlight-preview-placeholder">Select a result to inspect live preview with match counter</div>`;
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
        const isQuiz = item.type === 'quiz' || item.sourceId === 'QUIZ';

        let displayTitle = item.title;
        let displayHeading = item.heading;

        if (isQuiz && item.manifestName && item.qId) {
          displayTitle = `🧠 ${item.manifestName} (ID: ${item.qId})`;
          displayHeading = `${item.heading} — [${item.manifestTitle || 'Quiz'}]`;
        }

        html += `
          <div class="spotlight-item ${isSelected ? 'is-selected' : ''} ${isQuiz ? 'spotlight-quiz-item' : ''}" data-index="${index}">
            <div class="spotlight-item-header">
              <div class="spotlight-item-badges">
                <span class="spotlight-badge ${isQuiz ? 'badge-quiz' : 'badge-source'}">${isQuiz ? '🧠 QUIZ' : escapeHtml(item.sourceId)}</span>
                <span class="spotlight-badge badge-lang">${langBadge}</span>
              </div>
              <div class="spotlight-score-bar" title="Relevance Score: ${item.score}">
                <div class="spotlight-score-fill" style="width: ${scorePercent}%;"></div>
              </div>
            </div>
            <h4 class="spotlight-item-title">${highlightMatch(escapeHtml(displayTitle), this.currentQuery)}</h4>
            <div class="spotlight-item-heading">${highlightMatch(escapeHtml(displayHeading), this.currentQuery)}</div>
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

      const isQuiz = item.type === 'quiz' || item.sourceId === 'QUIZ';
      const langBadge = (item.lang || item.edition || 'en').toUpperCase();
      const targetUrl = this.buildTargetUrl(item);

      let headerTitle = item.title;
      let headerSubTitle = item.heading;

      if (isQuiz && item.manifestName && item.qId) {
        headerTitle = `🧠 ${item.manifestName} (Question ID: ${item.qId})`;
        headerSubTitle = `Manifest Title: ${item.manifestTitle || 'Quiz'}`;
      }

      this.previewPane.innerHTML = `
        <div class="spotlight-preview-header">
          <div style="flex:1;">
            <div class="spotlight-item-badges" style="margin-bottom:6px;">
              <span class="spotlight-badge ${isQuiz ? 'badge-quiz' : 'badge-source'}">${isQuiz ? '🧠 QUIZ' : escapeHtml(item.sourceId)}</span>
              <span class="spotlight-badge badge-lang">${langBadge}</span>
            </div>
            <h3 class="spotlight-preview-title">${escapeHtml(headerTitle)}</h3>
            <div class="spotlight-preview-subtitle">${escapeHtml(headerSubTitle)}</div>
          </div>
          <!-- Real-Time Key Match Counter Toolbar -->
          <div class="spotlight-preview-toolbar">
            <span id="preview-match-counter" class="preview-match-pill">0 из 0</span>
            <div class="preview-nav-btns">
              <button id="btn-match-prev" class="preview-nav-btn" title="Previous Match (Shift+Enter)"><i class="fas fa-chevron-up"></i></button>
              <button id="btn-match-next" class="preview-nav-btn" title="Next Match (Enter)"><i class="fas fa-chevron-down"></i></button>
            </div>
          </div>
        </div>
        <div class="spotlight-preview-body" id="preview-scroll-container">
          <div class="spotlight-snippet-box"><i class="fas fa-spinner fa-spin"></i> Loading live preview...</div>
        </div>
        <div class="spotlight-preview-footer">
          <a href="${targetUrl}" class="spotlight-jump-btn">${isQuiz ? '🧠 Launch Question in Quiz Mode →' : '📖 Open Chapter in Reader →'}</a>
        </div>
      `;

      // Bind Preview Counter Buttons
      const btnPrev = this.previewPane.querySelector('#btn-match-prev');
      const btnNext = this.previewPane.querySelector('#btn-match-next');
      if (btnPrev) btnPrev.addEventListener('click', () => this.navigateMatchPrev());
      if (btnNext) btnNext.addEventListener('click', () => this.navigateMatchNext());

      const bodyContainer = this.previewPane.querySelector('#preview-scroll-container');

      if (isQuiz) {
        this.renderQuizPreview(item, bodyContainer);
      } else {
        const rawMarkdown = await this.fetchMarkdownContent(item);
        if (bodyContainer) {
          if (rawMarkdown) {
            let renderedHtml = typeof window.marked !== 'undefined' ? window.marked.parse(rawMarkdown) : escapeHtml(rawMarkdown);
            bodyContainer.innerHTML = highlightMatch(renderedHtml, this.currentQuery);
            expandParentCollapsibles(bodyContainer);
            this.setupMatchCounter(bodyContainer);
          } else {
            bodyContainer.innerHTML = `<div class="spotlight-snippet-box"><p>Matched query: <strong>${escapeHtml(this.currentQuery)}</strong>. Click button below to open chapter.</p></div>`;
            this.updateMatchCounterDisplay(0, 0);
          }
        }
      }
    }

    renderQuizPreview(item, bodyContainer) {
      if (!bodyContainer) return;

      let html = `<div class="quiz-preview-card">`;

      if (item.manifestName && item.qId) {
        html += `<div style="font-size:0.82rem; font-weight:700; color:var(--spotlight-accent); margin-bottom:8px; padding:4px 8px; background:rgba(var(--spotlight-accent-rgb),0.1); border-radius:6px; display:inline-block;">📂 ${escapeHtml(item.manifestName)} — Question ID: #${item.qId}</div>`;
      }

      if (item.qRu) {
        html += `<div class="quiz-q-section"><strong>🇷🇺 Question:</strong> ${highlightMatch(escapeHtml(item.qRu), this.currentQuery)}</div>`;
      }
      if (item.qEn) {
        html += `<div class="quiz-q-section" style="margin-top:8px;"><strong>🇬🇧 Question:</strong> ${highlightMatch(escapeHtml(item.qEn), this.currentQuery)}</div>`;
      }

      if (item.optRu) {
        html += `<div class="quiz-opt-title" style="margin-top:14px; font-weight:700; font-size:0.85rem; color:var(--spotlight-accent);">Options (RU):</div>`;
        html += `<div class="quiz-opts-list">`;
        Object.entries(item.optRu).forEach(([key, val]) => {
          const isCorrect = key === item.ans ? 'quiz-correct-opt' : '';
          html += `<div class="quiz-opt-item ${isCorrect}"><strong>${key}:</strong> ${highlightMatch(escapeHtml(String(val)), this.currentQuery)}</div>`;
        });
        html += `</div>`;
      }

      if (item.optEn && !item.optRu) {
        html += `<div class="quiz-opt-title" style="margin-top:14px; font-weight:700; font-size:0.85rem; color:var(--spotlight-accent);">Options (EN):</div>`;
        html += `<div class="quiz-opts-list">`;
        Object.entries(item.optEn).forEach(([key, val]) => {
          const isCorrect = key === item.ans ? 'quiz-correct-opt' : '';
          html += `<div class="quiz-opt-item ${isCorrect}"><strong>${key}:</strong> ${highlightMatch(escapeHtml(String(val)), this.currentQuery)}</div>`;
        });
        html += `</div>`;
      }

      html += `</div>`;
      bodyContainer.innerHTML = html;
      expandParentCollapsibles(bodyContainer);
      this.setupMatchCounter(bodyContainer);
    }

    setupMatchCounter(container) {
      if (!container) return;
      mergeAdjacentMarks(container);
      this.currentMatchMarks = Array.from(container.querySelectorAll('mark.spotlight-mark'));
      this.totalMatchesCount = this.currentMatchMarks.length;
      this.currentMatchIndex = 0;

      if (this.totalMatchesCount > 0) {
        this.updateActiveMatchMark();
      } else {
        this.updateMatchCounterDisplay(0, 0);
      }
    }

    updateActiveMatchMark() {
      if (this.totalMatchesCount === 0 || this.currentMatchMarks.length === 0) {
        this.updateMatchCounterDisplay(0, 0);
        return;
      }

      this.currentMatchMarks.forEach((m, idx) => {
        if (idx === this.currentMatchIndex) {
          m.classList.add('is-active');
          expandParentCollapsiblesForNode(m);
          m.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          m.classList.remove('is-active');
        }
      });

      this.updateMatchCounterDisplay(this.currentMatchIndex + 1, this.totalMatchesCount);
    }

    navigateMatchNext() {
      if (this.totalMatchesCount === 0) return;
      this.currentMatchIndex = (this.currentMatchIndex + 1) % this.totalMatchesCount;
      this.updateActiveMatchMark();
    }

    navigateMatchPrev() {
      if (this.totalMatchesCount === 0) return;
      this.currentMatchIndex = (this.currentMatchIndex - 1 + this.totalMatchesCount) % this.totalMatchesCount;
      this.updateActiveMatchMark();
    }

    updateMatchCounterDisplay(curr, total) {
      const counterEl = document.getElementById('preview-match-counter');
      if (counterEl) {
        counterEl.textContent = `${curr} из ${total}`;
        counterEl.style.opacity = total > 0 ? '1' : '0.5';
      }
    }

    async loadMobileAccordionSnippet(cardEl, item) {
      if (!cardEl || !item) return;
      const accordionBox = cardEl.querySelector('.spotlight-mobile-accordion .spotlight-snippet-box');
      if (!accordionBox) return;

      if (item.type === 'quiz' || item.sourceId === 'QUIZ') {
        accordionBox.innerHTML = highlightMatch(escapeHtml(item.qRu || item.qEn || item.heading), this.currentQuery);
        return;
      }

      const rawMarkdown = await this.fetchMarkdownContent(item);
      const snippetText = extractSnippetFromMarkdown(rawMarkdown, this.currentQuery || item.matchTerm);

      if (snippetText) {
        let renderedHtml = typeof window.marked !== 'undefined' ? window.marked.parse(snippetText) : escapeHtml(snippetText);
        accordionBox.innerHTML = highlightMatch(renderedHtml, this.currentQuery);
      } else {
        accordionBox.innerHTML = `<p>Matched query: <strong>${escapeHtml(this.currentQuery)}</strong></p>`;
      }
    }

    buildTargetUrl(item) {
      if (item.type === 'quiz' || item.sourceId === 'QUIZ') {
        const qFile = item.quizFile || 'books/work/examen/quiz/quiz-2020.json';
        return `../quiz.html?quiz=${encodeURIComponent(qFile)}&q=${item.qId || 1}`;
      }

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

  // Helper: Auto-expand parent collapsible <div> / <details> elements containing matches
  function expandParentCollapsibles(container) {
    if (!container) return;
    const marks = container.querySelectorAll('mark.spotlight-mark');
    marks.forEach(mark => expandParentCollapsiblesForNode(mark));
  }

  function expandParentCollapsiblesForNode(node) {
    if (!node) return;
    let curr = node.parentElement;
    while (curr && curr.id !== 'preview-scroll-container' && curr !== document.body) {
      if (curr.tagName && curr.tagName.toLowerCase() === 'details') {
        curr.open = true;
      }
      const collapseClasses = ['collapsed', 'is-collapsed', 'hidden', 'is-hidden', 'section-collapsed', 'topic-collapsed', 'content-collapsed'];
      collapseClasses.forEach(cls => {
        if (curr.classList.contains(cls)) {
          curr.classList.remove(cls);
          curr.classList.add('is-open', 'open', 'expanded');
        }
      });
      if (curr.style) {
        if (curr.style.display === 'none') curr.style.display = 'block';
        if (curr.style.visibility === 'hidden') curr.style.visibility = 'visible';
      }
      curr = curr.parentElement;
    }
  }

  // Helper: Merge adjacent sibling <mark> tags into a single mark tag so multi-word phrases count as 1 match occurrence
  function mergeAdjacentMarks(container) {
    if (!container) return;
    let marks = Array.from(container.querySelectorAll('mark.spotlight-mark'));
    if (marks.length <= 1) return;

    for (let i = 0; i < marks.length - 1; i++) {
      const m1 = marks[i];
      const m2 = marks[i + 1];
      if (!m1 || !m2 || !m1.parentNode || !m2.parentNode) continue;

      if (m1.parentNode === m2.parentNode) {
        let sibling = m1.nextSibling;
        let holdsOnlySpaces = true;
        let nodesToMerge = [];

        while (sibling && sibling !== m2) {
          nodesToMerge.push(sibling);
          if (sibling.nodeType === Node.TEXT_NODE) {
            if (/[^\s,.\-—:]/g.test(sibling.textContent)) {
              holdsOnlySpaces = false;
              break;
            }
          } else {
            holdsOnlySpaces = false;
            break;
          }
          sibling = sibling.nextSibling;
        }

        if (holdsOnlySpaces && sibling === m2) {
          nodesToMerge.forEach(n => m1.appendChild(n));
          while (m2.firstChild) {
            m1.appendChild(m2.firstChild);
          }
          m2.parentNode.removeChild(m2);
          marks[i + 1] = null;
        }
      }
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
    let rawQ = query.replace(/^"|"$/g, '').replace(/\b(type|t):(quiz|book)\b/gi, '').replace(/\bin:(ru|en|he)\b/gi, '').trim();
    const terms = rawQ.toLowerCase().split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
    const evalTerms = terms.length > 0 ? terms : rawQ.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (evalTerms.length === 0) return htmlOrText;

    // First try exact contiguous phrase match if multi-word query
    let result = htmlOrText;
    if (rawQ.includes(' ') && rawQ.length > 3) {
      const phrasePattern = new RegExp(`(${escapeRegExp(rawQ)})`, 'gi');
      if (phrasePattern.test(result)) {
        return result.replace(phrasePattern, '<mark class="spotlight-mark">$1</mark>');
      }
    }

    // Add Russian stemmed terms to match patterns
    const patternTerms = new Set();
    evalTerms.forEach(t => {
      patternTerms.add(t);
      const stemmed = stemRussianWord(t);
      if (stemmed && stemmed.length >= 3) patternTerms.add(stemmed);
    });

    const pattern = new RegExp(`(${Array.from(patternTerms).map(t => escapeRegExp(t)).join('|')})`, 'gi');
    return result.replace(pattern, '<mark class="spotlight-mark">$1</mark>');
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

