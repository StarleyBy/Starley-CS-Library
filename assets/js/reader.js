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

        // Custom styling parser
        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        
        // Convert custom <mark> tags to <span> for consistent styling
        md = md.replace(/<mark class="m-([^"]+)">/g, '<span class="m-$1">');
        md = md.replace(/<\/mark>/g, '</span>');

        // Set the base URL for relative image paths to the chapter's images folder
        marked.setOptions({
            baseUrl: `${BASE_URL}${bookPath}/chapters/${chapterId}/images/`
        });
        
        // Добавляем класс в зависимости от языка
        if (edition === 'hebrew') {
            area.className = 'content hebrew-content';
        } else {
            area.className = 'content';
        }
        
        area.innerHTML = marked.parse(md);
        
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

    if (!container || !trigger) return;

    _restoreMenuPosition(container);
    _initDrag(container, trigger);

    // Toggle open/close (only if not a drag gesture)
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container.classList.contains('was-dragged')) {
            container.classList.remove('was-dragged');
            return;
        }
        if (fontPicker) fontPicker.classList.remove('visible');
        const opening = !container.classList.contains('open');
        container.classList.toggle('open');
        document.body.classList.toggle('radial-open');
        if (opening) _positionItems(container);
    });

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            container.classList.remove('open');
            document.body.classList.remove('radial-open');
            if (fontPicker) fontPicker.classList.remove('visible');
        });
    }

    // Button actions
    document.querySelectorAll('.radial-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if      (action === 'font-decrease') { _changeFontSize(-1); }
            else if (action === 'font-increase') { _changeFontSize(+1); }
            else if (action === 'collapse-all')  { _toggleAllDetails(false); _closeMenu(); }
            else if (action === 'expand-all')    { _toggleAllDetails(true);  _closeMenu(); }
            else if (action === 'scroll-top')    { window.scrollTo({ top: 0, behavior: 'smooth' }); _closeMenu(); }
            else if (action === 'font-pick')     { if (fontPicker) fontPicker.classList.toggle('visible'); }
            else if (action === 'night-mode')    { _toggleNightMode(); _closeMenu(); }
            else if (action === 'sepia-mode')    { _toggleSepiaMode(); _closeMenu(); }
            else if (action === 'text-width')    { _cycleTextWidth(); }
            else if (action === 'lh-increase')   { _changeLineHeight(+0.15); }
            else if (action === 'lh-decrease')   { _changeLineHeight(-0.15); }
            else if (action === 'search-open')   { _openSearch(); _closeMenu(); }
            else if (action === 'print-chapter') { _printChapter(); _closeMenu(); }
        });
    });

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
    _applyNightMode();
    _applySepiaMode();
    _applyTextWidth();
    _applyLineHeight();
    _initSearch();
    _initBookmarks();
}

// ==========================================================================
//  RADIAL ITEMS POSITIONING — full 360° circle, adaptive start angle
// ==========================================================================

function _positionItems(container) {
    const items  = Array.from(container.querySelectorAll('.radial-item'));
    const n      = items.length;
    const R      = 88; // radius px
    const ITEM_W = 42;

    // Determine button center in viewport
    const rect    = container.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    const vw      = window.innerWidth;
    const vh      = window.innerHeight;

    // Choose start angle so items open away from the nearest corner/edge.
    // Compute which quadrant the button is in and offset the circle start.
    const normX = cx / vw; // 0=left, 1=right
    const normY = cy / vh; // 0=top,  1=bottom

    // Base start angle in degrees (0° = right, CCW positive like math)
    // We want items to point away from the nearest edge.
    let startAngleDeg;
    if      (normX > 0.6 && normY > 0.6) startAngleDeg = 135;  // bottom-right → open top-left
    else if (normX < 0.4 && normY > 0.6) startAngleDeg = 45;   // bottom-left  → open top-right
    else if (normX > 0.6 && normY < 0.4) startAngleDeg = 225;  // top-right    → open bottom-left
    else if (normX < 0.4 && normY < 0.4) startAngleDeg = 315;  // top-left     → open bottom-right
    else if (normX > 0.6)                startAngleDeg = 180;   // right edge   → open left
    else if (normX < 0.4)                startAngleDeg = 0;     // left edge    → open right
    else if (normY > 0.6)                startAngleDeg = 90;    // bottom edge  → open up
    else                                 startAngleDeg = 270;   // top edge / center → open down

    const startRad = startAngleDeg * Math.PI / 180;
    const step     = (2 * Math.PI) / n;

    items.forEach((item, i) => {
        const angle = startRad + i * step;
        // CSS translate: x right = cos(angle)*R, y down = -sin(angle)*R
        const tx = Math.round(Math.cos(angle) * R);
        const ty = Math.round(-Math.sin(angle) * R);

        const translateStr = `translate(${tx}px, ${ty}px)`;
        item.style.setProperty('--item-translate', translateStr);
        item.style.transform       = `${translateStr} scale(1)`;
        item.style.transitionDelay = (i * 0.035) + 's';
    });
}

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
        if (!dragging) 