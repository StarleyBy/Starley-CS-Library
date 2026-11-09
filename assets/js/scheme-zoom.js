/**
 * SchemeZoom — лайтбокс для SVG-схем.
 *
 * Масштабирование: transform: translate + scale (без will-change на SVG).
 * Это позволяет браузеру рендерить вектор заново на каждом кадре → чёткость.
 * SVG расположен position:absolute (top:0, left:0) внутри canvas → математика
 * зума к курсору абсолютно точна без поправок на flexbox-offset.
 *
 * Возможности:
 *   • тулбар с кнопками +/−/reset/закрыть
 *   • колесо мыши — зум к точке курсора
 *   • перетаскивание мышью / пальцем
 *   • пинч двумя пальцами
 *   • двойной клик / двойной тап — zoom×2.5 ↔ сброс
 *   • ESC — закрыть
 */
const SchemeZoom = {
  active: null,

  // ─── инициализация ────────────────────────────────────────────────────────
  init() {
    document.querySelectorAll('svg:not(.scheme-svg)').forEach(svg => {
      svg.classList.add('scheme-svg');
    });

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.tagName && node.tagName.toUpperCase() === 'SVG') {
            if (!node.classList.contains('scheme-svg')) node.classList.add('scheme-svg');
          } else if (node.querySelectorAll) {
            node.querySelectorAll('svg:not(.scheme-svg)').forEach(svg => {
              svg.classList.add('scheme-svg');
            });
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', e => {
      const svg = e.target.closest('svg.scheme-svg');
      if (!svg) return;
      e.preventDefault();
      e.stopPropagation();
      this.open(svg);
    });
  },

  // ─── открыть лайтбокс ─────────────────────────────────────────────────────
  open(svgEl) {
    this.close();

    let lb = document.getElementById('scheme-lightbox');
    if (!lb) lb = this._createDOM();

    const canvas = lb.querySelector('.scheme-lb-canvas');
    canvas.innerHTML = '';

    const clone = svgEl.cloneNode(true);
    clone.removeAttribute('width');
    clone.removeAttribute('height');

    // position:absolute + transform-origin:0 0 → математика зума к курсору точна.
    // max-width/height только на этапе замера — потом снимаются.
    clone.classList.remove('scheme-svg'); // не должен перехватываться делегированным обработчиком
    clone.classList.add('scheme-lb-svg');
    clone.style.cssText = `
      display: block;
      position: absolute;
      top: 0; left: 0;
      transform-origin: 0 0;
      max-width: 90vw;
      max-height: calc(100vh - 54px);
    `;
    canvas.appendChild(clone);

    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    this.active = {
      element: lb,
      svgElement: clone,
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      touchStartDist: 0,
      touchStartScale: 1
    };

    // После первого рендера замеряем и центрируем
    requestAnimationFrame(() => {
      if (!this.active || this.active.svgElement !== clone) return;

      const svgRect = clone.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      // Снимаем ограничения размера (больше не нужны)
      clone.style.maxWidth = 'none';
      clone.style.maxHeight = 'none';
      // Фиксируем layout-размер SVG, чтобы scale не вызывал reflow
      clone.style.width = svgRect.width + 'px';
      clone.style.height = svgRect.height + 'px';

      // Центрируем начальное положение через translate
      this.active.translateX = (canvasRect.width - svgRect.width) / 2;
      this.active.translateY = (canvasRect.height - svgRect.height) / 2;

      this._applyTransform(false);
    });
  },

  // ─── закрыть ──────────────────────────────────────────────────────────────
  close() {
    const lb = document.getElementById('scheme-lightbox');
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
    this.active = null;
  },

  // ─── зум к точке (cx, cy) относительно canvas ────────────────────────────
  zoom(factor, cx, cy) {
    if (!this.active) return;
    const s = this.active;

    const canvas = s.element.querySelector('.scheme-lb-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const x = cx !== undefined ? cx : canvasRect.width / 2;
    const y = cy !== undefined ? cy : canvasRect.height / 2;

    const oldScale = s.scale;
    s.scale = Math.min(Math.max(s.scale * factor, 0.1), 20);

    // Формула: точка под курсором не смещается при зуме.
    // Корректна, т.к. SVG layout-позиция = (0,0) (position:absolute).
    const ratio = s.scale / oldScale;
    s.translateX = x - (x - s.translateX) * ratio;
    s.translateY = y - (y - s.translateY) * ratio;

    this._applyTransform(true);
  },

  reset(animate = true) {
    if (!this.active) return;
    const s = this.active;
    s.scale = 1;

    // Возвращаем к центрированному положению
    const canvas = s.element.querySelector('.scheme-lb-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const svgRect = s.svgElement.getBoundingClientRect();
    // svgRect.width пока равен naturalWidth (scale=1 ещё не применён, но близок)
    const svgW = parseFloat(s.svgElement.style.width) || svgRect.width;
    const svgH = parseFloat(s.svgElement.style.height) || svgRect.height;
    s.translateX = (canvasRect.width - svgW) / 2;
    s.translateY = (canvasRect.height - svgH) / 2;

    this._applyTransform(animate);
  },

  // ─── применить transform ──────────────────────────────────────────────────
  _applyTransform(animate = false) {
    if (!this.active) return;
    const { svgElement, scale, translateX, translateY } = this.active;

    // 2D transform (не 3D) без will-change → браузер рендерит SVG как вектор,
    // а не растеризует в битмап. Текст/линии чёткие на любом зуме.
    svgElement.style.transition = animate
      ? 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    svgElement.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  },

  // ─── создание DOM лайтбокса ───────────────────────────────────────────────
  _createDOM() {
    const div = document.createElement('div');
    div.id = 'scheme-lightbox';
    div.className = 'scheme-lightbox';
    div.style.display = 'none';
    div.innerHTML = `
      <div class="scheme-lb-backdrop"></div>
      <div class="scheme-lb-toolbar">
        <span class="scheme-lb-title"><i class="fas fa-project-diagram"></i> Схема</span>
        <div class="scheme-lb-actions">
          <button id="scheme-lb-zoomin"  class="scheme-lb-btn" title="Увеличить"><i class="fas fa-search-plus"></i></button>
          <button id="scheme-lb-zoomout" class="scheme-lb-btn" title="Уменьшить"><i class="fas fa-search-minus"></i></button>
          <button id="scheme-lb-reset"   class="scheme-lb-btn" title="Сбросить зум"><i class="fas fa-sync-alt"></i></button>
          <button id="scheme-lb-close"   class="scheme-lb-btn scheme-lb-close" title="Закрыть"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="scheme-lb-canvas"></div>
    `;
    document.body.appendChild(div);

    div.querySelector('.scheme-lb-backdrop').addEventListener('click', () => this.close());
    document.getElementById('scheme-lb-close').addEventListener('click', () => this.close());
    document.getElementById('scheme-lb-zoomin').addEventListener('click', () => this.zoom(1.3));
    document.getElementById('scheme-lb-zoomout').addEventListener('click', () => this.zoom(0.77));
    document.getElementById('scheme-lb-reset').addEventListener('click', () => this.reset());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.active) this.close();
    });

    this._setupEvents(div);
    return div;
  },

  // ─── события мыши / тач ───────────────────────────────────────────────────
  _setupEvents(lb) {
    const canvas = lb.querySelector('.scheme-lb-canvas');

    // ── мышь: перетаскивание ──
    let _dragged = false; // флаг: была ли реальная протяжка мышью

    canvas.addEventListener('mousedown', e => {
      if (!this.active || e.button !== 0) return;
      e.preventDefault();
      _dragged = false;
      const s = this.active;
      s.isDragging = true;
      s.startX = e.clientX - s.translateX;
      s.startY = e.clientY - s.translateY;
    });
    window.addEventListener('mousemove', e => {
      if (!this.active || !this.active.isDragging) return;
      _dragged = true;
      this.active.translateX = e.clientX - this.active.startX;
      this.active.translateY = e.clientY - this.active.startY;
      this._applyTransform();
    });
    window.addEventListener('mouseup', () => {
      if (this.active) this.active.isDragging = false;
    });

    // После drag клик не должен закрывать лайтбокс или открывать схему заново
    canvas.addEventListener('click', e => {
      if (_dragged) {
        e.stopPropagation();
        e.preventDefault();
        _dragged = false;
      }
    });

    // ── колесо мыши ──
    canvas.addEventListener('wheel', e => {
      if (!this.active) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      this.zoom(
        e.deltaY < 0 ? 1.15 : 0.87,
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }, { passive: false });

    // ── двойной клик ──
    canvas.addEventListener('dblclick', e => {
      if (!this.active) return;
      e.preventDefault();
      if (this.active.scale > 1.05) {
        this.reset(true);
      } else {
        const rect = canvas.getBoundingClientRect();
        this.zoom(2.5, e.clientX - rect.left, e.clientY - rect.top);
      }
    });

    // ── тач ──
    let touchStartTime = 0;

    canvas.addEventListener('touchstart', e => {
      if (!this.active) return;
      const s = this.active;

      if (e.touches.length === 2) {
        s.isDragging = false;
        s.touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        s.touchStartScale = s.scale;
      } else if (e.touches.length === 1) {
        const now = Date.now();
        if (now - touchStartTime < 300) {
          e.preventDefault();
          if (s.scale > 1.05) {
            this.reset(true);
          } else {
            const rect = canvas.getBoundingClientRect();
            this.zoom(2.5,
              e.touches[0].clientX - rect.left,
              e.touches[0].clientY - rect.top
            );
          }
          touchStartTime = 0;
          return;
        }
        touchStartTime = now;
        s.isDragging = true;
        s.startX = e.touches[0].clientX - s.translateX;
        s.startY = e.touches[0].clientY - s.translateY;
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      if (!this.active) return;
      const s = this.active;

      if (e.touches.length === 2 && s.touchStartDist) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / s.touchStartDist;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

        const oldScale = s.scale;
        s.scale = Math.min(Math.max(s.touchStartScale * factor, 0.1), 20);
        const ratio = s.scale / oldScale;
        s.translateX = mx - (mx - s.translateX) * ratio;
        s.translateY = my - (my - s.translateY) * ratio;
        this._applyTransform();
      } else if (e.touches.length === 1 && s.isDragging) {
        s.translateX = e.touches[0].clientX - s.startX;
        s.translateY = e.touches[0].clientY - s.startY;
        this._applyTransform();
      }
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      if (!this.active) return;
      const s = this.active;
      if (e.touches.length === 0) {
        s.isDragging = false;
        s.touchStartDist = 0;
      } else if (e.touches.length === 1) {
        s.isDragging = true;
        s.startX = e.touches[0].clientX - s.translateX;
        s.startY = e.touches[0].clientY - s.translateY;
        s.touchStartDist = 0;
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => SchemeZoom.init());
window.SchemeZoom = SchemeZoom;
