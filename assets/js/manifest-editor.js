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
        if (!bookPath) {
            els.selectFile.disabled = true;
            return;
        }

        state.currentBook = state.books.find(b => b.fullPath === bookPath);
        state.currentType = type;
        
        els.selectFile.innerHTML = '<option value="">Searching...</option>';
        els.selectFile.disabled = true;

        try {
            // In a real environment, we'd fetch the directory listing. 
            // Here we'll guess or look into metadata.json
            const metaRes = await fetch(`${bookPath}/metadata.json`);
            const meta = await metaRes.json();
            
            const files = [];
            if (type === 'quiz') {
                if (meta[0]?.quiz_sets) {
                    meta[0].quiz_sets.forEach(s => files.push(s.file));
                }
                // Also look for default quiz if not in sets
                if (meta[0]?.quiz && !files.includes('quiz.json')) files.push('quiz.json');
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
        const url = `${state.currentBook.fullPath}/${filePath}`;
        
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
        } else {
            state.manifest = {
                title: "New Magazine",
                subtitle: "",
                cover: "magazine/cover.jpg",
                cards: []
            };
        }
        state.currentFile = type === 'quiz' ? 'quiz-new.json' : 'magazine.json';
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
        const meta = state.manifest.meta || state.manifest; // Quiz uses .meta, Magazine is flat at top
        
        const fields = state.currentType === 'quiz' ? 
            ['title', 'book'] : 
            ['title', 'subtitle', 'cover'];

        fields.forEach(f => {
            const val = state.currentType === 'quiz' ? state.manifest.meta[f] : state.manifest[f];
            const group = _createFieldGroup(f, val, (newVal) => {
                if (state.currentType === 'quiz') state.manifest.meta[f] = newVal;
                else state.manifest[f] = newVal;
                _syncFormToJson();
            });
            els.metaFields.appendChild(group);
        });
    }

    function _renderForm() {
        els.itemsContainer.innerHTML = '';
        const items = state.currentType === 'quiz' ? state.manifest.questions : state.manifest.cards;
        els.itemsCount.textContent = `${items.length} items`;

        if (items.length === 0) {
            els.itemsContainer.innerHTML = '<div class="me-empty-state">No items. Add one!</div>';
        } else {
            items.forEach((item, idx) => {
                const card = _createItemCard(item, idx);
                els.itemsContainer.appendChild(card);
            });
        }

        // Add prominent Add button at the bottom
        if (state.manifest) {
            const footer = document.createElement('div');
            footer.className = 'me-items-footer';
            const btn = document.createElement('button');
            btn.className = 'me-btn me-btn-xl me-btn-green';
            btn.innerHTML = `<i class="fas fa-plus-circle"></i> Add New ${state.currentType === 'quiz' ? 'Question' : 'Card'}`;
            btn.onclick = _addItem;
            footer.appendChild(btn);
            els.itemsContainer.appendChild(footer);
        }
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
        header.innerHTML = `<span class="me-item-id">#${idx + 1} (ID: ${item.id || 'N/A'})</span>`;
        
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

        if (state.currentType === 'quiz') {
            _fillQuizFields(grid, item, idx, card);
        } else {
            _fillMagazineFields(grid, item, idx);
        }

        card.appendChild(grid);
        return card;
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
        
        container.appendChild(_createFieldGroup('Explanation Image File', item.explanationImage || '', (v) => { item.explanationImage = v; _syncFormToJson(); }));

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
        const items = state.currentType === 'quiz' ? state.manifest.questions : state.manifest.cards;
        const newItem = state.currentType === 'quiz' ? 
            { id: items.length + 1, questionEn: "", questionRu: "", optionsEn: {A:"",B:"",C:"",D:""}, optionsRu: {A:"",B:"",C:"",D:""}, correctAnswer: "A", explanationEn: "", explanationRu: "" } :
            { id: `card-${items.length + 1}`, src: "magazine/new-card.jpg", caption: "", tags: [], chapter: [] };
        
        items.push(newItem);
        state.activeItemIndex = items.length - 1;
        _renderForm();
        _renderPreview();
        _syncFormToJson();
    }

    function _deleteItem(idx) {
        const items = state.currentType === 'quiz' ? state.manifest.questions : state.manifest.cards;
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
        const items = state.currentType === 'quiz' ? state.manifest.questions : state.manifest.cards;
        els.previewIndex.textContent = items.length > 0 ? `${state.activeItemIndex + 1} / ${items.length}` : '0 / 0';
        
        if (!items || items.length === 0 || !items[state.activeItemIndex]) {
            els.previewContent.innerHTML = '<div class="me-preview-empty">Select an item to preview</div>';
            return;
        }

        const item = items[state.activeItemIndex];
        let html = '';

        if (state.currentType === 'quiz') {
            const imgPath = item.image ? `${state.currentBook.fullPath}/quiz/images/${item.image}` : null;
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
                    ${item.explanationEn || item.explanationRu || item.explanationImage ? `
                        <div class="q-explanation" style="margin-top:20px; padding:15px; background:#fff3e0; border-left:4px solid #ff9800; border-radius:4px;">
                            <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:#e65100; margin-bottom:8px;">Explanation</div>
                            ${item.explanationImage ? `<img src="${state.currentBook.fullPath}/quiz/images/${item.explanationImage}" style="max-width:100%; margin-bottom:10px; border-radius:4px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">` : ''}
                            <div style="font-size:0.9rem; margin-bottom:10px;">${item.explanationEn || ''}</div>
                            <div style="font-size:0.9rem; font-style:italic; border-top:1px solid #ffe0b2; pt:8px; margin-top:8px;">${item.explanationRu || ''}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            const imgPath = item.src ? `${state.currentBook.fullPath}/${item.src}` : null;
            html = `
                <div class="preview-magazine">
                    ${imgPath ? `<img src="${imgPath}" style="max-width:100%; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">` : ''}
                    <div style="margin-top:15px;">
                        <h4 style="margin:0;">${item.caption || '(No caption)'}</h4>
                        <div style="margin-top:8px;">
                            ${(item.tags || []).map(t => `<span style="display:inline-block; padding:2px 8px; background:#eee; border-radius:12px; font-size:0.7rem; margin-right:5px;">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        els.previewContent.innerHTML = html;
    }

    function _changePreviewIndex(delta) {
        const items = state.currentType === 'quiz' ? state.manifest.questions : state.manifest.cards;
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

        const path = `${state.currentBook.fullPath}/${state.currentFile}`;
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
