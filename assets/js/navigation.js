const GITHUB_RAW = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const chapterId = params.get('chapter') || 'chapter-01';
    const edition = params.get('edition') || 'original';

    if (bookPath) {
        await initApp(bookPath, chapterId, edition);
    }
});

async function initApp(bookPath, chapterId, edition) {
    try {
        const bookMeta = await fetch(`${GITHUB_RAW}${bookPath}/metadata.json?t=${Date.now()}`).then(r => r.json());
        document.getElementById('book-title').textContent = bookMeta.title;

        // 1. Рендер списка глав
        const list = document.getElementById('chapter-list');
        const allChapters = [...bookMeta.chapters, ...(bookMeta.appendices || [])];
        
        list.innerHTML = allChapters.map(ch => {
            const id = ch.file.replace('.md', '');
            return `<div class="chapter-item ${id === chapterId ? 'active' : ''}" 
                    onclick="updateUrl('${bookPath}','${id}','${edition}')">${ch.title}</div>`;
        }).join('');

        // 2. Рендер выбора версий
        renderEditionSelector(bookPath, chapterId, edition);

        // 3. Загрузка метаданных ГЛАВЫ (Оглавление внутри)
        // Если версия RU - пробуем загрузить -ru-metadata.json, если нет - обычный
        const metaSuffix = (edition === 'russian') ? '-ru-metadata' : '-metadata';
        renderInternalTOC(bookPath, chapterId, metaSuffix);

        // 4. Загрузка текста через reader.js
        if (typeof loadChapter === 'function') {
            loadChapter(bookPath, chapterId, edition);
        }

    } catch (e) { console.error("Nav Error:", e); }
}

async function renderInternalTOC(bookPath, chapterId, metaSuffix) {
    const tocContainer = document.getElementById('internal-toc');
    try {
        // Пробуем специфичные метаданные, если не вышло - берем базовые
        let url = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/${chapterId}${metaSuffix}.json`;
        let res = await fetch(url);
        
        if (!res.ok && metaSuffix.includes('-ru')) {
            url = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;
            res = await fetch(url);
        }

        const meta = await res.json();
        if (meta.sections) {
            tocContainer.innerHTML = `<p class="toc-title">${metaSuffix.includes('-ru') ? 'В этой главе:' : 'In this chapter:'}</p>` + 
                meta.sections.filter(s => s.level === 2).map(s => 
                    `<a href="#${s.anchor}" class="toc-link">${s.title}</a>`
                ).join('');
        }
    } catch (e) { tocContainer.innerHTML = ''; }
}

function renderEditionSelector(book, chap, current) {
    const container = document.getElementById('version-selector-container');
    const eds = [
        {id:'original', n:'🇺🇸 Original'},
        {id:'starley', n:'⭐ Starley Ed.'},
        {id:'russian', n:'🇷🇺 Russian Ed.'}
    ];
    container.innerHTML = `<select class="edition-selector" onchange="updateUrl('${book}','${chap}',this.value)">
        ${eds.map(e => `<option value="${e.id}" ${e.id===current?'selected':''}>${e.n}</option>`).join('')}
    </select>`;
}

function updateUrl(b, c, e) {
    window.location.href = `reader.html?book=${b}&chapter=${c}&edition=${e}`;
}
