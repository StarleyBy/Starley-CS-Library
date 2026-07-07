/**
 * Starley Manifest Editor
 * Logic for editing Quiz and Magazine manifests
 *
 * Features:
 *  - CodeMirror (Raw JSON) <-> Form Editor real-time sync with validation guard
 *  - Syntax highlighting for numbers and HTML/formatting tags in textareas
 *  - Emoji toolbar for quick emoji insertion
 */

document.addEventListener('DOMContentLoaded', async () => {
    const state = {
        books: [],
        currentBook: null,
        currentType: 'quiz',
        currentFile: null,
        manifest: null,
        jsonEditor: null,
        activeItemIndex: 0,
        previewLang: 'En'
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
        btnTokenCancel: document.getElementById('me-btn-token-cancel'),
        previewLangCont: document.getElementById('me-preview-lang-cont'),
        previewLangBtns: document.querySelectorAll('.me-preview-lang .me-btn')
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

        // Tab switching with JSON validation guard
        els.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                const activeTab = document.querySelector('.me-tab-btn.active').dataset.tab;

                if (activeTab === 'json' && btn.dataset.tab === 'form') {
                    // Validate JSON before allowing switch to Form Editor
                    try {
                        state.manifest = JSON.parse(state.jsonEditor.getValue());
                    } catch (e) {
                        alert('JSON contains syntax errors! Please fix them before switching to Form Editor.\n\nОшибка в JSON! Пожалуйста, исправьте синтаксические ошибки перед переходом к Form Editor.');
                        return;
                    }
                }

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

        // Language toggle for preview
        els.previewLangBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                els.previewLangBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.previewLang = btn.dataset.lang;
                _renderPreview();
            });
        });
    }

    async function _onBookChange() {
        const bookPath = els.selectBook.value;
        const type = els.selectType.value;

        state.currentType = type;

        // Show/hide language toggle based on type
        els.previewLangCont.style.display = type === 'quiz' ? 'flex' : 'none';

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

            const metaRes = await fetch(`${bookPath}/metadata.json`);
            const meta = await metaRes.json();

            const files = [];
            if (type === 'quiz') {
                const metaObj = Array.isArray(meta) ? meta[0] : meta;
                if (metaObj?.quiz_sets) {
                    metaObj.quiz_sets.forEach(s => files.push(s.file));
                }
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

    // --- Content Retrieval with Validation ---

    /**
     * _getManifestContent()
     * Returns the current manifest as a JSON string.
     * If the JSON tab is active, retrieves from CodeMirror and warns if there are syntax errors.
     * If the Form tab is active, serializes state.manifest.
     * Returns null if user cancels on invalid JSON.
     */
    function _getManifestContent() {
        const jsonTabActive = document.querySelector('.me-tab-btn[data-tab="json"]').classList.contains('active');
        if (jsonTabActive) {
            const raw = state.jsonEditor.getValue();
            try {
                JSON.parse(raw);
                return raw;
            } catch(e) {
                const proceed = confirm(
                    'Warning: The JSON currently contains syntax errors!\n\n' +
                    'Downloading/saving invalid JSON may corrupt your manifest.\n\n' +
                    'Click OK to proceed anyway, or Cancel to go back and fix the errors.'
                );
                return proceed ? raw : null;
            }
        }
        return JSON.stringify(state.manifest, null, 2);
    }

    // --- Metadata Fields ---

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
            const group = _createFieldGroup(f.replace('_', ' '), Array.isArray(val) ? val.join(', ') : val, (newVal) => {
                if (Array.isArray(val)) meta[f] = newVal.split(',').map(s => s.trim()).filter(s => s);
                else meta[f] = newVal;
                _syncFormToJson();
            });
            els.metaFields.appendChild(group);
        });

        if (type === 'metadata') {
            // Versions toggle
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

            const versions = meta.versions || { original: true, russian: false, starley: false, hebrew: false };
            meta.versions = versions;

            Object.keys(versions).forEach(v => {
                const label = document.createElement('label');
                label.style.fontSize = '0.8rem';
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '5px';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!versions[v];
                cb.onchange = (e) => { versions[v] = e.target.checked; _syncFormToJson(); };

                label.appendChild(cb);
                label.appendChild(document.createTextNode(v.charAt(0).toUpperCase() + v.slice(1)));
                vContainer.appendChild(label);
            });
            els.metaFields.appendChild(vContainer);

            // Feature Flags
            const fLabel = document.createElement('label');
            fLabel.textContent = 'Features';
            fLabel.style.marginTop = '10px';
            fLabel.style.display = 'block';
            els.metaFields.appendChild(fLabel);

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
                cb.onchange = (e) => {
                    meta[b] = e.target.checked;
                    if (b === 'quiz' && meta[b] && !meta.quiz_sets) meta.quiz_sets = [];
                    _renderMetaFields();
                    _syncFormToJson();
                };

                label.appendChild(cb);
                label.appendChild(document.createTextNode(`Has ${b.charAt(0).toUpperCase() + b.slice(1)}`));
                els.metaFields.appendChild(label);
            });

            // Quiz Sets Management
            if (meta.quiz) {
                const qsContainer = document.createElement('div');
                qsContainer.className = 'me-quiz-sets-container';
                qsContainer.innerHTML = '<h4>Quiz Sets</h4>';

                const sets = meta.quiz_sets || [];
                sets.forEach((set, idx) => {
                    const setEl = document.createElement('div');
                    setEl.className = 'me-quiz-set-item';

                    const grid = document.createElement('div');
                    grid.className = 'me-quiz-set-grid';

                    grid.appendChild(_createFieldGroup('ID', set.id, (v) => { set.id = v; _syncFormToJson(); }));
                    grid.appendChild(_createFieldGroup('Label', set.label, (v) => { set.label = v; _syncFormToJson(); }));
                    grid.appendChild(_createFieldGroup('File', set.file, (v) => { set.file = v; _syncFormToJson(); }));

                    setEl.appendChild(grid);

                    const actions = document.createElement('div');
                    actions.className = 'me-quiz-set-actions';

                    const btnOpen = document.createElement('button');
                    btnOpen.className = 'me-btn me-btn-sm me-btn-blue';
                    btnOpen.innerHTML = '<i class="fas fa-external-link-alt"></i> Open';
                    btnOpen.onclick = () => {
                        els.selectType.value = 'quiz';
                        state.currentType = 'quiz';
                        state.currentFile = set.file;
                        _loadManifest();
                    };

                    const btnDel = document.createElement('button');
                    btnDel.className = 'me-btn me-btn-sm me-btn-danger';
                    btnDel.innerHTML = '<i class="fas fa-trash"></i>';
                    btnDel.onclick = () => {
                        sets.splice(idx, 1);
                        _renderMetaFields();
                        _syncFormToJson();
                    };

                    actions.appendChild(btnOpen);
                    actions.appendChild(btnDel);
                    setEl.appendChild(actions);
                    qsContainer.appendChild(setEl);
                });

                const btnAddSet = document.createElement('button');
                btnAddSet.className = 'me-btn me-btn-sm me-btn-green';
                btnAddSet.style.marginTop = '10px';
                btnAddSet.innerHTML = '<i class="fas fa-plus"></i> Add Quiz Set';
                btnAddSet.onclick = () => {
                    if (!meta.quiz_sets) meta.quiz_sets = [];
                    meta.quiz_sets.push({ id: 'new-set', label: 'New Quiz Set', file: 'quiz/quiz-new.json' });
                    _renderMetaFields();
                    _syncFormToJson();
                };
                qsContainer.appendChild(btnAddSet);

                els.metaFields.appendChild(qsContainer);
            }
        }
    }

    // --- Form Rendering ---

    function _renderForm() {
        els.itemsContainer.innerHTML = '';
        const type = state.currentType;

        if (type === 'metadata') {
            const meta = state.manifest[0];

            // Chapters header
            const chHeader = document.createElement('div');
            chHeader.className = 'me-items-list-header';
            chHeader.innerHTML = '<span>📚 Chapters</span>';
            const btnAddCh = document.createElement('button');
            btnAddCh.className = 'me-btn me-btn-sm me-btn-green';
            btnAddCh.innerHTML = '<i class="fas fa-plus"></i> Add Chapter';
            btnAddCh.onclick = () => {
                if (!meta.chapters) meta.chapters = [];
                meta.chapters.push({ file: `chapter-${String(meta.chapters.length + 1).padStart(2, '0')}.md`, title: 'New Chapter' });
                _renderForm();
                _syncFormToJson();
            };
            chHeader.appendChild(btnAddCh);
            els.itemsContainer.appendChild(chHeader);

            _renderChaptersRecursive(meta.chapters || [], els.itemsContainer);

            // Appendices header
            const apHeader = document.createElement('div');
            apHeader.className = 'me-items-list-header';
            apHeader.style.marginTop = '30px';
            apHeader.innerHTML = '<span>📎 Appendices</span>';
            const btnAddAp = document.createElement('button');
            btnAddAp.className = 'me-btn me-btn-sm me-btn-green';
            btnAddAp.innerHTML = '<i class="fas fa-plus"></i> Add Appendix';
            btnAddAp.onclick = () => {
                if (!meta.appendices) meta.appendices = [];
                meta.appendices.push({ file: `appendix-${String(meta.appendices.length + 1).padStart(2, '0')}.md`, title: 'New Appendix' });
                _renderForm();
                _syncFormToJson();
            };
            apHeader.appendChild(btnAddAp);
            els.itemsContainer.appendChild(apHeader);

            if (!meta.appendices || meta.appendices.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'me-empty-state';
                empty.textContent = 'No appendices.';
                els.itemsContainer.appendChild(empty);
            } else {
                _renderChaptersRecursive(meta.appendices, els.itemsContainer);
            }
            return;
        }

        let items = [];
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'library') items = state.manifest.categories;

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
            let label = 'Item';
            if (type === 'quiz') label = 'Question';
            else if (type === 'magazine') label = 'Card';
            else if (type === 'library') label = 'Category';

            btn.innerHTML = `<i class="fas fa-plus-circle"></i> Add New ${label}`;
            btn.onclick = _addItem;
            footer.appendChild(btn);
            els.itemsContainer.appendChild(footer);
        }
    }

    function _renderChaptersRecursive(chapters, container, depth = 0) {
        chapters.forEach((ch, idx) => {
            const card = document.createElement('div');
            card.className = `me-item-card ${depth > 0 ? 'nested' : ''}`;
            card.style.marginLeft = `${depth * 25}px`;

            const header = document.createElement('div');
            header.className = 'me-item-header';
            header.innerHTML = `<span class="me-item-id">${depth === 0 ? 'Chapter' : 'Sub-chapter'} ${idx + 1}</span>`;

            const actions = document.createElement('div');
            actions.className = 'me-item-actions';

            const btnAddSub = document.createElement('button');
            btnAddSub.className = 'me-btn me-btn-sm me-btn-ghost';
            btnAddSub.title = 'Add Sub-chapter';
            btnAddSub.innerHTML = '<i class="fas fa-level-down-alt"></i>';
            btnAddSub.onclick = (e) => {
                e.stopPropagation();
                if (!ch.subchapters) ch.subchapters = [];
                ch.subchapters.push({ file: '', title: 'New Sub-chapter' });
                _renderForm();
                _syncFormToJson();
            };

            const btnDel = document.createElement('button');
            btnDel.className = 'me-btn me-btn-sm me-btn-ghost me-btn-danger';
            btnDel.title = 'Delete';
            btnDel.innerHTML = '<i class="fas fa-trash"></i>';
            btnDel.onclick = (e) => {
                e.stopPropagation();
                if (confirm('Delete this item?')) {
                    chapters.splice(idx, 1);
                    _renderForm();
                    _syncFormToJson();
                }
            };

            actions.appendChild(btnAddSub);
            actions.appendChild(btnDel);
            header.appendChild(actions);
            card.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'me-item-grid';

            grid.appendChild(_createFieldGroup('File Name', ch.file, (v) => { ch.file = v; _syncFormToJson(); }));
            grid.appendChild(_createFieldGroup('Title', ch.title, (v) => { ch.title = v; _syncFormToJson(); }));
            grid.appendChild(_createFieldGroup('Russian Title', ch.russian || '', (v) => { ch.russian = v; _syncFormToJson(); }));

            card.appendChild(grid);
            container.appendChild(card);

            if (ch.subchapters && ch.subchapters.length > 0) {
                _renderChaptersRecursive(ch.subchapters, container, depth + 1);
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

        const booksVal = JSON.stringify(item.books, null, 2);
        container.appendChild(_createFieldGroup('Books (JSON)', booksVal, (v) => {
            try { item.books = JSON.parse(v); _syncFormToJson(); } catch(e) {}
        }, 'textarea'));
    }

    function _fillMagazineFields(container, item, idx) {
        container.appendChild(_createFieldGroup('Image Source', item.src, (v) => { item.src = v; _syncFormToJson(); }));
        container.appendChild(_createFieldGroup('Caption', item.caption, (v) => { item.caption = v; _syncFormToJson(); }, 'textarea'));
        container.appendChild(_createFieldGroup('Tags (comma separated)', item.tags?.join(', ') || '', (v) => { item.tags = v.split(',').map(t => t.trim()).filter(t => t); _syncFormToJson(); }));
    }

    function _fillQuizFields(container, item, idx, cardEl) {
        // Question textareas with toolbar+emoji
        container.appendChild(_createFieldGroup('Question (EN)', item.questionEn, (v) => { item.questionEn = v; _syncFormToJson(); }, 'textarea', [], true));
        container.appendChild(_createFieldGroup('Question (RU)', item.questionRu, (v) => { item.questionRu = v; _syncFormToJson(); }, 'textarea', [], true));

        // Options EN
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

        // Correct Answer Logic
        const caGroup = document.createElement('div');
        caGroup.className = 'me-field-group';

        const multiLabel = document.createElement('label');
        multiLabel.style.display = 'flex';
        multiLabel.style.alignItems = 'center';
        multiLabel.style.gap = '8px';
        multiLabel.style.marginBottom = '8px';

        const multiCb = document.createElement('input');
        multiCb.type = 'checkbox';
        multiCb.checked = !!item.multiAnswer;
        multiCb.style.width = 'auto';
        multiCb.onchange = (e) => {
            item.multiAnswer = e.target.checked;
            if (item.multiAnswer) {
                if (typeof item.correctAnswer === 'string') {
                    item.correctAnswer = item.correctAnswer.split('').filter(c => ['A','B','C','D'].includes(c));
                }
            } else {
                if (Array.isArray(item.correctAnswer)) {
                    item.correctAnswer = item.correctAnswer[0] || 'A';
                }
            }
            _renderForm();
            _syncFormToJson();
        };
        multiLabel.appendChild(multiCb);
        multiLabel.appendChild(document.createTextNode('Multiple Correct Answers'));
        caGroup.appendChild(multiLabel);

        const ansLabel = document.createElement('label');
        ansLabel.textContent = 'Correct Answer(s)';
        caGroup.appendChild(ansLabel);

        if (item.multiAnswer) {
            const multiSelectCont = document.createElement('div');
            multiSelectCont.style.display = 'flex';
            multiSelectCont.style.gap = '10px';
            multiSelectCont.style.marginTop = '4px';

            ['A', 'B', 'C', 'D'].forEach(letter => {
                const l = document.createElement('label');
                l.style.display = 'flex';
                l.style.alignItems = 'center';
                l.style.gap = '4px';
                l.style.fontSize = '0.8rem';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = Array.isArray(item.correctAnswer) && item.correctAnswer.includes(letter);
                cb.style.width = 'auto';
                cb.onchange = (e) => {
                    if (!Array.isArray(item.correctAnswer)) item.correctAnswer = [];
                    if (e.target.checked) {
                        if (!item.correctAnswer.includes(letter)) item.correctAnswer.push(letter);
                    } else {
                        item.correctAnswer = item.correctAnswer.filter(c => c !== letter);
                    }
                    item.correctAnswer.sort();
                    _syncFormToJson();
                };
                l.appendChild(cb);
                l.appendChild(document.createTextNode(letter));
                multiSelectCont.appendChild(l);
            });
            caGroup.appendChild(multiSelectCont);
        } else {
            const select = document.createElement('select');
            ['A', 'B', 'C', 'D'].forEach(o => {
                const opt = document.createElement('option');
                opt.value = o;
                opt.textContent = o;
                if (o === item.correctAnswer) opt.selected = true;
                select.appendChild(opt);
            });
            select.onchange = (e) => { item.correctAnswer = e.target.value; _syncFormToJson(); };
            caGroup.appendChild(select);
        }
        container.appendChild(caGroup);

        // Question Image
        container.appendChild(_createFieldGroup('Question Image File', item.image || '', (v) => { item.image = v; _syncFormToJson(); }));

        // Explanation Images
        const expImagesGroup = document.createElement('div');
        expImagesGroup.className = 'me-field-group';
        expImagesGroup.innerHTML = `<label>Explanation Images (comma separated)</label>
                                    <input type="text" id="me-exp-images" placeholder="e.g. img1.jpg, img2.jpg" value="${(item.explanationImages || []).join(', ')}">`;
        expImagesGroup.querySelector('input').addEventListener('input', (e) => {
            item.explanationImages = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
            _syncFormToJson();
        });
        container.appendChild(expImagesGroup);

        // Filler
        const filler = document.createElement('div');
        container.appendChild(filler);

        // Explanation textareas with toolbar+emoji (full width)
        const expEn = _createFieldGroup('Explanation (EN)', item.explanationEn || '', (v) => { item.explanationEn = v; _syncFormToJson(); }, 'textarea', [], true);
        const expRu = _createFieldGroup('Explanation (RU)', item.explanationRu || '', (v) => { item.explanationRu = v; _syncFormToJson(); }, 'textarea', [], true);

        expEn.className += ' me-item-full-width';
        expRu.className += ' me-item-full-width';

        container.appendChild(expEn);
        container.appendChild(expRu);
    }

    // --- Field Group Factory ---

    /**
     * _createFieldGroup(label, value, onChange, type, options, withToolbar)
     *
     * For 'textarea' type:
     *   - Wraps in .me-textarea-wrapper with a .me-textarea-backdrop for syntax highlighting
     *   - Adds formatting toolbar + emoji toolbar when withToolbar=true
     *   - Syncs scroll and content between textarea and backdrop
     *
     * withToolbar=true is enabled by default on Question (EN/RU) and Explanation (EN/RU)
     */
    function _createFieldGroup(label, value, onChange, type = 'input', options = [], withToolbar = false) {
        const group = document.createElement('div');
        group.className = 'me-field-group';
        group.innerHTML = `<label>${label}</label>`;

        let el;

        if (type === 'textarea') {
            // --- Textarea with highlight backdrop ---
            if (withToolbar) {
                // Toolbar container: row 1 = formatting, row 2 = emojis
                const toolbarContainer = document.createElement('div');
                toolbarContainer.className = 'me-toolbars-container';

                // Row 1: Formatting toolbar
                const toolbar = document.createElement('div');
                toolbar.className = 'me-toolbar';

                const tools = [
                    { icon: 'fas fa-bold', tag: 'b', title: 'Bold' },
                    { icon: 'fas fa-italic', tag: 'i', title: 'Italic' },
                    { icon: 'fas fa-underline', tag: 'u', title: 'Underline' },
                    { icon: 'fas fa-strikethrough', tag: 's', title: 'Strikethrough' },
                    { icon: 'fas fa-code', tag: 'code', title: 'Inline Code' },
                    { icon: 'fas fa-highlighter', tag: 'mark', style: 'background:#ffff00;color:#000', title: 'Yellow Highlight' },
                    { icon: 'fas fa-highlighter', tag: 'mark', style: 'background:#2ecc71;color:#fff', title: 'Green Highlight' },
                    { icon: 'fas fa-highlighter', tag: 'mark', style: 'background:#ff79c6;color:#fff', title: 'Pink Highlight' },
                    { icon: 'fas fa-highlighter', tag: 'mark', style: 'background:#8be9fd;color:#000', title: 'Cyan Highlight' },
                    { icon: 'fas fa-font', tag: 'span', style: 'color:#e74c3c', title: 'Red Text' },
                    { icon: 'fas fa-font', tag: 'span', style: 'color:#3498db', title: 'Blue Text' },
                    { icon: 'fas fa-font', tag: 'span', style: 'color:#f39c12', title: 'Orange Text' },
                    { icon: 'fas fa-font', tag: 'span', style: 'color:#9b59b6', title: 'Purple Text' },
                    { icon: 'fas fa-superscript', tag: 'sup', title: 'Superscript' },
                    { icon: 'fas fa-subscript', tag: 'sub', title: 'Subscript' }
                ];

                // We need a reference to `el` but it's declared later, so use a closure trick
                let textareaRef = null;

                tools.forEach(t => {
                    const btn = document.createElement('button');
                    btn.className = 'me-toolbar-btn';
                    btn.innerHTML = `<i class="${t.icon}" style="${(t.tag === 'span' || t.tag === 'mark') ? t.style : ''}"></i>`;
                    btn.title = t.title;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        if (textareaRef) _insertTag(textareaRef, t.tag, t.style);
                    };
                    toolbar.appendChild(btn);
                });
                toolbarContainer.appendChild(toolbar);

                // Row 2: Emoji toolbar
                const emojiToolbar = document.createElement('div');
                emojiToolbar.className = 'me-emoji-toolbar';

                const emojis = [
                    '🟠', '🔵', '🟣', '🟤', '⚪', '⚫', '🔴', '🟢',
                    '❤️', '💚', '💙', '💛', '🩵', '💜',
                    '🔪', '🎯', '🪡', '🚨', '⌛', '🔥', '💧',
                    '📗', '📘', '📚', '📜', '🛠️',
                    '✳️', '✴️', '❇️', '✅', '❎', '✔️', '❌', '🔸', '🔹'
                ];

                emojis.forEach(emoji => {
                    const btn = document.createElement('button');
                    btn.className = 'me-emoji-btn';
                    btn.textContent = emoji;
                    btn.title = `Insert ${emoji}`;
                    btn.onclick = (e) => {
                        e.preventDefault();
                        if (textareaRef) _insertEmoji(textareaRef, emoji);
                    };
                    emojiToolbar.appendChild(btn);
                });
                toolbarContainer.appendChild(emojiToolbar);

                group.appendChild(toolbarContainer);

                // Now create the wrapper + backdrop + textarea
                const wrapper = document.createElement('div');
                wrapper.className = 'me-textarea-wrapper';

                const backdrop = document.createElement('div');
                backdrop.className = 'me-textarea-backdrop';

                el = document.createElement('textarea');
                el.rows = 3;
                el.className = 'has-toolbar';

                // Link the textarea reference so toolbar buttons can use it
                textareaRef = el;

                wrapper.appendChild(backdrop);
                wrapper.appendChild(el);
                group.appendChild(wrapper);

                // Sync backdrop
                const updateBackdrop = () => {
                    backdrop.innerHTML = highlightText(el.value) + '\n';
                    backdrop.scrollTop = el.scrollTop;
                    backdrop.scrollLeft = el.scrollLeft;
                };

                el.addEventListener('input', updateBackdrop);
                el.addEventListener('scroll', () => {
                    backdrop.scrollTop = el.scrollTop;
                    backdrop.scrollLeft = el.scrollLeft;
                });

                el.value = value || '';
                el.oninput = (e) => {
                    onChange(e.target.value);
                    updateBackdrop();
                };

                setTimeout(updateBackdrop, 0);
                return group;

            } else {
                // Textarea without toolbar - still uses wrapper+backdrop for consistency
                const wrapper = document.createElement('div');
                wrapper.className = 'me-textarea-wrapper';

                const backdrop = document.createElement('div');
                backdrop.className = 'me-textarea-backdrop';

                el = document.createElement('textarea');
                el.rows = 3;

                wrapper.appendChild(backdrop);
                wrapper.appendChild(el);
                group.appendChild(wrapper);

                const updateBackdrop = () => {
                    backdrop.innerHTML = highlightText(el.value) + '\n';
                    backdrop.scrollTop = el.scrollTop;
                    backdrop.scrollLeft = el.scrollLeft;
                };

                el.addEventListener('input', updateBackdrop);
                el.addEventListener('scroll', () => {
                    backdrop.scrollTop = el.scrollTop;
                    backdrop.scrollLeft = el.scrollLeft;
                });

                el.value = value || '';
                el.oninput = (e) => {
                    onChange(e.target.value);
                    updateBackdrop();
                };

                setTimeout(updateBackdrop, 0);
                return group;
            }

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

    // --- Text Helpers ---

    /**
     * highlightText(text)
     * Escapes HTML entities, then wraps:
     *   - HTML tags (e.g. <b>, <mark style="...">) → .hl-tag (pink)
     *   - Digit sequences → .hl-number (cyan)
     */
    function highlightText(text) {
        // Step 1: Escape HTML special characters
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Step 2: Highlight escaped tags like &lt;b&gt;, &lt;mark style="..."&gt;
        escaped = escaped.replace(/(&lt;[^&]*&gt;)/g, '<span class="hl-tag">$1</span>');

        // Step 3: Highlight digit sequences, but only in non-tag parts
        const parts = escaped.split(/(<[^>]*>)/g);
        for (let i = 0; i < parts.length; i++) {
            if (!parts[i].startsWith('<')) {
                parts[i] = parts[i].replace(/(\d+)/g, '<span class="hl-number">$1</span>');
            }
        }
        return parts.join('');
    }

    /**
     * _insertTag(textarea, tag, style)
     * Wraps selected text in the given HTML tag, preserving cursor position.
     */
    function _insertTag(textarea, tag, style = null) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        const styleAttr = style ? ` style="${style}"` : '';
        const replacement = `<${tag}${styleAttr}>${selected}</${tag}>`;

        textarea.value = text.substring(0, start) + replacement + text.substring(end);
        textarea.dispatchEvent(new Event('input'));
        textarea.focus();
        textarea.setSelectionRange(
            start + tag.length + styleAttr.length + 2,
            start + tag.length + styleAttr.length + 2 + selected.length
        );
    }

    /**
     * _insertEmoji(textarea, emoji)
     * Inserts an emoji at the current cursor position.
     */
    function _insertEmoji(textarea, emoji) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        textarea.value = text.substring(0, start) + emoji + text.substring(end);
        textarea.dispatchEvent(new Event('input'));
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }

    // --- Items CRUD ---

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

    // --- Sync Functions ---

    function _syncFormToJson() {
        state.jsonEditor.setValue(JSON.stringify(state.manifest, null, 2));
        _renderPreview();
    }

    function _syncJsonToForm() {
        try {
            state.manifest = JSON.parse(state.jsonEditor.getValue());

            let items = [];
            const type = state.currentType;
            if (type === 'quiz') items = state.manifest.questions;
            else if (type === 'magazine') items = state.manifest.cards;
            else if (type === 'metadata') items = state.manifest[0]?.chapters || [];
            else if (type === 'library') items = state.manifest.categories;

            // Safely clamp activeItemIndex to valid range
            if (items && items.length > 0) {
                if (state.activeItemIndex >= items.length) {
                    state.activeItemIndex = items.length - 1;
                }
                if (state.activeItemIndex < 0) {
                    state.activeItemIndex = 0;
                }
            } else {
                state.activeItemIndex = 0;
            }

            _renderForm();
            _renderPreview();
        } catch(e) {
            // JSON is invalid, do nothing (tab switch already prevented this case)
        }
    }

    // --- Preview ---

    function _renderPreview() {
        if (!state.manifest) return;

        const type = state.currentType;
        let items = [];

        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0]?.chapters || [];
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
            const lang = state.previewLang;

            const explanationImages = item.explanationImages || [];
            const expImgHtml = explanationImages.map(img => {
                const p = `${state.currentBook.fullPath}/quiz/images/${img}`;
                return `<img src="${p}" style="max-width:100%; margin-top:10px; border-radius:4px; border:1px solid #ddd;">`;
            }).join('');

            const correctAnswers = Array.isArray(item.correctAnswer) ? item.correctAnswer : [item.correctAnswer];

            const rawExp = item['explanation' + lang] || (lang === 'En' ? item.explanationEn : item.explanationRu) || '(No explanation provided)';
            const formattedExp = rawExp.split('\n\n')
                .map(p => `<p style="margin-bottom:10px;">${p.trim().replace(/\n/g, '<br>')}</p>`)
                .join('');

            const questionText = item['question' + lang] || (lang === 'En' ? item.questionEn : item.questionRu) || '(No question text)';
            const options = item['options' + lang] || (lang === 'En' ? item.optionsEn : item.optionsRu) || {};

            html = `
                <div class="preview-quiz">
                    <div style="margin-bottom: 5px; font-size: 0.75rem; color: #666; font-weight: 700;">PREVIEW: ${lang.toUpperCase()}</div>
                    <div class="q-text" style="font-weight:600; font-size:1.1rem; margin-bottom:15px;">${questionText}</div>
                    ${imgPath ? `<img src="${imgPath}" style="max-width:100%; margin:10px 0; border-radius:4px; border:1px solid #ddd;">` : ''}
                    <div class="q-options" style="margin-top:15px;">
                        ${Object.entries(options).map(([k, v]) => `
                            <div style="padding:8px; border:1px solid #ddd; margin-bottom:5px; border-radius:4px; ${correctAnswers.includes(k) ? 'background:#e8f5e9; border-color:#2e7d32; font-weight:600;' : ''}">
                                <strong>${k}:</strong> ${v}
                            </div>
                        `).join('')}
                    </div>
                    <div class="q-explanation" style="margin-top:20px; padding:15px; background:#f9f9f9; border-radius:4px;">
                        <div style="font-weight:600; margin-bottom:5px;">Explanation (${lang}):</div>
                        <div class="exp-content">${formattedExp}</div>
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
        if (!state.manifest) return;

        const type = state.currentType;
        let items = [];
        if (type === 'quiz') items = state.manifest.questions;
        else if (type === 'magazine') items = state.manifest.cards;
        else if (type === 'metadata') items = state.manifest[0]?.chapters || [];
        else if (type === 'library') items = state.manifest.categories;

        if (!items || items.length === 0) return;

        state.activeItemIndex = Math.max(0, Math.min(items.length - 1, state.activeItemIndex + delta));
        _renderPreview();
    }

    // --- Save & Download ---

    /**
     * _downloadJson()
     * Uses _getManifestContent() as source of truth.
     * Warns user if JSON tab is active and has syntax errors.
     */
    function _downloadJson() {
        const content = _getManifestContent();
        if (content === null) return; // User cancelled

        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = state.currentFile || 'manifest.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * _saveToGithub()
     * Uses _getManifestContent() as source of truth.
     * Warns user if JSON tab is active and has syntax errors before saving.
     */
    async function _saveToGithub() {
        const token = els.githubToken.value.trim();
        if (!token) {
            alert('Please enter a GitHub token');
            return;
        }

        const content = _getManifestContent();
        if (content === null) return; // User cancelled

        els.githubModal.style.display = 'none';
        els.btnSaveGithub.disabled = true;
        els.githubStatus.textContent = '⏳ Saving...';

        try {
            const owner = 'StarleyBy';
            const repo = 'Starley-CS-Library';
            let filePath;
            if (state.currentType === 'library') {
                filePath = 'library.json';
            } else {
                filePath = `${state.currentBook.fullPath}/${state.currentFile}`;
            }
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

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

    // Auto-fill token if saved in localStorage
    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) els.githubToken.value = savedToken;
});
