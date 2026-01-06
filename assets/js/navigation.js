// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const currentChapter = params.get('chapter') || 'chapter-01';
    const currentEdition = params.get('edition') || 'original';

    if (bookPath) {
        // Запускаем основную логику навигации
        await initNavigation(bookPath, currentChapter, currentEdition);
    } else {
        console.error("Книга не указана в URL (параметр ?book=)");
    }
});

/**
 * Инициализация навигации: загрузка JSON, отрисовка меню и вызов загрузки текста
 */
async function initNavigation(bookPath, currentChapter, currentEdition) {
    const chapterListContainer = document.getElementById('chapter-list');
    const bookTitleElement = document.getElementById('book-title');
    const versionContainer = document.getElementById('version-selector-container');

    try {
        // Загружаем library.json (добавляем timestamp против кэша GitHub)
        const response = await fetch(`https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/library.json?t=${Date.now()}`);
        
        if (!response.ok) throw new Error("Не удалось загрузить манифест библиотеки (library.json)");
        
        const data = await response.json();
        
        // Поиск данных о текущей книге
        const bookData = findBookInLibrary(data, bookPath);

        if (bookData) {
            // 2. Устанавливаем заголовок книги в сайдбаре
            if (bookTitleElement) {
                bookTitleElement.textContent = bookData.title;
            }

            // 3. Отрисовываем список глав
            if (chapterListContainer) {
                renderChapters(bookData, bookPath, currentChapter, currentEdition, chapterListContainer);
            }

            // 4. Отрисовываем селектор версий (Original / Starley Edition)
            if (versionContainer && bookData.editions) {
                renderVersionSelector(bookData, currentEdition, versionContainer);
            }

            // 5. Вызываем функцию загрузки контента из reader.js
            // Проверяем наличие функции, чтобы избежать ошибки "not defined"
            if (typeof loadChapter === 'function') {
                loadChapter(bookPath, currentChapter, currentEdition);
            } else {
                console.warn("Функция loadChapter не найдена. Проверьте подключение reader.js в HTML.");
            }
        } else {
            throw new Error("Книга не найдена в базе данных library.json");
        }

    } catch (error) {
        console.error("Ошибка Navigation:", error);
        if (chapterListContainer) {
            chapterListContainer.innerHTML = `<div class="error-msg">Ошибка навигации: ${error.message}</div>`;
        }
    }
}

/**
 * Отрисовка кликабельного списка глав в сайдбаре
 */
function renderChapters(bookData, bookPath, currentChapter, currentEdition, container) {
    // Если в JSON нет списка глав, создаем массив по умолчанию
    const chapters = bookData.chapters || [{id: 'chapter-01', title: 'Глава 1'}];

    container.innerHTML = chapters.map(ch => {
        const isActive = ch.id === currentChapter ? 'active' : '';
        return `
            <div class="chapter-item ${isActive}" 
                 onclick="navigateTo('${bookPath}', '${ch.id}', '${currentEdition}')">
                <span class="ch-icon">📖</span> ${ch.title}
            </div>
        `;
    }).join('');
}

/**
 * Создание выпадающего списка выбора версий
 */
function renderVersionSelector(bookData, currentEdition, container) {
    container.innerHTML = ''; // Очистка
    
    const select = document.createElement('select');
    select.className = 'edition-selector';
    
    bookData.editions.forEach(ed => {
        const opt = document.createElement('option');
        opt.value = ed.id;
        opt.textContent = ed.title;
        if (ed.id === currentEdition) opt.selected = true;
        select.appendChild(opt);
    });

    // Обработчик смены версии
    select.onchange = (e) => {
        const params = new URLSearchParams(window.location.search);
        const book = params.get('book');
        const chapter = params.get('chapter') || 'chapter-01';
        navigateTo(book, chapter, e.target.value);
    };

    container.appendChild(select);
}

/**
 * Вспомогательная функция для смены URL
 */
function navigateTo(book, chapter, edition) {
    window.location.href = `reader.html?book=${book}&chapter=${chapter}&edition=${edition}`;
}

/**
 * Поиск книги по пути в структуре категорий
 */
function findBookInLibrary(data, path) {
    for (const cat of data.categories) {
        const book = cat.books.find(b => `${cat.path}/${b.folder}` === path);
        if (book) return book;
    }
    return null;
}
