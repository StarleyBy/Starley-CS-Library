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
    try {
        const response = await fetch('https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/library.json');
        const data = await response.json();
        const bookData = findBook(data, bookPath);

        if (bookData) {
            // 1. Устанавливаем заголовок книги
            document.getElementById('book-title').textContent = bookData.title;

            // 2. Строим список глав в сайдбаре
            renderChapterList(bookData, bookPath, currentChapter, currentEdition);

            // 3. Инициализируем селектор версий (если еще нет)
            initEditionSelector(bookData, currentEdition);

            // 4. Загружаем сам текст главы
            if (typeof loadChapter === 'function') {
                loadChapter(bookPath, currentChapter, currentEdition);
            }
        }
    } catch (e) {
        console.error("Ошибка навигации:", e);
    }
}

function renderChapterList(bookData, bookPath, currentChapter, currentEdition) {
    const container = document.getElementById('chapter-list');
    if (!container) return;

    // Если в library.json нет списка глав, создаем заглушку на 2 главы для теста
    const chapters = bookData.chapters || [
        {id: 'chapter-01', title: 'Глава 1'},
        {id: 'chapter-02', title: 'Глава 2'}
    ];

    container.innerHTML = chapters.map(ch => `
        <div class="chapter-item ${ch.id === currentChapter ? 'active' : ''}" 
             onclick="goToChapter('${bookPath}', '${ch.id}', '${currentEdition}')">
            ${ch.title}
        </div>
    `).join('');
}

function goToChapter(book, chapter, edition) {
    window.location.href = `reader.html?book=${book}&chapter=${chapter}&edition=${edition}`;
}

function findBook(data, path) {
    for (const cat of data.categories) {
        const book = cat.books.find(b => `${cat.path}/${b.folder}` === path);
        if (book) return book;
    }
    return null;
}

// Селектор версий (Starley Edition и т.д.)
function initEditionSelector(bookData, currentEdition) {
    const header = document.querySelector('.header-content');
    if (!header || document.getElementById('edition-select')) return;

    const select = document.createElement('select');
    select.id = 'edition-select';
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

    header.insertBefore(select, document.getElementById('toc-toggle'));
}
