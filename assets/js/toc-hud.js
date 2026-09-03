/**
 * Dynamic HUD Table of Contents (TocHud)
 * Starley Medical Library
 * 
 * Features:
 * - Unified Floating Draggable Circular Button (54px x 54px) on Desktop & Mobile Smartphones
 * - Strict 1:1 Circle Aspect Ratio on collapse (.is-collapsed) across all viewports
 * - Automatic Viewport Bounds Clamping (Prevents off-screen clipping on screen resize / smartphones)
 * - HUD Color Themes (Glass, Light, Dark, Sepia, Neon, Emerald, Amber, Crimson) & Custom Opacity Levels (100%, 85%, 65%, 45%)
 * - Strict Text-Key Deduplication for <details><summary> and <h2> elements
 * - 100% Independent Floating HUD (Decoupled from layout sidebars)
 * - Reliable Collapse & Expand-Back from floating mini trigger
 * - Smart Directional Panel Opening (Down-Right, Down-Left, Up-Right, Up-Left)
 * - Dynamic Hierarchical Sub-section Tree expansion
 * - 60 FPS Scroll-Sync & IntersectionObserver
 * - Micro-search with 150ms debounce
 * - Haptic Feedback & Keyboard Shortcuts (Alt+T, Esc, Alt+Z)
 */

export class TocHud {
  constructor(options = {}) {
    this.containerSelector = options.container || '#content-area';
    this.container = document.querySelector(this.containerSelector);
    this.headerOffset = options.headerOffset || 80;
    
    this.headings = [];
    this.observer = null;
    this.scrollListener = null;
    this.resizeListener = null;
    this.activeId = null;
    this.isCollapsed = false;
    this.isZen = false;
    this.debounceTimer = null;

    // HUD Theme & Opacity Settings
    this.hudTheme = localStorage.getItem('toc_hud_theme') || 'glass';
    this.hudOpacity = parseFloat(localStorage.getItem('toc_hud_opacity') || '0.85');

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.destroy(); // Clean up existing instances if re-initializing
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) return;

    this.collectHeadings();
    if (this.headings.length === 0) {
      return; // No headings found
    }

    this.buildDOM();
    this.applyThemeAndOpacity();
    this.setupIntersectionObserver();
    this.setupScrollProgressTracker();
    this.setupDraggableTriggers();
    this.bindEvents();
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    if (this.scrollListener) window.removeEventListener('scroll', this.scrollListener);
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    
    document.getElementById('toc-hud-sidebar')?.remove();
    document.getElementById('toc-mobile-trigger')?.remove();
  }

  /**
   * Slugifies heading text for unique id generation
   */
  slugify(text, index) {
    const cleanText = text.toLowerCase()
      .trim()
      .replace(/[^\w\u0400-\u04FF\s-]/g, '')
      .replace(/\s+/g, '-');
    return cleanText ? `toc-${cleanText}-${index}` : `heading-${index}`;
  }

  /**
   * Parses H1-H5 and <details><summary> elements inside container with strict text-key deduplication
   */
  collectHeadings() {
    this.headings = [];
    const elements = Array.from(this.container.querySelectorAll('h1, h2, h3, h4, h5, h6, details > summary'));
    const seenTexts = new Set();
    
    elements.forEach((el, index) => {
      const rawText = el.textContent || '';
      const cleanText = rawText.trim();
      if (!cleanText) return;

      const textKey = cleanText.toLowerCase().replace(/\s+/g, ' ');
      if (seenTexts.has(textKey)) {
        return; // Skip duplicate headings
      }
      seenTexts.add(textKey);

      let id = el.id;
      if (!id && el.tagName === 'SUMMARY' && el.parentElement?.id) {
        id = el.parentElement.id;
      }
      if (!id) {
        id = this.slugify(cleanText, index + 1);
        el.id = id;
      }

      if (!el.style.scrollMarginTop) {
        el.style.scrollMarginTop = `${this.headerOffset}px`;
      }

      const tagName = el.tagName.toLowerCase();
      let levelNum = 1;

      if (tagName.startsWith('h') && tagName.length === 2) {
        levelNum = parseInt(tagName[1], 10);
      } else if (tagName === 'summary') {
        let depth = 1;
        let p = el.parentElement;
        while (p && p !== this.container) {
          if (p.tagName === 'DETAILS') depth++;
          p = p.parentElement;
        }
        levelNum = depth;
      }

      const numMatch = cleanText.match(/^(\d+(?:\.\d+)*)/);
      if (numMatch) {
        const parts = numMatch[1].split('.');
        levelNum = parts.length;
      }

      let nextEl = el.nextElementSibling;
      let sectionWords = 0;
      while (nextEl && !['H1', 'H2', 'H3', 'H4', 'H5', 'SUMMARY'].includes(nextEl.tagName)) {
        sectionWords += (nextEl.textContent || '').split(/\s+/).filter(Boolean).length;
        nextEl = nextEl.nextElementSibling;
      }
      const readTimeMinutes = Math.max(1, Math.round(sectionWords / 180));

      this.headings.push({
        id: id,
        text: cleanText,
        level: `l${levelNum}`,
        levelNum: levelNum,
        element: el,
        readTime: readTimeMinutes,
        parentDetails: el.closest('details')
      });
    });

    for (let i = 0; i < this.headings.length; i++) {
      const curr = this.headings[i];
      curr.children = [];
      curr.parentId = null;

      for (let j = i - 1; j >= 0; j--) {
        if (this.headings[j].levelNum < curr.levelNum) {
          curr.parentId = this.headings[j].id;
          this.headings[j].children.push(curr.id);
          break;
        }
      }
    }
  }

  /**
   * Builds Desktop & Mobile HUD DOM structures
   */
  buildDOM() {
    // Single Unified Floating HUD Sidebar Container
    this.sidebar = document.createElement('aside');
    this.sidebar.id = 'toc-hud-sidebar';
    this.sidebar.className = 'toc-hud-sidebar';
    this.sidebar.setAttribute('aria-label', 'Table of Contents');

    // Circular Mini Trigger (Collapsed state: 54px x 54px)
    const miniTrigger = document.createElement('div');
    miniTrigger.className = 'toc-mini-trigger';
    miniTrigger.title = 'Expand Table of Contents (Alt+T)';
    miniTrigger.innerHTML = `
      <svg class="toc-mini-ring" viewBox="0 0 54 54">
        <circle class="ring-bg" cx="27" cy="27" r="23"></circle>
        <circle class="ring-fill" id="toc-mini-ring-fill" cx="27" cy="27" r="23"></circle>
      </svg>
      <i class="fas fa-list-ul"></i>
    `;
    this.sidebar.appendChild(miniTrigger);

    // Sidebar Header
    const header = document.createElement('div');
    header.className = 'toc-hud-header';
    header.innerHTML = `
      <h3 class="toc-hud-title"><i class="fas fa-list-ul"></i> Contents</h3>
      <div class="toc-hud-actions">
        <button id="toc-btn-settings" class="toc-action-btn" title="HUD Themes & Opacity"><i class="fas fa-cog"></i></button>
        <button id="toc-btn-zen" class="toc-action-btn" title="Zen Mode (Alt+Z)"><i class="fas fa-eye-slash"></i></button>
        <button id="toc-btn-collapse" class="toc-action-btn" title="Collapse / Expand (Alt+T)"><i class="fas fa-chevron-right"></i></button>
      </div>

      <!-- HUD Theme & Opacity Settings Popover -->
      <div id="toc-settings-popover" class="toc-settings-popover" style="display:none;">
        <div class="toc-settings-group">
          <label class="toc-settings-label">HUD Theme:</label>
          <div class="toc-settings-options">
            <button class="toc-theme-btn ${this.hudTheme === 'glass' ? 'is-active' : ''}" data-theme="glass">💎 Glass</button>
            <button class="toc-theme-btn ${this.hudTheme === 'light' ? 'is-active' : ''}" data-theme="light">☀️ Light</button>
            <button class="toc-theme-btn ${this.hudTheme === 'dark' ? 'is-active' : ''}" data-theme="dark">🌙 Dark</button>
            <button class="toc-theme-btn ${this.hudTheme === 'sepia' ? 'is-active' : ''}" data-theme="sepia">📜 Sepia</button>
            <button class="toc-theme-btn ${this.hudTheme === 'neon' ? 'is-active' : ''}" data-theme="neon">⚡ Neon</button>
            <button class="toc-theme-btn ${this.hudTheme === 'emerald' ? 'is-active' : ''}" data-theme="emerald">🌲 Emerald</button>
            <button class="toc-theme-btn ${this.hudTheme === 'amber' ? 'is-active' : ''}" data-theme="amber">🟧 Amber</button>
            <button class="toc-theme-btn ${this.hudTheme === 'crimson' ? 'is-active' : ''}" data-theme="crimson">🔴 Crimson</button>
          </div>
        </div>
        <div class="toc-settings-group">
          <label class="toc-settings-label">HUD Opacity:</label>
          <div class="toc-settings-options">
            <button class="toc-opacity-btn ${this.hudOpacity === 1.0 ? 'is-active' : ''}" data-opacity="1.0">100%</button>
            <button class="toc-opacity-btn ${this.hudOpacity === 0.85 ? 'is-active' : ''}" data-opacity="0.85">85%</button>
            <button class="toc-opacity-btn ${this.hudOpacity === 0.65 ? 'is-active' : ''}" data-opacity="0.65">65%</button>
            <button class="toc-opacity-btn ${this.hudOpacity === 0.45 ? 'is-active' : ''}" data-opacity="0.45">45%</button>
          </div>
        </div>
      </div>
    `;
    this.sidebar.appendChild(header);

    // Micro Search Box
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'toc-search-wrapper';
    searchWrapper.innerHTML = `
      <i class="fas fa-search toc-search-icon"></i>
      <input type="text" class="toc-search-input" id="toc-search-input" placeholder="Search headings..." aria-label="Filter headings">
      <button class="toc-search-clear" id="toc-search-clear" title="Clear search">✕</button>
    `;
    this.sidebar.appendChild(searchWrapper);

    // Tree Navigation
    const tree = document.createElement('nav');
    tree.className = 'toc-hud-tree';
    tree.id = 'toc-hud-tree';
    
    const emptyState = document.createElement('div');
    emptyState.className = 'toc-empty-state';
    emptyState.id = 'toc-empty-state';
    emptyState.textContent = 'No matching headings found';
    tree.appendChild(emptyState);

    this.headings.forEach(item => {
      const a = document.createElement('a');
      a.className = `toc-hud-item toc-hud-item--${item.level}`;
      a.dataset.id = item.id;
      a.dataset.level = item.levelNum;
      if (item.parentId) a.dataset.parent = item.parentId;
      a.href = `#${item.id}`;

      const titleSpan = document.createElement('span');
      titleSpan.textContent = item.text;
      a.appendChild(titleSpan);

      if (item.readTime > 1) {
        const timeSpan = document.createElement('span');
        timeSpan.className = 'toc-read-time';
        timeSpan.textContent = `~${item.readTime}m`;
        a.appendChild(timeSpan);
      }

      tree.appendChild(a);
    });

    this.sidebar.appendChild(tree);

    // Sidebar Footer & Progress Bar
    const footer = document.createElement('div');
    footer.className = 'toc-hud-footer';
    footer.innerHTML = `
      <div class="toc-progress-bar-bg">
        <div class="toc-progress-bar-fill" id="toc-progress-fill"></div>
      </div>
      <span class="toc-progress-text" id="toc-progress-text">0%</span>
    `;
    this.sidebar.appendChild(footer);

    document.body.appendChild(this.sidebar);
  }

  /**
   * Applies Theme & Opacity settings to Sidebar
   */
  applyThemeAndOpacity() {
    if (this.sidebar) {
      this.sidebar.dataset.hudTheme = this.hudTheme;
      this.sidebar.style.setProperty('--toc-opacity-override', this.hudOpacity);
    }
  }

  setTheme(theme) {
    this.hudTheme = theme;
    localStorage.setItem('toc_hud_theme', theme);
    this.applyThemeAndOpacity();
  }

  setOpacity(opacityVal) {
    this.hudOpacity = parseFloat(opacityVal);
    localStorage.setItem('toc_hud_opacity', opacityVal);
    this.applyThemeAndOpacity();
  }

  /**
   * Freely Draggable Triggers with LocalStorage Persistence & Viewport Bounds Clamping
   */
  setupDraggableTriggers() {
    this.makeElementDraggable(this.sidebar, 'desktop');
  }

  makeElementDraggable(el, type = 'desktop') {
    if (!el) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;

    const storageKey = `toc_hud_pos_${type}`;
    const savedPos = localStorage.getItem(storageKey);
    if (savedPos) {
      try {
        const pos = JSON.parse(savedPos);
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // Clamp saved position inside current viewport bounds
        const clampedX = Math.max(8, Math.min(vw - 64, pos.x));
        const clampedY = Math.max(8, Math.min(vh - 64, pos.y));
        el.style.position = 'fixed';
        el.style.left = `${clampedX}px`;
        el.style.top = `${clampedY}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      } catch (e) {}
    } else {
      // Default Position Clamped to Screen Edge
      const vw = window.innerWidth;
      el.style.position = 'fixed';
      el.style.left = `${Math.max(8, vw - 340)}px`;
      el.style.top = `100px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    }

    const onPointerDown = (e) => {
      if (!this.isCollapsed && !e.target.closest('.toc-hud-header')) {
        return;
      }
      if (e.target.closest('.toc-hud-actions') || e.target.closest('.toc-action-btn') || e.target.closest('.toc-settings-popover')) {
        return;
      }

      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      try { el.setPointerCapture(e.pointerId); } catch(err){}
      el.classList.add('is-dragging');

      const onPointerMove = (moveEv) => {
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isDragging = true;
        }

        if (isDragging) {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const rectW = rect.width || 60;
          const rectH = rect.height || 60;

          const newX = Math.max(8, Math.min(vw - rectW - 8, initialLeft + dx));
          const newY = Math.max(8, Math.min(vh - rectH - 8, initialTop + dy));

          el.style.position = 'fixed';
          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
          el.style.right = 'auto';
          el.style.bottom = 'auto';
        }
      };

      const onPointerUp = (upEv) => {
        try { el.releasePointerCapture(upEv.pointerId); } catch(err){}
        el.classList.remove('is-dragging');
        el.removeEventListener('pointermove', onPointerMove);
        el.removeEventListener('pointerup', onPointerUp);

        if (isDragging) {
          const rectFinal = el.getBoundingClientRect();
          localStorage.setItem(storageKey, JSON.stringify({ x: rectFinal.left, y: rectFinal.top }));

          const preventClickOnce = (clkEv) => {
            clkEv.stopPropagation();
            clkEv.preventDefault();
          };
          el.addEventListener('click', preventClickOnce, { capture: true, once: true });
        }
      };

      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
    };

    el.addEventListener('pointerdown', onPointerDown);
  }

  /**
   * Smart Directional Opening (Down-Right, Down-Left, Up-Right, Up-Left)
   */
  applySmartOpeningDirection() {
    if (!this.sidebar) return;

    const rect = this.sidebar.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const isTopHalf = cy < vh / 2;
    const isLeftHalf = cx < vw / 2;

    this.sidebar.style.position = 'fixed';

    if (isTopHalf) {
      this.sidebar.style.top = `${Math.min(vh - 250, Math.max(8, rect.top))}px`;
      this.sidebar.style.bottom = 'auto';
      this.sidebar.style.maxHeight = `calc(${vh}px - ${Math.max(8, rect.top) + 16}px)`;
    } else {
      this.sidebar.style.bottom = `${Math.min(vh - 80, Math.max(8, vh - rect.bottom))}px`;
      this.sidebar.style.top = 'auto';
      this.sidebar.style.maxHeight = `${Math.max(100, rect.bottom - 16)}px`;
    }

    if (isLeftHalf) {
      this.sidebar.style.left = `${Math.max(8, rect.left)}px`;
      this.sidebar.style.right = 'auto';
      this.sidebar.dataset.openDir = isTopHalf ? 'down-right' : 'up-right';
    } else {
      this.sidebar.style.right = `${Math.max(8, vw - rect.right)}px`;
      this.sidebar.style.left = 'auto';
      this.sidebar.dataset.openDir = isTopHalf ? 'down-left' : 'up-left';
    }
  }

  /**
   * Sets up 60 FPS IntersectionObserver for Scroll-Sync
   */
  setupIntersectionObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }

    const options = {
      root: null,
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveItem(entry.target.id);
        }
      });
    }, options);

    this.headings.forEach(h => {
      this.observer.observe(h.element);
    });
  }

  /**
   * Real-time calculation of overall reading progress percentage
   */
  setupScrollProgressTracker() {
    let lastScrollY = window.scrollY;

    this.scrollListener = () => {
      const currentScrollY = window.scrollY;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((currentScrollY / docHeight) * 100))) : 0;
      this.updateProgressUI(progress);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    this.scrollListener();

    // Clamp Sidebar inside screen bounds on Window Resize
    this.resizeListener = () => {
      if (this.sidebar) {
        const rect = this.sidebar.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const panelWidth = this.isCollapsed ? 60 : Math.min(320, vw * 0.9);
        const panelHeight = this.isCollapsed ? 60 : 400;

        if (rect.left > vw - panelWidth || rect.top > vh - panelHeight || rect.left < 0) {
          const clampedX = Math.max(8, Math.min(vw - panelWidth - 8, rect.left));
          const clampedY = Math.max(8, Math.min(vh - panelHeight - 8, rect.top));
          this.sidebar.style.left = `${clampedX}px`;
          this.sidebar.style.top = `${clampedY}px`;
        }
      }
    };
    window.addEventListener('resize', this.resizeListener, { passive: true });
  }

  /**
   * Updates Active Item & Expands Sub-Section Hierarchy
   */
  setActiveItem(id) {
    if (this.activeId === id) return;
    this.activeId = id;

    document.querySelectorAll('.toc-hud-item.is-active').forEach(el => el.classList.remove('is-active'));

    const headingData = this.headings.find(h => h.id === id);

    const activeElements = document.querySelectorAll(`.toc-hud-item[data-id="${id}"]`);
    activeElements.forEach(el => {
      el.classList.add('is-active');
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  /**
   * Updates reading progress percentages and progress bars
   */
  updateProgressUI(progress) {
    const desktopFill = document.getElementById('toc-progress-fill');
    const desktopText = document.getElementById('toc-progress-text');
    const ringFill = document.getElementById('toc-mini-ring-fill');

    if (desktopFill) desktopFill.style.width = `${progress}%`;
    if (desktopText) desktopText.textContent = `${progress}%`;

    if (ringFill) {
      const circumference = 145;
      const offset = circumference - (progress / 100) * circumference;
      ringFill.style.strokeDashoffset = offset;
    }
  }

  /**
   * Triggers Haptic Feedback if available
   */
  triggerHaptic() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  }

  /**
   * Filter Toc items with 150ms debounce
   */
  filterItems(query) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const cleanQuery = query.toLowerCase().trim();
      const tree = document.getElementById('toc-hud-tree');
      const emptyState = document.getElementById('toc-empty-state');

      if (!tree) return;

      const items = tree.querySelectorAll('.toc-hud-item');
      let visibleCount = 0;

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(cleanQuery);
        item.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }, 150);
  }

  toggleCollapse(forceState) {
    this.isCollapsed = typeof forceState === 'boolean' ? forceState : !this.isCollapsed;
    this.sidebar.classList.toggle('is-collapsed', this.isCollapsed);
    if (!this.isCollapsed) {
      this.applySmartOpeningDirection();
    }
  }

  toggleZen(forceState) {
    this.isZen = typeof forceState === 'boolean' ? forceState : !this.isZen;
    this.sidebar.classList.toggle('is-zen', this.isZen);
  }

  /**
   * Binds event listeners for UI controls, navigation & hotkeys
   */
  bindEvents() {
    const btnSettings = document.getElementById('toc-btn-settings');
    const settingsPopover = document.getElementById('toc-settings-popover');
    if (btnSettings && settingsPopover) {
      btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = settingsPopover.style.display !== 'none';
        settingsPopover.style.display = isOpen ? 'none' : 'block';
      });

      settingsPopover.querySelectorAll('.toc-theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          settingsPopover.querySelectorAll('.toc-theme-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.setTheme(btn.dataset.theme);
        });
      });

      settingsPopover.querySelectorAll('.toc-opacity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          settingsPopover.querySelectorAll('.toc-opacity-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.setOpacity(btn.dataset.opacity);
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (settingsPopover && !e.target.closest('#toc-settings-popover') && !e.target.closest('#toc-btn-settings')) {
        settingsPopover.style.display = 'none';
      }
    });

    const btnCollapse = document.getElementById('toc-btn-collapse');
    if (btnCollapse) {
      btnCollapse.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.toggleCollapse();
      });
    }

    const btnZen = document.getElementById('toc-btn-zen');
    if (btnZen) {
      btnZen.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.toggleZen();
      });
    }

    const handleLinkClick = (e) => {
      if (this.isCollapsed) {
        e.stopPropagation();
        e.preventDefault();
        this.toggleCollapse(false);
        return;
      }

      if (e.target.closest('.toc-hud-actions') || e.target.closest('.toc-action-btn') || e.target.closest('.toc-search-wrapper') || e.target.closest('.toc-settings-popover')) {
        return;
      }

      const item = e.target.closest('.toc-hud-item');
      if (!item) return;

      e.preventDefault();
      const targetId = item.dataset.id;
      let targetElement = document.getElementById(targetId);
      if (!targetElement) {
        targetElement = this.container.querySelector(`[id="${targetId}"]`);
      }

      if (targetElement) {
        let p = targetElement.parentElement;
        while (p && p.id !== 'content-area') {
          if (p.tagName === 'DETAILS') {
            p.open = true;
          }
          p = p.parentElement;
        }

        if (targetElement.tagName === 'DETAILS') {
          targetElement.open = true;
        }
        if (targetElement.tagName === 'SUMMARY' && targetElement.parentElement?.tagName === 'DETAILS') {
          targetElement.parentElement.open = true;
        }

        this.triggerHaptic();
        
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.setActiveItem(targetId);
        }, 50);
      }
    };

    if (this.sidebar) {
      this.sidebar.addEventListener('click', handleLinkClick);
    }

    const desktopSearch = document.getElementById('toc-search-input');
    const desktopClear = document.getElementById('toc-search-clear');
    if (desktopSearch) {
      desktopSearch.addEventListener('input', (e) => {
        this.filterItems(e.target.value);
        if (desktopClear) desktopClear.classList.toggle('is-visible', Boolean(e.target.value));
      });
    }
    if (desktopClear) {
      desktopClear.addEventListener('click', () => {
        if (desktopSearch) {
          desktopSearch.value = '';
          this.filterItems('');
          desktopClear.classList.remove('is-visible');
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 't' || e.key === 'T' || e.key === 'е' || e.key === 'Е')) {
        e.preventDefault();
        this.toggleCollapse();
      } else if (e.altKey && (e.key === 'z' || e.key === 'Z' || e.key === 'я' || e.key === 'Я')) {
        e.preventDefault();
        this.toggleZen();
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.TocHud = TocHud;
}
