// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const currentChapter = params.get('chapter') || 'chapter-01';
    const currentEdition = params.get('edition') || 'original';

    if (bookPath) {
        await initNavigation(bookPath, currentChapter, currentEdition);
    }
});

async function initNavigation(bookPath, currentChapter, currentEdition) {
    const chapterListContainer = document.getElementById('chapter-list');
    const bookTitleElement = document.getElementById('book-title');

    try {
        // Добавляем timestamp, чтобы избежать кэширования старого (битого) JSON
        const response = await fetch(`https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/library.json?t=${Date.now()}`);
        
        if (!response.ok) throw new Error("Не удалось загрузить library.json");
        
        const data = await response.json();
        const bookData = findBook(data, bookPath);

        if (bookData) {
            // 1. Ставим заголовок
            if (bookTitleElement) bookTitleElement.textContent = bookData.title;

            // 2. Рисуем список глав в сайдбаре
            if (chapterListContainer) {
                const chapters = bookData.chapters || [{id: 'chapter-01', title: 'Глава 1'}];
                chapterListContainer.innerHTML = chapters.map(ch => `
                    <div class="chapter-item ${ch.id === currentChapter ? 'active' : ''}" 
                         onclick="window.location.href='reader.html?book=${bookPath}&chapter=${ch.id}&edition=${currentEdition}'">
                        ${ch.title}
                    </div>
                `).join('');
            }

            // 3. Загружаем текст (функция из reader.js)
            if (typeof loadChapter === 'function') {
                loadChapter(bookPath, currentChapter, currentEdition);
            }
        }
    } catch (e) {
        console.error("Ошибка навигации:", e);
        if (chapterListContainer) {
            chapterListContainer.innerHTML = `<div class="error">Ошибка JSON: Проверьте синтаксис library.json</div>`;
        }
    }
}

function findBook(data, path) {
    for (const cat of data.categories) {
        const book = cat.books.find(b => `${cat.path}/${b.folder}` === path);
        if (book) return book;
    }
    return null;
}
