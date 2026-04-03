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

        let html = '';
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
    for (const book of category.books) {
        try {
            const bookPath = `${category.path}/${book.folder}`;
            const metaResponse = await fetch(`${BASE_URL}${bookPath}/metadata.json`);
            if (metaResponse.ok) {
                const bookMeta = (await metaResponse.json())[0];
                try {
                    booksHtml += renderBookCard(bookPath, bookMeta);
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

function renderBookCard(bookPath, bookMeta) {
    const coverImage = bookMeta.cover_image || getDefaultCoverImage(bookPath);
    const coverImagePath = coverImage ? `${IMAGES_BASE_URL}${bookPath}/${coverImage}` : 'assets/img/book-placeholder.png';
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    const neonColor = generateNeonColor(bookMeta.title);

    // Всегда добавляем data-full-title — tooltip будет для всех книг
    const escapedTitle = bookMeta.title.replace(/"/g, '&quot;');

    return `
        <div class="book-card" data-book-path="${bookPath}" data-first-chapter="${firstChapter}" data-book-title="${bookMeta.title}" data-book-authors="${(bookMeta.authors || []).join(', ')}" data-full-title="${escapedTitle}">
            <div class="book-cover-wrapper">
                <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img"
                     onerror="this.onerror=null; this.src='assets/img/book-placeholder.png'; this.classList.add('cover-fallback');"
                     onload="if(this.naturalWidth === 0) { this.onerror(); }" />
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
            const bookPath = card.dataset.bookPath;
            const firstChapter = card.dataset.firstChapter;
            window.location.href = `reader.html?book=${bookPath}&chapter=${firstChapter}`;
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

window.renderBookCard = function(bookPath, bookMeta) {
    let html = originalRenderBookCard(bookPath, bookMeta);

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
