// ===== КОНФИГУРАЦИЯ =====
const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/new/main/';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

// ===== ЗАГРУЗКА БИБЛИОТЕКИ =====
async function loadLibrary() {
    const container = document.getElementById('library-container');
    
    try {
        // Получаем список категорий из структуры папок
        const categories = await loadCategories();
        
        if (categories.length === 0) {
            container.innerHTML = '<p class="no-books">Книги не найдены</p>';
            return;
        }
        
        // Отображаем каждую категорию
        let html = '';
        for (const category of categories) {
            html += renderCategory(category);
        }
        
        container.innerHTML = html;
        
        // Добавляем обработчики кликов
        attachBookClickHandlers();
        
    } catch (error) {
        console.error('Ошибка загрузки библиотеки:', error);
        container.innerHTML = '<p class="error">Ошибка загрузки библиотеки</p>';
    }
}

// ===== ПОЛУЧЕНИЕ СПИСКА КАТЕГОРИЙ =====
async function loadCategories() {
    // Пока хардкодим известные категории
    // В будущем можно использовать GitHub API для автоматического обнаружения
    const categoryNames = ['cardiology', 'neurology', 'surgery'];
    const categories = [];
    
    for (const catName of categoryNames) {
        const books = await loadBooksInCategory(catName);
        if (books.length > 0) {
            categories.push({
                name: catName,
                title: getCategoryTitle(catName),
                books: books
            });
        }
    }
    
    return categories;
}

// ===== ЗАГРУЗКА КНИГ В КАТЕГОРИИ =====
async function loadBooksInCategory(categoryName) {
    // Хардкодим известные книги для начала
    // Позже автоматизируем через GitHub API или файл index.json
    const knownBooks = {
        'cardiology': ['test-book']
    };
    
    const bookIds = knownBooks[categoryName] || [];
    const books = [];
    
    for (const bookId of bookIds) {
        try {
            const metadata = await loadBookMetadata(categoryName, bookId);
            books.push(metadata);
        } catch (error) {
            console.error(`Ошибка загрузки книги ${bookId}:`, error);
        }
    }
    
    return books;
}

// ===== ЗАГРУЗКА МЕТАДАННЫХ КНИГИ =====
async function loadBookMetadata(category, bookId) {
    const cacheKey = `metadata_${category}_${bookId}`;
    
    // Проверяем кэш
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    // Загружаем с GitHub
    const url = `${GITHUB_BASE_URL}books/${category}/${bookId}/metadata.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    
    const metadata = await response.json();
    
    // Кэшируем
    setCachedData(cacheKey, metadata);
    
    return metadata;
}

// ===== ОТРИСОВКА КАТЕГОРИИ =====
function renderCategory(category) {
    let html = `
        <div class="category">
            <h2 class="category-title">${category.title}</h2>
            <div class="books-grid">
    `;
    
    category.books.forEach(book => {
        html += renderBookCard(book);
    });
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// ===== ОТРИСОВКА КАРТОЧКИ КНИГИ =====
function renderBookCard(book) {
    const authors = book.authors ? book.authors.join(', ') : 'Автор неизвестен';
    const chapterCount = book.chapters ? book.chapters.length : 0;
    
    return `
        <div class="book-card" data-book-id="${book.id}">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-authors">${authors}</p>
            ${book.description ? `<p class="book-description">${book.description}</p>` : ''}
            <div class="book-meta">
                <span class="chapter-count">📖 ${chapterCount} глав</span>
                ${book.year ? `<span>📅 ${book.year}</span>` : ''}
            </div>
        </div>
    `;
}

// ===== ОБРАБОТЧИКИ КЛИКОВ =====
function attachBookClickHandlers() {
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            openBook(bookId);
        });
    });
}

// ===== ОТКРЫТИЕ КНИГИ =====
function openBook(bookId) {
    // Сохраняем ID книги для reader.html
    localStorage.setItem('currentBookId', bookId);
    window.location.href = 'reader.html';
}

// ===== ПОИСК =====
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            filterBooks(query);
        });
    }
});

function filterBooks(query) {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        const title = card.querySelector('.book-title').textContent.toLowerCase();
        const authors = card.querySelector('.book-authors').textContent.toLowerCase();
        
        if (title.includes(query) || authors.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== УТИЛИТЫ КЭШИРОВАНИЯ =====
function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    
    // Проверяем срок действия
    if (Date.now() - data.timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
    }
    
    return data.content;
}

function setCachedData(key, content) {
    const data = {
        content: content,
        timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getCategoryTitle(categoryName) {
    const titles = {
        'cardiology': 'Кардиология',
        'neurology': 'Неврология',
        'surgery': 'Хирургия'
    };
    return titles[categoryName] || categoryName;
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', loadLibrary);
