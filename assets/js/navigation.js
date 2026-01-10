document.addEventListener('DOMContentLoaded', async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const bookPath = params.get('book');
        const chapterId = params.get('chapter') || 'chapter-01';
        const edition = params.get('edition') || 'original';

        if (bookPath) {
            await initReader(bookPath, chapterId, edition);
            setupUIEventListeners();
        }
    } catch (e) {
        console.error('Error processing URL parameters:', e);
    }
});

async function initReader(bookPath, chapterId, edition) {
    try {
        const bookMeta = (await fetch(`${BASE_URL}${bookPath}/metadata.json?t=${Date.now()}`).then(r => r.json()))[0];
        document.getElementById('book-title').textContent = bookMeta.title;

        renderChapterList(bookMeta, bookPath, chapterId, edition);
        renderEditionSelector(bookPath, chapterId, edition);

        const metaSuffix = (edition === 'russian') ? '-ru-metadata' : '-metadata';
        renderInternalTOC(bookPath, chapterId, metaSuffix);

        if (typeof loadChapter === 'function') {
            loadChapter(bookPath, chapterId, edition);
        }

    } catch (e) { console.error("Navigation Error:", e); }
}

function renderChapterList(bookMeta, bookPath, chapterId, edition) {
    const list = document.getElementById('chapter-list');
    const allChapters = [...bookMeta.chapters, ...(bookMeta.appendices || [])];
    
    list.innerHTML = allChapters.map(ch => {
        const id = ch.file.replace('.md', '');
        return `<div class="chapter-item ${id === chapterId ? 'active' : ''}" data-chapter-id="${id}">${ch.title}</div>`;
    }).join('');

    list.querySelectorAll('.chapter-item').forEach(item => {
        item.addEventListener('click', () => {
            updateUrl(bookPath, item.dataset.chapterId, edition);
        });
    });
}

async function renderInternalTOC(bookPath, chapterId, metaSuffix) {
    const tocContainer = document.getElementById('internal-toc');
    try {
        let url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}${metaSuffix}.json`;
        let res = await fetch(url);
        
        // Если русская версия не найдена, пробуем оригинальный файл метаданных
        if (!res.ok && metaSuffix.includes('-ru')) {
            url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;
            res = await fetch(url);
        }

        // Проверяем статус ответа перед парсингом JSON
        if (!res.ok) {
            // Если оба файла метаданных не найдены, просто выходим без ошибки
            tocContainer.innerHTML = '';
            return;
        }

        const meta = await res.json();
        if (meta.sections) {
            tocContainer.innerHTML = `<h3 class="toc-title">In this chapter:</h3>` +
                meta.sections.filter(s => s.level === 2).map(s =>
                    `<a href="#${s.anchor}" class="toc-link">${s.title}</a>`
                ).join('');
        }
    } catch (e) {
        // Логируем ошибку для отладки, но не прерываем работу приложения
        console.warn(`Could not load TOC for chapter ${chapterId}:`, e.message);
        tocContainer.innerHTML = '';
    }
}

function renderEditionSelector(book, chap, current) {
    const container = document.getElementById('version-selector-container');
    container.innerHTML = ''; // Clear previous content

    const editions = [
        { id: 'original', n: 'EN', label: 'English' },
        { id: 'russian', n: 'RU', label: 'Russian' },
        { id: 'starley', n: 'STL', label: 'Starley' }
    ];

    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'version-tabs';

    editions.forEach(edition => {
        const tab = document.createElement('button');
        tab.className = 'version-tab';
        tab.dataset.value = edition.id;
        tab.textContent = edition.n;
        tab.title = edition.label;
        
        if (edition.id === current) {
            tab.classList.add('active');
        }
        
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabsContainer.querySelectorAll('.version-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            updateUrl(book, chap, edition.id);
        });
        
        tabsContainer.appendChild(tab);
    });

    container.appendChild(tabsContainer);
}

function setupUIEventListeners() {
    const tocToggle = document.getElementById('toc-toggle');
    const focusToggle = document.getElementById('focus-toggle');
    const sidebar = document.getElementById('reader-sidebar');
    const mainContent = document.getElementById('main-content');

    tocToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('full-width');
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        }
    });

    focusToggle.addEventListener('click', () => {
        document.body.classList.toggle('focus-mode');
    });

    // Collapse sidebar by default on mobile
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('full-width');
    }
}

function updateUrl(book, chapter, edition) {
    window.location.href = `reader.html?book=${book}&chapter=${chapter}&edition=${edition}`;
}
