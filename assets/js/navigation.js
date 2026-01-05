// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const chapterId = params.get('chapter') || 'chapter-01';
    const currentEdition = params.get('edition') || 'original';

    if (bookPath) {
        // Ждем небольшую паузу, чтобы reader.js успел прогрузить свои функции
        setTimeout(() => {
            if (typeof loadChapter === 'function') {
                loadChapter(bookPath, chapterId, currentEdition);
            } else {
                console.error("Критическая ошибка: reader.js не загружен!");
            }
        }, 100);

        initEditionSelector(bookPath, chapterId, currentEdition);
    }
});

async function initEditionSelector(bookPath, chapterId, currentEdition) {
    const headerContent = document.querySelector('.header-content');
    if (!headerContent) return;

    try {
        const response = await fetch('https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/library.json');
        const data = await response.json();
        
        const bookData = findBook(data, bookPath);
        
        if (bookData && bookData.editions) {
            const select = document.createElement('select');
            select.className = 'edition-selector';
            
            bookData.editions.forEach(ed => {
                const opt = new Option(ed.title, ed.id);
                if (ed.id === currentEdition) opt.selected = true;
                select.add(opt);
            });

            select.onchange = (e) => {
                const url = new URL(window.location.href);
                url.searchParams.set('edition', e.target.value);
                window.location.href = url.href;
            };

            const tocBtn = document.getElementById('toc-toggle');
            headerContent.insertBefore(select, tocBtn);
        }
    } catch (e) {
        console.warn("Селектор версий не загружен:", e);
    }
}

function findBook(data, path) {
    for (const cat of data.categories) {
        const book = cat.books.find(b => `${cat.path}/${b.folder}` === path);
        if (book) return book;
    }
    return null;
}
