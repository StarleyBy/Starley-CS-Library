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
let shelfMetadata = {}; // path -> metadata + visibility

function getFavorites() {
    try { return JSON.parse(localStorage.getItem('starley_favorites') || '[]'); } catch { return []; }
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
    
    // Синхронизируем все карточки этой книги на странице
    document.querySelectorAll(`.book-card[data-book-path="${bookPath}"]`).forEach(card => {
        card.classList.toggle('favorite-book', isActive);
        const btn = card.querySelector('.fav-btn');
        if (btn) btn.classList.toggle('active', isActive);
    });

    // Перерендериваем вкладку избранного, если она сейчас открыта
    const favTab = document.querySelector('.shelf-tab[data-tab="favorites"]');
    if (favTab && favTab.classList.contains('active')) {
        renderFavoritesTab();
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

        let booksHtml = '';
        recents.forEach(book => {
            const coverImagePath = book.cover ? `${IMAGES_BASE_URL}${book.path}/${book.cover}` : 'assets/img/book-placeholder.png';
            const neonColor = generateNeonColor(book.title);
            const isFav = getFavorites().includes(book.path);
            
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

    if (!booksHtml) return '<p class="no-books">Metadata for favorites is loading...</p>';
    return `<div class="books-grid recents-grid">${booksHtml}</div>`;
}

function renderFavoritesTab() {
    const pane = document.getElementById('pane-favorites');
    if (pane) {
        pane.innerHTML = renderFavoritesList();
        attachBookClickHandlers();
    }
}

function initShelfTabs() {
    const tabs = document.querySelectorAll('.shelf-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Switch tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Switch panes
            document.querySelectorAll('.shelf-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(`pane-${target}`).classList.add('active');
            
            // If switching to favorites, make sure it's up to date
            if (target === 'favorites') {
                renderFavoritesTab();
            }
        });
    });
}
// ---------------------------------

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

        // Сначала собираем метаданные для всех книг (параллельно)
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

        // Ждем загрузки метаданных
        await Promise.all(metadataPromises);

        // Рендерим Полку (Недавние + Избранное)
        let html = renderLibraryShelf();

        // Рендерим категории
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
        attachBookClickHandlers();
        setupSearch();
        initShelfTabs();

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="error">Error loading library: ${error.message}</div>`;
    }
}

// Заменяем renderBooksForCategory, так как мы теперь рендерим все в loadLibrary
// Но оставим для совместимости, если нужно
async function renderBooksForCategory(category) {
    return ''; // Больше не используется напрямую
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

function getDefaultCoverImage(bookPath) {
    return null;
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
    const coverImage = bookMeta.cover_image || getDefaultCoverImage(bookPath);
    const coverImagePath = coverImage ? `${IMAGES_BASE_URL}${bookPath}/${coverImage}` : 'assets/img/book-placeholder.png';
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    const neonColor = generateNeonColor(bookMeta.title);

    // Всегда добавляем data-full-title — tooltip будет для всех книг
    const escapedTitle = bookMeta.title.replace(/"/g, '&quot;');

    // Добавляем класс для admin-only книг
    const adminOnlyClass = visibility === 'admin-only' ? ' admin-only-book' : '';
    
    // Проверка на избранное
    const isFav = getFavorites().includes(bookPath);

    return `
        <div class="book-card${adminOnlyClass}${isFav ? ' favorite-book' : ''}" data-book-path="${bookPath}" data-first-chapter="${firstChapter}" data-book-title="${bookMeta.title}" data-book-authors="${(bookMeta.authors || []).join(', ')}" data-full-title="${escapedTitle}" data-visibility="${visibility}">
            <div class="book-cover-wrapper">
                <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img"
                     onerror="this.onerror=null; this.src='assets/img/book-placeholder.png'; this.classList.add('cover-fallback');"
                     onload="if(this.naturalWidth === 0) { this.onerror(); }" />
                <div class="fav-btn ${isFav ? 'active' : ''}" data-path="${bookPath}">❤</div>
            </div>
            <div class="neon-info" style="color: ${neonColor};">
                <h3 class="book-title">${bookMeta.title}</h3>
                <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
            </div>
        </div>
    `;
}

function attachBookClickHandlers() {
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.05)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
        
        card.addEventListener('click', (e) => {
            // Если клик по кнопке избранного — не переходим в читалку
            if (e.target.classList.contains('fav-btn')) {
                e.stopPropagation();
                const path = e.target.dataset.path;
                const active = toggleFavorite(path);
                e.target.classList.toggle('active', active);
                card.classList.toggle('favorite-book', active);
                return;
            }

            const bookPath = card.dataset.bookPath;
            
            // Для "Недавних" используем сохраненную главу и редакцию
            if (card.classList.contains('recent-card')) {
                const chapter = card.dataset.chapter;
                const edition = card.dataset.edition;
                window.location.href = `reader.html?book=${bookPath}&chapter=${chapter}&edition=${edition}`;
            } else {
                const firstChapter = card.dataset.firstChapter;
                window.location.href = `reader.html?book=${bookPath}&chapter=${firstChapter}`;
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(card => {
            const bookTitle = card.getAttribute('data-book-title') || card.querySelector('.book-title')?.textContent || '';
            const bookAuthors = card.getAttribute('data-book-authors') || card.querySelector('.book-authors')?.textContent || '';
            
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
}

// Отключаем adjustFontSize — управление через CSS
window.adjustFontSize = function() {};
window.adjustAllFontSizes = function() {};

// Патч renderBookCard для version badges
const originalRenderBookCard = window.renderBookCard;

window.renderBookCard = function(bookPath, bookMeta, visibility = 'all') {
    let html = originalRenderBookCard(bookPath, bookMeta, visibility);

    const versions = bookMeta.versions || {};

    if (versions.original || versions.russian || versions.starley || versions.hebrew) {
        let badgesHtml = '<div class="version-badges">';

        if (versions.original === true) {
            badgesHtml += '<span class="version-badge en">EN</span>';
        }
        if (versions.russian === true) {
            badgesHtml += '<span class="version-badge ru">RU</span>';
        }
        if (versions.starley === true) {
            badgesHtml += '<span class="version-badge star">⭐</span>';
        }
        if (versions.hebrew === true) {
            badgesHtml += '<span class="version-badge he">HE</span>';
        }

        badgesHtml += '</div>';

        html = html.replace(
            '<div class="book-cover-wrapper">',
            '<div class="book-cover-wrapper">' + badgesHtml
        );
    }

    return html;
};

// Удаляем inline font-size после рендера (на случай если что-то его выставило)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('.book-title, .book-authors').forEach(element => {
            if (element.style.fontSize) {
                element.style.fontSize = '';
            }
        });
    }, 200);
});

function loadLibraryAndAdjustFonts() {
    loadLibrary().catch(error => {
        console.error('Error loading library:', error);
    });
}

document.addEventListener('DOMContentLoaded', loadLibraryAndAdjustFonts);

// Сохраняем последние открытые страницы
window.addEventListener('load', () => {
  let visited = JSON.parse(localStorage.getItem('visited') || '[]');

  const current = location.pathname;

  if (!visited.includes(current)) {
    visited.push(current);
    if (visited.length > 10) visited.shift(); // максимум 10 страниц
  }

  localStorage.setItem('visited', JSON.stringify(visited));
});
