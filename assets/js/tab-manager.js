// assets/js/tab-manager.js
// Multi-Tab Reader System (4 Numbered Sphere Tabs: 🔴1 🟠2 🟡3 🟢4)

(function(window) {
    'use strict';

    const STORAGE_KEY = 'starley_reader_tabs_v2';
    const MAX_TABS = 4;
    
    const SLOT_CONFIG = [
        { index: 0, num: '1', color: 'red', icon: '🔴', title: 'Tab 1' },
        { index: 1, num: '2', color: 'orange', icon: '🟠', title: 'Tab 2' },
        { index: 2, num: '3', color: 'yellow', icon: '🟡', title: 'Tab 3' },
        { index: 3, num: '4', color: 'green', icon: '🟢', title: 'Tab 4' }
    ];

    const TabManager = {
        tabs: [], // Array of 4 slot objects
        activeTabIndex: 0,
        isExpanded: false,
        catalogLang: 'en', // 'en' | 'ru'
        libraryCategoriesCache: null,
        pendingTargetTabIndex: null,

        init(initialBook, initialChapter, initialEdition) {
            this.loadState();
            
            // Ensure 4 slots exist
            if (!this.tabs || !Array.isArray(this.tabs) || this.tabs.length !== MAX_TABS) {
                this.tabs = SLOT_CONFIG.map((cfg, i) => ({
                    index: i,
                    num: cfg.num,
                    color: cfg.color,
                    occupied: i === 0,
                    bookPath: i === 0 ? initialBook : null,
                    chapterId: i === 0 ? initialChapter : 'chapter-01',
                    edition: i === 0 ? (initialEdition || 'original') : 'original',
                    title: i === 0 ? 'Tab 1' : `Tab ${i + 1}`,
                    scrollPos: 0,
                    draftNote: ''
                }));
                this.activeTabIndex = 0;
                this.saveState();
            } else {
                if (this.activeTabIndex < 0 || this.activeTabIndex >= MAX_TABS) {
                    this.activeTabIndex = 0;
                }
                const active = this.getActiveTab();
                if (!active.occupied && initialBook) {
                    active.occupied = true;
                    active.bookPath = initialBook;
                    active.chapterId = initialChapter;
                    active.edition = initialEdition || 'original';
                } else if (initialBook && (active.bookPath !== initialBook || active.chapterId !== initialChapter || active.edition !== initialEdition)) {
                    active.bookPath = initialBook;
                    active.chapterId = initialChapter;
                    active.edition = initialEdition || 'original';
                }
                this.saveState();
            }

            this.renderHeaderTabs();
            this.syncRadialTabs();
            this.bindEvents();
            this.syncScratchpadWithActiveTab();

            window.addEventListener('scroll', () => {
                const active = this.getActiveTab();
                if (active && active.occupied) {
                    active.scrollPos = window.scrollY;
                }
            }, { passive: true });

            window.addEventListener('scratchpad:updated', (e) => {
                const active = this.getActiveTab();
                if (active && active.occupied && e.detail && typeof e.detail.text === 'string') {
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
                    if (parsed && Array.isArray(parsed.tabs) && parsed.tabs.length === MAX_TABS) {
                        this.tabs = parsed.tabs;
                        this.activeTabIndex = parsed.activeTabIndex || 0;
                        this.catalogLang = parsed.catalogLang || 'en';
                    }
                }
            } catch (e) {
                console.warn('[TabManager] Failed to load tabs from localStorage:', e);
            }
        },

        saveState() {
            try {
                const active = this.getActiveTab();
                if (active && active.occupied && typeof window.scrollY !== 'undefined') {
                    active.scrollPos = window.scrollY;
                }
                if (window.StarleyOverlayTools && window.StarleyOverlayTools.Scratchpad && window.StarleyOverlayTools.Scratchpad.element) {
                    const textarea = window.StarleyOverlayTools.Scratchpad.element.querySelector('textarea');
                    if (textarea && active && active.occupied) {
                        active.draftNote = textarea.value;
                    }
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    tabs: this.tabs,
                    activeTabIndex: this.activeTabIndex,
                    catalogLang: this.catalogLang
                }));
            } catch (e) {
                console.warn('[TabManager] Failed to save tabs to localStorage:', e);
            }
        },

        updateActiveTabMeta(bookTitle, chapterId, edition) {
            const active = this.getActiveTab();
            if (!active) return;
            active.occupied = true;
            if (bookTitle) active.title = bookTitle;
            if (chapterId) active.chapterId = chapterId;
            if (edition) active.edition = edition;
            this.saveState();
            this.renderHeaderTabs();
            this.syncRadialTabs();
        },

        async switchTab(index) {
            if (index < 0 || index >= MAX_TABS) return;

            const targetTab = this.tabs[index];
            if (!targetTab.occupied) {
                // Open book picker for this empty tab slot
                this.pendingTargetTabIndex = index;
                this.openQuickBookModal();
                return;
            }

            this.saveState();
            this.activeTabIndex = index;
            this.isExpanded = false;
            this.saveState();

            const newUrl = `reader.html?book=${encodeURIComponent(targetTab.bookPath)}&chapter=${encodeURIComponent(targetTab.chapterId)}&edition=${encodeURIComponent(targetTab.edition || 'original')}`;
            window.history.replaceState(null, '', newUrl);

            this.renderHeaderTabs();
            this.syncRadialTabs();
            this.syncScratchpadWithActiveTab();

            if (typeof window.initReader === 'function') {
                await window.initReader(targetTab.bookPath, targetTab.chapterId, targetTab.edition || 'original');
                if (typeof targetTab.scrollPos === 'number') {
                    setTimeout(() => {
                        window.scrollTo({ top: targetTab.scrollPos, behavior: 'instant' });
                    }, 100);
                }
            }
        },

        closeTab(index, e) {
            if (e) e.stopPropagation();
            const occupiedCount = this.tabs.filter(t => t.occupied).length;
            if (occupiedCount <= 1 && this.tabs[index].occupied) {
                alert('At least one tab must remain open.');
                return;
            }

            this.saveState();
            const tab = this.tabs[index];
            tab.occupied = false;
            tab.bookPath = null;
            tab.chapterId = 'chapter-01';
            tab.title = `Tab ${index + 1}`;
            tab.scrollPos = 0;
            tab.draftNote = '';

            // If we closed the currently active tab, find another occupied tab
            if (this.activeTabIndex === index) {
                const nextOccupied = this.tabs.find(t => t.occupied);
                if (nextOccupied) {
                    this.switchTab(nextOccupied.index);
                    return;
                }
            }

            this.saveState();
            this.renderHeaderTabs();
            this.syncRadialTabs();
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

            const active = this.getActiveTab();

            let html = `
                <div class="sphere-single-wrapper">
                    <button class="sphere-tab-btn active sphere-${active.color}" id="toggle-spheres-btn" title="Tab ${active.num} active. Click to open tabs menu">
                        <span class="sphere-num">${active.num}</span>
                    </button>
            `;

            if (this.isExpanded) {
                html += `
                    <div class="spheres-vertical-dropdown">
                        <div class="spheres-dropdown-header">
                            <span>Parallel Tabs</span>
                            <button id="collapse-spheres-btn" class="spheres-close-x">✕</button>
                        </div>
                        <div class="spheres-dropdown-list">
                `;

                this.tabs.forEach((t, i) => {
                    const isActive = i === this.activeTabIndex;
                    const isOccupied = t.occupied;
                    const color = t.color;
                    const num = t.num;
                    
                    html += `
                        <div class="sphere-dropdown-row ${isActive ? 'is-active' : ''} ${!isOccupied ? 'is-empty' : ''}" data-sphere-index="${i}">
                            <button class="sphere-tab-btn sphere-${color} ${isActive ? 'active' : ''}">
                                <span class="sphere-num">${num}</span>
                                ${!isOccupied ? '<span class="sphere-empty-plus">+</span>' : ''}
                            </button>
                            <div class="sphere-row-info">
                                <div class="sphere-row-title">${isOccupied ? this.escapeHtml(t.title || 'Book') : 'Empty (Click to open)'}</div>
                            </div>
                            ${isOccupied && this.tabs.filter(x => x.occupied).length > 1 ? `<button class="sphere-close-btn" data-close-index="${i}" title="Close tab ${num}">✕</button>` : ''}
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
            container.innerHTML = html;
        },

        syncRadialTabs() {
            // Radial menu tab item removed per user request
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                const toggleBtn = e.target.closest('#toggle-spheres-btn');
                if (toggleBtn) {
                    this.isExpanded = !this.isExpanded;
                    this.renderHeaderTabs();
                    return;
                }

                const collapseBtn = e.target.closest('#collapse-spheres-btn');
                if (collapseBtn) {
                    this.isExpanded = false;
                    this.renderHeaderTabs();
                    return;
                }

                const closeBtn = e.target.closest('.sphere-close-btn, .radial-sphere-close');
                if (closeBtn) {
                    const idx = parseInt(closeBtn.dataset.closeIndex, 10);
                    if (!isNaN(idx)) {
                        this.closeTab(idx, e);
                    }
                    return;
                }

                const sphereBtn = e.target.closest('[data-sphere-index]');
                if (sphereBtn && !e.target.closest('.sphere-close-btn, .radial-sphere-close')) {
                    const idx = parseInt(sphereBtn.dataset.sphereIndex, 10);
                    if (!isNaN(idx)) {
                        this.switchTab(idx);
                        if (window.RadialMenu && typeof window.RadialMenu.closeAll === 'function') {
                            window.RadialMenu.closeAll();
                        }
                    }
                    return;
                }

                // Close expanded sphere pill when clicking outside header-tabs-bar
                if (this.isExpanded && !e.target.closest('#header-tabs-container')) {
                    this.isExpanded = false;
                    this.renderHeaderTabs();
                }
            });
        },

        async openQuickBookModal() {
            let modal = document.getElementById('quick-book-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'quick-book-modal';
                modal.className = 'quick-book-modal';
                modal.innerHTML = `
                    <div class="qb-backdrop"></div>
                    <div class="qb-box">
                        <div class="qb-header">
                            <h3><i class="fas fa-book-open"></i> Select Book for Tab</h3>
                            <div class="qb-header-actions">
                                <div class="qb-lang-toggle">
                                    <button class="qb-lang-btn ${this.catalogLang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 EN</button>
                                    <button class="qb-lang-btn ${this.catalogLang === 'ru' ? 'active' : ''}" data-lang="ru">🇷🇺 RU</button>
                                </div>
                                <button class="qb-close-btn">✕</button>
                            </div>
                        </div>
                        <div class="qb-search-bar">
                            <input type="text" id="qb-search-input" placeholder="Search by title, discipline, author..." autocomplete="off">
                        </div>
                        <div id="qb-book-list" class="qb-book-list">
                            <div class="qb-loading"><i class="fas fa-spinner fa-spin"></i> Loading catalog...</div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.querySelector('.qb-backdrop').addEventListener('click', () => this.closeQuickBookModal());
                modal.querySelector('.qb-close-btn').addEventListener('click', () => this.closeQuickBookModal());

                modal.querySelectorAll('.qb-lang-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        this.catalogLang = btn.dataset.lang;
                        modal.querySelectorAll('.qb-lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === this.catalogLang));
                        this.saveState();
                        const searchVal = modal.querySelector('#qb-search-input')?.value || '';
                        this.renderQuickBookList(searchVal.trim());
                    });
                });

                const searchInput = modal.querySelector('#qb-search-input');
                searchInput.addEventListener('input', (e) => {
                    this.renderQuickBookList(e.target.value.trim());
                });
            }

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            if (!this.libraryCategoriesCache) {
                try {
                    const rawBase = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
                    const res = await fetch(`${rawBase}library.json?t=${Date.now()}`);
                    if (res.ok) {
                        const data = await res.json();
                        const categories = data.categories || [];
                        const processedCategories = [];

                        for (const cat of categories) {
                            if (!cat.books || cat.books.length === 0) continue;
                            const categoryBooks = [];
                            for (const b of cat.books) {
                                const bookPath = `${cat.path}/${b.folder}`;
                                try {
                                    const metaRes = await fetch(`${rawBase}${bookPath}/metadata.json?t=${Date.now()}`);
                                    const metaArr = metaRes.ok ? await metaRes.json() : null;
                                    const meta = (metaArr && metaArr[0]) ? metaArr[0] : {};
                                    let cover = meta.cover_image || '';
                                    if (typeof window.getImageUrl === 'function') {
                                        cover = window.getImageUrl(`${bookPath}/${cover || 'cover.jpg'}`);
                                    } else if (cover && !cover.startsWith('http') && !cover.startsWith('/')) {
                                        cover = `${rawBase}${bookPath}/${cover}`;
                                    }

                                    categoryBooks.push({
                                        path: bookPath,
                                        title: meta.title || b.folder,
                                        russian_title: meta.russian_title || meta.title || b.folder,
                                        discipline: cat.title || '',
                                        author: meta.author || '',
                                        cover_image: cover || 'assets/img/book-placeholder.png'
                                    });
                                } catch (err) {
                                    categoryBooks.push({
                                        path: bookPath,
                                        title: b.folder,
                                        russian_title: b.folder,
                                        discipline: cat.title || '',
                                        author: '',
                                        cover_image: 'assets/img/book-placeholder.png'
                                    });
                                }
                            }
                            if (categoryBooks.length > 0) {
                                processedCategories.push({
                                    id: cat.id,
                                    title: cat.title,
                                    books: categoryBooks
                                });
                            }
                        }
                        this.libraryCategoriesCache = processedCategories;
                    }
                } catch (e) {
                    console.error('[TabManager] Failed to fetch library catalog:', e);
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
            this.pendingTargetTabIndex = null;
        },

        getCategoryIcon(catId, title) {
            const id = (catId || '').toLowerCase();
            const t = (title || '').toLowerCase();
            if (id.includes('cardiac') || t.includes('cardiac')) return '<i class="fas fa-heart-pulse text-rose"></i>';
            if (id.includes('icu') || t.includes('intensive')) return '<i class="fas fa-notes-medical text-amber"></i>';
            if (id.includes('thoracic') || t.includes('thoracic')) return '<i class="fas fa-lungs text-sky"></i>';
            if (id.includes('anatomy') || t.includes('anatomy')) return '<i class="fas fa-bone text-emerald"></i>';
            if (id.includes('ecg') || t.includes('ecg')) return '<i class="fas fa-wave-square text-purple"></i>';
            return '<i class="fas fa-book-medical text-sky"></i>';
        },

        renderQuickBookList(query) {
            const container = document.getElementById('qb-book-list');
            if (!container) return;

            if (!this.libraryCategoriesCache || !Array.isArray(this.libraryCategoriesCache)) {
                container.innerHTML = '<div class="qb-error">Could not load library catalog.</div>';
                return;
            }

            const q = query.toLowerCase();
            const isRu = this.catalogLang === 'ru';
            let totalMatchCount = 0;
            let html = '';

            this.libraryCategoriesCache.forEach((cat) => {
                const matchingBooks = cat.books.filter(b => {
                    if (!q) return true;
                    return (b.title && b.title.toLowerCase().includes(q)) ||
                           (b.russian_title && b.russian_title.toLowerCase().includes(q)) ||
                           (b.discipline && b.discipline.toLowerCase().includes(q)) ||
                           (b.author && b.author.toLowerCase().includes(q));
                });

                if (matchingBooks.length > 0) {
                    totalMatchCount += matchingBooks.length;
                    const catIcon = this.getCategoryIcon(cat.id, cat.title);

                    html += `
                        <div class="qb-category-section">
                            <div class="qb-category-banner">
                                <span class="qb-cat-banner-title">${catIcon} ${this.escapeHtml(cat.title)}</span>
                                <span class="qb-cat-banner-count">${matchingBooks.length} ${matchingBooks.length === 1 ? 'book' : 'books'}</span>
                            </div>
                            <div class="qb-tile-grid">
                    `;

                    matchingBooks.forEach(book => {
                        const displayTitle = isRu ? (book.russian_title || book.title) : book.title;
                        const cover = book.cover_image || 'assets/img/book-placeholder.png';
                        const subtitle = book.author || book.discipline || '';

                        html += `
                            <div class="qb-book-tile" data-book-path="${this.escapeHtml(book.path)}" data-book-title="${this.escapeHtml(displayTitle)}">
                                <div class="qb-tile-cover-wrapper">
                                    <img src="${this.escapeHtml(cover)}" alt="cover" class="qb-tile-cover" onerror="this.onerror=null;this.src='assets/img/book-placeholder.png'">
                                    <div class="qb-tile-hover-overlay"><i class="fas fa-plus"></i> Open</div>
                                </div>
                                <div class="qb-tile-info">
                                    <div class="qb-tile-title" title="${this.escapeHtml(displayTitle)}">${this.escapeHtml(displayTitle)}</div>
                                    ${subtitle ? `<div class="qb-tile-sub" title="${this.escapeHtml(subtitle)}">${this.escapeHtml(subtitle)}</div>` : ''}
                                </div>
                            </div>
                        `;
                    });

                    html += `
                            </div>
                        </div>
                    `;
                }
            });

            if (totalMatchCount === 0) {
                container.innerHTML = '<div class="qb-empty">No books match query.</div>';
                return;
            }

            container.innerHTML = html;

            container.querySelectorAll('.qb-book-tile').forEach(tile => {
                tile.addEventListener('click', () => {
                    const path = tile.dataset.bookPath;
                    const title = tile.dataset.bookTitle;
                    if (path) {
                        const targetIdx = this.pendingTargetTabIndex !== null ? this.pendingTargetTabIndex : this.activeTabIndex;
                        this.closeQuickBookModal();
                        
                        const targetTab = this.tabs[targetIdx];
                        targetTab.occupied = true;
                        targetTab.bookPath = path;
                        targetTab.chapterId = 'chapter-01';
                        targetTab.edition = 'original';
                        targetTab.title = title;
                        targetTab.scrollPos = 0;
                        targetTab.draftNote = '';

                        this.switchTab(targetIdx);
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
