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
        // Check if we're running on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        let metadataUrl;
        
        if (isGitHubPages) {
            metadataUrl = `${RAW_CONTENT_BASE_URL}${bookPath}/metadata.json?t=${Date.now()}`;
        } else {
            metadataUrl = `${BASE_URL}${bookPath}/metadata.json?t=${Date.now()}`;
        }
        
        const bookMeta = (await fetch(metadataUrl).then(r => r.json()))[0];
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

    // Рендерим главы с поддержкой подглав
    let html = '';
    allChapters.forEach(ch => {
        const id = ch.file.replace('.md', '');
        const hasSubchapters = ch.subchapters && ch.subchapters.length > 0;
        const isActive = id === chapterId || (ch.subchapters && ch.subchapters.some(sub => sub.file.replace('.md', '') === chapterId));

        // Главная глава
        html += `<div class="chapter-item ${isActive && !hasSubchapters ? 'active' : ''} ${hasSubchapters ? 'has-subchapters' : ''}" data-chapter-id="${id}">`;
        if (hasSubchapters) {
            html += `<span class="chapter-toggle">▶</span>`;
        }
        html += `${ch.title}</div>`;

        // Подглавы (если есть)
        if (hasSubchapters) {
            const isExpanded = isActive; // Авто-раскрытие если активна
            html += `<div class="subchapter-list ${isExpanded ? 'expanded' : ''}">`;
            ch.subchapters.forEach(sub => {
                const subId = sub.file.replace('.md', '');
                const isSubActive = subId === chapterId;
                html += `<div class="chapter-item subchapter ${isSubActive ? 'active' : ''}" data-chapter-id="${subId}" data-parent-id="${id}">`;
                html += `↳ ${sub.title}</div>`;
            });
            html += `</div>`;
        }
    });

    list.innerHTML = html;

    // Обработчики кликов для главных глав
    list.querySelectorAll('.chapter-item:not(.subchapter)').forEach(item => {
        item.addEventListener('click', () => {
            const hasSubchapters = item.classList.contains('has-subchapters');
            if (hasSubchapters) {
                // Тогл раскрытия подглав
                const subList = item.nextElementSibling;
                if (subList && subList.classList.contains('subchapter-list')) {
                    subList.classList.toggle('expanded');
                    item.querySelector('.chapter-toggle').textContent = 
                        subList.classList.contains('expanded') ? '▼' : '▶';
                }
            } else {
                // Переход к главе
                updateUrl(bookPath, item.dataset.chapterId, edition);
            }
        });
    });

    // Обработчики кликов для подглав
    list.querySelectorAll('.chapter-item.subchapter').forEach(item => {
        item.addEventListener('click', () => {
            updateUrl(bookPath, item.dataset.chapterId, edition);
        });
    });

    // Show read dots for already-read chapters
    if (typeof _updateReadDotsInSidebar === 'function') _updateReadDotsInSidebar();
}

async function renderInternalTOC(bookPath, chapterId, metaSuffix) {
    const tocContainer = document.getElementById('internal-toc');
    try {
        // Check if we're running on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        let url;
        
        if (isGitHubPages) {
            url = `${RAW_CONTENT_BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}${metaSuffix}.json`;
        } else {
            url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}${metaSuffix}.json`;
        }
        
        let res = await fetch(url);
        
        // Если русская версия не найдена, пробуем оригинальный файл метаданных
        if (!res.ok && metaSuffix.includes('-ru')) {
            if (isGitHubPages) {
                url = `${RAW_CONTENT_BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;
            } else {
                url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;
            }
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
        { id: 'starley', n: 'STL', label: 'Starley' },
        { id: 'hebrew', n: 'HE', label: 'Hebrew' }
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
    const tocToggle   = document.getElementById('toc-toggle');
    const focusToggle = document.getElementById('focus-toggle');
    const sidebar     = document.getElementById('reader-sidebar');
    const mainContent = document.getElementById('main-content');

    tocToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('full-width');
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        }
    });

    focusToggle?.addEventListener('click', () => {
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
