const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';
const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange', 'teal', 'pink', 'indigo', 'lime', 'brown', 'grey'];
const colorValues = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#badc58', '#a0522d', '#95a5a6'];

document.addEventListener('DOMContentLoaded', () => {
    initColorPalettes();
    initLoader();
    initPreview();
    initExporter();
});

// 1. Инициализация палитр
function initColorPalettes() {
    const ovalGrid = document.getElementById('oval-colors');
    const markerGrid = document.getElementById('marker-colors');
    const textGrid = document.getElementById('text-colors');

    colors.forEach((name, i) => {
        const dot = (type, cls) => {
            const d = document.createElement('div');
            d.className = 'color-dot';
            d.style.backgroundColor = colorValues[i];
            d.onclick = () => applyStyle(type, cls + name);
            return d;
        };
        ovalGrid.appendChild(dot('oval', 'ov-'));
        markerGrid.appendChild(dot('marker', 'm-'));
        textGrid.appendChild(dot('text', 't-'));
    });
}

// 2. Загрузка файлов
async function initLoader() {
    const bSel = document.getElementById('select-book');
    const cSel = document.getElementById('select-chapter');
    
    try {
        const res = await fetch(GITHUB_RAW_BASE + 'library.json');
        const data = await res.json();
        
        data.categories.forEach(cat => {
            cat.books.forEach(book => {
                const opt = new Option(`${cat.title}: ${book.title}`, `${cat.path}/${book.folder}`);
                bSel.add(opt);
            });
        });

        bSel.onchange = () => {
            cSel.disabled = false;
            cSel.innerHTML = '<option value="">Выберите главу...</option>';
            for(let i=1; i<=20; i++) {
                const id = `chapter-${i.toString().padStart(2, '0')}`;
                cSel.add(new Option(`Глава ${i}`, id));
            }
        };

        document.getElementById('btn-load-cloud').onclick = async () => {
            if(!bSel.value || !cSel.value) return alert("Выберите книгу и главу");
            const url = `${GITHUB_RAW_BASE}${bSel.value}/chapters/${cSel.value}/${cSel.value}.md`;
            const res = await fetch(url);
            if(res.ok) {
                document.getElementById('markdown-input').value = await res.text();
                updatePreview();
            } else alert("Файл не найден");
        };
    } catch (e) { console.error(e); }
}

// 3. Применение стилей
function applyStyle(type, className) {
    const area = document.getElementById('markdown-input');
    const sel = area.value.substring(area.selectionStart, area.selectionEnd);
    if(!sel) return;

    let res = '';
    if(type === 'oval') res = `<span class="oval ${className}">${sel}</span>`;
    if(type === 'marker') res = `<mark class="${className}">${sel}</mark>`;
    if(type === 'text') res = `<span class="${className}">${sel}</span>`;

    area.setRangeText(res, area.selectionStart, area.selectionEnd, 'select');
    updatePreview();
}

function wrapInBlock(type) {
    const area = document.getElementById('markdown-input');
    const sel = area.value.substring(area.selectionStart, area.selectionEnd);
    const res = `\n<div class="med-note ${type}">\n${sel || 'Текст блока'}\n</div>\n`;
    area.setRangeText(res, area.selectionStart, area.selectionEnd, 'select');
    updatePreview();
}

function addDetails() {
    const area = document.getElementById('markdown-input');
    const title = prompt("Заголовок скрытого блока:", "Классификация / Подробнее");
    const sel = area.value.substring(area.selectionStart, area.selectionEnd);
    const res = `\n<details class="med-details">\n<summary>${title}</summary>\n<div class="details-content">\n${sel}\n</div>\n</details>\n`;
    area.setRangeText(res, area.selectionStart, area.selectionEnd, 'select');
    updatePreview();
}

// 4. Превью и Экспорт
function initPreview() {
    const input = document.getElementById('markdown-input');
    input.addEventListener('input', updatePreview);
}

function updatePreview() {
    const val = document.getElementById('markdown-input').value;
    document.getElementById('editor-preview').innerHTML = marked.parse(val);
}

function initExporter() {
    document.getElementById('btn-download').onclick = () => {
        const text = document.getElementById('markdown-input').value;
        const filename = document.getElementById('export-filename').value || 'chapter-starley.md';
        const blob = new Blob([text], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };
}
