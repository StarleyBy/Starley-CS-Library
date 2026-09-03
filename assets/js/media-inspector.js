/**
 * MediaInspector - Interactive Lightbox and Table focus system
 */
const MediaInspector = {
  activeLightbox: null,
  activeTableModal: null,

  init(container) {
    if (!container) return;
    console.log('[MediaInspector] Initializing on container:', container);

    this.initImages(container);
    this.initTables(container);
  },

  // ==========================================================================
  //  1. IMAGES & LIGHTBOX VIEWER
  // ==========================================================================
  initImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach((img, idx) => {
      // Ensure image has a unique ID for back-linking
      if (!img.id) {
        img.id = `media-img-${Date.now()}-${idx}`;
      }

      img.classList.add('inspectable-image');

      // Find caption text
      let captionText = img.alt || '';
      
      // Look for a paragraph immediately following the image parent or image that starts with FIGURE
      const parent = img.parentElement;
      if (parent) {
        let nextEl = null;
        if (parent.tagName === 'P') {
          nextEl = parent.nextElementSibling;
        } else {
          nextEl = img.nextElementSibling;
        }
        
        if (nextEl && nextEl.tagName === 'P') {
          const txt = nextEl.textContent.trim();
          if (/^(figure|рисунок|рис\.|схема|таблица|chart|diagram)/i.test(txt)) {
            captionText = nextEl.innerHTML; // keep styling like strong/em
          }
        }
      }

      // Add click handler to open Lightbox
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(img, captionText);
      });
    });
  },

  openLightbox(imgEl, captionHTML) {
    this.closeLightbox();

    // Create lightbox DOM elements if they don't exist
    let lightbox = document.getElementById('media-lightbox');
    if (!lightbox) {
      lightbox = this.createLightboxDOM();
    }

    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaptionBottom = lightbox.querySelector('.lightbox-caption-bottom .caption-text');
    const backLink = document.getElementById('lightbox-back-link');

    // Dynamic Localization based on active document language
    const isRu = document.documentElement.lang === 'ru';
    
    lightbox.querySelector('.lightbox-caption-top').textContent = isRu ? 'Инспектор изображений' : 'Image Inspector';
    
    const contrastBtn = document.getElementById('lightbox-contrast-btn');
    if (contrastBtn) {
      contrastBtn.innerHTML = `<i class="fas fa-adjust"></i> ${isRu ? 'Контраст' : 'Contrast'}`;
      contrastBtn.title = isRu ? 'Повысить контрастность' : 'Toggle Contrast Boost';
    }
    
    document.getElementById('lightbox-zoom-in-btn').title = isRu ? 'Увеличить' : 'Zoom In';
    document.getElementById('lightbox-zoom-out-btn').title = isRu ? 'Уменьшить' : 'Zoom Out';
    document.getElementById('lightbox-reset-btn').title = isRu ? 'Сбросить зум' : 'Reset Zoom';
    document.getElementById('lightbox-close-btn').title = isRu ? 'Закрыть' : 'Close';

    backLink.innerHTML = `<i class="fas fa-arrow-left"></i> ${isRu ? 'К тексту' : 'Back to Text'}`;
    backLink.href = `#${imgEl.id}`;

    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || '';
    lightboxCaptionBottom.innerHTML = captionHTML || imgEl.alt || (isRu ? 'Изображение без подписи' : 'Image without caption');
    
    // Remove contrast boost state by default
    lightboxImg.classList.remove('contrast-boosted');
    if (contrastBtn) contrastBtn.classList.remove('active');

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // lock background scroll

    this.activeLightbox = {
      element: lightbox,
      imgElement: lightboxImg,
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      touchStartDist: 0,
      touchStartScale: 1,
      sourceImg: imgEl
    };

    // Reset transform on initial show
    this.updateLightboxTransform();
  },

  closeLightbox() {
    const lightbox = document.getElementById('media-lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = ''; // unlock scroll
    }
    this.activeLightbox = null;
  },

  createLightboxDOM() {
    const div = document.createElement('div');
    div.id = 'media-lightbox';
    div.className = 'media-lightbox';
    div.style.display = 'none';
    div.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-toolbar">
        <span class="lightbox-caption-top"></span>
        <div class="lightbox-actions">
          <button id="lightbox-contrast-btn" class="lightbox-btn"><i class="fas fa-adjust"></i></button>
          <button id="lightbox-zoom-in-btn" class="lightbox-btn"><i class="fas fa-search-plus"></i></button>
          <button id="lightbox-zoom-out-btn" class="lightbox-btn"><i class="fas fa-search-minus"></i></button>
          <button id="lightbox-reset-btn" class="lightbox-btn"><i class="fas fa-sync-alt"></i></button>
          <button id="lightbox-close-btn" class="lightbox-btn lightbox-close"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="lightbox-canvas">
        <img id="lightbox-image" src="" alt="" draggable="false">
      </div>
      <div class="lightbox-caption-bottom">
        <div class="caption-text"></div>
        <a href="#" id="lightbox-back-link" class="lightbox-back-link"><i class="fas fa-arrow-left"></i></a>
      </div>
    `;

    document.body.appendChild(div);

    // Close button / backdrop handlers
    div.querySelector('.lightbox-backdrop').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-close-btn').addEventListener('click', () => this.closeLightbox());
    
    // Back to text link close handler with highlight pulse
    document.getElementById('lightbox-back-link').addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('href').substring(1);
      this.closeLightbox();
      
      const targetImg = document.getElementById(targetId);
      if (targetImg) {
        // Scroll target image into view
        targetImg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add pulse highlights
        const parentP = targetImg.closest('p') || targetImg;
        parentP.classList.add('flash-highlight-active');
        setTimeout(() => {
          parentP.classList.remove('flash-highlight-active');
        }, 1500);
      }
    });

    // Contrast boost button
    document.getElementById('lightbox-contrast-btn').addEventListener('click', (e) => {
      if (!this.activeLightbox) return;
      const img = this.activeLightbox.imgElement;
      img.classList.toggle('contrast-boosted');
      e.currentTarget.classList.toggle('active');
    });

    // Zoom buttons
    document.getElementById('lightbox-zoom-in-btn').addEventListener('click', () => {
      this.zoomLightbox(1.3);
    });
    document.getElementById('lightbox-zoom-out-btn').addEventListener('click', () => {
      this.zoomLightbox(0.7);
    });
    document.getElementById('lightbox-reset-btn').addEventListener('click', () => {
      this.resetLightboxTransform(true);
    });

    // Register all gesture and zoom events ONCE on the lightbox wrapper elements
    this.setupGlobalLightboxEvents(div);

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeLightbox) {
        this.closeLightbox();
      }
    });

    return div;
  },

  updateLightboxTransform(useTransition = false) {
    if (!this.activeLightbox) return;
    const state = this.activeLightbox;
    
    if (state.scale <= 1) {
      state.scale = 1;
      state.translateX = 0;
      state.translateY = 0;
    }
    
    state.imgElement.style.transition = useTransition ? 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    state.imgElement.style.transform = `translate3d(${state.translateX}px, ${state.translateY}px, 0) scale(${state.scale})`;
  },

  resetLightboxTransform(useTransition = false) {
    if (!this.activeLightbox) return;
    this.activeLightbox.scale = 1;
    this.activeLightbox.translateX = 0;
    this.activeLightbox.translateY = 0;
    this.updateLightboxTransform(useTransition);
  },

  zoomLightbox(factor, centerX, centerY) {
    if (!this.activeLightbox) return;
    const state = this.activeLightbox;
    const oldScale = state.scale;
    state.scale = Math.min(Math.max(state.scale * factor, 1), 8);
    
    // Zoom centered
    const canvas = state.element.querySelector('.lightbox-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const x = centerX !== undefined ? centerX : canvasRect.width / 2;
    const y = centerY !== undefined ? centerY : canvasRect.height / 2;
    
    const ratio = state.scale / oldScale;
    state.translateX = x - (x - state.translateX) * ratio;
    state.translateY = y - (y - state.translateY) * ratio;
    
    this.updateLightboxTransform(true);
  },

  setupGlobalLightboxEvents(lightboxEl) {
    const canvas = lightboxEl.querySelector('.lightbox-canvas');
    
    // Mouse drag
    canvas.addEventListener('mousedown', (e) => {
      if (!this.activeLightbox) return;
      if (e.button !== 0) return; // only left click
      e.preventDefault();
      
      const state = this.activeLightbox;
      state.isDragging = true;
      state.startX = e.clientX - state.translateX;
      state.startY = e.clientY - state.translateY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.activeLightbox) return;
      const state = this.activeLightbox;
      if (!state.isDragging) return;
      
      state.translateX = e.clientX - state.startX;
      state.translateY = e.clientY - state.startY;
      this.updateLightboxTransform();
    });

    window.addEventListener('mouseup', () => {
      if (!this.activeLightbox) return;
      this.activeLightbox.isDragging = false;
    });

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      if (!this.activeLightbox) return;
      e.preventDefault();
      
      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      this.zoomLightbox(factor, x, y);
    }, { passive: false });

    // Double click to zoom toggle
    canvas.addEventListener('dblclick', (e) => {
      if (!this.activeLightbox) return;
      e.preventDefault();
      
      const state = this.activeLightbox;
      if (state.scale > 1) {
        this.resetLightboxTransform(true);
      } else {
        const canvasRect = canvas.getBoundingClientRect();
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        this.zoomLightbox(2.5, x, y);
      }
    });

    // Touch events for mobile (Pinch-to-Zoom)
    let touchStartTime = 0;
    
    canvas.addEventListener('touchstart', (e) => {
      if (!this.activeLightbox) return;
      const state = this.activeLightbox;
      
      if (e.touches.length === 2) {
        state.isDragging = false;
        state.touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        state.touchStartScale = state.scale;
      } else if (e.touches.length === 1) {
        // Double tap check
        const now = Date.now();
        if (now - touchStartTime < 300) {
          e.preventDefault();
          if (state.scale > 1) {
            this.resetLightboxTransform(true);
          } else {
            const canvasRect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - canvasRect.left;
            const y = e.touches[0].clientY - canvasRect.top;
            this.zoomLightbox(2.5, x, y);
          }
          touchStartTime = 0;
          return;
        }
        touchStartTime = now;
        
        state.isDragging = true;
        state.startX = e.touches[0].clientX - state.translateX;
        state.startY = e.touches[0].clientY - state.translateY;
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      if (!this.activeLightbox) return;
      const state = this.activeLightbox;
      
      if (e.touches.length === 2 && state.touchStartDist) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / state.touchStartDist;
        
        // Midpoint of fingers
        const canvasRect = canvas.getBoundingClientRect();
        const x = ((e.touches[0].clientX + e.touches[1].clientX) / 2) - canvasRect.left;
        const y = ((e.touches[0].clientY + e.touches[1].clientY) / 2) - canvasRect.top;
        
        const oldScale = state.scale;
        state.scale = Math.min(Math.max(state.touchStartScale * factor, 1), 8);
        
        const ratio = state.scale / oldScale;
        state.translateX = x - (x - state.translateX) * ratio;
        state.translateY = y - (y - state.translateY) * ratio;
        
        this.updateLightboxTransform();
      } else if (e.touches.length === 1 && state.isDragging) {
        state.translateX = e.touches[0].clientX - state.startX;
        state.translateY = e.touches[0].clientY - state.startY;
        this.updateLightboxTransform();
      }
    });

    canvas.addEventListener('touchend', (e) => {
      if (!this.activeLightbox) return;
      const state = this.activeLightbox;
      
      if (e.touches.length === 0) {
        state.isDragging = false;
        state.touchStartDist = 0;
      } else if (e.touches.length === 1) {
        // transition back to 1 touch panning
        state.isDragging = true;
        state.startX = e.touches[0].clientX - state.translateX;
        state.startY = e.touches[0].clientY - state.translateY;
        state.touchStartDist = 0;
      }
    });
  },

  // ==========================================================================
  //  2. TABLES & STICKY HEADER & FOCUS OVERLAY
  // ==========================================================================
  initTables(container) {
    const isRu = document.documentElement.lang === 'ru';
    const btnText = isRu ? 'Развернуть таблицу' : 'Expand Table';

    const tables = container.querySelectorAll('table');
    tables.forEach((table, idx) => {
      // Check if table is already wrapped
      let wrapper = table.parentElement;
      if (wrapper && wrapper.classList.contains('table-inspector-wrapper')) {
        // If already wrapped, update the button text in case language shifted
        const btn = wrapper.querySelector('.table-inspect-btn');
        if (btn) {
          btn.innerHTML = `<i class="fas fa-expand-arrows-alt"></i> ${btnText}`;
        }
        return;
      }

      wrapper = document.createElement('div');
      wrapper.className = 'table-inspector-wrapper';
      table.parentNode.insertBefore(wrapper, table);

      const actions = document.createElement('div');
      actions.className = 'table-inspector-actions';
      actions.innerHTML = `
        <button class="table-inspect-btn"><i class="fas fa-expand-arrows-alt"></i> ${btnText}</button>
      `;

      wrapper.appendChild(actions);
      wrapper.appendChild(table);

      // Add click handler to expand button
      actions.querySelector('.table-inspect-btn').addEventListener('click', (e) => {
        e.preventDefault();
        this.openTableModal(table);
      });
    });
  },

  openTableModal(tableEl) {
    this.closeTableModal();

    let modal = document.getElementById('table-focus-modal');
    if (!modal) {
      modal = this.createTableModalDOM();
    }

    const isRu = document.documentElement.lang === 'ru';
    modal.querySelector('.table-modal-title').innerHTML = `<i class="fas fa-table"></i> ${isRu ? 'Фокус на таблице' : 'Table Focus'}`;
    modal.querySelector('.table-modal-close').title = isRu ? 'Закрыть' : 'Close';

    const modalBody = modal.querySelector('.table-modal-body');
    modalBody.innerHTML = '';
    
    // Clone original table and append to modal
    const clone = tableEl.cloneNode(true);
    modalBody.appendChild(clone);

    modal.style.display = 'flex';
    // Small delay to trigger animation transition
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);

    document.body.style.overflow = 'hidden'; // lock background scroll
    this.activeTableModal = modal;
  },

  closeTableModal() {
    const modal = document.getElementById('table-focus-modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
      document.body.style.overflow = '';
    }
    this.activeTableModal = null;
  },

  createTableModalDOM() {
    const div = document.createElement('div');
    div.id = 'table-focus-modal';
    div.className = 'table-focus-modal';
    div.style.display = 'none';
    div.innerHTML = `
      <div class="table-modal-backdrop"></div>
      <div class="table-modal-sheet">
        <div class="table-modal-header">
          <span class="table-modal-title"></span>
          <button id="table-modal-close-btn" class="table-modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="table-modal-body"></div>
      </div>
    `;

    document.body.appendChild(div);

    div.querySelector('.table-modal-backdrop').addEventListener('click', () => this.closeTableModal());
    document.getElementById('table-modal-close-btn').addEventListener('click', () => this.closeTableModal());

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeTableModal) {
        this.closeTableModal();
      }
    });

    return div;
  }
};

window.MediaInspector = MediaInspector;
