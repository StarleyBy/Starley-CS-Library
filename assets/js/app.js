// assets/js/app.js

// Определяем правильный URL для изображений в зависимости от среды
let IMAGES_BASE_URL = './';

if (window.location.hostname.includes('github.io')) {
    // Для GitHub Pages используем полный URL к репозиторию для изображений
    const pathParts = window.location.pathname.split('/');
    const repoName = pathParts[1]; // имя репозитория из URL
    if (repoName && !repoName.includes('.')) { // проверяем, что это имя репозитория, а не домен
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

// Функция для получения изображения по умолчанию, если обложка не указана
function getDefaultCoverImage(bookPath) {
    // Попробуем найти любое изображение в папке книги для использования в качестве обложки
    // Возвращаем null, так как конкретное изображение будет определено в шаблоне
    return null;
}

function generateNeonColor(bookTitle) {
    // Генерируем уникальный цвет на основе названия книги
    let hash = 0;
    for (let i = 0; i < bookTitle.length; i++) {
        hash = bookTitle.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Конвертируем хэш в цвета
    const r = Math.abs((hash >> 16) & 0xFF) % 256;
    const g = Math.abs((hash >> 8) & 0xFF) % 256;
    const b = Math.abs(hash & 0xFF) % 256;
    
    // Возвращаем цвет в формате RGB
    return `rgb(${r}, ${g}, ${b})`;
}

function renderBookCard(bookPath, bookMeta) {
    // Определить путь к обложке
    const coverImage = bookMeta.cover_image || getDefaultCoverImage(bookPath);
    
    // Используем правильный базовый URL для изображений
    const coverImagePath = coverImage ? `${IMAGES_BASE_URL}${bookPath}/${coverImage}` : 'assets/img/book-placeholder.png';
    
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    
    // Генерируем цвет для неонового эффекта
    const neonColor = generateNeonColor(bookMeta.title);
    
    return `
        <div class="book-card" data-book-path="${bookPath}" data-first-chapter="${firstChapter}" data-book-title="${bookMeta.title}" data-book-authors="${(bookMeta.authors || []).join(', ')}">
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
}

// Функция для адаптации размера шрифта под размер контейнера
function adjustFontSize(element, maxFontSize = 16, minFontSize = 10) {
    if (!element) return;
    
    let fontSize = maxFontSize;
    element.style.fontSize = fontSize + 'px';
    
    // Уменьшаем шрифт, пока текст не поместится в контейнер
    while (element.scrollWidth > element.offsetWidth && fontSize > minFontSize) {
        fontSize -= 1;
        element.style.fontSize = fontSize + 'px';
    }
}

// Функция для адаптации размера шрифта для всех элементов
function adjustAllFontSizes() {
    // Добавляем небольшую задержку, чтобы элементы точно отрисовались
    setTimeout(() => {
        document.querySelectorAll('.book-title, .book-authors').forEach(element => {
            const maxFontSize = element.classList.contains('book-title') ? 16 : 14;
            const minFontSize = element.classList.contains('book-title') ? 8 : 6;
            adjustFontSize(element, maxFontSize, minFontSize);
        });
    }, 100);
}

// ПАТЧИМ функцию renderBookCard для отображения баджей версий
const originalRenderBookCard = window.renderBookCard;

window.renderBookCard = function(bookPath, bookMeta) {
    let html = originalRenderBookCard(bookPath, bookMeta);
    
    const versions = bookMeta.versions || {};
    
    // Создаём badge только если есть хотя бы одна доступная версия
    if (versions.original || versions.russian || versions.starley || versions.hebrew) {
        let badgesHtml = '<div class="version-badges">';
        
        // EN badge только если явно указан original: true
        if (versions.original === true) {
            badgesHtml += '<span class="version-badge en">EN</span>';
        }
        
        if (versions.russian === true) {
            badgesHtml += '<span class="version-badge ru">RU</span>';
        }
        
        if (versions.starley === true) {
            badgesHtml += '<span class="version-badge star">STAR</span>';
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
    
    const titleLength = bookMeta.title.length;
    if (titleLength > 80) {
        html = html.replace('class="book-title"', 'class="book-title very-long-title"');
        html = html.replace(
            'class="book-card"',
            `class="book-card" data-full-title="${bookMeta.title.replace(/"/g, '&quot;')}"`
        );
    } else if (titleLength > 50) {
        html = html.replace('class="book-title"', 'class="book-title long-title"');
        html = html.replace(
            'class="book-card"',
            `class="book-card" data-full-title="${bookMeta.title.replace(/"/g, '&quot;')}"`
        );
    }
    
    return html;
};

// ОТКЛЮЧАЕМ adjustFontSize и adjustAllFontSizes для предотвращения конфликта со стилями
const originalAdjustFontSize = window.adjustFontSize;
const originalAdjustAllFontSizes = window.adjustAllFontSizes;

window.adjustFontSize = function() {
    // Ничего не делаем
};

window.adjustAllFontSizes = function() {
    // Ничего не делаем
};

// После загрузки DOM удаляем все inline стили с font-size
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('.book-title, .book-authors').forEach(element => {
            // Удаляем только font-size из inline стилей
            if (element.style.fontSize) {
                element.style.fontSize = '';
            }
        });
    }, 200);
});

// После загрузки библиотеки вызываем адаптацию   шрифтов
function loadLibraryAndAdjustFonts() {
    loadLibrary().then(() => {
        adjustAllFontSizes();
    }).catch(error => {
        console.error('Error loading library:', error);
    });
}

document.addEventListener('DOMContentLoaded', loadLibraryAndAdjustFonts);
