// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const chapterId = params.get('chapter') || 'chapter-01';
    // Достаем версию из URL или ставим 'original' по умолчанию
    const currentEdition = params.get('edition') || 'original';

    if (bookPath) {
        initEditionSelector(bookPath, chapterId, currentEdition);
        loadChapter(bookPath, chapterId, currentEdition); 
    }
});

async function initEditionSelector(bookPath, chapterId, currentEdition) {
    const headerActions = document.querySelector('.header-content');
    
    // Создаем выпадающий список версий
    const select = document.createElement('select');
    select.className = 'edition-selector';
    select.id = 'edition-select';
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/library.json');
        const data = await response.json();
        
        // Ищем текущую книгу в JSON
        const bookData = findBookInLibrary(data, bookPath);
        
        if (bookData && bookData.editions) {
            bookData.editions.forEach(ed => {
                const opt = document.createElement('option');
                opt.value = ed.id;
                opt.textContent = ed.title;
                if (ed.id === currentEdition) opt.selected = true;
                select.appendChild(opt);
            });
        }

        // При смене версии — перезагружаем страницу с новым параметром
        select.onchange = (e) => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('edition', e.target.value);
            window.location.href = newUrl.href;
        };

        // Вставляем селектор перед кнопкой оглавления
        const tocBtn = document.getElementById('toc-toggle');
        headerActions.insertBefore(select, tocBtn);

    } catch (e) {
        console.error("Ошибка загрузки версий:", e);
    }
}

function findBookInLibrary(data, path) {
    for (const cat of data.categories) {
        const book = cat.books.find(b => `${cat.path}/${b.folder}` === path);
        if (book) return book;
    }
    return null;
}
