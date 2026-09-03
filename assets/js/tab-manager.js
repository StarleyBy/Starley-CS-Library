// assets/js/tab-manager.js
// Multi-Tab Reader System (NeoReader-style parallel reading)

(function(window) {
    'use strict';

    const STORAGE_KEY = 'starley_reader_tabs_v1';
    const MAX_TABS = 4;
    const TAB_COLORS = ['amber', 'blue', 'emerald', 'purple'];
    const TAB_ICONS = ['①', '②', '③', '④'];

    const TabManager = {
        tabs: [],
        activeTabIndex: 0,
        libraryCache: null,

        init(initialBook, initialChapter, initialEdition) {
            this.loadState();
            
            if (!this.tabs || !Array.isArray(this.tabs) || this.tabs.length === 0) {
                this.tabs = [{
                    id: 'tab_' + Date.now() + '_1',
                    bookPath: initialBook,
                    chapterId: initialChapter,
                    edition: initialEdition || 'original',
                    title: 'Book 1',
                    scrollPos: 0,
                    draftNote: ''
                }];
                this.activeTabIndex = 0;
                this.saveState();
            } else {
                // Bounds check
                if (this.activeTabIndex < 0 || this.activeTabIndex >= this.tabs.length) {
                    this.activeTabIndex = 0;
                }
                const activeTab = this.getActiveTab();
                if (initialBook && (activeTab.bookPath !== initialBook || activeTab.chapterId !== initialChapter || activeTab.edition !== initialEdition)) {
                    activeTab.bookPath = initialBook;
                    activeTab.chapterId = initialChapter;
                    activeTab.edition = initialEdition || 'original';
                    this.saveState();
                }
            }

            this.renderHeaderTabs();
            this.syncRadialTabs();
            this.bindEvents();
            this.syncScratchpadWithActiveTab();

            // Save state on scroll (debounced via window listener)
            window.addEventListener('scroll', () => {
                const active = this.getActiveTab();
                if (active) {
                    active.scrollPos = window.scrollY;
                }
            }, { passive: true });

            // Listen for scratchpad input changes
            window.addEventListener('scratchpad:updated', (e) => {
                const active = this.getActiveTab();
                if (active && e.detail && typeof e.detail.text === 'string') {
                    active.draftNote = e.detail.text;
                    this.saveState();
                }
            });
        },

        getActiveTab() {
            return this.tabs[this.activeTabIndex] || this.tabs[0];
        },

        loadState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && Array.isArray(parsed.tabs)) {
                        this.tabs = parsed.tabs;
                        this.activeTabIndex = parsed.activeTabIndex || 0;
                    }
                }
            } catch (e) {
                console.warn('[TabManager] Failed to load tabs from localStorage:', e);
            }
        },

        saveState() {
            try {
                // Ensure current scroll position is recorded
                const active = this.getActiveTab();
                if (active && typeof window.scrollY !== 'undefined') {
                    active.scrollPos = window.scrollY;
                }
                // Save current scratchpad content
                if (window.StarleyOverlayTools && window.StarleyOverlayTools.Scratchpad && window.StarleyOverlayTools.Scratchpad.element) {
                    const textarea = window.StarleyOverlayTools.Scratchpad.element.querySelector('textarea');
                    if (textarea && active) {
                        active.draftNote = textarea.value;
                    }
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    tabs: this.tabs,
                    activeTabIndex: this.activeTabIndex
                }));
            } catch (e) {
                console.warn('[TabManager] Failed to save tabs to localStorage:', e);
            }
        },

        updateActiveTabMeta(bookTitle, chapterId, edition) {
            const active = this.getActiveTab();
            if (!active) return;
            if (bookTitle) active.title = bookTitle;
            if (chapterId) active.chapterId = chapterId;
            if (edition) active.edition = edition;
            this.saveState();
            this.renderHeaderTabs();
            this.syncRadialTabs();
        },

        async switchTab(index) {
            if (index < 0 || index >= this.tabs.length || index === this.activeTabIndex) return;

            // Save active tab state before switching
            this.saveState();

            this.activeTabIndex = index;
            this.saveState();

            const newTab = this.getActiveTab();

            // Update URL without full page reload
            const newUrl = `reader.html?book=${encodeURIComponent(newTab.bookPath)}&chapter=${encodeURIComponent(newTab.chapterId)}&edition=${encodeURIComponent(newTab.edition || 'original')}`;
            window.history.replaceState(null, '', newUrl);

            this.renderHeaderTabs();
            this.syncRadialTabs();
            this.syncScratchpadWithActiveTab();

            // Reload reader content dynamically
            if (typeof window.initReader === 'function') {
                await window.initReader(newTab.bookPath, newTab.chapterId, newTab.edition || 'original');
                if (typeof newTab.scrollPos === 'number') {
                    setTimeout(() => {
                        window.scrollTo({ top: newTab.scrollPos, behavior: 'instant' });
                    }, 100);
                }
            }
        },

        createTab(bookPath, chapterId = 'chapter-01', edition = 'original', bookTitle = 'New Tab') {
            if (this.tabs.length >= MAX_TABS) {
                alert(`Maximum ${MAX_TABS} tabs allowed. Please close a tab first.`);
                return false;
            }

            // Save current state
            this.saveState();

            const newTab = {
                id: 'tab_' + Date.now() + '_' + (this.tabs.length + 1),
                bookPath: bookPath,
                chapterId: chapterId,
                edition: edition,
                title: bookTitle,
                scrollPos: 0,
                draftNote: ''
            };

            this.tabs.push(newTab);
            const newIndex = this.tabs.length - 1;
            this.switchTab(newIndex);
            return true;
        },

        closeTab(index, e) {
            if (e) e.stopPropagation();
            if (this.tabs.length <= 1) {
                alert('At least one tab must remain open.');
                return;
            }

            this.saveState();
            this.tabs.splice(index, 1);

            if (this.activeTabIndex >= this.tabs.length) {
                this.activeTabIndex = this.tabs.length - 1;
            } else if (this.activeTabIndex > index) {
                this.activeTabIndex--;
            }

            this.saveState();
            const active = this.getActiveTab();

            const newUrl = `reader.html?book=${encodeURIComponent(active.bookPath)}&chapter=${encodeURIComponent(active.chapterId)}&edition=${encodeURIComponent(active.edition || 'original')}`;
            window.history.replaceState(null, '', newUrl);

            this.renderHeaderTabs();
            this.syncRadialTabs();
            this.syncScratchpadWithActiveTab();

            if (typeof window.initReader === 'function') {
                window.initReader(active.bookPath, active.chapterId, active.edition || 'original');
            }
        },

        syncScratchpadWithActiveTab() {
            const active = this.getActiveTab();
            if (!active) return;
            if (window.StarleyOverlayTools && window.StarleyOverlayTools.Scratchpad) {
                const sp = window.StarleyOverlayTools.Scratchpad;
                sp.currentNote = active.draftNote || '';
                if (sp.element) {
                    const textarea = sp.element.querySelector('textarea');
                    if (textarea) textarea.value = sp.currentNote;
                }
            }
        },

        renderHeaderTabs() {
            let container = document.getElementById('header-tabs-container');
            if (!container) {
                const headerContent = document.querySelector('.reader-header .header-content');
                if (!headerContent) return;
                container = document.createElement('div');
                container.id = 'header-tabs-container';
                container.className = 'header-tabs-bar';
                headerContent.insertBefore(container, headerContent.children[1] || null);
            }

            let html = '<div class="tabs-scroll-wrapper">';
            this.tabs.forEach((tab, idx) => {
                const isActive = idx === this.activeTabIndex;
                const colorClass = `tab-badge-${TAB_COLORS[idx % TAB_COLORS.length]}`;
                const icon = TAB_ICONS[idx % TAB_ICONS.length];
                const displayTitle = tab.title || `Tab ${idx + 1}`;
                
                html += `
                    <div class="reader-tab-item ${isActive ? 'active' : ''}" data-tab-index="${idx}">
                        <span class="tab-badge ${colorClass}">${icon}</span>
                        <span class="tab-title" title="${this.escapeHtml(displayTitle)}">${this.escapeHtml(displayTitle)}</span>
                        ${this.tabs.length > 1 ? `<button class="tab-close-btn" data-close-index="${idx}" title="Close tab">✕</button>` : ''}
                    </div>
                `;
            });

            if (this.tabs.length < MAX_TABS) {
                html += `
                    <button id="add-tab-btn" class="add-tab-btn" title="Open new tab (${this.tabs.length}/${MAX_TABS})">
                        <i class="fas fa-plus"></i>
                    </button>
                `;
            }
            html += '</div>';

            container.innerHTML = html;
        },

        syncRadialTabs() {
            // Update radial menu trigger/items badge if element exists
            const radialTabTrigger = document.getElementById('radial-tab-trigger');
            if (radialTabTrigger) {
                const badge = TAB_ICONS[this.activeTabIndex % TAB_ICONS.length];
                radialTabTrigger.setAttribute('data-tab-count', this.tabs.length);
                radialTabTrigger.innerHTML = `<span class="radial-tab-num">${badge}</span>`;
            }

            // Sync radial tab popup items
            const pickerList = document.getElementById('radial-tab-picker-list');
            if (pickerList) {
                let html = '';
                this.tabs.forEach((tab, idx) => {
                    const isActive = idx === this.activeTabIndex;
                    const color = TAB_COLORS[idx % TAB_COLORS.length];
                    const icon = TAB_ICONS[idx % TAB_ICONS.length];
                    html += `
                        <div class="radial-tab-opt ${isActive ? 'active' : ''}" data-tab-index="${idx}">
                            <span class="tab-circle-icon bg-${color}">${icon}</span>
                            <span class="tab-opt-title">${this.escapeHtml(tab.title || 'Tab ' + (idx + 1))}</span>
                            ${isActive ? '<span class="active-check">✓</span>' : ''}
                            ${this.tabs.length > 1 ? `<button class="tab-opt-close" data-close-index="${idx}">✕</button>` : ''}
                        </div>
                    `;
                });
                if (this.tabs.length < MAX_TABS) {
                    html += `
                        <button id="radial-new-tab-btn" class="radial-new-tab-btn">
                            <i class="fas fa-plus-circle"></i> Open New Tab...
                        </button>
                    `;
                }
                pickerList.innerHTML = html;
            }
        },

        bindEvents() {
            // Header tab click delegation
            document.addEventListener('click', (e) => {
                const closeBtn = e.target.closest('.tab-close-btn, .tab-opt-close');
                if (closeBtn) {
                    const idx = parseInt(closeBtn.dataset.closeIndex, 10);
                    if (!isNaN(idx)) {
                        this.closeTab(idx, e);
                    }
                    return;
                }

                const tabItem = e.target.closest('.reader-tab-item, .radial-tab-opt');
                if (tabItem && !e.target.closest('.tab-close-btn, .tab-opt-close')) {
                    const idx = parseInt(tabItem.dataset.tabIndex, 10);
                    if (!isNaN(idx)) {
                        this.switchTab(idx);
                        // Close radial menu if open
                        if (window.RadialMenu && typeof window.RadialMenu.closeAll === 'function') {
                            window.RadialMenu.closeAll();
                        }
                    }
                    return;
                }

                const addBtn = e.target.closest('#add-tab-btn, #radial-new-tab-btn');
                if (addBtn) {
                    if (window.RadialMenu && typeof window.RadialMenu.closeAll === 'function') {
                        window.RadialMenu.closeAll();
                    }
                    this.openQuickBookModal();
                    return;
                }
            });
        },

        async openQuickBookModal() {
            if (this.tabs.length >= MAX_TABS) {
                alert(`Maximum ${MAX_TABS} tabs reached. Close an existing tab first.`);
                return;
            }

            let modal = document.getElementById('quick-book-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'quick-book-modal';
                modal.className = 'quick-book-modal';
                modal.innerHTML = `
                    <div class="qb-backdrop"></div>
                    <div class="qb-box">
                        <div class="qb-header">
                            <h3><i class="fas fa-book"></i> Select Book for New Tab</h3>
                            <button class="qb-close-btn">✕</button>
                        </div>
                        <div class="qb-search-bar">
                            <input type="text" id="qb-search-input" placeholder="Search books by title, discipline, author..." autocomplete="off">
                        </div>
                        <div id="qb-book-list" class="qb-book-list">
                            <div class="qb-loading"><i class="fas fa-spinner fa-spin"></i> Loading library...</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelector('.qb-backdrop').addEventListener('click', () => this.closeQuickBookModal());
                modal.querySelector('.qb-close-btn').addEventListener('click', () => this.closeQuickBookModal());
                
                const searchInput = modal.querySelector('#qb-search-input');
                searchInput.addEventListener('input', (e) => {
                    this.renderQuickBookList(e.target.value.trim());
                });
            }

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            if (!this.libraryCache) {
                try {
                    const res = await fetch('library.json?t=' + Date.now());
                    if (res.ok) {
                        this.libraryCache = await res.json();
                    }
                } catch (e) {
                    console.error('[TabManager] Failed to fetch library.json:', e);
                }
            }

            this.renderQuickBookList('');
            setTimeout(() => {
                modal.querySelector('#qb-search-input')?.focus();
            }, 100);
        },

        closeQuickBookModal() {
            const modal = document.getElementById('quick-book-modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        },

        renderQuickBookList(query) {
            const container = document.getElementById('qb-book-list');
            if (!container) return;

            if (!this.libraryCache || !Array.isArray(this.libraryCache)) {
                container.innerHTML = '<div class="qb-error">Could not load library catalog.</div>';
                return;
            }

            const q = query.toLowerCase();
            const filtered = this.libraryCache.filter(b => {
                if (!q) return true;
                return (b.title && b.title.toLowerCase().includes(q)) ||
                       (b.russian_title && b.russian_title.toLowerCase().includes(q)) ||
                       (b.discipline && b.discipline.toLowerCase().includes(q)) ||
                       (b.author && b.author.toLowerCase().includes(q));
            });

            if (filtered.length === 0) {
                container.innerHTML = '<div class="qb-empty">No books found matching query.</div>';
                return;
            }

            let html = '';
            filtered.forEach(book => {
                const cover = book.cover_image || 'assets/img/book-placeholder.png';
                const title = book.russian_title || book.title || 'Untitled Book';
                const subtitle = book.discipline || book.author || '';

                html += `
                    <div class="qb-book-card" data-book-path="${this.escapeHtml(book.path)}" data-book-title="${this.escapeHtml(title)}">
                        <img src="${this.escapeHtml(cover)}" alt="cover" class="qb-cover" onerror="this.src='assets/img/book-placeholder.png'">
                        <div class="qb-book-info">
                            <div class="qb-book-title">${this.escapeHtml(title)}</div>
                            <div class="qb-book-sub">${this.escapeHtml(subtitle)}</div>
                        </div>
                        <button class="qb-open-btn"><i class="fas fa-plus"></i> Open</button>
                    </div>
                `;
            });

            container.innerHTML = html;

            container.querySelectorAll('.qb-book-card').forEach(card => {
                card.addEventListener('click', () => {
                    const path = card.dataset.bookPath;
                    const title = card.dataset.bookTitle;
                    if (path) {
                        this.closeQuickBookModal();
                        this.createTab(path, 'chapter-01', 'original', title);
                    }
                });
            });
        },

        escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }
    };

    window.TabManager = TabManager;
})(window);
