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
        // 1. Загружаем метаданные КНИГИ (из её папки)
        const bookMeta = await fetch(`${GITHUB_RAW}${bookPath}/metadata.json?t=${Date.now()}`).then(r => r.json());
        document.getElementById('book-title').textContent = bookMeta.title;

        // 2. Строим список глав
        const list = document.getElementById('chapter-list');
        list.innerHTML = bookMeta.chapters.map(ch => {
            const id = ch.file.replace('.md', '');
            return `<div class="chapter-item ${id === chapterId ? 'active' : ''}" 
                    onclick="updateUrl('${bookPath}','${id}','${edition}')">${ch.title}</div>`;
        }).join('');

        // 3. Загружаем метаданные ГЛАВЫ (для внутреннего оглавления)
        const chapMeta = await fetch(`${GITHUB_RAW}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`).then(r => r.json());
        const internalToc = document.getElementById('internal-toc');
        if(chapMeta.sections) {
            internalToc.innerHTML = '<h4>В этой главе:</h4>' + chapMeta.sections.filter(s => s.level <= 2).map(s => 
                `<a href="#${s.anchor}" class="toc-link">${s.title}</a>`
            ).join('');
        }

        // 4. Селектор версий + Russian Edition
        renderEditions(bookPath, chapterId, edition);

        // 5. Загружаем текст
        loadChapter(bookPath, chapterId, edition);

    } catch (e) { console.error("Nav Error:", e); }
}

function renderEditions(book, chap, current) {
    const container = document.getElementById('version-selector-container');
    const eds = [
        {id:'original', n:'🇺🇸 Original'},
        {id:'starley', n:'⭐ Starley Edition'},
        {id:'russian', n:'🇷🇺 Russian Edition'}
    ];
    container.innerHTML = `<select class="edition-selector" onchange="updateUrl('${book}','${chap}',this.value)">
        ${eds.map(e => `<option value="${e.id}" ${e.id===current?'selected':''}>${e.n}</option>`).join('')}
    </select>`;

    if(current === 'russian') enableTranslation();
}

function updateUrl(b, c, e) {
    window.location.href = `reader.html?book=${b}&chapter=${c}&edition=${e}`;
}

function enableTranslation() {
    const s = document.createElement('script');
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
    window.googleTranslateElementInit = () => {
        new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'ru', autoDisplay: true}, 'google_translate_element');
        setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if(select) { select.value = 'ru'; select.dispatchEvent(new Event('change')); }
        }, 1000);
    }
}
