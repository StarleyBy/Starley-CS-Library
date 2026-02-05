// assets/js/app.js

let IMAGES_BASE_URL = './';

// Инициализация путей (упрощено)
if (window.location.hostname.includes('github.io')) {
    IMAGES_BASE_URL = './';
}

async function loadLibrary() {
    const container = document.getElementById('library-container');
    if (!container) return;

    try {
        const response = await fetch(`${BASE_URL}library.json`);
        if (!response.ok) throw new Error('Ошибка загрузки библиотеки');

        const data = await response.json();
        const categories = data.categories;

        if (!categories || categories.length === 0) {
            container.innerHTML = '<p>Библиотека пуста.</p>';
            return;
        }

        let allBooksHtml = '';
        categories.forEach(category => {
            if (category.books) {
                category.books.forEach(book => {
                    allBooksHtml += renderBookCard(book.path, book.metadata);
                });
            }
        });

        container.innerHTML = allBooksHtml;
        setupSearch();
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>Ошибка загрузки данных.</p>';
    }
}

function renderBookCard(bookPath, bookMeta) {
    const title = bookMeta.title || 'Без названия';
    const authors = (bookMeta.authors || []).join(', ');
    const coverImage = bookMeta.cover_image 
        ? `${IMAGES_BASE_URL}${bookPath}/${bookMeta.cover_image}` 
        : 'assets/img/book-placeholder.png';
    
    // Цветовой акцент
    const neonColor = generateNeonColor(title);
    
    // ЛОГИКА БАДЖЕЙ
    const versions = bookMeta.versions || {};
    let badgesHtml = '<div class="version-badges">';
    if (versions.original) badgesHtml += '<span class="version-badge en">EN</span>';
    if (versions.russian) badgesHtml += '<span class="version-badge ru">RU</span>';
    if (versions.starley) badgesHtml += '<span class="version-badge star">⭐</span>';
    badgesHtml += '</div>';

    // АДАПТИВНОСТЬ: проверяем длину текста для добавления спец. класса
    const titleClass = title.length > 60 ? 'book-title very-long-title' : 'book-title';

    return `
        <div class="book-card" onclick="location.href='reader.html?book=${bookPath}'">
            <div class="book-cover-wrapper">
                ${badgesHtml}
                <img src="${coverImage}" alt="${title}" class="book-cover-img" 
                     onerror="this.src='assets/img/book-placeholder.png'">
            </div>
            <div class="neon-info" style="--neon-accent: ${neonColor}">
                <h3 class="${titleClass}">${title}</h3>
                <p class="book-authors">${authors}</p>
            </div>
        </div>
    `;
}

function generateNeonColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash % 360)}, 70%, 50%)`;
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? 'flex' : 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', loadLibrary);
