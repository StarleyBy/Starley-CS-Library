/**
 * GuidelineLinkPicker - Interactive Modal for inserting Guideline & Table links
 * Used in Starley Medical Editor (editor.html) and Manifest Editor (manifest-editor.html)
 */

(function (window) {
  'use strict';

  class GuidelineLinkPicker {
    constructor() {
      this.basePath = this.detectBasePath();
      this.indexData = null;
      this.isOpen = false;
      this.selectedGuidelineId = '';
      this.mode = 'single'; // 'entire', 'single', 'multi'
      this.selectedTableId = '';
      this.selectedTableIds = new Set();
      this.multiFormat = 'inline'; // 'inline' or 'list'
      this.linkLang = 'ru'; // 'ru' or 'en'
      this.currentFilter = '';
      this.onInsertCallback = null;
      this.targetTextarea = null;

      this.initDom();
    }

    detectBasePath() {
      const loc = window.location.pathname;
      if (loc.includes('/search/') || loc.includes('/magazine/') || loc.includes('/combain/')) {
        return '../';
      }
      return './';
    }

    async loadIndex() {
      if (this.indexData) return this.indexData;
      try {
        const res = await fetch(`${this.basePath}data/guidelines/tables-index.json`);
        this.indexData = await res.json();
        return this.indexData;
      } catch (e) {
        console.error('Failed to load tables-index.json for GuidelineLinkPicker:', e);
        return null;
      }
    }

    initDom() {
      if (document.getElementById('glp-modal-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'glp-modal-overlay';
      overlay.className = 'glp-modal-overlay';
      overlay.innerHTML = `
        <div class="glp-modal-dialog" role="dialog" aria-modal="true">
          <div class="glp-modal-header">
            <div class="glp-modal-title-group">
              <span class="glp-modal-icon">📋</span>
              <h3 class="glp-modal-title" id="glp-modal-title">Вставить ссылку на гайдлайн</h3>
            </div>
            <div class="glp-header-actions">
              <div class="glp-lang-toggle" title="Язык подписи в ссылке">
                <button type="button" class="glp-lang-btn is-active" data-lang="ru">RU</button>
                <button type="button" class="glp-lang-btn" data-lang="en">EN</button>
              </div>
              <button type="button" class="glp-modal-close-btn" id="glp-btn-close" aria-label="Close">✕</button>
            </div>
          </div>

          <div class="glp-modal-body">
            <!-- 1. Guideline Selection -->
            <div>
              <div class="glp-section-title">
                <span>1. Выберите руководство (Guideline)</span>
                <span id="glp-guideline-badge" style="font-size:0.75rem; color:#38bdf8; font-weight:600;"></span>
              </div>
              <select id="glp-select-guideline" class="glp-select">
                <option value="">Загрузка руководств...</option>
              </select>
            </div>

            <!-- 2. Insertion Mode (3 options) -->
            <div>
              <div class="glp-section-title">2. Формат ссылки</div>
              <div class="glp-mode-grid">
                <div class="glp-mode-card" data-mode="entire">
                  <div class="glp-mode-card-header">
                    <span>📑</span> <span>Весь гайдлайн</span>
                  </div>
                  <div class="glp-mode-card-desc">Ссылка на каталог всех таблиц выбранного руководства</div>
                </div>

                <div class="glp-mode-card is-active" data-mode="single">
                  <div class="glp-mode-card-header">
                    <span>📊</span> <span>Выбранная таблица</span>
                  </div>
                  <div class="glp-mode-card-desc">Ссылка на одну конкретную клиническую таблицу</div>
                </div>

                <div class="glp-mode-card" data-mode="multi">
                  <div class="glp-mode-card-header">
                    <span>☑️</span> <span>Мультивыбор</span>
                  </div>
                  <div class="glp-mode-card-desc">Вставка сразу нескольких ссылок на выбранные таблицы</div>
                </div>
              </div>
            </div>

            <!-- 3. Tables List Section -->
            <div id="glp-tables-section">
              <div class="glp-section-title">
                <span>3. Выберите таблицу(ы)</span>
                <span id="glp-tables-count-label" style="font-size:0.75rem; color:#94a3b8;"></span>
              </div>

              <div class="glp-filter-bar">
                <input type="text" id="glp-table-filter" class="glp-filter-input" placeholder="Быстрый поиск по номеру или названию таблицы...">
                <div id="glp-multi-actions" style="display:none; gap:6px;">
                  <button type="button" class="glp-btn-sm" id="glp-btn-select-all">Выбрать все</button>
                  <button type="button" class="glp-btn-sm" id="glp-btn-clear-all">Сбросить</button>
                </div>
              </div>

              <!-- Multi-select format options -->
              <div id="glp-multi-format-row" class="glp-format-switch" style="display:none;">
                <span style="font-weight:600;">Формат списка:</span>
                <label>
                  <input type="radio" name="glp-fmt" value="inline" checked> В строку (через запятую)
                </label>
                <label>
                  <input type="radio" name="glp-fmt" value="list"> Списком с новой строки (- ...)
                </label>
              </div>

              <div id="glp-tables-list" class="glp-tables-container">
                <!-- Injected tables list -->
              </div>
            </div>

            <!-- 4. Markdown Live Preview -->
            <div>
              <div class="glp-section-title">Предпросмотр markdown для вставки</div>
              <div id="glp-preview-box" class="glp-preview-box"></div>
            </div>
          </div>

          <div class="glp-modal-footer">
            <button type="button" class="glp-btn-cancel" id="glp-btn-cancel">Отмена</button>
            <button type="button" class="glp-btn-insert" id="glp-btn-insert">
              <span>Вставить ссылку</span> ➔
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event Listeners
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });

      overlay.querySelector('#glp-btn-close').addEventListener('click', () => this.close());
      overlay.querySelector('#glp-btn-cancel').addEventListener('click', () => this.close());

      overlay.querySelectorAll('.glp-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          overlay.querySelectorAll('.glp-lang-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.linkLang = btn.dataset.lang;
          this.renderTables();
          this.updatePreview();
        });
      });

      const gSelect = overlay.querySelector('#glp-select-guideline');
      gSelect.addEventListener('change', () => {
        this.selectedGuidelineId = gSelect.value;
        this.selectedTableId = '';
        this.selectedTableIds.clear();
        this.renderTables();
        this.updatePreview();
      });

      overlay.querySelectorAll('.glp-mode-card').forEach(card => {
        card.addEventListener('click', () => {
          overlay.querySelectorAll('.glp-mode-card').forEach(c => c.classList.remove('is-active'));
          card.classList.add('is-active');
          this.mode = card.dataset.mode;
          this.updateModeUI();
          this.renderTables();
          this.updatePreview();
        });
      });

      const filterInput = overlay.querySelector('#glp-table-filter');
      filterInput.addEventListener('input', () => {
        this.currentFilter = filterInput.value.trim().toLowerCase();
        this.renderTables();
      });

      overlay.querySelectorAll('input[name="glp-fmt"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          this.multiFormat = e.target.value;
          this.updatePreview();
        });
      });

      overlay.querySelector('#glp-btn-select-all')?.addEventListener('click', () => {
        const filtered = this.getFilteredTables();
        filtered.forEach(t => this.selectedTableIds.add(t.id));
        this.renderTables();
        this.updatePreview();
      });

      overlay.querySelector('#glp-btn-clear-all')?.addEventListener('click', () => {
        this.selectedTableIds.clear();
        this.renderTables();
        this.updatePreview();
      });

      overlay.querySelector('#glp-btn-insert').addEventListener('click', () => {
        this.executeInsert();
      });

      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        if (e.key === 'Escape') this.close();
      });
    }

    updateModeUI() {
      const tablesSection = document.getElementById('glp-tables-section');
      const multiActions = document.getElementById('glp-multi-actions');
      const multiFormatRow = document.getElementById('glp-multi-format-row');

      if (this.mode === 'entire') {
        if (tablesSection) tablesSection.style.display = 'none';
        if (multiActions) multiActions.style.display = 'none';
        if (multiFormatRow) multiFormatRow.style.display = 'none';
      } else if (this.mode === 'single') {
        if (tablesSection) tablesSection.style.display = 'block';
        if (multiActions) multiActions.style.display = 'none';
        if (multiFormatRow) multiFormatRow.style.display = 'none';
      } else if (this.mode === 'multi') {
        if (tablesSection) tablesSection.style.display = 'block';
        if (multiActions) multiActions.style.display = 'flex';
        if (multiFormatRow) multiFormatRow.style.display = 'flex';
      }
    }

    async open(options = {}) {
      this.initDom();
      this.onInsertCallback = options.onInsert || null;
      this.targetTextarea = options.targetTextarea || null;

      // Determine initial language preference
      if (options.lang) {
        this.linkLang = options.lang.toLowerCase();
      } else {
        // Auto-detect based on context
        const isRuContext = (document.documentElement.lang === 'ru') ||
                            (typeof state !== 'undefined' && state?.settings?.lang === 'Ru') ||
                            (window.quizState?.settings?.lang === 'Ru') ||
                            (new URLSearchParams(window.location.search).get('edition') === 'russian');
        this.linkLang = isRuContext ? 'ru' : 'en';
      }

      const overlay = document.getElementById('glp-modal-overlay');
      overlay.querySelectorAll('.glp-lang-btn').forEach(b => {
        b.classList.toggle('is-active', b.dataset.lang === this.linkLang);
      });

      const index = await this.loadIndex();
      if (!index) {
        alert('Не удалось загрузить индекс руководств tables-index.json');
        return;
      }

      this.populateGuidelinesSelect(index.guidelines || []);

      if (options.guidelineId) {
        this.selectedGuidelineId = options.guidelineId;
        const gSelect = document.getElementById('glp-select-guideline');
        if (gSelect) gSelect.value = options.guidelineId;
      }

      this.updateModeUI();
      this.renderTables();
      this.updatePreview();

      overlay.classList.add('is-open');
      this.isOpen = true;
    }

    close() {
      const overlay = document.getElementById('glp-modal-overlay');
      if (overlay) overlay.classList.remove('is-open');
      this.isOpen = false;
    }

    populateGuidelinesSelect(guidelines) {
      const select = document.getElementById('glp-select-guideline');
      if (!select) return;

      select.innerHTML = '';
      if (guidelines.length === 0) {
        select.innerHTML = '<option value="">Нет доступных руководств</option>';
        return;
      }

      guidelines.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        const isRu = this.linkLang === 'ru';
        const title = g.shortTitle ? (g.shortTitle[this.linkLang] || g.shortTitle.en) : g.id;
        opt.textContent = `${g.year || ''} ${g.society || 'ESC'} • ${title} (${g.tablesCount || 0} табл.)`;
        select.appendChild(opt);
      });

      if (!this.selectedGuidelineId || !guidelines.some(g => g.id === this.selectedGuidelineId)) {
        this.selectedGuidelineId = guidelines[0].id;
      }
      select.value = this.selectedGuidelineId;
    }

    getFilteredTables() {
      if (!this.indexData || !this.selectedGuidelineId) return [];
      const all = (this.indexData.tables || []).filter(t => t.guidelineId === this.selectedGuidelineId);
      if (!this.currentFilter) return all;

      return all.filter(t => {
        const num = String(t.number || '').toLowerCase();
        const enTitle = String(t.title?.en || '').toLowerCase();
        const ruTitle = String(t.title?.ru || '').toLowerCase();
        const id = String(t.id || '').toLowerCase();
        return num.includes(this.currentFilter) || enTitle.includes(this.currentFilter) || ruTitle.includes(this.currentFilter) || id.includes(this.currentFilter);
      });
    }

    renderTables() {
      const container = document.getElementById('glp-tables-list');
      const countLabel = document.getElementById('glp-tables-count-label');
      if (!container) return;

      const tables = this.getFilteredTables();
      if (countLabel) countLabel.textContent = `${tables.length} табл. найдено`;

      if (tables.length === 0) {
        container.innerHTML = '<div style="padding:1.5rem; text-align:center; color:#64748b; font-size:0.85rem;">Таблицы не найдены</div>';
        return;
      }

      // Auto-select first table in single mode if none chosen
      if (this.mode === 'single' && (!this.selectedTableId || !tables.some(t => t.id === this.selectedTableId))) {
        this.selectedTableId = tables[0].id;
      }

      container.innerHTML = '';
      const isRu = this.linkLang === 'ru';

      tables.forEach(t => {
        const item = document.createElement('div');
        item.className = 'glp-table-item';

        const isRec = t.type === 'recommendations';
        const numLabel = isRu ? `Табл. ${t.number}` : `Table ${t.number}`;
        const mainTitle = isRu ? (t.title?.ru || t.title?.en || t.id) : (t.title?.en || t.title?.ru || t.id);
        const subTitle = isRu ? (t.title?.en || '') : (t.title?.ru || '');

        if (this.mode === 'single') {
          if (t.id === this.selectedTableId) {
            item.classList.add('is-selected');
          }
          item.innerHTML = `
            <span class="glp-table-badge ${isRec ? 'is-rec' : ''}">${numLabel}</span>
            <div class="glp-table-title-area">
              <span class="glp-table-title-main" title="${mainTitle}">${mainTitle}</span>
              ${subTitle ? `<span class="glp-table-title-sub" title="${subTitle}">${subTitle}</span>` : ''}
            </div>
          `;
          item.onclick = () => {
            this.selectedTableId = t.id;
            this.renderTables();
            this.updatePreview();
          };
        } else if (this.mode === 'multi') {
          const isChecked = this.selectedTableIds.has(t.id);
          if (isChecked) item.classList.add('is-selected');

          item.innerHTML = `
            <input type="checkbox" class="glp-table-checkbox" ${isChecked ? 'checked' : ''}>
            <span class="glp-table-badge ${isRec ? 'is-rec' : ''}">${numLabel}</span>
            <div class="glp-table-title-area">
              <span class="glp-table-title-main" title="${mainTitle}">${mainTitle}</span>
              ${subTitle ? `<span class="glp-table-title-sub" title="${subTitle}">${subTitle}</span>` : ''}
            </div>
          `;

          const cb = item.querySelector('.glp-table-checkbox');
          cb.onclick = (e) => e.stopPropagation();
          cb.onchange = () => {
            if (cb.checked) this.selectedTableIds.add(t.id);
            else this.selectedTableIds.delete(t.id);
            item.classList.toggle('is-selected', cb.checked);
            this.updatePreview();
          };

          item.onclick = () => {
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change'));
          };
        }

        container.appendChild(item);
      });
    }

    buildMarkdown() {
      if (!this.indexData || !this.selectedGuidelineId) return '';
      const g = (this.indexData.guidelines || []).find(x => x.id === this.selectedGuidelineId);
      if (!g) return '';

      const isRu = this.linkLang === 'ru';
      const gTitle = g.shortTitle ? (g.shortTitle[this.linkLang] || g.shortTitle.en) : (g.title ? (g.title[this.linkLang] || g.title.en) : g.id);

      // Mode A: Entire Guideline
      if (this.mode === 'entire') {
        const fullTitle = `${g.year || ''} ${g.society || 'ESC'} ${gTitle}`.trim();
        return `[${fullTitle}](#/guidelines/${g.id})`;
      }

      // Helper to format table link
      const formatTableLink = (tId) => {
        const t = (this.indexData.tables || []).find(x => x.id === tId);
        if (!t) return `[Таблица](#/tables/${tId})`;
        const numLabel = isRu ? `Таблица ${t.number}` : `Table ${t.number}`;
        const title = isRu ? (t.title?.ru || t.title?.en || '') : (t.title?.en || t.title?.ru || '');
        const cleanTitle = title.replace(/[\[\]]/g, '');
        return `[${numLabel}: ${cleanTitle} (${g.shortTitle ? (g.shortTitle[this.linkLang] || g.shortTitle.en) : g.id})](#/tables/${t.id})`;
      };

      // Mode B: Single Table
      if (this.mode === 'single') {
        if (!this.selectedTableId) return '';
        return formatTableLink(this.selectedTableId);
      }

      // Mode C: Multi Tables
      if (this.mode === 'multi') {
        const ids = Array.from(this.selectedTableIds);
        if (ids.length === 0) return '';

        const links = ids.map(id => formatTableLink(id));
        if (this.multiFormat === 'list') {
          return links.map(l => `- ${l}`).join('\n');
        } else {
          return links.join(', ');
        }
      }

      return '';
    }

    updatePreview() {
      const box = document.getElementById('glp-preview-box');
      const insertBtn = document.getElementById('glp-btn-insert');
      const markdown = this.buildMarkdown();

      if (box) {
        box.textContent = markdown || '(Выберите опцию или таблицу для генерации ссылки)';
      }

      if (insertBtn) {
        insertBtn.disabled = !markdown;
      }
    }

    executeInsert() {
      const markdown = this.buildMarkdown();
      if (!markdown) return;

      if (typeof this.onInsertCallback === 'function') {
        this.onInsertCallback(markdown);
      } else if (this.targetTextarea) {
        this.insertIntoTextarea(this.targetTextarea, markdown);
      } else if (window.editor && typeof window.editor.replaceSelection === 'function') {
        // Active CodeMirror in editor.html
        window.editor.replaceSelection(markdown);
        window.editor.focus();
      } else {
        // Fallback: active textarea or copy to clipboard
        const active = document.activeElement;
        if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
          this.insertIntoTextarea(active, markdown);
        } else {
          navigator.clipboard.writeText(markdown).then(() => {
            alert('Ссылка скопирована в буфер обмена: ' + markdown);
          });
        }
      }

      this.close();
    }

    insertIntoTextarea(textarea, text) {
      if (!textarea) return;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const val = textarea.value || '';
      textarea.value = val.substring(0, start) + text + val.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.focus();
    }
  }

  // Global instance
  window.GuidelineLinkPicker = new GuidelineLinkPicker();

})(window);
