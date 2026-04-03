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
    },

    get(key, fallback = null) {
        try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
        catch { return fallback; }
    },

    set(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },

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

        let url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        let response = await fetch(url);
        
        if (!response.ok) {
            console.warn(`${edition} version not found, falling back to original.`);
            url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}.md`;
            response = await fetch(url);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let md = await response.text();
        const rawMd = md; // preserve original for line counting

        // --- Protect LaTeX math from marked.js mangling ---
        // Order matters: longer/more specific patterns first
        // 1. Display math: $$...$$ and \[...\]
        // 2. Inline math:  $...$ and \(...\)
        // Must run BEFORE marked.parse and BEFORE [[...]] oval replacement
        const mathStore = [];
        function storeMath(tex, display) {
            const id = '\x02MATH' + mathStore.length + '\x03';
            let safeTex = tex;
            // % is LaTeX comment char — escape unescaped %
            safeTex = safeTex.replace(/(?<!\\)%/g, '\\%');
            // Unicode middle dot → \cdot
            safeTex = safeTex.replace(/·/g, '\\cdot ');
            // Unicode multiplication × inside math (outside \text) → \times
            // Only replace × that are NOT inside \text{...}
            safeTex = safeTex.replace(/(?<!\\text\{[^}]*)×(?![^{]*\})/g, '\\times ');
            // Unicode minus − → - 
            safeTex = safeTex.replace(/−/g, '-');
            // Unicode superscript digits → ^{n}
            const supMap = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-'};
            safeTex = safeTex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^{' + m.split('').map(c => supMap[c]||c).join('') + '}');
            mathStore.push({ id, tex: safeTex, display });
            return id;
        }

        // \[...\] display math (multiline)
        md = md.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, tex) => storeMath(tex, true));
        // $$...$$ display math
        md = md.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => storeMath(tex, true));
        // \(...\) inline math
        md = md.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, tex) => storeMath(tex, false));
        // $...$ inline math — only single $ not preceded/followed by $
        md = md.replace(/\$([^\n$][^$]*?)\$/g, (_, tex) => storeMath(tex, false));

        // Custom styling parser
        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        
        // Convert custom <mark> tags to <span> for consistent styling
        md = md.replace(/<mark class="m-([^"]+)">/g, '<span class="m-$1">');
        md = md.replace(/<\/mark>/g, '</span>');

        // Set the base URL for relative image paths to the chapter's images folder
        marked.setOptions({
            baseUrl: `${BASE_URL}${bookPath}/chapters/${chapterId}/images/`
        });
        
        // Set html lang for correct hyphenation
        const langMap = { original: 'en', russian: 'ru', starley: 'en', hebrew: 'he' };
        document.documentElement.lang = langMap[edition] || 'en';

        // Добавляем класс в зависимости от языка
        if (edition === 'hebrew') {
            area.className = 'content hebrew-content';
        } else {
            area.className = 'content';
        }
        
        area.innerHTML = marked.parse(md);

        // Restore math placeholders and render with KaTeX
        if (mathStore.length > 0) {
            let html = area.innerHTML;
            mathStore.forEach(({ id, tex, display }) => {
                // marked may have wrapped placeholder in <p> — replace the text node
                const escaped = id.replace(/\x02/g, '&#x2;').replace(/\x03/g, '&#x3;');
                // Try both raw and entity-encoded versions
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
        
        // Use a timeout to ensure the DOM has been updated by the browser
        // after setting innerHTML, before we try to query it.
        setTimeout(() => {
            area.querySelectorAll('img').forEach(img => {
                const rawSrc = img.getAttribute('src');
                if (rawSrc && !rawSrc.startsWith('http')) {
                    // Extract filename from rawSrc to handle cases where it might already contain path
                    const fileName = rawSrc.split('/').pop();
                    
                    // For GitHub Pages, we need to use the raw content URL for images
                    if (isGitHubPages) {
                        img.src = `${RAW_CONTENT_BASE_URL}${bookPath}/chapters/${chapterId}/images/${fileName}`;
                    } else {
                        // For local development, use the regular BASE_URL
                        img.src = `${BASE_URL}${bookPath}/chapters/${chapterId}/images/${fileName}`;
                    }
                }
                img.classList.add('med-img');
            });

            // Label <details> depth for colored triangles
            labelDetailsDepth(area);

            // Init MD-line-based progress bar
            _initMdProgress(rawMd, area);

            // Restore scroll position for this chapter (or go to top)
            if (!window.location.hash) {
                const saved = ReaderSettings.getScroll(chapterId);
                window.scrollTo(0, saved || 0);
            }

            // Update read dots in sidebar
            _updateReadDotsInSidebar();
            // Re-render bookmark anchors for new chapter
            _renderBookmarkAnchors();
            _renderBookmarksList();
            _updateBookmarkButtonState();
            // Close any open search
            _closeSearch();

            // Reset progress bar
            _updateProgressBar();
        }, 0);
    } catch (e) {
        area.innerHTML = `<div class="error">Error loading chapter: ${e.message}</div>`;
        console.error("Failed to load chapter:", e);
    }
}

// ==================== УМНАЯ КНОПКА ВОЗВРАТА ====================
// Обработка умных кнопок "назад" через историю браузера
document.addEventListener('DOMContentLoaded', function() {
    // Делегирование события для динамически загружаемого контента
    document.addEventListener('click', function(e) {
        // Проверяем, является ли кликнутый элемент умной кнопкой возврата
        const backButton = e.target.closest('a[data-back="true"]');
        if (backButton) {
            e.preventDefault();
            e.stopPropagation();
            window.history.back();
        }
    });

    // ---- Apply saved settings immediately ----
    _applyFontSettings();

    // ---- Scroll listener ----
    window.addEventListener('scroll', _onScrollSave, { passive: true });

    // ---- Init radial menu ----
    _initRadialMenu();

    console.log('✅ Умная навигация активирована');
});

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

    // Toggle open/close
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

    // Outer ring actions
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
            else if (action === 'search-open')    { _openSearch(); _closeMenu(); }
            else if (action === 'print-chapter')  { _printChapter(); _closeMenu(); }
        });
    });

    // Inner ring actions
    document.querySelectorAll('.radial-item-inner').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'go-library') {
                window.location.href = 'index.html';
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

    // Edition picker buttons
    if (editionPicker) {
        editionPicker.querySelectorAll('.edition-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const edition = btn.dataset.edition;
                editionPicker.classList.remove('visible');
                _closeMenu();
                // Trigger navigation via updateUrl if available
                if (typeof updateUrl === 'function' && _currentChapterId) {
                    const params = new URLSearchParams(window.location.search);
                    updateUrl(params.get('book'), _currentChapterId, edition);
                }
            });
        });
    }

    // Font picker buttons
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
    _initTooltips();
}

// ==========================================================================
//  RADIAL ITEMS POSITIONING — full 360° circle, adaptive start angle
// ==========================================================================

function _positionItems(container) {
    const R_OUTER = 95;  // outer ring radius px
    const R_INNER = 52;  // inner ring radius px

    // Determine button center in viewport for adaptive start angle
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

    // --- Outer ring ---
    const outerItems = Array.from(container.querySelectorAll('.radial-item'));
    const nOuter     = outerItems.length;
    const stepOuter  = (2 * Math.PI) / nOuter;

    outerItems.forEach((item, i) => {
        const angle = startRad + i * stepOuter;
        const tx = Math.round(Math.cos(angle) * R_OUTER);
        const ty = Math.round(-Math.sin(angle) * R_OUTER);
        const t  = `translate(${tx}px, ${ty}px)`;
        item.style.setProperty('--item-translate', t);
        item.style.transform       = `${t} scale(1)`;
        item.style.transitionDelay = (i * 0.03) + 's';
    });

    // --- Inner ring ---
    const innerItems = Array.from(container.querySelectorAll('.radial-item-inner'));
    const nInner     = innerItems.length;
    const stepInner  = (2 * Math.PI) / nInner;
    // Inner ring starts at same angle + half-step offset for visual balance
    const startInner = startRad + stepInner / 2;

    innerItems.forEach((item, i) => {
        const angle = startInner + i * stepInner;
        const tx = Math.round(Math.cos(angle) * R_INNER);
        const ty = Math.round(-Math.sin(angle) * R_INNER);
        const t  = `translate(${tx}px, ${ty}px)`;
        item.style.setProperty('--inner-translate', t);
        item.style.transform       = `${t} scale(1)`;
        item.style.transitionDelay = (i * 0.03 + 0.05) + 's'; // slight delay after outer
    });
}

// ==========================================================================
//  TOOLTIP MANAGER
//  Single #radial-tip-layer element lives in <body> — outside any transformed
//  container. Position calculated from getBoundingClientRect at show time.
//  This correctly handles the transform stacking context problem.
// ==========================================================================

const _TIP_COLORS = {
    'ri-teal':   '#26d0ce', 'ri-green':  '#56ab2f', 'ri-orange': '#f7971e',
    'ri-blue':   '#2196f3', 'ri-red':    '#e53935', 'ri-purple': '#7b1fa2',
    'ri-pink':   '#e91e8c', 'ri-indigo': '#3949ab',
    'rii-gray':  '#78909c', 'rii-blue':  '#29b6f6', 'rii-indigo':'#5c6bc0',
    'rii-amber': '#f9a825', 'rii-green': '#66bb6a',
};

let _tipEl    = null;
let _tipTimer = null;

function _initTooltips() {
    _tipEl = document.getElementById('radial-tip-layer');
    if (!_tipEl) return;

    document.querySelectorAll('.radial-item, .radial-item-inner').forEach(btn => {
        if (!btn.dataset.tooltip) return;

        btn.addEventListener('pointerenter', () => {
            clearTimeout(_tipTimer);
            // Only show on hover for non-touch (touch devices: pointermove threshold)
            if (!btn._isTouch) {
                _tipTimer = setTimeout(() => _showTip(btn), 320);
            }
        });
        btn.addEventListener('pointerdown', (e) => {
            btn._isTouch = (e.pointerType === 'touch');
            clearTimeout(_tipTimer);
            _hideTip();
        });
        btn.addEventListener('pointerleave',  () => { clearTimeout(_tipTimer); _hideTip(); });
        btn.addEventListener('pointercancel', () => { clearTimeout(_tipTimer); _hideTip(); });
        btn.addEventListener('click',         () => { clearTimeout(_tipTimer); _hideTip(); });
    });
}

function _showTip(btn) {
    if (!_tipEl) return;
    const colorClass = Array.from(btn.classList).find(c => c in _TIP_COLORS);
    const color = colorClass ? _TIP_COLORS[colorClass] : '#4caf50';

    // Set content and color BEFORE measuring
    _tipEl.textContent = btn.dataset.tooltip;
    _tipEl.style.borderBottomColor = color;

    // Place off-screen, make renderable (no .visible yet so opacity=0 via CSS)
    _tipEl.style.left = '-9999px';
    _tipEl.style.top  = '0px';
    // Force layout so offsetWidth is accurate
    void _tipEl.offsetWidth;

    const r    = btn.getBoundingClientRect();
    const tipW = _tipEl.offsetWidth;
    const tipH = _tipEl.offsetHeight;

    // Center above button
    let left = r.left + r.width / 2;
    let top  = r.top - tipH - 8;

    // Clamp to viewport
    left = Math.max(tipW / 2 + 4, Math.min(window.innerWidth - tipW / 2 - 4, left));
    top  = Math.max(4, top);

    _tipEl.style.left = left + 'px';
    _tipEl.style.top  = top  + 'px';

    // Now show via CSS class only — no inline opacity/visibility
    _tipEl.classList.add('visible');
}

function _hideTip() {
    clearTimeout(_tipTimer);
    if (_tipEl) _tipEl.classList.remove('visible');
}

function _hideAllTooltips() { _hideTip(); }

// ==========================================================================
//  DRAG — pointer events, touch-friendly (touch-action:none in CSS)
// ==========================================================================

function _initDrag(container, handle) {
    let dragging = false;
    let moved    = false;
    let lastX = 0, lastY = 0;

    handle.addEventListener('pointerdown', (e) => {
        // Allow only primary pointer (left mouse or first touch)
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // Do NOT call e.preventDefault() here — let touch-action:none handle it.
        // This is the key fix for mobile: preventDefault blocks pointer capture on some browsers.
        handle.setPointerCapture(e.pointerId);

        dragging = true;
        moved    = false;
        lastX    = e.clientX;
        lastY    = e.clientY;

        const rect = container.getBoundingClientRect();
        container.style.left   = rect.left + 'px';
        container.style.top    = rect.top  + 'px';
        container.style.right  = 'auto';
        container.style.bottom = 'auto';

        container.classList.add('dragging');
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        if (!moved) return;

        const rect    = container.getBoundingClientRect();
        const newLeft = Math.max(0, Math.min(window.innerWidth  - 56, rect.left + dx));
        const newTop  = Math.max(0, Math.min(window.innerHeight - 56, rect.top  + dy));

        container.style.left = newLeft + 'px';
        container.style.top  = newTop  + 'px';
    });

    handle.addEventListener('pointerup', () => {
        if (!dragging) return;
        dragging = false;
        container.classList.remove('dragging');

        if (moved) {
            container.classList.add('was-dragged');
            ReaderSettings.set('reader_menu_left', parseFloat(container.style.left) || 0);
            ReaderSettings.set('reader_menu_top',  parseFloat(container.style.top)  || 0);
        }
    });

    handle.addEventListener('pointercancel', () => {
        dragging = false;
        container.classList.remove('dragging');
    });
}

function _restoreMenuPosition(container) {
    const left = ReaderSettings.get('reader_menu_left', null);
    const top  = ReaderSettings.get('reader_menu_top',  null);
    if (left !== null && top !== null) {
        // Clamp to current viewport — saved position may be from a different screen size
        const MARGIN = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const SIZE = 56; // button size + some buffer
        const clampedLeft = Math.max(MARGIN, Math.min(vw - SIZE - MARGIN, left));
        const clampedTop  = Math.max(MARGIN, Math.min(vh - SIZE - MARGIN, top));
        container.style.left   = clampedLeft + 'px';
        container.style.top    = clampedTop  + 'px';
        container.style.right  = 'auto';
        container.style.bottom = 'auto';
    }
}

function _closeMenu() {
    const container     = document.getElementById('radial-menu-container');
    const editionPicker = document.getElementById('edition-picker');
    const fontPicker    = document.getElementById('font-picker');
    const chapterPicker = document.getElementById('chapter-picker');
    if (container)     container.classList.remove('open');
    if (editionPicker) editionPicker.classList.remove('visible');
    if (fontPicker)    fontPicker.classList.remove('visible');
    if (chapterPicker) chapterPicker.classList.remove('visible');
    document.body.classList.remove('radial-open');
    _hideAllTooltips();
}

function _populateChapterPicker() {
    const list = document.getElementById('chapter-picker-list');
    if (!list) return;
    list.innerHTML = '';

    const params  = new URLSearchParams(window.location.search);
    const edition = params.get('edition') || 'original';

    // Read chapters from the already-rendered sidebar chapter-list
    document.querySelectorAll('#chapter-list .chapter-item').forEach(item => {
        const chId    = item.dataset.chapterId;
        const title   = item.textContent.replace(/●/g, '').trim(); // strip read dots
        const isActive = (chId === _currentChapterId);

        const btn = document.createElement('button');
        btn.className = 'chapter-picker-item' + (isActive ? ' active' : '');
        btn.textContent = title;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('chapter-picker')?.classList.remove('visible');
            _closeMenu();
            if (typeof updateUrl === 'function') {
                updateUrl(params.get('book'), chId, edition);
            }
        });
        list.appendChild(btn);
    });

    if (!list.children.length) {
        list.innerHTML = '<div style="padding:8px;color:#999;font-size:0.8rem">No chapters loaded</div>';
    }
}

function _syncEditionPickerUI() {
    const params  = new URLSearchParams(window.location.search);
    const current = params.get('edition') || 'original';
    document.querySelectorAll('.edition-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.edition === current);
    });
    // Update the inner ring button label to show current edition
    const btn = document.querySelector('[data-action="edition-pick"]');
    if (btn) {
        const labels = { original:'EN', russian:'RU', starley:'STL', hebrew:'HE' };
        btn.textContent = labels[current] || 'EN';
    }
}

// ---- Font size ----
function _changeFontSize(delta) {
    const MIN = 12, MAX = 24;
    const next = Math.min(MAX, Math.max(MIN, ReaderSettings.getFontSize() + delta));
    ReaderSettings.setFontSize(next);
    document.documentElement.style.setProperty('--reader-font-size', next + 'px');
}

// ---- Font family — all 10 classes ----
const _ALL_FONT_CLASSES = [
    'font-inter','font-roboto','font-opensans','font-nunito',
    'font-merriweather','font-lora','font-playfair',
    'font-sourceserif','font-literata','font-mono'
];

function _setFontFamily(name) {
    ReaderSettings.setFontFamily(name);
    document.body.classList.remove(..._ALL_FONT_CLASSES);
    document.body.classList.add('font-' + name);
    _syncFontPickerUI();
}

function _syncFontPickerUI() {
    const current = ReaderSettings.getFontFamily();
    document.querySelectorAll('.font-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.font === current);
    });
}

// ---- Night mode ----
function _toggleNightMode() {
    const on = document.body.classList.toggle('night-mode');
    ReaderSettings.set('reader_night_mode', on);
    const btn = document.querySelector('[data-action="night-mode"]');
    if (btn) btn.textContent = on ? '☀' : '☾';
}

function _applyNightMode() {
    const on = ReaderSettings.get('reader_night_mode', false);
    if (on) {
        document.body.classList.add('night-mode');
        const btn = document.querySelector('[data-action="night-mode"]');
        if (btn) btn.textContent = '☀';
    }
}

// ---- Text width (content max-width cycling) ----
const _TEXT_WIDTHS = ['narrow', 'medium', 'wide'];

function _cycleTextWidth() {
    const current = ReaderSettings.get('reader_text_width', 'wide');
    const idx     = _TEXT_WIDTHS.indexOf(current);
    const next    = _TEXT_WIDTHS[(idx + 1) % _TEXT_WIDTHS.length];
    ReaderSettings.set('reader_text_width', next);
    _applyTextWidth();
}

function _applyTextWidth() {
    const val = ReaderSettings.get('reader_text_width', 'wide');
    document.body.classList.remove('tw-narrow', 'tw-medium', 'tw-wide');
    document.body.classList.add('tw-' + val);
}

// ---- Line height ----
function _changeLineHeight(delta) {
    const MIN = 1.2, MAX = 2.4;
    const current = ReaderSettings.get('reader_line_height', 1.65);
    const next = Math.round(Math.min(MAX, Math.max(MIN, current + delta)) * 100) / 100;
    ReaderSettings.set('reader_line_height', next);
    _applyLineHeight();
}

function _applyLineHeight() {
    const val = ReaderSettings.get('reader_line_height', 1.65);
    document.documentElement.style.setProperty('--reader-line-height', val);
}

// ==========================================================================
//  PRINT / SAVE AS PDF
// ==========================================================================

function _printChapter() {
    // 1. Expand all details so content is visible in print
    const area = document.getElementById('content-area');
    if (area) area.querySelectorAll('details').forEach(d => { d.open = true; });

    // 2. Set title on body for @page running header
    const titleEl = document.getElementById('book-title');
    const chapTitle = document.querySelector('#content-area h1, #content-area h2');
    const printTitle = [titleEl?.textContent, chapTitle?.textContent].filter(Boolean).join(' — ');
    document.body.setAttribute('data-print-title', printTitle);

    // 3. Temporarily force light mode for clean print
    const wasNight = document.body.classList.contains('night-mode');
    const wasSepia = document.body.classList.contains('sepia-mode');
    document.body.classList.remove('night-mode', 'sepia-mode');

    // 4. Print
    window.print();

    // 5. Restore theme after dialog closes
    setTimeout(() => {
        if (wasNight) document.body.classList.add('night-mode');
        if (wasSepia) document.body.classList.add('sepia-mode');
    }, 500);
}

// ---- Collapse / expand all details ----
function _toggleAllDetails(open) {
    const area = document.getElementById('content-area');
    if (!area) return;
    area.querySelectorAll('details').forEach(d => { d.open = open; });
}

// ==========================================================================
//  SEPIA MODE
// ==========================================================================

function _toggleSepiaMode() {
    // Sepia and night are mutually exclusive
    const on = document.body.classList.toggle('sepia-mode');
    if (on) document.body.classList.remove('night-mode');
    ReaderSettings.set('reader_sepia_mode', on);
    _syncThemeButtons();
}

function _applySepiaMode() {
    if (ReaderSettings.get('reader_sepia_mode', false)) {
        document.body.classList.add('sepia-mode');
        document.body.classList.remove('night-mode');
        _syncThemeButtons();
    }
}

function _syncThemeButtons() {
    const nightBtn = document.querySelector('[data-action="night-mode"]');
    const sepiaBtn = document.querySelector('[data-action="sepia-mode"]');
    if (nightBtn) nightBtn.textContent = document.body.classList.contains('night-mode') ? '☀' : '☾';
    if (sepiaBtn) sepiaBtn.style.opacity = document.body.classList.contains('sepia-mode') ? '1' : '0.7';
}

// ==========================================================================
//  SEARCH WITH AUTO-EXPAND
// ==========================================================================

let _searchMatches = [];
let _searchCurrent = -1;

function _initSearch() {
    const panel = document.getElementById('search-panel');
    const input = document.getElementById('search-input');
    if (!panel || !input) return;

    let _debounceTimer = null;
    input.addEventListener('input', () => {
        clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(() => _runSearch(input.value.trim()), 180);
    });

    input.addEventListener('keydown', (e) => {
        if      (e.key === 'Enter')  { e.shiftKey ? _searchStep(-1) : _searchStep(+1); }
        else if (e.key === 'Escape') { e.stopPropagation(); _closeSearch(); }
    });

    document.getElementById('search-next') ?.addEventListener('click', () => _searchStep(+1));
    document.getElementById('search-prev') ?.addEventListener('click', () => _searchStep(-1));
    document.getElementById('search-close')?.addEventListener('click', () => _closeSearch());

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            _openSearch();
        }
    });
}

function _openSearch() {
    const panel = document.getElementById('search-panel');
    const input = document.getElementById('search-input');
    if (!panel) return;
    panel.style.display = 'block';
    panel.offsetHeight; // force reflow for transition
    panel.classList.add('open');
    setTimeout(() => { if (input) { input.focus(); input.select(); } }, 60);
}

function _closeSearch() {
    const panel = document.getElementById('search-panel');
    if (!panel) return;
    panel.classList.remove('open');
    setTimeout(() => { panel.style.display = 'none'; }, 280);
    _clearSearchHighlights();
    _searchMatches = [];
    _searchCurrent = -1;
    const input   = document.getElementById('search-input');
    const countEl = document.getElementById('search-count');
    if (input)   input.value = '';
    if (countEl) countEl.textContent = '';
}

function _runSearch(query) {
    _clearSearchHighlights();
    _searchMatches = [];
    _searchCurrent = -1;

    const countEl = document.getElementById('search-count');
    if (!query || query.length < 2) {
        if (countEl) countEl.textContent = '';
        return;
    }

    const area = document.getElementById('content-area');
    if (!area) return;

    // Expand all details so hidden text is accessible
    area.querySelectorAll('details').forEach(d => { d.open = true; });

    // Build regex (escape special chars)
    const escaped = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');

    _highlightTextNodes(area, regex);

    _searchMatches = Array.from(area.querySelectorAll('.search-highlight'));

    if (countEl) {
        countEl.textContent = _searchMatches.length
            ? '1 / ' + _searchMatches.length
            : 'no results';
    }

    if (_searchMatches.length) {
        _searchCurrent = 0;
        _activateMatch(0, false);
    }
}

function _highlightTextNodes(root, regex) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            const p = node.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            if (['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(p.tagName))
                return NodeFilter.FILTER_REJECT;
            if (p.classList && p.classList.contains('search-highlight'))
                return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(function(textNode) {
        regex.lastIndex = 0;
        if (!regex.test(textNode.textContent)) return;
        regex.lastIndex = 0;

        const text = textNode.textContent;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        while ((m = regex.exec(text)) !== null) {
            if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
            const span = document.createElement('span');
            span.className = 'search-highlight';
            span.textContent = m[0];
            frag.appendChild(span);
            last = m.index + m[0].length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        textNode.parentNode.replaceChild(frag, textNode);
    });
}

function _clearSearchHighlights() {
    const area = document.getElementById('content-area');
    if (!area) return;
    area.querySelectorAll('.search-highlight').forEach(function(span) {
        span.parentNode.replaceChild(document.createTextNode(span.textContent), span);
    });
    area.normalize();
}

function _searchStep(dir) {
    if (!_searchMatches.length) return;
    _searchCurrent = (_searchCurrent + dir + _searchMatches.length) % _searchMatches.length;
    _activateMatch(_searchCurrent, true);
}

function _activateMatch(idx, updateCounter) {
    _searchMatches.forEach(function(m) { m.classList.remove('search-current'); });
    const el = _searchMatches[idx];
    if (!el) return;
    el.classList.add('search-current');

    // Open any ancestor <details>
    let p = el.parentElement;
    while (p && p.id !== 'content-area') {
        if (p.tagName === 'DETAILS') p.open = true;
        p = p.parentElement;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (updateCounter) {
        const countEl = document.getElementById('search-count');
        if (countEl) countEl.textContent = (idx + 1) + ' / ' + _searchMatches.length;
    }
}


// ==========================================================================
//  BOOKMARKS
// ==========================================================================

function _initBookmarks() {
    const toggleBtn  = document.getElementById('bookmark-toggle');
    const modal      = document.getElementById('bookmarks-modal');
    const clearBtn   = document.getElementById('bookmarks-clear');
    const closeBtn   = document.getElementById('bookmarks-modal-close');
    const backdrop   = modal?.querySelector('.bm-modal-backdrop');

    if (!toggleBtn) return;

    // Open modal
    toggleBtn.addEventListener('click', () => _openBookmarksModal());

    // Close modal
    closeBtn?.addEventListener('click',  () => _closeBookmarksModal());
    backdrop?.addEventListener('click',  () => _closeBookmarksModal());

    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.style.display !== 'none') {
            _closeBookmarksModal();
        }
    });

    // Clear all
    clearBtn?.addEventListener('click', () => {
        if (confirm('Clear all bookmarks in this chapter?')) {
            const all = _getBookmarks().filter(b => b.chapterId !== _currentChapterId);
            _saveBookmarks(all);
            _renderBookmarksList();
            _renderBookmarkAnchors();
            _updateBookmarkButtonState();
        }
    });

    // Double-tap / dblclick on paragraph to bookmark
    let _lastTap = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - _lastTap < 350) {
            _handleBookmarkTap(e.target);
        }
        _lastTap = now;
    }, { passive: true });

    document.addEventListener('dblclick', (e) => {
        _handleBookmarkTap(e.target);
    });

    _renderBookmarkAnchors();
    _updateBookmarkButtonState();
}

function _handleBookmarkTap(target) {
    const area = document.getElementById('content-area');
    if (!area) return;
    let el = target;
    while (el && el !== area) {
        if (['P','H1','H2','H3','H4','H5','LI','TD','BLOCKQUOTE'].includes(el.tagName)) {
            _toggleBookmark(el);
            return;
        }
        el = el.parentElement;
    }
}

function _openBookmarksModal() {
    const modal = document.getElementById('bookmarks-modal');
    if (!modal) return;
    _renderBookmarksList();
    modal.style.display = 'flex';
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
}

function _closeBookmarksModal() {
    const modal = document.getElementById('bookmarks-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function _getBookmarks() {
    return ReaderSettings.get('reader_bookmarks', []);
}

function _saveBookmarks(list) {
    ReaderSettings.set('reader_bookmarks', list);
}

function _toggleBookmark(el) {
    // Generate a stable ID for this element based on its text + position
    const text    = el.textContent.trim().slice(0, 80);
    const chapterId = _currentChapterId || 'unknown';
    const id      = chapterId + '::' + btoa(encodeURIComponent(text)).slice(0, 24);

    let bookmarks = _getBookmarks();
    const existing = bookmarks.findIndex(b => b.id === id);

    if (existing >= 0) {
        // Remove
        bookmarks.splice(existing, 1);
        el.querySelector('.bm-anchor')?.remove();
        _flashElement(el, '#fee2e2');
    } else {
        // Add
        const bm = {
            id,
            chapterId,
            text,
            timestamp: Date.now()
        };
        bookmarks.push(bm);

        // Insert visual anchor
        const anchor = document.createElement('span');
        anchor.className = 'bm-anchor';
        anchor.dataset.bmId = id;
        el.prepend(anchor);
        _flashElement(el, '#fef3c7');
    }

    _saveBookmarks(bookmarks);
    _renderBookmarksList();
    _updateBookmarkButtonState();
}

function _renderBookmarksList() {
    const list = document.getElementById('bookmarks-list');
    if (!list) return;
    const bookmarks = _getBookmarks().filter(b => b.chapterId === _currentChapterId);
    list.innerHTML = '';

    if (!bookmarks.length) {
        list.innerHTML = '<div class="bm-empty">No bookmarks yet.<br>Double-tap any paragraph to add one.</div>';
        return;
    }

    bookmarks.forEach(bm => {
        const item = document.createElement('div');
        item.className = 'bm-item';
        item.innerHTML = `
            <span class="bm-item-icon">🔖</span>
            <span class="bm-item-text">${_escHtml(bm.text)}</span>
            <button class="bm-item-del" data-id="${bm.id}" title="Remove">✕</button>
        `;
        // Tap/click to navigate — close modal first so paragraph is visible
        item.querySelector('.bm-item-text').addEventListener('click', () => {
            _closeBookmarksModal();
            setTimeout(() => _scrollToBookmark(bm.id), 120);
        });
        item.querySelector('.bm-item-del').addEventListener('click', (e) => {
            e.stopPropagation();
            _removeBookmarkById(bm.id);
        });
        list.appendChild(item);
    });
}

function _renderBookmarkAnchors() {
    const area = document.getElementById('content-area');
    if (!area) return;
    // Remove stale anchors
    area.querySelectorAll('.bm-anchor').forEach(a => a.remove());
    // Re-insert for current chapter
    const bookmarks = _getBookmarks().filter(b => b.chapterId === _currentChapterId);
    if (!bookmarks.length) return;

    // Match by text content
    area.querySelectorAll('p, h1, h2, h3, h4, h5, li, td, blockquote').forEach(el => {
        const text = el.textContent.trim().slice(0, 80);
        const id   = (_currentChapterId || 'unknown') + '::' + btoa(encodeURIComponent(text)).slice(0, 24);
        const bm   = bookmarks.find(b => b.id === id);
        if (bm && !el.querySelector('.bm-anchor')) {
            const anchor = document.createElement('span');
            anchor.className = 'bm-anchor';
            anchor.dataset.bmId = id;
            el.prepend(anchor);
        }
    });
}

function _scrollToBookmark(id) {
    const anchor = document.querySelector(`.bm-anchor[data-bm-id="${id}"]`);
    if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
        _flashElement(anchor.parentElement, '#fef3c7');
    }
}

function _removeBookmarkById(id) {
    let bookmarks = _getBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== id);
    _saveBookmarks(bookmarks);
    document.querySelector(`.bm-anchor[data-bm-id="${id}"]`)?.remove();
    _renderBookmarksList();
    _updateBookmarkButtonState();
}

function _updateBookmarkButtonState() {
    const btn = document.getElementById('bookmark-toggle');
    if (!btn) return;
    const hasAny = _getBookmarks().some(b => b.chapterId === _currentChapterId);
    btn.classList.toggle('has-bookmarks', hasAny);
}

function _flashElement(el, color) {
    if (!el) return;
    const prev = el.style.transition;
    el.style.transition = 'background 0.15s';
    el.style.background = color;
    setTimeout(() => {
        el.style.background = '';
        setTimeout(() => { el.style.transition = prev; }, 300);
    }, 400);
}

function _escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}