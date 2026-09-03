// assets/js/app.js

// Определяем правильный URL для изображений в зависимости от среды
let IMAGES_BASE_URL = './';

if (window.location.hostname.includes('github.io')) {
    const pathParts = window.location.pathname.split('/');
    const repoName = pathParts[1];
    if (repoName && !repoName.includes('.')) {
        IMAGES_BASE_URL = `./`;
    } else {
        IMAGES_BASE_URL = './';
    }
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    IMAGES_BASE_URL = './';
} else {
    IMAGES_BASE_URL = './';
}

// --- Favorites & Recents Logic ---
let shelfMetadata = {}; // path -> { data, visibility }

function getFavorites() {
    try { 
        const favsStr = localStorage.getItem('starley_favorites');
        if (favsStr === null) {
            const oldFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
            localStorage.setItem('starley_favorites', JSON.stringify(oldFavs));
            return oldFavs;
        }
        return JSON.parse(favsStr) || [];
    } catch (e) { 
        return []; 
    }
}

function toggleFavorite(bookPath) {
    let favs = getFavorites();
    let isActive = false;
    
    if (favs.includes(bookPath)) {
        favs = favs.filter(p => p !== bookPath);
        isActive = false;
    } else {
        favs.push(bookPath);
        isActive = true;
    }
    localStorage.setItem('starley_favorites', JSON.stringify(favs));
    
    // Синхронизируем все видимые карточки этой книги (и на полке, и в категориях)
    document.querySelectorAll(`.book-card[data-book-path="${bookPath}"]`).forEach(card => {
        card.classList.toggle('favorite-book', isActive);
        const btn = card.querySelector('.fav-btn');
        if (btn) btn.classList.toggle('active', isActive);
    });

    // Если открыта вкладка избранного — обновляем её (книга могла быть удалена)
    const favTab = document.querySelector('.shelf-tab[data-tab="favorites"]');
    if (favTab && favTab.classList.contains('active')) {
        setTimeout(() => renderFavoritesTab(), 10);
    }
    
    return isActive;
}

function renderLibraryShelf() {
    return `
        <section class="shelf-container">
            <div class="shelf-tabs">
                <div class="shelf-tab active" data-tab="recents">🕒 Recently Read</div>
                <div class="shelf-tab" data-tab="favorites">⭐ Favorites</div>
            </div>
            <div class="shelf-content">
                <div class="shelf-pane active" id="pane-recents">
                    ${renderRecentsList()}
                </div>
                <div class="shelf-pane" id="pane-favorites">
                    ${renderFavoritesList()}
                </div>
            </div>
        </section>
    `;
}

function renderRecentsList() {
    try {
        const recents = JSON.parse(localStorage.getItem('starley_recents') || '[]');
        if (recents.length === 0) return '<p class="no-books">No recently read books yet.</p>';

        const favs = getFavorites();
        let booksHtml = '';
        recents.forEach(book => {
            const coverImagePath = book.cover ? (typeof window.getImageUrl === 'function' ? window.getImageUrl(`${book.path}/${book.cover}`) : `${IMAGES_BASE_URL}${book.path}/${book.cover}`) : 'assets/img/book-placeholder.png';
            const neonColor = generateNeonColor(book.title);
            const isFav = favs.includes(book.path);
            
            booksHtml += `
                <div class="book-card recent-card" data-book-path="${book.path}" data-chapter="${book.chapter}" data-edition="${book.edition}">
                    <div class="book-cover-wrapper">
                        <img src="${coverImagePath}" alt="${book.title}" class="book-cover-img"
                             onerror="this.onerror=null; this.src='assets/img/book-placeholder.png'; this.classList.add('cover-fallback');" />
                        <div class="fav-btn ${isFav ? 'active' : ''}" data-path="${book.path}">❤</div>
                    </div>
                    <div class="neon-info" style="color: ${neonColor};">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-authors" style="font-size:0.7rem; color:#888;">Last read: ${new Date(book.time).toLocaleDateString()}</p>
                    </div>
                </div>
            `;
        });

        return `<div class="books-grid recents-grid">${booksHtml}</div>`;
    } catch (e) { return ''; }
}

function renderFavoritesList() {
    const favs = getFavorites();
    if (favs.length === 0) return '<p class="no-books">No favorite books yet.</p>';

    let booksHtml = '';
    favs.forEach(path => {
        const meta = shelfMetadata[path];
        if (meta) {
            booksHtml += renderBookCard(path, meta.data, meta.visibility);
        }
    });

    if (!booksHtml) return '<p class="no-books">Metadata for favorites is loading or book not found in library.json.</p>';
    return `<div class="books-grid recents-grid">${booksHtml}</div>`;
}

function renderFavoritesTab() {
    const pane = document.getElementById('pane-favorites');
    if (pane) {
        pane.innerHTML = renderFavoritesList();
    }
}

function initShelfTabs() {
    const tabs = document.querySelectorAll('.shelf-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.shelf-pane').forEach(p => p.classList.remove('active'));
            const targetPane = document.getElementById(`pane-${target}`);
            if (targetPane) targetPane.classList.add('active');
            
            if (target === 'favorites') {
                renderFavoritesTab();
            } else if (target === 'recents') {
                const pane = document.getElementById('pane-recents');
                if (pane) {
                    pane.innerHTML = renderRecentsList();
                }
            }
        });
    });
}

// --- Main Loading Logic ---

async function loadLibrary() {
    const container = document.getElementById('library-container');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}library.json`);
        if (!response.ok) {
            throw new Error(`Failed to load library registry (HTTP ${response.status})`);
        }

        const data = await response.json();
        const categories = data.categories;

        if (!categories || categories.length === 0) {
            container.innerHTML = '<p class="no-books">Library is empty.</p>';
            return;
        }

        // Загружаем все метаданные параллельно
        const metadataPromises = [];
        const isAdmin = window.AuthSystem ? window.AuthSystem.isAdmin() : false;

        for (const category of categories) {
            for (const book of category.books) {
                const bookPath = `${category.path}/${book.folder}`;
                metadataPromises.push(
                    fetch(`${BASE_URL}${bookPath}/metadata.json`)
                        .then(async r => {
                            if (r.ok) {
                                const meta = (await r.json())[0];
                                shelfMetadata[bookPath] = {
                                    data: meta,
                                    visibility: book.visibility || 'all'
                                };
                            }
                        })
                        .catch(err => console.error(`Error loading metadata for ${bookPath}`, err))
                );
            }
        }

        await Promise.all(metadataPromises);
        window.shelfMetadata = shelfMetadata;
        window.IMAGES_BASE_URL = IMAGES_BASE_URL;

        let html = renderLibraryShelf();

        for (const category of categories) {
            let categoryBooksHtml = '';
            for (const book of category.books) {
                const bookPath = `${category.path}/${book.folder}`;
                const meta = shelfMetadata[bookPath];
                if (meta) {
                    if (meta.visibility === 'admin-only' && !isAdmin) continue;
                    categoryBooksHtml += renderBookCard(bookPath, meta.data, meta.visibility);
                }
            }
            if (categoryBooksHtml) {
                html += renderCategory(category, categoryBooksHtml);
            }
        }

        container.innerHTML = html || '<p class="no-books">Add books to library.json to see them here.</p>';
        
        // Initialize Binder Shelf
        if (window.BinderShelf && typeof window.BinderShelf.init === 'function') {
            window.BinderShelf.init(categories);
        }

        setupEventListeners();
        setupSearch();
        initShelfTabs();
        setupViewModeToggle();

    } catch (error) {
        console.error('Error loading library:', error);
        if (window.location.protocol === 'file:') {
            container.innerHTML = `
                <div class="error-file-protocol" style="max-width: 620px; margin: 40px auto; padding: 28px 24px; background: rgba(15, 23, 42, 0.05); border: 1px solid rgba(14, 165, 233, 0.35); border-radius: 16px; text-align: center; color: var(--text-color); box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
                    <div style="font-size: 2.8rem; margin-bottom: 12px;">🌐</div>
                    <h3 style="margin-bottom: 10px; font-size: 1.3rem; font-weight: 700;">Локальный веб-сервер библиотеки</h3>
                    <p style="font-size: 0.92rem; opacity: 0.88; margin-bottom: 22px; line-height: 1.6;">
                        Браузер ограничивает прямую загрузку файлов данных при открытии через <code>file://</code>.<br>
                        Нажмите кнопку ниже для переключения на локальный веб-сервер:
                    </p>
                    <a href="http://localhost:8080/index.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 26px; background: #0ea5e9; color: #fff; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 1rem; box-shadow: 0 4px 16px rgba(14, 165, 233, 0.4); transition: transform 0.15s ease;">
                        🚀 Открыть http://localhost:8080/index.html
                    </a>
                </div>
            `;
        } else {
            container.innerHTML = `<div class="error">Error loading library: ${error.message}</div>`;
        }
    }
}

function setupViewModeToggle() {
    const gridBtn = document.getElementById('btn-grid-view');
    const binderBtn = document.getElementById('btn-binder-view');
    const gridView = document.getElementById('library-container');
    const binderView = document.getElementById('binder-shelf-view');
    const searchBox = document.querySelector('.search-box');

    if (!gridBtn || !binderBtn || !gridView || !binderView) return;

    const applyViewMode = (mode) => {
        const isBinder = mode === 'binder';
        
        gridBtn.classList.toggle('active', !isBinder);
        gridBtn.setAttribute('aria-checked', !isBinder ? 'true' : 'false');
        binderBtn.classList.toggle('active', isBinder);
        binderBtn.setAttribute('aria-checked', isBinder ? 'true' : 'false');

        if (isBinder) {
            gridView.style.display = 'none';
            if (searchBox) searchBox.style.display = 'none';
            binderView.classList.remove('hidden');
        } else {
            gridView.style.display = 'block';
            if (searchBox) searchBox.style.display = 'block';
            binderView.classList.add('hidden');
        }
        localStorage.setItem('starley_view_mode', mode);
    };

    const savedMode = localStorage.getItem('starley_view_mode') || 'grid';
    applyViewMode(savedMode);

    gridBtn.addEventListener('click', () => applyViewMode('grid'));
    binderBtn.addEventListener('click', () => applyViewMode('binder'));
}

function setupEventListeners() {
    const container = document.getElementById('library-container');
    if (!container || container.dataset.listenersAttached) return;

    container.addEventListener('click', (e) => {
        // Клик по сердечку
        const favBtn = e.target.closest('.fav-btn');
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            const path = favBtn.dataset.path;
            toggleFavorite(path);
            return;
        }

        // Клик по карточке (переход к книге)
        const card = e.target.closest('.book-card');
        if (card) {
            const bookPath = card.dataset.bookPath;
            if (card.classList.contains('recent-card')) {
                const chapter = card.dataset.chapter;
                const edition = card.dataset.edition;
                window.location.href = `reader.html?book=${bookPath}&chapter=${chapter}&edition=${edition}`;
            } else {
                const firstChapter = card.dataset.firstChapter;
                window.location.href = `reader.html?book=${bookPath}&chapter=${firstChapter}`;
            }
        }
    });

    container.dataset.listenersAttached = "true";
}

function renderCategory(category, booksHtml) {
    return `
        <section class="category-section" style="margin-bottom: 2rem;">
            <h2 class="category-title" style="border-bottom: 2px solid #3498db; padding-bottom: 5px;">${category.title}</h2>
            <div class="books-grid">
                ${booksHtml}
            </div>
        </section>
    `;
}

function generateNeonColor(bookTitle) {
    let hash = 0;
    for (let i = 0; i < bookTitle.length; i++) {
        hash = bookTitle.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = Math.abs((hash >> 16) & 0xFF) % 256;
    const g = Math.abs((hash >> 8) & 0xFF) % 256;
    const b = Math.abs(hash & 0xFF) % 256;
    return `rgb(${r}, ${g}, ${b})`;
}

function renderBookCard(bookPath, bookMeta, visibility = 'all') {
    const coverImage = bookMeta.cover_image;
    const coverImagePath = coverImage ? (typeof window.getImageUrl === 'function' ? window.getImageUrl(`${bookPath}/${coverImage}`) : `${IMAGES_BASE_URL}${bookPath}/${coverImage}`) : 'assets/img/book-placeholder.png';
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    const neonColor = generateNeonColor(bookMeta.title);
    const escapedTitle = bookMeta.title.replace(/"/g, '&quot;');
    const adminOnlyClass = visibility === 'admin-only' ? ' admin-only-book' : '';
    const isFav = getFavorites().includes(bookPath);

    // Подготовка бейджей версий
    let badgesHtml = '';
    const versions = bookMeta.versions || {};
    if (versions.original || versions.russian || versions.starley || versions.hebrew || bookMeta.magazine || bookMeta.quiz) {
        badgesHtml = '<div class="version-badges">';
        if (versions.original) badgesHtml += '<span class="version-badge en">EN</span>';
        if (versions.russian)  badgesHtml += '<span class="version-badge ru">RU</span>';
        if (versions.starley)  badgesHtml += '<span class="version-badge star">⭐</span>';
        if (versions.hebrew)   badgesHtml += '<span class="version-badge he">HE</span>';
        
        // Значки функций
        if (bookMeta.magazine) badgesHtml += '<span class="version-badge magazine" title="Visual Magazine">📰</span>';
        if (bookMeta.quiz)     badgesHtml += '<span class="version-badge quiz" title="Clinical Quiz">🧠</span>';
        
        badgesHtml += '</div>';
    }

    return `
        <div class="book-card${adminOnlyClass}${isFav ? ' favorite-book' : ''}" 
             data-book-path="${bookPath}" 
             data-first-chapter="${firstChapter}" 
             data-book-title="${bookMeta.title}" 
             data-book-authors="${(bookMeta.authors || []).join(', ')}" 
             data-full-title="${escapedTitle}" 
             data-visibility="${visibility}">
            <div class="book-cover-wrapper">
                ${badgesHtml}
                <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img"
                     onerror="this.onerror=null; this.src='assets/img/book-placeholder.png'; this.classList.add('cover-fallback');" />
                <div class="fav-btn ${isFav ? 'active' : ''}" data-path="${bookPath}">❤</div>
            </div>
            <div class="neon-info" style="color: ${neonColor};">
                <h3 class="book-title">${bookMeta.title}</h3>
                <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
            </div>
        </div>
    `;
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput || searchInput.dataset.searchAttached) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(card => {
            const bookTitle = card.getAttribute('data-book-title') || '';
            const bookAuthors = card.getAttribute('data-book-authors') || '';
            if (bookTitle.toLowerCase().includes(searchTerm) || bookAuthors.toLowerCase().includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = e.target.value.trim();
            if (searchTerm) {
                window.location.href = `search/search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        }
    });
    
    searchInput.dataset.searchAttached = "true";
}

// Заглушки для старых функций
window.adjustFontSize = function() {};
window.adjustAllFontSizes = function() {};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadLibrary().catch(err => console.error('Library init failed:', err));
});

// Сохранение посещенных страниц (для совместимости)
window.addEventListener('load', () => {
    try {
        let visited = JSON.parse(localStorage.getItem('visited') || '[]');
        const current = location.pathname;
        if (!visited.includes(current)) {
            visited.push(current);
            if (visited.length > 10) visited.shift();
            localStorage.setItem('visited', JSON.stringify(visited));
        }
    } catch(e) {}
});
