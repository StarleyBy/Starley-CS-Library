const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange', 'teal', 'pink', 'indigo', 'lime', 'brown', 'grey'];
const colorValues = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#badc58', '#a0522d', '#95a5a6'];
let editor; // Глобальная переменная для CodeMirror

// ==================== ФУНКЦИИ (ДО ИНИЦИАЛИЗАЦИИ) ====================

// Функция для применения стилей через CodeMirror
function applyStyleCM(type, className) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');

    let res = '';
    if(type === 'oval') res = `<span class="${className}">${sel}</span>`;
    if(type === 'marker') res = `<mark class="${className}">${sel}</mark>`;
    if(type === 'text') res = `<span class="${className}">${sel}</span>`;

    editor.replaceSelection(res);
    updatePreview();
}

function wrapInBlock(type) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    const res = `\n<div class="med-note ${type}">\n${sel || 'Block text'}\n</div>\n`;
    editor.replaceSelection(res);
    updatePreview();
}

function wrapInEffect(className) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<span class="${className}">${sel}</span>`;
    editor.replaceSelection(res);
    updatePreview();
}

function wrapInInfoBox(className) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `\n<div class="${className}">\n<p>${sel}</p>\n</div>\n`;
    editor.replaceSelection(res);
    updatePreview();
}

function addDetails() {
    if (!editor) return;
    
    const title = prompt("Title for the hidden block:", "Classification / Details");
    if (!title) return;
    const sel = editor.getSelection();
    const res = `\n<details class="med-details">\n<summary>${title}</summary>\n<div class="details-content">\n${sel}\n</div>\n</details>\n`;
    editor.replaceSelection(res);
    updatePreview();
}

function insertLink() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст ссылки!');
    
    const termName = prompt('Название термина (например: mitral-stenosis):', '');
    if(!termName) return;
    
    const targetId = `def-${termName}`;
    
    const res = `<a href="#${targetId}">${sel} ↓</a>`;
    editor.replaceSelection(res);
    updatePreview();
    
    alert(`✅ Создана ссылка на термин!\n\nТеперь в месте определения:\n1. Выделите заголовок\n2. Нажмите "⚓ Якорь определения"\n3. Введите: ${termName}\n4. Нажмите "↩️ Умная кнопка назад"`);
}

function insertAnchor() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите заголовок термина!');
    
    const termName = prompt('Название термина (например: mitral-stenosis):', '');
    if(!termName) return;
    
    const anchorId = `def-${termName}`;
    
    const res = `<span id="${anchorId}">${sel}</span>`;
    editor.replaceSelection(res);
    updatePreview();
    
    alert(`✅ Создан якорь определения!\n\nID: ${anchorId}\n\nТеперь добавьте умную кнопку возврата:\nПоставьте курсор после заголовка и нажмите "↩️ Умная кнопка назад"`);
}

function insertBackLink() {
    if (!editor) return;
    
    const res = ` <a href="#" data-back="true" style="font-size:0.8em; color:#7f8c8d; text-decoration:none;">↩️ назад</a>`;
    editor.replaceSelection(res);
    updatePreview();
    
    alert('✅ Добавлена умная кнопка возврата!\n\nОна автоматически вернет к ЛЮБОЙ ссылке, откуда пришел пользователь.\n\nРаботает через историю браузера - не требует указания ID.');
}

// Вставка Docusaurus-style блоков
function insertAdmonition(type, defaultTitle) {
    if (!editor) {
        alert('⏳ Редактор еще загружается, попробуйте через секунду');
        return;
    }
    
    const title = prompt(`Заголовок блока:`, defaultTitle);
    if (title === null) return; // Отменено
    
    const sel = editor.getSelection();
    const content = sel || 'Введите текст блока здесь';
    
    const res = `
<div class="admonition admonition-${type}">
  <div class="admonition-title">${title}</div>
  <div class="admonition-content">
${content}
  </div>
</div>
`;
    
    editor.replaceSelection(res);
    updatePreview();
}

// Улучшенная функция updatePreview с сохранением состояния
function updatePreview() {
    const val = editor ? editor.getValue() : document.getElementById('markdown-input').value;
    const previewContainer = document.getElementById('editor-preview');
    
    // СОХРАНЯЕМ состояние развернутых блоков ПЕРЕД обновлением
    const expandedStates = new Map();
    
    // Собираем все развернутые details
    previewContainer.querySelectorAll('details[open]').forEach((details) => {
        const summary = details.querySelector('summary');
        if (summary) {
            expandedStates.set(summary.textContent.trim(), true);
        }
    });
    
    // Собираем все развернутые вложенные admonition блоки
    previewContainer.querySelectorAll('.admonition.expanded').forEach(block => {
        const title = block.querySelector('.admonition-title');
        if (title) {
            expandedStates.set(title.textContent.trim(), true);
        }
    });
    
    // Обновляем HTML
    previewContainer.innerHTML = marked.parse(val);
    
    // ВОССТАНАВЛИВАЕМ состояние ПОСЛЕ обновления
    
    // Восстанавливаем details (принудительно открываем все в редакторе)
    previewContainer.querySelectorAll('details').forEach(details => {
        details.setAttribute('open', '');
    });
    
    // Восстанавливаем admonition блоки (принудительно все развернуты)
    previewContainer.querySelectorAll('.admonition').forEach(block => {
        block.classList.add('expanded');
    });
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
    initColorPalettes();
    initLoader();
    initExporter();
    
    setTimeout(() => {
        initPreview();
    }, 100);
});

// 1. Initialize color palettes
function initColorPalettes() {
    const ovalGrid = document.getElementById('oval-colors');
    const markerGrid = document.getElementById('marker-colors');
    const textGrid = document.getElementById('text-colors');

    colors.forEach((name, i) => {
        const ovalDot = document.createElement('div');
        ovalDot.className = 'color-dot';
        ovalDot.style.backgroundColor = colorValues[i];
        ovalDot.title = name;
        ovalDot.onclick = () => applyStyleCM('oval', 'ov-' + name);
        ovalGrid.appendChild(ovalDot);
        
        const markerDot = document.createElement('div');
        markerDot.className = 'color-dot';
        markerDot.style.backgroundColor = colorValues[i];
        markerDot.title = name;
        markerDot.onclick = () => applyStyleCM('marker', 'm-' + name);
        markerGrid.appendChild(markerDot);
        
        const textDot = document.createElement('div');
        textDot.className = 'color-dot';
        textDot.style.backgroundColor = colorValues[i];
        textDot.title = name;
        textDot.onclick = () => applyStyleCM('text', 't-' + name);
        textGrid.appendChild(textDot);
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

        // Функция загрузки файла
        async function loadFile(version) {
            if(!bookSelect.value || !chapterSelect.value) {
                return alert("Please select a book and chapter");
            }
            
            let filename = chapterSelect.value + '.md';
            
            if (version === 'russian') {
                filename = chapterSelect.value + '-ru.md';
            } else if (version === 'starley') {
                filename = chapterSelect.value + '-starley.md';
            }
            
            const url = `${BASE_URL}${bookSelect.value}/chapters/${chapterSelect.value}/${filename}`;
            
            try {
                const res = await fetch(url);
                if(res.ok) {
                    const text = await res.text();
                    if (editor) {
                        editor.setValue(text);
                    } else {
                        document.getElementById('markdown-input').value = text;
                    }
                    updatePreview();
                    
                    document.getElementById('export-filename').value = filename;
                } else {
                    alert(`❌ File not found: ${filename}\n\nURL: ${url}`);
                }
            } catch (error) {
                alert(`❌ Error loading file: ${error.message}`);
            }
        }
        
        // Обработчики кнопок загрузки
        document.getElementById('btn-load-original').onclick = () => loadFile('original');
        document.getElementById('btn-load-russian').onclick = () => loadFile('russian');
        document.getElementById('btn-load-starley').onclick = () => loadFile('starley');
        
    } catch (e) { 
        console.error('Error in initLoader:', e); 
    }
}

// 3. Preview
function initPreview() {
    const textarea = document.getElementById('markdown-input');
    
    editor = CodeMirror.fromTextArea(textarea, {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        indentUnit: 2,
        tabSize: 2,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoCloseTags: true
    });
    
    // ========== ПОДСВЕТКА ЦИФР ==========
    CodeMirror.defineMode("highlightNumbers", function(config, parserConfig) {
        return {
            token: function(stream) {
                // Если символ - цифра
                if (stream.match(/\d+/)) {
                    return "number-highlight"; // CSS класс для подсветки
                }
                // Иначе пропускаем символ
                stream.next();
                return null;
            }
        };
    });
    
    // Накладываем overlay mode поверх htmlmixed
    editor.addOverlay({
        token: function(stream) {
            if (stream.match(/\d+/)) {
                return "number-highlight";
            }
            stream.next();
            return null;
        }
    });
    
    editor.on('change', function() {
        updatePreview();
    });
    
    updatePreview();
}

// 4. Export
function initExporter() {
    document.getElementById('btn-download').onclick = () => {
        const text = editor ? editor.getValue() : document.getElementById('markdown-input').value;
        const filename = document.getElementById('export-filename').value || 'chapter-starley.md';
        const blob = new Blob([text], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };
}
