const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange', 'teal', 'pink', 'indigo', 'lime', 'brown', 'grey'];
const colorValues = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#badc58', '#a0522d', '#95a5a6'];

document.addEventListener('DOMContentLoaded', () => {
    initColorPalettes();
    initLoader();
    initPreview();
    initExporter();
});

// 1. Initialize color palettes
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

// 2. Load files
async function initLoader() {
    const bookSelect = document.getElementById('select-book');
    const chapterSelect = document.getElementById('select-chapter');
    
    try {
        const res = await fetch(`${BASE_URL}library.json`);
        const data = await res.json();
        
        for (const cat of data.categories) {
            for (const book of cat.books) {
                const bookPath = `${cat.path}/${book.folder}`;
                const metaResponse = await fetch(`${BASE_URL}${bookPath}/metadata.json`);
                if (metaResponse.ok) {
                    const bookData = await metaResponse.json();
                    const bookMeta = Array.isArray(bookData) ? bookData[0] : bookData;
                    const opt = new Option(`${cat.title}: ${bookMeta.title}`, bookPath);
                    opt.dataset.chapters = JSON.stringify(bookMeta.chapters);
                    bookSelect.add(opt);
                }
            }
        }

        bookSelect.onchange = () => {
            chapterSelect.disabled = false;
            chapterSelect.innerHTML = '<option value="">Select a chapter...</option>';
            const selectedOption = bookSelect.options[bookSelect.selectedIndex];
            const chapters = JSON.parse(selectedOption.dataset.chapters || '[]');
            
            chapters.forEach(ch => {
                const chapterId = ch.file.replace('.md', '');
                chapterSelect.add(new Option(ch.title, chapterId));
            });
        };

        document.getElementById('btn-load-cloud').onclick = async () => {
            if(!bookSelect.value || !chapterSelect.value) return alert("Please select a book and chapter");
            const url = `${BASE_URL}${bookSelect.value}/chapters/${chapterSelect.value}/${chapterSelect.value}.md`;
            const res = await fetch(url);
            if(res.ok) {
                document.getElementById('markdown-input').value = await res.text();
                updatePreview();
            } else alert("File not found");
        };
    } catch (e) { console.error(e); }
}

// 3. Apply styles
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
    const res = `\n<div class="med-note ${type}">\n${sel || 'Block text'}\n</div>\n`;
    area.setRangeText(res, area.selectionStart, area.selectionEnd, 'select');
    updatePreview();
}

function addDetails() {
    const area = document.getElementById('markdown-input');
    const title = prompt("Title for the hidden block:", "Classification / Details");
    if (!title) return;
    const sel = area.value.substring(area.selectionStart, area.selectionEnd);
    const res = `\n<details class="med-details">\n<summary>${title}</summary>\n<div class="details-content">\n${sel}\n</div>\n</details>\n`;
    area.setRangeText(res, area.selectionStart, area.selectionEnd, 'select');
    updatePreview();
}

// 4. Preview and Export
function initPreview() {
    const input = document.getElementById('markdown-input');
    input.addEventListener('input', updatePreview);
    updatePreview(); // Initial preview
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
