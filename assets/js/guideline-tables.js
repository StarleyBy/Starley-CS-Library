/**
 * GuidelineTables - Unified Renderer, Directory & Modal Overlay Component
 * Starley Medical Library
 */

(function (window) {
  'use strict';

  class GuidelineManager {
    constructor() {
      this.basePath = this.detectBasePath();
      this.currentLang = 'ru'; // 'ru' or 'en'
      this.registry = null;
      this.legends = {};
      this.guidelinesMeta = {};
      this.tablesCache = {};
      this.isOpen = false;
      this.onOpenCallbacks = [];
      this.onCloseCallbacks = [];
      this.activeTable = null;

      this.initDom();
      this.initRouting();
    }

    detectBasePath() {
      const loc = window.location.pathname;
      if (loc.includes('/search/') || loc.includes('/magazine/') || loc.includes('/combain/')) {
        return '../';
      }
      return './';
    }

    async loadRegistry() {
      if (this.registry) return this.registry;
      try {
        const res = await fetch(`${this.basePath}data/guidelines/guidelines.json`);
        this.registry = await res.json();
        return this.registry;
      } catch (err) {
        console.error('Failed to load guidelines.json:', err);
        return { guidelines: [] };
      }
    }

    async loadLegend(legendId) {
      if (this.legends[legendId]) return this.legends[legendId];
      try {
        const res = await fetch(`${this.basePath}data/guidelines/legends/${legendId}.json`);
        const data = await res.json();
        this.legends[legendId] = data;
        return data;
      } catch (err) {
        console.warn(`Legend ${legendId} not found:`, err);
        return null;
      }
    }

    async loadGuidelineMeta(guidelineId) {
      if (this.guidelinesMeta[guidelineId]) return this.guidelinesMeta[guidelineId];
      try {
        const res = await fetch(`${this.basePath}data/guidelines/${guidelineId}/guideline.json`);
        const data = await res.json();
        this.guidelinesMeta[guidelineId] = data;
        if (data.legend) {
          await this.loadLegend(data.legend);
        }
        return data;
      } catch (err) {
        console.warn(`Meta for ${guidelineId} not found:`, err);
        return null;
      }
    }

    async loadIndex() {
      if (this.indexData) return this.indexData;
      try {
        const res = await fetch(`${this.basePath}data/guidelines/tables-index.json`);
        this.indexData = await res.json();
        return this.indexData;
      } catch (err) {
        console.warn('Failed to load tables-index.json:', err);
        return null;
      }
    }

    async loadTable(tableRef) {
      if (this.tablesCache[tableRef]) return this.tablesCache[tableRef];
      const index = await this.loadIndex();
      if (index && index.tables) {
        const entry = index.tables.find(t => t.id === tableRef || t.relativeFilePath.includes(tableRef));
        if (entry) {
          try {
            const res = await fetch(`${this.basePath}data/guidelines/${entry.relativeFilePath}`);
            if (res.ok) {
              const table = await res.json();
              this.tablesCache[table.id] = table;
              this.tablesCache[tableRef] = table;
              return table;
            }
          } catch (e) {}
        }
      }

      // fallback candidate URLs
      const candidates = [
        `${this.basePath}data/guidelines/esc-acs-2023/${tableRef}.json`,
        `${this.basePath}data/guidelines/esc-acs-2023/rt01-clinical-and-diagnostic-tools.json`,
        `${this.basePath}data/guidelines/esc-acs-2023/rt04-reperfusion-and-invasive-strategy.json`,
        `${this.basePath}data/guidelines/esc-acs-2023/t04-new-recommendations.json`,
        `${this.basePath}data/guidelines/esc-acs-2023/t05-revised-recommendations.json`
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const table = await res.json();
            this.tablesCache[table.id] = table;
            this.tablesCache[tableRef] = table;
            return table;
          }
        } catch (e) {}
      }
      return null;
    }

    initDom() {
      if (document.getElementById('gt-modal-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'gt-modal-overlay';
      overlay.className = 'gt-modal-overlay';
      overlay.innerHTML = `
        <div class="gt-modal-dialog" role="dialog" aria-modal="true">
          <div class="gt-modal-header">
            <div class="gt-modal-title-area">
              <span class="gt-guideline" id="gt-header-badge">📋 CLINICAL GUIDELINES</span>
              <h2 id="gt-header-title">Guideline Tables</h2>
            </div>
            <div class="gt-modal-actions">
              <button class="gt-btn" id="gt-btn-catalog" title="Catalog / List">📚 Каталог</button>
              <div class="gt-lang-toggle">
                <button class="gt-lang-btn is-active" data-lang="ru">RU</button>
                <button class="gt-lang-btn" data-lang="en">EN</button>
              </div>
              <button class="gt-btn-close" id="gt-btn-close" aria-label="Close">✕</button>
            </div>
          </div>
          <div class="gt-modal-body" id="gt-modal-content">
            <div class="gt-toolbar">
              <input type="text" class="gt-search-input" id="gt-table-filter" placeholder="Поиск по таблицам или тексту (фильтр)...">
            </div>
            <div id="gt-view-container"></div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event handlers
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });

      overlay.querySelector('#gt-btn-close').addEventListener('click', () => this.close());
      overlay.querySelector('#gt-btn-catalog').addEventListener('click', () => this.handleBackNavigation());

      overlay.querySelectorAll('.gt-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          overlay.querySelectorAll('.gt-lang-btn').forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          this.currentLang = btn.dataset.lang;
          this.updateUiLang();
          if (this.activeTable) {
            this.renderTable(this.activeTable);
          } else {
            this.showCatalog();
          }
        });
      });

      const filterInput = overlay.querySelector('#gt-table-filter');
      filterInput.addEventListener('input', () => {
        this.filterContent(filterInput.value.trim().toLowerCase());
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    initRouting() {
      const handleHash = () => {
        const hash = window.location.hash;
        if (hash.startsWith('#guidelines') || hash.startsWith('#/guidelines') || hash.startsWith('#/tables/')) {
          let tableId = '';
          if (hash.includes('/')) {
            const parts = hash.split('/');
            tableId = parts[parts.length - 1];
            if (tableId === 'guidelines' || tableId === 'tables') tableId = '';
          }
          this.open(tableId);
        }
      };

      window.addEventListener('hashchange', handleHash);
      if (window.location.hash.startsWith('#guidelines') || window.location.hash.startsWith('#/tables/')) {
        setTimeout(handleHash, 250);
      }
    }

    updateUiLang() {
      const isRu = this.currentLang === 'ru';
      const catBtn = document.getElementById('gt-btn-catalog');
      if (catBtn) {
        if (this.activeTable) {
          catBtn.textContent = isRu ? '↩ К таблицам' : '↩ To Tables';
          catBtn.title = isRu ? 'Назад к таблицам этого руководства' : 'Back to tables of this guideline';
        } else if (this.selectedGuidelineId) {
          catBtn.textContent = isRu ? '↩ Все руководства' : '↩ All Guidelines';
          catBtn.title = isRu ? 'Назад к списку всех руководств' : 'Back to guidelines catalog';
        } else {
          catBtn.textContent = isRu ? '📚 Каталог' : '📚 Catalog';
          catBtn.title = isRu ? 'Каталог руководств' : 'Guidelines Catalog';
        }
      }
      const searchInput = document.getElementById('gt-table-filter');
      if (searchInput) {
        searchInput.placeholder = isRu ? 'Поиск по таблицам или тексту (фильтр)...' : 'Filter tables or recommendation text...';
      }
    }

    onOpen(cb) { this.onOpenCallbacks.push(cb); }
    onClose(cb) { this.onCloseCallbacks.push(cb); }

    async open(tableId = '') {
      this.initDom();
      this.updateUiLang();
      const overlay = document.getElementById('gt-modal-overlay');
      overlay.classList.add('is-open');
      this.isOpen = true;
      document.body.style.overflow = 'hidden';

      this.onOpenCallbacks.forEach(cb => {
        try { cb(); } catch (e) { console.error(e); }
      });

      if (tableId) {
        await this.loadAndShowTable(tableId);
      } else {
        await this.showCatalog();
      }
    }

    close() {
      const overlay = document.getElementById('gt-modal-overlay');
      if (overlay) overlay.classList.remove('is-open');
      this.isOpen = false;
      document.body.style.overflow = '';

      if (window.location.hash.startsWith('#guidelines') || window.location.hash.startsWith('#/tables/')) {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }

      this.onCloseCallbacks.forEach(cb => {
        try { cb(); } catch (e) { console.error(e); }
      });
    }

    handleBackNavigation() {
      if (this.activeTable) {
        const gid = this.activeTable.guidelineId || this.selectedGuidelineId;
        if (gid) {
          this.showGuidelineTables(gid);
        } else {
          this.showCatalog();
        }
      } else if (this.selectedGuidelineId) {
        this.showCatalog();
      }
    }

    async showCatalog() {
      this.activeTable = null;
      this.selectedGuidelineId = null;
      this.updateUiLang();
      const titleEl = document.getElementById('gt-header-title');
      const badgeEl = document.getElementById('gt-header-badge');
      const container = document.getElementById('gt-view-container');
      const catBtn = document.getElementById('gt-btn-catalog');
      if (catBtn) catBtn.style.display = 'none';

      const filterInput = document.getElementById('gt-table-filter');
      if (filterInput) filterInput.value = '';

      titleEl.textContent = this.currentLang === 'ru' ? 'Клинические руководства' : 'Clinical Guidelines';
      badgeEl.textContent = 'ESC / AHA / ACC';

      container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--gt-muted);">Загрузка руководств...</div>';

      const index = await this.loadIndex();
      const guidelines = (index && index.guidelines) ? index.guidelines : [];

      if (guidelines.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--gt-muted);">Руководства не найдены</div>';
        return;
      }

      // Guidelines are pre-sorted by year descending in index
      let html = `<div class="gt-catalog-grid" id="gt-guidelines-list">`;
      guidelines.forEach(g => {
        const isRu = this.currentLang === 'ru';
        const title = g.title ? (g.title[this.currentLang] || g.title.en) : g.id;
        const shortTitle = g.shortTitle ? (g.shortTitle[this.currentLang] || g.shortTitle.en) : g.id;
        const tablesText = isRu ? `${g.tablesCount} табл.` : `${g.tablesCount} tables`;
        html += `
          <div class="gt-guideline-card" data-guideline-id="${g.id}">
            <div class="gt-guideline-top">
              <span class="gt-year-badge">${g.year}</span>
              <span class="gt-count-badge">📊 ${tablesText}</span>
            </div>
            <div class="gt-card-badge">${g.society || 'ESC'} • ${shortTitle}</div>
            <div class="gt-guideline-title">${title}</div>
            ${g.citation ? `<div class="gt-guideline-citation">${g.citation}</div>` : ''}
          </div>
        `;
      });
      html += `</div>`;

      container.innerHTML = html;

      container.querySelectorAll('.gt-guideline-card').forEach(card => {
        card.addEventListener('click', () => {
          this.showGuidelineTables(card.dataset.guidelineId);
        });
      });
    }

    async showGuidelineTables(guidelineId) {
      this.selectedGuidelineId = guidelineId;
      this.activeTable = null;
      this.updateUiLang();

      const titleEl = document.getElementById('gt-header-title');
      const badgeEl = document.getElementById('gt-header-badge');
      const container = document.getElementById('gt-view-container');
      const catBtn = document.getElementById('gt-btn-catalog');
      if (catBtn) catBtn.style.display = 'inline-flex';

      const filterInput = document.getElementById('gt-table-filter');
      if (filterInput) filterInput.value = '';

      const index = await this.loadIndex();
      const gMeta = (index?.guidelines || []).find(g => g.id === guidelineId);
      const isRu = this.currentLang === 'ru';

      const gShort = gMeta?.shortTitle ? (gMeta.shortTitle[this.currentLang] || gMeta.shortTitle.en) : guidelineId;
      const gTitle = gMeta?.title ? (gMeta.title[this.currentLang] || gMeta.title.en) : guidelineId;

      titleEl.textContent = gShort;
      badgeEl.textContent = `${gMeta?.year || ''} • ${gMeta?.society || 'ESC'}`;

      const items = (index?.tables || []).filter(t => t.guidelineId === guidelineId);

      let html = `
        <div class="gt-catalog-header-bar">
          <button class="gt-breadcrumb-btn" id="gt-btn-back-guidelines">
            ← ${isRu ? 'Все руководства' : 'All Guidelines'}
          </button>
          <span style="font-size:0.85rem; color:var(--gt-muted); font-weight:600;">
            ${items.length} ${isRu ? 'таблиц(ы)' : 'tables'}
          </span>
        </div>
        <div class="gt-catalog-grid" id="gt-catalog-list">
      `;

      items.forEach(item => {
        const tableLabel = isRu ? `Табл. ${item.number}` : `Table ${item.number}`;
        const defaultTitle = isRu ? `Таблица ${item.number}` : `Table ${item.number}`;
        const title = item.title ? (item.title[this.currentLang] || item.title.en) : defaultTitle;
        html += `
          <div class="gt-card" data-table-id="${item.id}">
            <div class="gt-card-badge">${tableLabel} • ${item.type}</div>
            <div class="gt-card-title">${title}</div>
            <div class="gt-card-tags">
              ${(item.tags || []).map(t => `<span class="gt-tag">#${t}</span>`).join('')}
            </div>
          </div>
        `;
      });
      html += `</div>`;

      container.innerHTML = html;

      const backBtn = container.querySelector('#gt-btn-back-guidelines');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.showCatalog());
      }

      container.querySelectorAll('.gt-card').forEach(card => {
        card.addEventListener('click', () => {
          this.loadAndShowTable(card.dataset.tableId);
        });
      });
    }

    async loadAndShowTable(tableId) {
      const container = document.getElementById('gt-view-container');
      container.innerHTML = '<div style="text-align:center; padding: 2rem; color: var(--gt-muted);">Загрузка данных таблицы...</div>';

      const table = await this.loadTable(tableId);
      if (!table) {
        container.innerHTML = `<div style="padding: 2rem; color: #d9534f; text-align: center;">Таблица "${tableId}" не найдена.</div>`;
        return;
      }

      this.activeTable = table;
      if (table.guidelineId) {
        this.selectedGuidelineId = table.guidelineId;
        await this.loadGuidelineMeta(table.guidelineId);
      }
      this.updateUiLang();
      const catBtn = document.getElementById('gt-btn-catalog');
      if (catBtn) catBtn.style.display = 'inline-flex';

      const filterInput = document.getElementById('gt-table-filter');
      if (filterInput) filterInput.value = '';

      this.renderTable(table);
    }

    renderTable(table) {
      this.updateUiLang();
      const container = document.getElementById('gt-view-container');
      const titleEl = document.getElementById('gt-header-title');
      const badgeEl = document.getElementById('gt-header-badge');

      const meta = this.guidelinesMeta[table.guidelineId] || {};
      const gTitle = meta.shortTitle ? (meta.shortTitle[this.currentLang] || meta.shortTitle.en) : table.guidelineId;
      badgeEl.textContent = gTitle;

      const isRu = this.currentLang === 'ru';
      const defaultTitle = isRu ? `Таблица ${table.number}` : `Table ${table.number}`;
      const tTitle = table.title ? (table.title[this.currentLang] || table.title.en) : defaultTitle;
      const tablePrefix = isRu ? `Таблица ${table.number}` : `Table ${table.number}`;
      titleEl.textContent = `${tTitle} (${tablePrefix})`;

      // Render Table DOM
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'gt';
      tableWrapper.id = `gt-rendered-${table.id}`;

      let bodyHtml = `
        <div class="gt-head">
          <span class="gt-guideline">${gTitle} — ${tablePrefix}</span>
          <div class="gt-title">${tTitle}</div>
        </div>
      `;

      if (table.type === 'recommendations' && table.sections) {
        bodyHtml += `
          <div class="gt-cols">
            <div style="text-align:left; padding: .4rem .9rem;">${this.currentLang === 'ru' ? 'Рекомендации' : 'Recommendations'}</div>
            <div>Class</div>
            <div>Level</div>
          </div>
        `;

        table.sections.forEach(sec => {
          const secTitle = sec.title ? (sec.title[this.currentLang] || sec.title.en) : '';
          bodyHtml += `<div class="gt-section">${secTitle}</div>`;

          if (sec.rows) {
            sec.rows.forEach(r => {
              const rText = this.formatMarkup(r.text ? (r.text[this.currentLang] || r.text.en) : '');
              const hasNotes = r.notes && r.notes.length > 0;
              const noteDot = hasNotes ? `<span class="gt-note-dot" title="Есть клиническая ремарка"></span>` : '';

              let bulletsHtml = '';
              if (r.bullets && r.bullets.length > 0) {
                bulletsHtml = `<ul>` + r.bullets.map(b => {
                  const bText = this.formatMarkup(b.text ? (b.text[this.currentLang] || b.text.en) : (b[this.currentLang] || b.en || ''));
                  return `<li>${bText}</li>`;
                }).join('') + `</ul>`;
              }

              bodyHtml += `
                <div class="gt-row" data-row-id="${r.id}" data-notes="${r.notes ? r.notes.join(',') : ''}">
                  <div class="gt-text">
                    ${rText} ${noteDot}
                    ${bulletsHtml}
                  </div>
                  <div class="gt-badge" data-class="${r.class || ''}" title="Class ${r.class}">${r.class || '—'}</div>
                  <div class="gt-badge" data-level="${r.level || ''}" title="Level ${r.level}">${r.level || '—'}</div>
                </div>
              `;
            });
          }
        });
      } else if (table.type === 'grid' && table.columns && table.rows) {
        // Grid type table rendering (e.g. Table 5 Revised recommendations)
        const colCount = table.columns.length;
        bodyHtml += `<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:0.9rem;">`;
        bodyHtml += `<thead style="background:var(--gt-section-bg); border-bottom:2px solid var(--gt-border);"><tr>`;
        table.columns.forEach(col => {
          const cTitle = col.title ? (col.title[this.currentLang] || col.title.en) : '';
          bodyHtml += `<th style="padding:8px 10px; text-align:center; border:1px solid var(--gt-border); font-size:0.8rem;">${cTitle}</th>`;
        });
        bodyHtml += `</tr></thead><tbody>`;

        table.rows.forEach(r => {
          bodyHtml += `<tr class="gt-grid-row" style="border-bottom:1px solid var(--gt-border);">`;
          r.cells.forEach(cell => {
            const colspan = cell.colspan ? `colspan="${cell.colspan}"` : '';
            const cText = this.formatMarkup(cell.text ? (cell.text[this.currentLang] || cell.text.en) : '');
            const toneAttr = cell.tone ? `data-tone="${cell.tone}"` : '';
            const toneClass = cell.tone ? `gt-cell` : '';
            const isBadge = ['I', 'IIa', 'IIb', 'III', 'A', 'B', 'C'].includes(cText);
            const align = cell.colspan ? 'text-align:left; font-weight:700; background:var(--gt-section-bg);' : (isBadge ? 'text-align:center; font-weight:800;' : 'text-align:left;');
            bodyHtml += `<td ${colspan} ${toneAttr} class="${toneClass}" style="padding:8px 10px; border:1px solid var(--gt-border); ${align}">${cText}</td>`;
          });
          bodyHtml += `</tr>`;
        });
        bodyHtml += `</tbody></table></div>`;
      }

      // Footnotes & Notes area
      let footHtml = '';
      if (table.footnotes && Object.keys(table.footnotes).length > 0) {
        footHtml += `<div class="gt-foot">`;
        Object.entries(table.footnotes).forEach(([k, fn]) => {
          const text = fn[this.currentLang] || fn.en;
          footHtml += `<p><strong class="gt-fn">^[${k}]</strong> ${text}</p>`;
        });
        footHtml += `</div>`;
      }

      // Clinical remarks drawer
      const remarkTitle = this.currentLang === 'en' ? '💡 Clinical Remark' : '💡 Клиническая ремарка';
      bodyHtml += footHtml;
      bodyHtml += `
        <div class="gt-notes-drawer" id="gt-remarks-drawer">
          <div class="gt-notes-drawer-title">
            <span>${remarkTitle}</span>
            <button class="gt-btn" style="padding: 2px 6px; font-size: 0.75rem;" id="gt-close-drawer">✕</button>
          </div>
          <div id="gt-remarks-content"></div>
        </div>
      `;

      tableWrapper.innerHTML = bodyHtml;
      container.innerHTML = '';
      container.appendChild(tableWrapper);

      // Attach row / class click events
      this.attachTableInteractions(tableWrapper, table);
    }

    formatMarkup(str) {
      if (!str) return '';
      return str
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\^\[([a-z0-9_-]+)\]/g, '<span class="gt-fn">[$1]</span>');
    }

    attachTableInteractions(wrapper, table) {
      const drawer = wrapper.querySelector('#gt-remarks-drawer');
      const drawerContent = wrapper.querySelector('#gt-remarks-content');
      const closeDrawer = wrapper.querySelector('#gt-close-drawer');

      if (closeDrawer && drawer) {
        closeDrawer.addEventListener('click', (e) => {
          e.stopPropagation();
          drawer.classList.remove('is-open');
          wrapper.querySelectorAll('.gt-row').forEach(r => r.removeAttribute('aria-selected'));
        });
      }

      // Class / Level tooltips on tap
      wrapper.querySelectorAll('.gt-badge').forEach(badge => {
        badge.addEventListener('click', async (e) => {
          e.stopPropagation();
          const cls = badge.dataset.class;
          const lvl = badge.dataset.level;
          const legend = this.legends['esc-2023'];

          if (cls && legend?.classes?.[cls]) {
            const info = legend.classes[cls];
            const wording = info.wording ? (info.wording[this.currentLang] || info.wording.en) : '';
            const meaning = info.meaning ? (info.meaning[this.currentLang] || info.meaning.en) : '';
            const title = this.currentLang === 'en' ? `Class ${cls}: ${wording}` : `Класс ${cls}: ${wording}`;
            this.showRemarks(title, meaning, drawer, drawerContent);
          } else if (lvl && legend?.levels?.[lvl]) {
            const info = legend.levels[lvl];
            const meaning = info.meaning ? (info.meaning[this.currentLang] || info.meaning.en) : '';
            const title = this.currentLang === 'en' ? `Level of Evidence ${lvl}` : `Уровень доказательности ${lvl}`;
            this.showRemarks(title, meaning, drawer, drawerContent);
          }
        });
      });

      // Row click for notes
      wrapper.querySelectorAll('.gt-row').forEach(row => {
        row.addEventListener('click', () => {
          wrapper.querySelectorAll('.gt-row').forEach(r => r.removeAttribute('aria-selected'));
          row.setAttribute('aria-selected', 'true');

          const noteKeys = row.dataset.notes ? row.dataset.notes.split(',').filter(Boolean) : [];
          if (noteKeys.length > 0 && table.notes) {
            const defaultNoteTitle = this.currentLang === 'en' ? 'Remark' : 'Ремарка';
            const nTexts = noteKeys.map(k => {
              const n = table.notes[k];
              if (!n) return '';
              const title = n.title ? (n.title[this.currentLang] || n.title.en) : defaultNoteTitle;
              const text = n.text ? (n.text[this.currentLang] || n.text.en) : '';
              return `<strong>${title}:</strong> ${text}`;
            }).filter(Boolean).join('<br><br>');

            if (nTexts) {
              const header = this.currentLang === 'en' ? 'Clinical Explanation' : 'Клиническое пояснение';
              this.showRemarks(header, nTexts, drawer, drawerContent);
              return;
            }
          }

          // If no specific note attached
          const rowId = row.dataset.rowId;
          const rowLabel = this.currentLang === 'en' ? `Row ${rowId}` : `Строка ${rowId}`;
          const noNoteMsg = this.currentLang === 'en' 
            ? 'No remarks attached for this recommendation.' 
            : 'Для данной рекомендации нет прикрепленных заметок.';
          this.showRemarks(rowLabel, noNoteMsg, drawer, drawerContent);
        });
      });
    }

    showRemarks(title, body, drawer, drawerContent) {
      if (!drawer || !drawerContent) return;
      drawerContent.innerHTML = `<strong>${title}</strong><div style="margin-top:4px;">${body}</div>`;
      drawer.classList.add('is-open');
    }

    filterContent(query) {
      const container = document.getElementById('gt-view-container');
      if (!container) return;

      if (!this.activeTable) {
        if (!this.selectedGuidelineId) {
          // In Guidelines view: filter guideline cards
          container.querySelectorAll('.gt-guideline-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = (!query || text.includes(query)) ? '' : 'none';
          });
        } else {
          // In Tables view of a guideline: filter table cards
          container.querySelectorAll('.gt-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = (!query || text.includes(query)) ? '' : 'none';
          });
        }
      } else {
        // filter rows in rendered table (both recommendation rows and grid rows)
        const recRows = container.querySelectorAll('.gt-row');
        recRows.forEach(r => {
          const text = r.textContent.toLowerCase();
          r.style.display = (!query || text.includes(query)) ? '' : 'none';
        });

        const gridRows = container.querySelectorAll('.gt-grid-row');
        gridRows.forEach(r => {
          const text = r.textContent.toLowerCase();
          r.style.display = (!query || text.includes(query)) ? '' : 'none';
        });

        // Hide/show sections if all their rows are hidden
        container.querySelectorAll('.gt-section').forEach(sec => {
          let next = sec.nextElementSibling;
          let hasVisible = false;
          while (next && !next.classList.contains('gt-section') && !next.classList.contains('gt-notes-drawer') && !next.classList.contains('gt-foot')) {
            if (next.classList.contains('gt-row') && next.style.display !== 'none') {
              hasVisible = true;
              break;
            }
            next = next.nextElementSibling;
          }
          if (!query) {
            sec.style.display = '';
          } else {
            sec.style.display = hasVisible ? '' : 'none';
          }
        });
      }
    }
  }

  // Global singleton instance
  window.GuidelineTables = new GuidelineManager();

})(window);
