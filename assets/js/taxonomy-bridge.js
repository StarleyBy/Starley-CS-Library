/**
 * Starley Medical Library - Taxonomy Bridge Module
 * Connects book chapters and sections (<details> / headings) with clinical quiz taxonomy.
 * 
 * Features:
 * 1. Multi-Topic & Multi-Disciplinary Chapter Level Support:
 *    - Supports chapters spanning multiple topics and disciplines.
 *    - Renders discipline badges, primary topic, and interactive topic chips with question counts.
 *    - Provides one-click combined chapter quizzes (e.g. ?topic=t1,t2,t3).
 *    - Auto-aggregates topics from subsections tagged with data-topic.
 * 2. Strict Language (i18n):
 *    - Only 'russian' edition displays Russian text and Russian topic names.
 *    - All other editions ('original', 'starley', 'hebrew') strictly display English.
 * 3. Strict Matching (No Noise):
 *    - Uses explicit mapping (STARLEY_BOOK_TAXONOMY_MAP) for the 10 core textbooks.
 *    - If unmapped / non-matching, DO NOT render fake banners.
 */

(function (window) {
    const TaxonomyBridge = {
        data: null,
        bookMap: null,
        initialized: false,

        pluralRu(n, one, two, five) {
            const mod10 = n % 10;
            const mod100 = n % 100;
            if (mod100 >= 11 && mod100 <= 19) return five;
            if (mod10 === 1) return one;
            if (mod10 >= 2 && mod10 <= 4) return two;
            return five;
        },

        normalizePath(p) {
            if (!p) return '';
            return p.replace(/\\/g, '/').replace(/^\.?\//, '').replace(/\/+$/, '');
        },

        normalizeChapter(c) {
            if (!c) return '';
            return c.replace(/\.md$/, '').trim();
        },

        async init() {
            if (this.initialized && this.data) return this.data;

            if (window.STARLEY_TAXONOMY_SUMMARY) {
                this.data = window.STARLEY_TAXONOMY_SUMMARY;
                this.bookMap = this.data.bookMap || window.STARLEY_BOOK_TAXONOMY_MAP || {};
                this.initialized = true;
                return this.data;
            }

            try {
                const root = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
                const res = await fetch(`${root}quiz/taxonomy-summary.json`);
                if (res.ok) {
                    this.data = await res.json();
                    this.bookMap = this.data.bookMap || window.STARLEY_BOOK_TAXONOMY_MAP || {};
                    this.initialized = true;
                }
            } catch (e) {
                console.warn('[TaxonomyBridge] Failed to load taxonomy summary:', e);
            }
            return this.data;
        },

        ensureData() {
            if (!this.data && window.STARLEY_TAXONOMY_SUMMARY) {
                this.data = window.STARLEY_TAXONOMY_SUMMARY;
                this.bookMap = this.data.bookMap || window.STARLEY_BOOK_TAXONOMY_MAP || {};
                this.initialized = true;
            }
            if (!this.bookMap && window.STARLEY_BOOK_TAXONOMY_MAP) {
                this.bookMap = window.STARLEY_BOOK_TAXONOMY_MAP;
            }
            return this.data;
        },

        getTopic(topicId) {
            this.ensureData();
            if (!this.data || !this.data.topics) return null;
            return this.data.topics[topicId] || null;
        },

        getDiscipline(disciplineId) {
            this.ensureData();
            if (!this.data || !this.data.disciplines) return null;
            return this.data.disciplines[disciplineId] || null;
        },

        getTag(tagId) {
            this.ensureData();
            if (!this.data || !this.data.tags) return null;
            return this.data.tags[tagId] || null;
        },

        /**
         * Get verified topic IDs for a chapter from declarative book map.
         * Returns an array of topic IDs.
         */
        getTopicsForChapter(bookPath, chapterId) {
            this.ensureData();
            if (!this.bookMap) return [];

            const cleanBook = this.normalizePath(bookPath);
            const cleanChapter = this.normalizeChapter(chapterId);

            let rawVal = null;
            if (this.bookMap[cleanBook] && this.bookMap[cleanBook][cleanChapter]) {
                rawVal = this.bookMap[cleanBook][cleanChapter];
            } else {
                for (const [mappedBook, chMap] of Object.entries(this.bookMap)) {
                    const cleanMapped = this.normalizePath(mappedBook);
                    if (cleanMapped === cleanBook || cleanMapped.endsWith(cleanBook) || cleanBook.endsWith(mappedBook)) {
                        if (chMap[cleanChapter]) {
                            rawVal = chMap[cleanChapter];
                            break;
                        }
                    }
                }
            }

            if (!rawVal) return [];
            return Array.isArray(rawVal) ? [...rawVal] : [rawVal];
        },

        /**
         * Process a reader container (<article id="content-area">) and attach quiz banners
         */
        attachBannersToDetails(container, context = {}) {
            if (!container) return;
            this.ensureData();

            // Remove any existing banners or widgets to prevent duplicates when switching editions
            container.querySelectorAll('.chapter-quiz-hero-banner, .section-quiz-widget, .summary-quiz-pill').forEach(el => el.remove());

            // 1. Determine Edition & Strict Language
            const params = new URLSearchParams(window.location.search);
            const edition = context.edition || params.get('edition') || (document.documentElement.lang === 'ru' ? 'russian' : 'original');
            const isRussian = (edition === 'russian');

            const bookPath = context.bookPath || params.get('book') || '';
            const chapterId = context.chapterId || params.get('chapter') || '';

            // 2. Attach Chapter-Level Hero Banner (under H1) with Multi-Topic & Multi-Discipline support
            this.attachChapterHeroBanner(container, { bookPath, chapterId, edition, isRussian });

            // 3. Attach Details Subsections ONLY if explicit data-topic is present
            this.attachDetailsWidgets(container, { isRussian });
        },

        attachChapterHeroBanner(container, { bookPath, chapterId, edition, isRussian }) {
            const h1 = container.querySelector('h1');

            // 1. Collect all topics for this chapter:
            // Priority A: Book map
            let topicIds = this.getTopicsForChapter(bookPath, chapterId);

            // Priority B: Container / H1 dataset
            const containerTopics = container.dataset.topics || (h1 && h1.dataset.topics);
            if (containerTopics) {
                containerTopics.split(',').forEach(t => {
                    const c = t.trim();
                    if (c && !topicIds.includes(c)) topicIds.push(c);
                });
            }
            const singleTopic = container.dataset.topic || (h1 && h1.dataset.topic);
            if (singleTopic && !topicIds.includes(singleTopic)) {
                topicIds.unshift(singleTopic);
            }

            // Priority C: Auto-discover from subsections with explicit data-topic inside this chapter!
            const detailsWithTopics = container.querySelectorAll('details[data-topic]');
            detailsWithTopics.forEach(d => {
                const dt = d.dataset.topic;
                if (dt) {
                    dt.split(',').forEach(x => {
                        const c = x.trim();
                        if (c && !topicIds.includes(c)) topicIds.push(c);
                    });
                }
            });

            // STRICT: If no topic is mapped or annotated, do NOT show a fake banner
            if (topicIds.length === 0) return;

            // Resolve valid topic objects with counts
            const topicInfos = topicIds
                .map(id => this.getTopic(id))
                .filter(t => t && (t.count > 0 || !this.bookMap));

            if (topicInfos.length === 0) return;

            // Group and extract unique disciplines
            const disciplineMap = new Map();
            topicInfos.forEach(t => {
                if (t.disciplineId && !disciplineMap.has(t.disciplineId)) {
                    const disc = this.getDiscipline(t.disciplineId);
                    disciplineMap.set(t.disciplineId, {
                        id: t.disciplineId,
                        icon: (disc && disc.icon) || t.disciplineIcon || '🫀',
                        name: isRussian 
                            ? ((disc && disc.nameRu) || t.disciplineNameRu || t.disciplineId)
                            : ((disc && disc.nameEn) || t.disciplineNameEn || t.disciplineId)
                    });
                }
            });
            const disciplines = Array.from(disciplineMap.values());

            // Compute total question count across all topics
            const totalQ = topicInfos.reduce((sum, t) => sum + (t.count || 0), 0);
            if (totalQ === 0) return;

            const primaryTopic = topicInfos[0];
            const primaryTitle = isRussian 
                ? (primaryTopic.nameRu || primaryTopic.id).split('(')[0].trim()
                : (primaryTopic.nameEn || primaryTopic.id).split('(')[0].trim();
            const primaryDiscIcon = disciplines[0]?.icon || primaryTopic.disciplineIcon || '🫀';

            const pillText = isRussian ? 'Клинический тест' : 'Clinical Quiz';

            // Disciplines header bar
            const disciplinesHtml = (disciplines.length > 0)
                ? `<div class="cqh-disciplines-bar">
                    ${disciplines.map(d => `<span class="cqh-disc-tag">${d.icon} ${d.name}</span>`).join(' • ')}
                  </div>`
                : '';

            // Multi-topic interactive chips
            let topicChipsHtml = '';
            if (topicInfos.length > 1) {
                topicChipsHtml = `<div class="cqh-topics-row">
                    ${topicInfos.map(t => {
                        const tName = isRussian 
                            ? (t.nameRu || t.id).split('(')[0].trim()
                            : (t.nameEn || t.id).split('(')[0].trim();
                        const tIcon = t.disciplineIcon || '🫀';
                        const titleAttr = isRussian 
                            ? `Тест: ${tName} (${t.count} вопр.)`
                            : `Quiz: ${tName} (${t.count} Q)`;
                        return `<a href="quiz.html?topic=${encodeURIComponent(t.id)}" target="_blank" class="cqh-topic-chip" title="${titleAttr}">
                            <span class="cqh-chip-icon">${tIcon}</span>
                            <span class="cqh-chip-name">${tName}</span>
                            <span class="cqh-chip-count">${t.count} Q</span>
                        </a>`;
                    }).join('')}
                </div>`;
            }

            // Description line
            const countDesc = (topicInfos.length > 1)
                ? (isRussian 
                    ? `<i class="fas fa-layer-group"></i> <strong>${totalQ}</strong> ${this.pluralRu(totalQ, 'вопрос', 'вопроса', 'вопросов')} в <strong>${topicInfos.length}</strong> ${this.pluralRu(topicInfos.length, 'теме', 'темах', 'темах')} этой главы`
                    : `<i class="fas fa-layer-group"></i> <strong>${totalQ}</strong> ${totalQ === 1 ? 'question' : 'questions'} across <strong>${topicInfos.length}</strong> chapter topics`)
                : (isRussian
                    ? `<i class="fas fa-check-circle"></i> <strong>${totalQ}</strong> ${this.pluralRu(totalQ, 'вопрос', 'вопроса', 'вопросов')} для закрепления материала этой главы`
                    : `<i class="fas fa-check-circle"></i> <strong>${totalQ}</strong> ${totalQ === 1 ? 'question' : 'questions'} to reinforce this chapter`);

            // Action button (links to all chapter topics simultaneously)
            const combinedTopicParam = topicInfos.map(t => encodeURIComponent(t.id)).join(',');
            const btnText = (topicInfos.length > 1)
                ? (isRussian ? 'Тесты по всей главе' : 'Full Chapter Quiz')
                : (isRussian ? 'Пройти тест' : 'Start Quiz');
            const btnTitle = (topicInfos.length > 1)
                ? (isRussian ? `Пройти все тесты по темам главы (${totalQ} вопр.)` : `Start quiz for all chapter topics (${totalQ} Q)`)
                : (isRussian ? `Начать тестирование по теме «${primaryTitle}»` : `Start quiz for "${primaryTitle}"`);

            const banner = document.createElement('div');
            banner.className = 'chapter-quiz-hero-banner' + (topicInfos.length > 1 ? ' has-multi-topics' : '');
            banner.dataset.topics = topicInfos.map(t => t.id).join(',');

            banner.innerHTML = `
                <div class="cqh-left">
                    <div class="cqh-icon">${primaryDiscIcon}</div>
                    <div class="cqh-content">
                        ${disciplinesHtml}
                        <div class="cqh-title">
                            <span class="cqh-pill">${pillText}</span>
                            <strong class="cqh-topic-heading">${primaryTitle}</strong>
                        </div>
                        <div class="cqh-desc">
                            ${countDesc}
                        </div>
                        ${topicChipsHtml}
                    </div>
                </div>
                <a href="quiz.html?topic=${combinedTopicParam}" target="_blank" class="cqh-btn" title="${btnTitle}">
                    <span>${btnText}</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            `;

            if (h1 && h1.parentNode) {
                h1.parentNode.insertBefore(banner, h1.nextSibling);
            } else if (container.firstChild) {
                container.insertBefore(banner, container.firstChild);
            } else {
                container.appendChild(banner);
            }
        },

        attachDetailsWidgets(container, { isRussian }) {
            const detailsElements = container.querySelectorAll('details.med-details, details');
            detailsElements.forEach(details => {
                // STRICT: Only process details that have an explicit data-topic attribute
                const topicId = details.dataset.topic;
                if (!topicId) return;

                const topicInfo = this.getTopic(topicId);
                if (!topicInfo) return;

                const qCount = topicInfo.count || 0;
                if (qCount === 0) return;

                const tagsStr = details.dataset.tags || '';
                const discIcon = topicInfo.disciplineIcon || '🫀';
                const topicTitle = isRussian 
                    ? (topicInfo.nameRu || topicId).split('(')[0].trim()
                    : (topicInfo.nameEn || topicId).split('(')[0].trim();

                const summary = details.querySelector('summary');
                if (summary && !summary.querySelector('.summary-quiz-pill')) {
                    const pill = document.createElement('span');
                    pill.className = 'summary-quiz-pill';
                    pill.title = isRussian ? `Связанные тесты: ${qCount} вопр.` : `Related Quizzes: ${qCount} Q`;
                    pill.innerHTML = `<i class="fas fa-brain"></i> ${qCount} Q`;
                    summary.appendChild(pill);
                }

                const contentDiv = details.querySelector('.details-content') || details;
                const widget = document.createElement('div');
                widget.className = 'section-quiz-widget';
                widget.dataset.topic = topicId;

                const tagListHtml = tagsStr ? tagsStr.split(',').map(tg => `<span class="sqw-tag">#${tg.trim()}</span>`).join(' ') : '';
                const pillLabel = isRussian ? '🧠 Клинический тест' : '🧠 Clinical Quiz';
                const questionsLabel = isRussian
                    ? `${qCount} ${this.pluralRu(qCount, 'вопрос', 'вопроса', 'вопросов')}`
                    : `${qCount} ${qCount === 1 ? 'question' : 'questions'}`;
                const btnLabel = isRussian ? 'Пройти тесты' : 'Start Quiz';
                const btnTitle = isRussian ? `Открыть квиз по теме «${topicTitle}»` : `Open quiz for "${topicTitle}"`;

                widget.innerHTML = `
                    <div class="sqw-left">
                        <div class="sqw-badge-icon">${discIcon}</div>
                        <div class="sqw-info">
                            <div class="sqw-topic-line">
                                <span class="sqw-pill">${pillLabel}</span>
                                <strong class="sqw-topic-name">${topicTitle}</strong>
                            </div>
                            <div class="sqw-sub-line">
                                <span class="sqw-count"><i class="fas fa-check-circle"></i> <strong>${qCount}</strong> ${questionsLabel.replace(qCount + ' ', '')}</span>
                                ${tagListHtml ? `<span class="sqw-tags">${tagListHtml}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <a href="quiz.html?topic=${encodeURIComponent(topicId)}" target="_blank" class="sqw-launch-btn" title="${btnTitle}">
                        <span>${btnLabel}</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                `;

                if (contentDiv.firstChild) {
                    contentDiv.insertBefore(widget, contentDiv.firstChild);
                } else {
                    contentDiv.appendChild(widget);
                }
            });
        }
    };

    window.TaxonomyBridge = TaxonomyBridge;

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => TaxonomyBridge.init());
        } else {
            TaxonomyBridge.init();
        }
    }
})(typeof window !== 'undefined' ? window : this);
