// assets/js/reader.js
// Global variable to track if we're in GitHub Pages environment
let isGitHubPages = false;

// Check if we're running on GitHub Pages
if (typeof window !== 'undefined') {
    isGitHubPages = window.location.hostname.includes('github.io');
}

// ==========================================================================
//  READER SETTINGS — localStorage persistence
// ==========================================================================

const ReaderSettings = {
    KEYS: {
        FONT_SIZE:   'reader_font_size',
        FONT_FAMILY: 'reader_font_family',
        SCROLL_POS:  'reader_scroll_',   // + chapterId suffix
        READ_CHAPTERS: 'reader_read_chapters',
        READING_MODE:  'reader_reading_mode',
    },

    get(key, fallback = null) {
        try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
        catch { return fallback; }
    },

    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },

    // ---- Reading mode (paging via taps) ----
    getReadingMode()    { return this.get(this.KEYS.READING_MODE, false); },
    setReadingMode(on)  { this.set(this.KEYS.READING_MODE, on); },

    // ---- Font size (px) ----
    getFontSize()      { return this.get(this.KEYS.FONT_SIZE, 16); },
    setFontSize(px)    { this.set(this.KEYS.FONT_SIZE, px); },

    // ---- Font family ----
    getFontFamily()    { return this.get(this.KEYS.FONT_FAMILY, 'inter'); },
    setFontFamily(name){ this.set(this.KEYS.FONT_FAMILY, name); },

    // ---- Scroll position per chapter ----
    getScroll(chapterId)   { return this.get(this.KEYS.SCROLL_POS + chapterId, 0); },
    setScroll(chapterId, y){ this.set(this.KEYS.SCROLL_POS + chapterId, y); },

    // ---- Read chapters (Set stored as Array) ----
    getReadChapters()       { return new Set(this.get(this.KEYS.READ_CHAPTERS, [])); },
    markChapterRead(id)     {
        const s = this.getReadChapters();
        s.add(id);
        this.set(this.KEYS.READ_CHAPTERS, [...s]);
    },
    isChapterRead(id)       { return this.getReadChapters().has(id); },
};

// Current chapter being tracked for scroll save
let _currentChapterId = null;
let _scrollSaveTimer  = null;

// Save scroll position (debounced 600ms)
function _onScrollSave() {
    clearTimeout(_scrollSaveTimer);
    _scrollSaveTimer = setTimeout(() => {
        if (_currentChapterId) {
            ReaderSettings.setScroll(_currentChapterId, window.scrollY);
        }
        // Mark as "read" when scrolled past 80%
        if (_mdLineCount > 0 && _currentTopLine / _mdLineCount >= 0.80 && _currentChapterId) {
            ReaderSettings.markChapterRead(_currentChapterId);
            _updateReadDotsInSidebar();
        }
    }, 600);
}

// ==========================================================================
//  MD-LINE BASED PROGRESS
//  Strategy: store raw MD line count after load; on scroll find the topmost
//  visible block-level element via IntersectionObserver, map it to an MD line
//  via a line-index lookup table built at chapter load time.
// ==========================================================================

let _mdLineCount    = 0;       // total lines in current MD source
let _elementLineMap = [];      // [{el, lineIndex}] sorted by lineIndex
let _progressObserver = null;  // IntersectionObserver instance
let _currentTopLine   = 0;     // last known top visible line

/**
 * Called after a new chapter loads.
 * Receives raw MD text + the rendered content root.
 */
function _initMdProgress(mdText, contentRoot) {
    _mdLineCount = mdText.split('\n').length;
    _elementLineMap = [];
    _currentTopLine = 0;

    if (_progressObserver) _progressObserver.disconnect();

    // Build a lookup: for each block-level child of contentRoot,
    // find the best matching line in the MD source.
    const blocks = contentRoot.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, li, tr, details, blockquote, pre, figure, table'
    );

    const mdLines = mdText.split('\n');

    blocks.forEach((el) => {
        // Get first ~60 chars of the element's plain text for matching
        const snippet = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
        if (!snippet) return;

        // Find the best matching line in MD (case-insensitive, stripped of markdown syntax)
        let bestLine = 0;
        let bestScore = 0;
        for (let i = 0; i < mdLines.length; i++) {
            const stripped = mdLines[i].replace(/^[#*>\-\d.\[\]!`|]+\s*/g, '').trim();
            if (stripped.length < 4) continue;
            // Simple overlap score: how many chars of snippet appear in the line
            const overlapLen = Math.min(stripped.length, 30);
            const needle = snippet.slice(0, overlapLen).toLowerCase();
            if (stripped.toLowerCase().includes(needle.slice(0, 20))) {
                // Score = position-weighted (prefer earlier match for same snippet)
                const score = overlapLen - i * 0.001;
                if (score > bestScore) { bestScore = score; bestLine = i; }
            }
        }
        _elementLineMap.push({ el, lineIndex: bestLine });
    });

    // Sort by lineIndex ascending
    _elementLineMap.sort((a, b) => a.lineIndex - b.lineIndex);

    // Use IntersectionObserver to track topmost visible element
    _progressObserver = new IntersectionObserver((entries) => {
        // Find minimum lineIndex among currently intersecting elements
        let minLine = null;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const found = _elementLineMap.find(m => m.el === entry.target);
                if (found && (minLine === null || found.lineIndex < minLine)) {
                    minLine = found.lineIndex;
                }
            }
        });
        if (minLine !== null) {
            _currentTopLine = minLine;
            _renderProgressBar();
        }
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // trigger when element is in the middle 20% of viewport
        threshold: 0
    });

    _elementLineMap.forEach(m => _progressObserver.observe(m.el));
    _renderProgressBar();
}

function _renderProgressBar() {
    const bar = document.getElementById('reading-progress-bar');
    if (!bar || _mdLineCount === 0) return;
    const pct = Math.min(100, (_currentTopLine / _mdLineCount) * 100);
    bar.style.width = pct + '%';
}

// Keep this as a no-op fallback so old callers don't break
function _updateProgressBar() { _renderProgressBar(); }

function _updateReadDotsInSidebar() {
    const readSet = ReaderSettings.getReadChapters();
    document.querySelectorAll('[data-chapter-id]').forEach(el => {
        const id = el.dataset.chapterId;
        const existing = el.querySelector('.chapter-read-dot');
        if (readSet.has(id) && !existing) {
            const dot = document.createElement('span');
            dot.className = 'chapter-read-dot';
            dot.title = 'Прочитано';
            el.appendChild(dot);
        }
    });
}

// Apply saved font settings on load
function _applyFontSettings() {
    const size   = ReaderSettings.getFontSize();
    const family = ReaderSettings.getFontFamily();
    document.documentElement.style.setProperty('--reader-font-size', size + 'px');
    // Remove all font-* classes, add current
    document.body.classList.remove(
        'font-inter','font-roboto','font-opensans','font-nunito',
        'font-merriweather','font-lora','font-playfair',
        'font-sourceserif','font-literata','font-mono'
    );
    document.body.classList.add('font-' + family);
}

// ==========================================================================
//  DETAILS DEPTH LABELING — tag each <details> with data-depth
// ==========================================================================

function labelDetailsDepth(root) {
    function walk(el, depth) {
        if (el.tagName === 'DETAILS') {
            el.dataset.depth = Math.min(depth, 5);
            Array.from(el.children).forEach(child => walk(child, depth + 1));
        } else {
            Array.from(el.children).forEach(child => walk(child, depth));
        }
    }
    walk(root, 1);
}

async function loadChapter(bookPath, chapterId, edition) {
    // Save scroll for previous chapter before switching
    if (_currentChapterId && _currentChapterId !== chapterId) {
        ReaderSettings.setScroll(_currentChapterId, window.scrollY);
    }
    _currentChapterId = chapterId;

    const area = document.getElementById('content-area');
    area.innerHTML = '<p class="loading">Loading content...</p>';

    try {
        let suffix = '';
        if (edition === 'starley') suffix = '-starley';
        if (edition === 'russian') suffix = '-ru';
        if (edition === 'hebrew') suffix = '-he';

        // Определяем родительскую папку для подглав
        let parentFolder = chapterId;
        const subchapterMatch = chapterId.match(/^(chapter-\d+)-\d+$/);
        if (subchapterMatch) {
            parentFolder = subchapterMatch[1];
        }

        let url = `${BASE_URL}${bookPath}/chapters/${parentFolder}/${chapterId}${suffix}.md`;

        let response = await fetch(url);

        if (!response.ok) {
            console.warn(`${edition} version not found, falling back to original.`);
            url = `${BASE_URL}${bookPath}/chapters/${parentFolder}/${chapterId}.md`;
            response = await fetch(url);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let md = await response.text();
        const rawMd = md; // preserve original for line counting

        // --- Protect LaTeX math from marked.js mangling ---
        const mathStore = [];
        function storeMath(tex, display) {
            const id = '\x02MATH' + mathStore.length + '\x03';
            let safeTex = tex;
            safeTex = safeTex.replace(/(?<!\\)%/g, '\\%');
            safeTex = safeTex.replace(/−/g, '-');
            const supMap = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
            safeTex = safeTex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^{' + m.split('').map(c => supMap[c]||c).join('') + '}');
            mathStore.push({ id, tex: safeTex, display });
            return id;
        }

        md = md.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, tex) => storeMath(tex, true));
        md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => storeMath(tex, true));
        md = md.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, tex) => storeMath(tex, false));
        md = md.replace(/\$([^\n$][^$]*?)\$/g, (_, tex) => storeMath(tex, false));

        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        md = md.replace(/<mark class="m-([^"]+)">/g, '<span class="m-$1">');
        md = md.replace(/<\/mark>/g, '</span>');

        marked.setOptions({
            baseUrl: `${BASE_URL}${bookPath}/chapters/${parentFolder}/images/`
        });
        
        const langMap = { original: 'en', russian: 'ru', starley: 'en', hebrew: 'he' };
        document.documentElement.lang = langMap[edition] || 'en';

        if (edition === 'hebrew') {
            area.className = 'content hebrew-content';
        } else {
            area.className = 'content';
        }
        
        area.innerHTML = marked.parse(md);

        if (mathStore.length > 0) {
            let html = area.innerHTML;
            mathStore.forEach(({ id, tex, display }) => {
                const escaped = id.replace(/\x02/g, '&#x2;').replace(/\x03/g, '&#x3;');
                [id, escaped].forEach(key => {
                    if (html.includes(key)) {
                        let rendered;
                        try {
                            rendered = katex.renderToString(tex, {
                                displayMode: display,
                                throwOnError: false,
                                errorColor: '#e53935',
                            });
                        } catch (e) {
                            rendered = `<span style="color:#e53935">[math error: ${tex}]</span>`;
                        }
                        html = html.split(key).join(rendered);
                    }
                });
            });
            area.innerHTML = html;
        }
        
        setTimeout(() => {
            area.querySelectorAll('img').forEach(img => {
                const rawSrc = img.getAttribute('src');
                if (rawSrc && !rawSrc.startsWith('http')) {
                    const fileName = rawSrc.split('/').pop();
                    if (isGitHubPages) {
                        img.src = `${RAW_CONTENT_BASE_URL}${bookPath}/chapters/${chapterId}/images/${fileName}`;
                    } else {
                        img.src = `${BASE_URL}${bookPath}/chapters/${chapterId}/images/${fileName}`;
                    }
                }
                img.classList.add('med-img');
            });

            labelDetailsDepth(area);
            _initMdProgress(rawMd, area);

            if (!window.location.hash) {
                const saved = ReaderSettings.getScroll(chapterId);
                window.scrollTo(0, saved || 0);
            }

            _updateReadDotsInSidebar();
            _renderBookmarkAnchors();
            _renderBookmarksList();
            _updateBookmarkButtonState();
            _closeSearch();
            _updateProgressBar();
        }, 0);
    } catch (e) {
        area.innerHTML = `<div class="error">Error loading chapter: ${e.message}</div>`;
        console.error("Failed to load chapter:", e);
    }
}

// ==================== SMART BACK BUTTON ====================
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const backButton = e.target.closest('a[data-back="true"]');
        if (backButton) {
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        }
    });

    _applyFontSettings();
    window.addEventListener('scroll', _onScrollSave, { passive: true });
    _initRadialMenu();
    _initFavorites();

    console.log('✅ Smart navigation active');
});

function _initFavorites() {
    const btn = document.getElementById('favorite-toggle');
    if (!btn) return;

    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    if (!bookPath) return;

    const getFavs = () => {
        try {
            const favsStr = localStorage.getItem('starley_favorites');
            if (favsStr === null) {
                const oldFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
                localStorage.setItem('starley_favorites', JSON.stringify(oldFavs));
                return oldFavs;
            }
            return JSON.parse(favsStr) || [];
        } catch(e) { return []; }
    };

    const updateBtn = () => {
        try {
            const favs = getFavs();
            const isFav = favs.includes(bookPath);
            const icon = btn.querySelector('i');
            if (isFav) {
                icon.className = 'fas fa-heart';
                btn.style.color = '#e74c3c';
            } else {
                icon.className = 'far fa-heart';
                btn.style.color = '';
            }
        } catch (e) {}
    };

    btn.addEventListener('click', (e) => {
        try {
            let favs = getFavs();
            let isActive = false;
            if (favs.includes(bookPath)) {
                favs = favs.filter(p => p !== bookPath);
                isActive = false;
            } else {
                favs.push(bookPath);
                isActive = true;
            }
            localStorage.setItem('starley_favorites', JSON.stringify(favs));
            updateBtn();
        } catch (e) {}
    });

    updateBtn();
}

// ==========================================================================
//  RADIAL MENU IMPLEMENTATION
// ==========================================================================

function _initRadialMenu() {
    const container  = document.getElementById('radial-menu-container');
    const trigger    = document.getElementById('radial-trigger');
    const backdrop   = document.getElementById('radial-backdrop');
    const fontPicker = document.getElementById('font-picker');
    const editionPicker = document.getElementById('edition-picker');

    if (!container || !trigger) return;

    _restoreMenuPosition(container);
    _initDrag(container, trigger);

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container.classList.contains('was-dragged')) {
            container.classList.remove('was-dragged');
            return;
        }
        if (fontPicker)    fontPicker.classList.remove('visible');
        if (editionPicker) editionPicker.classList.remove('visible');
        const opening = !container.classList.contains('open');
        container.classList.toggle('open');
        document.body.classList.toggle('radial-open');
        if (opening) _positionItems(container);
    });

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            container.classList.remove('open');
            document.body.classList.remove('radial-open');
            if (fontPicker)    fontPicker.classList.remove('visible');
            if (editionPicker) editionPicker.classList.remove('visible');
        });
    }

    document.querySelectorAll('.radial-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if      (action === 'font-decrease')  { _changeFontSize(-1); }
            else if (action === 'font-increase')  { _changeFontSize(+1); }
            else if (action === 'collapse-all')   { _toggleAllDetails(false); _closeMenu(); }
            else if (action === 'expand-all')     { _toggleAllDetails(true);  _closeMenu(); }
            else if (action === 'scroll-top')     { window.scrollTo({ top: 0, behavior: 'smooth' }); _closeMenu(); }
            else if (action === 'font-pick')      { if (fontPicker) { fontPicker.classList.toggle('visible'); if (editionPicker) editionPicker.classList.remove('visible'); } }
            else if (action === 'night-mode')     { _toggleNightMode(); _closeMenu(); }
            else if (action === 'sepia-mode')     { _toggleSepiaMode(); _closeMenu(); }
            else if (action === 'text-width')     { _cycleTextWidth(); }
            else if (action === 'lh-increase')    { _changeLineHeight(+0.15); }
            else if (action === 'lh-decrease')    { _changeLineHeight(-0.15); }
            else if (action === 'reading-mode')   { _toggleReadingMode(); }
            else if (action === 'search-open')    { _openSearch(); _closeMenu(); }
            else if (action === 'print-chapter')  { _printChapter(); _closeMenu(); }
        });
    });

    document.querySelectorAll('.radial-item-inner').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            const params = new URLSearchParams(window.location.search);
            const bookPath = params.get('book');

            if (action === 'go-library') {
                window.location.href = 'index.html';
            } else if (action === 'go-magazine') {
                if (bookPath) window.location.href = `magazine.html?book=${bookPath}`;
                _closeMenu();
            } else if (action === 'go-quiz') {
                if (bookPath) window.location.href = `quiz.html?book=${bookPath}`;
                _closeMenu();
            } else if (action === 'edition-pick') {
                if (editionPicker) {
                    editionPicker.classList.toggle('visible');
                    if (fontPicker)    fontPicker.classList.remove('visible');
                    const cp = document.getElementById('chapter-picker');
                    if (cp) cp.classList.remove('visible');
                    _syncEditionPickerUI();
                }
            } else if (action === 'chapter-pick') {
                const cp = document.getElementById('chapter-picker');
                if (cp) {
                    const opening = !cp.classList.contains('visible');
                    cp.classList.toggle('visible');
                    if (opening) _populateChapterPicker();
                    if (editionPicker) editionPicker.classList.remove('visible');
                    if (fontPicker)    fontPicker.classList.remove('visible');
                }
            } else if (action === 'focus-mode') {
                document.body.classList.toggle('focus-mode');
                _closeMenu();
            } else if (action === 'bookmark-panel') {
                _openBookmarksModal();
                _closeMenu();
            }
        });
    });

    if (editionPicker) {
        editionPicker.querySelectorAll('.edition-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const edition = btn.dataset.edition;
                editionPicker.classList.remove('visible');
                _closeMenu();

                const params = new URLSearchParams(window.location.search);
                const bookPath = params.get('book');

                if (edition === 'magazine') {
                    if (bookPath) {
                        window.location.href = `magazine.html?book=${bookPath}`;
                    }
                    return;
                }

                if (edition === 'quiz') {
                    if (bookPath) {
                        window.location.href = `quiz.html?book=${bookPath}`;
                    }
                    return;
                }

                if (typeof updateUrl === 'function' && _currentChapterId) {
                    updateUrl(bookPath, _currentChapterId, edition);
                }
            });
        });

        // Check if book has magazine or quiz and show buttons
        const params = new URLSearchParams(window.location.search);
        const bookPath = params.get('book');
        if (bookPath) {
            const metadataUrl = `${window.location.hostname.includes('github.io') ? RAW_CONTENT_BASE_URL : BASE_URL}${bookPath}/metadata.json?v=${Date.now()}`;
            fetch(metadataUrl).then(r => r.json()).then(data => {
                const book = data[0];
                if (!book) return;

                console.log('[Reader] Detected features for', bookPath, ':', { magazine: !!book.magazine, quiz: !!book.quiz });

                // Magazine visibility
                if (book.magazine) {
                    const magBtn = editionPicker.querySelector('.edition-magazine');
                    if (magBtn) magBtn.style.display = 'block';
                    const headBtn = document.getElementById('mag-header-btn');
                    if (headBtn) {
                        headBtn.style.display = 'inline-flex';
                        headBtn.onclick = () => window.location.href = `magazine.html?book=${bookPath}`;
                    }
                    const radialMagBtn = document.getElementById('radial-mag-btn');
                    if (radialMagBtn) radialMagBtn.style.display = 'flex';
                }

                // Quiz visibility
                if (book.quiz) {
                    const quizBtn = editionPicker.querySelector('.edition-quiz');
                    if (quizBtn) quizBtn.style.display = 'block';
                    
                    const headQuizBtn = document.getElementById('quiz-header-btn'); 
                    if (headQuizBtn) {
                        headQuizBtn.style.display = 'inline-flex';
                        headQuizBtn.onclick = () => window.location.href = `quiz.html?book=${bookPath}`;
                    }
                    const radialQuizBtn = document.getElementById('radial-quiz-btn');
                    if (radialQuizBtn) radialQuizBtn.style.display = 'flex';
                }
            }).catch(err => console.error('Failed to load metadata for feature check:', err));
        }
    }
    if (fontPicker) {
        fontPicker.querySelectorAll('.font-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                _setFontFamily(btn.dataset.font);
                fontPicker.classList.remove('visible');
                _closeMenu();
            });
        });
    }

    _syncFontPickerUI();
    _syncEditionPickerUI();
    _applyNightMode();
    _applySepiaMode();
    _applyTextWidth();
    _applyLineHeight();
    _initSearch();
    _initBookmarks();
    _initReadingMode();
    _initTooltips();
}

function _initReadingMode() {
    const active = ReaderSettings.getReadingMode();
    if (active) {
        document.body.classList.add('reading-mode-active');
        _attachReadingModeListeners();
    }
    _syncReadingModeUI();
}

function _toggleReadingMode() {
    const active = !document.body.classList.contains('reading-mode-active');
    document.body.classList.toggle('reading-mode-active', active);
    ReaderSettings.setReadingMode(active);
    
    if (active) {
        _attachReadingModeListeners();
    } else {
        _detachReadingModeListeners();
    }
    _syncReadingModeUI();
    _closeMenu();
}

function _syncReadingModeUI() {
    const active = document.body.classList.contains('reading-mode-active');
    const btn = document.querySelector('[data-action="reading-mode"]');
    if (btn) {
        btn.classList.toggle('active', active);
        btn.style.boxShadow = active ? '0 0 15px rgba(255, 210, 0, 0.8), inset 0 0 5px white' : '';
    }
}

function _handlePageTap(e) {
    if (e.target.closest('button, a, summary, input, .radial-item, #radial-trigger')) return;
    
    const x = e.clientX;
    const y = e.clientY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (y < h * 0.7) return;

    const overlap = 40; 
    const scrollAmount = h - overlap;

    if (x < w * 0.4) {
        window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
        _showTapFeedback('back');
    } else if (x > w * 0.6) {
        window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
        _showTapFeedback('forward');
    }
}

function _attachReadingModeListeners() {
    document.addEventListener('pointerup', _handlePageTap);
}

function _detachReadingModeListeners() {
    document.removeEventListener('pointerup', _handlePageTap);
}

function _showTapFeedback(dir) {
    const feedback = document.createElement('div');
    feedback.style.position = 'fixed';
    feedback.style.bottom = '20px';
    feedback.style.padding = '10px 20px';
    feedback.style.background = 'rgba(0,0,0,0.5)';
    feedback.style.color = 'white';
    feedback.style.borderRadius = '20px';
    feedback.style.pointerEvents = 'none';
    feedback.style.zIndex = '3000';
    feedback.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    feedback.style.fontSize = '0.8rem';
    feedback.style.opacity = '1';
    
    if (dir === 'back') {
        feedback.style.left = '20px';
        feedback.textContent = '← Назад';
    } else {
        feedback.style.right = '20px';
        feedback.textContent = 'Вперед →';
    }
    
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-20px)';
        setTimeout(() => feedback.remove(), 500);
    }, 500);
}

function _positionItems(container) {
    const R_OUTER = 95;
    const R_INNER = 52;
    const rect   = container.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const normX  = cx / window.innerWidth;
    const normY  = cy / window.innerHeight;

    let startAngleDeg;
    if      (normX > 0.6 && normY > 0.6) startAngleDeg = 135;
    else if (normX < 0.4 && normY > 0.6) startAngleDeg = 45;
    else if (normX > 0.6 && normY < 0.4) startAngleDeg = 225;
    else if (normX < 0.4 && normY < 0.4) startAngleDeg = 315;
    else if (normX > 0.6)                startAngleDeg = 180;
    else if (normX < 0.4)                startAngleDeg = 0;
    else if (normY > 0.6)                startAngleDeg = 90;
    else                                 startAngleDeg = 270;

    const startRad = startAngleDeg * Math.PI / 180;
    const outerItems = Array.from(container.querySelectorAll('.radial-item')).filter(el => getComputedStyle(el).display !== 'none');
    const stepOuter  = (2 * Math.PI) / outerItems.length;

    outerItems.forEach((item, i) => {
        const angle = startRad + i * stepOuter;
        const tx = Math.round(Math.cos(angle) * R_OUTER);
        const ty = Math.round(-Math.sin(angle) * R_OUTER);
        const t  = `translate(${tx}px, ${ty}px)`;
        item.style.setProperty('--item-translate', t);
        item.style.transform = `${t} scale(1)`;
        item.style.transitionDelay = (i * 0.03) + 's';
    });

    const innerItems = Array.from(container.querySelectorAll('.radial-item-inner')).filter(el => getComputedStyle(el).display !== 'none');
    const stepInner  = (2 * Math.PI) / innerItems.length;
    const startInner = startRad + stepInner / 2;

    innerItems.forEach((item, i) => {
        const angle = startInner + i * stepInner;
        const tx = Math.round(Math.cos(angle) * R_INNER);
        const ty = Math.round(-Math.sin(angle) * R_INNER);
        const t  = `translate(${tx}px, ${ty}px)`;
        item.style.setProperty('--inner-translate', t);
        item.style.transform = `${t} scale(1)`;
        item.style.transitionDelay = (i * 0.03 + 0.05) + 's';
    });
}

const _TIP_COLORS = {
    'ri-teal': '#26d0ce', 'ri-green': '#56ab2f', 'ri-orange': '#f7971e',
    'ri-blue': '#2196f3', 'ri-red': '#e53935', 'ri-purple': '#7b1fa2',
    'ri-pink': '#e91e8c', 'ri-indigo': '#3949ab',
    'rii-gray': '#78909c', 'rii-blue': '#29b6f6', 'rii-indigo':'#5c6bc0',
    'rii-amber': '#f9a825', 'rii-green': '#66bb6a',
};

let _tipEl = null, _tipTimer = null;

function _initTooltips() {
    _tipEl = document.getElementById('radial-tip-layer');
    if (!_tipEl) return;
    document.querySelectorAll('.radial-item, .radial-item-inner').forEach(btn => {
        if (!btn.dataset.tooltip) return;
        btn.addEventListener('pointerenter', () => {
            clearTimeout(_tipTimer);
            if (!btn._isTouch) _tipTimer = setTimeout(() => _showTip(btn), 320);
        });
        btn.addEventListener('pointerdown', (e) => {
            btn._isTouch = (e.pointerType === 'touch');
            clearTimeout(_tipTimer);
            _hideTip();
        });
        btn.addEventListener('pointerleave', () => _hideTip());
        btn.addEventListener('pointercancel', () => _hideTip());
        btn.addEventListener('click', () => _hideTip());
    });
}

function _showTip(btn) {
    if (!_tipEl) return;
    const colorClass = Array.from(btn.classList).find(c => c in _TIP_COLORS);
    const color = colorClass ? _TIP_COLORS[colorClass] : '#4caf50';
    _tipEl.textContent = btn.dataset.tooltip;
    _tipEl.style.borderBottomColor = color;
    _tipEl.style.left = '-9999px';
    _tipEl.style.top  = '0px';
    void _tipEl.offsetWidth;
    const r = btn.getBoundingClientRect();
    let left = r.left + r.width / 2;
    let top = r.top - _tipEl.offsetHeight - 8;
    left = Math.max(_tipEl.offsetWidth / 2 + 4, Math.min(window.innerWidth - _tipEl.offsetWidth / 2 - 4, left));
    _tipEl.style.left = left + 'px';
    _tipEl.style.top  = top  + 'px';
    _tipEl.classList.add('visible');
}

function _hideTip() { clearTimeout(_tipTimer); if (_tipEl) _tipEl.classList.remove('visible'); }

function _initDrag(container, handle) {
    let dragging = false, moved = false, lastX = 0, lastY = 0;
    handle.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        handle.setPointerCapture(e.pointerId);
        dragging = true; moved = false;
        lastX = e.clientX; lastY = e.clientY;
        const rect = container.getBoundingClientRect();
        container.style.left = rect.left + 'px';
        container.style.top = rect.top + 'px';
        container.style.right = 'auto'; container.style.bottom = 'auto';
        container.classList.add('dragging');
    });
    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        if (!moved) return;
        const rect = container.getBoundingClientRect();
        container.style.left = Math.max(0, Math.min(window.innerWidth - 56, rect.left + dx)) + 'px';
        container.style.top = Math.max(0, Math.min(window.innerHeight - 56, rect.top + dy)) + 'px';
    });
    handle.addEventListener('pointerup', () => {
        if (!dragging) return; dragging = false;
        container.classList.remove('dragging');
        if (moved) {
            container.classList.add('was-dragged');
            ReaderSettings.set('reader_menu_left', parseFloat(container.style.left) || 0);
            ReaderSettings.set('reader_menu_top',  parseFloat(container.style.top)  || 0);
        }
    });
    handle.addEventListener('pointercancel', () => { dragging = false; container.classList.remove('dragging'); });
}

function _restoreMenuPosition(container) {
    const left = ReaderSettings.get('reader_menu_left', null), top = ReaderSettings.get('reader_menu_top', null);
    if (left !== null && top !== null) {
        const vw = window.innerWidth, vh = window.innerHeight;
        container.style.left = Math.max(8, Math.min(vw - 64, left)) + 'px';
        container.style.top = Math.max(8, Math.min(vh - 64, top)) + 'px';
        container.style.right = 'auto'; container.style.bottom = 'auto';
    }
}

function _closeMenu() {
    ['radial-menu-container','edition-picker','font-picker','chapter-picker'].forEach(id => {
        document.getElementById(id)?.classList.remove('open', 'visible');
    });
    document.body.classList.remove('radial-open');
    _hideTip();
}

function _populateChapterPicker() {
    const list = document.getElementById('chapter-picker-list');
    if (!list) return;
    list.innerHTML = '';
    const params = new URLSearchParams(window.location.search), bookPath = params.get('book');
    const metadataUrl = `${window.location.hostname.includes('github.io') ? RAW_CONTENT_BASE_URL : BASE_URL}${bookPath}/metadata.json?v=${Date.now()}`;
    fetch(metadataUrl).then(r => r.json()).then(data => {
        const bookMeta = data[0], allChapters = [...bookMeta.chapters, ...(bookMeta.appendices || [])];
        allChapters.forEach(ch => {
            const chId = ch.file.replace('.md', ''), isActive = (chId === _currentChapterId), hasSubs = ch.subchapters && ch.subchapters.length > 0;
            const btn = document.createElement('button');
            btn.className = 'chapter-picker-item' + (isActive && !hasSubs ? ' active' : '') + (hasSubs ? ' has-subchapters' : '');
            btn.textContent = ch.title;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!hasSubs) { _closeMenu(); if (typeof updateUrl === 'function') updateUrl(bookPath, chId, params.get('edition')||'original'); }
                else { btn.classList.toggle('expanded'); const sub = btn.nextElementSibling; if (sub) sub.style.display = sub.style.display === 'none' ? 'block' : 'none'; }
            });
            list.appendChild(btn);
            if (hasSubs) {
                const subDiv = document.createElement('div'); subDiv.className = 'subchapter-picker'; subDiv.style.display = isActive ? 'block' : 'none';
                ch.subchapters.forEach(sub => {
                    const subId = sub.file.replace('.md', ''), isSubActive = (subId === _currentChapterId);
                    const subBtn = document.createElement('button'); subBtn.className = 'chapter-picker-item subchapter' + (isSubActive ? ' active' : '');
                    subBtn.textContent = '↳ ' + sub.title;
                    subBtn.addEventListener('click', (e) => { e.stopPropagation(); _closeMenu(); if (typeof updateUrl === 'function') updateUrl(bookPath, subId, params.get('edition')||'original'); });
                    subDiv.appendChild(subBtn);
                });
                list.appendChild(subDiv);
            }
        });
    }).catch(err => console.error(err));
}

function _syncEditionPickerUI() {
    const current = (new URLSearchParams(window.location.search)).get('edition') || 'original';
    document.querySelectorAll('.edition-option').forEach(btn => btn.classList.toggle('active', btn.dataset.edition === current));
    const btn = document.querySelector('[data-action="edition-pick"]');
    if (btn) btn.textContent = { original:'EN', russian:'RU', starley:'STL', hebrew:'HE' }[current] || 'EN';
}

function _changeFontSize(delta) {
    const next = Math.min(24, Math.max(12, ReaderSettings.getFontSize() + delta));
    ReaderSettings.setFontSize(next); document.documentElement.style.setProperty('--reader-font-size', next + 'px');
}

function _setFontFamily(name) {
    ReaderSettings.setFontFamily(name);
    document.body.classList.remove('font-inter','font-roboto','font-opensans','font-nunito','font-merriweather','font-lora','font-playfair','font-sourceserif','font-literata','font-mono');
    document.body.classList.add('font-' + name); _syncFontPickerUI();
}

function _syncFontPickerUI() {
    const current = ReaderSettings.getFontFamily();
    document.querySelectorAll('.font-option').forEach(btn => btn.classList.toggle('active', btn.dataset.font === current));
}

function _toggleNightMode() {
    const on = document.body.classList.toggle('night-mode'); ReaderSettings.set('reader_night_mode', on);
    const btn = document.querySelector('[data-action="night-mode"]'); if (btn) btn.textContent = on ? '☀' : '☾';
}

function _applyNightMode() {
    if (ReaderSettings.get('reader_night_mode', false)) {
        document.body.classList.add('night-mode');
        const btn = document.querySelector('[data-action="night-mode"]'); if (btn) btn.textContent = '☀';
    }
}

function _cycleTextWidth() {
    const widths = ['narrow', 'medium', 'wide'], current = ReaderSettings.get('reader_text_width', 'wide');
    const next = widths[(widths.indexOf(current) + 1) % widths.length];
    ReaderSettings.set('reader_text_width', next); _applyTextWidth();
}

function _applyTextWidth() {
    const val = ReaderSettings.get('reader_text_width', 'wide');
    document.body.classList.remove('tw-narrow', 'tw-medium', 'tw-wide'); document.body.classList.add('tw-' + val);
}

function _changeLineHeight(delta) {
    const next = Math.round(Math.min(2.4, Math.max(1.2, ReaderSettings.getLineHeight() + delta)) * 100) / 100;
    ReaderSettings.set('reader_line_height', next); _applyLineHeight();
}

ReaderSettings.getLineHeight = function() { return this.get('reader_line_height', 1.65); };
function _applyLineHeight() { document.documentElement.style.setProperty('--reader-line-height', ReaderSettings.getLineHeight()); }

function _printChapter() {
    const area = document.getElementById('content-area'); if (area) area.querySelectorAll('details').forEach(d => d.open = true);
    const wasNight = document.body.classList.contains('night-mode'), wasSepia = document.body.classList.contains('sepia-mode');
    document.body.classList.remove('night-mode', 'sepia-mode'); window.print();
    setTimeout(() => { if (wasNight) document.body.classList.add('night-mode'); if (wasSepia) document.body.classList.add('sepia-mode'); }, 500);
}

function _toggleAllDetails(open) { document.getElementById('content-area')?.querySelectorAll('details').forEach(d => d.open = open); }

function _toggleSepiaMode() {
    const on = document.body.classList.toggle('sepia-mode'); if (on) document.body.classList.remove('night-mode');
    ReaderSettings.set('reader_sepia_mode', on); _syncThemeButtons();
}
function _applySepiaMode() { if (ReaderSettings.get('reader_sepia_mode', false)) { document.body.classList.add('sepia-mode'); document.body.classList.remove('night-mode'); _syncThemeButtons(); } }
function _syncThemeButtons() {
    const n = document.body.classList.contains('night-mode'), s = document.body.classList.contains('sepia-mode');
    const nb = document.querySelector('[data-action="night-mode"]'), sb = document.querySelector('[data-action="sepia-mode"]');
    if (nb) nb.textContent = n ? '☀' : '☾'; if (sb) sb.style.opacity = s ? '1' : '0.7';
}

function _initSearch() {
    const input = document.getElementById('search-input'); if (!input) return;
    let timer = null; input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => _runSearch(input.value.trim()), 180); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.shiftKey ? _searchStep(-1) : _searchStep(+1); else if (e.key === 'Escape') _closeSearch(); });
    document.getElementById('search-next')?.addEventListener('click', () => _searchStep(+1));
    document.getElementById('search-prev')?.addEventListener('click', () => _searchStep(-1));
    document.getElementById('search-close')?.addEventListener('click', () => _closeSearch());
    document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); _openSearch(); } });
}

function _openSearch() {
    const p = document.getElementById('search-panel'), i = document.getElementById('search-input'); if (!p) return;
    p.style.display = 'block'; p.offsetHeight; p.classList.add('open'); setTimeout(() => { i?.focus(); i?.select(); }, 60);
}
function _closeSearch() {
    const p = document.getElementById('search-panel'); if (!p) return; p.classList.remove('open'); setTimeout(() => p.style.display = 'none', 280);
    _clearSearchHighlights(); const i = document.getElementById('search-input'), c = document.getElementById('search-count'); if (i) i.value = ''; if (c) c.textContent = '';
}
function _runSearch(q) {
    _clearSearchHighlights(); _searchMatches = []; if (!q || q.length < 2) { document.getElementById('search-count').textContent = ''; return; }
    const a = document.getElementById('content-area'); if (!a) return; a.querySelectorAll('details').forEach(d => d.open = true);
    _highlightTextNodes(a, new RegExp(q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi'));
    _searchMatches = Array.from(a.querySelectorAll('.search-highlight'));
    document.getElementById('search-count').textContent = _searchMatches.length ? '1 / ' + _searchMatches.length : 'no results';
    if (_searchMatches.length) { _searchCurrent = 0; _activateMatch(0, false); }
}

function _highlightTextNodes(root, regex) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => ['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(n.parentElement?.tagName) || n.parentElement?.classList.contains('search-highlight') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; let n; while (n = walker.nextNode()) nodes.push(n);
    nodes.forEach(node => {
        const text = node.textContent; if (!regex.test(text)) return; regex.lastIndex = 0;
        const frag = document.createDocumentFragment(); let last = 0, m;
        while (m = regex.exec(text)) {
            if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
            const s = document.createElement('span'); s.className = 'search-highlight'; s.textContent = m[0]; frag.appendChild(s); last = m.index + m[0].length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
    });
}
function _clearSearchHighlights() { document.getElementById('content-area')?.querySelectorAll('.search-highlight').forEach(s => s.parentNode.replaceChild(document.createTextNode(s.textContent), s)); document.getElementById('content-area')?.normalize(); }
function _searchStep(dir) { if (!_searchMatches.length) return; _searchCurrent = (_searchCurrent + dir + _searchMatches.length) % _searchMatches.length; _activateMatch(_searchCurrent, true); }
function _activateMatch(idx, upd) {
    _searchMatches.forEach(m => m.classList.remove('search-current')); const el = _searchMatches[idx]; if (!el) return; el.classList.add('search-current');
    let p = el.parentElement; while (p && p.id !== 'content-area') { if (p.tagName === 'DETAILS') p.open = true; p = p.parentElement; }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (upd) document.getElementById('search-count').textContent = (idx + 1) + ' / ' + _searchMatches.length;
}

function _initBookmarks() {
    const t = document.getElementById('bookmark-toggle'), m = document.getElementById('bookmarks-modal'); if (!t) return;
    t.addEventListener('click', () => _openBookmarksModal()); document.getElementById('bookmarks-modal-close')?.addEventListener('click', () => _closeBookmarksModal());
    m?.querySelector('.bm-modal-backdrop')?.addEventListener('click', () => _closeBookmarksModal());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && m?.style.display !== 'none') _closeBookmarksModal(); });
    document.getElementById('bookmarks-clear')?.addEventListener('click', () => { if (confirm('Clear all?')) { _saveBookmarks(_getBookmarks().filter(b => b.chapterId !== _currentChapterId)); _renderBookmarksList(); _renderBookmarkAnchors(); _updateBookmarkButtonState(); } });
    let lastTap = 0; document.addEventListener('touchend', (e) => { const now = Date.now(); if (now - lastTap < 350) _handleBookmarkTap(e.target); lastTap = now; }, { passive: true });
    document.addEventListener('dblclick', (e) => _handleBookmarkTap(e.target)); _renderBookmarkAnchors(); _updateBookmarkButtonState();
}
function _handleBookmarkTap(target) { const a = document.getElementById('content-area'); if (!a) return; let el = target; while (el && el !== a) { if (['P','H1','H2','H3','H4','H5','LI','TD','BLOCKQUOTE'].includes(el.tagName)) { _toggleBookmark(el); return; } el = el.parentElement; } }
function _openBookmarksModal() { const m = document.getElementById('bookmarks-modal'); if (!m) return; _renderBookmarksList(); m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
function _closeBookmarksModal() { const m = document.getElementById('bookmarks-modal'); if (m) m.style.display = 'none'; document.body.style.overflow = ''; }
function _getBookmarks() { return ReaderSettings.get('reader_bookmarks', []); }
function _saveBookmarks(l) { ReaderSettings.set('reader_bookmarks', l); }
function _toggleBookmark(el) {
    const text = el.textContent.trim().slice(0, 80), id = (_currentChapterId||'unknown') + '::' + btoa(encodeURIComponent(text)).slice(0, 24);
    let b = _getBookmarks(); const idx = b.findIndex(x => x.id === id);
    if (idx >= 0) { b.splice(idx, 1); el.querySelector('.bm-anchor')?.remove(); _flashElement(el, '#fee2e2'); }
    else { b.push({ id, chapterId: _currentChapterId, text, timestamp: Date.now() }); const a = document.createElement('span'); a.className = 'bm-anchor'; a.dataset.bmId = id; el.prepend(a); _flashElement(el, '#fef3c7'); }
    _saveBookmarks(b); _renderBookmarksList(); _updateBookmarkButtonState();
}
function _renderBookmarksList() {
    const l = document.getElementById('bookmarks-list'); if (!l) return; const b = _getBookmarks().filter(x => x.chapterId === _currentChapterId); l.innerHTML = '';
    if (!b.length) { l.innerHTML = '<div class="bm-empty">No bookmarks yet.</div>'; return; }
    b.forEach(x => {
        const i = document.createElement('div'); i.className = 'bm-item'; i.innerHTML = `<span class="bm-item-icon">🔖</span><span class="bm-item-text">${_escHtml(x.text)}</span><button class="bm-item-del" data-id="${x.id}">✕</button>`;
        i.querySelector('.bm-item-text').addEventListener('click', () => { _closeBookmarksModal(); setTimeout(() => _scrollToBookmark(x.id), 120); });
        i.querySelector('.bm-item-del').addEventListener('click', (e) => { e.stopPropagation(); _removeBookmarkById(x.id); }); l.appendChild(i);
    });
}
function _renderBookmarkAnchors() {
    const a = document.getElementById('content-area'); if (!a) return; a.querySelectorAll('.bm-anchor').forEach(x => x.remove());
    const b = _getBookmarks().filter(x => x.chapterId === _currentChapterId); if (!b.length) return;
    a.querySelectorAll('p, h1, h2, h3, h4, h5, li, td, blockquote').forEach(el => {
        const text = el.textContent.trim().slice(0, 80), id = (_currentChapterId||'unknown') + '::' + btoa(encodeURIComponent(text)).slice(0, 24);
        if (b.find(x => x.id === id) && !el.querySelector('.bm-anchor')) { const an = document.createElement('span'); an.className = 'bm-anchor'; an.dataset.bmId = id; el.prepend(an); }
    });
}
function _scrollToBookmark(id) { const a = document.querySelector(`.bm-anchor[data-bm-id="${id}"]`); if (a) { a.scrollIntoView({ behavior: 'smooth', block: 'center' }); _flashElement(a.parentElement, '#fef3c7'); } }
function _removeBookmarkById(id) { let b = _getBookmarks(); b = b.filter(x => x.id !== id); _saveBookmarks(b); document.querySelector(`.bm-anchor[data-bm-id="${id}"]`)?.remove(); _renderBookmarksList(); _updateBookmarkButtonState(); }
function _updateBookmarkButtonState() { const b = document.getElementById('bookmark-toggle'); if (b) b.classList.toggle('has-bookmarks', _getBookmarks().some(x => x.chapterId === _currentChapterId)); }
function _flashElement(el, c) { if (!el) return; const p = el.style.transition; el.style.transition = 'background 0.15s'; el.style.background = c; setTimeout(() => { el.style.background = ''; setTimeout(() => el.style.transition = p, 300); }, 400); }
function _escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
