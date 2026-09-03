// assets/js/binder-shelf.js - Binder Shelf System (Digital Medical Organizer)

(function () {
    'use strict';

    const CATEGORY_COLORS = {
        'summary': '#9C27B0',
        'icu': '#FF5722',
        'cardiac_surgery': '#E53935',
        'thoracic_surgery': '#009688',
        'cardiology': '#E91E63',
        'anatomy': '#1E88E5',
        'cardiovascular_system': '#00BCD4',
        'cardiac echo': '#43A047',
        'ecg': '#FF9800',
        'drugs': '#795548',
        'guidelines': '#3F51B5',
        'work': '#607D8B',

        /* Extended Categories (Future-proof) */
        'biochemistry': '#00E676',
        'pharmacology': '#FF4081',
        'pathology': '#7C4DFF',
        'pediatrics': '#FFAB00',
        'neurology': '#00E5FF',
        'radiology': '#FF6D00',
        'microbiology': '#AEEA00',
        'genetics': '#D500F9',
        'dermatology': '#FF80AB',
        'surgery': '#FF1744',
        'endocrinology': '#00B0FF',
        'nephrology': '#1DE9B6',
        'pulmonology': '#651FFF'
    };

    const CATEGORY_ICONS = {
        'summary': '⚡',
        'icu': '🏥',
        'cardiac_surgery': '🫀',
        'thoracic_surgery': '🫁',
        'cardiology': '❤️',
        'anatomy': '🦴',
        'cardiovascular_system': '🩸',
        'cardiac echo': '🔊',
        'ecg': '📈',
        'drugs': '💊',
        'guidelines': '📋',
        'work': '🛠️',

        /* Extended Category Icons */
        'biochemistry': '🧬',
        'pharmacology': '🧪',
        'pathology': '🔬',
        'pediatrics': '👶',
        'neurology': '🧠',
        'radiology': '🩻',
        'microbiology': '🦠',
        'genetics': '🧬',
        'dermatology': '🩺',
        'surgery': '🔪',
        'endocrinology': '⚗️',
        'nephrology': '🫘',
        'pulmonology': '🫁'
    };

    function getCategoryColor(catId) {
        if (!catId) return '#3498db';
        const key = catId.toLowerCase().trim();
        if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key];

        // Deterministic HSL color generator for unknown future categories
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 75%, 52%)`;
    }

    function getCategoryIcon(catId) {
        if (!catId) return '📖';
        const key = catId.toLowerCase().trim();
        return CATEGORY_ICONS[key] || '📖';
    }

    class BinderShelfController {
        constructor() {
            this.categories = [];
            this.activeCategoryId = null;
            this.activeBookPath = null;
            this.isInitialized = false;
        }

        init(categoriesData) {
            this.categories = categoriesData || [];
            if (this.categories.length === 0) return;

            const savedTab = localStorage.getItem('starley_binder_tab');
            const validTabExists = this.categories.some(c => c.id === savedTab);
            this.activeCategoryId = validTabExists ? savedTab : this.categories[0].id;

            this.renderLayout();
            this.attachEventListeners();
            this.isInitialized = true;
        }

        renderLayout() {
            const binderView = document.getElementById('binder-shelf-view');
            if (!binderView) return;

            binderView.innerHTML = `
                <aside class="binder-sidebar" role="tablist" aria-label="Medical Disciplines">
                    ${this.renderTabsHtml()}
                </aside>
                <section class="binder-leaf" role="tabpanel" id="binder-leaf-panel">
                    <!-- Leaf Header & Content rendered dynamically -->
                </section>
            `;

            this.selectCategory(this.activeCategoryId, true);
        }

        renderTabsHtml() {
            return this.categories.map(cat => {
                const color = getCategoryColor(cat.id);
                const icon = getCategoryIcon(cat.id);
                const visibleBooks = this.getCategoryBookMetas(cat);
                const count = visibleBooks.length;
                const isActive = cat.id === this.activeCategoryId;

                return `
                    <div class="binder-tab ${isActive ? 'active' : ''}" 
                         role="tab" 
                         aria-selected="${isActive}" 
                         data-category-id="${cat.id}"
                         style="--tab-color: ${color}">
                        <div class="tab-main-info">
                            <span class="tab-icon">${icon}</span>
                            <span class="tab-label">${cat.title}</span>
                        </div>
                        <span class="tab-count">${count}</span>
                    </div>
                `;
            }).join('');
        }

        selectCategory(categoryId, isInitial = false) {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) return;

            this.activeCategoryId = categoryId;
            localStorage.setItem('starley_binder_tab', categoryId);

            // Synchronize Tabs UI
            document.querySelectorAll('.binder-tab').forEach(tab => {
                const isCurrent = tab.dataset.categoryId === categoryId;
                tab.classList.toggle('active', isCurrent);
                tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
            });

            const catColor = getCategoryColor(categoryId);
            const leafPanel = document.getElementById('binder-leaf-panel');
            if (leafPanel) {
                leafPanel.style.setProperty('--active-cat-color', catColor);
                if (!isInitial) {
                    leafPanel.classList.remove('leaf-animate-enter');
                    void leafPanel.offsetWidth; // trigger reflow
                    leafPanel.classList.add('leaf-animate-enter');
                }
            }

            // Select first book in category by default
            const categoryBooks = this.getCategoryBookMetas(category);
            this.activeBookPath = categoryBooks.length > 0 ? categoryBooks[0].path : null;

            this.renderLeafContent(category, categoryBooks);
        }

        getCategoryBookMetas(category) {
            const isAdmin = window.AuthSystem ? window.AuthSystem.isAdmin() : false;
            const books = [];

            if (!category.books) return books;

            for (const book of category.books) {
                const bookPath = `${category.path}/${book.folder}`;
                const meta = window.shelfMetadata ? window.shelfMetadata[bookPath] : null;

                if (meta) {
                    if (meta.visibility === 'admin-only' && !isAdmin) continue;
                    books.push({
                        path: bookPath,
                        folder: book.folder,
                        data: meta.data,
                        visibility: meta.visibility
                    });
                }
            }

            return books;
        }

        renderLeafContent(category, books) {
            const leafPanel = document.getElementById('binder-leaf-panel');
            if (!leafPanel) return;

            const icon = getCategoryIcon(category.id);
            const activeBook = books.find(b => b.path === this.activeBookPath) || (books.length > 0 ? books[0] : null);

            let leftPanelBooksHtml = '';
            if (books.length === 0) {
                leftPanelBooksHtml = `<div class="binder-empty-state"><p>No books available in this section.</p></div>`;
            } else {
                leftPanelBooksHtml = books.map(book => {
                    const isActive = activeBook && book.path === activeBook.path;
                    const meta = book.data || {};
                    const coverImg = meta.cover_image 
                        ? (typeof window.getImageUrl === 'function' ? window.getImageUrl(`${book.path}/${meta.cover_image}`) : `${window.IMAGES_BASE_URL || './'}${book.path}/${meta.cover_image}`) 
                        : 'assets/img/book-placeholder.png';
                    const authors = (meta.authors || []).join(', ');

                    let badgesHtml = '';
                    if (meta.magazine || meta.quiz) {
                        badgesHtml = `<div class="quick-badges">`;
                        if (meta.magazine) badgesHtml += `<a href="magazine.html?book=${book.path}" class="badge-btn summary">⚡ Summary</a>`;
                        if (meta.quiz) badgesHtml += `<a href="quiz.html?book=${book.path}" class="badge-btn quiz">🧠 Quiz</a>`;
                        badgesHtml += `</div>`;
                    }

                    return `
                        <div class="binder-book-card ${isActive ? 'active' : ''}" data-book-path="${book.path}">
                            <img src="${coverImg}" alt="${meta.title}" class="binder-book-cover"
                                 onerror="this.onerror=null; this.src='assets/img/book-placeholder.png';" />
                            <div class="binder-book-info">
                                <h4 class="binder-book-title">${meta.title || 'Untitled'}</h4>
                                <p class="binder-book-authors">${authors}</p>
                                ${badgesHtml}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            const rightPanelTocHtml = activeBook ? this.renderTocRightPanel(activeBook) : `
                <div class="binder-empty-state">
                    <p>Select a book from the list to view its Table of Contents.</p>
                </div>
            `;

            leafPanel.innerHTML = `
                <div class="leaf-header">
                    <div class="leaf-title-group">
                        <span class="leaf-category-badge">${icon} ${category.title}</span>
                    </div>
                    <span style="font-size: 0.85rem; color: var(--binder-text-muted);">${books.length} Books</span>
                </div>
                <div class="leaf-body">
                    <section class="leaf-left-panel">
                        <div class="leaf-panel-title">Library Books</div>
                        ${leftPanelBooksHtml}
                    </section>
                    <section class="leaf-right-panel" id="leaf-toc-root">
                        ${rightPanelTocHtml}
                    </section>
                </div>
            `;
        }

        renderTocRightPanel(book) {
            const meta = book.data || {};
            const chapters = meta.chapters || [];
            const activeColor = getCategoryColor(this.activeCategoryId);
            const firstChapter = chapters.length > 0 ? chapters[0].file.replace('.md', '') : 'chapter-01';

            if (chapters.length === 0) {
                return `
                    <div class="selected-book-header">
                        <h3 class="selected-book-title">${meta.title}</h3>
                        <p class="selected-book-authors">${(meta.authors || []).join(', ')}</p>
                    </div>
                    <div class="binder-empty-state">
                        <p>No chapter structure found.</p>
                        <a href="reader.html?book=${book.path}&chapter=${firstChapter}&theme=${encodeURIComponent(activeColor)}" 
                           class="chapter-direct-btn"
                           data-theme="${activeColor}">📖 Read Book</a>
                    </div>
                `;
            }

            const chaptersHtml = chapters.map((ch, idx) => {
                const chId = ch.file ? ch.file.replace('.md', '') : `chapter-${String(idx+1).padStart(2, '0')}`;
                const chTitle = ch.title || `Chapter ${idx + 1}`;
                const subchapters = ch.subchapters || [];

                let subchaptersHtml = '';
                if (subchapters.length > 0) {
                    subchaptersHtml = `
                        <div class="subchapters-list">
                            ${subchapters.map((sub, sIdx) => {
                                const targetCh = sub.file ? sub.file.replace('.md', '') : chId;
                                const subParam = (sub.id !== undefined && sub.id !== null) ? `&sub=${sub.id}` : '';
                                return `
                                    <a href="reader.html?book=${book.path}&chapter=${targetCh}${subParam}&theme=${encodeURIComponent(activeColor)}" 
                                       class="subchapter-link"
                                       data-book="${book.path}"
                                       data-chapter="${targetCh}"
                                       data-theme="${activeColor}">
                                        <span class="subchapter-bullet">●</span>
                                        <span>${sub.title || `Section ${sIdx + 1}`}</span>
                                    </a>
                                `;
                            }).join('')}
                        </div>
                    `;
                }

                return `
                    <div class="toc-chapter-item">
                        <div class="chapter-header">
                            <span class="chapter-title-text">${chTitle}</span>
                            <a href="reader.html?book=${book.path}&chapter=${chId}&theme=${encodeURIComponent(activeColor)}" 
                               class="chapter-direct-btn"
                               data-book="${book.path}"
                               data-chapter="${chId}"
                               data-theme="${activeColor}">Read Chapter</a>
                        </div>
                        ${subchaptersHtml}
                    </div>
                `;
            }).join('');

            return `
                <div class="selected-book-header">
                    <h3 class="selected-book-title">${meta.title}</h3>
                    <p class="selected-book-authors">${(meta.authors || []).join(', ')}</p>
                </div>
                <div class="toc-chapters-accordion">
                    ${chaptersHtml}
                </div>
            `;
        }

        selectBook(bookPath) {
            this.activeBookPath = bookPath;
            const category = this.categories.find(c => c.id === this.activeCategoryId);
            if (!category) return;

            const categoryBooks = this.getCategoryBookMetas(category);
            const activeBook = categoryBooks.find(b => b.path === bookPath);

            // Update Left Panel Active Card
            document.querySelectorAll('.binder-book-card').forEach(card => {
                card.classList.toggle('active', card.dataset.bookPath === bookPath);
            });

            // Update Right Panel TOC
            const tocRoot = document.getElementById('leaf-toc-root');
            if (tocRoot && activeBook) {
                tocRoot.innerHTML = this.renderTocRightPanel(activeBook);
            }
        }

        attachEventListeners() {
            const binderView = document.getElementById('binder-shelf-view');
            if (!binderView) return;

            binderView.addEventListener('click', (e) => {
                // Tab click
                const tab = e.target.closest('.binder-tab');
                if (tab) {
                    const catId = tab.dataset.categoryId;
                    if (catId && catId !== this.activeCategoryId) {
                        this.selectCategory(catId);
                    }
                    return;
                }

                // Book card click
                const bookCard = e.target.closest('.binder-book-card');
                if (bookCard && !e.target.closest('.badge-btn')) {
                    const bookPath = bookCard.dataset.bookPath;
                    if (bookPath && bookPath !== this.activeBookPath) {
                        this.selectBook(bookPath);
                    }
                    return;
                }

                // Direct chapter / subchapter link click
                const chapterLink = e.target.closest('.chapter-direct-btn, .subchapter-link');
                if (chapterLink) {
                    const themeColor = chapterLink.dataset.theme || getCategoryColor(this.activeCategoryId);
                    sessionStorage.setItem('activeThemeColor', themeColor);
                }
            });
        }
    }

    // Global instance
    window.BinderShelf = new BinderShelfController();

})();
