// assets/js/app.js

// Конфигурация: замените на ваш URL, если ветка изменится
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

document.addEventListener('DOMContentLoaded', () => {
    loadLibrary();

    // Инициализация поиска
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterBooks(e.target.value.toLowerCase());
        });
    }
});

/**
 * Основная функция загрузки библиотеки из library.json
 */
async function loadLibrary() {
    const container = document.getElementById('library-container');
    
    try {
        const response = await fetch(`${GITHUB_BASE_URL}library.json`);
        if (!response.ok) throw new Error('Файл library.json не найден');
        
        const data = await response.json();
        const categories = data.categories;

        if (!categories || categories.length === 0) {
            container.innerHTML = '<p class="no-books">Библиотека пуста. Добавьте книги в library.json</p>';
            return;
        }

        let html = '';
        categories.forEach(category => {
            if (category.books && category.books.length > 0) {
                html += renderCategory(category);
            }
        });

        container.innerHTML = html || '<p class="no-books">Нет доступных книг.</p>';
        
        // Вешаем события клика на карточки
        attachBookClickHandlers();
        
    } catch (error) {
        console.error('Ошибка загрузки библиотеки:', error);
        container.innerHTML = `
            <div class="error">
                <p>⚠️ Ошибка загрузки реестра книг.</p>
                <small>Проверьте наличие файла library.json в корне репозитория.</small>
            </div>`;
    }
}

/**
 * Рендеринг секции категории
 */
function renderCategory(category) {
    const booksHtml = category.books.map(book => `
        <div class="book-card" data-book-path="${category.path}/${book.folder}">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-authors">${book.author || 'Автор не указан'}</p>
                <p class="book-description">${book.description || ''}</p>
                <span class="chapter-count">Глава 1: ${book.folder === 'bojar' ? 'Synopsis' : 'Открыть'}</span>
            </div>
        </div>
    `).join('');

    return `
        <section class="category-section">
            <h2 class="category-title">${category.title}</h2>
            <div class="books-grid">
                ${booksHtml}
            </div>
        </section>
    `;
}

/**
 * Обработка клика по книге
 */
function attachBookClickHandlers() {
    const cards = document.querySelectorAll('.book-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const fullPath = card.dataset.bookPath; // Получаем "books/icu/bojar"
            // Переходим в читалку. По умолчанию открываем chapter-01
            window.location.href = `reader.html?book=${fullPath}&chapter=chapter-01`;
        });
    });
}

/**
 * Живой поиск по книгам
 */
function filterBooks(query) {
    const bookCards = document.querySelectorAll('.book-card');
    let hasResults = false;

    bookCards.forEach(card => {
        const title = card.querySelector('.book-title').textContent.toLowerCase();
        const author = card.querySelector('.book-authors').textContent.toLowerCase();
        
        if (title.includes(query) || author.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    // Скрываем заголовки категорий, если в них нет подходящих книг
    document.querySelectorAll('.category-section').forEach(section => {
        const visibleCards = section.querySelectorAll('.book-card[style="display: block;"]');
        section.style.display = visibleCards.length > 0 ? 'block' : 'none';
    });
}
