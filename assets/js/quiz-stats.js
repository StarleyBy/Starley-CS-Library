/**
 * Starley Medical Quiz - Analytics, Progression & RPG Stats Engine
 * 100-Tier Prestige Gamification, Clinical Analytics, Momentum and Accuracy Charts.
 */

(function(window) {
    'use strict';

    /* ==========================================================================
       RPG PROGRESSION & 10-TIER PRESTIGE SYSTEM (Lv.1 Resident to Lv.100 Unrivaled)
       ========================================================================== */

    const RPG_SYSTEM = {
        TIERS: [
            {
                id: 1,
                nameEn: 'Resident',
                nameRu: 'Ординатор',
                icon: '🥉',
                color: '#a8a29e',
                accent: '#f59e0b',
                titlesEn: [
                    'Resident Novice', 'Resident Initiate', 'Junior Resident', 'Floor Resident', 'ICU Resident',
                    'Trauma Resident', 'Senior Resident', 'Sub-I Resident', 'Pre-Chief Resident', 'Chief Resident'
                ],
                titlesRu: [
                    'Ординатор-стажер', 'Младший ординатор', 'Ординатор приемного', 'Палатный ординатор', 'Ординатор ОРИТ',
                    'Травма-ординатор', 'Старший ординатор', 'Суб-ординатор', 'Пре-шеф ординатор', 'Главный ординатор'
                ]
            },
            {
                id: 2,
                nameEn: 'Fellow',
                nameRu: 'Клинический феллоу',
                icon: '🧪',
                color: '#14b8a6',
                accent: '#2dd4bf',
                titlesEn: [
                    'Clinical Fellow', 'Surgical Registrar', 'Procedural Fellow', 'Acute Care Fellow', 'Interventionalist',
                    'Senior Registrar', 'Cardiopulmonary Fellow', 'Advanced Surgical Fellow', 'Certified Fellow', 'Distinguished Fellow'
                ],
                titlesRu: [
                    'Клинический феллоу', 'Хирургический регистратор', 'Процедурный феллоу', 'Феллоу неотложки', 'Интервенционист',
                    'Старший регистратор', 'Кардиопульмональный феллоу', 'Продвинутый феллоу', 'Сертифицированный феллоу', 'Заслуженный феллоу'
                ]
            },
            {
                id: 3,
                nameEn: 'Specialist',
                nameRu: 'Врач-специалист',
                icon: '🌿',
                color: '#10b981',
                accent: '#34d399',
                titlesEn: [
                    'Staff Physician', 'Associate Specialist', 'Clinical Specialist', 'Operative Specialist', 'Specialist Attending',
                    'Senior Specialist', 'Expert Specialist', 'Lead Specialist', 'Master Specialist', 'Honored Specialist'
                ],
                titlesRu: [
                    'Штатный врач', 'Ассоциированный специалист', 'Клинический специалист', 'Операционный специалист', 'Лечащий специалист',
                    'Старший специалист', 'Эксперт-специалист', 'Ведущий специалист', 'Мастер-специалист', 'Почетный специалист'
                ]
            },
            {
                id: 4,
                nameEn: 'Senior Consultant',
                nameRu: 'Старший консультант',
                icon: '💎',
                color: '#3b82f6',
                accent: '#60a5fa',
                titlesEn: [
                    'Clinical Consultant', 'Review Consultant', 'Diagnostic Consultant', 'Operative Consultant', 'Senior Consultant',
                    'Advisory Consultant', 'Tertiary Consultant', 'Critical Care Consultant', 'Principal Consultant', 'Chief Consultant'
                ],
                titlesRu: [
                    'Клинический консультант', 'Эксперт консилиумов', 'Диагностический консультант', 'Операционный консультант', 'Старший консультант',
                    'Консультант совета', 'Консультант третичного звена', 'Консультант реанимации', 'Главный эксперт-консультант', 'Шеф-консультант'
                ]
            },
            {
                id: 5,
                nameEn: 'Department Chair',
                nameRu: 'Заведующий отделением',
                icon: '👑',
                color: '#a855f7',
                accent: '#c084fc',
                titlesEn: [
                    'Acting Service Chief', 'Division Chief', 'Service Director', 'Department Vice-Chair', 'Department Chair',
                    'Surgical Director', 'Clinical Executive', 'Governance Chair', 'Chief of Surgery', 'Medical Center Chief'
                ],
                titlesRu: [
                    'И.о. заведующего', 'Заведующий направлением', 'Директор службы', 'Заместитель заведующего', 'Заведующий отделением',
                    'Хирургический директор', 'Клинический руководитель', 'Председатель коллегии', 'Главный хирург клиники', 'Шеф медицинского центра'
                ]
            },
            {
                id: 6,
                nameEn: 'Professor',
                nameRu: 'Профессор и академик',
                icon: '🦅',
                color: '#f43f5e',
                accent: '#fb7185',
                titlesEn: [
                    'Assistant Professor', 'Associate Professor', 'Clinical Professor', 'Research Professor', 'Tenured Professor',
                    'Department Professor', 'Distinguished Professor', 'Academy Fellow', 'Academy Laureate', 'Grand Academician'
                ],
                titlesRu: [
                    'Ассистент кафедры', 'Доцент кафедры', 'Клинический профессор', 'Профессор исследований', 'Заслуженный профессор',
                    'Профессор кафедры', 'Выдающийся профессор', 'Член академии наук', 'Лауреат академии', 'Гранд-академик'
                ]
            },
            {
                id: 7,
                nameEn: 'Grand Master',
                nameRu: 'Гранд-мастер хирургии',
                icon: '⚜️',
                color: '#eab308',
                accent: '#fde047',
                titlesEn: [
                    'Scalpel Virtuoso', 'Operative Maestro', 'Grand Preceptor', 'Surgical Virtuoso', 'High Master Surgeon',
                    'Operative Sovereign', 'Legendary Surgeon', 'Sovereign Preceptor', 'Apex Surgeon', 'Supreme Grand Master'
                ],
                titlesRu: [
                    'Виртуоз скальпеля', 'Операционный маэстро', 'Гранд-наставник', 'Хирургический виртуоз', 'Высший мастер хирургии',
                    'Суверен операционной', 'Легендарный хирург', 'Верховный наставник', 'Апекс-хирург', 'Верховный гранд-мастер'
                ]
            },
            {
                id: 8,
                nameEn: 'Luminary Vanguard',
                nameRu: 'Светило медицины',
                icon: '☀️',
                color: '#f97316',
                accent: '#fdba74',
                titlesEn: [
                    'Luminary Initiate', 'Clinical Luminary', 'Surgical Luminary', 'Vanguard Innovator', 'Eminent Luminary',
                    'Global Vanguard', 'Apex Luminary', 'Living Legend Healer', 'Grand Luminary', 'Supreme Luminary Vanguard'
                ],
                titlesRu: [
                    'Восходящее светило', 'Клиническое светило', 'Хирургическое светило', 'Инноватор авангарда', 'Выдающееся светило',
                    'Мировой авангард', 'Апекс-светило', 'Живая легенда медицины', 'Великое светило', 'Верховный авангард медицины'
                ]
            },
            {
                id: 9,
                nameEn: 'Mythic Ascendant',
                nameRu: 'Мифический первопроходец',
                icon: '🌌',
                color: '#818cf8',
                accent: '#38bdf8',
                titlesEn: [
                    'Mythic Candidate', 'Ethereal Physician', 'Transcendent Healer', 'Master of Life Flow', 'Mythic Pioneer',
                    'Sovereign Ascendant', 'Immortal Healer', 'Mythic Architect', 'Celestial Healer', 'Supreme Mythic Ascendant'
                ],
                titlesRu: [
                    'Мифический кандидат', 'Эфирный клиницист', 'Трансцендентный целитель', 'Владыка витального потока', 'Мифический пионер',
                    'Суверенный первопроходец', 'Бессмертный целитель', 'Мифический архитектор', 'Небесный целитель', 'Верховный мифический титан'
                ]
            },
            {
                id: 10,
                nameEn: 'Unrivaled',
                nameRu: 'Непревзойденный',
                icon: '🌈',
                color: '#ffffff',
                accent: '#f472b6',
                titlesEn: [
                    'Archon Unrivaled', 'Divine Operator', 'Epoch Healer', 'Sovereign of Vitality', 'Celestial Sovereign',
                    'Primordial Virtuoso', 'Eternal Master', 'Omniscient Clinician', 'Demigod of Surgery', 'The Unrivaled'
                ],
                titlesRu: [
                    'Непревзойденный архонт', 'Божественный оператор', 'Целитель эпохи', 'Владыка жизни', 'Небесный суверен',
                    'Первозданный виртуоз', 'Вечный мастер', 'Всеведущий клиницист', 'Полубог хирургии', 'Непревзойденный'
                ]
            }
        ],

        getLevelData(level, lang = 'En') {
            const clampedLevel = Math.min(100, Math.max(1, Math.round(Number(level) || 1)));
            const tierId = Math.min(10, Math.max(1, Math.ceil(clampedLevel / 10)));
            const tier = this.TIERS[tierId - 1] || this.TIERS[0];
            const idxInTier = (clampedLevel - 1) % 10;
            const isRu = lang === 'Ru';
            const title = isRu ? tier.titlesRu[idxInTier] : tier.titlesEn[idxInTier];
            const tierName = isRu ? tier.nameRu : tier.nameEn;
            return {
                level: clampedLevel,
                tierId: tierId,
                tierName: tierName,
                tierIcon: tier.icon,
                title: title,
                fullTitle: `Lv.${clampedLevel} ${title}`,
                tier: tier
            };
        },

        getRequiredExp(level) {
            const l = Math.min(100, Math.max(1, Number(level) || 1));
            return Math.round(1000 + 280000 * Math.pow((l - 1) / 99, 2.6));
        },

        getCorrectExp(level) {
            const l = Math.min(100, Math.max(1, Number(level) || 1));
            return Math.round(10 + 15 * ((l - 1) / 99));
        },

        getMistakePenalty(level) {
            const l = Math.min(100, Math.max(1, Number(level) || 1));
            return Math.round(5 + 145 * Math.pow((l - 1) / 99, 1.7));
        },

        calculateSessionExp(session, currentLevel) {
            const cLevel = Math.min(100, Math.max(1, Number(currentLevel) || 1));
            const correctCount = Number(session.correctQ || session.correctCount) || 0;
            const totalCount = Number(session.totalQ || session.totalCount || session.count) || 0;
            const wrongCount = Math.max(0, totalCount - correctCount);

            const baseExp = this.getCorrectExp(cLevel);
            const penalty = this.getMistakePenalty(cLevel);

            const grossExp = correctCount * baseExp;
            const grossLoss = wrongCount * penalty;

            const accPct = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
            const masteryBonus = accPct >= 90 ? Math.round(grossExp * 0.25) : 0;

            const avgTime = session.timeSpentSec && totalCount > 0 ? (session.timeSpentSec / totalCount) : 999;
            const speedBonus = (avgTime < 15 && totalCount >= 3) ? Math.round(grossExp * 0.15) : 0;

            const totalGained = grossExp + masteryBonus + speedBonus;
            const netExp = totalGained - grossLoss;

            return {
                netExp: netExp,
                totalGained: totalGained,
                grossLoss: grossLoss,
                baseExp: baseExp,
                penalty: penalty,
                masteryBonus: masteryBonus,
                speedBonus: speedBonus
            };
        },

        applyExpDelta(rpgState, delta, lang = 'En') {
            let curLevel = Math.min(100, Math.max(1, Number(rpgState.level) || 1));
            let curExp = Math.max(0, Number(rpgState.currentExp) || 0) + delta;
            let totExp = Math.max(0, (Number(rpgState.totalExp) || 0) + delta);
            let leveledUp = false;
            let leveledDown = false;
            const oldLevel = curLevel;

            if (delta > 0) {
                while (curExp >= this.getRequiredExp(curLevel) && curLevel < 100) {
                    curExp -= this.getRequiredExp(curLevel);
                    curLevel++;
                    leveledUp = true;
                }
                if (curLevel === 100 && curExp > this.getRequiredExp(100)) {
                    curExp = this.getRequiredExp(100);
                }
            } else if (delta < 0) {
                while (curExp < 0 && curLevel > 1) {
                    curLevel--;
                    curExp += this.getRequiredExp(curLevel);
                    leveledDown = true;
                }
                if (curLevel === 1 && curExp < 0) {
                    curExp = 0;
                }
            }

            const reqExp = this.getRequiredExp(curLevel);
            const progressPct = reqExp > 0 ? Math.min(100, Math.max(0, Math.round((curExp / reqExp) * 100))) : 0;
            const levelData = this.getLevelData(curLevel, lang);

            return {
                level: curLevel,
                tierId: levelData.tierId,
                currentExp: curExp,
                totalExp: totExp,
                reqExp: reqExp,
                progressPct: progressPct,
                leveledUp: leveledUp,
                leveledDown: leveledDown,
                oldLevel: oldLevel,
                levelData: levelData
            };
        },

        getProfileRpgState(userProfile, sessionHistory, lang = 'En') {
            const prof = userProfile || {};

            let simulatedState = { level: 1, currentExp: 0, totalExp: 0 };
            if (Array.isArray(sessionHistory) && sessionHistory.length > 0) {
                sessionHistory.slice().reverse().forEach(s => {
                    const expResult = this.calculateSessionExp(s, simulatedState.level);
                    simulatedState = this.applyExpDelta(simulatedState, expResult.netExp, lang);
                });
            } else {
                let parsedLevel = 1;
                if (typeof prof.level === 'number') parsedLevel = prof.level;
                else if (typeof prof.level === 'string') {
                    const m = prof.level.match(/Lv\.?(\d+)/i);
                    if (m) parsedLevel = parseInt(m[1], 10) || 1;
                }
                simulatedState.level = Math.min(100, Math.max(1, parsedLevel));
                simulatedState.currentExp = Math.max(0, Number(prof.currentExp) || 0);
                simulatedState.totalExp = Math.max(0, Number(prof.totalExp) || 0);
            }

            const reqExp = this.getRequiredExp(simulatedState.level);
            const progressPct = reqExp > 0 ? Math.min(100, Math.max(0, Math.round((simulatedState.currentExp / reqExp) * 100))) : 0;
            const levelData = this.getLevelData(simulatedState.level, lang);

            return {
                level: simulatedState.level,
                tierId: levelData.tierId,
                currentExp: simulatedState.currentExp,
                totalExp: simulatedState.totalExp,
                reqExp: reqExp,
                progressPct: progressPct,
                levelData: levelData,
                tierData: levelData.tier,
                nextLevelData: this.getLevelData(Math.min(100, simulatedState.level + 1), lang)
            };
        },

        calculateRpgAttributes(history, totalBankQ) {
            const hist = Array.isArray(history) ? history : [];
            const bankQ = totalBankQ || (typeof window.getTotalBankQuestions === 'function' ? window.getTotalBankQuestions() : 2949);

            let totalAnswered = 0;
            let totalCorrect = 0;
            let maxSession = 0;
            const uniqueSolved = new Set();
            const uniqueTopics = new Set();
            const scores = [];

            hist.forEach(s => {
                const q = Number(s.totalQ || s.count) || 0;
                const c = Number(s.correctQ || s.correctCount) || 0;
                totalAnswered += q;
                totalCorrect += c;
                if (q > maxSession) maxSession = q;

                const score = s.scorePct !== undefined ? s.scorePct : (q > 0 ? (c / q) * 100 : 0);
                scores.push(score);

                if (Array.isArray(s.topics)) s.topics.forEach(t => uniqueTopics.add(t));
                else if (s.setTitle) uniqueTopics.add(s.setTitle);

                if (Array.isArray(s.errors)) {
                    s.errors.forEach(e => {
                        const id = e.specialId || e.questionId;
                        if (id) uniqueSolved.add(id);
                    });
                }
            });

            const knowledgeScore = Math.min(100, Math.round((uniqueSolved.size / (bankQ * 0.4 || 1)) * 100));
            const precisionScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
            const velocityScore = Math.min(100, Math.round(Math.min(totalAnswered, 500) / 5));
            const staminaScore = Math.min(100, Math.round((maxSession / 50) * 60 + Math.min(hist.length, 20) * 2));
            const breadthScore = Math.min(100, Math.round((uniqueTopics.size / 18) * 100));

            let consistencyScore = 50;
            if (scores.length >= 3) {
                const recent = scores.slice(0, 10);
                const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
                const variance = recent.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / recent.length;
                const stdDev = Math.sqrt(variance);
                consistencyScore = Math.max(10, Math.min(100, Math.round(100 - stdDev * 2)));
            }

            const getRank = (score) => {
                if (score >= 95) return { grade: 'SSS', cls: 'rpg-rank-sss' };
                if (score >= 88) return { grade: 'S', cls: 'rpg-rank-s' };
                if (score >= 75) return { grade: 'A', cls: 'rpg-rank-a' };
                if (score >= 60) return { grade: 'B', cls: 'rpg-rank-b' };
                if (score >= 45) return { grade: 'C', cls: 'rpg-rank-c' };
                return { grade: 'D', cls: 'rpg-rank-d' };
            };

            return [
                { id: 'knowledge', nameEn: 'Clinical Knowledge', nameRu: 'Клинический кругозор', icon: '🧠', score: knowledgeScore, rank: getRank(knowledgeScore), color: '#58a6ff' },
                { id: 'precision', nameEn: 'Surgical Precision', nameRu: 'Хирургическая точность', icon: '🎯', score: precisionScore, rank: getRank(precisionScore), color: '#3fb950' },
                { id: 'velocity', nameEn: 'Cognitive Velocity', nameRu: 'Скорость мышления', icon: '⚡', score: velocityScore, rank: getRank(velocityScore), color: '#eab308' },
                { id: 'stamina', nameEn: 'Mental Stamina', nameRu: 'Интеллектуальная выносливость', icon: '🛡️', score: staminaScore, rank: getRank(staminaScore), color: '#f97316' },
                { id: 'breadth', nameEn: 'Specialty Breadth', nameRu: 'Широта специализаций', icon: '🌐', score: breadthScore, rank: getRank(breadthScore), color: '#c084fc' },
                { id: 'consistency', nameEn: 'Consistency & Fortitude', nameRu: 'Стабильность результатов', icon: '⚖️', score: consistencyScore, rank: getRank(consistencyScore), color: '#2dd4bf' }
            ];
        }
    };

    // ==========================================================================
    // TOPIC MANIFEST ANALYTICS WITH O(1) MAP INDEXING
    // ==========================================================================

    function calculateTopicManifestAnalytics(history) {
        const state = window.state || {};
        const hist = Array.isArray(history) ? history : [];
        const registry = (state.allQuizRegistry && state.allQuizRegistry.length > 0) 
            ? state.allQuizRegistry 
            : (window.ALL_MANIFESTS_REGISTRY || []);

        // Build O(1) Index for Manifests
        const numToManifestMap = new Map();
        const aliasToManifestMap = new Map();

        registry.forEach(m => {
            if (m.num) numToManifestMap.set(Number(m.num), m);
            if (m.id) aliasToManifestMap.set(String(m.id).toLowerCase(), m);
            if (m.titleRu) aliasToManifestMap.set(String(m.titleRu).toLowerCase(), m);
            if (m.titleEn) aliasToManifestMap.set(String(m.titleEn).toLowerCase(), m);
            if (m.title) aliasToManifestMap.set(String(m.title).toLowerCase(), m);
        });

        const manifestStats = {};
        registry.forEach(m => {
            const totalQ = (state.setQuestionsMap && state.setQuestionsMap[m.id] && state.setQuestionsMap[m.id].length)
                ? state.setQuestionsMap[m.id].length
                : Number(m.totalQuestions || m.totalQ || 0);

            manifestStats[m.num] = {
                num: m.num,
                id: m.id,
                icon: m.icon || '📝',
                titleRu: m.titleRu || m.title || m.id,
                titleEn: m.titleEn || m.title || m.id,
                file: m.file,
                totalBankQ: totalQ,
                attemptedCount: 0,
                correctCount: 0,
                wrongCount: 0,
                accuracy: 0,
                uniqueQuestions: new Set(),
                uniqueErrors: new Set(),
                lastDate: null
            };
        });

        hist.forEach(sess => {
            const sDate = sess.date || null;

            if (Array.isArray(sess.errors) && sess.errors.length > 0) {
                sess.errors.forEach(e => {
                    const specId = e.specialId || e.questionId || '';
                    let mItem = null;

                    // O(1) resolution by specialId prefix
                    if (specId && typeof specId === 'string' && specId.includes('🧠')) {
                        const num = parseInt(specId.split('🧠')[0], 10);
                        if (num && numToManifestMap.has(num)) {
                            mItem = numToManifestMap.get(num);
                        }
                    }
                    if (!mItem && typeof window.resolveQuestionManifestItem === 'function') {
                        mItem = window.resolveQuestionManifestItem(e, specId);
                    }

                    if (mItem && manifestStats[mItem.num]) {
                        const st = manifestStats[mItem.num];
                        st.attemptedCount++;
                        if (e.isCorrect) {
                            st.correctCount++;
                        } else {
                            st.wrongCount++;
                            st.uniqueErrors.add(specId);
                        }
                        if (specId) st.uniqueQuestions.add(specId);
                        if (sDate) st.lastDate = sDate;
                    }
                });
            } else if (Array.isArray(sess.manifestBreakdown) && sess.manifestBreakdown.length > 0) {
                sess.manifestBreakdown.forEach(mb => {
                    const mItem = (mb.num && numToManifestMap.get(Number(mb.num))) ||
                                  (mb.id && aliasToManifestMap.get(String(mb.id).toLowerCase()));
                    if (mItem && manifestStats[mItem.num]) {
                        const st = manifestStats[mItem.num];
                        st.attemptedCount += (mb.total || 0);
                        st.correctCount += (mb.correct || 0);
                        st.wrongCount += (mb.wrong || 0);
                        if (sDate) st.lastDate = sDate;
                    }
                });
            } else {
                const tNames = Array.isArray(sess.topics) ? sess.topics : (sess.setTitle ? [sess.setTitle] : []);
                tNames.forEach(name => {
                    const mItem = aliasToManifestMap.get(String(name).toLowerCase());
                    if (mItem && manifestStats[mItem.num]) {
                        const st = manifestStats[mItem.num];
                        const qCount = Number(sess.totalQ || sess.count) || 0;
                        const cCount = Number(sess.correctQ || sess.correctCount) || 0;
                        st.attemptedCount += qCount;
                        st.correctCount += cCount;
                        st.wrongCount += Math.max(0, qCount - cCount);
                        if (sDate) st.lastDate = sDate;
                    }
                });
            }
        });

        return registry.map(m => {
            const st = manifestStats[m.num] || {
                num: m.num,
                id: m.id,
                icon: m.icon || '📝',
                titleRu: m.titleRu || m.title || m.id,
                titleEn: m.titleEn || m.title || m.id,
                file: m.file,
                totalBankQ: Number(m.totalQuestions || m.totalQ || 0),
                attemptedCount: 0,
                correctCount: 0,
                wrongCount: 0,
                accuracy: 0,
                uniqueQuestions: new Set(),
                uniqueErrors: new Set(),
                lastDate: null
            };
            const totalQ = st.totalBankQ;
            const acc = st.attemptedCount > 0 ? Math.round((st.correctCount / st.attemptedCount) * 100) : 0;
            const coveragePct = totalQ > 0 ? Math.min(100, Math.round((st.uniqueQuestions.size / totalQ) * 100)) : 0;
            return {
                ...st,
                accuracy: acc,
                coveragePct: coveragePct,
                uniqueCount: st.uniqueQuestions.size,
                errorCount: st.uniqueErrors.size
            };
        });
    }

    // ==========================================================================
    // DISCIPLINE ANALYTICS
    // ==========================================================================

    function calculateDisciplineAnalytics() {
        const state = window.state || {};
        if (!state.taxonomy || !state.taxonomy.disciplines) return [];

        return state.taxonomy.disciplines.map(disc => {
            const discTopics = (state.taxonomy.topics || []).filter(t => t.disciplineId === disc.id);
            const discTopicIds = new Set(discTopics.map(t => t.id));

            let totalBankQ = 0;
            let attemptedCount = 0;
            let correctCount = 0;
            let wrongCount = 0;
            const seenKeys = new Set();

            if (state.setQuestionsMap) {
                Object.values(state.setQuestionsMap).forEach(list => {
                    if (Array.isArray(list)) {
                        list.forEach(q => {
                            const qTopics = typeof window.getQuestionTopics === 'function' ? window.getQuestionTopics(q) : [];
                            const qDiscs = typeof window.getQuestionDisciplines === 'function' ? window.getQuestionDisciplines(q) : [];
                            if (qDiscs.includes(disc.id) || qTopics.some(t => discTopicIds.has(t))) {
                                const key = typeof window.getQuestionKey === 'function' ? window.getQuestionKey(q) : q.id;
                                if (!seenKeys.has(key)) {
                                    seenKeys.add(key);
                                    totalBankQ++;
                                    const m = typeof window.getQuestionMastery === 'function' ? window.getQuestionMastery(q) : { views: 0, state: 'unseen' };
                                    if (m.views > 0 || m.state !== 'unseen') {
                                        attemptedCount++;
                                        if (m.state === 'green' || m.state === 'yellow') {
                                            correctCount++;
                                        } else if (m.state === 'red') {
                                            wrongCount++;
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            }

            const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;
            const coveragePct = totalBankQ > 0 ? Math.round((attemptedCount / totalBankQ) * 100) : 0;

            return {
                id: disc.id,
                icon: disc.icon,
                titleRu: disc.nameRu,
                titleEn: disc.nameEn,
                totalBankQ: totalBankQ,
                attemptedCount: attemptedCount,
                correctCount: correctCount,
                wrongCount: wrongCount,
                accuracy: accuracy,
                coveragePct: coveragePct,
                topics: discTopics
            };
        });
    }

    // ==========================================================================
    // EXPORT TO WINDOW
    // ==========================================================================

    const QuizStats = {
        RPG_SYSTEM,
        calculateTopicManifestAnalytics,
        calculateDisciplineAnalytics
    };

    window.QuizStats = QuizStats;
    window.RPG_SYSTEM = RPG_SYSTEM;
    window.calculateTopicManifestAnalytics = calculateTopicManifestAnalytics;
    window.calculateDisciplineAnalytics = calculateDisciplineAnalytics;

})(window);
