// assets/js/app.js

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
                booksHtml += renderBookCard(bookPath, bookMeta);
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

function renderBookCard(bookPath, bookMeta) {
    // Определить путь к обложке
    const coverImage = bookMeta.cover_image || getDefaultCoverImage(bookPath);
    
    // Используем прямой путь к обложке, но с обработчиком ошибок
    const coverImagePath = coverImage ? `${BASE_URL}${bookPath}/${coverImage}` : 'assets/img/book-placeholder.png';
    
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    
    return `
        <div class="book-card" data-book-path="${bookPath}" data-first-chapter="${firstChapter}" data-book-title="${bookMeta.title}" data-book-authors="${(bookMeta.authors || []).join(', ')}">
            <div class="book-cover-wrapper">
                <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img"
                     onerror="this.onerror=null; this.src='assets/img/book-placeholder.png'; this.classList.add('cover-fallback');" />
                <div class="book-info-overlay">
                    <h3 class="book-title">${bookMeta.title}</h3>
                    <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
                </div>
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

document.addEventListener('DOMContentLoaded', loadLibrary);
