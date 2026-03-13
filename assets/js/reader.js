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
    const container = document.getElementById('radial-menu-container');
    const trigger   = document.getElementById('radial-trigger');
    const backdrop  = document.getElementById('radial-backdrop');
    const fontPicker = document.getElementById('font-picker');

    if (!container || !trigger) return;

    // ---- Restore saved position ----
    _restoreMenuPosition(container);

    // ---- Drag logic ----
    _initDrag(container, trigger);

    // ---- Toggle open/close (only if not dragging) ----
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container.classList.contains('was-dragged')) {
            container.classList.remove('was-dragged');
            return;
        }
        if (fontPicker) fontPicker.classList.remove('visible');
        container.classList.toggle('open');
        document.body.classList.toggle('radial-open');
    });

    // ---- Close on backdrop click ----
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            container.classList.remove('open');
            document.body.classList.remove('radial-open');
            if (fontPicker) fontPicker.classList.remove('visible');
        });
    }

    // ---- Button actions ----
    document.querySelectorAll('.radial-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;

            if (action === 'font-decrease') {
                _changeFontSize(-1);
            } else if (action === 'font-increase') {
                _changeFontSize(+1);
            } else if (action === 'collapse-all') {
                _toggleAllDetails(false);
                _closeMenu();
            } else if (action === 'expand-all') {
                _toggleAllDetails(true);
                _closeMenu();
            } else if (action === 'scroll-top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                _closeMenu();
            } else if (action === 'font-pick') {
                if (fontPicker) fontPicker.classList.toggle('visible');
            }
        });
    });

    // ---- Font picker buttons ----
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
}

// ==========================================================================
//  DRAG — pointer events based, works mouse + touch
// ==========================================================================

function _initDrag(container, handle) {
    let startX, startY, startRight, startBottom;
    let dragging = false;
    let moved    = false;

    handle.addEventListener('pointerdown', (e) => {
        // Only primary button
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);

        dragging = true;
        moved    = false;

        // Compute current fixed position in terms of right/bottom
        const rect   = container.getBoundingClientRect();
        startX       = e.clientX;
        startY       = e.clientY;
        startRight   = window.innerWidth  - rect.right;
        startBottom  = window.innerHeight - rect.bottom;

        container.classList.add('dragging');
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        if (!moved) return;

        // right increases when moving left (dx < 0), decreases when moving right (dx > 0)
        // bottom increases when moving up (dy < 0), decreases when moving down (dy > 0)
        let newRight  = Math.max(0, Math.min(window.innerWidth  - 56, startRight  - dx));
        let newBottom = Math.max(0, Math.min(window.innerHeight - 56, startBottom - dy));

        container.style.right  = newRight  + 'px';
        container.style.bottom = newBottom + 'px';
        container.style.left   = 'auto';
        container.style.top    = 'auto';
    });

    handle.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        container.classList.remove('dragging');

        if (moved) {
            container.classList.add('was-dragged');
            // Save position
            ReaderSettings.set('reader_menu_right',  parseFloat(container.style.right)  || 32);
            ReaderSettings.set('reader_menu_bottom', parseFloat(container.style.bottom) || 32);
        }
    });

    handle.addEventListener('pointercancel', () => {
        dragging = false;
        container.classList.remove('dragging');
    });
}

function _restoreMenuPosition(container) {
    const right  = ReaderSettings.get('reader_menu_right',  null);
    const bottom = ReaderSettings.get('reader_menu_bottom', null);
    if (right !== null && bottom !== null) {
        container.style.right  = right  + 'px';
        container.style.bottom = bottom + 'px';
        container.style.left   = 'auto';
        container.style.top    = 'auto';
    }
}

function _closeMenu() {
    const container = document.getElementById('radial-menu-container');
    if (container) container.classList.remove('open');
    document.body.classList.remove('radial-open');
}

// ---- Font size ----
function _changeFontSize(delta) {
    const MIN = 12, MAX = 24;
    let next = Math.min(MAX, Math.max(MIN, ReaderSettings.getFontSize() + delta));
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

// ---- Collapse / expand all details ----
function _toggleAllDetails(open) {
    const area = document.getElementById('content-area');
    if (!area) return;
    area.querySelectorAll('details').forEach(d => { d.open = open; });
}
