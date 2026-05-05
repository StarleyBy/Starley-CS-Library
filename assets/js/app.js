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
function getFavorites() {
    try { return JSON.parse(localStorage.getItem('starley_favorites') || '[]'); } catch { return []; }
}

function toggleFavorite(bookPath) {
    let favs = getFavorites();
    if (favs.includes(bookPath)) {
        favs = favs.filter(p => p !== bookPath);
    } else {
        favs.push(bookPath);
    }
    localStorage.setItem('starley_favorites', JSON.stringify(favs));
    return favs.includes(bookPath);
}

function renderRecents() {
    try {
        const recents = JSON.parse(localStorage.getItem('starley_recents') || '[]');
        if (recents.length === 0) return '';

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

        return `
            <section class="category-section recents-section">
                <h2 class="category-title" style="border-bottom: 2px solid #9b59b6;">🕒 Recently Opened</h2>
                <div class="books-grid recents-grid">
                    ${booksHtml}
                </div>
            </section>
        `;
    } catch (e) { return ''; }
}
// ---------------------------------

function renderFavoritesSection(categories) {
    try {
        const favs = getFavorites();
        if (favs.length === 0) return '';

        let booksHtml = '';
        // Нам нужно найти метаданные для избранных книг. 
        // Но так как у нас нет общего реестра в памяти, мы можем либо:
        // 1. Собрать их из отрендеренных категорий (сложно)
        // 2. Рендерить их динамически (нужно знать категорию)
        // 3. Или просто выделить их в общем списке (что уже сделано)
        // Оптимально: добавить в library.json признак или просто искать в категориях.
        
        // Для простоты и производительности, мы уже добавили класс .favorite-book.
        // Чтобы сделать "круто", мы можем переместить избранные книги в начало их категорий
        // или создать виртуальную категорию.
        
        return ''; // Пока оставим выделение в общем списке, это чище
    } catch (e) { return ''; }
}

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

        // Рендерим "Недавние"
        let html = renderRecents();

        // Рендерим категории
        for (const category of categories) {
            if (category.books && category.books.length > 0) {
                const booksHtml = await renderBooksForCategory(category);
                if (booksHtml) {
                    html += renderCategory(category, booksHtml);
                }
            }
        }

        container.innerHTML = html || '<p class="no-books">Add books to library.json to see them here.</p>';
        attachBookClickHandlers();
        setupSearch();

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="error">Error loading library: ${error.message}</div>`;
    }
}

async function renderBooksForCategory(category) {
    let booksHtml = '';
    
    // Проверяем права пользователя с ожиданием инициализации AuthSystem
    let isAdmin = false;
    if (window.AuthSystem) {
        isAdmin = window.AuthSystem.isAdmin();
    } else {
        console.warn('AuthSystem not available yet, treating as non-admin');
    }

    for (const book of category.books) {
        try {
            const bookPath = `${category.path}/${book.folder}`;
            const metaResponse = await fetch(`${BASE_URL}${bookPath}/metadata.json`);
            if (metaResponse.ok) {
                const bookMeta = (await metaResponse.json())[0];

                // Проверяем видимость книги
                const visibility = book.visibility || 'all';
                if (visibility === 'admin-only' && !isAdmin) {
                    console.log(`Hidden admin-only book: ${book.folder}`);
                    continue; // Пропускаем книги только для админов
                }

                try {
                    booksHtml += renderBookCard(bookPath, bookMeta, visibility);
                } catch (renderError) {
                    console.error(`Failed to render book card for: ${book.folder}`, renderError);
                }
            } else {
                console.error(`Failed to fetch metadata for book: ${book.folder}. Status: ${metaResponse.status}`);
            }
        } catch (error) {
            console.error(`Failed to load metadata for book: ${book.folder}`, error);
        }
    }
    return booksHtml;
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
