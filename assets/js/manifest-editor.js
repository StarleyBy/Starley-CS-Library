/**
 * Starley Manifest Editor
 * Logic for editing Quiz and Magazine manifests
 */

document.addEventListener('DOMContentLoaded', async () => {
    const state = {
        books: [],
        currentBook: null,
        currentType: 'quiz',
        currentFile: null,
        manifest: null,
        jsonEditor: null,
        activeItemIndex: 0
    };

    // DOM Elements
    const els = {
        selectBook: document.getElementById('me-select-book'),
        selectType: document.getElementById('me-select-type'),
        selectFile: document.getElementById('me-select-file'),
        btnLoad: document.getElementById('me-btn-load'),
        btnNew: document.getElementById('me-btn-new'),
        sectionMeta: document.getElementById('me-section-meta'),
        metaFields: document.getElementById('me-meta-fields'),
        itemsCount: document.getElementById('me-items-count'),
        btnAddItem: document.getElementById('me-btn-add-item'),
        itemsContainer: document.getElementById('me-items-container'),
        tabBtns: document.querySelectorAll('.me-tab-btn'),
        tabContents: document.querySelectorAll('.me-tab-content'),
        previewContent: document.getElementById('me-preview-content'),
        previewIndex: document.getElementById('me-preview-index'),
        btnPrev: document.getElementById('me-preview-prev'),
        btnNext: document.getElementById('me-preview-next'),
        btnDownload: document.getElementById('me-btn-download'),
        btnSaveGithub: document.getElementById('me-btn-save-github'),
        githubStatus: document.getElementById('me-github-status'),
        githubModal: document.getElementById('me-github-modal'),
        githubToken: document.getElementById('me-github-token'),
        btnTokenSave: document.getElementById('me-btn-token-save'),
        btnTokenCancel: document.getElementById('me-btn-token-cancel')
    };

    // 1. Initialization
    _initCodeMirror();
    await _loadLibrary();
    _setupEventListeners();

    // --- Core Functions ---

    function _initCodeMirror() {
        state.jsonEditor = CodeMirror.fromTextArea(document.getElementById('me-json-editor'), {
            mode: "javascript",
            theme: "monokai",
            lineNumbers: true,
            tabSize: 2,
            lineWrapping: true
        });
        
        state.jsonEditor.on('change', () => {
            if (document.querySelector('.me-tab-btn[data-tab="json"]').classList.contains('active')) {
                try {
                    state.manifest = JSON.parse(state.jsonEditor.getValue());
                    _renderForm();
                    _renderPreview();
                } catch(e) {
                    // Invalid JSON, don't update form yet
                }
            }
        });
    }

    async function _loadLibrary() {
        try {
            const res = await fetch('library.json');
            const data = await res.json();
            
            const booksMap = new Map();
            data.categories.forEach(cat => {
                cat.books.forEach(book => {
                    const path = `${cat.path}/${book.folder}`;
                    booksMap.set(path, { ...book, categoryPath: cat.path, fullPath: path });
                });
            });
            
            state.books = Array.from(booksMap.values()).sort((a,b) => a.folder.localeCompare(b.folder));
            
            state.books.forEach(book => {
                const opt = document.createElement('option');
                opt.value = book.fullPath;
                opt.textContent = `${book.folder} (${book.fullPath})`;
                els.selectBook.appendChild(opt);
            });
        } catch(e) {
            console.error('Failed to load library.json', e);
        }
    }

    function _setupEventListeners() {
        els.selectBook.addEventListener('change', _onBookChange);
        els.selectType.addEventListener('change', _onBookChange);
        els.btnLoad.addEventListener('click', _loadManifest);
        els.btnNew.addEventListener('click', _createNewManifest);
        
        els.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                els.tabBtns.forEach(b => b.classList.remove('active'));
                els.tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`me-tab-${btn.dataset.tab}`).classList.add('active');
                
                if (btn.dataset.tab === 'json') {
                    state.jsonEditor.setValue(JSON.stringify(state.manifest, null, 2));
                    state.jsonEditor.refresh();
                } else {
                    _syncJsonToForm();
                }
            });
        });

        els.btnAddItem.addEventListener('click', _addItem);
        els.btnPrev.addEventListener('click', () => _changePreviewIndex(-1));
        els.btnNext.addEventListener('click', () => _changePreviewIndex(1));
        els.btnDownload.addEventListener('click', _downloadJson);
        els.btnSaveGithub.addEventListener('click', () => els.githubModal.style.display = 'flex');
        
        els.btnTokenCancel.addEventListener('click', () => els.githubModal.style.display = 'none');
        els.btnTokenSave.addEventListener('click', _saveToGithub);
    }

    async function _onBookChange() {
        const bookPath = els.selectBook.value;
        const type = els.selectType.value;
        
        state.currentType = type;

        if (type === 'library') {
            els.selectBook.disabled = true;
            els.selectFile.innerHTML = '<option value="library.json">library.json</option>';
            els.selectFile.disabled = false;
            state.currentBook = { fullPath: '.', folder: 'root' };
            return;
        }

        els.selectBook.disabled = false;
        if (!bookPath) {
            els.selectFile.disabled = true;
            return;
        }

        state.currentBook = state.books.find(b => b.fullPath === bookPath);
        
        els.selectFile.innerHTML = '<option value="">Searching...</option>';
        els.selectFile.disabled = true;

        try {
            if (type === 'metadata') {
                els.selectFile.innerHTML = '<option value="metadata.json">metadata.json</option>';
                els.selectFile.disabled = false;
                return;
            }

            // In a real environment, we'd fetch the directory listing. 
            // Here we'll guess or look into metadata.json
            const metaRes = await fetch(`${bookPath}/metadata.json`);
            const meta = await metaRes.json();
            
            const files = [];
            if (type === 'quiz') {
                const metaObj = Array.isArray(meta) ? meta[0] : meta;
                if (metaObj?.quiz_sets) {
                    metaObj.quiz_sets.forEach(s => files.push(s.file));
                }
                // Also look for default quiz if not in sets
                if (metaObj?.quiz && !files.includes('quiz.json')) files.push('quiz.json');
            } else if (type === 'magazine') {
                files.push('magazine.json');
            }

            els.selectFile.innerHTML = files.map(f => `<option value="${f}">${f}</option>`).join('') || '<option value="">No files found</option>';
            els.selectFile.disabled = files.length === 0;
        } catch(e) {
            els.selectFile.innerHTML = '<option value="">Error loading metadata</option>';
        }
    }

    async function _loadManifest() {
        const filePath = els.selectFile.value;
        if (!filePath) return;

        state.currentFile = filePath;
        const url = state.currentType === 'library' ? 'library.json' : `${state.currentBook.fullPath}/${filePath}`;
        
        try {
            const res = await fetch(url);
            state.manifest = await res.json();
            _onManifestLoaded();
        } catch(e) {
            alert('Failed to load manifest file');
        }
    }

    function _createNewManifest() {
        const type = els.selectType.value;
        if (type === 'quiz') {
            state.manifest = {
                meta: { title: "New Quiz", book: state.currentBook?.folder || "", chapter: [], totalQuestions: 0 },
                questions: []
            };
        } else if (type === 'magazine') {
            state.manifest = {
                title: "New Magazine",
                subtitle: "",
                cover: "magazine/cover.jpg",
                cards: []
            };
        } else if (type === 'metadata') {
            state.manifest = [{
                title: "New Book",
                cover_image: "cover.jpg",
                authors: [""],
                category: [""],
                versions: { original: true, russian: false, starley: false, hebrew: false },
                chapters: []
            }];
        } else if (type === 'library') {
            state.manifest = { categories: [] };
        }
        state.currentFile = type === 'quiz' ? 'quiz-new.json' : (type === 'library' ? 'library.json' : (type === 'metadata' ? 'metadata.json' : 'magazine.json'));
        _onManifestLoaded();
    }

    function _onManifestLoaded() {
        els.sectionMeta.style.display = 'block';
        _renderMetaFields();
        _renderForm();
        _renderPreview();
        state.jsonEditor.setValue(JSON.stringify(state.manifest, null, 2));
    }

    function _renderMetaFields() {
        els.metaFields.innerHTML = '';
        const type = state.currentType;
        
        if (type === 'library') {
            els.sectionMeta.style.display = 'none';
            return;
        }

        let meta = state.manifest;
        if (type === 'quiz') meta = state.manifest.meta;
        else if (type === 'metadata') meta = state.manifest[0];

        const fields = type === 'quiz' ? ['title', 'book'] : 
                      type === 'magazine' ? ['title', 'subtitle', 'cover'] :
                      ['title', 'russian_title', 'cover_image', 'authors'];

        fields.forEach(f => {
            const val = meta[f];
            const group = _createFieldGroup(f, Array.isArray(val) ? val.join(', ') : val, (newVal) => {
                if (Array.isArray(val)) meta[f] = newVal.split(',').map(s => s.trim()).filter(s => s);
                else meta[f] = newVal;
                _syncFormToJson();
            });
            els.metaFields.appendChild(group);
        });

        if (type === 'metadata') {
            // Add versions toggle
            const vLabel = document.createElement('label');
            vLabel.textContent = 'Versions';
            vLabel.style.marginTop = '10px';
            vLabel.style.display = 'block';
            els.metaFields.appendChild(vLabel);
            
            const vContainer = document.createElement('div');
            vContainer.className = 'me-versions-grid';
            vContainer.style.display = 'grid';
            vContainer.style.gridTemplateColumns = '1fr 1fr';
            vContainer.style.gap = '5px';
            
            Object.keys(meta.versions || {}).forEach(v => {
                const label = document.createElement('label');
                label.style.fontSize = '0.8rem';
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '5px';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = meta.versions[v];
                cb.onchange = (e) => { meta.versions[v] = e.target.checked; _syncFormToJson(); };
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(v));
                vContainer.appendChild(label);
            });
            els.metaFields.appendChild(vContainer);

            // Add booleans
            ['magazine', 'quiz'].forEach(b => {
                const label = document.createElement('label');
                label.style.fontSize = '0.8rem';
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '5px';
                label.style.marginTop = '5px';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!meta[b];
                cb.onchange = (e) => { meta[b] = e.target.checked; _syncFormToJson(); };
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(`Has ${b}`));
                els.metaFields.appendChild(label);
            });
        }
    }

    function _renderForm() {
        els.itemsContainer.innerHTML = '';
        let items = [];
        const type = state.currentType;
        
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0].chapters;
        else if (type === 'library') items = state.manifest.categories;

        els.itemsCount.textContent = `${items.length} items`;

        if (items.length === 0) {
            els.itemsContainer.innerHTML = '<div class="me-empty-state">No items. Add one!</div>';
        } else {
            if (type === 'metadata') {
                _renderChaptersRecursive(items, els.itemsContainer);
            } else {
                items.forEach((item, idx) => {
                    const card = _createItemCard(item, idx);
                    els.itemsContainer.appendChild(card);
                });
            }
        }

        // Add prominent Add button at the bottom
        if (state.manifest) {
            const footer = document.createElement('div');
            footer.className = 'me-items-footer';
            const btn = document.createElement('button');
            btn.className = 'me-btn me-btn-xl me-btn-green';
            let label = 'Item';
            if (type === 'quiz') label = 'Question';
            else if (type === 'magazine') label = 'Card';
            else if (type === 'metadata') label = 'Chapter';
            else if (type === 'library') label = 'Category';
            
            btn.innerHTML = `<i class="fas fa-plus-circle"></i> Add New ${label}`;
            btn.onclick = _addItem;
            footer.appendChild(btn);
            els.itemsContainer.appendChild(footer);
        }
    }

    function _renderChaptersRecursive(chapters, container, depth = 0, parentPath = []) {
        chapters.forEach((ch, idx) => {
            const currentPath = [...parentPath, idx];
            const card = document.createElement('div');
            card.className = `me-item-card`;
            card.style.marginLeft = `${depth * 20}px`;
            card.onclick = (e) => {
                e.stopPropagation();
                // We'll need a better way to map this to state.activeItemIndex
                // For now, let's keep it simple and just enable editing.
            };
            
            const grid = document.createElement('div');
            grid.className = 'me-item-grid';
            
            grid.appendChild(_createFieldGroup('File Name', ch.file, (v) => { ch.file = v; _syncFormToJson(); }));
            grid.appendChild(_createFieldGroup('Title', ch.title, (v) => { ch.title = v; _syncFormToJson(); }));
            grid.appendChild(_createFieldGroup('Russian Title', ch.russian || '', (v) => { ch.russian = v; _syncFormToJson(); }));
            
            card.appendChild(grid);
            container.appendChild(card);
            
            if (ch.subchapters) {
                _renderChaptersRecursive(ch.subchapters, container, depth + 1, currentPath);
            }
        });
    }

    function _createItemCard(item, idx) {
        const card = document.createElement('div');
        card.className = `me-item-card ${idx === state.activeItemIndex ? 'active' : ''}`;
        card.onclick = () => {
            state.activeItemIndex = idx;
            document.querySelectorAll('.me-item-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            _renderPreview();
        };

        const header = document.createElement('div');
        header.className = 'me-item-header';
        const type = state.currentType;
        let idLabel = `#${idx + 1}`;
        if (type === 'quiz' || type === 'library') idLabel += ` (ID: ${item.id || 'N/A'})`;
        
        header.innerHTML = `<span class="me-item-id">${idLabel}</span>`;
        
        const actions = document.createElement('div');
        actions.className = 'me-item-actions';
        
        const btnDel = document.createElement('button');
        btnDel.className = 'me-btn me-btn-sm me-btn-outline';
        btnDel.innerHTML = '<i class="fas fa-trash"></i>';
        btnDel.onclick = (e) => { e.stopPropagation(); _deleteItem(idx); };
        
        actions.appendChild(btnDel);
        header.appendChild(actions);
        card.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'me-item-grid';

        if (type === 'quiz') {
            _fillQuizFields(grid, item, idx, card);
        } else if (type === 'magazine') {
            _fillMagazineFields(grid, item, idx);
        } else if (type === 'metadata') {
            _fillMetadataFields(grid, item, idx);
        } else if (type === 'library') {
            _fillLibraryFields(grid, item, idx);
        }

        card.appendChild(grid);
        return card;
    }

    function _fillMetadataFields(container, item, idx) {
        container.appendChild(_createFieldGroup('File Name', item.file, (v) => { item.file = v; _syncFormToJson(); }));
        container.appendChild(_createFieldGroup('Title', item.title, (v) => { item.title = v; _syncFormToJson(); }));
    }

    function _fillLibraryFields(container, item, idx) {
        container.appendChild(_createFieldGroup('ID', item.id, (v) => { item.id = v; _syncFormToJson(); }));
        container.appendChild(_createFieldGroup('Title', item.title, (v) => { item.title = v; _syncFormToJson(); }));
        container.appendChild(_createFieldGroup('Path', item.path, (v) => { item.path = v; _syncFormToJson(); }));
        
        // Books list as a simple textarea for now
        const booksVal = JSON.stringify(item.books, null, 2);
        container.appendChild(_createFieldGroup('Books (JSON)', booksVal, (v) => {
            try { item.books = JSON.parse(v); _syncFormToJson(); } catch(e) {}
        }, 'textarea'));
    }

    function _fillQuizFields(container, item, idx, cardEl) {
        // En Text
        container.appendChild(_createFieldGroup('Question (EN)', item.questionEn, (v) => { item.questionEn = v; _syncFormToJson(); }, 'textarea'));
        container.appendChild(_createFieldGroup('Question (RU)', item.questionRu, (v) => { item.questionRu = v; _syncFormToJson(); }, 'textarea'));
        
        // Options
        const optCont = document.createElement('div');
        optCont.className = 'me-field-group';
        optCont.innerHTML = '<label>Options (EN)</label>';
        ['A', 'B', 'C', 'D'].forEach(letter => {
            const inp = document.createElement('input');
            inp.value = item.optionsEn?.[letter] || '';
            inp.placeholder = letter;
            inp.oninput = (e) => { 
                if (!item.optionsEn) item.optionsEn = {};
                item.optionsEn[letter] = e.target.value; 
                _syncFormToJson(); 
            };
            optCont.appendChild(inp);
        });
        container.appendChild(optCont);

        // Correct Answer
        const ansGroup = _createFieldGroup('Correct Answer', item.correctAnswer, (v) => { item.correctAnswer = v; _syncFormToJson(); }, 'select', ['A', 'B', 'C', 'D']);
        container.appendChild(ansGroup);

        // Image
        container.appendChild(_createFieldGroup('Question Image File', item.image || '', (v) => { item.image = v; _syncFormToJson(); }));
        
        // Explanation Images (Array of strings)
        const expImagesGroup = document.createElement('div');
        expImagesGroup.className = 'me-field-group';
        expImagesGroup.innerHTML = `<label>Explanation Images (comma separated)</label>
                                    <input type="text" id="me-exp-images" placeholder="e.g. img1.jpg, img2.jpg" value="${(item.explanationImages || []).join(', ')}">`;
        expImagesGroup.querySelector('input').addEventListener('input', (e) => {
            item.explanationImages = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
            _syncFormToJson();
        });
        container.appendChild(expImagesGroup);

        // Filler to keep grid balanced if needed, or just let it flow
        const filler = document.createElement('div');
        container.appendChild(filler);

        // Explanations (Full Width)
        const expEn = _createFieldGroup('Explanation (EN)', item.explanationEn || '', (v) => { item.explanationEn = v; _syncFormToJson(); }, 'textarea', [], true);
        const expRu = _createFieldGroup('Explanation (RU)', item.explanationRu || '', (v) => { item.explanationRu = v; _syncFormToJson(); }, 'textarea', [], true);
        
        expEn.className += ' me-item-full-width';
        expRu.className += ' me-item-full-width';
        
        container.appendChild(expEn);
        container.appendChild(expRu);
    }

    function _fillMagazineFields(container, item, idx) {
        container.appendChild(_createFieldGroup('Image Source', item.src, (v) => { item.src = v; _syncFormToJson(); }));
        container.appendChild(_createFieldGroup('Caption', item.caption, (v) => { item.caption = v; _syncFormToJson(); }, 'textarea'));
        container.appendChild(_createFieldGroup('Tags (comma separated)', item.tags?.join(', ') || '', (v) => { item.tags = v.split(',').map(t => t.trim()).filter(t => t); _syncFormToJson(); }));
    }

    function _createFieldGroup(label, value, onChange, type = 'input', options = [], withToolbar = false) {
        const group = document.createElement('div');
        group.className = 'me-field-group';
        group.innerHTML = `<label>${label}</label>`;
        
        let el;
        if (type === 'textarea') {
            if (withToolbar) {
                const toolbar = document.createElement('div');
                toolbar.className = 'me-toolbar';
                
                const tools = [
                    { label: 'B', tag: 'b', title: 'Bold' },
                    { label: 'Yellow', tag: 'mark', style: 'background:#ffff00;color:#000', title: 'Yellow Highlight' },
                    { label: 'Green', tag: 'mark', style: 'background:#2ecc71;color:#fff', title: 'Green Highlight' },
                    { label: 'Red', tag: 'span', style: 'color:#e74c3c', title: 'Red Text' },
                    { label: 'Blue', tag: 'span', style: 'color:#3498db', title: 'Blue Text' }
                ];
                
                tools.forEach(t => {
                    const btn = document.createElement('button');
                    btn.className = 'me-toolbar-btn';
                    btn.textContent = t.label;
                    btn.title = t.title;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        _insertTag(el, t.tag, t.style);
                    };
                    toolbar.appendChild(btn);
                });
                group.appendChild(toolbar);
            }
            
            el = document.createElement('textarea');
            el.rows = 3;
            if (withToolbar) el.className = 'has-toolbar';
        } else if (type === 'select') {
            el = document.createElement('select');
            options.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o;
                opt.textContent = o;
                if (o === value) opt.selected = true;
                el.appendChild(opt);
            });
        } else {
            el = document.createElement('input');
            el.type = 'text';
        }
        
        el.value = value || '';
        el.oninput = (e) => onChange(e.target.value);
        group.appendChild(el);
        return group;
    }

    function _insertTag(textarea, tag, style = null) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);
        
        const styleAttr = style ? ` style="${style}"` : '';
        const replacement = `<${tag}${styleAttr}>${selected}</${tag}>`;
        
        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        textarea.dispatchEvent(new Event('input')); // Trigger sync
        textarea.focus();
        textarea.setSelectionRange(start + tag.length + styleAttr.length + 2, start + tag.length + styleAttr.length + 2 + selected.length);
    }

    function _addItem() {
        const type = state.currentType;
        let items;
        let newItem;
        
        if (type === 'quiz') {
            items = state.manifest.questions;
            newItem = { id: items.length + 1, questionEn: "", questionRu: "", optionsEn: {A:"",B:"",C:"",D:""}, optionsRu: {A:"",B:"",C:"",D:""}, correctAnswer: "A", explanationEn: "", explanationRu: "" };
        } else if (type === 'magazine') {
            items = state.manifest.cards;
            newItem = { id: `card-${items.length + 1}`, src: "magazine/new-card.jpg", caption: "", tags: [], chapter: [] };
        } else if (type === 'metadata') {
            items = state.manifest[0].chapters;
            newItem = { file: `chapter-${String(items.length + 1).padStart(2, '0')}.md`, title: `New Chapter ${items.length + 1}` };
        } else if (type === 'library') {
            items = state.manifest.categories;
            newItem = { id: "new-category", title: "New Category", path: "books/new", books: [] };
        }
        
        items.push(newItem);
        state.activeItemIndex = items.length - 1;
        _renderForm();
        _renderPreview();
        _syncFormToJson();
    }

    function _deleteItem(idx) {
        const type = state.currentType;
        let items;
        
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0].chapters;
        else if (type === 'library') items = state.manifest.categories;

        items.splice(idx, 1);
        if (state.activeItemIndex >= items.length) state.activeItemIndex = Math.max(0, items.length - 1);
        _renderForm();
        _renderPreview();
        _syncFormToJson();
    }

    function _syncFormToJson() {
        state.jsonEditor.setValue(JSON.stringify(state.manifest, null, 2));
        _renderPreview();
    }

    function _syncJsonToForm() {
        try {
            state.manifest = JSON.parse(state.jsonEditor.getValue());
            _renderForm();
            _renderPreview();
        } catch(e) {}
    }

    // --- Preview ---

    function _renderPreview() {
        const type = state.currentType;
        let items = [];
        
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0].chapters;
        else if (type === 'library') items = state.manifest.categories;

        els.previewIndex.textContent = items.length > 0 ? `${state.activeItemIndex + 1} / ${items.length}` : '0 / 0';
        
        if (!items || items.length === 0 || !items[state.activeItemIndex]) {
            els.previewContent.innerHTML = '<div class="me-preview-empty">Select an item to preview</div>';
            return;
        }

        const item = items[state.activeItemIndex];
        let html = '';

        if (type === 'quiz') {
            const imgPath = item.image ? `${state.currentBook.fullPath}/quiz/images/${item.image}` : null;
            
            // Render multiple images if explanationImages array exists
            const explanationImages = item.explanationImages || [];
            const expImgHtml = explanationImages.map(img => {
                const p = `${state.currentBook.fullPath}/quiz/images/${img}`;
                return `<img src="${p}" style="max-width:100%; margin-top:10px; border-radius:4px; border:1px solid #ddd;">`;
            }).join('');

            html = `
                <div class="preview-quiz">
                    <div class="q-text" style="font-weight:600; font-size:1.1rem; margin-bottom:15px;">${item.questionEn || '(No question text)'}</div>
                    ${imgPath ? `<img src="${imgPath}" style="max-width:100%; margin:10px 0; border-radius:4px; border:1px solid #ddd;">` : ''}
                    <div class="q-options" style="margin-top:15px;">
                        ${Object.entries(item.optionsEn || {}).map(([k, v]) => `
                            <div style="padding:8px; border:1px solid #ddd; margin-bottom:5px; border-radius:4px; ${k === item.correctAnswer ? 'background:#e8f5e9; border-color:#2e7d32; font-weight:600;' : ''}">
                                <strong>${k}:</strong> ${v}
                            </div>
                        `).join('')}
                    </div>
                    <div class="q-explanation" style="margin-top:20px; padding:15px; background:#f9f9f9; border-radius:4px;">
                        <div style="font-weight:600; margin-bottom:5px;">Explanation:</div>
                        <div>${item.explanationEn || '(No explanation provided)'}</div>
                        ${expImgHtml}
                    </div>
                </div>
            `;
        } else if (type === 'magazine') {
            const imgPath = item.src ? `${state.currentBook.fullPath}/${item.src}` : null;
            html = `
                <div class="preview-magazine">
                    ${imgPath ? `<img src="${imgPath}" style="max-width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">` : ''}
                    <div style="margin-top:15px;">
                        <h4 style="margin:0;">${item.caption || '(No caption)'}</h4>
                    </div>
                </div>
            `;
        } else if (type === 'metadata') {
            html = `
                <div class="preview-metadata">
                    <h3>Chapter Preview</h3>
                    <p><strong>Title:</strong> ${item.title}</p>
                    <p><strong>File:</strong> ${item.file}</p>
                </div>
            `;
        } else if (type === 'library') {
            html = `
                <div class="preview-library">
                    <h3>Category: ${item.title}</h3>
                    <p><strong>Path:</strong> ${item.path}</p>
                    <p><strong>Books count:</strong> ${item.books?.length || 0}</p>
                    <ul>
                        ${(item.books || []).map(b => `<li>${b.folder} ${b.visibility ? `(${b.visibility})` : ''}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        els.previewContent.innerHTML = html;
    }

    function _changePreviewIndex(delta) {
        const type = state.currentType;
        let items = [];
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0].chapters;
        else if (type === 'library') items = state.manifest.categories;

        if (items.length === 0) return;
        state.activeItemIndex = (state.activeItemIndex + delta + items.length) % items.length;
        _renderForm();
        _renderPreview();
        // Scroll to active item in form
        const activeCard = els.itemsContainer.children[state.activeItemIndex];
        if (activeCard) activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Persistence ---

    function _downloadJson() {
        const blob = new Blob([JSON.stringify(state.manifest, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = state.currentFile || 'manifest.json';
        a.click();
    }

    async function _saveToGithub() {
        const token = els.githubToken.value.trim();
        if (!token) return;
        
        els.githubModal.style.display = 'none';
        els.githubStatus.textContent = '⏳ Saving...';
        els.btnSaveGithub.disabled = true;

        const bookPath = state.currentBook.fullPath;
        const path = (bookPath === '.' || bookPath === '') ? state.currentFile : `${bookPath}/${state.currentFile}`;
        const content = JSON.stringify(state.manifest, null, 2);
        
        try {
            // Need to get SHA if file exists
            const repo = 'StarleyBy/Starley-CS-Library'; // Correct repo from config
            const url = `https://api.github.com/repos/${repo}/contents/${path}`;
            const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
            
            const getRes = await fetch(url, { headers });
            let sha = null;
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }

            const body = {
                message: `Update ${state.currentType} manifest: ${state.currentFile}`,
                content: btoa(unescape(encodeURIComponent(content))),
                sha: sha
            };

            const putRes = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            });

            if (putRes.ok) {
                els.githubStatus.textContent = '✅ Saved to GitHub!';
                localStorage.setItem('gh_token', token);
            } else {
                throw new Error(await putRes.text());
            }
        } catch(e) {
            console.error(e);
            els.githubStatus.textContent = '❌ Error saving to GitHub';
        } finally {
            els.btnSaveGithub.disabled = false;
        }
    }
    
    // Auto-fill token if in localStorage
    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) els.githubToken.value = savedToken;
});
