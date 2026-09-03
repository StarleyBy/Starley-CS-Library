/**
 * Starley CS Library - Interactive Scratchpad & Medical Calc Overlay Engine
 * Version: 1.0.0
 */

(function () {
  'use strict';

  // State & Instance Containers
  const StarleyOverlay = {
    isScratchpadActive: false,
    isCalcActive: false,
  };

  /* ==========================================================================
     1. DOM TEMPLATES INJECTION
     ========================================================================== */
  function injectOverlayDOM() {
    if (document.getElementById('scratchpad-overlay')) return;

    // B. Scratchpad Overlay
    const scratchpad = document.createElement('div');
    scratchpad.id = 'scratchpad-overlay';
    scratchpad.className = 'scratchpad-overlay hidden';
    scratchpad.innerHTML = `
      <canvas id="scratchpad-canvas" class="scratchpad-canvas"></canvas>
      <div class="scratchpad-toolbar">
        <div class="scratchpad-color-picker">
          <button class="scratch-color-dot scratch-color-red active" data-color="#ef4444" title="Red"></button>
          <button class="scratch-color-dot scratch-color-yellow" data-color="#f59e0b" title="Yellow"></button>
          <button class="scratch-color-dot scratch-color-green" data-color="#10b981" title="Green"></button>
          <button class="scratch-color-dot scratch-color-white" data-color="#f8fafc" title="White"></button>
        </div>
        <div class="scratchpad-actions">
          <button id="btn-sp-eraser" class="scratch-btn" title="Eraser"><i class="fas fa-eraser"></i></button>
          <button id="btn-sp-undo" class="scratch-btn" title="Undo stroke"><i class="fas fa-undo"></i></button>
          <button id="btn-sp-clear" class="scratch-btn" title="Clear Canvas"><i class="fas fa-trash-alt"></i></button>
          <button id="btn-sp-close" class="scratch-btn btn-close" title="Close"><i class="fas fa-times"></i></button>
        </div>
      </div>
    `;
    document.body.appendChild(scratchpad);

    // C. Medical Calculator Bottom Sheet
    const calcBackdrop = document.createElement('div');
    calcBackdrop.id = 'calc-bottom-sheet-backdrop';
    calcBackdrop.className = 'calc-backdrop hidden';
    document.body.appendChild(calcBackdrop);

    const calcSheet = document.createElement('div');
    calcSheet.id = 'calc-bottom-sheet';
    calcSheet.className = 'calc-bottom-sheet hidden';
    calcSheet.innerHTML = `
      <div id="calc-drag-handle-wrapper" class="calc-drag-handle-wrapper">
        <div class="calc-drag-handle"></div>
      </div>
      <div class="calc-header">
        <h3 class="calc-title"><i class="fas fa-notes-medical" style="color: #58a6ff;"></i> Medical Calculator</h3>
        <div class="calc-header-actions">
          <button id="btn-calc-quick-inject" class="calc-action-btn" title="Scan clinical vignette text for values"><i class="fas fa-bolt"></i> Auto-Fill</button>
          <button id="btn-calc-close" class="calc-close-btn" title="Close"><i class="fas fa-times"></i></button>
        </div>
      </div>
      
      <div class="calc-tabs">
        <button class="calc-tab-btn active" data-tab="rhc"><i class="fas fa-heart-pulse"></i> RHC Profile</button>
        <button class="calc-tab-btn" data-tab="anthro"><i class="fas fa-weight-scale"></i> BSA / CrCl</button>
        <button class="calc-tab-btn" data-tab="oxy"><i class="fas fa-lungs"></i> Oxygenation</button>
        <button class="calc-tab-btn" data-tab="basic"><i class="fas fa-calculator"></i> Basic Calc</button>
      </div>

      <div class="calc-body">
        <!-- RHC HEMODYNAMIC TAB -->
        <div id="tab-rhc" class="calc-tab-content active">
          <div class="calc-section-title"><i class="fas fa-sliders"></i> Catheter Pressures & Flow</div>
          <div class="calc-input-grid">
            <div class="calc-input-group">
              <label>MAP <span class="unit">mmHg</span></label>
              <input type="number" id="rhc-map" class="calc-input-field" placeholder="85" step="1">
            </div>
            <div class="calc-input-group">
              <label>CVP / RA <span class="unit">mmHg</span></label>
              <input type="number" id="rhc-cvp" class="calc-input-field" placeholder="8" step="1">
            </div>
            <div class="calc-input-group">
              <label>PAPs / PAPd <span class="unit">mmHg</span></label>
              <div style="display: flex; gap: 4px;">
                <input type="number" id="rhc-paps" class="calc-input-field" placeholder="PAPs (35)" step="1">
                <input type="number" id="rhc-papd" class="calc-input-field" placeholder="PAPd (18)" step="1">
              </div>
            </div>
            <div class="calc-input-group">
              <label>mPAP <span class="unit">mmHg</span></label>
              <input type="number" id="rhc-mpap" class="calc-input-field" placeholder="Auto / 24" step="1">
            </div>
            <div class="calc-input-group">
              <label>PAWP / PCWP <span class="unit">mmHg</span></label>
              <input type="number" id="rhc-pawp" class="calc-input-field" placeholder="12" step="1">
            </div>
            <div class="calc-input-group">
              <label>CO <span class="unit">L/min</span></label>
              <input type="number" id="rhc-co" class="calc-input-field" placeholder="5.0" step="0.1">
            </div>
            <div class="calc-input-group">
              <label>BSA <span class="unit">m²</span></label>
              <input type="number" id="rhc-bsa" class="calc-input-field" placeholder="1.8" step="0.01">
            </div>
          </div>

          <div class="calc-results-card">
            <div class="calc-section-title"><i class="fas fa-chart-line"></i> Computed Hemodynamics</div>
            <div class="calc-results-grid">
              <div class="calc-res-box">
                <div class="calc-res-label">Cardiac Index (CI)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-ci" class="calc-res-value">--</span><span class="calc-res-unit">L/min/m²</span></div>
                  <span id="badge-ci" class="norm-badge">--</span>
                </div>
              </div>

              <div class="calc-res-box">
                <div class="calc-res-label">SVRI</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-svri" class="calc-res-value">--</span><span class="calc-res-unit">dyn·s/cm⁵·m²</span></div>
                  <span id="badge-svri" class="norm-badge">--</span>
                </div>
              </div>

              <div class="calc-res-box">
                <div class="calc-res-label">PVRI</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-pvri" class="calc-res-value">--</span><span class="calc-res-unit">dyn·s/cm⁵·m²</span></div>
                  <span id="badge-pvri" class="norm-badge">--</span>
                </div>
              </div>

              <div class="calc-res-box">
                <div class="calc-res-label">Transpulmonary Grad (TPG)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-tpg" class="calc-res-value">--</span><span class="calc-res-unit">mmHg</span></div>
                  <span id="badge-tpg" class="norm-badge">--</span>
                </div>
              </div>

              <div class="calc-res-box">
                <div class="calc-res-label">Diastolic Pulm Grad (DPG)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-dpg" class="calc-res-value">--</span><span class="calc-res-unit">mmHg</span></div>
                  <span id="badge-dpg" class="norm-badge">--</span>
                </div>
              </div>

              <div class="calc-res-box">
                <div class="calc-res-label">PAPI Index (RV Failure)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-papi" class="calc-res-value">--</span></div>
                  <span id="badge-papi" class="norm-badge">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ANTHROPOMETRY & RENAL TAB -->
        <div id="tab-anthro" class="calc-tab-content">
          <div class="calc-section-title"><i class="fas fa-user-gear"></i> Patient Parameters</div>
          <div class="calc-input-grid">
            <div class="calc-input-group">
              <label>Weight <span class="unit">kg</span></label>
              <input type="number" id="anthro-weight" class="calc-input-field" placeholder="70" step="1">
            </div>
            <div class="calc-input-group">
              <label>Height <span class="unit">cm</span></label>
              <input type="number" id="anthro-height" class="calc-input-field" placeholder="175" step="1">
            </div>
            <div class="calc-input-group">
              <label>Age <span class="unit">years</span></label>
              <input type="number" id="anthro-age" class="calc-input-field" placeholder="60" step="1">
            </div>
            <div class="calc-input-group">
              <label>Gender</label>
              <select id="anthro-gender" class="calc-select-field">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="calc-input-group">
              <label>Serum Creatinine <span class="unit">mg/dL</span></label>
              <input type="number" id="anthro-cr" class="calc-input-field" placeholder="1.0" step="0.1">
            </div>
          </div>

          <div class="calc-results-card">
            <div class="calc-section-title"><i class="fas fa-calculator"></i> Anthropometry & Renal Results</div>
            <div class="calc-results-grid">
              <div class="calc-res-box">
                <div class="calc-res-label">BMI (Body Mass Index)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-bmi" class="calc-res-value">--</span><span class="calc-res-unit">kg/m²</span></div>
                  <span id="badge-bmi" class="norm-badge">--</span>
                </div>
              </div>
              <div class="calc-res-box">
                <div class="calc-res-label">BSA (DuBois / Mosteller)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-bsa-dubois" class="calc-res-value">--</span><span class="calc-res-unit">m²</span></div>
                  <span class="calc-res-unit" id="val-bsa-mosteller">Mosteller: --</span>
                </div>
              </div>
              <div class="calc-res-box">
                <div class="calc-res-label">CrCl (Cockcroft-Gault)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-crcl" class="calc-res-value">--</span><span class="calc-res-unit">mL/min</span></div>
                  <span id="badge-crcl" class="norm-badge">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OXYGENATION TAB -->
        <div id="tab-oxy" class="calc-tab-content">
          <div class="calc-section-title"><i class="fas fa-wind"></i> Blood Gas & Oxygenation</div>
          <div class="calc-input-grid">
            <div class="calc-input-group">
              <label>PaO₂ <span class="unit">mmHg</span></label>
              <input type="number" id="oxy-pao2" class="calc-input-field" placeholder="90" step="1">
            </div>
            <div class="calc-input-group">
              <label>FiO₂ <span class="unit">% (21-100)</span></label>
              <input type="number" id="oxy-fio2" class="calc-input-field" placeholder="21" step="1">
            </div>
            <div class="calc-input-group">
              <label>Hemoglobin <span class="unit">g/dL</span></label>
              <input type="number" id="oxy-hb" class="calc-input-field" placeholder="14" step="0.1">
            </div>
            <div class="calc-input-group">
              <label>SaO₂ <span class="unit">%</span></label>
              <input type="number" id="oxy-sao2" class="calc-input-field" placeholder="98" step="1">
            </div>
          </div>

          <div class="calc-results-card">
            <div class="calc-section-title"><i class="fas fa-stethoscope"></i> Oxygenation Results</div>
            <div class="calc-results-grid">
              <div class="calc-res-box">
                <div class="calc-res-label">PaO₂ / FiO₂ Ratio (Horovitz)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-pf-ratio" class="calc-res-value">--</span><span class="calc-res-unit">mmHg</span></div>
                  <span id="badge-pf-ratio" class="norm-badge">--</span>
                </div>
              </div>
              <div class="calc-res-box">
                <div class="calc-res-label">CaO₂ (Arterial O₂ Content)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-cao2" class="calc-res-value">--</span><span class="calc-res-unit">mL O₂/dL</span></div>
                </div>
              </div>
              <div class="calc-res-box">
                <div class="calc-res-label">DO₂I (O₂ Delivery Index)</div>
                <div class="calc-res-val-wrapper">
                  <div><span id="val-do2i" class="calc-res-value">--</span><span class="calc-res-unit">mL/min/m²</span></div>
                  <span id="badge-do2i" class="norm-badge">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STANDARD BASIC CALCULATOR TAB -->
        <div id="tab-basic" class="calc-tab-content">
          <div class="calc-section-title"><i class="fas fa-calculator"></i> Standard Basic Calculator</div>
          <div class="basic-calc-container">
            <div class="basic-calc-screen">
              <div id="basic-expr" class="basic-calc-expr"></div>
              <div id="basic-result" class="basic-calc-result">0</div>
            </div>
            <div class="basic-calc-keypad">
              <button class="basic-calc-btn btn-clear" data-key="C">C</button>
              <button class="basic-calc-btn btn-op" data-key="DEL" title="Backspace"><i class="fas fa-backspace"></i></button>
              <button class="basic-calc-btn btn-op" data-key="%">%</button>
              <button class="basic-calc-btn btn-op" data-key="/">÷</button>

              <button class="basic-calc-btn" data-key="7">7</button>
              <button class="basic-calc-btn" data-key="8">8</button>
              <button class="basic-calc-btn" data-key="9">9</button>
              <button class="basic-calc-btn btn-op" data-key="*">×</button>

              <button class="basic-calc-btn" data-key="4">4</button>
              <button class="basic-calc-btn" data-key="5">5</button>
              <button class="basic-calc-btn" data-key="6">6</button>
              <button class="basic-calc-btn btn-op" data-key="-">−</button>

              <button class="basic-calc-btn" data-key="1">1</button>
              <button class="basic-calc-btn" data-key="2">2</button>
              <button class="basic-calc-btn" data-key="3">3</button>
              <button class="basic-calc-btn btn-op" data-key="+">+</button>

              <button class="basic-calc-btn" data-key="±">±</button>
              <button class="basic-calc-btn" data-key="0">0</button>
              <button class="basic-calc-btn" data-key=".">.</button>
              <button class="basic-calc-btn btn-equals" data-key="=">=</button>
            </div>
          </div>
        </div>

        <div class="calc-footer">
          <button id="btn-calc-copy" class="calc-copy-btn"><i class="fas fa-copy"></i> Copy Clinical Summary</button>
        </div>
      </div>
    `;
    document.body.appendChild(calcSheet);
  }

  /* ==========================================================================
     2. CANVAS SCRATCHPAD IMPLEMENTATION
     ========================================================================== */
  const Scratchpad = {
    canvas: null,
    ctx: null,
    overlayEl: null,
    isDrawing: false,
    color: '#ef4444',
    lineWidth: 4,
    isEraser: false,
    historyStack: [],
    maxHistory: 15,
    lastX: 0,
    lastY: 0,

    init() {
      this.overlayEl = document.getElementById('scratchpad-overlay');
      this.canvas = document.getElementById('scratchpad-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());

      // Pointer events for Pen, Touch, Mouse
      this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
      this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
      this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
      this.canvas.addEventListener('pointercancel', (e) => this.onPointerUp(e));

      // Controls
      const colorDots = document.querySelectorAll('.scratch-color-dot');
      colorDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          colorDots.forEach((d) => d.classList.remove('active'));
          dot.classList.add('active');
          this.color = dot.dataset.color;
          this.isEraser = false;
          document.getElementById('btn-sp-eraser')?.classList.remove('active');
        });
      });

      document.getElementById('btn-sp-eraser')?.addEventListener('click', () => {
        this.isEraser = !this.isEraser;
        document.getElementById('btn-sp-eraser').classList.toggle('active', this.isEraser);
      });

      document.getElementById('btn-sp-clear')?.addEventListener('click', () => this.clearCanvas());
      document.getElementById('btn-sp-undo')?.addEventListener('click', () => this.undo());
      document.getElementById('btn-sp-close')?.addEventListener('click', () => this.hide());

      // Auto-clear on question or chapter change
      window.addEventListener('quiz:questionChanged', () => this.clearCanvas());
      window.addEventListener('reader:chapterChanged', () => this.clearCanvas());
    },

    resizeCanvas() {
      if (!this.canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Save content before resize
      let tempCanvas = null;
      if (this.canvas.width > 0 && this.canvas.height > 0) {
        tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.canvas, 0, 0);
      }

      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);

      // Restore content
      if (tempCanvas) {
        this.ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width / dpr, tempCanvas.height / dpr);
      }
    },

    saveState() {
      if (this.historyStack.length >= this.maxHistory) {
        this.historyStack.shift();
      }
      this.historyStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    },

    undo() {
      if (this.historyStack.length > 0) {
        const state = this.historyStack.pop();
        this.ctx.putImageData(state, 0, 0);
      }
    },

    clearCanvas() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.historyStack = [];
    },

    show() {
      this.overlayEl.classList.remove('hidden');
      StarleyOverlay.isScratchpadActive = true;
      this.resizeCanvas();
    },

    hide() {
      this.overlayEl.classList.add('hidden');
      StarleyOverlay.isScratchpadActive = false;
    },

    getPos(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },

    onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      this.isDrawing = true;
      this.saveState();
      const pos = this.getPos(e);
      this.lastX = pos.x;
      this.lastY = pos.y;

      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      if (this.isEraser) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = 20;
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
      }
    },

    onPointerMove(e) {
      if (!this.isDrawing) return;
      const pos = this.getPos(e);

      requestAnimationFrame(() => {
        if (!this.isDrawing) return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        this.lastX = pos.x;
        this.lastY = pos.y;
      });
    },

    onPointerUp() {
      this.isDrawing = false;
    },
  };

  /* ==========================================================================
     3. SMART MEDICAL CALCULATOR IMPLEMENTATION
     ========================================================================== */
  const MedicalCalc = {
    sheetEl: null,
    backdropEl: null,
    activeTab: 'rhc',

    init() {
      this.sheetEl = document.getElementById('calc-bottom-sheet');
      this.backdropEl = document.getElementById('calc-bottom-sheet-backdrop');
      if (!this.sheetEl) return;

      // Tab Events
      const tabs = this.sheetEl.querySelectorAll('.calc-tab-btn');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          this.activeTab = tab.dataset.tab;
          this.sheetEl.querySelectorAll('.calc-tab-content').forEach((c) => c.classList.remove('active'));
          document.getElementById(`tab-${this.activeTab}`)?.classList.add('active');
        });
      });

      // Close Events
      document.getElementById('btn-calc-close')?.addEventListener('click', () => this.hide());
      this.backdropEl.addEventListener('click', () => this.hide());

      // Auto Recalculate on Input
      this.sheetEl.querySelectorAll('input, select').forEach((input) => {
        input.addEventListener('input', () => this.recalculateAll());
      });

      // Quick Copy
      document.getElementById('btn-calc-copy')?.addEventListener('click', () => this.copySummary());

      // Quick Inject
      document.getElementById('btn-calc-quick-inject')?.addEventListener('click', () => this.quickInjectFromText());

      // Basic Calc Init
      this.BasicCalc.init();

      // Drag to Close Handler
      this.initDragHandler();
    },

    show() {
      this.backdropEl.classList.remove('hidden');
      this.sheetEl.classList.remove('hidden');
      StarleyOverlay.isCalcActive = true;
      this.recalculateAll();
    },

    hide() {
      this.backdropEl.classList.add('hidden');
      this.sheetEl.classList.add('hidden');
      StarleyOverlay.isCalcActive = false;
    },

    initDragHandler() {
      const handle = document.getElementById('calc-drag-handle-wrapper');
      if (!handle) return;
      let startY = 0;
      let currentY = 0;
      let isDragging = false;

      handle.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startY = e.clientY;
        handle.style.cursor = 'grabbing';
      });

      window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentY = e.clientY - startY;
        if (currentY > 0) {
          this.sheetEl.style.transform = `translateX(-50%) translateY(${currentY}px)`;
        }
      });

      window.addEventListener('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        handle.style.cursor = 'grab';
        if (currentY > 120) {
          this.hide();
        }
        this.sheetEl.style.transform = '';
        currentY = 0;
      });
    },

    getValue(id) {
      const el = document.getElementById(id);
      if (!el || el.value === '') return null;
      const v = parseFloat(el.value);
      return isNaN(v) ? null : v;
    },

    setVal(id, text) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    },

    setBadge(id, statusText, colorClass) {
      const el = document.getElementById(id);
      if (!el) return;
      if (!colorClass) {
        el.className = 'norm-badge';
        el.textContent = '--';
        return;
      }
      el.className = `norm-badge ${colorClass}`;
      el.textContent = statusText;
    },

    recalculateAll() {
      // A. Anthropometry Calculations
      const weight = this.getValue('anthro-weight') || this.getValue('rhc-weight');
      const height = this.getValue('anthro-height') || this.getValue('rhc-height');
      const age = this.getValue('anthro-age');
      const gender = document.getElementById('anthro-gender')?.value || 'male';
      const cr = this.getValue('anthro-cr');

      let bsaDubois = this.getValue('rhc-bsa');

      if (weight && height) {
        // BMI
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        this.setVal('val-bmi', bmi.toFixed(1));
        if (bmi < 18.5) this.setBadge('badge-bmi', 'Underweight', 'yellow');
        else if (bmi <= 24.9) this.setBadge('badge-bmi', 'Normal', 'green');
        else if (bmi <= 29.9) this.setBadge('badge-bmi', 'Overweight', 'yellow');
        else this.setBadge('badge-bmi', 'Obese', 'red');

        // BSA DuBois: 0.007184 * W^0.425 * H^0.725
        const computedBSA = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
        const bsaMosteller = Math.sqrt((height * weight) / 3600);
        this.setVal('val-bsa-dubois', computedBSA.toFixed(2));
        this.setVal('val-bsa-mosteller', `Mosteller: ${bsaMosteller.toFixed(2)}`);

        if (!bsaDubois) bsaDubois = computedBSA;
      } else {
        this.setVal('val-bmi', '--');
        this.setBadge('badge-bmi', null);
        this.setVal('val-bsa-dubois', '--');
        this.setVal('val-bsa-mosteller', 'Mosteller: --');
      }

      // CrCl Cockcroft-Gault: ((140 - age) * weight) / (72 * Cr) * (0.85 if female)
      if (weight && age && cr && cr > 0) {
        let crcl = ((140 - age) * weight) / (72 * cr);
        if (gender === 'female') crcl *= 0.85;
        this.setVal('val-crcl', Math.round(crcl).toString());
        if (crcl >= 90) this.setBadge('badge-crcl', 'Normal', 'green');
        else if (crcl >= 60) this.setBadge('badge-crcl', 'Mild Risk', 'yellow');
        else if (crcl >= 30) this.setBadge('badge-crcl', 'Mod CKD', 'yellow');
        else this.setBadge('badge-crcl', 'Severe CKD', 'red');
      } else {
        this.setVal('val-crcl', '--');
        this.setBadge('badge-crcl', null);
      }

      // B. RHC Hemodynamics
      const map = this.getValue('rhc-map');
      const cvp = this.getValue('rhc-cvp');
      const paps = this.getValue('rhc-paps');
      const papd = this.getValue('rhc-papd');
      let mpap = this.getValue('rhc-mpap');
      const pawp = this.getValue('rhc-pawp');
      const co = this.getValue('rhc-co');

      // Auto-compute mPAP if PAPs & PAPd entered but mPAP blank
      if (!mpap && paps !== null && papd !== null) {
        mpap = Math.round((paps + 2 * papd) / 3);
        const mpapInput = document.getElementById('rhc-mpap');
        if (mpapInput && !mpapInput.value) {
          mpapInput.placeholder = `Auto (${mpap})`;
        }
      }

      // CI = CO / BSA
      let ci = null;
      if (co && bsaDubois) {
        ci = co / bsaDubois;
        this.setVal('val-ci', ci.toFixed(2));
        if (ci < 2.2) this.setBadge('badge-ci', 'Cardiogenic Shock', 'red');
        else if (ci < 2.5) this.setBadge('badge-ci', 'Low CI', 'yellow');
        else if (ci <= 4.0) this.setBadge('badge-ci', 'Normal', 'green');
        else this.setBadge('badge-ci', 'High Output', 'yellow');
      } else {
        this.setVal('val-ci', '--');
        this.setBadge('badge-ci', null);
      }

      // SVRI = (MAP - CVP) * 80 / CI
      if (map !== null && cvp !== null && ci) {
        const svri = Math.round(((map - cvp) * 80) / ci);
        this.setVal('val-svri', svri.toString());
        if (svri < 1900) this.setBadge('badge-svri', 'Vasodilation', 'yellow');
        else if (svri <= 2400) this.setBadge('badge-svri', 'Normal', 'green');
        else this.setBadge('badge-svri', 'High SVR', 'red');
      } else {
        this.setVal('val-svri', '--');
        this.setBadge('badge-svri', null);
      }

      // PVRI = (mPAP - PAWP) * 80 / CI
      if (mpap !== null && pawp !== null && ci) {
        const pvri = Math.round(((mpap - pawp) * 80) / ci);
        this.setVal('val-pvri', pvri.toString());
        if (pvri < 225) this.setBadge('badge-pvri', 'Low PVR', 'yellow');
        else if (pvri <= 315) this.setBadge('badge-pvri', 'Normal', 'green');
        else this.setBadge('badge-pvri', 'Elevated PAH', 'red');
      } else {
        this.setVal('val-pvri', '--');
        this.setBadge('badge-pvri', null);
      }

      // TPG = mPAP - PAWP
      if (mpap !== null && pawp !== null) {
        const tpg = mpap - pawp;
        this.setVal('val-tpg', tpg.toString());
        if (tpg <= 12) this.setBadge('badge-tpg', 'Normal (<=12)', 'green');
        else this.setBadge('badge-tpg', 'Elevated (>12)', 'red');
      } else {
        this.setVal('val-tpg', '--');
        this.setBadge('badge-tpg', null);
      }

      // DPG = PAPd - PAWP
      if (papd !== null && pawp !== null) {
        const dpg = papd - pawp;
        this.setVal('val-dpg', dpg.toString());
        if (dpg < 7) this.setBadge('badge-dpg', 'Passive (<7)', 'green');
        else this.setBadge('badge-dpg', 'Reactive (>=7)', 'red');
      } else {
        this.setVal('val-dpg', '--');
        this.setBadge('badge-dpg', null);
      }

      // PAPI = (PAPs - PAPd) / CVP
      if (paps !== null && papd !== null && cvp && cvp > 0) {
        const papi = (paps - papd) / cvp;
        this.setVal('val-papi', papi.toFixed(2));
        if (papi < 1.0) this.setBadge('badge-papi', 'RV Failure Risk', 'red');
        else if (papi <= 1.8) this.setBadge('badge-papi', 'Borderline RV', 'yellow');
        else this.setBadge('badge-papi', 'Normal RV', 'green');
      } else {
        this.setVal('val-papi', '--');
        this.setBadge('badge-papi', null);
      }

      // C. Oxygenation & Blood Gas Calculations
      const pao2 = this.getValue('oxy-pao2');
      const fio2 = this.getValue('oxy-fio2');
      const hb = this.getValue('oxy-hb');
      const sao2 = this.getValue('oxy-sao2');

      // P/F ratio
      if (pao2 && fio2 && fio2 > 0) {
        const fio2Dec = fio2 > 1 ? fio2 / 100 : fio2;
        const pf = Math.round(pao2 / fio2Dec);
        this.setVal('val-pf-ratio', pf.toString());
        if (pf > 300) this.setBadge('badge-pf-ratio', 'Normal (>300)', 'green');
        else if (pf >= 200) this.setBadge('badge-pf-ratio', 'Mild ARDS', 'yellow');
        else if (pf >= 100) this.setBadge('badge-pf-ratio', 'Mod ARDS', 'yellow');
        else this.setBadge('badge-pf-ratio', 'Severe ARDS', 'red');
      } else {
        this.setVal('val-pf-ratio', '--');
        this.setBadge('badge-pf-ratio', null);
      }

      // CaO2 = (Hb * 1.34 * SaO2/100) + (PaO2 * 0.0031)
      if (hb && sao2 && pao2) {
        const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * 0.0031;
        this.setVal('val-cao2', cao2.toFixed(1));

        // DO2I = CaO2 * CI * 10
        if (ci) {
          const do2i = Math.round(cao2 * ci * 10);
          this.setVal('val-do2i', do2i.toString());
          if (do2i >= 500) this.setBadge('badge-do2i', 'Adequate', 'green');
          else if (do2i >= 350) this.setBadge('badge-do2i', 'Mild Hypoxia', 'yellow');
          else this.setBadge('badge-do2i', 'Severe Hypoxia', 'red');
        } else {
          this.setVal('val-do2i', '--');
          this.setBadge('badge-do2i', null);
        }
      } else {
        this.setVal('val-cao2', '--');
        this.setVal('val-do2i', '--');
        this.setBadge('badge-do2i', null);
      }
    },

    quickInjectFromText() {
      // Scan active question text or page content for clinical values
      let textSource = '';
      const qText = document.getElementById('q-text')?.innerText;
      const readerText = document.getElementById('content-area')?.innerText;
      const selection = window.getSelection()?.toString();

      textSource = selection || qText || readerText || '';
      if (!textSource) {
        alert('No clinical text found to extract values from.');
        return;
      }

      let matchesCount = 0;

      // Extract weight: e.g. 70 kg, 75kg
      const weightMatch = textSource.match(/(\d{2,3})\s*kg/i);
      if (weightMatch) {
        document.getElementById('anthro-weight').value = weightMatch[1];
        document.getElementById('rhc-weight').value = weightMatch[1];
        matchesCount++;
      }

      // Extract height: e.g. 175 cm, 180cm
      const heightMatch = textSource.match(/(\d{3})\s*cm/i);
      if (heightMatch) {
        document.getElementById('anthro-height').value = heightMatch[1];
        document.getElementById('rhc-height').value = heightMatch[1];
        matchesCount++;
      }

      // Extract MAP: e.g. MAP 75, MAP = 80
      const mapMatch = textSource.match(/MAP\s*[:=]?\s*(\d{2,3})/i);
      if (mapMatch) {
        document.getElementById('rhc-map').value = mapMatch[1];
        matchesCount++;
      }

      // Extract CVP: e.g. CVP 10, CVP = 8
      const cvpMatch = textSource.match(/CVP\s*[:=]?\s*(\d{1,2})/i);
      if (cvpMatch) {
        document.getElementById('rhc-cvp').value = cvpMatch[1];
        matchesCount++;
      }

      // Extract PAP: e.g. PAP 45/25, PAP = 50/20
      const papMatch = textSource.match(/PAP\s*[:=]?\s*(\d{2,3})\/(\d{2,3})/i);
      if (papMatch) {
        document.getElementById('rhc-paps').value = papMatch[1];
        document.getElementById('rhc-papd').value = papMatch[2];
        matchesCount++;
      }

      // Extract PAWP / PCWP: e.g. PCWP 18, PAWP 12
      const pawpMatch = textSource.match(/(?:PAWP|PCWP|Wedge)\s*[:=]?\s*(\d{1,2})/i);
      if (pawpMatch) {
        document.getElementById('rhc-pawp').value = pawpMatch[1];
        matchesCount++;
      }

      // Extract CO: e.g. CO 4.2 L/min
      const coMatch = textSource.match(/CO\s*[:=]?\s*(\d{1,2}\.?\d?)/i);
      if (coMatch) {
        document.getElementById('rhc-co').value = coMatch[1];
        matchesCount++;
      }

      // Extract Cr: e.g. Cr 1.2, creatinine 1.4
      const crMatch = textSource.match(/(?:Cr|creatinine)\s*[:=]?\s*(\d{1,2}\.?\d?)/i);
      if (crMatch) {
        document.getElementById('anthro-cr').value = crMatch[1];
        matchesCount++;
      }

      this.recalculateAll();

      if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
      const injectBtn = document.getElementById('btn-calc-quick-inject');
      if (injectBtn) {
        const origText = injectBtn.innerHTML;
        injectBtn.innerHTML = `<i class="fas fa-check"></i> Injected (${matchesCount})`;
        setTimeout(() => (injectBtn.innerHTML = origText), 2000);
      }
    },

    copySummary() {
      const summaryLines = ['=== STARLEY MEDICAL CALC SUMMARY ==='];

      const ci = document.getElementById('val-ci')?.textContent;
      const svri = document.getElementById('val-svri')?.textContent;
      const pvri = document.getElementById('val-pvri')?.textContent;
      const tpg = document.getElementById('val-tpg')?.textContent;
      const dpg = document.getElementById('val-dpg')?.textContent;
      const papi = document.getElementById('val-papi')?.textContent;
      const bmi = document.getElementById('val-bmi')?.textContent;
      const crcl = document.getElementById('val-crcl')?.textContent;
      const pf = document.getElementById('val-pf-ratio')?.textContent;

      if (ci && ci !== '--') summaryLines.push(`• CI: ${ci} L/min/m² (${document.getElementById('badge-ci')?.textContent || ''})`);
      if (svri && svri !== '--') summaryLines.push(`• SVRI: ${svri} dyn·s/cm⁵·m² (${document.getElementById('badge-svri')?.textContent || ''})`);
      if (pvri && pvri !== '--') summaryLines.push(`• PVRI: ${pvri} dyn·s/cm⁵·m² (${document.getElementById('badge-pvri')?.textContent || ''})`);
      if (tpg && tpg !== '--') summaryLines.push(`• TPG: ${tpg} mmHg (${document.getElementById('badge-tpg')?.textContent || ''})`);
      if (dpg && dpg !== '--') summaryLines.push(`• DPG: ${dpg} mmHg (${document.getElementById('badge-dpg')?.textContent || ''})`);
      if (papi && papi !== '--') summaryLines.push(`• PAPI Index: ${papi} (${document.getElementById('badge-papi')?.textContent || ''})`);
      if (bmi && bmi !== '--') summaryLines.push(`• BMI: ${bmi} kg/m² (${document.getElementById('badge-bmi')?.textContent || ''})`);
      if (crcl && crcl !== '--') summaryLines.push(`• CrCl: ${crcl} mL/min (${document.getElementById('badge-crcl')?.textContent || ''})`);
      if (pf && pf !== '--') summaryLines.push(`• PaO2/FiO2 Ratio: ${pf} mmHg (${document.getElementById('badge-pf-ratio')?.textContent || ''})`);

      if (summaryLines.length === 1) {
        summaryLines.push('No computed values available. Fill in clinical parameters.');
      }

      const textToCopy = summaryLines.join('\n');

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (navigator.vibrate) navigator.vibrate([30]);
        const copyBtn = document.getElementById('btn-calc-copy');
        if (copyBtn) {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied to Clipboard!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Clinical Summary';
          }, 2000);
        }
      });
    },

    BasicCalc: {
      expr: '',
      result: '0',

      init() {
        const keypad = document.querySelector('.basic-calc-keypad');
        if (!keypad) return;

        keypad.addEventListener('click', (e) => {
          const btn = e.target.closest('.basic-calc-btn');
          if (!btn) return;
          const key = btn.dataset.key;
          this.handleKey(key);
        });

        window.addEventListener('keydown', (e) => {
          if (!StarleyOverlay.isCalcActive || MedicalCalc.activeTab !== 'basic') return;
          if (e.key >= '0' && e.key <= '9') this.handleKey(e.key);
          else if (e.key === '.') this.handleKey('.');
          else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') this.handleKey(e.key);
          else if (e.key === '%') this.handleKey('%');
          else if (e.key === 'Enter' || e.key === '=') this.handleKey('=');
          else if (e.key === 'Backspace') this.handleKey('DEL');
          else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') this.handleKey('C');
        });
      },

      handleKey(key) {
        if (key === 'C') {
          this.expr = '';
          this.result = '0';
        } else if (key === 'DEL') {
          this.expr = this.expr.slice(0, -1);
        } else if (key === '=') {
          try {
            if (this.expr) {
              const sanitized = this.expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
              const res = Function(`"use strict"; return (${sanitized})`)();
              this.result = String(Number(res.toFixed(8)));
            }
          } catch (err) {
            this.result = 'Error';
          }
        } else if (key === '±') {
          if (this.result !== '0' && this.result !== 'Error') {
            if (this.result.startsWith('-')) this.result = this.result.slice(1);
            else this.result = '-' + this.result;
          }
        } else {
          this.expr += key;
          try {
            const sanitized = this.expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
            const preview = Function(`"use strict"; return (${sanitized})`)();
            if (!isNaN(preview) && isFinite(preview)) {
              this.result = String(Number(preview.toFixed(8)));
            }
          } catch (err) {}
        }
        this.updateDisplay();
      },

      updateDisplay() {
        const exprEl = document.getElementById('basic-expr');
        const resEl = document.getElementById('basic-result');
        if (exprEl) exprEl.textContent = this.expr;
        if (resEl) resEl.textContent = this.result;
      },
    },
  };

  /* ==========================================================================
     4. INITIALIZATION ENGINE
     ========================================================================== */
  function makeFloatingBarDraggable(bar) {
    if (!bar) return;
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

    // Restore saved position
    try {
      const savedPos = localStorage.getItem('starley_floating_bar_pos');
      if (savedPos) {
        const pos = JSON.parse(savedPos);
        if (typeof pos.left === 'number' && typeof pos.top === 'number') {
          bar.style.bottom = 'auto';
          bar.style.right = 'auto';
          bar.style.left = `${pos.left}px`;
          bar.style.top = `${pos.top}px`;
        }
      }
    } catch (e) {}

    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.overlay-float-btn')) return;
      isDragging = true;
      bar.classList.add('dragging');
      bar.setPointerCapture(e.pointerId);

      const rect = bar.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;
    });

    bar.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let newLeft = initialLeft + dx;
      let newTop = initialTop + dy;

      const maxLeft = window.innerWidth - bar.offsetWidth - 8;
      const maxTop = window.innerHeight - bar.offsetHeight - 8;

      newLeft = Math.max(8, Math.min(maxLeft, newLeft));
      newTop = Math.max(8, Math.min(maxTop, newTop));

      bar.style.bottom = 'auto';
      bar.style.right = 'auto';
      bar.style.left = `${newLeft}px`;
      bar.style.top = `${newTop}px`;
    });

    const stopDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      bar.classList.remove('dragging');
      try {
        const rect = bar.getBoundingClientRect();
        localStorage.setItem('starley_floating_bar_pos', JSON.stringify({ left: rect.left, top: rect.top }));
      } catch (err) {}
    };

    bar.addEventListener('pointerup', stopDrag);
    bar.addEventListener('pointercancel', stopDrag);
  }

  function initOverlayTools() {
    injectOverlayDOM();
    Scratchpad.init();
    MedicalCalc.init();

    const floatBar = document.getElementById('overlay-floating-bar');
    if (floatBar) {
      makeFloatingBarDraggable(floatBar);
    }

    // Floating bar buttons
    document.getElementById('btn-float-scratch')?.addEventListener('click', () => {
      if (StarleyOverlay.isScratchpadActive) Scratchpad.hide();
      else Scratchpad.show();
    });

    document.getElementById('btn-float-calc')?.addEventListener('click', () => {
      if (StarleyOverlay.isCalcActive) MedicalCalc.hide();
      else MedicalCalc.show();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOverlayTools);
  } else {
    initOverlayTools();
  }

  // Export module globally
  window.StarleyOverlayTools = {
    Scratchpad,
    MedicalCalc,
  };
})();
