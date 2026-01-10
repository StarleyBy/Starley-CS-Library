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
            <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 1rem;">
                ${booksHtml}
            </div>
        </section>
    `;
}

function renderBookCard(bookPath, bookMeta) {
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    return `
        <div class="book-card" data-book-path="${bookPath}" data-first-chapter="${firstChapter}" style="cursor: pointer; border: 1px solid #ddd; padding: 15px; border-radius: 8px; transition: transform 0.2s;">
            <h3 class="book-title">${bookMeta.title}</h3>
            <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
            <p class="book-description" style="font-size: 0.9em; color: #666;">${bookMeta.description || ''}</p>
        </div>
    `;
}

function attachBookClickHandlers() {
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
        
        card.onclick = () => {
            const bookPath = card.dataset.bookPath;
            const firstChapter = card.dataset.firstChapter;
            window.location.href = `reader.html?book=${bookPath}&chapter=${firstChapter}`;
        };
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const authors = card.querySelector('.book-authors').textContent.toLowerCase();
            const description = card.querySelector('.book-description').textContent.toLowerCase();
            if (title.includes(searchTerm) || authors.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadLibrary);
