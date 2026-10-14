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
              <div class="gt-book-nav" id="gt-book-nav" style="display:none;">
                <button class="gt-btn gt-btn-nav" id="gt-btn-prev" title="Предыдущая таблица (←)">◀</button>
                <span class="gt-book-page-info" id="gt-book-page-info">1 / 1</span>
                <button class="gt-btn gt-btn-nav" id="gt-btn-next" title="Следующая таблица (→)">▶</button>
              </div>
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

      const prevBtn = overlay.querySelector('#gt-btn-prev');
      const nextBtn = overlay.querySelector('#gt-btn-next');
      if (prevBtn) prevBtn.addEventListener('click', () => this.flipTable(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => this.flipTable(1));

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
        if (!this.isOpen) return;
        if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'ArrowLeft' && this.activeTable && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          this.flipTable(-1);
        } else if (e.key === 'ArrowRight' && this.activeTable && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          this.flipTable(1);
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

    highlightClinicalKeywords(text) {
      if (!text) return '';
      // Escape HTML entities first to avoid injection
      let s = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comprehensive rule-based multi-tier semantic highlighting:

      // 1. Interventions, Procedures, Devices & Surgeries (Vibrant Amber/Gold)
      const interventions = [
        'электрической кардиоверсии', 'электрическая кардиоверсия', 'электрической кардиоверсией', 'электрическую кардиоверсию',
        'медикаментозной кардиоверсии', 'медикаментозная кардиоверсия', 'кардиоверсии', 'кардиоверсия',
        'чрескожной окклюзии ушка левого предсердия', 'чрескожной окклюзии ушка', 'хирургической окклюзии ушка левого предсердия', 'окклюзии ушка левого предсердия', 'окклюзия ушка левого предсердия', 'окклюзии ушка',
        'эндоскопической и гибридной аблации', 'гибридной аблации', 'катетерная аблация', 'катетерной аблации', 'катетерную аблацию', 'аблация', 'аблации',
        'трансплантация сердца', 'трансплантации сердца', 'пересадка сердца',
        'имплантация икд', 'имплантируемого кардиовертера', 'кардиовертера-дефибриллятора', 'кардиовертер-дефибриллятор',
        'сердечной ресинхронизирующей терапии', 'ресинхронизирующей терапии', 'ресинхронизирующая терапия', 'сердечная ресинхронизация',
        'септальная миэктомия', 'септальной миэктомии', 'септальная редукция', 'септальной редукционной терапии', 'спиртовая септальная аблация',
        'чрескожное коронарное вмешательство', 'чрескожному вмешательству', 'чрескожных вмешательств', 'чкв', 'стентирование',
        'аортокоронарное шунтирование', 'акш', 'кардиохирургических операций', 'хирургических операций', 'хирургическому вмешательству',
        'фибринолитическая терапия', 'фибринолитической терапии', 'тромболизис', 'реперфузионной терапии', 'реперфузионная стратегия',
        'трансплантации гемопоэтических стволовых клеток', 'трансплантация гемопоэтических стволовых клеток', 'тгск', 'лучевой терапии', 'лучевая терапия',
        'electrical cardioversion', 'pharmacological cardioversion', 'cardioversion',
        'percutaneous left atrial appendage occlusion', 'surgical left atrial appendage occlusion', 'left atrial appendage occlusion', 'laa occlusion',
        'endoscopic and hybrid af ablation', 'hybrid af ablation', 'catheter ablation', 'ablation during cardiac surgery', 'ablation',
        'heart transplantation', 'cardiac transplantation',
        'implantable cardioverter defibrillator', 'cardioverter defibrillator', 'defibrillator',
        'cardiac resynchronization therapy', 'resynchronization', 'septal myectomy', 'myectomy',
        'septal reduction therapy', 'alcohol septal ablation', 'percutaneous coronary intervention', 'percutaneous intervention',
        'coronary artery bypass graft', 'cabg', 'pci', 'icd', 'crt', 'srt', 'asa', 'fibrinolytic therapy', 'reperfusion strategy',
        'haematopoietic stem cell transplantation', 'stem cell transplantation', 'hsct', 'radiotherapy', 'radiation therapy'
      ];

      // 2. Clinical Evaluation, Symptoms, Quality of Life, Decisions, Surveillance (Vivid Cobalt Blue)
      const actions = [
        'оценке симптомов', 'оценка симптомов', 'оценки симптомов', 'симптомов', 'симптомы',
        'исходной оценке риска и мониторингу', 'исходной оценке риска', 'исходная оценка риска', 'оценке риска и мониторингу', 'оценке риска', 'мониторингу', 'мониторинг', 'наблюдению', 'наблюдение',
        'первичная профилактика', 'первичной профилактике', 'первичной профилактики',
        'вторичная профилактика', 'вторичной профилактике', 'вторичной профилактики',
        'контролю частоты сердечных сокращений', 'контроль частоты сердечных сокращений', 'контроля частоты сердечных сокращений', 'контролю ритма', 'контроль ритма', 'удержания синусового ритма',
        'пациентоориентированной помощи и обучению пациентов', 'пациентоориентированной помощи', 'обучению пациентов',
        'качеству жизни', 'качества жизни', 'улучшению опыта', 'опыта и качества жизни',
        'совместному принятию решений', 'совместного принятия решений', 'психологической поддержке', 'психологической поддержки',
        'скринингу семей', 'скрининга семей', 'динамическому наблюдению', 'диспансерному наблюдению', 'плановому наблюдению',
        'физическим нагрузкам', 'физической активности', 'занятиям спортом', 'спорту', 'соревновательному спорту',
        'репродуктивным вопросам', 'беременности и родам', 'беременности', 'контрацепции',
        'baseline risk assessment and monitoring', 'baseline risk assessment', 'risk assessment and monitoring', 'monitoring', 'surveillance',
        'primary prevention', 'secondary prevention',
        'symptom evaluation', 'evaluation of symptoms', 'symptoms',
        'heart rate control', 'rate control', 'rhythm control', 'maintenance of sinus rhythm',
        'patient-centred care', 'patient education', 'patient experience', 'quality of life',
        'shared decision-making', 'psychological support', 'family screening', 'routine follow-up', 'follow-up',
        'exercise recommendations', 'exercise and sports', 'sports', 'competitive sport',
        'reproductive issues', 'pregnancy', 'contraception'
      ];

      // 3. Risk Assessment, Bleeding, Stroke, Sudden Death, Cardiotoxicity (Crimson / Coral Red)
      const risks = [
        'кардиоваскулярной токсичности', 'сердечно-сосудистой токсичности', 'кардиотоксичности', 'кардиотоксичность', 'токсичности', 'токсичность',
        'кардиальной дисфункции', 'кардиальная дисфункция', 'дисфункции левого желудочка', 'дисфункция левого желудочка',
        'факторов риска', 'факторам риска', 'факторы риска', 'фактор риска',
        'тромбоэмболического риска', 'тромбоэмболический риск', 'тромбоэмболии', 'тромбоэмболических осложнений',
        'риска кровотечений', 'риск кровотечений', 'риску кровотечений', 'кровотечений', 'кровотечения',
        'профилактике инсульта', 'профилактики инсульта', 'инсульта', 'инсульт', 'инфаркта миокарда', 'инфаркт миокарда',
        'внезапной сердечной смерти', 'внезапной смерти', 'остановке сердца', 'остановки сердца', 'всс',
        'кардиогенного шока', 'кардиогенный шок', 'сердечной недостаточности', 'сердечная недостаточность', 'сн',
        'синдром такоцубо', 'синдрома такоцубо', 'удлинение qtc', 'удлинения qtc', 'миокардит', 'миокардита',
        'венозных тромбоэмболических осложнений', 'втэо',
        'cardiovascular toxicity', 'cardiac toxicity', 'cardiotoxicity', 'cv toxicity',
        'cardiac dysfunction', 'left ventricular dysfunction', 'ctrcd',
        'risk factor management', 'risk factors', 'risk factor', 'risk stratification',
        'thromboembolic risk', 'thromboembolism', 'bleeding risk', 'bleeding', 'major bleeding',
        'stroke prevention', 'stroke', 'myocardial infarction',
        'sudden cardiac death', 'sudden death', 'cardiac arrest', 'scd',
        'cardiogenic shock', 'heart failure', 'hf', 'takotsubo syndrome', 'takotsubo', 'myocarditis', 'qtc prolongation',
        'venous thromboembolism', 'vte'
      ];

      // 4. Pharmacotherapy & Critical Drug Classes (Emerald Green)
      const pharmacology = [
        'оральной антикоагулянтной терапии', 'оральной антикоагулянтной', 'оральных антикоагулянтов', 'оральным антикоагулянтам',
        'пероральная антикоагулянтная терапия', 'пероральных антикоагулянтов', 'пероральной антикоагулянтной',
        'антикоагулянтной терапии', 'антикоагулянтной', 'антикоагулянты', 'антикоагулянтов', 'антикоагуляция',
        'комбинации антиагрегантов с антикоагулянтами', 'комбинации антиагрегантов', 'антиагрегантов', 'антиагреганты', 'двойной антитромбоцитарной терапии', 'датт',
        'антиаритмическим препаратам', 'антиаритмических препаратов', 'антиаритмической терапии', 'антиаритмических средств',
        'бета-блокаторы', 'бета-блокаторов', 'бета-блокаторами', 'верапамил', 'дилтиазем', 'дизопирамид', 'мавакамтен',
        'ингибиторы апф', 'сакубитрил/валсартан', 'арни', 'дапаглифлозин', 'эмпаглифлозин', 'статины', 'статинов', 'ноак', 'доак', 'авк', 'нмг',
        'антрациклинами', 'антрациклины', 'доксорубицин', 'дексразоксан', 'липосомальные антрациклины',
        'таргетной терапии против her2', 'таргетной терапии her2', 'ингибиторами her2',
        'фторпиримидинами', 'фторпиримидины', '5-фторурацил', 'капецитабин',
        'ингибиторами фактора роста эндотелия сосудов', 'ингибиторами vegf', 'ингибиторы vegf', 'бевацизумаб', 'рамуцирумаб',
        'ингибиторов тирозинкиназы bcr-abl', 'ингибиторов bcr-abl', 'ингибиторами btk', 'ингибиторы btk', 'ибрутиниб',
        'ингибиторами протеасом', 'бортезомиб', 'карфилзомиб', 'иксазомиб',
        'ингибиторами raf и mek', 'ингибиторами raf', 'ингибиторами mek', 'вемурафениб', 'дабрафениб', 'траметиниб', 'кобиметиниб',
        'ингибиторами иммунных контрольных точек', 'иммунотерапии', 'иммунотерапия',
        'андроген-депривационной терапии', 'андроген-депривационной', 'антагонисты гнрг', 'агонисты гнрг',
        'эндокринной терапии', 'гормональной терапии', 'тамоксифен', 'ингибиторы ароматазы',
        'ингибиторами cdk4/6', 'ингибиторы cdk4/6', 'рибоциклиб', 'палбоциклиб', 'абемациклиб',
        'ингибиторов alk и egfr', 'ингибиторами alk', 'ингибиторами egfr', 'осимертиниб', 'кризотиниб', 'бригатиниб', 'лорлатиниб',
        'карфилзомиб', 'бортезомиб', 'кортикостероиды', 'метилпреднизолон', 'преднизолон',
        'combining antiplatelet drugs with anticoagulants', 'antiplatelet drugs', 'antiplatelet', 'dapt',
        'oral anticoagulation', 'anticoagulation in patients', 'anticoagulation', 'anticoagulants', 'noac', 'doac', 'vka', 'lmwh',
        'antiarrhythmic drugs', 'antiarrhythmic', 'antiarrhythmics',
        'beta-blockers', 'beta-blocker', 'verapamil', 'diltiazem', 'disopyramide', 'mavacamten',
        'ace inhibitors', 'sacubitril/valsartan', 'arni', 'sglt2 inhibitors', 'dapagliflozin', 'empagliflozin', 'statins',
        'anthracyclines', 'anthracycline chemotherapy', 'anthracycline', 'doxorubicin', 'dexrazoxane', 'liposomal anthracyclines',
        'her2-targeted therapies', 'her2-targeted', 'anti-her2',
        'fluoropyrimidines', 'fluoropyrimidine therapy', '5-fluorouracil', 'capecitabine',
        'vascular endothelial growth factor inhibitors', 'vegf inhibitors', 'vegfi', 'bevacizumab', 'ramucirumab',
        'bcr-abl tyrosine kinase inhibitors', 'bcr-abl tki', 'btk inhibitors', 'btk inhibitor', 'ibrutinib',
        'proteasome inhibitors', 'bortezomib', 'carfilzomib', 'ixazomib',
        'raf and mek inhibitors', 'raf inhibitors', 'mek inhibitors', 'vemurafenib', 'dabrafenib', 'trametinib', 'cobimetinib',
        'immune checkpoint inhibitors', 'ici therapy', 'immunotherapy',
        'androgen deprivation therapy', 'adt', 'gnrh antagonist', 'gnrh agonist',
        'endocrine therapy', 'tamoxifen', 'aromatase inhibitors',
        'cyclin-dependent kinase 4/6', 'cdk4/6 inhibitor', 'ribociclib', 'palbociclib', 'abemaciclib',
        'alk inhibitors', 'egfr inhibitors', 'osimertinib', 'crizotinib', 'brigatinib', 'lorlatinib',
        'corticosteroids', 'methylprednisolone', 'prednisolone'
      ];

      // 5. Diagnostics, Imaging, ECG, Biomarkers & Genetics (Purple/Indigo)
      const diagnostics = [
        'диагностической оценке', 'диагностическая оценка', 'диагностике и лечению', 'диагностике', 'диагностика', 'диагностический поиск',
        'эхокардиографии', 'эхокардиография', 'эхокардиографическая', 'эхокг', 'ттэхкг', 'чпэхкг', 'ттэ',
        'мрт сердца', 'мрт', 'кт-коронарографии', 'кт-коронарография', 'кт', 'коронарография', 'кава-фильтр',
        'сцинтиграфии', 'сцинтиграфия', 'биопсии миокарда', 'эндомиокардиальной биопсии', 'эмб',
        'электрокардиографических признаков', 'электрокардиограмме', 'электрокардиография', 'экг', 'холтеровскому мониторированию', 'холтер',
        'лабораторных тестов', 'лабораторным исследованиям', 'лабораторные тесты',
        'сердечные биомаркеры', 'биомаркеры', 'натрийуретические пептиды', 'натрийуретических пептидов',
        'генетическое тестирование', 'генетического тестирования', 'генетическому тестированию', 'генетическое консультирование', 'генетического консультирования',
        'diagnostic evaluation', 'diagnosis and management', 'diagnosis', 'diagnostic work-up',
        'echocardiography', 'echocardiographic', 'echo', 'tte', 'toe', 'tee',
        'cardiac magnetic resonance', 'cmr', 'computed tomography', 'ct coronary angiography', 'coronary angiography', 'ccta', 'ct',
        'bone-tracer scintigraphy', 'scintigraphy', 'endomyocardial biopsy', 'emb',
        'electrocardiographic features', 'electrocardiogram', 'ecg', 'holter monitoring', 'holter',
        'cardiac biomarkers', 'serum biomarkers', 'biomarkers',
        'laboratory tests', 'genetic testing', 'genetic counselling', 'cascade testing',
        'cha2ds2-vasc', 'has-bled', 'hcm risk-scd', 'score2-op', 'score2', 'nt-probnp', 'bnp', 'troponin', 'тропонин', 'ctn', 'np', 'gls'
      ];

      // 6. Core Diseases, Specific Nosologies, Cellular Types (Cyan/Teal accent with subtle underline)
      const nosologies = [
        'фибрилляции предсердий', 'фибрилляция предсердий', 'фибрилляцией предсердий', 'триггер-индуцированной фибрилляции предсердий', 'послеоперационной фибрилляции предсердий',
        'трепетании предсердий', 'трепетания предсердий', 'трепетание предсердий',
        'кардиомиопатиями', 'кардиомиопатий', 'кардиомиопатии', 'кардиомиопатия', 'кардиомиопатию',
        'гипертрофической кардиомиопатии', 'гипертрофической кардиомиопатия', 'гипертрофическая кардиомиопатия',
        'дилатационной кардиомиопатией', 'дилатационной кардиомиопатии', 'дилатационная кардиомиопатия',
        'аритмогенной кардиомиопатией', 'аритмогенной кардиомиопатии', 'аритмогенная кардиомиопатия',
        'рестриктивной кардиомиопатией', 'рестриктивной кардиомиопатии', 'рестриктивная кардиомиопатия',
        'недилатированной кардиомиопатией', 'недилатированной кардиомиопатии', 'недилатированная кардиомиопатия',
        'острого коронарного синдрома', 'острым коронарным синдромом', 'острый коронарный синдром', 'остром коронарном синдроме',
        'ишемической болезни сердца', 'ишемическая болезнь сердца', 'ибс',
        'врожденными пороками сердца', 'врожденных пороках сердца', 'врожденные пороки сердца',
        'амилоидоз сердца', 'амилоидоза сердца', 'амилоидозе сердца', 'болезни фабри', 'болезнь фабри',
        'эмболическим инсультом из неустановленного источника',
        'раке молочной железы', 'рак молочной железы', 'раком молочной железы', 'рмж',
        'раке предстательной железы', 'рак предстательной железы', 'рака предстательной железы', 'рпж',
        'множественной миеломы', 'множественная миелома', 'множественной миеломе', 'мм',
        'car-t клеточную терапию', 'car-t терапия', 'car-t клеточной', 'car-t', 'лимфоциты til', 'til',
        'кардиоонкология', 'кардиоонкологии',
        'atrial fibrillation', 'post-operative af', 'trigger-induced af', 'atrial flutter',
        'cardiomyopathies', 'cardiomyopathy',
        'hypertrophic cardiomyopathy', 'dilated cardiomyopathy', 'arrhythmogenic right ventricular cardiomyopathy',
        'restrictive cardiomyopathy', 'non-dilated left ventricular cardiomyopathy',
        'acute coronary syndromes', 'acute coronary syndrome', 'coronary artery disease', 'cad',
        'congenital heart disease', 'adult congenital heart disease',
        'cardiac amyloidosis', 'fabry disease', 'embolic stroke of unknown source', 'esus',
        'breast cancer', 'prostate cancer', 'multiple myeloma', 'chimeric antigen receptor t cell', 'car-t',
        'tumour-infiltrating lymphocytes', 'cardio-oncology',
        'ГКМП', 'ДКМП', 'АКПЖ', 'РКМП', 'ННКМПЛЖ', 'НДЛЖКМП', 'ОКС', 'ВЗПС', 'ВПС', 'ФП', 'ТП', 'ИБС',
        'HCM', 'DCM', 'ARVC', 'RCM', 'NDLVC', 'ACS', 'ACHD', 'AF', 'AFL', 'CAD', 'CVD', 'MM', 'BC', 'TKI', 'VEGFi', 'ICI'
      ];

      // Multi-pass safe replacement using tokens
      const tokenMap = [];
      function tokenizeAndApply(source, terms, cssClass) {
        if (!terms || terms.length === 0) return source;
        const sorted = [...terms].sort((a, b) => b.length - a.length);
        const regexStr = '(?<![a-zA-Zа-яА-Я0-9_])(' + sorted.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|') + ')(?![a-zA-Zа-яА-Я0-9_])';
        const re = new RegExp(regexStr, 'gi');
        return source.replace(re, (match) => {
          const tokenId = `___GT_TOKEN_${tokenMap.length}___`;
          tokenMap.push(`<span class="${cssClass}">${match}</span>`);
          return tokenId;
        });
      }

      // Order of precedence: longer specific phrases first (Interventions -> Actions -> Risks -> Pharma -> Diagnostics -> Nosologies)
      s = tokenizeAndApply(s, interventions, 'gt-hl-device');
      s = tokenizeAndApply(s, actions, 'gt-hl-action');
      s = tokenizeAndApply(s, risks, 'gt-hl-risk');
      s = tokenizeAndApply(s, pharmacology, 'gt-hl-pharma');
      s = tokenizeAndApply(s, diagnostics, 'gt-hl-diag');
      s = tokenizeAndApply(s, nosologies, 'gt-hl-disease');

      // Restore tokens back to HTML spans
      for (let i = tokenMap.length - 1; i >= 0; i--) {
        s = s.replace(`___GT_TOKEN_${i}___`, tokenMap[i]);
      }

      return s;
    }

    async showCatalog() {
      this.activeTable = null;
      this.selectedGuidelineId = null;
      this.updateUiLang();
      const titleEl = document.getElementById('gt-header-title');
      const badgeEl = document.getElementById('gt-header-badge');
      const container = document.getElementById('gt-view-container');
      const catBtn = document.getElementById('gt-btn-catalog');
      const bookNav = document.getElementById('gt-book-nav');
      if (catBtn) catBtn.style.display = 'none';
      if (bookNav) bookNav.style.display = 'none';

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

      // Helper to identify topic icon
      const getTopicIcon = (id) => {
        if (id.includes('pe')) return '🫁'; // Pulmonary Embolism
        if (id.includes('af')) return '⚡'; // Atrial Fibrillation / Arrhythmia
        if (id.includes('endo')) return '🛡️'; // Endocarditis / Valve Infection
        if (id.includes('revasc')) return '🩺'; // Revascularization / Stents / CABG
        if (id.includes('cardioonc')) return '🎗️'; // Cardio-Oncology
        if (id.includes('cmp')) return '🧬'; // Cardiomyopathies / Genetics
        if (id.includes('achd')) return '🫀'; // Adult Congenital Heart Disease
        if (id.includes('acs')) return '🚨'; // Acute Coronary Syndromes
        if (id.includes('ccs')) return '💓'; // Chronic Coronary Syndromes
        if (id.includes('valve') || id.includes('vhd')) return '❤️‍🩹'; // Valvular Heart Disease
        if (id.includes('hf')) return '💧'; // Heart Failure
        return '📑';
      };

      // Helper to format concise key title (e.g. "2024 ESC AF" / "2024 ESC ФП", "2019 ESC Pulmonary Embolism" / "2019 ESC ТЭЛА")
      const getKeyTitle = (g, isRu) => {
        const yr = g.year || '';
        const soc = (g.society || 'ESC').split('/')[0].trim();
        const id = g.id.toLowerCase();
        let topic = '';

        if (isRu) {
          if (id.includes('vhd') || id.includes('valve')) topic = 'Пороки сердца';
          else if (id.includes('pe')) topic = 'ТЭЛА';
          else if (id.includes('af')) topic = 'ФП';
          else if (id.includes('endo')) topic = 'Эндокардит';
          else if (id.includes('revasc')) topic = 'Реваскуляризация';
          else if (id.includes('cardioonc')) topic = 'Кардиоонкология';
          else if (id.includes('cmp')) topic = 'Кардиомиопатии';
          else if (id.includes('achd')) topic = 'ВПС у взрослых';
          else if (id.includes('acs')) topic = 'ОКС';
          else if (id.includes('ccs')) topic = 'ХКС';
          else if (id.includes('hf')) topic = 'СН';
          else if (g.shortTitle?.ru) topic = g.shortTitle.ru.replace(/^(ESC|AHA|ACC|EACTS)\s*/i, '').replace(/\s*\d{4}$/, '').trim();
          else topic = g.id;
        } else {
          if (id.includes('vhd') || id.includes('valve')) topic = 'Valve Disease';
          else if (id.includes('pe')) topic = 'Pulmonary Embolism';
          else if (id.includes('af')) topic = 'AF';
          else if (id.includes('endo')) topic = 'Endocarditis';
          else if (id.includes('revasc')) topic = 'Revascularization';
          else if (id.includes('cardioonc')) topic = 'Cardio-Oncology';
          else if (id.includes('cmp')) topic = 'Cardiomyopathies';
          else if (id.includes('achd')) topic = 'ACHD';
          else if (id.includes('acs')) topic = 'ACS';
          else if (id.includes('ccs')) topic = 'CCS';
          else if (id.includes('hf')) topic = 'Heart Failure';
          else if (g.shortTitle?.en) topic = g.shortTitle.en.replace(/^(ESC|AHA|ACC|EACTS)\s*/i, '').replace(/\s*\d{4}$/, '').trim();
          else topic = g.id;
        }

        return `${yr} ${soc} ${topic}`;
      };

      // Guidelines are pre-sorted by year descending in index
      let html = `<div class="gt-catalog-grid" id="gt-guidelines-list">`;
      guidelines.forEach(g => {
        const isRu = this.currentLang === 'ru';
        const rawTitle = g.title ? (g.title[this.currentLang] || g.title.en) : g.id;
        const keyTitle = getKeyTitle(g, isRu);
        const topicIcon = getTopicIcon(g.id);
        const tablesText = isRu ? `${g.tablesCount} табл.` : `${g.tablesCount} tables`;

        // Society theme and logo
        const socUpper = (g.society || 'ESC').toUpperCase();
        const isAmerican = socUpper.includes('AHA') || socUpper.includes('ACC');
        const societyClass = isAmerican ? 'gt-society-aha' : 'gt-society-esc';
        const logoPath = isAmerican ? 'assets/img/aha-logo.png' : 'assets/img/esc-logo.png';
        const logoAlt = isAmerican ? 'AHA Logo' : 'ESC Logo';

        // Neon Year style class
        const yearClass = `gt-year-${g.year || 'default'}`;

        html += `
          <div class="gt-guideline-card ${societyClass}" data-guideline-id="${g.id}">
            <span class="gt-card-topic-icon" title="${keyTitle}">${topicIcon}</span>
            <div class="gt-guideline-top">
              <span class="gt-year-badge ${yearClass}">${g.year}</span>
              <span class="gt-count-badge">📊 ${tablesText}</span>
            </div>
            <div class="gt-guideline-brand">
              <img src="${logoPath}" alt="${logoAlt}" class="gt-society-logo" onerror="this.style.display='none'">
              <span style="font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">${g.society || 'ESC'}</span>
            </div>
            <div class="gt-guideline-key-title">${keyTitle}</div>
            <div class="gt-guideline-sub" title="${rawTitle}">${rawTitle}</div>
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
      const bookNav = document.getElementById('gt-book-nav');
      if (catBtn) catBtn.style.display = 'inline-flex';
      if (bookNav) bookNav.style.display = 'none';

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
          <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap;">
            <button class="gt-breadcrumb-btn" id="gt-btn-back-guidelines">
              ← ${isRu ? 'Все руководства' : 'All Guidelines'}
            </button>
            <span style="color:var(--gt-border)">|</span>
            <button class="gt-btn gt-btn-primary" id="gt-btn-read-book" title="${isRu ? 'Читать таблицы как книгу по порядку' : 'Read tables like a book sequentially'}">
              📖 ${isRu ? 'Листать таблицы (режим книги)' : 'Read as Book'}
            </button>
          </div>
          <span style="font-size:0.85rem; color:var(--gt-muted); font-weight:600;">
            ${items.length} ${isRu ? 'таблиц(ы)' : 'tables'}
          </span>
        </div>
        <div class="gt-catalog-grid" id="gt-catalog-list">
      `;

      items.forEach(item => {
        const tableLabel = isRu ? `Табл. ${item.number}` : `Table ${item.number}`;
        const defaultTitle = isRu ? `Таблица ${item.number}` : `Table ${item.number}`;
        const rawTitle = item.title ? (item.title[this.currentLang] || item.title.en) : defaultTitle;
        const highlightedTitle = this.highlightClinicalKeywords(rawTitle);
        html += `
          <div class="gt-card" data-table-id="${item.id}">
            <div class="gt-card-badge">${tableLabel} • ${item.type}</div>
            <div class="gt-card-title">${highlightedTitle}</div>
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

      const readBookBtn = container.querySelector('#gt-btn-read-book');
      if (readBookBtn && items.length > 0) {
        readBookBtn.addEventListener('click', () => {
          this.loadAndShowTable(items[0].id);
        });
      }

      container.querySelectorAll('.gt-card').forEach(card => {
        card.addEventListener('click', () => {
          this.loadAndShowTable(card.dataset.tableId);
        });
      });
    }

    async flipTable(direction) {
      if (!this.activeTable || !this.selectedGuidelineId) return;
      const index = await this.loadIndex();
      const guidelineTables = (index?.tables || []).filter(t => t.guidelineId === this.selectedGuidelineId);
      if (guidelineTables.length <= 1) return;

      const currentIdx = guidelineTables.findIndex(t => t.id === this.activeTable.id);
      if (currentIdx === -1) return;

      let nextIdx = currentIdx + direction;
      if (nextIdx < 0) nextIdx = guidelineTables.length - 1; // cycle or clamp
      if (nextIdx >= guidelineTables.length) nextIdx = 0;

      await this.loadAndShowTable(guidelineTables[nextIdx].id);
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

      // Update book flip navigation controls
      this.updateBookNav();

      this.renderTable(table);
    }

    async updateBookNav() {
      const bookNav = document.getElementById('gt-book-nav');
      const pageInfo = document.getElementById('gt-book-page-info');
      if (!bookNav || !pageInfo) return;

      if (!this.activeTable || !this.selectedGuidelineId) {
        bookNav.style.display = 'none';
        return;
      }

      const index = await this.loadIndex();
      const guidelineTables = (index?.tables || []).filter(t => t.guidelineId === this.selectedGuidelineId);
      if (guidelineTables.length <= 1) {
        bookNav.style.display = 'none';
        return;
      }

      const currentIdx = guidelineTables.findIndex(t => t.id === this.activeTable.id);
      const isRu = this.currentLang === 'ru';
      bookNav.style.display = 'inline-flex';
      pageInfo.textContent = `${currentIdx + 1} / ${guidelineTables.length}`;
      pageInfo.title = isRu ? `Таблица ${currentIdx + 1} из ${guidelineTables.length} (стрелки клавиатуры ← / →)` : `Table ${currentIdx + 1} of ${guidelineTables.length} (keyboard arrows ← / →)`;
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
      const highlightedTitle = this.highlightClinicalKeywords(tTitle);
      titleEl.innerHTML = `${highlightedTitle} <span style="font-size:0.85em; opacity:0.75; font-weight:normal;">(${tablePrefix})</span>`;

      // Render Table DOM
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'gt';
      tableWrapper.id = `gt-rendered-${table.id}`;

      let bodyHtml = `
        <div class="gt-head">
          <span class="gt-guideline">${gTitle} — ${tablePrefix}</span>
          <div class="gt-title">${highlightedTitle}</div>
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

      // Book pagination footer (Next / Prev table in this guideline)
      bodyHtml += `
        <div class="gt-book-footer-bar">
          <button class="gt-btn gt-btn-prev-table" id="gt-footer-btn-prev">
            ← ${isRu ? 'Предыдущая таблица' : 'Previous Table'}
          </button>
          <button class="gt-btn" id="gt-footer-btn-catalog">
            📚 ${isRu ? 'Все таблицы' : 'All Tables'}
          </button>
          <button class="gt-btn gt-btn-primary gt-btn-next-table" id="gt-footer-btn-next">
            ${isRu ? 'Следующая таблица' : 'Next Table'} →
          </button>
        </div>
      `;

      tableWrapper.innerHTML = bodyHtml;
      container.innerHTML = '';
      container.appendChild(tableWrapper);

      // Attach book footer events
      const footPrev = tableWrapper.querySelector('#gt-footer-btn-prev');
      const footNext = tableWrapper.querySelector('#gt-footer-btn-next');
      const footCat = tableWrapper.querySelector('#gt-footer-btn-catalog');
      if (footPrev) footPrev.addEventListener('click', () => this.flipTable(-1));
      if (footNext) footNext.addEventListener('click', () => this.flipTable(1));
      if (footCat) footCat.addEventListener('click', () => this.handleBackNavigation());

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
