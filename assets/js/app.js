// assets/js/app.js

// Константа базы данных GitHub
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

async function loadLibrary() {
    const container = document.getElementById('library-container');
    if (!container) return;

    try {
        // Загружаем ваш library.json
        const response = await fetch(`${GITHUB_BASE_URL}library.json`);
        
        if (!response.ok) {
            throw new Error(`Не удалось загрузить реестр библиотек (HTTP ${response.status})`);
        }

        const data = await response.json();
        const categories = data.categories;

        if (!categories || categories.length === 0) {
            container.innerHTML = '<p class="no-books">Библиотека пуста.</p>';
            return;
        }

        let html = '';
        categories.forEach(category => {
            // Показываем категорию только если в ней есть хотя бы одна книга
            if (category.books && category.books.length > 0) {
                html += renderCategory(category);
            }
        });

        container.innerHTML = html || '<p class="no-books">Добавьте книги в library.json, чтобы они появились здесь.</p>';
        
        // Вешаем события клика
        attachBookClickHandlers();

    } catch (error) {
        console.error('Ошибка:', error);
        container.innerHTML = `<div class="error">Ошибка загрузки: ${error.message}</div>`;
    }
}

function renderCategory(category) {
    return `
        <section class="category-section" style="margin-bottom: 2rem;">
            <h2 class="category-title" style="border-bottom: 2px solid #3498db; padding-bottom: 5px;">${category.title}</h2>
            <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 1rem;">
                ${category.books.map(book => `
                    <div class="book-card" data-book-path="${category.path}/${book.folder}" style="cursor: pointer; border: 1px solid #ddd; padding: 15px; border-radius: 8px; transition: transform 0.2s;">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-authors"><i>${book.author}</i></p>
                        <p class="book-description" style="font-size: 0.9em; color: #666;">${book.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function attachBookClickHandlers() {
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
        
        card.onclick = () => {
            const bookPath = card.dataset.bookPath;
            // Переход в читалку. Мы передаем путь к книге и стартовую главу
            window.location.href = `reader.html?book=${bookPath}&chapter=chapter-01`;
        };
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', loadLibrary);
