const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange', 'teal', 'pink', 'indigo', 'lime', 'brown', 'grey'];
const colorValues = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#badc58', '#a0522d', '#95a5a6'];
const symbols = ['α', 'β', 'γ', '🔔', '🔎', '💡', '🔦', '📕', '📖', '📚', '📓', '📰', '✏', '📌', '🗝', '🛠', '💉', '💊', '🚫', '❓', '❗', '▶', '⏹', '⏺', '↑', '→', '↓', '●', '★', '☆', '☑', '☛', '☠', '✎', '✦', '✪', '✹', '✿', '❀', '❁', '❂', '✏︎', '⚛︎', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'];
let editor; // Глобальная переменная для CodeMirror

// ==================== ФУНКЦИИ (ДО ИНИЦИАЛИЗАЦИИ) ====================

// Функция для вставки символа в позицию курсора
function insertSymbol(symbol) {
    if (!editor) return;
    
    editor.replaceSelection(symbol);
    editor.focus();
    updatePreview();
}

// Функция переключения панели символов
function toggleSymbolsPanel() {
    const panel = document.getElementById('symbols-panel');
    const toggle = document.getElementById('symbols-toggle');
    
    panel.classList.toggle('expanded');
    toggle.classList.toggle('rotated');
}

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

// Функции для размера шрифта
function wrapInFontSize(fontSize) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<span style="font-size:${fontSize}%">${sel}</span>`;
    editor.replaceSelection(res);
    updatePreview();
}

// Функции для заголовков
function wrapInHeader(headerLevel) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    const headerTag = `h${headerLevel}`;
    const res = `\n<${headerTag}>${sel || 'Заголовок'}</${headerTag}>\n`;
    editor.replaceSelection(res);
    updatePreview();
}

// Функции для форматирования текста
function wrapInSuperscript() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<sup>${sel}</sup>`;
    editor.replaceSelection(res);
    updatePreview();
}

function wrapInSubscript() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<sub>${sel}</sub>`;
    editor.replaceSelection(res);
    updatePreview();
}

function wrapInBold() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<strong>${sel}</strong>`;
    editor.replaceSelection(res);
    updatePreview();
}

function wrapInItalic() {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<em>${sel}</em>`;
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
    
    // --- Protect LaTeX math before marked.parse ---
    let md = val;

    // --- Adjust image paths in Markdown ---
    const bookPath = document.getElementById('select-book').value;
    const chapterId = document.getElementById('select-chapter').value;
    if (bookPath && chapterId) {
        let parentFolder = chapterId;
        const subchapterMatch = chapterId.match(/^(chapter-\d+)-\d+$/);
        if (subchapterMatch) {
            parentFolder = subchapterMatch[1];
        }

        const isGitHubPages = window.location.hostname.includes('github.io');
        const imagesBase = (isGitHubPages && typeof RAW_CONTENT_BASE_URL !== 'undefined') 
            ? `${RAW_CONTENT_BASE_URL}${bookPath}/chapters/${parentFolder}/images/`
            : `${BASE_URL}${bookPath}/chapters/${parentFolder}/images/`;

        // Prefix relative markdown images ![] (src)
        md = md.replace(/!\[(.*?)\]\(((?!http|data:|\/)(.*?))\)/g, (match, alt, src) => {
            return `![${alt}](${imagesBase}${src})`;
        });
        
        // Also handle HTML <img> tags in MD
        md = md.replace(/<img([^>]+)src=["']((?!http|data:|\/)[^"']+)["']([^>]*?)>/g, (match, before, src, after) => {
            return `<img${before}src="${imagesBase}${src}"${after}>`;
        });
    }

    const mathStore = [];
    function storeMath(tex, display) {
        const id = '\x02MATH' + mathStore.length + '\x03';
        let safeTex = tex;
        // % is LaTeX comment char — escape unescaped %
        safeTex = safeTex.replace(/(?<!\\)%/g, '\\%');
        // Unicode minus − (U+2212) → ASCII minus (KaTeX needs ASCII)
        safeTex = safeTex.replace(/−/g, '-');
        // Unicode superscript digits outside \text → ^{n}
        const supMap = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
        safeTex = safeTex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^{' + m.split('').map(c => supMap[c]||c).join('') + '}');
        mathStore.push({ id, tex: safeTex, display });
        return id;
    }
    // \[...\] display (must be before $$ to avoid conflicts)
    md = md.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, tex) => storeMath(tex, true));
    // $$...$$ display
    md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => storeMath(tex, true));
    // \(...\) inline
    md = md.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, tex) => storeMath(tex, false));
    // $...$ inline
    md = md.replace(/\$([^\n$][^$]*?)\$/g, (_, tex) => storeMath(tex, false));

    // Обновляем HTML
    previewContainer.innerHTML = marked.parse(md);

    // --- Restore and render math ---
    if (mathStore.length > 0 && typeof katex !== 'undefined') {
        let html = previewContainer.innerHTML;
        mathStore.forEach(({ id, tex, display }) => {
            if (html.includes(id)) {
                let rendered;
                try {
                    rendered = katex.renderToString(tex, { displayMode: display, throwOnError: false, errorColor: '#e53935' });
                } catch(e) {
                    rendered = `<span style="color:#e53935">[math error]</span>`;
                }
                html = html.split(id).join(rendered);
            }
        });
        previewContainer.innerHTML = html;
    }

    // --- Post-render styling ---
    previewContainer.querySelectorAll('img').forEach(img => {
        img.classList.add('med-img');
    });
    
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
    initSymbolsPanel();
    initLoader();
    initExporter();
    initGitHubSave();
    initFormulaEditor();
    initHeaderToggle();
    initToolGroupPins();
    initSync();
    _initSynthesis();

    setTimeout(() => {
        initPreview();
        if (typeof katex === 'undefined') {
            const check = setInterval(() => {
                if (typeof katex !== 'undefined') {
                    clearInterval(check);
                    updatePreview();
                }
            }, 100);
        }
    }, 100);
    });

    // ==================== CONFIG SYNTHESIS ====================

    function _initSynthesis() {
    const btn = document.getElementById('btn-generate-config');
    const fileInput = document.getElementById('syn-toc-file');
    const status = document.getElementById('syn-status');

    if (!btn || !fileInput) return;

    btn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return alert('Please select a TOC XML/TXT file first');

        const title = document.getElementById('syn-book-title').value.trim() || 'Untitled Book';
        const authors = document.getElementById('syn-book-authors').value.split(',').map(s => s.trim()).filter(Boolean);
        const categories = document.getElementById('syn-book-categories').value.split(',').map(s => s.trim()).filter(Boolean);

        status.textContent = '⏳ Processing...';

        try {
            const text = await file.text();
            let result;

            if (file.name.endsWith('.xml') || text.trim().startsWith('<')) {
                result = _parseTocXml(text, title, authors, categories);
            } else {
                result = _parseTocTxt(text, title, authors, categories);
            }

            if (editor) {
                editor.setValue(result);
                editor.setOption('mode', 'markdown');
            }
            updatePreview();
            status.textContent = '✅ Synthesis complete!';
            status.style.color = '#4caf50';

        } catch (e) {
            status.textContent = `❌ Error: ${e.message}`;
            status.style.color = '#e53935';
            console.error(e);
        }
    });
    }

    function _parseTocXml(xmlText, title, authors, categories) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const rootBookmarks = xmlDoc.querySelectorAll('bookmarks > bookmark');

    if (rootBookmarks.length === 0) throw new Error('No <bookmark> tags found in root <bookmarks>');

    let output = `filename: book.pdf\n`;
    output += `title: ${title}\n`;
    output += `author: ${authors.join(', ')}\n`;
    output += `categories: ${categories.join(', ')}\n`;
    output += `chapters:\n`;

    let chapterCount = 0;
    let appendixCount = 0;
    
    // Expanded words to skip
    const skipWords = [
        'cover', 'title page', 'copyright', 'contents', 'contributors', 'preface', 
        'abbreviations', 'index', 'indices', 'table of contents', 'acknowledgments', 
        'editors', 'front matter', 'dedication'
    ];

    rootBookmarks.forEach((bm) => {
        let bmTitle = (bm.getAttribute('title') || 'Untitled').trim();
        const bmPage = bm.getAttribute('page') || '0';
        const subBookmarks = bm.querySelectorAll(':scope > bookmark');
        
        // Skip if title matches any skipWords
        if (skipWords.some(word => bmTitle.toLowerCase().includes(word))) {
            return;
        }

        // --- MERGING LOGIC ---
        // If this bookmark's title is just a number (e.g., "1") AND it has a child
        // AND that child's title starts with the same number or is descriptive,
        // we use the child's title instead of the number.
        if (bmTitle.match(/^\d+$/) && subBookmarks.length > 0) {
            const firstSubTitle = (subBookmarks[0].getAttribute('title') || '').trim();
            // If sub-title contains the title we want, merge them
            bmTitle = firstSubTitle;
        }

        // Estimate page range
        let nextBm = bm.nextElementSibling;
        let pageRange = bmPage;
        if (nextBm) {
            let nextPage = nextBm.getAttribute('page');
            if (nextPage) pageRange = `${bmPage}-${parseInt(nextPage)-1}`;
        }

        if (bmTitle.toLowerCase().includes('appendix')) {
            appendixCount++;
            output += `Appendix ${appendixCount}|${bmTitle}|${pageRange}\n`;
        } else {
            chapterCount++;
            output += `${chapterCount}|${bmTitle}|${pageRange}\n`;
        }
        
        // Only show subchapters if we DIDN'T merge the first one into the parent
        // Or show all subchapters starting from index 1 if we merged index 0
        const isMerged = (bm.getAttribute('title') || '').trim().match(/^\d+$/) && subBookmarks.length > 0;
        
        subBookmarks.forEach((sub, idx) => {
            if (isMerged && idx === 0) return; // Skip first child as it's now the parent title
            const subTitle = (sub.getAttribute('title') || 'Untitled').trim();
            const subPage = sub.getAttribute('page') || '0';
            
            let subPageRange = subPage;
            let nextSub = subBookmarks[idx + 1];
            if (nextSub) {
                let nextSubPage = nextSub.getAttribute('page');
                if (nextSubPage) subPageRange = `${subPage}-${parseInt(nextSubPage)-1}`;
            } else if (nextBm) {
                let nextParentPage = nextBm.getAttribute('page');
                if (nextParentPage) subPageRange = `${subPage}-${parseInt(nextParentPage)-1}`;
            }

            output += `  ${chapterCount}.${idx + (isMerged ? 0 : 1)}|${subTitle}|${subPageRange}\n`;
        });
    });

    return output;
    }

    function _parseTocTxt(txt, title, authors, categories) {
        let output = `filename: book.pdf\n`;
        output += `title: ${title}\n`;
        output += `author: ${authors.join(', ')}\n`;
        output += `categories: ${categories.join(', ')}\n`;
        output += `chapters:\n`;
        
        const lines = txt.split('\n').filter(l => l.trim());
        
        if (!txt.includes('|')) {
            lines.forEach((l, i) => {
                output += `${i+1}|${l.trim()}|0\n`;
            });
            return output;
        }

        const parsed = lines.map(line => {
            const parts = line.split('|').map(s => s.trim());
            if (parts.length < 3) return { raw: line };
            return {
                indent: line.match(/^\s*/)[0],
                num: parts[0],
                title: parts[1],
                page: parts[2],
                hasRange: parts[2].includes('-')
            };
        });

        parsed.forEach((item, i) => {
            if (!item.num) {
                output += (item.raw || '') + '\n';
                return;
            }

            let pageRange = item.page;
            if (!item.hasRange) {
                let next = parsed.slice(i + 1).find(it => it.num && it.page);
                if (next) {
                    let nextPage = next.page.split('-')[0];
                    if (nextPage && !isNaN(parseInt(nextPage))) {
                        pageRange = `${item.page}-${parseInt(nextPage)-1}`;
                    }
                }
            }
            output += `${item.indent}${item.num}|${item.title}|${pageRange}\n`;
        });
        
        return output;
    }

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

// 2. Initialize symbols panel
function initSymbolsPanel() {
    const symbolsPanel = document.getElementById('symbols-panel');
    if (!symbolsPanel) return;

    // Render directly — outer tool-group hover handles show/hide
    symbolsPanel.innerHTML = '';
    symbols.forEach(symbol => {
        const btn = document.createElement('button');
        btn.className = 'symbol-btn';
        btn.textContent = symbol;
        btn.title = `Insert ${symbol}`;
        btn.onclick = () => insertSymbol(symbol);
        symbolsPanel.appendChild(btn);
    });
}

// 3. Load files
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
                    opt.dataset.chapters = JSON.stringify(bookMeta.chapters || []);
                    opt.dataset.appendices = JSON.stringify(bookMeta.appendices || []);
                    bookSelect.add(opt);
                }
            }
        }

        bookSelect.onchange = () => {
            chapterSelect.disabled = false;
            chapterSelect.innerHTML = '<option value="">Select a chapter...</option>';
            const selectedOption = bookSelect.options[bookSelect.selectedIndex];
            const chapters = JSON.parse(selectedOption.dataset.chapters || '[]');
            const appendices = JSON.parse(selectedOption.dataset.appendices || '[]');
            
            chapters.forEach(ch => {
                const chapterId = ch.file.replace('.md', '');
                chapterSelect.add(new Option(ch.title, chapterId));
            });

            if (appendices.length > 0) {
                const group = document.createElement('optgroup');
                group.label = 'Appendices';
                appendices.forEach(app => {
                    const appId = app.file.replace('.md', '');
                    group.appendChild(new Option(app.title, appId));
                });
                chapterSelect.add(group);
            }
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
            } else if (version === 'hebrew') {
                filename = chapterSelect.value + '-he.md';
            }
            
            const url = `${BASE_URL}${bookSelect.value}/chapters/${chapterSelect.value}/${filename}`;
            
            try {
                const res = await fetch(url);
                if(res.ok) {
                    const text = await res.text();
                    if (editor) {
                        editor.setValue(text);
                        
                        // Принудительно переустанавливаем настройки fold после загрузки
                        setTimeout(() => {
                            editor.setOption('foldGutter', true);
                            editor.setOption('gutters', ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']);
                            editor.refresh();
                            console.log('✅ File loaded, fold gutters reinitialized');
                        }, 100);
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
        document.getElementById('btn-load-hebrew').onclick = () => loadFile('hebrew');
        
    } catch (e) { 
        console.error('Error in initLoader:', e); 
    }
}

// 4. Preview
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
        autoCloseTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    
    // ========== ПОДСВЕТКА ЦИФР ==========
    editor.addOverlay({
        token: function(stream) {
            if (stream.match(/\d+/)) {
                return "number-highlight";
            }
            stream.next();
            return null;
        }
    });
    
    // ========== НАСТРОЙКА СВОРАЧИВАНИЯ БЛОКОВ ==========
    CodeMirror.registerHelper("fold", "details", function(cm, start) {
        const line = cm.getLine(start.line);
        
        if (!line.includes('<details>')) {
            return null;
        }
        
        let level = 0;
        let endLine = start.line;
        
        for (let i = start.line; i < cm.lineCount(); i++) {
            const currentLine = cm.getLine(i);
            
            const openMatches = currentLine.match(/<details>/g);
            if (openMatches) {
                level += openMatches.length;
            }
            
            const closeMatches = currentLine.match(/<\/details>/g);
            if (closeMatches) {
                level -= closeMatches.length;
            }
            
            if (level === 0 && i > start.line) {
                endLine = i;
                break;
            }
        }
        
        if (endLine > start.line) {
            return {
                from: CodeMirror.Pos(start.line, line.length),
                to: CodeMirror.Pos(endLine, cm.getLine(endLine).length)
            };
        }
        
        return null;
    });
    
    editor.setOption("foldOptions", {
        widget: "↔",
        scanUp: false,
        rangeFinder: CodeMirror.fold.details
    });
    
    // Добавляем команды для сворачивания/разворачивания всех блоков
    CodeMirror.commands.foldAll = function(cm) {
        for (let i = 0; i < cm.lineCount(); i++) {
            const line = cm.getLine(i);
            if (line.includes('<details>')) {
                cm.foldCode(CodeMirror.Pos(i, 0), null, "fold");
            }
        }
    };
    
    CodeMirror.commands.unfoldAll = function(cm) {
        for (let i = 0; i < cm.lineCount(); i++) {
            cm.foldCode(CodeMirror.Pos(i, 0), null, "unfold");
        }
    };
    
    // ========== ОБНОВЛЕНИЕ PREVIEW ==========
    editor.on('change', function() {
        updatePreview();
    });

    // Attach sync listener if sync was already enabled
    if (typeof window._attachSyncToEditor === 'function') {
        window._attachSyncToEditor(editor);
    }
    
    // Первоначальное обновление preview
    updatePreview();
}

// 5. Export
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

// ==========================================================================
//  FORMULA INSERTION HELPERS
// ==========================================================================

function insertFormulaBlock() {
    if (!editor) return;
    const sel = editor.getSelection();
    const tex = sel || 'E = mc^2';
    editor.replaceSelection(`\n$$\n${tex}\n$$\n`);
    updatePreview();
}

function insertFormulaInline() {
    if (!editor) return;
    const sel = editor.getSelection();
    const tex = sel || 'x^2 + y^2';
    editor.replaceSelection(`$${tex}$`);
    updatePreview();
}

const FORMULA_TEMPLATES = {
    fraction:    '\\frac{a}{b}',
    sqrt:        '\\sqrt{x}',
    sum:         '\\sum_{i=0}^{n} x_i',
    integral:    '\\int_{a}^{b} f(x)\\,dx',
    subscript:   'x_{n}',
    superscript: 'x^{n}',
};

function insertFormulaTemplate(name) {
    if (!editor) return;
    const tpl = FORMULA_TEMPLATES[name] || name;
    editor.replaceSelection(`$$${tpl}$$`);
    updatePreview();
}

// ==========================================================================
//  FORMULA EDITOR MODAL (with live preview)
// ==========================================================================

function initFormulaEditor() {
    const modal     = document.getElementById('formula-modal');
    const input     = document.getElementById('formula-input');
    const preview   = document.getElementById('formula-preview');
    const errorEl   = document.getElementById('formula-error');
    const closeBtn  = document.getElementById('formula-modal-close');
    const cancelBtn = document.getElementById('formula-btn-cancel');
    const insertBtn = document.getElementById('formula-btn-insert');
    const dispCheck = document.getElementById('formula-display-mode');

    if (!modal) return;

    // Live preview as user types
    let previewTimer = null;
    function renderPreview() {
        const tex = input.value.trim();
        if (!tex) { preview.innerHTML = '<span style="color:#888">Enter LaTeX above</span>'; errorEl.style.display='none'; return; }
        try {
            preview.innerHTML = katex.renderToString(tex, {
                displayMode: dispCheck.checked,
                throwOnError: true,
            });
            errorEl.style.display = 'none';
        } catch(e) {
            preview.innerHTML = '';
            errorEl.textContent = e.message;
            errorEl.style.display = 'block';
        }
    }

    input.addEventListener('input', () => { clearTimeout(previewTimer); previewTimer = setTimeout(renderPreview, 180); });
    dispCheck.addEventListener('change', renderPreview);

    // Quick-insert buttons inside modal append to textarea
    window.formulaInsert = function(snippet) {
        const start = input.selectionStart;
        const end   = input.selectionEnd;
        const val   = input.value;
        input.value = val.slice(0, start) + snippet + val.slice(end);
        input.selectionStart = input.selectionEnd = start + snippet.length;
        input.focus();
        renderPreview();
    };

    // Close
    function closeModal() { modal.style.display = 'none'; }
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.querySelector('div').addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Insert into editor
    insertBtn.addEventListener('click', () => {
        const tex = input.value.trim();
        if (!tex) return;
        if (!editor) return;
        const delim = dispCheck.checked ? `\n$$\n${tex}\n$$\n` : `$${tex}$`;
        editor.replaceSelection(delim);
        updatePreview();
        closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
}

function openFormulaEditor() {
    const modal = document.getElementById('formula-modal');
    const input = document.getElementById('formula-input');
    if (!modal) return;

    // Pre-fill with current selection if it looks like math
    if (editor) {
        const sel = editor.getSelection().trim();
        if (sel) input.value = sel.replace(/^\$+|\$+$/g, '').trim();
    }

    modal.style.display = 'flex';
    setTimeout(() => { input.focus(); input.dispatchEvent(new Event('input')); }, 50);
}

// ==========================================================================
//  GITHUB SAVE
// ==========================================================================

function initGitHubSave() {
    const btn       = document.getElementById('btn-save-github');
    const tokenRow  = document.getElementById('github-token-row');
    const tokenInput= document.getElementById('github-token-input');
    const saveToken = document.getElementById('btn-save-token');
    const status    = document.getElementById('github-status');

    if (!btn) return;

    // Show stored token state
    const stored = localStorage.getItem('gh_token');
    if (stored) {
        status.textContent = '🔑 Token saved';
        status.style.color = '#4caf50';
    }

    btn.addEventListener('click', () => {
        const token = localStorage.getItem('gh_token');
        if (!token) {
            tokenRow.style.display = 'block';
            tokenInput.focus();
            return;
        }
        _doGitHubSave(token, status);
    });

    saveToken.addEventListener('click', () => {
        const val = tokenInput.value.trim();
        if (!val) return alert('Enter a token first');
        localStorage.setItem('gh_token', val);
        tokenRow.style.display = 'none';
        status.textContent = '🔑 Token saved';
        status.style.color = '#4caf50';
        tokenInput.value = '';
        // Immediately try to save
        _doGitHubSave(val, status);
    });
}

async function _doGitHubSave(token, statusEl) {
    // Derive repo/path from BASE_URL and current filename
    // Expected BASE_URL format: https://raw.githubusercontent.com/OWNER/REPO/BRANCH/
    const rawBase = (typeof RAW_CONTENT_BASE_URL !== 'undefined') ? RAW_CONTENT_BASE_URL : BASE_URL;
    const match = rawBase.match(/github\.com\/([^/]+)\/([^/]+)\/([^/]+)\//);
    if (!match) return alert('Cannot determine repo from BASE_URL. Check config.js.');

    const [, owner, repo, branch] = match;
    const filename = document.getElementById('export-filename').value.trim();
    if (!filename) return alert('Set a filename first (e.g. chapter-01-starley.md)');

    const bookSelect    = document.getElementById('select-book');
    const chapterSelect = document.getElementById('select-chapter');
    if (!bookSelect.value || !chapterSelect.value) return alert('Select a book and chapter first');

    const content = editor ? editor.getValue() : document.getElementById('markdown-input').value;
    const path = `${bookSelect.value}/chapters/${chapterSelect.value}/${filename}`;

    statusEl.textContent = '⏳ Saving...';
    statusEl.style.color = '#f9a825';

    try {
        // 1. Get current file SHA (needed for update)
        const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };

        let sha = null;
        const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers });
        if (getRes.ok) {
            const data = await getRes.json();
            sha = data.sha;
        } else if (getRes.status !== 404) {
            throw new Error(`GitHub API error: ${getRes.status} ${getRes.statusText}`);
        }

        // 2. PUT file
        const body = {
            message: `Update ${filename} via Starley Editor`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch,
            ...(sha ? { sha } : {}),
        };

        const putRes = await fetch(apiBase, {
            method: 'PUT',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || putRes.statusText);
        }

        const result = await putRes.json();
        const commitUrl = result.commit?.html_url || '#';
        statusEl.innerHTML = `✅ Saved! <a href="${commitUrl}" target="_blank" style="color:#4fc3f7">View commit</a>`;
        statusEl.style.color = '#4caf50';

    } catch(e) {
        statusEl.textContent = `❌ ${e.message}`;
        statusEl.style.color = '#e53935';
        console.error('GitHub save error:', e);
    }
}

// Formula palette tab switcher
function fmTab(clickedTab, panelId) {
    // Deactivate all tabs and panels
    document.querySelectorAll('.fm-tab').forEach(t => t.classList.remove('fm-tab-active'));
    document.querySelectorAll('.fm-panel').forEach(p => p.classList.remove('fm-panel-active'));
    // Activate clicked
    clickedTab.classList.add('fm-tab-active');
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('fm-panel-active');
}

// ==========================================================================
//  HEADER TOGGLE
// ==========================================================================

function initHeaderToggle() {
    const header   = document.getElementById('editor-header');
    const colBtn   = document.getElementById('header-toggle');
    const showTab  = document.getElementById('header-show-tab');

    if (!header || !colBtn) return;

    // Restore saved state
    if (localStorage.getItem('editor_header_hidden') === '1') {
        _hideHeader(header, colBtn, showTab);
    }

    colBtn.addEventListener('click', () => {
        if (header.classList.contains('header-hidden')) {
            _showHeader(header, colBtn, showTab);
        } else {
            _hideHeader(header, colBtn, showTab);
        }
    });

    showTab?.addEventListener('click', () => {
        _showHeader(header, colBtn, showTab);
    });
}

function _hideHeader(header, btn, tab) {
    header.classList.add('header-hidden');
    document.documentElement.classList.add('header-hidden');
    if (btn) btn.textContent = '▼';
    if (tab) tab.style.display = 'block';
    localStorage.setItem('editor_header_hidden', '1');
}

function _showHeader(header, btn, tab) {
    header.classList.remove('header-hidden');
    document.documentElement.classList.remove('header-hidden');
    if (btn) btn.textContent = '▲';
    if (tab) tab.style.display = 'none';
    localStorage.setItem('editor_header_hidden', '0');
}

// ==========================================================================
//  TOOL GROUP PIN BUTTONS
// ==========================================================================

function initToolGroupPins() {
    const groups = document.querySelectorAll('.tool-group');
    
    groups.forEach(group => {
        const header = group.querySelector('h4');
        const pinBtn = group.querySelector('.tool-group-pin');
        if (!header) return;

        const groupName = header.textContent.trim().replace(/[^\x00-\x7F]/g, "").slice(0, 20);
        const pinKey = 'editor_pin_' + groupName;

        // Restore pinned state
        if (localStorage.getItem(pinKey) === '1') {
            group.classList.add('pinned', 'active');
        }

        // Toggle on header click
        header.addEventListener('click', (e) => {
            // If click was on pin button, handle it separately
            if (e.target.closest('.tool-group-pin')) return;

            const wasActive = group.classList.contains('active');
            
            // Close all other non-pinned groups
            groups.forEach(g => {
                if (g !== group && !g.classList.contains('pinned')) {
                    g.classList.remove('active');
                }
            });

            // Toggle current group
            group.classList.toggle('active', !wasActive);
        });

        // Pin logic
        if (pinBtn) {
            pinBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isPinned = group.classList.toggle('pinned');
                if (isPinned) group.classList.add('active');
                localStorage.setItem(pinKey, isPinned ? '1' : '0');
            });
        }
    });

    // Add "Collapse All" button if helpful? Let's just make sure one-at-a-time is reliable.
}

// ==========================================================================
//  EDITOR ↔ PREVIEW SCROLL SYNC
// ==========================================================================

let _syncEnabled   = false;
let _syncInProgress = false;

function initSync() {
    const btn1 = document.getElementById('sync-toggle');
    const btn2 = document.getElementById('sync-toggle-2');
    const preview = document.getElementById('editor-preview');

    [btn1, btn2].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            _syncEnabled = !_syncEnabled;
            [btn1, btn2].forEach(b => {
                if (!b) return;
                b.classList.toggle('active', _syncEnabled);
            });
        });
    });

    if (!preview) return;

    // When cursor moves in CodeMirror → scroll preview
    // We attach this after editor is ready (called from initPreview via hook)
    window._attachSyncToEditor = function(cm) {
        cm.on('cursorActivity', () => {
            if (!_syncEnabled || _syncInProgress) return;
            const line = cm.getCursor().line;
            _syncPreviewToLine(cm, line, preview);
        });
    };

    // When user clicks in preview → find line in editor
    preview.addEventListener('click', (e) => {
        if (!_syncEnabled || !editor) return;
        const el = e.target.closest('p,h1,h2,h3,h4,h5,li,td,blockquote,pre');
        if (!el) return;
        _syncEditorToPreviewEl(el);
    });
}

function _syncPreviewToLine(cm, lineNum, preview) {
    // Get text of current line (stripped of markdown syntax)
    const lineText = cm.getLine(lineNum);
    if (!lineText || lineText.trim().length < 4) return;

    // Try to find a matching element in preview
    const needle = lineText
        .replace(/^#+\s*/, '')           // strip heading markers
        .replace(/<[^>]+>/g, '')          // strip HTML tags
        .replace(/[*_`[\]]/g, '')         // strip markdown
        .trim()
        .slice(0, 50)
        .toLowerCase();

    if (needle.length < 3) return;

    const allEls = preview.querySelectorAll('p,h1,h2,h3,h4,h5,li,td,blockquote,pre,summary');
    let best = null, bestScore = 0;

    allEls.forEach(el => {
        const text = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 50).toLowerCase();
        if (!text) return;
        // Overlap score
        const shorter = needle.length < text.length ? needle : text;
        const longer  = needle.length < text.length ? text : needle;
        if (longer.includes(shorter.slice(0, Math.min(30, shorter.length)))) {
            const score = shorter.length;
            if (score > bestScore) { bestScore = score; best = el; }
        }
    });

    if (best && bestScore > 5) {
        _syncInProgress = true;
        best.scrollIntoView({ block: 'center', behavior: 'smooth' });
        // Flash highlight
        best.style.transition = 'background 0.15s';
        best.style.background = 'rgba(52,152,219,0.18)';
        setTimeout(() => {
            best.style.background = '';
            setTimeout(() => { _syncInProgress = false; }, 300);
        }, 600);
    }
}

function _syncEditorToPreviewEl(el) {
    if (!editor) return;
    const needle = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40).toLowerCase();
    if (needle.length < 3) return;

    for (let i = 0; i < editor.lineCount(); i++) {
        const line = editor.getLine(i)
            .replace(/<[^>]+>/g, '').replace(/[*_`#[\]]/g, '')
            .trim().slice(0, 40).toLowerCase();
        if (line.includes(needle.slice(0, 25)) || needle.includes(line.slice(0, 25))) {
            if (line.length > 3) {
                editor.setCursor({ line: i, ch: 0 });
                editor.scrollIntoView({ line: i, ch: 0 }, 100);
                editor.focus();
                break;
            }
        }
    }
}