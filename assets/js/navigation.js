document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const chapterId = params.get('chapter') || 'chapter-01';
    const edition = params.get('edition') || 'original';

    if (bookPath) {
        await initReader(bookPath, chapterId, edition);
        setupUIEventListeners();
    }
});

async function initReader(bookPath, chapterId, edition) {
    try {
        const bookMeta = await fetch(`${BASE_URL}${bookPath}/metadata.json?t=${Date.now()}`).then(r => r.json());
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
        
        if (!res.ok && metaSuffix.includes('-ru')) {
            url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;
            res = await fetch(url);
        }

        const meta = await res.json();
        if (meta.sections) {
            tocContainer.innerHTML = `<h3 class="toc-title">In this chapter:</h3>` + 
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
    const select = document.createElement('select');
    select.className = 'edition-selector';
    select.innerHTML = `${eds.map(e => `<option value="${e.id}" ${e.id===current?'selected':''}>${e.n}</option>`).join('')}`;
    select.addEventListener('change', (e) => {
        updateUrl(book, chap, e.target.value);
    });
    container.innerHTML = '';
    container.appendChild(select);
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
