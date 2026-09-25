const state = {
    bookPath: '',
    bookMeta: null,
    quizData: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    currentSelected: [],
    startTime: 0,
    questionStartTime: 0,
    userFavorites: [],
    userPlaylists: [],
    settings: {
        count: 100, // Default to a higher number
        shuffle: true,
        exam: false,
        allQuestions: false,
        setId: 'full',
        lang: localStorage.getItem('starley_quiz_lang') || 'Ru' // 'En' or 'Ru'
    },
    sessionMode: 'smart', // 'smart', 'weak', 'exam'
    isMuted: localStorage.getItem('starley_quiz_mute') === 'true',
    activeTopicFilter: null,
    timerInterval: null,
    timeRemaining: 60,
    searchIndex: [],
    isIndexing: false,
    selectedSets: [],
    allBooksWithQuizzes: [],
    setQuestionsMap: {}
};

const PLAYLIST_ICONS_MAP = [
    { id: 1, icon: '📚', nameEn: 'Book', nameRu: 'Книга' },
    { id: 2, icon: '🧠', nameEn: 'Brain', nameRu: 'Мозг' },
    { id: 3, icon: '🫀', nameEn: 'Heart', nameRu: 'Сердце' },
    { id: 4, icon: '🫁', nameEn: 'Lungs', nameRu: 'Легкие' },
    { id: 5, icon: '🩺', nameEn: 'Stethoscope', nameRu: 'Стетоскоп' },
    { id: 6, icon: '⚡', nameEn: 'Blitz', nameRu: 'Блиц' },
    { id: 7, icon: '🎯', nameEn: 'Target', nameRu: 'Цель' },
    { id: 8, icon: '🚀', nameEn: 'Rocket', nameRu: 'Ракета' },
    { id: 9, icon: '🏆', nameEn: 'Trophy', nameRu: 'Трофей' },
    { id: 10, icon: '🔥', nameEn: 'Fire', nameRu: 'Огонь' },
    { id: 11, icon: '🔬', nameEn: 'Microscope', nameRu: 'Микроскоп' },
    { id: 12, icon: '💊', nameEn: 'Pill', nameRu: 'Таблетка' },
    { id: 13, icon: '🩹', nameEn: 'Bandage', nameRu: 'Пластырь' },
    { id: 14, icon: '🧪', nameEn: 'Test Tube', nameRu: 'Пробирка' },
    { id: 15, icon: '💉', nameEn: 'Syringe', nameRu: 'Шприц' },
    { id: 16, icon: '🛡️', nameEn: 'Shield', nameRu: 'Щит' },
    { id: 17, icon: '🌟', nameEn: 'Star', nameRu: 'Звезда' },
    { id: 18, icon: '💎', nameEn: 'Diamond', nameRu: 'Алмаз' },
    { id: 19, icon: '💡', nameEn: 'Lightbulb', nameRu: 'Идея' },
    { id: 20, icon: '🎓', nameEn: 'Academy', nameRu: 'Академия' }
];

function getPlaylistIconChar(iconId) {
    const item = PLAYLIST_ICONS_MAP.find(i => i.id === Number(iconId));
    return item ? item.icon : '📚';
}

function getDefaultPlaylists() {
    const list = [];
    for (let i = 1; i <= 10; i++) {
        list.push({
            id: i,
            title: String(i),
            iconId: 1,
            count: 0,
            questionIds: []
        });
    }
    return list;
}

function ensureTenPlaylists() {
    if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
    const list = [];
    for (let i = 1; i <= 10; i++) {
        let existing = state.userPlaylists.find(p => p.id === i || String(p.id) === String(i));
        if (!existing) {
            existing = {
                id: i,
                title: String(i),
                iconId: 1,
                count: 0,
                questionIds: []
            };
        } else {
            existing.id = i;
            if (!existing.title) existing.title = String(i);
            if (!existing.iconId) existing.iconId = 1;
            if (!Array.isArray(existing.questionIds)) existing.questionIds = [];
            existing.count = existing.questionIds.length;
        }
        list.push(existing);
    }
    state.userPlaylists = list;
    return list;
}

async function loadAllQuizManifestIndex() {
    if (state.allQuizRegistry && state.allQuizRegistry.length > 0) return;
    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const res = await fetch(`${rootPath}quiz/allquiz.json`);
        if (res.ok) {
            const data = await res.json();
            state.allQuizRegistry = data.quizzes || [];
            state.totalBankQuestions = (data.meta && data.meta.totalQuestions) ? data.meta.totalQuestions : 2949;
            
            // Preload questions for all 18 manifests so special ID resolution is instant everywhere!
            for (const manifest of state.allQuizRegistry) {
                if (!state.setQuestionsMap[manifest.id]) {
                    try {
                        const mRes = await fetch(`${rootPath}${manifest.file}`);
                        if (mRes.ok) {
                            const mData = await mRes.json();
                            let qList = Array.isArray(mData) ? mData : (mData.questions || []);
                            qList = qList.map((q, idx) => decorateQuestionWithSpecialId(q, idx, manifest.id, manifest.file, ''));
                            state.setQuestionsMap[manifest.id] = qList;
                        }
                    } catch (mErr) {}
                }
            }
        }
    } catch (e) {
        console.warn('Failed loading quiz/allquiz.json:', e);
    }
}

function decorateQuestionWithSpecialId(q, idx, manifestId, setFile, bookPrefix) {
    const localId = q.id !== undefined ? q.id : (idx + 1);
    let manifestNum = 1;

    if (state.allQuizRegistry && Array.isArray(state.allQuizRegistry)) {
        const regItem = state.allQuizRegistry.find(m => 
            m.id === manifestId || 
            (m.file && setFile && setFile.includes(m.id)) ||
            (m.id && manifestId && String(manifestId).includes(m.id))
        );
        if (regItem) {
            manifestNum = regItem.num;
        }
    }

    const specialId = `${manifestNum}🧠${localId}`;
    return Object.assign({}, q, {
        id: localId,
        specialId: specialId,
        manifestNum: manifestNum,
        manifestId: manifestId || 'set',
        setId: manifestId || 'set',
        bookPath: bookPrefix || ''
    });
}

function getQuestionSpecialId(q) {
    if (!q) return '';
    if (q.specialId) return q.specialId;
    const mNum = q.manifestNum || 1;
    const localId = q.id !== undefined ? q.id : 1;
    return `${mNum}🧠${localId}`;
}

function parseSpecialId(specialIdStr) {
    if (!specialIdStr) return null;
    const str = String(specialIdStr).trim();
    const parts = str.split('🧠');
    if (parts.length < 2) return null;
    const manifestNum = parseInt(parts[0], 10);
    const qIdRaw = parts[1];
    
    // Parse format like 24(D)B -> qId 24, correct D, chosen B
    const match = qIdRaw.match(/^(\d+)(?:\(([A-E])\))?([A-E])?$/);
    let questionId = qIdRaw;
    let correctAnswer = '';
    let chosenAnswer = '';
    if (match) {
        questionId = parseInt(match[1], 10);
        correctAnswer = match[2] || '';
        chosenAnswer = match[3] || '';
    }
    return {
        manifestNum: manifestNum,
        questionId: questionId,
        correctAnswer: correctAnswer,
        chosenAnswer: chosenAnswer,
        cleanSpecialId: `${manifestNum}🧠${questionId}`,
        rawSpecialId: str
    };
}

function resolveQuestionBySpecialId(specialIdStr) {
    const parsed = parseSpecialId(specialIdStr);
    if (!parsed) return null;
    
    const targetKey = `${parsed.manifestNum}🧠${parsed.questionId}`;

    if (state.setQuestionsMap) {
        for (const setList of Object.values(state.setQuestionsMap)) {
            if (Array.isArray(setList)) {
                const found = setList.find(q => getQuestionSpecialId(q) === targetKey);
                if (found) return found;
            }
        }
    }
    return null;
}

/**
 * Global Registry of All 18 Medical Question Manifests / Topics
 */
const ALL_MANIFESTS_REGISTRY = [
    { num: 1, id: 'quiz-adult', icon: '🩺', titleRu: 'Взрослая кардиохирургия', titleEn: 'Adult Cardiac Surgery', totalQ: 368, file: 'books/work/examen/quiz/quiz-adult.json' },
    { num: 2, id: 'quiz-congenital', icon: '👶', titleRu: 'Врожденные пороки сердца (ВПС)', titleEn: 'Congenital Heart Surgery', totalQ: 126, file: 'books/work/examen/quiz/quiz-congenital.json' },
    { num: 3, id: 'quiz-icu', icon: '🏥', titleRu: 'Реанимация и интенсивная терапия (ОРИТ)', titleEn: 'Critical Care & ICU', totalQ: 105, file: 'books/work/examen/quiz/quiz-icu.json' },
    { num: 4, id: 'quiz-seats', icon: '📚', titleRu: 'SESATS Кардиоторакальная хирургия (Часть 1)', titleEn: 'SESATS General Cardiothoracic', totalQ: 309, file: 'books/work/examen/quiz/quiz-seats.json' },
    { num: 5, id: 'quiz-seats2', icon: '📖', titleRu: 'SESATS Кардиоторакальная хирургия (Часть 2)', titleEn: 'SESATS Part 2', totalQ: 244, file: 'books/work/examen/quiz/quiz-seats2.json' },
    { num: 6, id: 'quiz-seats3', icon: '🧬', titleRu: 'SESATS 3 & VPS AI Педиатрия', titleEn: 'SESATS 3 & VPS AI Pediatric', totalQ: 125, file: 'books/work/examen/quiz/quiz-seats3.json' },
    { num: 7, id: 'quiz-surg', icon: '🫁', titleRu: 'Общая и неотложная торакальная хирургия', titleEn: 'General & Emergency Thoracic', totalQ: 125, file: 'books/work/examen/quiz/quiz-surg.json' },
    { num: 8, id: 'quiz-thoracic', icon: '🔬', titleRu: 'Торакальная онкология и хирургия', titleEn: 'General Thoracic & Oncology', totalQ: 271, file: 'books/work/examen/quiz/quiz-thoracic.json' },
    { num: 9, id: 'quiz-vps', icon: '👶', titleRu: 'ВПС: Анатомия и реконструкции', titleEn: 'VPS Congenital Reconstructions', totalQ: 150, file: 'books/work/examen/quiz/quiz-vps.json' },
    { num: 10, id: 'quiz-200pqcs', icon: '📝', titleRu: '200 Практических вопросов КТХ', titleEn: '200 Practice Questions in CTS', totalQ: 50, file: 'books/work/examen/quiz/quiz-200pqcs.json' },
    { num: 11, id: 'quiz-2019', icon: '📜', titleRu: 'SESATS 2019 Квалификационный экзамен', titleEn: 'SESATS 2019 Exam', totalQ: 100, file: 'books/work/examen/quiz/quiz-2019.json' },
    { num: 12, id: 'quiz-2020', icon: '📜', titleRu: 'SESATS 2020-2021 Квалификационный экзамен', titleEn: 'SESATS 2020-2021 Exam', totalQ: 276, file: 'books/work/examen/quiz/quiz-2020.json' },
    { num: 13, id: 'quiz-2022', icon: '📜', titleRu: 'SESATS 2022 Квалификационный экзамен', titleEn: 'SESATS 2022 Exam', totalQ: 150, file: 'books/work/examen/quiz/quiz-2022.json' },
    { num: 14, id: 'quiz-2023', icon: '📜', titleRu: 'SESATS 2023 Квалификационный экзамен', titleEn: 'SESATS 2023 Exam', totalQ: 150, file: 'books/work/examen/quiz/quiz-2023.json' },
    { num: 15, id: 'quiz-aortic-valve', icon: '❤️', titleRu: 'Cohn: Патология аортального клапана', titleEn: 'Cohn: Aortic Valve Disease Quiz', totalQ: 100, file: 'books/cardiac-surgery/cohn/quiz/quiz-aortic-valve.json' },
    { num: 16, id: 'quiz-eu-valve', icon: '🇪🇺', titleRu: 'ESC/EACTS 2025: Пороки сердца', titleEn: '2025 ESC/EACTS Valvular Heart Disease', totalQ: 100, file: 'books/guidelines/guide/quiz/quiz-eu-valve.json' },
    { num: 17, id: 'quiz-valve-disease-management', icon: '🩺', titleRu: 'Ведение пороков клапанов', titleEn: 'Valvular Disease Management', totalQ: 100, file: 'books/guidelines/guide/quiz/quiz-valve-disease-management.json' },
    { num: 18, id: 'quiz-chapter-01', icon: '📘', titleRu: 'Bojar: ОРИТ в кардиохирургии', titleEn: 'Bojar: Adult Cardiac Surgical ICU', totalQ: 100, file: 'books/icu/bojar/quiz/quiz-chapter-01.json' }
];
window.ALL_MANIFESTS_REGISTRY = ALL_MANIFESTS_REGISTRY;

function resolveQuestionManifestItem(q, specialIdStr) {
    if (!q && !specialIdStr) return null;
    let sId = specialIdStr || (q ? (q.specialId || (typeof getQuestionSpecialId === 'function' ? getQuestionSpecialId(q) : q.id)) : '');
    if (sId && typeof sId === 'string' && sId.includes('🧠')) {
        const parts = sId.split('🧠');
        const num = parseInt(parts[0], 10);
        if (num) {
            const found = ALL_MANIFESTS_REGISTRY.find(m => m.num === num);
            if (found) return found;
        }
    }
    const mId = q ? (q.manifestId || q.setId || q.bookPath || '') : '';
    if (mId) {
        const found = ALL_MANIFESTS_REGISTRY.find(m => m.id === mId || (m.file && m.file.includes(mId)));
        if (found) return found;
    }
    return null;
}
window.resolveQuestionManifestItem = resolveQuestionManifestItem;

function calculateTopicManifestAnalytics(history) {
    const hist = Array.isArray(history) ? history : [];
    
    const manifestStats = {};
    ALL_MANIFESTS_REGISTRY.forEach(m => {
        manifestStats[m.num] = {
            num: m.num,
            id: m.id,
            icon: m.icon,
            titleRu: m.titleRu,
            titleEn: m.titleEn,
            file: m.file,
            totalBankQ: m.totalQ,
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
                const mItem = resolveQuestionManifestItem(e, specId);
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
                const mItem = ALL_MANIFESTS_REGISTRY.find(m => m.id === mb.id || m.num === mb.num);
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
                const mItem = ALL_MANIFESTS_REGISTRY.find(m => 
                    m.titleRu === name || m.titleEn === name || m.id === name
                );
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

    return ALL_MANIFESTS_REGISTRY.map(m => {
        const st = manifestStats[m.num];
        const acc = st.attemptedCount > 0 ? Math.round((st.correctCount / st.attemptedCount) * 100) : 0;
        const coveragePct = m.totalQ > 0 ? Math.min(100, Math.round((st.uniqueQuestions.size / m.totalQ) * 100)) : 0;
        return {
            ...st,
            accuracy: acc,
            coveragePct: coveragePct,
            uniqueSolvedCount: st.uniqueQuestions.size,
            errorCount: st.wrongCount
        };
    });
}
window.calculateTopicManifestAnalytics = calculateTopicManifestAnalytics;


/**
 * Helper to ensure all sets/manifests for the current book are loaded into state
 */
async function loadAllSetsForBook() {
    await loadAllQuizManifestIndex();
    if (!state.selectedSets || state.selectedSets.length === 0) {
        if (state.bookMeta && Array.isArray(state.bookMeta.quiz_sets)) {
            state.selectedSets = state.bookMeta.quiz_sets;
        } else {
            state.selectedSets = [];
        }
    }
    if (!state.setQuestionsMap) state.setQuestionsMap = {};

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    const bookPrefix = state.bookPath || '';

    for (const setObj of state.selectedSets) {
        const cacheKey = setObj.id;
        if (!state.setQuestionsMap[cacheKey]) {
            try {
                let jsonUrl = '';
                if (setObj.file) {
                    jsonUrl = bookPrefix ? `${rootPath}${bookPrefix}/${setObj.file}` : `${rootPath}${setObj.file}`;
                } else {
                    jsonUrl = bookPrefix ? `${rootPath}${bookPrefix}/quizzes/${setObj.id}.json` : `${rootPath}quizzes/${setObj.id}.json`;
                }
                const res = await fetch(jsonUrl);
                if (res.ok) {
                    const data = await res.json();
                    let questions = Array.isArray(data) ? data : (data.questions || []);
                    const manifestId = setObj.id || 'set';
                    questions = questions.map((q, idx) => decorateQuestionWithSpecialId(q, idx, manifestId, setObj.file, bookPrefix));
                    state.setQuestionsMap[cacheKey] = questions;
                }
            } catch (e) {
                console.error(`Failed loading quiz set ${setObj.id}:`, e);
            }
        }
    }
}

/**
 * Helper to collect all loaded questions across all sets in state
 */
function getAllQuestionsFromSelectedSets() {
    const allQ = [];
    if (state.setQuestionsMap) {
        Object.values(state.setQuestionsMap).forEach(qList => {
            if (Array.isArray(qList)) {
                allQ.push(...qList);
            }
        });
    }
    return allQ;
}
window.loadAllSetsForBook = loadAllSetsForBook;
window.getAllQuestionsFromSelectedSets = getAllQuestionsFromSelectedSets;

function resolveQuizImg(img, bookPath) {
    if (!img) return '';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const pathStr = bookPath ? `${bookPath}/quiz/images/${img}` : `quiz/images/${img}`;
    if (typeof window.getImageUrl === 'function') {
        return window.getImageUrl(pathStr);
    }
    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    return `${rootPath}${pathStr}`;
}

function getQuestionImages(q) {
    if (!q) return [];
    if (q.images && Array.isArray(q.images) && q.images.length > 0) {
        return q.images;
    }
    if (q.image) {
        if (Array.isArray(q.image)) return q.image;
        return String(q.image).split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
}

function getCustomCards() {
    try {
        return JSON.parse(localStorage.getItem('starley_custom_cards') || '[]');
    } catch (e) {
        return [];
    }
}

function mapCardToQuestion(card) {
    return {
        id: card.id,
        setId: 'custom',
        bookPath: card.bookPath,
        questionEn: card.question,
        questionRu: card.question,
        correctAnswer: 'A',
        optionsEn: { 'A': card.answer },
        optionsRu: { 'A': card.answer },
        explanationEn: `Card context: ${card.bookTitle || ''} - ${card.chapterTitle || ''}`,
        explanationRu: `Контекст карточки: ${card.bookTitle || ''} - ${card.chapterTitle || ''}`,
        isCustomCard: true,
        cardAnswer: card.answer
    };
}

// --- Spaced Repetition (Leitner Box) & Sensory System ---

function getQuestionKey(q) {
    if (!q) return 'starley_sr_unknown';
    const qId = q.id !== undefined ? q.id : (q.questionEn || q.question || '').substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_');
    const setId = q.setId || ((state.settings && state.settings.setId) ? state.settings.setId : 'full');
    const bookPath = q.bookPath || state.bookPath || 'general';
    return `starley_sr_${bookPath.replace(/[^a-zA-Z0-9]/g, '_')}_${setId.replace(/[^a-zA-Z0-9]/g, '_')}_${qId}`;
}

function getQuestionTopic(q) {
    const lang = (state.settings && state.settings.lang) ? state.settings.lang : 'Ru';
    const topic = q.topic;
    if (topic) return topic;
    
    // Fallback: Chapter title
    if (q.meta && q.meta.chapter) {
        return getChapterTitle(Array.isArray(q.meta.chapter) ? q.meta.chapter[0] : q.meta.chapter, q.bookPath);
    }
    
    // Fallback 2: Set label or book title
    const book = (state.allBooksWithQuizzes || []).find(b => b.bookPath === q.bookPath);
    if (book && book.quiz_sets) {
        const set = book.quiz_sets.find(s => s.id === q.setId);
        if (set) return set.label;
    }
    return book ? book.meta.title : (lang === 'Ru' ? 'Общие вопросы' : 'General Questions');
}

function getQuestionMastery(q) {
    const key = getQuestionKey(q);
    const stored = localStorage.getItem(key);
    if (!stored) {
        return { state: 'unseen', consecutiveCorrect: 0, views: 0 };
    }
    try {
        const parsed = JSON.parse(stored);
        if (!parsed.state) parsed.state = 'unseen';
        return parsed;
    } catch (e) {
        return { state: 'unseen', consecutiveCorrect: 0, views: 0 };
    }
}

function saveQuestionMastery(q, mastery) {
    const key = getQuestionKey(q);
    mastery.views = (mastery.views || 0) + 1;
    mastery.lastSeen = Date.now();
    localStorage.setItem(key, JSON.stringify(mastery));
}

/**
 * Smart Sampler Algorithm:
 * Guarantees 100% question coverage of selected manifests over multiple quiz runs.
 *
 * Priorities:
 * 1. Unseen questions (views === 0): Target 60% of session count.
 * 2. Weak questions (state === 'red' or errors): Target 30% of session count.
 * 3. Mastered questions (state === 'green' / 'yellow'): Target 10% of session count.
 *
 * Dynamic Overflow:
 * If any bucket has fewer questions than quota (e.g. 100% of questions are already seen),
 * quota transfers dynamically to remaining buckets for spaced repetition.
 */
function sampleSmartQuestions(allQuestionsList, requestedCount) {
    if (allQuestionsList.length <= requestedCount) {
        return shuffleArray([...allQuestionsList]);
    }

    const bucketUnseen = [];
    const bucketWeak = [];
    const bucketMastered = [];

    allQuestionsList.forEach(q => {
        const mastery = getQuestionMastery(q);
        if (mastery.views === 0 || mastery.state === 'unseen') {
            bucketUnseen.push(q);
        } else if (mastery.state === 'red') {
            bucketWeak.push(q);
        } else {
            bucketMastered.push(q);
        }
    });

    let quotaUnseen = Math.round(requestedCount * 0.6);
    let quotaWeak = Math.round(requestedCount * 0.3);
    let quotaMastered = requestedCount - quotaUnseen - quotaWeak;

    const shuffledUnseen = shuffleArray(bucketUnseen);
    const shuffledWeak = shuffleArray(bucketWeak);
    const shuffledMastered = shuffleArray(bucketMastered);

    let takeUnseen = Math.min(shuffledUnseen.length, quotaUnseen);
    let takeWeak = Math.min(shuffledWeak.length, quotaWeak);
    let takeMastered = Math.min(shuffledMastered.length, quotaMastered);

    let totalTaken = takeUnseen + takeWeak + takeMastered;
    let deficit = requestedCount - totalTaken;

    if (deficit > 0) {
        const remainingUnseen = shuffledUnseen.slice(takeUnseen);
        const fillUnseen = Math.min(remainingUnseen.length, deficit);
        takeUnseen += fillUnseen;
        deficit -= fillUnseen;
    }
    if (deficit > 0) {
        const remainingWeak = shuffledWeak.slice(takeWeak);
        const fillWeak = Math.min(remainingWeak.length, deficit);
        takeWeak += fillWeak;
        deficit -= fillWeak;
    }
    if (deficit > 0) {
        const remainingMastered = shuffledMastered.slice(takeMastered);
        const fillMastered = Math.min(remainingMastered.length, deficit);
        takeMastered += fillMastered;
        deficit -= fillMastered;
    }

    const selectedUnseen = shuffledUnseen.slice(0, takeUnseen);
    const selectedWeak = shuffledWeak.slice(0, takeWeak);
    const selectedMastered = shuffledMastered.slice(0, takeMastered);

    let finalBatch = [...selectedUnseen, ...selectedWeak, ...selectedMastered];
    return shuffleArray(finalBatch);
}

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type) {
    if (state.isMuted) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        
        if (type === 'correct') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(1046.50, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
            gain.gain.setValueAtTime(0.2, now + 0.1);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            
            osc.frequency.setValueAtTime(1318.51, now + 0.12);
            gain.gain.setValueAtTime(0, now + 0.12);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.17);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === 'wrong') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.3);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            
            osc.start(now);
            osc.stop(now + 0.1);
        }
    } catch (e) {
        console.warn('Audio feedback failed:', e);
    }
}

function triggerHaptic(type) {
    if (state.isMuted || typeof navigator.vibrate === 'undefined') return;
    try {
        if (type === 'correct') {
            navigator.vibrate(40);
        } else if (type === 'wrong') {
            navigator.vibrate([100, 50, 100]);
        } else if (type === 'click') {
            navigator.vibrate(20);
        }
    } catch (e) {
        console.warn('Haptic feedback failed:', e);
    }
}

/**
 * Renders LaTeX math expressions inside a DOM element using KaTeX auto-render.
 * Supports delimiters: $$...$$, $...$, \[...\], \(...\)
 * Safe to call even if KaTeX is not loaded (no-op in that case).
 */
function renderLatexInElement(el) {
    if (!el || typeof renderMathInElement === 'undefined') return;
    renderMathInElement(el, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$',  right: '$',  display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        errorColor: '#e53935'
    });
}

function _markdownToHtml(txt) {
    if (!txt) return '';
    // Convert **bold** to <strong>
    let html = txt.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Convert *italic* to <em>
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Convert newlines to <br>
    return html.replace(/\n/g, '<br>');
}

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    state.bookPath = params.get('book') || '';

    await initQuizApp();
});

async function initQuizApp() {
    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        if (!state.selectedSets) state.selectedSets = [];
        if (!state.setQuestionsMap) state.setQuestionsMap = {};
        
        if (state.bookPath) {
            const metadataUrl = `${rootPath}${state.bookPath}/metadata.json?v=${Date.now()}`;
            const res = await fetch(metadataUrl);
            const data = await res.json();
            state.bookMeta = data[0];

            if (!state.bookMeta.quiz) {
                throw new Error('This book does not have a quiz configured.');
            }

            document.getElementById('lobby-book-title').textContent = state.bookMeta.title;
            
            // Add to allBooksWithQuizzes for uniformity
            state.allBooksWithQuizzes = [{
                bookPath: state.bookPath,
                meta: state.bookMeta,
                quiz_sets: state.bookMeta.quiz_sets || []
            }];
            
            // Default select the first set
            if (state.bookMeta.quiz_sets && state.bookMeta.quiz_sets.length > 0) {
                const defaultSet = state.bookMeta.quiz_sets[0];
                state.selectedSets = [{
                    bookPath: state.bookPath,
                    setId: defaultSet.id,
                    file: defaultSet.file,
                    label: defaultSet.label,
                    bookTitle: state.bookMeta.title
                }];
            }
        } else {
            // Global mode
            document.getElementById('lobby-book-title').textContent = 'Starley Clinical Quiz';
            
            const response = await fetch(`${rootPath}library.json`);
            if (!response.ok) {
                throw new Error(`Failed to load library registry (HTTP ${response.status})`);
            }
            const data = await response.json();
            const categories = data.categories;

            const metadataPromises = [];
            state.allBooksWithQuizzes = [];

            for (const category of categories) {
                for (const book of category.books) {
                    const bookPath = `${category.path}/${book.folder}`;
                    metadataPromises.push(
                        fetch(`${rootPath}${bookPath}/metadata.json`)
                            .then(async r => {
                                if (r.ok) {
                                    const metaList = await r.json();
                                    const meta = metaList[0];
                                    if (meta && meta.quiz) {
                                        state.allBooksWithQuizzes.push({
                                            bookPath: bookPath,
                                            meta: meta,
                                            quiz_sets: meta.quiz_sets || []
                                        });
                                    }
                                }
                            })
                            .catch(err => console.error(`Error loading metadata for ${bookPath}`, err))
                    );
                }
            }
            await Promise.all(metadataPromises);
        }

        renderQuizSets();
        setupLobbyListeners();
        setupProfileListeners();
        setupQuestionListeners();
        setupResultsListeners();
        setupPreviewModal();
        _initializeSearchIndex();
        initializeMuteControls();

    } catch (err) {
        console.error('[Quiz] Init error:', err);
        alert(err.message);
    }
}

function initializeMuteControls() {
    const updateIcons = () => {
        const iconClass = state.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        const muteLobby = document.getElementById('btn-mute-lobby');
        const muteQuestion = document.getElementById('btn-mute-question');
        if (muteLobby) {
            const icon = muteLobby.querySelector('i');
            if (icon) icon.className = iconClass;
        }
        if (muteQuestion) {
            const icon = muteQuestion.querySelector('i');
            if (icon) icon.className = iconClass;
        }
    };

    const toggleMute = () => {
        state.isMuted = !state.isMuted;
        localStorage.setItem('starley_quiz_mute', state.isMuted ? 'true' : 'false');
        updateIcons();
        playSound('click');
        triggerHaptic('click');
    };

    const btnLobby = document.getElementById('btn-mute-lobby');
    if (btnLobby) btnLobby.onclick = toggleMute;

    const btnQ = document.getElementById('btn-mute-question');
    if (btnQ) btnQ.onclick = toggleMute;

    updateIcons();
}

async function updateWeakSpotRadar() {
    const radarCard = document.getElementById('lobby-radar-card');
    if (!radarCard) return;

    if (!state.selectedSets || state.selectedSets.length === 0) {
        radarCard.style.display = 'none';
        return;
    }

    let allQs = [];
    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    
    for (const set of state.selectedSets) {
        const cacheKey = `${set.bookPath}::${set.setId}`;
        let questions = state.setQuestionsMap[cacheKey];
        if (!questions) {
            try {
                const quizUrl = `${rootPath}${set.bookPath}/${set.file}?v=${Date.now()}`;
                const res = await fetch(quizUrl);
                const data = await res.json();
                questions = data.questions || [];
                questions.forEach(q => {
                    q.bookPath = set.bookPath;
                    q.meta = data.meta;
                });
                state.setQuestionsMap[cacheKey] = questions;
            } catch (err) {
                console.error(err);
                continue;
            }
        }
        questions.forEach(q => {
            q.setId = set.setId;
            allQs.push(q);
        });
    }

    if (allQs.length === 0) {
        radarCard.style.display = 'none';
        return;
    }

    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;

    const topicGroups = {};

    allQs.forEach(q => {
        const mastery = getQuestionMastery(q);
        if (mastery.state === 'green') greenCount++;
        else if (mastery.state === 'yellow') yellowCount++;
        else redCount++;

        const topic = getQuestionTopic(q);
        if (!topicGroups[topic]) {
            topicGroups[topic] = { total: 0, green: 0, yellow: 0, red: 0 };
        }
        topicGroups[topic].total++;
        if (mastery.state === 'green') topicGroups[topic].green++;
        else if (mastery.state === 'yellow') topicGroups[topic].yellow++;
        else topicGroups[topic].red++;
    });

    const totalQs = allQs.length;
    const overallMasteryPct = Math.round(((greenCount + yellowCount * 0.5) / totalQs) * 100) || 0;

    document.getElementById('mastery-pct-val').textContent = `${overallMasteryPct}%`;
    document.getElementById('cnt-green').textContent = greenCount;
    document.getElementById('cnt-yellow').textContent = yellowCount;
    document.getElementById('cnt-red').textContent = redCount;

    document.getElementById('radar-progress-green').style.width = `${(greenCount / totalQs) * 100}%`;
    document.getElementById('radar-progress-yellow').style.width = `${(yellowCount / totalQs) * 100}%`;
    document.getElementById('radar-progress-red').style.width = `${(redCount / totalQs) * 100}%`;

    const chipsContainer = document.getElementById('radar-topic-chips');
    chipsContainer.innerHTML = '';

    const isRu = state.settings.lang === 'Ru';

    const topicsArray = Object.entries(topicGroups).map(([name, stats]) => {
        const mastery = Math.round(((stats.green + stats.yellow * 0.5) / stats.total) * 100) || 0;
        return { name, stats, mastery };
    });
    topicsArray.sort((a, b) => a.mastery - b.mastery);

    topicsArray.forEach(({ name, stats, mastery }) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        
        let stateClass = 'weak';
        let iconHtml = '<i class="fas fa-triangle-exclamation"></i>';
        let attentionMsg = isRu ? ' (Требует внимания!)' : ' (Needs Attention!)';

        if (mastery >= 80) {
            stateClass = 'mastered';
            iconHtml = '<i class="fas fa-check-circle"></i>';
            attentionMsg = isRu ? ' (Освоено)' : ' (Mastered)';
        } else if (mastery >= 50) {
            stateClass = 'review';
            iconHtml = '<i class="fas fa-circle-notch"></i>';
            attentionMsg = isRu ? ' (В процессе)' : ' (Reviewing)';
        }

        chip.className = `radar-topic-chip ${stateClass}`;
        chip.innerHTML = `${iconHtml} <span>${name}: ${mastery}%${attentionMsg}</span>`;
        chip.onclick = () => {
            playSound('click');
            triggerHaptic('click');
            startExpressQuiz(name);
        };
        chipsContainer.appendChild(chip);
    });

    drawRadarChart(topicsArray);
    radarCard.style.display = 'block';
}

function drawRadarChart(topicsArray) {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (topicsArray.length < 3) {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'inline-block';

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    const numAxes = Math.min(topicsArray.length, 8);
    const axesTopics = topicsArray.slice(0, numAxes);
    const angleSlice = (Math.PI * 2) / numAxes;

    const numGrids = 4;
    ctx.strokeStyle = 'rgba(48, 54, 61, 0.6)';
    ctx.lineWidth = 1;

    for (let g = 1; g <= numGrids; g++) {
        const r = (radius / numGrids) * g;
        ctx.beginPath();
        for (let i = 0; i < numAxes; i++) {
            const angle = i * angleSlice - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = '#8b949e';
        ctx.font = '8px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${(100 / numGrids) * g}%`, centerX, centerY - r + 10);
    }

    axesTopics.forEach((topic, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const outerX = centerX + Math.cos(angle) * radius;
        const outerY = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(outerX, outerY);
        ctx.strokeStyle = 'rgba(48, 54, 61, 0.8)';
        ctx.stroke();

        const labelDistance = radius + 15;
        const labelX = centerX + Math.cos(angle) * labelDistance;
        const labelY = centerY + Math.sin(angle) * labelDistance;

        ctx.fillStyle = topic.mastery < 50 ? '#da3633' : (topic.mastery < 80 ? '#d29922' : '#238636');
        ctx.font = 'bold 9px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let labelText = topic.name;
        if (labelText.length > 15) {
            labelText = labelText.substring(0, 12) + '...';
        }
        ctx.fillText(labelText, labelX, labelY);
    });

    ctx.beginPath();
    axesTopics.forEach((topic, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const r = (topic.mastery / 100) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    grad.addColorStop(0, 'rgba(88, 166, 255, 0.15)');
    grad.addColorStop(1, 'rgba(88, 166, 255, 0.35)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    axesTopics.forEach((topic, i) => {
        const angle = i * angleSlice - Math.PI / 2;
        const r = (topic.mastery / 100) * radius;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = topic.mastery < 50 ? '#da3633' : (topic.mastery < 80 ? '#d29922' : '#238636');
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
    });
}

function startExpressQuiz(topicName) {
    state.activeTopicFilter = topicName;
    startQuiz();
}

function toggleSetSelection(bookPath, set, bookTitle) {
    const existsIdx = state.selectedSets.findIndex(s => s.bookPath === bookPath && s.setId === set.id);
    if (existsIdx > -1) {
        state.selectedSets.splice(existsIdx, 1);
    } else {
        state.selectedSets.push({
            bookPath: bookPath,
            setId: set.id,
            file: set.file,
            label: set.label,
            bookTitle: bookTitle
        });
    }
    updateSliderForSelectedSets();
    if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
}

function renderCustomSetOption(parentContainer, count, bookPath, bookTitle) {
    const isRu = state.settings.lang === 'Ru';
    const set = {
        id: 'custom',
        file: '',
        label: isRu ? `Мой персональный сет (${count})` : `My Personal Set (${count})`
    };
    const isSelected = state.selectedSets.some(s => s.setId === 'custom' && s.bookPath === bookPath);
    const div = document.createElement('div');
    div.className = `set-option custom-set-option ${isSelected ? 'active' : ''}`;
    div.innerHTML = `
        <span class="set-checkbox-icon"><i class="${isSelected ? 'fas fa-check-square' : 'far fa-square'}"></i></span>
        <span class="set-label"><span style="margin-right:6px">🎴</span>${set.label}</span>
    `;
    div.onclick = async () => {
        toggleSetSelection(bookPath, set, bookTitle);
        const stillSelected = state.selectedSets.some(s => s.setId === 'custom' && s.bookPath === bookPath);
        div.classList.toggle('active', stillSelected);
        div.querySelector('.set-checkbox-icon i').className = stillSelected ? 'fas fa-check-square' : 'far fa-square';
    };
    parentContainer.appendChild(div);
}

function renderFavoritesSetOption(parentContainer, count) {
    const isRu = state.settings.lang === 'Ru';
    const set = {
        id: 'favorites',
        file: '',
        label: isRu ? `Избранные вопросы (${count})` : `Starred Favorites (${count})`
    };
    const isSelected = state.selectedSets.some(s => s.setId === 'favorites');
    const div = document.createElement('div');
    div.className = `set-option favorites-set-option ${isSelected ? 'active' : ''}`;
    div.style.borderColor = 'rgba(234, 179, 8, 0.4)';
    div.style.background = isSelected ? 'rgba(234, 179, 8, 0.15)' : 'rgba(13, 17, 23, 0.6)';
    div.innerHTML = `
        <span class="set-checkbox-icon"><i class="${isSelected ? 'fas fa-check-square' : 'far fa-square'}"></i></span>
        <span class="set-label" style="color: #f59e0b; font-weight: 700;"><span style="margin-right:6px">⭐</span>${set.label}</span>
    `;
    div.onclick = async () => {
        toggleSetSelection('favorites', set, 'Starred Favorites');
        const stillSelected = state.selectedSets.some(s => s.setId === 'favorites');
        div.classList.toggle('active', stillSelected);
        div.style.background = stillSelected ? 'rgba(234, 179, 8, 0.15)' : 'rgba(13, 17, 23, 0.6)';
        div.querySelector('.set-checkbox-icon i').className = stillSelected ? 'fas fa-check-square' : 'far fa-square';
    };
    parentContainer.appendChild(div);
}

function renderQuizSets() {
    const container = document.getElementById('quiz-set-list');
    container.innerHTML = '';

    if (state.bookPath) {
        // Render custom sets at the top if there are any
        const customCards = getCustomCards().filter(c => c.bookPath === state.bookPath);
        if (customCards.length > 0) {
            renderCustomSetOption(container, customCards.length, state.bookPath, state.bookMeta.title);
        }

        const sets = state.bookMeta.quiz_sets || [];
        sets.forEach(set => {
            const isSelected = state.selectedSets.some(s => s.setId === set.id && s.bookPath === state.bookPath);
            const div = document.createElement('div');
            div.className = `set-option ${isSelected ? 'active' : ''}`;
            div.innerHTML = `
                <span class="set-checkbox-icon"><i class="${isSelected ? 'fas fa-check-square' : 'far fa-square'}"></i></span>
                <span class="set-label">${set.label}</span>
            `;
            div.onclick = async () => {
                toggleSetSelection(state.bookPath, set, state.bookMeta.title);
                const stillSelected = state.selectedSets.some(s => s.setId === set.id && s.bookPath === state.bookPath);
                div.classList.toggle('active', stillSelected);
                div.querySelector('.set-checkbox-icon i').className = stillSelected ? 'fas fa-check-square' : 'far fa-square';
            };
            container.appendChild(div);
        });
        
        if (sets.length > 0 || customCards.length > 0) {
            updateSliderForSelectedSets();
        }
    } else {
        // Global mode
        const customCards = getCustomCards();
        if (customCards.length > 0) {
            const customGroupDiv = document.createElement('div');
            customGroupDiv.className = 'lobby-book-group';
            
            const customTitle = document.createElement('h4');
            customTitle.className = 'lobby-book-group-title';
            customTitle.textContent = state.settings.lang === 'Ru' ? 'Персональные карточки' : 'Personal Cards';
            customGroupDiv.appendChild(customTitle);
            
            const setsGrid = document.createElement('div');
            setsGrid.className = 'quiz-set-grid';
            
            renderCustomSetOption(setsGrid, customCards.length, 'custom', 'Custom Deck');
            
            customGroupDiv.appendChild(setsGrid);
            container.appendChild(customGroupDiv);
        }

        state.allBooksWithQuizzes.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'lobby-book-group';
            
            const bookTitle = document.createElement('h4');
            bookTitle.className = 'lobby-book-group-title';
            bookTitle.textContent = book.meta.title;
            bookDiv.appendChild(bookTitle);
            
            const setsGrid = document.createElement('div');
            setsGrid.className = 'quiz-set-grid';
            
            book.quiz_sets.forEach(set => {
                const isSelected = state.selectedSets.some(s => s.setId === set.id && s.bookPath === book.bookPath);
                const div = document.createElement('div');
                div.className = `set-option ${isSelected ? 'active' : ''}`;
                div.innerHTML = `
                    <span class="set-checkbox-icon"><i class="${isSelected ? 'fas fa-check-square' : 'far fa-square'}"></i></span>
                    <span class="set-label">${set.label}</span>
                `;
                div.onclick = async () => {
                    toggleSetSelection(book.bookPath, set, book.meta.title);
                    const stillSelected = state.selectedSets.some(s => s.setId === set.id && s.bookPath === book.bookPath);
                    div.classList.toggle('active', stillSelected);
                    div.querySelector('.set-checkbox-icon i').className = stillSelected ? 'fas fa-check-square' : 'far fa-square';
                };
                setsGrid.appendChild(div);
            });
            
            bookDiv.appendChild(setsGrid);
            container.appendChild(bookDiv);
        });
        
        updateSliderForSelectedSets();
    }
}

async function updateSliderForSelectedSets() {
    let totalQs = 0;
    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    
    const promises = state.selectedSets.map(async (set) => {
        const cacheKey = `${set.bookPath}::${set.setId}`;
        if (state.setQuestionsMap[cacheKey]) {
            totalQs += state.setQuestionsMap[cacheKey].length;
            return;
        }
        
        if (set.setId === 'custom') {
            const cards = getCustomCards();
            const relevantCards = set.bookPath === 'custom' ? cards : cards.filter(c => c.bookPath === set.bookPath);
            const questions = relevantCards.map(card => mapCardToQuestion(card));
            state.setQuestionsMap[cacheKey] = questions;
            totalQs += questions.length;
            return;
        }
        
        try {
            const quizUrl = `${rootPath}${set.bookPath}/${set.file}?v=${Date.now()}`;
            const res = await fetch(quizUrl);
            const data = await res.json();
            
            data.questions.forEach(q => {
                q.bookPath = set.bookPath;
                q.meta = data.meta;
            });
            
            state.setQuestionsMap[cacheKey] = data.questions;
            totalQs += data.questions.length;
        } catch (err) {
            console.error('[Quiz] Failed to pre-load set for slider:', set, err);
        }
    });
    
    await Promise.all(promises);
    
    const slider = document.getElementById('setting-count');
    const valCount = document.getElementById('val-count');
    if (slider) {
        slider.min = totalQs > 0 ? Math.min(5, totalQs) : 0;
        slider.max = totalQs;
        if (state.settings.count > totalQs || state.settings.count === parseInt(slider.max) || totalQs === 0) {
            slider.value = totalQs;
            state.settings.count = totalQs;
        } else {
            slider.value = state.settings.count;
        }
        
        if (valCount) {
            const isRu = state.settings.lang === 'Ru';
            valCount.textContent = (state.settings.count === totalQs) ? (isRu ? 'Все' : 'All') : state.settings.count;
        }
        
        const lblQuestionsCount = document.getElementById('label-questions-count');
        if (lblQuestionsCount && valCount) {
            const isRu = state.settings.lang === 'Ru';
            lblQuestionsCount.innerHTML = (isRu ? 'Количество вопросов: ' : 'Questions: ') + `<span id="val-count">${valCount.textContent}</span>`;
        }
    }

    updatePresetBadgeActiveState();

    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
        startBtn.disabled = state.selectedSets.length === 0;
    }
    
    // Update Spaced Repetition Radar / Mastery dashboard on selected sets change
    updateWeakSpotRadar();
}

function updatePresetBadgeActiveState() {
    const presetBtns = document.querySelectorAll('.preset-badge-btn');
    const slider = document.getElementById('setting-count');
    const valCount = document.getElementById('val-count');
    const maxVal = slider ? parseInt(slider.max) : 300;
    const currentVal = state.settings.count;
    const isRu = state.settings.lang === 'Ru';

    presetBtns.forEach(btn => {
        const countAttr = btn.dataset.count;
        if (countAttr === 'all') {
            const isAll = (currentVal >= maxVal || currentVal === 'all' || (maxVal > 0 && currentVal === maxVal));
            btn.classList.toggle('active', isAll);
        } else {
            const countNum = parseInt(countAttr);
            btn.classList.toggle('active', currentVal === countNum);
        }
    });

    if (valCount) {
        if (currentVal >= maxVal || currentVal === 'all' || (maxVal > 0 && currentVal === maxVal)) {
            valCount.textContent = isRu ? 'Все' : 'All';
        } else {
            valCount.textContent = currentVal;
        }
    }
}

// ==========================================================================
// USER PROFILE & AVATAR PROGRESS MANAGEMENT MODULE
// ==========================================================================

const AVATAR_ICONS_MAP = {
    doc: 'fas fa-stethoscope',
    heart: 'fas fa-heart-pulse',
    brain: 'fas fa-brain',
    flask: 'fas fa-flask-vial',
    bolt: 'fas fa-bolt',
    titan: 'fas fa-dumbbell',
    guru: 'fas fa-spa',
    rocket: 'fas fa-rocket'
};

function loadUserProfile() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    let localProfile = null;
    try {
        const stored = localStorage.getItem('starley_user_profile');
        if (stored) localProfile = JSON.parse(stored);
    } catch (e) {}

    if (user && !user.isGuest) {
        return {
            nickname: (localProfile && localProfile.nickname) || user.nickname || user.username || 'Doctor',
            avatar: (localProfile && localProfile.avatar) || user.avatar || 'doc',
            streak: (localProfile && localProfile.streak) || 1,
            lastActiveDate: (localProfile && localProfile.lastActiveDate) || new Date().toDateString(),
            totalSolved: (localProfile && localProfile.totalSolved) || 0,
            correctCount: (localProfile && localProfile.correctCount) || 0,
            level: (localProfile && localProfile.level) || 1,
            currentExp: (localProfile && localProfile.currentExp) || 0,
            totalExp: (localProfile && localProfile.totalExp) || 0,
            tierId: (localProfile && localProfile.tierId) || 1
        };
    }
    
    return {
        nickname: (localProfile && localProfile.nickname) || 'Guest Doctor',
        avatar: (localProfile && localProfile.avatar) || 'doc',
        streak: (localProfile && localProfile.streak) || 1,
        lastActiveDate: (localProfile && localProfile.lastActiveDate) || new Date().toDateString(),
        totalSolved: (localProfile && localProfile.totalSolved) || 0,
        correctCount: (localProfile && localProfile.correctCount) || 0,
        level: (localProfile && localProfile.level) || 1,
        currentExp: (localProfile && localProfile.currentExp) || 0,
        totalExp: (localProfile && localProfile.totalExp) || 0,
        tierId: (localProfile && localProfile.tierId) || 1
    };
}

function saveUserProfile(profile) {
    try {
        localStorage.setItem('starley_user_profile', JSON.stringify(profile));
    } catch (e) {}
}

// Legacy updateUserProfileDisplay superseded by unified RPG 100-tier prestige engine (see line 5175+)

const DOCTOR_RANKS_50 = [
    { level: 1, en: "Medical Student I", ru: "Студент I" },
    { level: 2, en: "Medical Student II", ru: "Студент II" },
    { level: 3, en: "Medical Student III", ru: "Студент III" },
    { level: 4, en: "Medical Student IV", ru: "Студент IV" },
    { level: 5, en: "Medical Student V", ru: "Студент V" },
    { level: 6, en: "Junior Intern I", ru: "Младший интерн I" },
    { level: 7, en: "Junior Intern II", ru: "Младший интерн II" },
    { level: 8, en: "Junior Intern III", ru: "Младший интерн III" },
    { level: 9, en: "Junior Intern IV", ru: "Младший интерн IV" },
    { level: 10, en: "Chief Intern", ru: "Главный интерн" },
    { level: 11, en: "Resident I", ru: "Резидент I" },
    { level: 12, en: "Resident II", ru: "Резидент II" },
    { level: 13, en: "Resident III", ru: "Резидент III" },
    { level: 14, en: "Senior Resident", ru: "Старший резидент" },
    { level: 15, en: "Chief Resident", ru: "Главный резидент" },
    { level: 16, en: "Clinical Fellow I", ru: "Клинический Fellow I" },
    { level: 17, en: "Clinical Fellow II", ru: "Клинический Fellow II" },
    { level: 18, en: "Clinical Fellow III", ru: "Клинический Fellow III" },
    { level: 19, en: "Senior Fellow", ru: "Старший Fellow" },
    { level: 20, en: "Chief Fellow", ru: "Главный Fellow" },
    { level: 21, en: "Junior Attending", ru: "Младший врач" },
    { level: 22, en: "Attending Physician I", ru: "Врач-специалист I" },
    { level: 23, en: "Attending Physician II", ru: "Врач-специалист II" },
    { level: 24, en: "Senior Attending", ru: "Старший врач-специалист" },
    { level: 25, en: "Staff Physician", ru: "Штатный врач клиники" },
    { level: 26, en: "Senior Specialist I", ru: "Ведущий специалист I" },
    { level: 27, en: "Senior Specialist II", ru: "Ведущий специалист II" },
    { level: 28, en: "Department Specialist", ru: "Специалист отделения" },
    { level: 29, en: "Associate Consultant", ru: "Консультант клиники" },
    { level: 30, en: "Senior Consultant", ru: "Главный консультант" },
    { level: 31, en: "Assistant Professor I", ru: "Ассистент кафедры I" },
    { level: 32, en: "Assistant Professor II", ru: "Ассистент кафедры II" },
    { level: 33, en: "Associate Professor I", ru: "Доцент I" },
    { level: 34, en: "Associate Professor II", ru: "Доцент II" },
    { level: 35, en: "Professor of Medicine", ru: "Профессор медицины" },
    { level: 36, en: "Distinguished Professor", ru: "Заслуженный профессор" },
    { level: 37, en: "Department Vice-Chair", ru: "Зам. заведующего отделением" },
    { level: 38, en: "Department Chair", ru: "Заведующий отделением" },
    { level: 39, en: "Medical Director", ru: "Медицинский директор" },
    { level: 40, en: "Chief Medical Officer", ru: "Главный врач клиники" },
    { level: 41, en: "Academic Fellow", ru: "Действительный член Академии" },
    { level: 42, en: "Corresponding Member", ru: "Член-корреспондент" },
    { level: 43, en: "Academician I", ru: "Академик I" },
    { level: 44, en: "Senior Academician", ru: "Старший академик" },
    { level: 45, en: "Master of Surgery", ru: "Мастер кардиохирургии" },
    { level: 46, en: "Distinguished Scholar", ru: "Заслуженный деятель науки" },
    { level: 47, en: "National Expert", ru: "Национальный эксперт" },
    { level: 48, en: "Global Pioneer", ru: "Мировой пионер медицины" },
    { level: 49, en: "Medical Luminary", ru: "Корифей медицины" },
    { level: 50, en: "Grand Medical Legend", ru: "Легенда медицины" }
];

function calculate50LevelAndRank(uniqueSolved, totalBank, recentAccuracy, lang = 'Ru') {
    const totalQBank = Math.max(totalBank || 3000, 3000);
    const coverageFraction = Math.min(uniqueSolved / totalQBank, 1.0);
    let rawLevel = Math.min(50, Math.floor(coverageFraction * 50) + 1);

    let effectiveLevel = rawLevel;
    let isDegraded = false;

    // Apply accuracy degradation penalties
    if (rawLevel >= 45) {
        if (recentAccuracy < 90 || coverageFraction < 0.85) {
            const drop = Math.ceil((90 - Math.min(recentAccuracy, 90)) / 2) + (coverageFraction < 0.85 ? 5 : 0);
            effectiveLevel = Math.max(44, rawLevel - drop);
            isDegraded = true;
        }
    } else if (rawLevel >= 31) {
        if (recentAccuracy < 80) {
            const drop = Math.ceil((80 - recentAccuracy) / 3);
            effectiveLevel = Math.max(1, rawLevel - drop);
            isDegraded = true;
        }
    } else if (rawLevel >= 16) {
        if (recentAccuracy < 70) {
            const drop = Math.ceil((70 - recentAccuracy) / 4);
            effectiveLevel = Math.max(1, rawLevel - drop);
            isDegraded = true;
        }
    } else if (rawLevel >= 1) {
        if (recentAccuracy < 60) {
            const drop = Math.ceil((60 - recentAccuracy) / 5);
            effectiveLevel = Math.max(1, rawLevel - drop);
            isDegraded = true;
        }
    }

    effectiveLevel = Math.max(1, Math.min(50, effectiveLevel));
    const rankObj = DOCTOR_RANKS_50.find(r => r.level === effectiveLevel) || DOCTOR_RANKS_50[0];
    const title = lang === 'Ru' ? rankObj.ru : rankObj.en;

    return {
        level: effectiveLevel,
        rawLevel: rawLevel,
        title: title,
        isDegraded: isDegraded,
        badgeText: `Lv.${effectiveLevel} ${title}`
    };
}

function setupProfileListeners() {
    updateUserProfileDisplay();
}

// ==========================================================================
// FAVORITES & ADMIN REPORT FEEDBACK MODULE
// ==========================================================================

function getFavoriteQuestionKeys() {
    try {
        return JSON.parse(localStorage.getItem('starley_favorite_questions') || '[]');
    } catch (e) {
        return [];
    }
}

function isFavoriteQuestion(q) {
    if (!q) return false;
    const specId = getQuestionSpecialId(q);
    if (!specId || !Array.isArray(state.userFavorites)) return false;
    return state.userFavorites.some(f => {
        const id = (typeof f === 'string') ? f.trim() : String((f && (f.id || f.specialId)) || '').trim();
        return id === specId;
    });
}

function toggleFavoriteQuestion(q) {
    if (!q) return;
    const specId = getQuestionSpecialId(q);
    if (!specId || specId === '[object Object]') return;

    if (!Array.isArray(state.userFavorites)) state.userFavorites = [];
    state.userFavorites = sanitizeFavoritesList(state.userFavorites);

    const existingIndex = state.userFavorites.indexOf(specId);
    let isFav = false;

    if (existingIndex >= 0) {
        state.userFavorites.splice(existingIndex, 1);
        isFav = false;
    } else {
        state.userFavorites.push(specId);
        isFav = true;
    }

    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        const icon = btnFav.querySelector('i');
        if (icon) icon.className = isFav ? 'fas fa-star' : 'far fa-star';
        btnFav.style.transform = 'scale(1.3)';
        setTimeout(() => btnFav.style.transform = 'scale(1)', 200);
    }

    playSound('click');
    triggerHaptic('click');

    syncCloudUserData();
    if (typeof renderPlaylistsTab === 'function') renderPlaylistsTab();
    if (typeof updateQuizStatsUI === 'function') updateQuizStatsUI();

    // Offer to add question to 1 or more collections (Playlists) when favorited
    if (isFav && typeof window.openPlaylistPickerModal === 'function') {
        window.openPlaylistPickerModal(q);
    }
}
window.toggleFavoriteQuestion = toggleFavoriteQuestion;

window.openPlaylistPickerModal = function(q) {
    if (!q) return;
    ensureTenPlaylists();
    const specId = getQuestionSpecialId(q);
    const modal = document.getElementById('quiz-playlist-picker-modal');
    const previewEl = document.getElementById('pl-picker-q-preview');
    const listEl = document.getElementById('pl-picker-list');
    const isRu = state.settings.lang === 'Ru';

    if (previewEl) {
        const snippet = (isRu ? (q.questionRu || q.questionEn) : (q.questionEn || q.questionRu)) || q.question || '';
        const cleanSnippet = snippet.replace(/<[^>]*>/g, '').substring(0, 90);
        previewEl.innerHTML = `<strong>Special ID: <span style="color:#eab308;">${specId}</span></strong><br><span style="color:var(--quiz-muted);">${escapeHTML(cleanSnippet)}</span>`;
    }

    if (listEl) {
        listEl.innerHTML = state.userPlaylists.map(pl => {
            const iconChar = getPlaylistIconChar(pl.iconId);
            const contains = Array.isArray(pl.questionIds) && pl.questionIds.includes(specId);
            return `
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: rgba(13,17,23,0.5); border: 1px solid ${contains ? '#58a6ff' : 'var(--quiz-border)'}; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" ${contains ? 'checked' : ''} onchange="toggleQuestionInPlaylist(${pl.id}, '${specId}')" style="width: 18px; height: 18px; accent-color: #58a6ff; cursor: pointer;">
                        <span style="font-size: 1.2rem;">${iconChar}</span>
                        <span style="font-weight: 700; font-size: 0.9rem; color: var(--quiz-text);">${escapeHTML(pl.title)}</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--quiz-muted);">${(pl.questionIds || []).length} ${isRu ? 'вопросов' : 'Qs'}</span>
                </label>
            `;
        }).join('');
    }

    if (modal) modal.style.display = 'flex';
};

window.toggleQuestionInPlaylist = function(playlistId, specId) {
    const pl = state.userPlaylists.find(p => p.id === playlistId || String(p.id) === String(playlistId));
    if (!pl) return;
    if (!Array.isArray(pl.questionIds)) pl.questionIds = [];

    if (pl.questionIds.includes(specId)) {
        pl.questionIds = pl.questionIds.filter(id => id !== specId);
    } else {
        pl.questionIds.push(specId);
    }
    pl.count = pl.questionIds.length;

    syncCloudUserData();
    renderPlaylistsTab();
};

window.toggleCurrentFavoriteQuestion = function() {
    let q = (state.questions && state.questions.length > 0) ? state.questions[state.currentIndex] : null;
    if (!q && state.currentQuestion) q = state.currentQuestion;
    if (q) {
        toggleFavoriteQuestion(q);
    }
};

function openReportModal(q) {
    const reportModal = document.getElementById('quiz-report-modal');
    if (!reportModal || !q) return;

    const isRu = state.settings.lang === 'Ru';
    const qIdMeta = document.getElementById('report-q-id-meta');
    const qSnippet = document.getElementById('report-q-text-snippet');
    const commentInput = document.getElementById('input-report-comment');

    if (qIdMeta) qIdMeta.textContent = `${isRu ? 'ID Вопроса' : 'Question ID'}: ${q.id || 'N/A'} | ${isRu ? 'Тема' : 'Topic'}: ${getQuestionTopic(q)}`;
    if (qSnippet) qSnippet.textContent = `"${(q.questionEn || q.question || '').substring(0, 100)}..."`;
    if (commentInput) commentInput.value = '';

    const txtReportTitle = document.getElementById('txt-report-title');
    if (txtReportTitle) txtReportTitle.textContent = isRu ? 'Сообщить об ошибке админу' : 'Report Question / Admin Feedback';

    const lblReportReason = document.getElementById('lbl-report-reason');
    if (lblReportReason) lblReportReason.textContent = isRu ? 'Тип замечания' : 'Issue Type';

    const lblReportComment = document.getElementById('lbl-report-comment');
    if (lblReportComment) lblReportComment.textContent = isRu ? 'Ваш комментарий / Клиническое обоснование' : 'Your Comment / Clinical Rationale';

    const lblSubmitReportBtn = document.getElementById('lbl-submit-report-btn');
    if (lblSubmitReportBtn) lblSubmitReportBtn.textContent = isRu ? 'Отправить замечание' : 'Send Feedback';

    const selectReason = document.getElementById('select-report-reason');
    if (selectReason) {
        selectReason.options[0].text = isRu ? 'Не согласен с верным ответом' : 'Incorrect correct answer / Disagree with answer';
        selectReason.options[1].text = isRu ? 'Опечатка / Ошибка перевода' : 'Typo / Translation error in question';
        selectReason.options[2].text = isRu ? 'Непонятное или отсутствующее объяснение' : 'Unclear or missing clinical explanation';
        selectReason.options[3].text = isRu ? 'Ошибки в изображениях или форматировании' : 'Broken image or formatting issue';
        selectReason.options[4].text = isRu ? 'Другое замечание' : 'Other feedback';
    }

    reportModal.style.display = 'flex';
    playSound('click');
    triggerHaptic('click');
}

function closeReportModal() {
    const reportModal = document.getElementById('quiz-report-modal');
    if (reportModal) reportModal.style.display = 'none';
}

function submitReportModal() {
    const q = state.questions[state.currentIndex];
    const selectReason = document.getElementById('select-report-reason');
    const commentInput = document.getElementById('input-report-comment');
    const isRu = state.settings.lang === 'Ru';

    const reportObj = {
        questionId: q ? q.id : 'unknown',
        questionText: q ? (q.questionEn || q.question || '') : '',
        bookPath: q ? q.bookPath : '',
        topic: q ? getQuestionTopic(q) : '',
        userNickname: state.userProfile ? state.userProfile.nickname : 'Anonymous',
        reason: selectReason ? selectReason.value : 'other',
        reasonText: selectReason ? selectReason.options[selectReason.selectedIndex].text : '',
        userComment: commentInput ? commentInput.value.trim() : '',
        timestamp: new Date().toISOString()
    };

    try {
        const existing = JSON.parse(localStorage.getItem('starley_feedback_reports') || '[]');
        existing.push(reportObj);
        localStorage.setItem('starley_feedback_reports', JSON.stringify(existing));
    } catch (e) {}

    // Send Telegram Notification to Admin
    sendTelegramAdminReport(reportObj);

    closeReportModal();
    playSound('correct');
    triggerHaptic('correct');

    alert(isRu ? '✅ Спасибо! Замечание мгновенно передано администратору.' : '✅ Thank you! Feedback has been sent to the administrator.');
}

const TELEGRAM_BOT_TOKEN = '8776764036:AAEjdwQQjmB2zxuF4ILgBDVcJgwdu0FdQ5c';

function escapeTelegramHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

async function sendTelegramAdminReport(reportObj) {
    let chatId = localStorage.getItem('starley_admin_telegram_chat_id') || '954588841';

    // If chat_id is not cached yet, fetch it dynamically from getUpdates
    if (!chatId) {
        try {
            const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
            const updatesData = await updatesRes.json();
            if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
                // Find last message chat ID
                for (let i = updatesData.result.length - 1; i >= 0; i--) {
                    const item = updatesData.result[i];
                    if (item.message && item.message.chat) {
                        chatId = item.message.chat.id;
                        localStorage.setItem('starley_admin_telegram_chat_id', chatId);
                        break;
                    }
                }
            }
        } catch (e) {
            console.warn('[Telegram] Failed to fetch chat_id automatically:', e);
        }
    }

    if (!chatId) {
        console.warn('[Telegram] Chat ID not found yet. Admin needs to press /start in @CSbugs_bot.');
        return false;
    }

    const reasonIcons = {
        answer_disagree: '❌',
        typo_error: '✏️',
        missing_explanation: '💡',
        broken_image: '🖼️',
        other: '💬'
    };

    const icon = reasonIcons[reportObj.reason] || '🚩';
    const qSnippet = (reportObj.questionText || '').substring(0, 150);

    const messageHtml = `
${icon} <b>НОВОЕ ЗАМЕЧАНИЕ ПО ВОПРОСУ</b>

👤 <b>От:</b> ${escapeTelegramHtml(reportObj.userNickname)}
📌 <b>ID Вопроса:</b> <code>${escapeTelegramHtml(reportObj.questionId)}</code>
📚 <b>Тема/Манифест:</b> ${escapeTelegramHtml(reportObj.topic)}

⚠️ <b>Проблема:</b> ${escapeTelegramHtml(reportObj.reasonText)}

📝 <b>Фрагмент вопроса:</b>
<i>"${escapeTelegramHtml(qSnippet)}${reportObj.questionText.length > 150 ? '...' : ''}"</i>

💬 <b>Комментарий пользователя:</b>
<b>"${escapeTelegramHtml(reportObj.userComment || 'Без комментария')}"</b>

📅 <i>${new Date().toLocaleString('ru-RU')}</i>
`.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageHtml,
                parse_mode: 'HTML'
            })
        });
        const resData = await response.json();
        return resData.ok;
    } catch (err) {
        console.error('[Telegram] Error sending admin message:', err);
        return false;
    }
}

function sampleProportionally(selectedSetsList, totalRequestedCount) {
    const shuffledSets = selectedSetsList.map(set => ({
        questions: shuffleArray([...set.questions]),
        taken: 0,
        available: set.questions.length
    }));
    
    let totalAvailable = shuffledSets.reduce((sum, s) => sum + s.available, 0);
    const targetCount = Math.min(totalRequestedCount, totalAvailable);
    
    let remainingToTake = targetCount;
    
    while (remainingToTake > 0) {
        const activeSets = shuffledSets.filter(s => s.available > 0);
        if (activeSets.length === 0) break;
        
        const quota = Math.floor(remainingToTake / activeSets.length);
        const remainder = remainingToTake % activeSets.length;
        
        let takenInThisRound = 0;
        
        activeSets.forEach((set, index) => {
            let allocated = quota + (index < remainder ? 1 : 0);
            if (allocated > set.available) {
                allocated = set.available;
            }
            
            set.taken += allocated;
            set.available -= allocated;
            remainingToTake -= allocated;
            takenInThisRound += allocated;
        });
        
        if (takenInThisRound === 0) break;
    }
    
    let resultQuestions = [];
    shuffledSets.forEach(set => {
        resultQuestions = resultQuestions.concat(set.questions.slice(0, set.taken));
    });
    
    return resultQuestions;
}

window.reRenderActiveQuestionInLanguage = function() {
    const q = (state.questions && state.questions.length > 0) ? state.questions[state.currentIndex] : null;
    if (!q) return;

    const lang = state.settings.lang;
    const isRu = lang === 'Ru';

    // 1. Live score label
    const liveScoreEl = document.getElementById('q-score-live');
    if (liveScoreEl) {
        liveScoreEl.textContent = (isRu ? 'Верно: ' : 'Correct: ') + state.score;
    }

    // 2. Question Text
    const qTextEl = document.getElementById('q-text');
    if (qTextEl && !q.isCustomCard) {
        const rawQ = q['question' + lang] || q['questionEn'] || q.question || 'Missing question text';
        qTextEl.innerHTML = _markdownToHtml(rawQ);
        if (typeof renderLatexInElement === 'function') renderLatexInElement(qTextEl);
    }

    // 3. Option buttons text
    const optionsMap = q['options' + lang] || q['optionsEn'] || q.options || {};
    const optButtons = document.querySelectorAll('.option-btn');
    optButtons.forEach(btn => {
        const letter = btn.dataset.letter;
        if (letter && optionsMap[letter]) {
            const spans = btn.querySelectorAll('span');
            if (spans.length >= 2) {
                const textSpan = spans[spans.length - 1];
                textSpan.innerHTML = _markdownToHtml(optionsMap[letter]);
                if (typeof renderLatexInElement === 'function') renderLatexInElement(textSpan);
            }
        }
    });

    // 4. Submit button
    const submitBtn = document.getElementById('btn-submit-q');
    if (submitBtn) {
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = isRu ? 'Ответить' : 'Submit Answer';
    }

    // 5. Explanation box (if visible)
    const expBox = document.getElementById('q-explanation');
    if (expBox && expBox.style.display !== 'none') {
        const expTitle = document.getElementById('exp-title-text');
        if (expTitle) expTitle.textContent = isRu ? 'Клиническое объяснение' : 'Clinical Explanation';

        const rawExp = q['explanation' + lang] || q['explanationEn'] || q.explanation || 'No explanation provided.';
        const expText = document.getElementById('exp-text');
        if (expText) {
            expText.innerHTML = _markdownToHtml(rawExp);
            if (typeof renderLatexInElement === 'function') renderLatexInElement(expText);
        }

        const nextBtn = document.getElementById('btn-next-q');
        if (nextBtn) {
            nextBtn.innerHTML = (isRu ? 'Следующий вопрос ' : 'Next Question ') + '<i class="fas fa-chevron-right"></i>';
        }
    }
};

window.setAppLanguage = function(lang) {
    if (lang !== 'En' && lang !== 'Ru') return;
    state.settings.lang = lang;
    try {
        localStorage.setItem('starley_quiz_lang', lang);
    } catch(e) {}

    const btnEn = document.getElementById('btn-lang-en');
    const btnRu = document.getElementById('btn-lang-ru');
    if (btnEn && btnRu) {
        btnEn.classList.toggle('active', lang === 'En');
        btnRu.classList.toggle('active', lang === 'Ru');
    }

    document.querySelectorAll('.global-lang-btn .txt-lang-code').forEach(el => {
        el.textContent = lang;
    });

    const isRu = lang === 'Ru';

    const headerLangBtn = document.getElementById('txt-header-lang-btn');
    if (headerLangBtn) headerLangBtn.textContent = isRu ? '🇷🇺 RU' : '🇬🇧 EN';
    const cabLangBtn = document.getElementById('txt-cab-lang-btn');
    if (cabLangBtn) cabLangBtn.textContent = isRu ? '🌐 RU' : '🌐 EN';

    if (typeof window.updateAllLobbyLabels === 'function') window.updateAllLobbyLabels();
    if (typeof window.updateCabinetLabels === 'function') window.updateCabinetLabels();
    if (typeof window.updateUserProfileDisplay === 'function') window.updateUserProfileDisplay();
    if (typeof updateChecklistStatus === 'function') updateChecklistStatus();

    // If on question screen, re-render active question immediately in chosen language!
    const questionScreen = document.getElementById('screen-question');
    if (questionScreen && questionScreen.classList.contains('active')) {
        window.reRenderActiveQuestionInLanguage();
    } else if (document.getElementById('screen-results') && document.getElementById('screen-results').classList.contains('active')) {
        showResults();
    }

    // Update exit modal labels
    const exitTitle = document.getElementById('txt-exit-modal-title');
    if (exitTitle) exitTitle.textContent = isRu ? 'Прервать сессию квиза?' : 'Abort Quiz Session?';
    const exitDesc = document.getElementById('txt-exit-modal-desc');
    if (exitDesc) exitDesc.textContent = isRu ? 'Вы действительно хотите прервать текущую тренировку? Прогресс незавершённой сессии не будет сохранён.' : 'Are you sure you want to abort the current quiz session? Unfinished session progress will not be saved.';
    const btnExitLib = document.getElementById('txt-btn-exit-lib');
    if (btnExitLib) btnExitLib.textContent = isRu ? 'Вернуться в библиотеку' : 'Return to Library';
    const btnExitLobby = document.getElementById('txt-btn-exit-lobby');
    if (btnExitLobby) btnExitLobby.textContent = isRu ? 'В меню квизов (Лобби)' : 'Return to Lobby';
    const btnExitCancel = document.getElementById('txt-btn-exit-cancel');
    if (btnExitCancel) btnExitCancel.textContent = isRu ? 'Продолжить тест' : 'Continue Quiz';
    const btnExitHeader = document.getElementById('txt-btn-exit-header');
    if (btnExitHeader) btnExitHeader.textContent = isRu ? 'Выход' : 'Exit';

    if (typeof updateQuizStatsUI === 'function') updateQuizStatsUI();
    if (typeof renderCabinetOverviewTab === 'function') renderCabinetOverviewTab();
    if (typeof renderPlaylistsTab === 'function') renderPlaylistsTab();
    if (typeof renderHistoryTab === 'function') renderHistoryTab();
};

window.toggleGlobalLanguage = function() {
    const curLang = (state.settings && state.settings.lang) ? state.settings.lang : 'Ru';
    const nextLang = curLang === 'Ru' ? 'En' : 'Ru';
    window.setAppLanguage(nextLang);
};

function setupLobbyListeners() {
    const btnEn = document.getElementById('btn-lang-en');
    const btnRu = document.getElementById('btn-lang-ru');
    const labelShuffle = document.getElementById('label-setting-shuffle');
    const labelExam = document.getElementById('label-setting-exam');
    
    const updateLobbyLabels = () => {
        const isRu = state.settings.lang === 'Ru';
        if (labelShuffle) labelShuffle.textContent = isRu ? 'Случайный порядок' : 'Shuffle Questions';
        if (labelExam) labelExam.textContent = isRu ? 'Режим экзамена' : 'Exam Mode';
        
        const labelAllQuestions = document.getElementById('label-setting-all-questions');
        if (labelAllQuestions) labelAllQuestions.textContent = isRu ? 'Все вопросы (список)' : 'All Questions List';
        
        const labelLobbySearch = document.getElementById('label-lobby-search');
        if (labelLobbySearch) labelLobbySearch.textContent = isRu ? '🔎 Быстрый поиск' : '🔎 Quick Search';

        const searchInput = document.getElementById('quiz-lobby-search-input');
        if (searchInput) searchInput.placeholder = isRu ? 'Введите слово для поиска (например, "аденозин")...' : 'Type to search questions, options, or explanations...';

        const lblSelectLang = document.getElementById('label-select-lang');
        if (lblSelectLang) lblSelectLang.textContent = isRu ? 'Выберите язык' : 'Select Language';

        const lblSelectSet = document.getElementById('label-select-set');
        if (lblSelectSet) lblSelectSet.textContent = isRu ? 'Выберите квизы' : 'Select Question Set';

        const lblSessionSettings = document.getElementById('label-session-settings');
        if (lblSessionSettings) lblSessionSettings.textContent = isRu ? 'Настройки' : 'Session Settings';

        const slider = document.getElementById('setting-count');
        const valCount = document.getElementById('val-count');
        const lblQuestionsCount = document.getElementById('label-questions-count');
        
        if (lblQuestionsCount && valCount) {
            lblQuestionsCount.innerHTML = (isRu ? 'Количество вопросов: ' : 'Questions: ') + `<span id="val-count">${valCount.textContent}</span>`;
        }

        if (slider) {
            const val = parseInt(slider.value);
            const valCountSpan = document.getElementById('val-count');
            if (valCountSpan) {
                valCountSpan.textContent = (val === parseInt(slider.max)) ? (isRu ? 'Все' : 'All') : val;
            }
        }
        
        const lobbyTitle = document.getElementById('lobby-book-title');
        if (lobbyTitle) {
            if (state.bookPath) {
                lobbyTitle.textContent = isRu ? (state.bookMeta.russian_title || state.bookMeta.title) : state.bookMeta.title;
            } else {
                lobbyTitle.textContent = isRu ? 'Клинические квизы' : 'Starley Clinical Quiz';
            }
        }

        // Lobby Header Buttons & Profile Stats Row
        const btnStartQuiz = document.getElementById('btn-start-quiz');
        if (btnStartQuiz) btnStartQuiz.textContent = isRu ? '🚀 Начать квиз' : '🚀 Start Quiz';

        const txtBtnSync = document.getElementById('txt-btn-sync');
        if (txtBtnSync) txtBtnSync.textContent = isRu ? '🔄 Синхр.' : '🔄 Sync';

        const txtBtnAdmin = document.getElementById('txt-btn-admin');
        if (txtBtnAdmin) txtBtnAdmin.textContent = isRu ? '👑 Админ' : '👑 Admin';

        const txtBtnCabinet = document.getElementById('txt-btn-cabinet');
        if (txtBtnCabinet) txtBtnCabinet.textContent = isRu ? 'Кабинет' : 'Cabinet';

        const txtBtnLogout = document.getElementById('txt-btn-logout');
        if (txtBtnLogout) txtBtnLogout.textContent = isRu ? 'Выход' : 'Exit';

        const lblStatStreak = document.getElementById('lbl-profile-stat-streak');
        if (lblStatStreak) lblStatStreak.textContent = isRu ? 'дней ударно' : 'day streak';

        const lblStatSolved = document.getElementById('lbl-profile-stat-solved');
        if (lblStatSolved) lblStatSolved.textContent = isRu ? 'решено' : 'solved';

        const lblStatAccuracy = document.getElementById('lbl-profile-stat-accuracy');
        if (lblStatAccuracy) lblStatAccuracy.textContent = isRu ? 'точность' : 'accuracy';

        const headerLangBtn = document.getElementById('txt-header-lang-btn');
        if (headerLangBtn) headerLangBtn.textContent = isRu ? '🇷🇺 RU' : '🇬🇧 EN';

        const cabLangBtn = document.getElementById('txt-cab-lang-btn');
        if (cabLangBtn) cabLangBtn.textContent = isRu ? '🌐 RU' : '🌐 EN';

        // Localize Spaced Repetition card and controls
        const lblWeakSpotRadar = document.getElementById('lbl-weak-spot-radar');
        if (lblWeakSpotRadar) lblWeakSpotRadar.textContent = isRu ? '📊 Радар слабых мест' : '📊 Weak-Spot Radar';

        const lblMasteredPct = document.getElementById('lbl-mastered-pct');
        if (lblMasteredPct) lblMasteredPct.textContent = isRu ? 'Освоено' : 'Mastered';

        const lblLegendGreen = document.getElementById('lbl-legend-green');
        if (lblLegendGreen) lblLegendGreen.textContent = isRu ? 'Освоено' : 'Mastered';

        const lblLegendYellow = document.getElementById('lbl-legend-yellow');
        if (lblLegendYellow) lblLegendYellow.textContent = isRu ? 'Изучение' : 'Learning';

        const lblLegendRed = document.getElementById('lbl-legend-red');
        if (lblLegendRed) lblLegendRed.textContent = isRu ? 'Слабые / Новые' : 'Weak / New';

        const lblTopicsMastery = document.getElementById('lbl-topics-mastery');
        if (lblTopicsMastery) lblTopicsMastery.textContent = isRu ? 'Освоение тем (Экспресс-квиз по нажатию)' : 'Topic Mastery (Tap for Express Quiz)';
        const lblQuizMode = document.getElementById('label-quiz-mode');
        if (lblQuizMode) lblQuizMode.textContent = isRu ? 'Режим теста' : 'Quiz Mode';

        // Localize segmented button text and tooltips safely
        const btnSmartEl = document.getElementById('btn-mode-smart');
        const btnSmartTitle = btnSmartEl ? btnSmartEl.querySelector('.mode-title') : null;
        if (btnSmartTitle) btnSmartTitle.textContent = isRu ? 'Умный режим' : 'Smart Drill';
        if (btnSmartEl) btnSmartEl.title = isRu ? '70% слабых/новых вопросов, 30% закрепленных' : '70% weak/new, 30% mastered questions';

        const btnWeakEl = document.getElementById('btn-mode-weak');
        const btnWeakTitle = btnWeakEl ? btnWeakEl.querySelector('.mode-title') : null;
        if (btnWeakTitle) btnWeakTitle.textContent = isRu ? 'Ошибки' : 'Weak Spots';
        if (btnWeakEl) btnWeakEl.title = isRu ? 'Только вопросы, в которых были ошибки' : 'Only questions answered incorrectly before';

        const btnExamEl = document.getElementById('btn-mode-exam');
        const btnExamTitle = btnExamEl ? btnExamEl.querySelector('.mode-title') : null;
        if (btnExamTitle) btnExamTitle.textContent = isRu ? 'Экзамен' : 'Exam Sim';
        if (btnExamEl) btnExamEl.title = isRu ? 'Таймер, без подсказок во время теста' : 'Timer, no explanations during the test';

        const confidenceLabel = document.getElementById('confidence-label');
        if (confidenceLabel) confidenceLabel.textContent = isRu ? 'Как вам этот вопрос?' : 'How was this question?';

        const lblUnsure = document.getElementById('lbl-unsure');
        if (lblUnsure) lblUnsure.textContent = isRu ? 'Сложно / Не уверен' : 'Difficult / Unsure';

        const lblEasy = document.getElementById('lbl-easy');
        if (lblEasy) lblEasy.textContent = isRu ? 'Легко / Знаю' : 'Easy / Know';

        // Volume Preset Headers & Badges Localization
        const txtPresetVol = document.getElementById('txt-preset-volume');
        if (txtPresetVol) txtPresetVol.textContent = isRu ? 'Пресет объема' : 'Volume Preset';

        const lblTierBlitz = document.getElementById('lbl-tier-blitz');
        if (lblTierBlitz) lblTierBlitz.textContent = isRu ? 'БЛИЦ' : 'BLITZ';

        const lblTierStandard = document.getElementById('lbl-tier-standard');
        if (lblTierStandard) lblTierStandard.textContent = isRu ? 'СТАНДАРТ' : 'STANDARD';

        const lblTierMaster = document.getElementById('lbl-tier-master');
        if (lblTierMaster) lblTierMaster.textContent = isRu ? 'МАСТЕР' : 'MASTER';

        const lblTierFanatic = document.getElementById('lbl-tier-fanatic');
        if (lblTierFanatic) lblTierFanatic.textContent = isRu ? 'ФАНАТИК' : 'FANATIC';

        const lblBadgeAll = document.getElementById('lbl-badge-all');
        if (lblBadgeAll) lblBadgeAll.textContent = isRu ? 'ВСЕ' : 'ALL';

        updatePresetBadgeActiveState();

        // Update Radar values/chart on lang change if dashboard is displayed
        updateWeakSpotRadar();
    };

    window.updateAllLobbyLabels = updateLobbyLabels;

    const updateCabinetLabels = () => {
        const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

        // Modal title & sync indicator
        const lblProfileModalTitle = document.getElementById('lbl-profile-modal-title');
        if (lblProfileModalTitle) lblProfileModalTitle.textContent = isRu ? '👤 Личный кабинет' : '👤 Personal Cabinet';

        // Cabinet navigation tabs
        const tabOverview = document.getElementById('tab-text-overview');
        if (tabOverview) tabOverview.textContent = isRu ? 'Обзор' : 'Overview';
        const tabPlaylists = document.getElementById('tab-text-playlists');
        if (tabPlaylists) tabPlaylists.textContent = isRu ? 'Плейлисты' : 'Playlists';
        const tabHistory = document.getElementById('tab-text-history');
        if (tabHistory) tabHistory.textContent = isRu ? 'История' : 'History';
        const tabSettings = document.getElementById('tab-text-settings');
        if (tabSettings) tabSettings.textContent = isRu ? 'Настройки' : 'Settings';

        const txtCabLogout = document.getElementById('txt-cab-logout');
        if (txtCabLogout) txtCabLogout.textContent = isRu ? 'Выход' : 'Logout';

        // Hero card controls
        const btnCodex = document.getElementById('btn-open-rpg-codex');
        if (btnCodex) btnCodex.textContent = isRu ? '📜 Кодекс 100 рангов' : '📜 100-Level Codex';

        // Quick 4 stats labels
        const lblStreak = document.getElementById('lbl-cab-stat-streak');
        if (lblStreak) lblStreak.textContent = isRu ? 'Ударный темп' : 'Day Streak';
        const lblSessions = document.getElementById('lbl-cab-stat-sessions');
        if (lblSessions) lblSessions.textContent = isRu ? 'Сессий' : 'Test Sessions';
        const lblSolved = document.getElementById('lbl-cab-stat-solved');
        if (lblSolved) lblSolved.textContent = isRu ? 'Всего решено' : 'Solved Total';
        const lblAccuracy = document.getElementById('lbl-cab-stat-accuracy');
        if (lblAccuracy) lblAccuracy.textContent = isRu ? 'Средняя точность' : 'Avg Accuracy';

        // Cadence & Infographics
        const cadenceTitle = document.getElementById('cab-cadence-title');
        if (cadenceTitle) cadenceTitle.textContent = isRu ? 'Ритм обучения и скорость подготовки' : 'Learning Cadence & Training Velocity';
        const lblCadSessions = document.getElementById('lbl-cadence-sessions');
        if (lblCadSessions) lblCadSessions.textContent = isRu ? '⏱️ Частота сессий' : '⏱️ Session Cadence';
        const lblCadQuestions = document.getElementById('lbl-cadence-questions');
        if (lblCadQuestions) lblCadQuestions.textContent = isRu ? '⚡ Поток вопросов' : '⚡ Question Throughput';
        const lblCadMax = document.getElementById('lbl-cadence-max');
        if (lblCadMax) lblCadMax.textContent = isRu ? '🛡️ Рекорд сессии' : '🛡️ Peak Session Run';
        const momentumLegend = document.getElementById('cab-momentum-legend');
        if (momentumLegend) momentumLegend.textContent = isRu ? 'Объем решенного по дням (наведите на столбец)' : 'Daily Solved Volume (Hover bar for session breakdown)';

        // Accuracy Progression Dynamics
        const accTitle = document.getElementById('cab-acc-dynamics-title');
        if (accTitle) accTitle.textContent = isRu ? 'Динамика точности ответов' : 'Accuracy Progression Dynamics';
        const accTimeline = document.getElementById('lbl-cab-acc-timeline');
        if (accTimeline) accTimeline.textContent = isRu ? 'Прошлые сессии (от старых к новым)' : 'Past Sessions (Oldest → Latest)';

        // Clinical RPG Character Attributes
        const rpgAttrsTitle = document.getElementById('cab-rpg-attrs-title');
        if (rpgAttrsTitle) rpgAttrsTitle.textContent = isRu ? 'Клинические RPG-атрибуты врача' : 'Clinical RPG Character Attributes';
        const rpgDims = document.getElementById('lbl-cab-rpg-dimensions');
        if (rpgDims) rpgDims.textContent = isRu ? '6 ключевых направлений • Нажмите для диагностики' : '6 Core Dimensions • Click for Diagnostics';

        // Total Library Bank Conquest
        const bankTitle = document.getElementById('lbl-cab-bank-title');
        if (bankTitle) bankTitle.textContent = isRu ? '🌐 Охват клинической базы библиотеки' : '🌐 Total Library Bank Conquest';
        const bankSub = document.getElementById('cab-bank-coverage-sub');
        if (bankSub) bankSub.textContent = isRu ? 'Уникальные вопросы, решенные во всей медицинской библиотеке' : 'Unique questions answered across all loaded library modules';

        // Manifests & Topics
        const manifestTitle = document.getElementById('txt-manifest-title');
        if (manifestTitle) manifestTitle.textContent = isRu ? 'Манифесты вопросов и темы (18 направлений)' : 'Question Manifests & Topics (18 directions)';
        const manifestSummary = document.getElementById('cab-topics-active-summary');
        if (manifestSummary) manifestSummary.textContent = isRu ? 'Нажмите на любую тему, чтобы запустить тренировку или повторить ошибки' : 'Tap on any topic to start training or practice missed questions';
        const btnFilterAll = document.getElementById('btn-filter-topic-all');
        if (btnFilterAll) btnFilterAll.textContent = isRu ? 'Все манифесты (18)' : 'All Manifests (18)';
        const btnFilterActive = document.getElementById('btn-filter-topic-active');
        if (btnFilterActive) btnFilterActive.textContent = isRu ? 'Пройденные' : 'Practiced';
        const btnFilterWeak = document.getElementById('btn-filter-topic-weak');
        if (btnFilterWeak) btnFilterWeak.textContent = isRu ? 'С ошибками' : 'Weak Spots';

        // Tab 2: Playlists
        const lblPlaylistsTitle = document.getElementById('lbl-cab-playlists-title');
        if (lblPlaylistsTitle) lblPlaylistsTitle.textContent = isRu ? '📂 Пользовательские сборники вопросов' : '📂 Custom Question Playlists';
        const btnCreatePl = document.getElementById('btn-create-playlist');
        if (btnCreatePl) btnCreatePl.textContent = isRu ? '+ Создать сборник' : '+ New Playlist';
        const lblStarredTitle = document.getElementById('lbl-cab-starred-title');
        const favCount = document.getElementById('cab-fav-count');
        if (lblStarredTitle) {
            const countNum = favCount ? favCount.textContent : (state.userFavorites ? state.userFavorites.length : 0);
            lblStarredTitle.innerHTML = (isRu ? '⭐ Избранные вопросы' : '⭐ Starred Favorites') + ` (<span id="cab-fav-count">${countNum}</span>)`;
        }

        // Tab 3: History
        const lblHistoryTitle = document.getElementById('lbl-cab-history-title');
        if (lblHistoryTitle) lblHistoryTitle.textContent = isRu ? '📜 История учебных сессий' : '📜 Test Session History';

        // Tab 4: Settings
        const lblNick = document.getElementById('lbl-setting-nickname');
        if (lblNick) lblNick.textContent = isRu ? 'Имя доктора / Никнейм' : 'Profile Nickname / Title';
        const inputNick = document.getElementById('input-profile-nickname');
        if (inputNick) inputNick.placeholder = isRu ? 'Введите никнейм (например, Доктор Смит)...' : 'Enter nickname (e.g. Doctor Starley)...';
        const lblAvatar = document.getElementById('lbl-setting-avatar');
        if (lblAvatar) lblAvatar.textContent = isRu ? 'Выбор символа аватара' : 'Select Avatar Symbol';

        const optDoc = document.getElementById('opt-title-doc');
        if (optDoc) optDoc.textContent = isRu ? 'Доктор' : 'Doctor';
        const optHeart = document.getElementById('opt-title-heart');
        if (optHeart) optHeart.textContent = isRu ? 'Сердце' : 'Heart';
        const optBrain = document.getElementById('opt-title-brain');
        if (optBrain) optBrain.textContent = isRu ? 'Мозг' : 'Brain';
        const optFlask = document.getElementById('opt-title-flask');
        if (optFlask) optFlask.textContent = isRu ? 'Ученый' : 'Scientist';
        const optBolt = document.getElementById('opt-title-bolt');
        if (optBolt) optBolt.textContent = isRu ? 'Блиц' : 'Blitz';
        const optTitan = document.getElementById('opt-title-titan');
        if (optTitan) optTitan.textContent = isRu ? 'Титан' : 'Titan';
        const optGuru = document.getElementById('opt-title-guru');
        if (optGuru) optGuru.textContent = isRu ? 'Гуру' : 'Guru';
        const optRocket = document.getElementById('opt-title-rocket');
        if (optRocket) optRocket.textContent = isRu ? 'Ракета' : 'Rocket';


        const txtCloudTitle = document.getElementById('txt-cloud-sync-title');
        if (txtCloudTitle) txtCloudTitle.textContent = isRu ? 'Google Sheets Cloud Sync (Local-First)' : 'Google Sheets Cloud Sync (Local-First)';
        const txtLastSync = document.getElementById('txt-last-sync-label');
        if (txtLastSync) txtLastSync.textContent = isRu ? 'Посл. синхр.:' : 'Last sync:';
        const txtCloudDesc = document.getElementById('txt-cloud-sync-desc');
        if (txtCloudDesc) txtCloudDesc.textContent = isRu ? 'Архитектура Local-First: мгновенный локальный отклик, автоматическая отправка изменений в Google Таблицу с защитой LockService.' : 'Local-First architecture: instant UI responsiveness with local storage, while mutations are pushed to cloud with debounce and LockService protection.';

        const txtBtnTest = document.getElementById('txt-btn-test-sheets');
        if (txtBtnTest) txtBtnTest.textContent = isRu ? 'Проверить связь' : 'Test Connection';
        const txtBtnPush = document.getElementById('txt-btn-force-push');
        if (txtBtnPush) txtBtnPush.textContent = isRu ? 'Отправить в Google Sheets' : 'Force Push';
        const txtBtnPull = document.getElementById('txt-btn-force-pull');
        if (txtBtnPull) txtBtnPull.textContent = isRu ? 'Загрузить из Google Sheets' : 'Force Pull';

        const txtBtnSave = document.getElementById('txt-btn-save-profile');
        if (txtBtnSave) txtBtnSave.textContent = isRu ? '💾 Сохранить изменения' : '💾 Save Changes';
    };
    window.updateCabinetLabels = updateCabinetLabels;
    
    btnEn.onclick = () => window.setAppLanguage('En');
    btnRu.onclick = () => window.setAppLanguage('Ru');

    // Mode Buttons Selectors
    const updateModeSelector = () => {
        const btnSmart = document.getElementById('btn-mode-smart');
        const btnWeak = document.getElementById('btn-mode-weak');
        const btnExam = document.getElementById('btn-mode-exam');

        if (!btnSmart || !btnWeak || !btnExam) return;

        btnSmart.classList.toggle('active', state.sessionMode === 'smart');
        btnWeak.classList.toggle('active', state.sessionMode === 'weak');
        btnExam.classList.toggle('active', state.sessionMode === 'exam');

        const activeColor = 'var(--quiz-text)';
        const inactiveColor = 'var(--quiz-muted)';

        btnSmart.style.color = state.sessionMode === 'smart' ? activeColor : inactiveColor;
        btnWeak.style.color = state.sessionMode === 'weak' ? activeColor : inactiveColor;
        btnExam.style.color = state.sessionMode === 'exam' ? activeColor : inactiveColor;

        const smartIcon = btnSmart.querySelector('i');
        const weakIcon = btnWeak.querySelector('i');
        const examIcon = btnExam.querySelector('i');

        if (smartIcon) smartIcon.style.color = state.sessionMode === 'smart' ? 'var(--quiz-accent)' : '';
        if (weakIcon) weakIcon.style.color = state.sessionMode === 'weak' ? 'var(--quiz-wrong)' : '';
        if (examIcon) examIcon.style.color = state.sessionMode === 'exam' ? 'var(--quiz-warning)' : '';
    };

    const btnSmart = document.getElementById('btn-mode-smart');
    if (btnSmart) {
        btnSmart.onclick = () => {
            state.sessionMode = 'smart';
            state.settings.exam = false;
            document.getElementById('setting-exam').checked = false;
            updateModeSelector();
            if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
            playSound('click');
            triggerHaptic('click');
        };
    }

    const btnWeak = document.getElementById('btn-mode-weak');
    if (btnWeak) {
        btnWeak.onclick = () => {
            state.sessionMode = 'weak';
            state.settings.exam = false;
            document.getElementById('setting-exam').checked = false;
            updateModeSelector();
            if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
            playSound('click');
            triggerHaptic('click');
        };
    }

    const btnExam = document.getElementById('btn-mode-exam');
    if (btnExam) {
        btnExam.onclick = () => {
            state.sessionMode = 'exam';
            state.settings.exam = true;
            document.getElementById('setting-exam').checked = true;
            updateModeSelector();
            if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
            playSound('click');
            triggerHaptic('click');
        };
    }

    updateLobbyLabels();
    updateModeSelector();
    initChecklistWidget();

    const presetBtns = document.querySelectorAll('.preset-badge-btn');
    presetBtns.forEach(btn => {
        btn.onclick = () => {
            const countAttr = btn.dataset.count;
            const slider = document.getElementById('setting-count');
            const maxVal = slider ? parseInt(slider.max) : 300;

            if (countAttr === 'all') {
                state.settings.count = maxVal > 0 ? maxVal : 300;
            } else {
                state.settings.count = parseInt(countAttr);
            }

            if (slider) {
                slider.value = state.settings.count;
            }

            updatePresetBadgeActiveState();
            if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
            playSound('click');
            triggerHaptic('click');
        };
    });

    const slider = document.getElementById('setting-count');
    const valCount = document.getElementById('val-count');
    
    slider.oninput = () => {
        const val = parseInt(slider.value);
        state.settings.count = val;
        valCount.textContent = (val === parseInt(slider.max)) ? (state.settings.lang === 'Ru' ? 'Все' : 'All') : val;
        
        const isRu = state.settings.lang === 'Ru';
        const lblQuestionsCount = document.getElementById('label-questions-count');
        if (lblQuestionsCount) {
            lblQuestionsCount.innerHTML = (isRu ? 'Количество вопросов: ' : 'Questions: ') + `<span id="val-count">${valCount.textContent}</span>`;
        }
    };

    const chkAllQuestions = document.getElementById('setting-all-questions');
    if (chkAllQuestions) {
        const updateAllQuestionsDependency = () => {
            const checked = chkAllQuestions.checked;
            state.settings.allQuestions = checked;
            
            const sliderGroup = document.getElementById('setting-count').closest('.settings-group');
            const shuffleRow = document.getElementById('setting-shuffle') ? document.getElementById('setting-shuffle').closest('.settings-row') : null;
            const examRow = document.getElementById('setting-exam') ? document.getElementById('setting-exam').closest('.settings-row') : null;
            const modeGroup = document.getElementById('btn-mode-smart') ? document.getElementById('btn-mode-smart').closest('.settings-group') : null;

            if (checked) {
                if (sliderGroup) sliderGroup.classList.add('disabled');
                if (shuffleRow) shuffleRow.classList.add('disabled');
                if (examRow) examRow.classList.add('disabled');
                if (modeGroup) modeGroup.classList.add('disabled');
                
                document.getElementById('setting-count').disabled = true;
                if (document.getElementById('setting-shuffle')) document.getElementById('setting-shuffle').disabled = true;
                if (document.getElementById('setting-exam')) document.getElementById('setting-exam').disabled = true;
                if (document.getElementById('btn-mode-smart')) document.getElementById('btn-mode-smart').disabled = true;
                if (document.getElementById('btn-mode-weak')) document.getElementById('btn-mode-weak').disabled = true;
                if (document.getElementById('btn-mode-exam')) document.getElementById('btn-mode-exam').disabled = true;
            } else {
                if (sliderGroup) sliderGroup.classList.remove('disabled');
                if (shuffleRow) shuffleRow.classList.remove('disabled');
                if (examRow) examRow.classList.remove('disabled');
                if (modeGroup) modeGroup.classList.remove('disabled');
                
                document.getElementById('setting-count').disabled = false;
                if (document.getElementById('setting-shuffle')) document.getElementById('setting-shuffle').disabled = false;
                if (document.getElementById('setting-exam')) document.getElementById('setting-exam').disabled = false;
                if (document.getElementById('btn-mode-smart')) document.getElementById('btn-mode-smart').disabled = false;
                if (document.getElementById('btn-mode-weak')) document.getElementById('btn-mode-weak').disabled = false;
                if (document.getElementById('btn-mode-exam')) document.getElementById('btn-mode-exam').disabled = false;
            }
        };
        chkAllQuestions.onchange = updateAllQuestionsDependency;
        updateAllQuestionsDependency();
    }

    const searchInputEl = document.getElementById('quiz-lobby-search-input');
    if (searchInputEl) {
        let timeout = null;
        searchInputEl.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                _performLobbySearch();
            }, 200);
        });
    }

    document.getElementById('btn-start-quiz').onclick = startQuiz;
}

async function startQuiz() {
    if (!state.selectedSets || state.selectedSets.length === 0) return;
    
    // Reset timer
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        let allQuestions = [];
        
        for (const set of state.selectedSets) {
            const cacheKey = `${set.bookPath}::${set.setId}`;
            let questions = state.setQuestionsMap[cacheKey];
            
            if (!questions) {
                if (set.setId === 'custom') {
                    const cards = getCustomCards();
                    const relevantCards = set.bookPath === 'custom' ? cards : cards.filter(c => c.bookPath === set.bookPath);
                    questions = relevantCards.map(card => mapCardToQuestion(card));
                    state.setQuestionsMap[cacheKey] = questions;
                } else {
                    const quizUrl = `${rootPath}${set.bookPath}/${set.file}?v=${Date.now()}`;
                    const res = await fetch(quizUrl);
                    const data = await res.json();
                    questions = data.questions || [];
                    
                    const manifestId = (set.bookPath + '_' + set.setId).replace(/[^a-zA-Z0-9]/g, '_');
                    questions.forEach((q, idx) => {
                        q.bookPath = set.bookPath;
                        q.setId = set.setId;
                        q.manifestId = manifestId;
                        q.meta = data.meta;
                        if (!q.id) {
                            q.id = `${manifestId}_q${idx + 1}`;
                        }
                    });
                    
                    state.setQuestionsMap[cacheKey] = questions;
                }
            }
            allQuestions.push({
                setId: set.setId,
                questions: questions
            });
        }

        const isRu = state.settings.lang === 'Ru';

        // Flatten all questions with proper mapping
        let flatQuestions = [];
        allQuestions.forEach(setGroup => {
            setGroup.questions.forEach(q => {
                q.setId = setGroup.setId;
                flatQuestions.push(q);
            });
        });

        // 1. Apply Express Quiz Filter (if any)
        if (state.activeTopicFilter) {
            flatQuestions = flatQuestions.filter(q => getQuestionTopic(q) === state.activeTopicFilter);
            if (flatQuestions.length === 0) {
                alert(isRu ? 'Вопросы в этой теме не найдены!' : 'No questions found for this topic!');
                state.activeTopicFilter = null;
                return;
            }
            flatQuestions = shuffleArray(flatQuestions).slice(0, 10);
            
            state.questions = flatQuestions;
            state.settings.exam = false; // Always standard mode for topic drills
        } else {
            // Standard Modes
            if (state.settings.allQuestions) {
                state.questions = flatQuestions;
                
                document.getElementById('all-q-title').textContent = isRu ? 'Все вопросы' : 'All Questions';
                document.getElementById('all-q-counter').textContent = (isRu ? 'Вопросов: ' : 'Questions: ') + state.questions.length;
                switchScreen('screen-all-questions');
                renderAllQuestionsList();
                return;
            }

            // Normal Session logic
            let finalQuestions = [];
            const totalRequested = Math.min(state.settings.count, flatQuestions.length);

            if (state.sessionMode === 'smart') {
                finalQuestions = sampleSmartQuestions(flatQuestions, totalRequested);
                if (document.getElementById('setting-shuffle') && document.getElementById('setting-shuffle').checked) {
                    finalQuestions = shuffleArray(finalQuestions);
                }
                state.settings.exam = false;
            } else if (state.sessionMode === 'weak') {
                const weakQs = flatQuestions.filter(q => getQuestionMastery(q).state === 'red');
                if (weakQs.length === 0) {
                    alert(isRu 
                        ? 'Отличная работа! У вас нет проблемных вопросов (Красная зона) в выбранных квизах. Начните Умный режим.' 
                        : 'Great job! You have no weak spots (Red zone) in the selected sets. Choose Smart Drill to study.');
                    return;
                }
                finalQuestions = shuffleArray(weakQs).slice(0, totalRequested);
                state.settings.exam = false;
            } else {
                finalQuestions = shuffleArray(flatQuestions).slice(0, totalRequested);
                state.settings.exam = true;
            }

            state.questions = finalQuestions;
        }

        state.currentIndex = 0;
        state.score = 0;
        state.answers = [];
        state.startTime = Date.now();

        document.getElementById('exp-title-text').textContent = isRu ? 'Клиническое объяснение' : 'Clinical Explanation';
        document.getElementById('exp-picker-label').textContent = isRu ? 'Выберите главу для открытия:' : 'Select chapter to open:';
        document.getElementById('btn-open-reader-main').innerHTML = `<i class="fas fa-book-open"></i> ${isRu ? 'В читалку' : 'Open in Reader'}`;

        document.getElementById('exam-errors-section').style.display = 'none';
        switchScreen('screen-question');
        renderQuestion();
        
        if (state.settings.exam) {
            document.getElementById('quiz-timer').style.display = 'flex';
            startExamTimer();
        } else {
            document.getElementById('quiz-timer').style.display = 'none';
        }

    } catch (err) {
        alert('Failed to load quiz questions: ' + err.message);
    }
}

function startExamTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
    state.timeRemaining = 60;
    const timerVal = document.getElementById('timer-val');
    if (timerVal) timerVal.textContent = state.timeRemaining;

    state.timerInterval = setInterval(() => {
        state.timeRemaining--;
        if (timerVal) timerVal.textContent = state.timeRemaining;

        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            submitAnswer(true);
        }
    }, 1000);
}

function renderQuestion() {
    window.dispatchEvent(new CustomEvent('quiz:questionChanged'));
    const q = state.questions[state.currentIndex];
    state.questionStartTime = Date.now();
    state.currentSelected = [];
    const lang = state.settings.lang;

    document.getElementById('q-current').textContent = state.currentIndex + 1;
    document.getElementById('q-total').textContent = state.questions.length;
    document.getElementById('q-progress-fill').style.width = `${((state.currentIndex) / state.questions.length) * 100}%`;
    
    const liveScoreEl = document.getElementById('q-score-live');
    liveScoreEl.textContent = (lang === 'Ru' ? 'Верно: ' : 'Correct: ') + state.score;
    liveScoreEl.style.display = state.settings.exam ? 'none' : 'block';

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        const isFav = isFavoriteQuestion(q);
        const icon = btnFav.querySelector('i');
        if (icon) icon.className = isFav ? 'fas fa-star' : 'far fa-star';
        btnFav.style.color = isFav ? '#f59e0b' : '#eab308';
    }

    const qTextEl = document.getElementById('q-text');
    const optionsCont = document.getElementById('q-options');
    const imgCont = document.getElementById('q-image-container');
    const confContainer = document.getElementById('confidence-rating-container');

    // Handle Custom Card Flip
    if (q.isCustomCard) {
        const isRu = lang === 'Ru';
        qTextEl.innerHTML = `<div style="text-align:center; font-size:0.9rem; color:var(--quiz-muted); margin-bottom:10px;">${isRu ? 'Карточка самопроверки' : 'Active Recall Card'}</div>`;
        imgCont.innerHTML = '';
        imgCont.style.display = 'none';

        optionsCont.innerHTML = `
            <div class="cs-flashcard-container" id="flashcard-container">
                <div class="cs-flashcard" id="current-flashcard">
                    <div class="cs-flashcard-front">
                        <div class="cs-flashcard-logo">🎴</div>
                        <div class="cs-flashcard-text">${q.questionEn}</div>
                        <button class="cs-flashcard-flip-btn" id="btn-flip-card">
                            <i class="fas fa-rotate"></i> <span>${isRu ? 'Показать ответ' : 'Show Answer'}</span>
                        </button>
                    </div>
                    <div class="cs-flashcard-back">
                        <div class="cs-flashcard-title">${isRu ? 'Ответ' : 'Answer'}</div>
                        <div class="cs-flashcard-text">${q.cardAnswer}</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('q-explanation').style.display = 'none';
        document.getElementById('exp-chapter-select').style.display = 'none';
        if (confContainer) confContainer.style.display = 'none';

        let submitBtnCont = document.getElementById('q-submit-container');
        if (submitBtnCont) submitBtnCont.style.display = 'none';

        const cardEl = document.getElementById('current-flashcard');
        const containerEl = document.getElementById('flashcard-container');
        
        const performFlip = () => {
            if (cardEl.classList.contains('flipped')) return;
            playSound('click');
            triggerHaptic('click');
            cardEl.classList.add('flipped');
            
            setTimeout(() => {
                if (confContainer) {
                    confContainer.style.display = 'block';
                    const btnUnsure = document.getElementById('chip-unsure');
                    const btnEasy = document.getElementById('chip-easy');
                    
                    btnUnsure.classList.remove('active');
                    btnEasy.classList.remove('active');
                    
                    btnUnsure.onclick = () => {
                        btnUnsure.classList.add('active');
                        submitCustomCardAnswer(false);
                    };
                    btnEasy.onclick = () => {
                        btnEasy.classList.add('active');
                        submitCustomCardAnswer(true);
                    };
                }
                showCustomCardExplanation(q);
            }, 300);
        };

        containerEl.onclick = performFlip;

        if (state.settings.exam) {
            startExamTimer();
        }
        return;
    }

    // Standard Question Rendering
    qTextEl.innerHTML = _markdownToHtml(q['question' + lang] || q['questionEn'] || q.question || 'Missing question text');
    renderLatexInElement(qTextEl);
    
    const qImgs = getQuestionImages(q);
    if (qImgs.length > 0) {
        const bookPath = q.bookPath || state.bookPath;
        imgCont.innerHTML = qImgs.map(img => {
            const imgSrc = resolveQuizImg(img, bookPath);
            return `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')" onerror="this.onerror=null; this.src='assets/img/book-placeholder.png';">`;
        }).join('');
        imgCont.style.display = 'flex';
    } else {
        imgCont.innerHTML = '';
        imgCont.style.display = 'none';
    }

    optionsCont.innerHTML = '';
    const options = q['options' + lang] || q['optionsEn'] || q.options || {};
    
    Object.entries(options).forEach(([letter, text]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${_markdownToHtml(text)}</span>`;
        btn.onclick = () => selectAnswer(letter, btn);
        optionsCont.appendChild(btn);
    });
    renderLatexInElement(optionsCont);

    document.getElementById('q-explanation').style.display = 'none';
    document.getElementById('exp-chapter-select').style.display = 'none';
    
    if (confContainer) confContainer.style.display = 'none';

    let submitBtnCont = document.getElementById('q-submit-container');
    if (!submitBtnCont) {
        submitBtnCont = document.createElement('div');
        submitBtnCont.id = 'q-submit-container';
        submitBtnCont.className = 'quiz-submit-container';
        submitBtnCont.innerHTML = `<button id="btn-submit-q" class="btn-submit-q" disabled>
            <i class="fas fa-check-circle"></i> <span>${lang === 'Ru' ? 'Ответить' : 'Submit Answer'}</span>
        </button>`;
        document.getElementById('q-options').after(submitBtnCont);
        document.getElementById('btn-submit-q').onclick = () => submitAnswer(false);
    }
    
    submitBtnCont.style.display = q.multiAnswer ? 'flex' : 'none';
    const submitBtn = document.getElementById('btn-submit-q');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = lang === 'Ru' ? 'Ответить' : 'Submit Answer';
    
    if (state.settings.exam) {
        startExamTimer();
    }
}

function submitCustomCardAnswer(isCorrect) {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }
    const q = state.questions[state.currentIndex];
    
    if (isCorrect) {
        state.score++;
        playSound('correct');
        triggerHaptic('correct');
    } else {
        playSound('wrong');
        triggerHaptic('wrong');
    }
    
    const mastery = getQuestionMastery(q);
    if (isCorrect) {
        mastery.consecutiveCorrect = Math.max((mastery.consecutiveCorrect || 0) + 2, 2);
        mastery.state = 'green';
    } else {
        mastery.consecutiveCorrect = 0;
        mastery.state = 'red';
    }
    mastery.lastAnswered = Date.now();
    saveQuestionMastery(q, mastery);

    state.answers.push({
        questionId: q.id,
        chosen: isCorrect ? 'A' : '',
        correct: 'A',
        time: Date.now() - state.questionStartTime,
        isCorrect: isCorrect
    });

    setTimeout(() => {
        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            renderQuestion();
            document.querySelector('.quiz-screen.active').scrollTo(0,0);
        } else {
            showResults();
        }
    }, 400);
}

function showCustomCardExplanation(q) {
    const lang = state.settings.lang;
    const isRu = lang === 'Ru';
    const expBox = document.getElementById('q-explanation');
    if (!expBox) return;

    const expImgCont = document.getElementById('exp-image-container');
    if (expImgCont) {
        expImgCont.innerHTML = '';
        expImgCont.style.display = 'none';
    }

    const rawExp = q['explanation' + lang] || q['explanationEn'] || q.explanation || '';
    const expTextEl = document.getElementById('exp-text');
    expTextEl.innerHTML = `<p>${rawExp}</p>`;
    expBox.style.display = 'block';

    const mainReaderBtn = document.getElementById('btn-open-reader-main');
    const picker = document.getElementById('exp-chapter-select');
    if (picker) picker.style.display = 'none';

    if (mainReaderBtn && q.bookPath && q.chapterId) {
        mainReaderBtn.style.display = 'inline-flex';
        mainReaderBtn.onclick = () => {
            openReader(q.chapterId, q.bookPath);
        };
    } else if (mainReaderBtn) {
        mainReaderBtn.style.display = 'none';
    }

    const nextBtn = document.getElementById('btn-next-q');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
}

function selectAnswer(letter, btn) {
    const q = state.questions[state.currentIndex];
    
    if (q.multiAnswer) {
        if (state.currentSelected.includes(letter)) {
            state.currentSelected = state.currentSelected.filter(l => l !== letter);
            btn.classList.remove('selected');
        } else {
            state.currentSelected.push(letter);
            btn.classList.add('selected');
        }
        
        const submitBtn = document.getElementById('btn-submit-q');
        if (submitBtn) submitBtn.disabled = state.currentSelected.length === 0;
    } else {
        state.currentSelected = [letter];
        
        if (state.settings.exam) {
            const optionsCont = document.getElementById('q-options');
            const buttons = optionsCont.querySelectorAll('.option-btn');
            buttons.forEach(b => {
                b.disabled = true;
                if (b === btn) {
                    b.classList.add('selected');
                }
            });
        }
        
        submitAnswer(false);
    }
}

function submitAnswer(forceWrong = false) {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
    }

    const q = state.questions[state.currentIndex];
    let isCorrect = false;
    let userChoices = [];
    let correctChoices = (Array.isArray(q.correctAnswer) ? [...q.correctAnswer] : [q.correctAnswer]).sort();
    
    if (forceWrong) {
        isCorrect = false;
        userChoices = [];
    } else {
        userChoices = [...state.currentSelected].sort();
        isCorrect = JSON.stringify(userChoices) === JSON.stringify(correctChoices);
    }
    
    if (isCorrect) {
        state.score++;
        playSound('correct');
        triggerHaptic('correct');
    } else {
        playSound('wrong');
        triggerHaptic('wrong');
    }

    state.answers.push({
        questionId: q.id,
        chosen: q.multiAnswer ? userChoices : userChoices[0],
        correct: q.correctAnswer,
        time: Date.now() - state.questionStartTime,
        isCorrect: isCorrect
    });

    if (state.settings.exam) {
        const mastery = getQuestionMastery(q);
        if (isCorrect) {
            mastery.consecutiveCorrect = (mastery.consecutiveCorrect || 0) + 1;
            if (mastery.consecutiveCorrect === 1) mastery.state = 'yellow';
            else if (mastery.consecutiveCorrect >= 2) mastery.state = 'green';
        } else {
            mastery.consecutiveCorrect = 0;
            mastery.state = 'red';
        }
        mastery.lastAnswered = Date.now();
        saveQuestionMastery(q, mastery);

        const optionsCont = document.getElementById('q-options');
        const buttons = optionsCont.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        if (q.multiAnswer) {
            const submitBtnCont = document.getElementById('q-submit-container');
            if (submitBtnCont) submitBtnCont.style.display = 'none';
        }

        setTimeout(() => {
            if (state.currentIndex < state.questions.length - 1) {
                state.currentIndex++;
                renderQuestion();
                document.querySelector('.quiz-screen.active').scrollTo(0,0);
            } else {
                showResults();
            }
        }, 500);
        return;
    }

    const optionsCont = document.getElementById('q-options');
    const buttons = optionsCont.querySelectorAll('.option-btn');

    buttons.forEach(btn => {
        const letter = btn.querySelector('.option-letter').textContent;
        btn.disabled = true;
        btn.classList.remove('selected');

        if (correctChoices.includes(letter)) {
            btn.classList.add('correct');
        } else if (userChoices.includes(letter)) {
            btn.classList.add('wrong');
        }
    });

    if (q.multiAnswer) {
        const submitBtnCont = document.getElementById('q-submit-container');
        if (submitBtnCont) submitBtnCont.style.display = 'none';
    }

    if (isCorrect) {
        const confContainer = document.getElementById('confidence-rating-container');
        if (confContainer) {
            confContainer.style.display = 'block';
            
            const btnUnsure = document.getElementById('chip-unsure');
            const btnEasy = document.getElementById('chip-easy');
            
            btnUnsure.classList.remove('active');
            btnEasy.classList.remove('active');
            
            btnUnsure.onclick = () => {
                playSound('click');
                triggerHaptic('click');
                btnUnsure.classList.add('active');
                btnEasy.classList.remove('active');
                
                const mastery = getQuestionMastery(q);
                mastery.consecutiveCorrect = (mastery.consecutiveCorrect || 0) + 1;
                if (mastery.consecutiveCorrect === 1) mastery.state = 'yellow';
                else if (mastery.consecutiveCorrect >= 2) mastery.state = 'green';
                mastery.lastAnswered = Date.now();
                saveQuestionMastery(q, mastery);
            };
            
            btnEasy.onclick = () => {
                playSound('click');
                triggerHaptic('click');
                btnEasy.classList.add('active');
                btnUnsure.classList.remove('active');
                
                const mastery = getQuestionMastery(q);
                mastery.consecutiveCorrect = Math.max((mastery.consecutiveCorrect || 0) + 2, 2);
                mastery.state = 'green';
                mastery.lastAnswered = Date.now();
                saveQuestionMastery(q, mastery);
            };
        }
    } else {
        const mastery = getQuestionMastery(q);
        mastery.consecutiveCorrect = 0;
        mastery.state = 'red';
        mastery.lastAnswered = Date.now();
        saveQuestionMastery(q, mastery);
        
        const confContainer = document.getElementById('confidence-rating-container');
        if (confContainer) confContainer.style.display = 'none';
    }

    showExplanation();
}

function getChapterTitle(chapterId, bookPath) {
    const path = bookPath || state.bookPath;
    const book = state.allBooksWithQuizzes.find(b => b.bookPath === path);
    if (!book || !book.meta || !book.meta.chapters) {
        return chapterId.replace('chapter-', 'Chapter ');
    }
    const cleanId = chapterId.replace('.md', '');
    const chapter = book.meta.chapters.find(ch => ch.file.replace('.md', '') === cleanId);
    const isRu = state.settings.lang === 'Ru';
    if (chapter) {
        return isRu && chapter.russian ? chapter.russian : chapter.title;
    }
    return chapterId.replace('chapter-', 'Chapter ');
}

function showExplanation() {
    const q = state.questions[state.currentIndex];
    const lang = state.settings.lang;
    const expBox = document.getElementById('q-explanation');
    
    // Handle Explanation Image
    const expImgCont = document.getElementById('exp-image-container');
    expImgCont.innerHTML = ''; // Clear previous

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    const bookPath = q.bookPath || state.bookPath;
    
    // Helper to add an image
    const addImg = (src) => {
        const imgSrc = resolveQuizImg(src, bookPath);
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'quiz-q-image';
        img.onerror = () => { img.onerror = null; img.src = 'assets/img/book-placeholder.png'; };
        img.onclick = () => window.open(imgSrc, '_blank');
        expImgCont.appendChild(img);
    };

    if (q.explanationImages && Array.isArray(q.explanationImages)) {
        q.explanationImages.forEach(img => addImg(img));
        expImgCont.style.display = 'block';
    } else if (q.explanationImage) {
        addImg(q.explanationImage);
        expImgCont.style.display = 'block';
    } else {
        expImgCont.style.display = 'none';
    }

    const rawExp = q['explanation' + lang] || q['explanationEn'] || q.explanation || 'No explanation provided.';
    // Convert newlines to paragraphs
    const formattedExp = rawExp.split('\n\n')
        .map(p => `<p>${_markdownToHtml(p.trim())}</p>`)
        .join('');
    
    const expTextEl = document.getElementById('exp-text');
    expTextEl.innerHTML = formattedExp;
    renderLatexInElement(expTextEl);
    expBox.style.display = 'block';
    
    const metaChapters = (q.meta && q.meta.chapter) || [];
    const chapterList = Array.isArray(metaChapters) ? metaChapters : (metaChapters ? [metaChapters] : []);
    const picker = document.getElementById('exp-chapter-select');
    const pickerGrid = document.getElementById('exp-chapter-list');
    const mainReaderBtn = document.getElementById('btn-open-reader-main');

    if (chapterList.length > 1) {
        mainReaderBtn.style.display = 'none';
        picker.style.display = 'block';
        pickerGrid.innerHTML = '';
        chapterList.forEach(ch => {
            const btn = document.createElement('button');
            btn.className = 'chapter-link-btn';
            btn.textContent = getChapterTitle(ch, q.bookPath);
            btn.onclick = () => showChapterPreview(ch, q.bookPath);
            pickerGrid.appendChild(btn);
        });
    } else if (chapterList.length === 1) {
        mainReaderBtn.style.display = 'inline-flex';
        picker.style.display = 'none';
        mainReaderBtn.onclick = () => showChapterPreview(chapterList[0], q.bookPath);
    } else {
        mainReaderBtn.style.display = 'none';
        picker.style.display = 'none';
    }

    expBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const nextBtn = document.getElementById('btn-next-q');
    if (nextBtn) {
        nextBtn.style.display = '';
    }
    const isRu = lang === 'Ru';
    if (state.currentIndex === state.questions.length - 1) {
        nextBtn.innerHTML = (isRu ? 'Результаты ' : 'See Results ') + '<i class="fas fa-flag-checkered"></i>';
    } else {
        nextBtn.innerHTML = (isRu ? 'Далее ' : 'Next Question ') + '<i class="fas fa-chevron-right"></i>';
    }
}

function setupPreviewModal() {
    const modal = document.createElement('div');
    modal.id = 'chapter-preview-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="preview-chapter-title">Chapter Title</h2>
                <button class="modal-close" id="btn-close-preview"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p id="preview-chapter-info">Ready to read this chapter in the full reader?</p>
            </div>
            <div class="modal-footer">
                <button id="btn-confirm-read" class="btn-primary">Go to Reader</button>
                <button id="btn-cancel-read" class="btn-outline">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btn-close-preview').onclick = hideChapterPreview;
    document.getElementById('btn-cancel-read').onclick = hideChapterPreview;
    modal.onclick = (e) => { if (e.target === modal) hideChapterPreview(); };
}

function showChapterPreview(chapterId, bookPath) {
    const title = getChapterTitle(chapterId, bookPath);
    const isRu = state.settings.lang === 'Ru';
    
    document.getElementById('preview-chapter-title').textContent = title;
    document.getElementById('preview-chapter-info').textContent = isRu 
        ? 'Открыть эту главу в полноэкранном режиме чтения?' 
        : 'Open this chapter in full reading mode?';
    
    const confirmBtn = document.getElementById('btn-confirm-read');
    confirmBtn.textContent = isRu ? 'Перейти к чтению' : 'Go to Reader';
    confirmBtn.onclick = () => {
        hideChapterPreview();
        openReader(chapterId, bookPath);
    };

    const cancelBtn = document.getElementById('btn-cancel-read');
    cancelBtn.textContent = isRu ? 'Отмена' : 'Cancel';

    document.getElementById('chapter-preview-modal').classList.add('active');
}

function hideChapterPreview() {
    document.getElementById('chapter-preview-modal').classList.remove('active');
}

function openReader(chapterId, bookPath) {
    const lang = state.settings.lang;
    const edition = lang === 'Ru' ? 'russian' : 'original';
    const cleanId = chapterId.replace('.md', '');
    const path = bookPath || state.bookPath;
    const url = `reader.html?book=${path}&chapter=${cleanId}&edition=${edition}`;
    window.open(url, '_blank');
}

function setupQuestionListeners() {
    document.getElementById('btn-next-q').onclick = () => {
        const q = state.questions[state.currentIndex];
        const confContainer = document.getElementById('confidence-rating-container');
        if (confContainer && confContainer.style.display === 'block') {
            const btnUnsure = document.getElementById('chip-unsure');
            const btnEasy = document.getElementById('chip-easy');
            if (btnUnsure && btnEasy && !btnUnsure.classList.contains('active') && !btnEasy.classList.contains('active')) {
                const mastery = getQuestionMastery(q);
                mastery.consecutiveCorrect = (mastery.consecutiveCorrect || 0) + 1;
                if (mastery.consecutiveCorrect === 1) mastery.state = 'yellow';
                else if (mastery.consecutiveCorrect >= 2) mastery.state = 'green';
                mastery.lastAnswered = Date.now();
                saveQuestionMastery(q, mastery);
            }
        }

        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            renderQuestion();
            document.querySelector('.quiz-screen.active').scrollTo(0,0);
        } else {
            showResults();
        }
    };

    window.openQuizExitModal = function() {
        const modal = document.getElementById('quiz-exit-confirm-modal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeQuizExitModal = function() {
        const modal = document.getElementById('quiz-exit-confirm-modal');
        if (modal) modal.style.display = 'none';
    };

    window.confirmExitToLibrary = function() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        window.location.href = 'index.html';
    };

    window.confirmExitToLobby = function() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        window.closeQuizExitModal();
        state.activeTopicFilter = null;
        switchScreen('screen-lobby');
        updateWeakSpotRadar();
    };

    const btnExitQuiz = document.getElementById('btn-exit-quiz');
    if (btnExitQuiz) {
        btnExitQuiz.onclick = window.openQuizExitModal;
    }

    const btnExitAllQ = document.getElementById('btn-exit-all-q');
    if (btnExitAllQ) {
        btnExitAllQ.onclick = () => {
            switchScreen('screen-lobby');
            updateWeakSpotRadar();
        };
    }

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        btnFav.onclick = () => {
            const currentQ = state.questions[state.currentIndex];
            toggleFavoriteQuestion(currentQ);
        };
    }

    const btnReport = document.getElementById('btn-report-question');
    if (btnReport) {
        btnReport.onclick = () => {
            const currentQ = state.questions[state.currentIndex];
            openReportModal(currentQ);
        };
    }

    const btnReportExp = document.getElementById('btn-report-question-exp');
    if (btnReportExp) {
        btnReportExp.onclick = () => {
            const currentQ = state.questions[state.currentIndex];
            openReportModal(currentQ);
        };
    }

    const btnCloseReport = document.getElementById('btn-close-report-modal');
    if (btnCloseReport) btnCloseReport.onclick = closeReportModal;

    const btnSubmitReport = document.getElementById('btn-submit-report');
    if (btnSubmitReport) btnSubmitReport.onclick = submitReportModal;
}

function showResults() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    state.activeTopicFilter = null; // Reset Express quiz filter
    
    switchScreen('screen-results');
    const isRu = state.settings.lang === 'Ru';
    
    const totalQ = state.questions ? state.questions.length : 1;
    const pct = Math.round((state.score / (totalQ || 1)) * 100);
    document.getElementById('res-score-big').textContent = `${pct}%`;
    document.getElementById('res-score-raw').textContent = `${state.score} / ${totalQ} ` + (isRu ? 'Верно' : 'Correct');
    
    const startTimeVal = state.startTime || Date.now();
    const totalTime = Math.round((Date.now() - startTimeVal) / 1000);
    const m = Math.floor(totalTime / 60);
    const s = totalTime % 60;
    document.getElementById('res-time').textContent = `${m}m ${s}s`;
    
    const avg = Math.round(totalTime / (totalQ || 1));
    document.getElementById('res-avg-time').textContent = `${avg}s`;

    let grade = isRu ? 'Нужно подтянуть' : 'Needs Work';
    let trophy = '🔭';
    if (pct >= 90) { grade = isRu ? 'Отлично!' : 'Excellent!'; trophy = '🏆'; }
    else if (pct >= 75) { grade = isRu ? 'Хороший результат!' : 'Great Job!'; trophy = '🌟'; }
    else if (pct >= 60) { grade = isRu ? 'Зачтено' : 'Passed'; trophy = '✅'; }
    
    document.getElementById('res-grade').textContent = grade;
    document.getElementById('res-trophy').textContent = trophy;

    renderIncorrectAnswers();

    // Gather unique topic titles and manifest breakdown involved in this session
    const topicSet = new Set();
    const manifestStatsMap = {};

    if (state.questions && state.questions.length > 0) {
        state.questions.forEach((q, idx) => {
            const t = getQuestionTopic(q);
            if (t) topicSet.add(t);

            const ans = state.answers ? state.answers[idx] : null;
            const isCorr = ans ? !!ans.isCorrect : false;
            const mItem = resolveQuestionManifestItem(q);
            if (mItem) {
                const mKey = mItem.id;
                if (!manifestStatsMap[mKey]) {
                    manifestStatsMap[mKey] = {
                        id: mKey,
                        num: mItem.num,
                        title: isRu ? mItem.titleRu : mItem.titleEn,
                        icon: mItem.icon,
                        total: 0,
                        correct: 0,
                        wrong: 0
                    };
                }
                manifestStatsMap[mKey].total++;
                if (isCorr) manifestStatsMap[mKey].correct++;
                else manifestStatsMap[mKey].wrong++;
                topicSet.add(isRu ? mItem.titleRu : mItem.titleEn);
            }
        });
    }
    const topicsList = Array.from(topicSet);
    const manifestBreakdown = Object.values(manifestStatsMap);

    let sessionSetTitle = '';
    if (manifestBreakdown.length > 1) {
        const topNames = manifestBreakdown.slice(0, 3).map(m => m.title);
        sessionSetTitle = topNames.join(' + ') + (manifestBreakdown.length > 3 ? ` (+${manifestBreakdown.length - 3})` : '');
    } else if (manifestBreakdown.length === 1) {
        sessionSetTitle = manifestBreakdown[0].title;
    } else {
        sessionSetTitle = (state.bookMeta && (state.bookMeta.russian_title || state.bookMeta.title)) || (isRu ? 'Клинический квиз' : 'Clinical Quiz');
    }

    // Build question detail / error list
    const sessionDetailsList = [];
    if (state.answers && state.questions) {
        state.answers.forEach((ans, idx) => {
            const q = state.questions[idx];
            if (!q) return;

            const lang = state.settings.lang || 'En';
            const optionsMap = q['options' + lang] || q['optionsEn'] || q.options || {};
            
            const chosenLetters = Array.isArray(ans.chosen) ? ans.chosen : (ans.chosen ? [ans.chosen] : []);
            const correctLetters = Array.isArray(q.correctAnswer) ? q.correctAnswer : (q.correctAnswer ? [q.correctAnswer] : []);

            const chosenTextArr = chosenLetters.map(l => `${l}: ${optionsMap[l] || l}`);
            const correctTextArr = correctLetters.map(l => `${l}: ${optionsMap[l] || l}`);

            sessionDetailsList.push({
                questionIndex: idx + 1,
                questionId: q.id || getQuestionKey(q),
                specialId: getQuestionSpecialId(q) || q.id || getQuestionKey(q),
                bookPath: q.bookPath || state.bookPath || '',
                setId: q.setId || '',
                manifestId: q.manifestId || '',
                questionEn: q.questionEn || q.question || '',
                questionRu: q.questionRu || q.question || '',
                optionsEn: q.optionsEn || q.options || {},
                optionsRu: q.optionsRu || q.options || {},
                correctAnswer: q.correctAnswer,
                chosen: ans.chosen,
                chosenText: chosenTextArr.join(' | ') || (isRu ? 'Нет ответа' : 'No Answer'),
                correctText: correctTextArr.join(' | '),
                isCorrect: !!ans.isCorrect,
                explanationEn: q.explanationEn || q.explanation || '',
                explanationRu: q.explanationRu || q.explanation || '',
                chapterId: q.chapterId || ''
            });
        });
    }

    const countModeVal = state.settings.allQuestions ? 'all' : String(state.settings.count || 10);

    // Create completed session record & trigger cloud/local sync
    const newSessionObj = {
        sessionId: 'sess_' + Date.now(),
        date: new Date().toISOString(),
        scorePct: pct,
        correctQ: state.score,
        totalQ: totalQ,
        timeSpentSec: totalTime,
        mode: state.sessionMode || 'smart',
        lang: state.settings.lang || 'En',
        countMode: countModeVal,
        topics: topicsList,
        setTitle: sessionSetTitle,
        manifestBreakdown: manifestBreakdown,
        manifestIds: manifestBreakdown.map(m => m.id),
        errors: sessionDetailsList
    };

    // Calculate and apply RPG EXP Progression & Regression
    const curRpg = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');
    const expCalc = RPG_SYSTEM.calculateSessionExp(newSessionObj, curRpg.level);
    const updatedRpg = RPG_SYSTEM.applyExpDelta(curRpg, expCalc.netExp, isRu ? 'Ru' : 'En');

    newSessionObj.expGained = expCalc.netExp;
    newSessionObj.newLevel = updatedRpg.level;

    if (!state.userProfile) state.userProfile = {};
    state.userProfile.level = updatedRpg.level;
    state.userProfile.currentExp = updatedRpg.currentExp;
    state.userProfile.totalExp = updatedRpg.totalExp;
    state.userProfile.tierId = updatedRpg.tierId;
    state.userProfile.levelStr = updatedRpg.levelData.fullTitle;
    localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));

    updateUserProfileDisplay();
    renderRpgResultsCard(expCalc, updatedRpg, isRu);

    if (totalQ >= 2 && !state.isSingleQuestionPreview) {
        syncCloudUserData(newSessionObj);
    } else {
        syncCloudUserData(null);
    }
    state.isSingleQuestionPreview = false;
}

function renderIncorrectAnswers() {
    const isRu = state.settings.lang === 'Ru';
    const errorsSection = document.getElementById('exam-errors-section');
    const errorsList = document.getElementById('exam-errors-list');
    const errorsTitle = document.getElementById('exam-errors-title');

    if (!state.settings.exam) {
        errorsSection.style.display = 'none';
        return;
    }

    const incorrectIndices = [];
    state.answers.forEach((ans, idx) => {
        if (!ans.isCorrect) {
            incorrectIndices.push(idx);
        }
    });

    if (incorrectIndices.length === 0) {
        errorsSection.style.display = 'none';
        return;
    }

    errorsTitle.textContent = isRu ? 'Вопросы с ошибками' : 'Review Incorrect Answers';
    errorsList.innerHTML = '';

    incorrectIndices.forEach(idx => {
        const q = state.questions[idx];
        const ans = state.answers[idx];

        const itemDiv = document.createElement('div');
        itemDiv.className = 'exam-error-item';

        // Question number
        const numDiv = document.createElement('div');
        numDiv.className = 'exam-error-q-num';
        numDiv.textContent = (isRu ? 'Вопрос ' : 'Question ') + (idx + 1);
        itemDiv.appendChild(numDiv);

        // Question text
        const textDiv = document.createElement('div');
        textDiv.className = 'exam-error-q-text';
        textDiv.innerHTML = _markdownToHtml(q['question' + state.settings.lang] || q['questionEn'] || q.question || '');
        itemDiv.appendChild(textDiv);

        // Question image(s) (if exist)
        const qImgs = getQuestionImages(q);
        if (qImgs.length > 0) {
            const imgCont = document.createElement('div');
            imgCont.className = 'quiz-image-container';
            const bookPath = q.bookPath || state.bookPath;
            imgCont.innerHTML = qImgs.map(img => {
                const imgSrc = resolveQuizImg(img, bookPath);
                return `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')" onerror="this.onerror=null; this.src='assets/img/book-placeholder.png';">`;
            }).join('');
            itemDiv.appendChild(imgCont);
        }

        if (q.isCustomCard) {
            const cardAnsDiv = document.createElement('div');
            cardAnsDiv.className = 'cs-flashcard-error-ans';
            cardAnsDiv.style.cssText = 'padding: 12px; border-radius: 8px; background: rgba(35, 134, 54, 0.15); border: 1px solid var(--quiz-correct); margin-top: 10px; font-size: 0.95rem; font-weight: 600; color: var(--quiz-text);';
            cardAnsDiv.innerHTML = `<span style="color: var(--quiz-muted); font-size: 0.75rem; display: block; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">${isRu ? 'Правильный ответ' : 'Correct Answer'}</span> ${q.cardAnswer}`;
            itemDiv.appendChild(cardAnsDiv);
        } else {
            // Options grid
            const optionsGrid = document.createElement('div');
            optionsGrid.className = 'options-grid';

            const options = q['options' + state.settings.lang] || q['optionsEn'] || q.options || {};
            const correctChoices = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
            const userChoices = Array.isArray(ans.chosen) ? ans.chosen : [ans.chosen];

            Object.entries(options).forEach(([letter, text]) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${_markdownToHtml(text)}</span>`;

                if (correctChoices.includes(letter)) {
                    btn.classList.add('correct');
                } else if (userChoices.includes(letter)) {
                    btn.classList.add('wrong');
                }
                optionsGrid.appendChild(btn);
            });
            itemDiv.appendChild(optionsGrid);
        }

        // Explanation box
        const expBox = document.createElement('div');
        expBox.className = 'explanation-box';

        // Exp header
        const expHeader = document.createElement('div');
        expHeader.className = 'exp-header';
        expHeader.innerHTML = `<i class="fas fa-lightbulb"></i> <span>${isRu ? 'Клиническое объяснение' : 'Clinical Explanation'}</span>`;
        expBox.appendChild(expHeader);

        // Exp images
        const expImgCont = document.createElement('div');
        expImgCont.className = 'quiz-image-container';
        expImgCont.style.display = 'none';

        const bookPath = q.bookPath || state.bookPath;
        const addImg = (src) => {
            const imgSrc = resolveQuizImg(src, bookPath);
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'quiz-q-image';
            img.onerror = () => { img.onerror = null; img.src = 'assets/img/book-placeholder.png'; };
            img.onclick = () => window.open(imgSrc, '_blank');
            expImgCont.appendChild(img);
        };

        if (q.explanationImages && Array.isArray(q.explanationImages)) {
            q.explanationImages.forEach(img => addImg(img));
            expImgCont.style.display = 'block';
        } else if (q.explanationImage) {
            addImg(q.explanationImage);
            expImgCont.style.display = 'block';
        }

        if (expImgCont.style.display === 'block') {
            expBox.appendChild(expImgCont);
        }

        // Exp text
        const expTextDiv = document.createElement('div');
        expTextDiv.className = 'exp-content';
        const rawExp = q['explanation' + state.settings.lang] || q['explanationEn'] || q.explanation || 'No explanation provided.';
        const formattedExp = rawExp.split('\n\n')
            .map(p => `<p>${_markdownToHtml(p.trim())}</p>`)
            .join('');
        expTextDiv.innerHTML = formattedExp;
        expBox.appendChild(expTextDiv);

        // Exp actions (Reader link)
        const expActions = document.createElement('div');
        expActions.className = 'exp-actions';

        const metaChapters = (q.meta && q.meta.chapter) || [];
        const chapterList = Array.isArray(metaChapters) ? metaChapters : (metaChapters ? [metaChapters] : []);

        if (chapterList.length > 1) {
            const pickerDiv = document.createElement('div');
            pickerDiv.className = 'exp-chapter-picker';
            pickerDiv.style.width = '100%';

            const pickerLabel = document.createElement('p');
            pickerLabel.textContent = isRu ? 'Выберите главу для открытия:' : 'Select chapter to open:';
            pickerLabel.style.margin = '0 0 10px 0';
            pickerLabel.style.fontSize = '0.9rem';
            pickerLabel.style.color = 'var(--quiz-muted)';
            pickerDiv.appendChild(pickerLabel);

            const linksGrid = document.createElement('div');
            linksGrid.className = 'chapter-links-grid';

            chapterList.forEach(ch => {
                const btn = document.createElement('button');
                btn.className = 'chapter-link-btn';
                btn.textContent = getChapterTitle(ch, q.bookPath);
                btn.onclick = () => showChapterPreview(ch, q.bookPath);
                linksGrid.appendChild(btn);
            });

            pickerDiv.appendChild(linksGrid);
            expBox.appendChild(pickerDiv);
        } else if (chapterList.length === 1) {
            const readBtn = document.createElement('button');
            readBtn.className = 'btn-secondary';
            readBtn.innerHTML = `<i class="fas fa-book-open"></i> ${isRu ? 'В читалку' : 'Open in Reader'}`;
            readBtn.onclick = () => showChapterPreview(chapterList[0], q.bookPath);
            expActions.appendChild(readBtn);
            expBox.appendChild(expActions);
        }

        itemDiv.appendChild(expBox);
        renderLatexInElement(itemDiv);
        errorsList.appendChild(itemDiv);
    });

    errorsSection.style.display = 'block';
}

function setupResultsListeners() {
    const isRu = state.settings.lang === 'Ru';
    document.getElementById('btn-restart').textContent = isRu ? '🔁 Повторить' : '🔁 Try Again';
    document.getElementById('btn-new-session').textContent = isRu ? '🔀 Новый сеанс' : '🔀 New Session';
    document.getElementById('btn-res-exit').textContent = isRu ? '📖 В библиотеку' : '📖 Back to Library';

    document.getElementById('btn-restart').onclick = startQuiz;
    document.getElementById('btn-new-session').onclick = () => switchScreen('screen-lobby');
    document.getElementById('btn-res-exit').onclick = () => window.location.href = 'index.html';
}

function switchScreen(id) {
    document.querySelectorAll('.quiz-screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
        target.classList.add('active');
        if (typeof target.scrollTo === 'function') target.scrollTo(0, 0);
    }
}

function showScreen(id) {
    switchScreen(id);
}

window.switchScreen = switchScreen;
window.showScreen = showScreen;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderAllQuestionsList() {
    const listCont = document.getElementById('all-questions-list');
    listCont.innerHTML = '';
    
    const lang = state.settings.lang;
    const isRu = lang === 'Ru';
    
    state.questions.forEach((q, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'all-q-item';
        
        // Header (Question number + Question text + Chevron icon)
        const headerDiv = document.createElement('div');
        headerDiv.className = 'all-q-header';
        
        const numSpan = document.createElement('span');
        numSpan.className = 'all-q-num';
        numSpan.textContent = `${idx + 1}`;
        headerDiv.appendChild(numSpan);
        
        const textSpan = document.createElement('span');
        textSpan.className = 'all-q-text';
        textSpan.innerHTML = _markdownToHtml(q['question' + lang] || q['questionEn'] || q.question || '');
        headerDiv.appendChild(textSpan);
        
        const chevronSpan = document.createElement('span');
        chevronSpan.className = 'all-q-chevron';
        chevronSpan.innerHTML = '<i class="fas fa-chevron-down"></i>';
        headerDiv.appendChild(chevronSpan);
        
        itemDiv.appendChild(headerDiv);
        
        // Details container (hidden by default)
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'all-q-details';
        
        // Question Image(s) (if any)
        const qImgs = getQuestionImages(q);
        if (qImgs.length > 0) {
            const imgCont = document.createElement('div');
            imgCont.className = 'quiz-image-container';
            const bookPath = q.bookPath || state.bookPath;
            imgCont.innerHTML = qImgs.map(img => {
                const imgSrc = resolveQuizImg(img, bookPath);
                return `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')" onerror="this.onerror=null; this.src='assets/img/book-placeholder.png';">`;
            }).join('');
            detailsDiv.appendChild(imgCont);
        }
        
        let optionsGrid = null;
        if (q.isCustomCard) {
            const cardAnsDiv = document.createElement('div');
            cardAnsDiv.className = 'cs-flashcard-error-ans';
            cardAnsDiv.style.cssText = 'padding: 12px; border-radius: 8px; background: rgba(35, 134, 54, 0.15); border: 1px solid var(--quiz-correct); margin-top: 10px; font-size: 0.95rem; font-weight: 600; color: var(--quiz-text);';
            cardAnsDiv.innerHTML = `<span style="color: var(--quiz-muted); font-size: 0.75rem; display: block; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">${isRu ? 'Правильный ответ' : 'Correct Answer'}</span> ${q.cardAnswer}`;
            cardAnsDiv.onclick = (e) => e.stopPropagation();
            detailsDiv.appendChild(cardAnsDiv);
        } else {
            optionsGrid = document.createElement('div');
            optionsGrid.className = 'options-grid';
            
            const options = q['options' + lang] || q['optionsEn'] || q.options || {};
            const correctChoices = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
            
            Object.entries(options).forEach(([letter, text]) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${_markdownToHtml(text)}</span>`;
                
                if (correctChoices.includes(letter)) {
                    btn.classList.add('correct');
                }
                optionsGrid.appendChild(btn);
            });
            detailsDiv.appendChild(optionsGrid);
        }
        
        // Explanation box
        const expBox = document.createElement('div');
        expBox.className = 'explanation-box';
        
        // Exp header
        const expHeader = document.createElement('div');
        expHeader.className = 'exp-header';
        expHeader.innerHTML = `<i class="fas fa-lightbulb"></i> <span>${isRu ? 'Клиническое объяснение' : 'Clinical Explanation'}</span>`;
        expBox.appendChild(expHeader);
        
        // Exp images (if any)
        const expImgCont = document.createElement('div');
        expImgCont.className = 'quiz-image-container';
        expImgCont.style.display = 'none';
        
        const bookPath = q.bookPath || state.bookPath;
        const addImg = (src) => {
            const imgSrc = resolveQuizImg(src, bookPath);
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'quiz-q-image';
            img.onerror = () => { img.onerror = null; img.src = 'assets/img/book-placeholder.png'; };
            img.onclick = () => window.open(imgSrc, '_blank');
            expImgCont.appendChild(img);
        };
        
        if (q.explanationImages && Array.isArray(q.explanationImages)) {
            q.explanationImages.forEach(img => addImg(img));
            expImgCont.style.display = 'block';
        } else if (q.explanationImage) {
            addImg(q.explanationImage);
            expImgCont.style.display = 'block';
        }
        
        if (expImgCont.style.display === 'block') {
            expBox.appendChild(expImgCont);
        }
        
        // Exp text
        const expTextDiv = document.createElement('div');
        expTextDiv.className = 'exp-content';
        const rawExp = q['explanation' + lang] || q['explanationEn'] || q.explanation || 'No explanation provided.';
        const formattedExp = rawExp.split('\n\n')
            .map(p => `<p>${_markdownToHtml(p.trim())}</p>`)
            .join('');
        expTextDiv.innerHTML = formattedExp;
        expBox.appendChild(expTextDiv);
        
        // Exp actions (Reader link)
        const expActions = document.createElement('div');
        expActions.className = 'exp-actions';
        
        const metaChapters = (q.meta && q.meta.chapter) || [];
        const chapterList = Array.isArray(metaChapters) ? metaChapters : (metaChapters ? [metaChapters] : []);
        
        if (chapterList.length > 1) {
            const pickerDiv = document.createElement('div');
            pickerDiv.className = 'exp-chapter-picker';
            pickerDiv.style.width = '100%';
            
            const pickerLabel = document.createElement('p');
            pickerLabel.textContent = isRu ? 'Выберите главу для открытия:' : 'Select chapter to open:';
            pickerLabel.style.margin = '0 0 10px 0';
            pickerLabel.style.fontSize = '0.9rem';
            pickerLabel.style.color = 'var(--quiz-muted)';
            pickerDiv.appendChild(pickerLabel);
            
            const linksGrid = document.createElement('div');
            linksGrid.className = 'chapter-links-grid';
            
            chapterList.forEach(ch => {
                const btn = document.createElement('button');
                btn.className = 'chapter-link-btn';
                btn.textContent = getChapterTitle(ch, q.bookPath);
                btn.onclick = (e) => {
                    e.stopPropagation();
                    showChapterPreview(ch, q.bookPath);
                };
                linksGrid.appendChild(btn);
            });
            
            pickerDiv.appendChild(linksGrid);
            expBox.appendChild(pickerDiv);
        } else if (chapterList.length === 1) {
            const readBtn = document.createElement('button');
            readBtn.className = 'btn-secondary';
            readBtn.innerHTML = `<i class="fas fa-book-open"></i> ${isRu ? 'В читалку' : 'Open in Reader'}`;
            readBtn.onclick = (e) => {
                e.stopPropagation();
                showChapterPreview(chapterList[0], q.bookPath);
            };
            expActions.appendChild(readBtn);
            expBox.appendChild(expActions);
        }
        
        expBox.onclick = (e) => e.stopPropagation(); // Prevent folding/unfolding when clicking inside explanation
        if (optionsGrid) {
            optionsGrid.onclick = (e) => e.stopPropagation(); // Prevent folding/unfolding when clicking options grid
        }
        
        detailsDiv.appendChild(expBox);
        itemDiv.appendChild(detailsDiv);
        renderLatexInElement(itemDiv);
        
        // Toggle expanded class on click
        headerDiv.onclick = () => {
            itemDiv.classList.toggle('expanded');
        };
        
        listCont.appendChild(itemDiv);
    });
}

async function _initializeSearchIndex() {
    if (state.isIndexing) return;
    state.isIndexing = true;
    
    const statusEl = document.getElementById('quiz-lobby-search-status');
    const isRu = state.settings.lang === 'Ru';
    if (statusEl) {
        statusEl.textContent = isRu ? 'Индексация вопросов...' : 'Indexing quiz sets...';
        statusEl.style.display = 'block';
    }

    try {
        state.searchIndex = [];
        if (!state.setQuestionsMap) state.setQuestionsMap = {};
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        
        let booksToIndex = state.allBooksWithQuizzes || [];
        
        for (const book of booksToIndex) {
            for (const set of book.quiz_sets) {
                try {
                    const cacheKey = `${book.bookPath}::${set.id}`;
                    let questions = [];
                    
                    if (state.setQuestionsMap[cacheKey]) {
                        questions = state.setQuestionsMap[cacheKey];
                    } else {
                        const quizUrl = `${rootPath}${book.bookPath}/${set.file}`;
                        const res = await fetch(quizUrl);
                        const quizData = await res.json();
                        questions = quizData.questions || [];
                        
                        questions.forEach(q => {
                            q.bookPath = book.bookPath;
                            q.meta = quizData.meta;
                        });
                        
                        state.setQuestionsMap[cacheKey] = questions;
                    }
                    
                    questions.forEach((q, idx) => {
                        state.searchIndex.push({
                            bookPath: book.bookPath,
                            setId: set.id,
                            setLabel: set.label,
                            setFile: set.file,
                            questionIndex: idx,
                            id: q.id !== undefined ? q.id : '',
                            questionEn: q.questionEn || q.question || '',
                            questionRu: q.questionRu || q.question || '',
                            explanationEn: q.explanationEn || q.explanation || '',
                            explanationRu: q.explanationRu || q.explanation || '',
                            optionsEn: q.optionsEn || q.options || {},
                            optionsRu: q.optionsRu || q.options || {}
                        });
                    });
                } catch (e) {
                    console.warn(`[Search] Failed to index set: ${set.id} in ${book.bookPath}`, e);
                }
            }
        }
        if (statusEl) {
            statusEl.textContent = isRu ? `Индексация завершена. Доступно вопросов: ${state.searchIndex.length}` : `Indexing complete. Indexed ${state.searchIndex.length} questions.`;
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
    } catch (err) {
        console.error('[Search] Indexing error:', err);
        if (statusEl) statusEl.textContent = isRu ? 'Ошибка при индексации.' : 'Error during indexing.';
    } finally {
        state.isIndexing = false;
    }
}

function _performLobbySearch() {
    const queryInput = document.getElementById('quiz-lobby-search-input');
    const resultsContainer = document.getElementById('quiz-lobby-search-results');
    if (!queryInput || !resultsContainer) return;

    const query = queryInput.value.toLowerCase().trim();
    const isRu = state.settings.lang === 'Ru';

    if (!query) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
    }

    const matched = [];
    state.searchIndex.forEach(item => {
        let score = 0;
        let matchDetails = '';

        const qEnIdx = item.questionEn.toLowerCase().indexOf(query);
        const qRuIdx = item.questionRu.toLowerCase().indexOf(query);
        if (qEnIdx !== -1 || qRuIdx !== -1) {
            score += 100;
            matchDetails = isRu ? 'Совпадение в вопросе' : 'Question match';
        }

        const eEnIdx = item.explanationEn.toLowerCase().indexOf(query);
        const eRuIdx = item.explanationRu.toLowerCase().indexOf(query);
        if (eEnIdx !== -1 || eRuIdx !== -1) {
            score += 50;
            matchDetails = matchDetails ? matchDetails + (isRu ? ', в объяснении' : ', Explanation') : (isRu ? 'Совпадение в объяснении' : 'Explanation match');
        }

        let optionsMatch = false;
        Object.values(item.optionsEn).forEach(val => {
            if (val.toLowerCase().includes(query)) optionsMatch = true;
        });
        Object.values(item.optionsRu).forEach(val => {
            if (val.toLowerCase().includes(query)) optionsMatch = true;
        });
        if (optionsMatch) {
            score += 30;
            matchDetails = matchDetails ? matchDetails + (isRu ? ', в вариантах' : ', Options') : (isRu ? 'Совпадение в вариантах' : 'Options match');
        }

        if (score > 0) {
            matched.push({ item, score, matchDetails });
        }
    });

    matched.sort((a, b) => b.score - a.score);

    if (matched.length === 0) {
        resultsContainer.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 10px; font-size: 0.85rem;">${isRu ? 'Совпадений не найдено' : 'No matches found'}</div>`;
        resultsContainer.style.display = 'block';
        return;
    }

    resultsContainer.innerHTML = matched.map(({ item, matchDetails }) => {
        const lang = state.settings.lang;
        const qText = item['question' + lang] || item.questionEn || item.questionRu || '';
        const cleanText = qText.replace(/<[^>]*>/g, '');
        const previewText = cleanText.substring(0, 120) + (cleanText.length > 120 ? '...' : '');

        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        const highlightedText = previewText.replace(regex, '<span class="lobby-search-highlight">$1</span>');

        return `
            <div class="lobby-search-result-item" data-book-path="${item.bookPath}" data-set-id="${item.setId}" data-index="${item.questionIndex}">
                <div class="lobby-search-result-header">
                    <span>📂 ${item.setLabel} (#${item.questionIndex + 1})</span>
                    <span class="lobby-search-result-meta">${item.id ? 'ID: ' + item.id : ''}</span>
                </div>
                <div class="lobby-search-result-text">${highlightedText}</div>
                <div class="lobby-search-result-match-type">${matchDetails}</div>
            </div>
        `;
    }).join('');

    resultsContainer.style.display = 'block';

    resultsContainer.querySelectorAll('.lobby-search-result-item').forEach(el => {
        el.onclick = async () => {
            const bookPath = el.dataset.bookPath;
            const setId = el.dataset.setId;
            const qIdx = parseInt(el.dataset.index, 10);

            const foundBook = state.allBooksWithQuizzes.find(b => b.bookPath === bookPath);
            const foundSet = foundBook ? foundBook.quiz_sets.find(s => s.id === setId) : null;
            if (foundSet) {
                state.selectedSets = [{
                    bookPath: bookPath,
                    setId: setId,
                    file: foundSet.file,
                    label: foundSet.label,
                    bookTitle: foundBook.meta.title
                }];
            }
            state.settings.allQuestions = true;

            await startQuiz();

            const items = document.querySelectorAll('.all-q-item');
            if (items && items[qIdx]) {
                items[qIdx].classList.add('expanded');
                items[qIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                items[qIdx].style.outline = '2px solid var(--quiz-accent)';
                setTimeout(() => {
                    items[qIdx].style.transition = 'outline 1s ease';
                    items[qIdx].style.outline = '2px solid transparent';
                }, 2000);
            }
        };
    });
}

// --- Floating Setup Checklist Controller ---

function scrollToSetupTarget(idOrClass, fallbackSelector) {
    const el = document.getElementById(idOrClass) || (fallbackSelector ? document.querySelector(fallbackSelector) : null);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const pulseTarget = el.closest('.lobby-card') || el;
    pulseTarget.classList.remove('highlight-pulse');
    void pulseTarget.offsetWidth; // force reflow
    pulseTarget.classList.add('highlight-pulse');
    setTimeout(() => {
        pulseTarget.classList.remove('highlight-pulse');
    }, 1200);
}

function initChecklistWidget() {
    const widget = document.getElementById('quiz-checklist-widget');
    if (!widget) return;

    if (localStorage.getItem('starley_quiz_checklist_closed') === 'true') {
        widget.classList.add('is-closed');
        return;
    }

    const isMobile = window.innerWidth <= 768;
    const userPrefMin = localStorage.getItem('starley_quiz_checklist_minimized');
    const shouldMin = userPrefMin === 'true' || (userPrefMin === null && isMobile);

    if (shouldMin) {
        widget.classList.add('is-minimized');
        const btnMin = document.getElementById('btn-checklist-min');
        if (btnMin && btnMin.querySelector('i')) {
            btnMin.querySelector('i').className = 'fas fa-plus';
        }
    }

    const savedTheme = localStorage.getItem('starley_quiz_checklist_theme') || 'glass';
    setChecklistTheme(savedTheme);

    const btnMin = document.getElementById('btn-checklist-min');
    if (btnMin) {
        btnMin.onclick = (e) => {
            e.stopPropagation();
            const isMin = widget.classList.toggle('is-minimized');
            localStorage.setItem('starley_quiz_checklist_minimized', isMin ? 'true' : 'false');
            if (btnMin.querySelector('i')) {
                btnMin.querySelector('i').className = isMin ? 'fas fa-plus' : 'fas fa-minus';
            }
        };
    }

    const pill = document.getElementById('checklist-pill');
    if (pill) {
        pill.onclick = () => {
            widget.classList.remove('is-minimized');
            localStorage.setItem('starley_quiz_checklist_minimized', 'false');
            if (btnMin && btnMin.querySelector('i')) {
                btnMin.querySelector('i').className = 'fas fa-minus';
            }
        };
    }

    const btnClose = document.getElementById('btn-checklist-close');
    if (btnClose) {
        btnClose.onclick = (e) => {
            e.stopPropagation();
            widget.classList.add('is-closed');
            localStorage.setItem('starley_quiz_checklist_closed', 'true');
        };
    }

    const themeDots = widget.querySelectorAll('.theme-dot');
    themeDots.forEach(dot => {
        dot.onclick = (e) => {
            e.stopPropagation();
            const theme = dot.dataset.theme;
            setChecklistTheme(theme);
        };
    });

    // Wire Interactive Click-to-Scroll for each checklist item
    const itemLang = document.getElementById('chk-item-lang');
    if (itemLang) {
        itemLang.onclick = () => scrollToSetupTarget('label-select-lang', '.lang-segmented-bar, .lang-selector');
    }

    const itemTopics = document.getElementById('chk-item-topics');
    if (itemTopics) {
        itemTopics.onclick = () => scrollToSetupTarget('label-select-set', '#quiz-set-list');
    }

    const itemMode = document.getElementById('chk-item-mode');
    if (itemMode) {
        itemMode.onclick = () => scrollToSetupTarget('label-quiz-mode', '.quiz-mode-selector');
    }

    const itemPreset = document.getElementById('chk-item-preset');
    if (itemPreset) {
        itemPreset.onclick = () => scrollToSetupTarget('txt-preset-volume', '.preset-volumes-container');
    }

    updateChecklistStatus();
}

function setChecklistTheme(themeName) {
    const widget = document.getElementById('quiz-checklist-widget');
    if (!widget) return;

    widget.classList.remove('theme-glass', 'theme-dark', 'theme-emerald', 'theme-amber', 'theme-violet');
    widget.classList.add(`theme-${themeName}`);

    const themeDots = widget.querySelectorAll('.theme-dot');
    themeDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === themeName);
    });

    localStorage.setItem('starley_quiz_checklist_theme', themeName);
}

function updateChecklistStatus() {
    const widget = document.getElementById('quiz-checklist-widget');
    if (!widget) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    // Step A: Language selection
    const itemLang = document.getElementById('chk-item-lang');
    const textLang = document.getElementById('chk-text-lang');
    const stepA = Boolean(state.settings && state.settings.lang);
    if (itemLang) {
        itemLang.classList.toggle('chk-done', stepA);
        const icon = itemLang.querySelector('.chk-status i');
        if (icon) icon.className = stepA ? 'fas fa-check-circle' : 'far fa-circle';
    }
    if (textLang) {
        textLang.textContent = isRu ? 'а) Выбор языка' : 'a) Language selection';
    }

    // Step B: Topic sets selection
    const itemTopics = document.getElementById('chk-item-topics');
    const textTopics = document.getElementById('chk-text-topics');
    const stepB = (state.selectedSets && state.selectedSets.length > 0) || state.activeTopicFilter !== null;
    if (itemTopics) {
        itemTopics.classList.toggle('chk-done', stepB);
        const icon = itemTopics.querySelector('.chk-status i');
        if (icon) icon.className = stepB ? 'fas fa-check-circle' : 'far fa-circle';
    }
    if (textTopics) {
        textTopics.textContent = isRu ? 'б) Выбор одной или нескольких тем' : 'b) Select one or more topics';
    }

    // Step C: Mode selection
    const itemMode = document.getElementById('chk-item-mode');
    const textMode = document.getElementById('chk-text-mode');
    const stepC = Boolean(state.sessionMode);
    if (itemMode) {
        itemMode.classList.toggle('chk-done', stepC);
        const icon = itemMode.querySelector('.chk-status i');
        if (icon) icon.className = stepC ? 'fas fa-check-circle' : 'far fa-circle';
    }
    if (textMode) {
        textMode.textContent = isRu ? 'в) Выбор режима (Smart / Weak / Exam)' : 'c) Select quiz mode';
    }

    // Step D: Volume preset selection
    const itemPreset = document.getElementById('chk-item-preset');
    const textPreset = document.getElementById('chk-text-preset');
    const stepD = Boolean(state.settings && (state.settings.count || state.settings.allQuestions));
    if (itemPreset) {
        itemPreset.classList.toggle('chk-done', stepD);
        const icon = itemPreset.querySelector('.chk-status i');
        if (icon) icon.className = stepD ? 'fas fa-check-circle' : 'far fa-circle';
    }
    if (textPreset) {
        textPreset.textContent = isRu ? 'г) Выбор объема (пресет)' : 'd) Question volume preset';
    }

    // Headers & Labels
    const titleText = document.getElementById('checklist-title-text');
    if (titleText) titleText.textContent = isRu ? 'Гид по запуску квиза' : 'Quick Setup Guide';

    const pillText = document.getElementById('chk-pill-text');
    if (pillText) pillText.textContent = isRu ? 'Гид по квизу' : 'Quiz Guide';

    // Count out of 4
    let count = 0;
    if (stepA) count++;
    if (stepB) count++;
    if (stepC) count++;
    if (stepD) count++;

    const badge = document.getElementById('checklist-counter-badge');
    if (badge) badge.textContent = `${count}/4`;

    const pillBadge = document.getElementById('chk-pill-count');
    if (pillBadge) pillBadge.textContent = `${count}/4`;

    // Completion Ready Banner & Start Button pulse
    const readyBanner = document.getElementById('checklist-ready-banner');
    const readyText = document.getElementById('checklist-ready-text');
    const btnStart = document.getElementById('btn-start-quiz');

    if (count === 4) {
        if (readyBanner) readyBanner.style.display = 'flex';
        if (readyText) {
            readyText.innerHTML = isRu ? 'Все готово! Нажмите <strong>Начать квиз</strong>!' : 'All set! Press <strong>Start Quiz</strong> now!';
        }
        if (btnStart) btnStart.classList.add('btn-start-highlight');
    } else {
        if (readyBanner) readyBanner.style.display = 'none';
        if (btnStart) btnStart.classList.remove('btn-start-highlight');
    }
}

// =========================================================================
// GOOGLE SHEETS BACKEND SYNC, PERSONAL CABINET & ADMIN MANAGER ENGINE
// =========================================================================

state.userFavorites = [];
state.userPlaylists = [];
state.sessionHistory = [];
state.cloudSyncing = false;
state.syncPendingRetry = false;
state.pendingSessionToSync = null;

let syncDebounceTimer = null;

/**
 * Sanitize Favorites List to ensure compact array of clean Special ID strings (e.g. ['4🧠62', '1💻5'])
 */
function sanitizeFavoritesList(favList) {
    if (!Array.isArray(favList)) return [];
    const result = [];
    const seen = new Set();

    favList.forEach(item => {
        if (!item) return;
        let idStr = '';
        if (typeof item === 'string' || typeof item === 'number') {
            idStr = String(item).trim();
        } else if (typeof item === 'object') {
            idStr = String(item.id || item.specialId || item.cleanSpecialId || item.rawSpecialId || '').trim();
        }
        if (idStr && idStr !== '[object Object]' && !idStr.includes('[object') && !seen.has(idStr)) {
            seen.add(idStr);
            result.push(idStr);
        }
    });

    return result;
}

/**
 * Sanitize Playlists List to ensure clean IDs and title lengths
 */
function sanitizePlaylistsList(playlistList) {
    if (!Array.isArray(playlistList)) return [];
    return playlistList.map(pl => {
        if (!pl || !pl.id) return null;
        return {
            id: String(pl.id),
            title: String(pl.title || pl.id || '1').substring(0, 80),
            iconId: Number(pl.iconId) || 1,
            count: Array.isArray(pl.questionIds) ? pl.questionIds.length : 0,
            questionIds: Array.isArray(pl.questionIds) ? pl.questionIds.map(String) : [],
            createdAt: pl.createdAt || new Date().toISOString()
        };
    }).filter(Boolean);
}

/**
 * Sanitize Completed Session Object to prevent large payload network overhead
 */
function sanitizeSessionForSync(sessionObj) {
    if (!sessionObj) return null;

    let detailStr = '';
    if (Array.isArray(sessionObj.errors) && sessionObj.errors.length > 0) {
        detailStr = sessionObj.errors.map(e => {
            const specId = e.specialId || e.questionId || '';
            if (e.isCorrect) {
                return specId;
            } else {
                const correctL = String(e.correctAnswer || '').trim();
                const chosenL = String(e.chosen || '').trim();
                return `${specId}(${correctL})${chosenL}`;
            }
        }).join(', ');
    } else if (typeof sessionObj.detailString === 'string') {
        detailStr = sessionObj.detailString;
    }

    const totalQ = Number(sessionObj.totalQ || sessionObj.count) || 0;
    const correctQ = Number(sessionObj.correctQ || sessionObj.correctCount) || 0;
    const scorePct = Number(sessionObj.scorePct || sessionObj.accuracyPct) || 0;
    const timeSec = Number(sessionObj.timeSpentSec) || 0;

    const m = Math.floor(timeSec / 60);
    const s = timeSec % 60;
    const timeSpentStr = sessionObj.timeSpentStr || `${m}m ${s}s`;
    const avgSec = totalQ > 0 ? Math.round(timeSec / totalQ) : 0;
    const avgTimePerQStr = sessionObj.avgTimePerQStr || `${avgSec}s`;

    const topicsArr = Array.isArray(sessionObj.topics) ? sessionObj.topics : [sessionObj.setTitle || 'Quiz'];
    const topicsStr = topicsArr.join('; ');

    return {
        sessionId: String(sessionObj.sessionId || ('sess_' + Date.now())),
        date: sessionObj.date || new Date().toISOString(),
        setTitle: String(sessionObj.setTitle || 'Quiz Session').substring(0, 80),
        topics: topicsStr,
        count: totalQ,
        totalQ: totalQ,
        timeSpentSec: timeSec,
        timeSpentStr: timeSpentStr,
        avgTimePerQStr: avgTimePerQStr,
        correctCount: correctQ,
        correctQ: correctQ,
        accuracyPct: scorePct,
        scorePct: scorePct,
        topicAccuracies: typeof sessionObj.topicAccuracies === 'string' ? sessionObj.topicAccuracies : JSON.stringify(sessionObj.topicAccuracies || {}),
        detailString: detailStr,
        mode: sessionObj.mode || 'smart',
        lang: sessionObj.lang || 'En',
        countMode: String(sessionObj.countMode || '10'),
        errors: sessionObj.errors || []
    };
}

/**
 * 2-Way Data Merge between Local Storage & Google Sheets Backend
 */
function mergeCloudAndLocalData(cloudProgress, cloudHistory) {
    let localFavs = [];
    let localPlaylists = [];
    let localHistory = [];
    try {
        localFavs = sanitizeFavoritesList(JSON.parse(localStorage.getItem('starley_user_favorites') || '[]'));
        localPlaylists = sanitizePlaylistsList(JSON.parse(localStorage.getItem('starley_user_playlists') || '[]'));
        localHistory = JSON.parse(localStorage.getItem('starley_session_history') || '[]');
    } catch (e) {}

    const cloudFavs = sanitizeFavoritesList((cloudProgress && cloudProgress.favorites) || []);
    const cloudPlaylists = sanitizePlaylistsList((cloudProgress && cloudProgress.playlists) || []);
    const remoteHistory = cloudHistory || [];

    // 1. Merge Favorites (clean union of special ID strings)
    const mergedFavs = sanitizeFavoritesList([...localFavs, ...cloudFavs]);

    // 2. Merge Playlists (by playlist id)
    const plMap = new Map();
    cloudPlaylists.forEach(pl => {
        if (pl && pl.id) plMap.set(String(pl.id), pl);
    });
    localPlaylists.forEach(pl => {
        if (pl && pl.id) {
            const existing = plMap.get(String(pl.id));
            if (!existing) {
                plMap.set(String(pl.id), pl);
            } else {
                const combinedQIds = Array.from(new Set([
                    ...(Array.isArray(existing.questionIds) ? existing.questionIds : []),
                    ...(Array.isArray(pl.questionIds) ? pl.questionIds : [])
                ]));
                plMap.set(String(pl.id), {
                    ...existing,
                    ...pl,
                    questionIds: combinedQIds,
                    title: pl.title || existing.title
                });
            }
        }
    });
    const mergedPlaylists = sanitizePlaylistsList(Array.from(plMap.values()));

    // 3. Merge Session History (by sessionId)
    const sessMap = new Map();
    remoteHistory.forEach(s => {
        if (s && s.sessionId) sessMap.set(String(s.sessionId), s);
    });
    localHistory.forEach(s => {
        if (s && s.sessionId) {
            if (!sessMap.has(String(s.sessionId))) {
                sessMap.set(String(s.sessionId), s);
            }
        }
    });
    const mergedHistory = Array.from(sessMap.values());
    mergedHistory.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    state.userFavorites = mergedFavs;
    state.userPlaylists = mergedPlaylists;
    state.sessionHistory = mergedHistory;

    // Save merged state locally
    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
    localStorage.setItem('starley_user_playlists', JSON.stringify(state.userPlaylists));
    localStorage.setItem('starley_session_history', JSON.stringify(state.sessionHistory));

    updateQuizStatsUI();
}

/**
 * Recalculate Quiz Stats & Update UI Displays
 */
function updateQuizStatsUI() {
    const totalSolved = state.sessionHistory.reduce((sum, s) => sum + (s.totalQ || 0), 0);
    const totalCorrect = state.sessionHistory.reduce((sum, s) => sum + (s.correctQ || 0), 0);
    const accuracyPct = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const uniqueDays = new Set(state.sessionHistory.map(s => s.date ? s.date.split('T')[0] : ''));
    uniqueDays.delete('');
    const streakDays = Math.max(uniqueDays.size, 1);

    const profileStreak = document.getElementById('profile-stat-streak');
    const cabStreak = document.getElementById('cab-stat-streak');
    if (profileStreak) profileStreak.textContent = streakDays;
    if (cabStreak) cabStreak.textContent = streakDays;

    const profileSolved = document.getElementById('profile-stat-solved');
    const cabSolved = document.getElementById('cab-stat-solved');
    if (profileSolved) profileSolved.textContent = totalSolved;
    if (cabSolved) cabSolved.textContent = totalSolved;

    const profileAcc = document.getElementById('profile-stat-accuracy');
    const cabAcc = document.getElementById('cab-stat-accuracy');
    if (profileAcc) profileAcc.textContent = accuracyPct + '%';
    if (cabAcc) cabAcc.textContent = accuracyPct + '%';

    const streakEl = document.getElementById('stat-streak-days');
    const solvedEl = document.getElementById('stat-total-solved');
    const accEl = document.getElementById('stat-accuracy-pct');
    const plCountEl = document.getElementById('cab-stat-playlists');
    const favCountEl = document.getElementById('cab-stat-favorites');

    if (streakEl) streakEl.textContent = streakDays;
    if (solvedEl) solvedEl.textContent = totalSolved;
    if (accEl) accEl.textContent = `${accuracyPct}%`;
    if (plCountEl) plCountEl.textContent = state.userPlaylists.length;
    if (favCountEl) favCountEl.textContent = state.userFavorites.length;

    const barStreak = document.getElementById('bar-stat-streak');
    const barSolved = document.getElementById('bar-stat-solved');
    const barAcc = document.getElementById('bar-stat-accuracy');
    if (barStreak) barStreak.textContent = streakDays;
    if (barSolved) barSolved.textContent = totalSolved;
    if (barAcc) barAcc.textContent = `${accuracyPct}%`;

    if (typeof window.renderCabinetPlaylists === 'function') {
        window.renderCabinetPlaylists();
    }
}

/**
 * Fetch and Sync User Data from Google Sheets on Login
 */
async function fetchAndSyncUserData(username) {
    const syncBadge = document.getElementById('quiz-sync-status-badge');
    const cabinetBadge = document.getElementById('cabinet-sync-indicator');

    if (syncBadge) {
        syncBadge.textContent = '⏳ Loading Cloud...';
        syncBadge.style.color = '#58a6ff';
    }
    if (cabinetBadge) cabinetBadge.textContent = 'Connecting to Cloud...';

    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.getUserData === 'function') {
        try {
            const res = await window.GoogleSheetsAPI.getUserData(username);
            if (res && res.success) {
                mergeCloudAndLocalData(res.progress, res.history);

                if (syncBadge) {
                    syncBadge.textContent = '☁️ Cloud Synced';
                    syncBadge.style.color = '#3fb950';
                    syncBadge.style.borderColor = 'rgba(63, 185, 80, 0.3)';
                }
                if (cabinetBadge) cabinetBadge.textContent = '✅ Cloud Synchronized';
                return;
            }
        } catch (e) {
            console.warn('[Sync] Failed to fetch remote user data:', e);
        }
    }

    // Fallback display if offline or remote sync fails
    if (syncBadge) {
        syncBadge.textContent = '⚠️ Local Saved';
        syncBadge.style.color = '#eab308';
        syncBadge.style.borderColor = 'rgba(234, 179, 8, 0.3)';
    }
}

/**
 * Initialize Google Sheets Data Sync & User Account State
 */
async function initGoogleSheetsAccountSync() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const syncBadge = document.getElementById('quiz-sync-status-badge');
    const cabinetBadge = document.getElementById('cabinet-sync-indicator');
    const nameDisplay = document.getElementById('profile-nickname-display');
    const adminBtn = document.getElementById('btn-open-admin-modal');

    if (!user) return;

    const reqAccountBtn = document.getElementById('btn-request-account');
    if (reqAccountBtn) {
        reqAccountBtn.style.display = (user && !user.isGuest) ? 'none' : 'inline-flex';
    }

    if (nameDisplay) {
        nameDisplay.textContent = user.nickname || user.username || 'Doctor User';
    }

    if (user.role === 'admin' && adminBtn) {
        adminBtn.style.display = 'inline-block';
    }

    if (user.isGuest) {
        if (syncBadge) {
            setSyncStatus('off');
        }
        if (cabinetBadge) cabinetBadge.textContent = '👤 Guest Mode (No Cloud Sync)';
        loadLocalUserData();
        return;
    }

    // 1. Load local storage first for instant 0ms display
    loadLocalUserData();

    // 2. Initial pull from Google Sheets (or fallback to local file)
    pullFromSheets();

    // 3. Start background auto-sync loop (every 30s)
    setTimeout(startAutoSync, 1000);
}

function loadLocalUserData() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    try {
        state.userFavorites = sanitizeFavoritesList(JSON.parse(localStorage.getItem('starley_user_favorites') || '[]'));
        state.userPlaylists = sanitizePlaylistsList(JSON.parse(localStorage.getItem('starley_user_playlists') || '[]'));
        ensureTenPlaylists();
        state.sessionHistory = JSON.parse(localStorage.getItem('starley_session_history') || '[]');

        const storedProf = localStorage.getItem('starley_user_profile');
        if (storedProf) {
            state.userProfile = JSON.parse(storedProf);
        } else if (user && !user.isGuest) {
            state.userProfile = {
                nickname: user.nickname || user.username || 'Doctor',
                avatar: user.avatar || 'doc'
            };
        }
    } catch (e) {}
    updateQuizStatsUI();
    if (typeof updateUserProfileDisplay === 'function') updateUserProfileDisplay();
}

/**
 * Update UI Sync Status Badges with Wolfson-style indicators
 * States: 'syncing' (🟡 ↻), 'ok' (🟢 ✓), 'err' (🔴 ✗), 'off' (⚪ ·)
 */
function setSyncStatus(status, detailText = '') {
    const syncBadge = document.getElementById('quiz-sync-status-badge');
    const cabinetBadge = document.getElementById('cabinet-sync-indicator');
    const lastSyncEl = document.getElementById('txt-last-sync-time');

    let badgeText = '⚪ · Local';
    let badgeColor = '#8b949e';
    let badgeBorder = 'rgba(139, 148, 158, 0.3)';
    let cabText = '⚪ · Local Mode';

    if (status === 'syncing') {
        badgeText = '🟡 ↻ Syncing...';
        badgeColor = '#eab308';
        badgeBorder = 'rgba(234, 179, 8, 0.3)';
        cabText = '🟡 ↻ Syncing with Google Sheets...';
    } else if (status === 'ok') {
        badgeText = '🟢 ✓ Synced';
        badgeColor = '#3fb950';
        badgeBorder = 'rgba(63, 185, 80, 0.3)';
        cabText = '🟢 ✓ Cloud Synced to Google Sheets';
        if (lastSyncEl) {
            const timeStr = new Date().toLocaleTimeString();
            lastSyncEl.textContent = timeStr;
        }
    } else if (status === 'err') {
        badgeText = '🔴 ✗ Network Error';
        badgeColor = '#f85149';
        badgeBorder = 'rgba(248, 81, 73, 0.3)';
        cabText = '🔴 ✗ Sync Error (Saved Locally)';
    }

    if (syncBadge) {
        syncBadge.textContent = badgeText;
        syncBadge.style.color = badgeColor;
        syncBadge.style.borderColor = badgeBorder;
    }
    if (cabinetBadge) {
        cabinetBadge.textContent = detailText || cabText;
        cabinetBadge.style.color = badgeColor;
    }
}

/**
 * Internal Save Functions (Local-First: writes ONLY to localStorage, no push triggered)
 */
function _saveFavorites(favs) {
    state.userFavorites = sanitizeFavoritesList(favs);
    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
}

function _savePlaylists(pls) {
    state.userPlaylists = sanitizePlaylistsList(pls);
    ensureTenPlaylists();
    localStorage.setItem('starley_user_playlists', JSON.stringify(state.userPlaylists));
}

function _saveSessionHistory(hist) {
    state.sessionHistory = Array.isArray(hist) ? hist : [];
    localStorage.setItem('starley_session_history', JSON.stringify(state.sessionHistory));
}

/**
 * Public Mutators (Save to localStorage and schedule debounced push)
 */
function setUserFavorites(favs) {
    _saveFavorites(favs);
    updateQuizStatsUI();
    schedulePush();
}

function setUserPlaylists(pls) {
    _savePlaylists(pls);
    updateQuizStatsUI();
    schedulePush();
}

function addSessionHistoryRecord(sess) {
    if (!sess) return;
    const exists = state.sessionHistory.some(s => s.sessionId === sess.sessionId);
    if (!exists) {
        state.sessionHistory.unshift(sess);
        _saveSessionHistory(state.sessionHistory);
        updateQuizStatsUI();
        schedulePush();
    }
}

// Global debouncing and concurrency controls (Wolfson Schedule pattern)
let pushTimer = null;
let syncInProgress = false;
let pendingSync = false;
let autoSyncTimer = null;

/**
 * 800ms Debounce Scheduler
 */
function schedulePush() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!user || user.isGuest) {
        setSyncStatus('off');
        return;
    }

    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
        pushToSheets();
    }, 800);
}

/**
 * Push Local Data to Google Sheets with LockService and queue protection
 */
async function pushToSheets(isImmediate = false) {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!user || user.isGuest) return;

    if (syncInProgress) {
        pendingSync = true;
        return;
    }

    syncInProgress = true;
    setSyncStatus('syncing');

    const pass = String(user.password || '456755').trim();
    const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
    const userKey = 'user_' + safePass;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const resolvedNick = (state.userProfile && state.userProfile.nickname) || user.nickname || user.username || 'Doctor';
    const resolvedAvatar = (state.userProfile && state.userProfile.avatar) || user.avatar || 'doc';
    const rpgState = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');

    const pm = calculateProgressMetrics();
    const userData = {
        username: user.username || (safePass === '456755' ? 'admin' : 'user'),
        password: safePass,
        nickname: resolvedNick,
        avatar: resolvedAvatar,
        title: rpgState.levelData.fullTitle,
        level: rpgState.levelData.fullTitle,
        levelNum: rpgState.level,
        currentExp: rpgState.currentExp,
        totalExp: rpgState.totalExp,
        tierId: rpgState.tierId,
        favorites: sanitizeFavoritesList(state.userFavorites),
        playlists: sanitizePlaylistsList(state.userPlaylists),
        progressMetrics: pm,
        sessionHistory: state.sessionHistory || [],
        lastUpdated: new Date().toISOString()
    };

    try {
        if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.pushKey === 'function') {
            const res = await window.GoogleSheetsAPI.pushKey(userKey, userData);
            if (res && (res.ok || res.success)) {
                setSyncStatus('ok', isRu ? 'Синхронизировано с Google Таблицей' : 'Synced with Google Sheets');
                localStorage.removeItem('starley_has_pending_sync');
            } else {
                throw new Error((res && res.error) || 'Push failed');
            }
        }
    } catch (err) {
        console.warn('[GoogleSheetsSync] Push error:', err);
        setSyncStatus('err', isRu ? 'Ошибка сети (сохранено локально)' : 'Network error (saved locally)');
        localStorage.setItem('starley_has_pending_sync', 'true');
    } finally {
        syncInProgress = false;
        if (pendingSync) {
            pendingSync = false;
            schedulePush();
        }
    }
}

/**
 * Pull Data from Google Sheets (Cache-busting GET)
 */
async function pullFromSheets(isManual = false) {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!user || user.isGuest) {
        setSyncStatus('off');
        return false;
    }

    if (syncInProgress && !isManual) return false;

    setSyncStatus('syncing');
    const pass = String(user.password || '456755').trim();
    const safePass = (pass === 'admin' || pass === 'Admin') ? '456755' : (pass === 'user' ? '0455' : pass);
    const userKey = 'user_' + safePass;
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    try {
        if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.pullFromSheets === 'function') {
            const res = await window.GoogleSheetsAPI.pullFromSheets();
            if (res && (res.ok || res.success) && res.data) {
                const remoteUser = res.data[userKey];
                if (remoteUser && typeof remoteUser === 'object') {
                    let changed = false;

                    // If remote data exists, merge
                    if (Array.isArray(remoteUser.favorites) && remoteUser.favorites.length >= 0) {
                        _saveFavorites(remoteUser.favorites);
                        changed = true;
                    }
                    if (Array.isArray(remoteUser.playlists) && remoteUser.playlists.length >= 0) {
                        _savePlaylists(remoteUser.playlists);
                        changed = true;
                    }
                    if (Array.isArray(remoteUser.sessionHistory) && remoteUser.sessionHistory.length >= 0) {
                        _saveSessionHistory(remoteUser.sessionHistory);
                        changed = true;
                    }
                    if (remoteUser.nickname) {
                        if (!state.userProfile) state.userProfile = {};
                        state.userProfile.nickname = remoteUser.nickname;
                        if (user) {
                            user.nickname = remoteUser.nickname;
                            if (window.AuthSystem) window.AuthSystem.setAuthenticated(user);
                        }
                        localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));
                        changed = true;
                    }
                    if (remoteUser.avatar) {
                        if (!state.userProfile) state.userProfile = {};
                        state.userProfile.avatar = remoteUser.avatar;
                        if (user) {
                            user.avatar = remoteUser.avatar;
                            if (window.AuthSystem) window.AuthSystem.setAuthenticated(user);
                        }
                        localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));
                        changed = true;
                    }
                    if (remoteUser.levelNum || remoteUser.totalExp || remoteUser.currentExp || remoteUser.tierId) {
                        if (!state.userProfile) state.userProfile = {};
                        if (remoteUser.levelNum) state.userProfile.level = remoteUser.levelNum;
                        if (remoteUser.totalExp) state.userProfile.totalExp = remoteUser.totalExp;
                        if (remoteUser.currentExp) state.userProfile.currentExp = remoteUser.currentExp;
                        if (remoteUser.tierId) state.userProfile.tierId = remoteUser.tierId;
                        localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));
                        changed = true;
                    }

                    if (changed) {
                        updateQuizStatsUI();
                        if (typeof window.updateUserProfileDisplay === 'function') window.updateUserProfileDisplay();
                        if (typeof window.renderCabinetPlaylists === 'function') window.renderCabinetPlaylists();
                        if (typeof window.renderFavoritesList === 'function') window.renderFavoritesList();
                        if (typeof window.renderSessionHistoryTable === 'function') window.renderSessionHistoryTable();
                    }
                } else if (isManual) {
                    // First time: push local data to create cloud key
                    await pushToSheets(true);
                }

                setSyncStatus('ok', isRu ? 'Синхронизировано с Google Таблицей' : 'Synced with Google Sheets');
                return true;
            }
        }
    } catch (err) {
        console.warn('[GoogleSheetsSync] Pull error:', err);
        setSyncStatus('err', isRu ? 'Не удалось связаться с Google Таблицей' : 'Failed to connect to Google Sheets');
    }
    return false;
}

/**
 * Background Auto-Sync Loop (runs every 30s)
 */
function startAutoSync() {
    if (autoSyncTimer) clearTimeout(autoSyncTimer);
    autoSyncTimer = setTimeout(async () => {
        await pullFromSheets();
        startAutoSync();
    }, 30000);
}

/**
 * Backward-compatible aliases for existing calls
 */
function enqueueCloudSync(newSessionObj) {
    if (newSessionObj) {
        addSessionHistoryRecord(newSessionObj);
    } else {
        schedulePush();
    }
}

async function syncCloudUserData(newSessionObj) {
    enqueueCloudSync(newSessionObj);
}

async function processSyncQueue(isImmediate = false) {
    await pushToSheets(isImmediate);
}

/**
 * UI Control Handlers
 */
window.testSheetsConn = async function() {
    const isRu = state.settings.lang === 'Ru';
    const startTime = Date.now();
    try {
        if (!window.GoogleSheetsAPI || !window.GoogleSheetsAPI.testConnection) {
            alert(isRu ? '❌ Модуль GoogleSheetsAPI не загружен.' : '❌ GoogleSheetsAPI module not loaded.');
            return;
        }
        const res = await window.GoogleSheetsAPI.testConnection();
        const latency = Date.now() - startTime;
        if (res && (res.ok || res.success)) {
            alert(isRu ? 
                `✅ Соединение с Google Таблицей успешно!\n\nВремя отклика: ${latency} мс\nАрхитектура: Local-First Key-Value\nЛист: quiz_data` :
                `✅ Google Sheets connection successful!\n\nLatency: ${latency} ms\nArchitecture: Local-First Key-Value\nSheet: quiz_data`);
            setSyncStatus('ok');
        } else {
            alert(isRu ? `⚠️ Ответ сервера: ${JSON.stringify(res)}` : `⚠️ Server response: ${JSON.stringify(res)}`);
            setSyncStatus('err');
        }
    } catch (err) {
        alert(isRu ? `❌ Ошибка проверки соединения: ${err.message}` : `❌ Connection test failed: ${err.message}`);
        setSyncStatus('err');
    }
};

window.forcePushToSheets = async function() {
    const isRu = state.settings.lang === 'Ru';
    try {
        await pushToSheets(true);
        alert(isRu ? '✅ Данные успешно отправлены в Google Таблицу!' : '✅ Data force pushed to Google Sheets successfully!');
    } catch (err) {
        alert(isRu ? `❌ Ошибка отправки: ${err.message}` : `❌ Push error: ${err.message}`);
    }
};

window.forcePullFromSheets = async function() {
    const isRu = state.settings.lang === 'Ru';
    try {
        const ok = await pullFromSheets(true);
        if (ok) {
            alert(isRu ? 
                `✅ Данные успешно загружены из Google Таблицы!\n\nСборников: ${state.userPlaylists.length}\nИзбранных вопросов: ${state.userFavorites.length}\nСессий в истории: ${state.sessionHistory.length}` :
                `✅ Data pulled from Google Sheets!\n\nPlaylists: ${state.userPlaylists.length}\nFavorites: ${state.userFavorites.length}\nHistory sessions: ${state.sessionHistory.length}`);
        } else {
            alert(isRu ? '⚠️ Не удалось получить данные или облачная база пуста.' : '⚠️ Could not pull data or cloud storage is empty.');
        }
    } catch (err) {
        alert(isRu ? `❌ Ошибка загрузки: ${err.message}` : `❌ Pull error: ${err.message}`);
    }
};

window.manualCloudSync = function() {
    window.forcePushToSheets();
};

window.triggerRebuildGoogleSheetStructure = function() {
    window.testSheetsConn();
};


// Lifecycle Auto-Retry Sync Listeners
window.addEventListener('online', () => {
    console.log('[SyncEngine] Network restored. Retrying sync queue...');
    processSyncQueue();
});

setInterval(() => {
    if (localStorage.getItem('starley_has_pending_sync') === 'true') {
        processSyncQueue();
    }
}, 30000);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && localStorage.getItem('starley_has_pending_sync') === 'true' && !state.cloudSyncing) {
        processSyncQueue(true);
    }
});

window.addEventListener('beforeunload', () => {
    if (localStorage.getItem('starley_has_pending_sync') === 'true' && !state.cloudSyncing) {
        processSyncQueue(true);
    }
});

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
        const totalCount = Number(session.totalQ || session.totalCount) || 0;
        const wrongCount = Math.max(0, totalCount - correctCount);
        
        const baseExp = this.getCorrectExp(cLevel);
        const penalty = this.getMistakePenalty(cLevel);

        const grossExp = correctCount * baseExp;
        const grossLoss = wrongCount * penalty;

        // Bonuses
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
        const bankQ = totalBankQ || 2949;

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

        // 1. Clinical Knowledge: Unique Solved vs Bank (0..100)
        const knowledgeScore = Math.min(100, Math.round((uniqueSolved.size / (bankQ * 0.4 || 1)) * 100));

        // 2. Surgical Precision: Total Accuracy (0..100)
        const precisionScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

        // 3. Cognitive Velocity: Session Pace
        const velocityScore = Math.min(100, Math.round(Math.min(totalAnswered, 500) / 5));

        // 4. Mental Stamina: Streak & Endurance
        const staminaScore = Math.min(100, Math.round((maxSession / 50) * 60 + Math.min(hist.length, 20) * 2));

        // 5. Specialty Breadth: Covered manifests out of 18
        const breadthScore = Math.min(100, Math.round((uniqueTopics.size / 18) * 100));

        // 6. Consistency & Fortitude: Stability across last 10 runs
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
window.RPG_SYSTEM = RPG_SYSTEM;

/**
 * Render RPG Session Results Card on Quiz Finish
 */
function renderRpgResultsCard(expCalc, updatedRpg, isRu) {
    const card = document.getElementById('res-rpg-card');
    if (!card) return;

    const badgeEl = document.getElementById('res-rpg-badge');
    const titleEl = document.getElementById('res-rpg-title');
    const deltaEl = document.getElementById('res-rpg-exp-delta');
    const barEl = document.getElementById('res-rpg-bar');
    const curExpEl = document.getElementById('res-rpg-cur-exp');
    const nextExpEl = document.getElementById('res-rpg-next-exp');
    const bannerEl = document.getElementById('res-rpg-event-banner');

    if (badgeEl) badgeEl.textContent = `${updatedRpg.levelData.tierIcon} Lv.${updatedRpg.level} ${updatedRpg.levelData.tierName}`;
    if (titleEl) titleEl.textContent = updatedRpg.levelData.title;

    if (deltaEl) {
        if (expCalc.netExp >= 0) {
            deltaEl.textContent = `+${expCalc.netExp} EXP`;
            deltaEl.style.color = '#3fb950';
        } else {
            deltaEl.textContent = `${expCalc.netExp} EXP`;
            deltaEl.style.color = '#f87171';
        }
    }

    if (barEl) {
        barEl.style.width = `${updatedRpg.progressPct}%`;
    }

    if (curExpEl) {
        curExpEl.textContent = `${updatedRpg.currentExp} / ${updatedRpg.reqExp} EXP (${updatedRpg.progressPct}%)`;
    }

    if (nextExpEl) {
        const nextData = RPG_SYSTEM.getLevelData(Math.min(100, updatedRpg.level + 1), isRu ? 'Ru' : 'En');
        const remaining = Math.max(0, updatedRpg.reqExp - updatedRpg.currentExp);
        nextExpEl.textContent = `${isRu ? 'След.:' : 'Next:'} ${nextData.fullTitle} (+${remaining} EXP)`;
    }

    if (bannerEl) {
        if (updatedRpg.leveledUp) {
            bannerEl.style.display = 'block';
            bannerEl.style.background = 'linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(35, 134, 54, 0.3))';
            bannerEl.style.border = '1px solid #eab308';
            bannerEl.style.color = '#fde047';
            bannerEl.innerHTML = isRu
                ? `🎉 <strong>ПОВЫШЕНИЕ УРОВНЯ!</strong> Поздравляем! Вы достигли <u>${updatedRpg.levelData.fullTitle}</u>!`
                : `🎉 <strong>LEVEL UP!</strong> Congratulations! You advanced to <u>${updatedRpg.levelData.fullTitle}</u>!`;
        } else if (updatedRpg.leveledDown) {
            bannerEl.style.display = 'block';
            bannerEl.style.background = 'rgba(218, 54, 51, 0.25)';
            bannerEl.style.border = '1px solid #f87171';
            bannerEl.style.color = '#f87171';
            bannerEl.innerHTML = isRu
                ? `⚠️ <strong>РЕГРЕСС УРОВНЯ!</strong> Снижение до <u>${updatedRpg.levelData.fullTitle}</u>. На высоких рангах ошибки стоят дорого!`
                : `⚠️ <strong>LEVEL REGRESSION!</strong> Demoted to <u>${updatedRpg.levelData.fullTitle}</u>. High-tier mastery demands surgical precision!`;
        } else {
            bannerEl.style.display = 'none';
        }
    }
}
window.renderRpgResultsCard = renderRpgResultsCard;

/**
 * Update Profile Avatar, Nickname and RPG Prestige Level Display Across UI
 */
function updateUserProfileDisplay() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const avatar = (state.userProfile && state.userProfile.avatar) || (user && user.avatar) || 'doc';
    const allAvatarClasses = ['avatar-doc', 'avatar-heart', 'avatar-brain', 'avatar-flask', 'avatar-bolt', 'avatar-titan', 'avatar-guru', 'avatar-rocket'];
    const iconClass = (typeof AVATAR_ICONS_MAP !== 'undefined' && AVATAR_ICONS_MAP[avatar]) ? AVATAR_ICONS_MAP[avatar] : 'fas fa-stethoscope';

    // 1. Lobby Avatar Ring & Icon
    const profileAvatarIcon = document.getElementById('profile-avatar-icon');
    if (profileAvatarIcon) {
        profileAvatarIcon.classList.remove(...allAvatarClasses);
        profileAvatarIcon.classList.add(`avatar-${avatar}`);
        profileAvatarIcon.innerHTML = `<i class="${iconClass}"></i>`;
    }

    // 2. Personal Cabinet Header & Hero Avatar
    const cabAvatarBtn = document.getElementById('cab-header-avatar');
    if (cabAvatarBtn) {
        cabAvatarBtn.classList.remove(...allAvatarClasses);
        cabAvatarBtn.classList.add(`avatar-${avatar}`);
        cabAvatarBtn.innerHTML = `<i class="${iconClass}"></i>`;
    }

    const heroAvatar = document.getElementById('cab-hero-avatar');
    if (heroAvatar) {
        heroAvatar.classList.remove(...allAvatarClasses);
        heroAvatar.classList.add(`avatar-${avatar}`);
        heroAvatar.innerHTML = `<i class="${iconClass}"></i>`;
    }

    // 3. Selection options in Settings tab
    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatar === avatar);
    });

    // 4. Nickname & Titles
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const nameDisplay = document.getElementById('profile-nickname-display');
    const heroNick = document.getElementById('cab-hero-nickname');
    const nickText = (state.userProfile && state.userProfile.nickname) || (user && (user.nickname || user.username)) || (isRu ? 'Доктор' : 'Doctor User');
    
    if (nameDisplay) nameDisplay.textContent = nickText;
    if (heroNick) heroNick.textContent = nickText;

    const nickInput = document.getElementById('input-profile-nickname');
    if (nickInput && document.activeElement !== nickInput) {
        nickInput.value = nickText;
    }

    // 5. RPG State & Badges
    const rpgState = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');
    
    // Apply RPG Tier Classes (rpg-tier-1 ... rpg-tier-10)
    const tierClass = `rpg-tier-${rpgState.tierId}`;
    const allTierClasses = [
        'rpg-tier-1','rpg-tier-2','rpg-tier-3','rpg-tier-4','rpg-tier-5',
        'rpg-tier-6','rpg-tier-7','rpg-tier-8','rpg-tier-9','rpg-tier-10'
    ];

    const lobbyCard = document.getElementById('quiz-user-profile-card');
    if (lobbyCard) {
        lobbyCard.classList.remove(...allTierClasses);
        lobbyCard.classList.add(tierClass);
    }

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) {
        cabinetModal.classList.remove(...allTierClasses);
        cabinetModal.classList.add(tierClass);
    }

    const appContainer = document.getElementById('quiz-app');
    if (appContainer) {
        appContainer.classList.remove(...allTierClasses);
        appContainer.classList.add(tierClass);
    }

    // Lobby Profile Level Pill & Mini EXP Bar
    const lobbyLevelBadge = document.getElementById('profile-level-badge');
    if (lobbyLevelBadge) {
        lobbyLevelBadge.textContent = rpgState.levelData.fullTitle;
    }

    const lobbyExpBar = document.getElementById('lobby-exp-bar');
    if (lobbyExpBar) {
        lobbyExpBar.style.width = `${rpgState.progressPct}%`;
    }

    const lobbyExpText = document.getElementById('lobby-exp-text');
    if (lobbyExpText) {
        lobbyExpText.textContent = `${rpgState.currentExp} / ${rpgState.reqExp} EXP`;
    }

    // Cabinet Hero Card Badges
    const heroTierBadge = document.getElementById('cab-hero-tier-badge');
    if (heroTierBadge && rpgState.levelData && rpgState.levelData.tier) {
        const t = rpgState.levelData.tier;
        heroTierBadge.textContent = `${t.icon} Tier ${rpgState.tierId}: ${isRu ? t.nameRu : t.nameEn}`;
    }

    const heroLevelBadge = document.getElementById('cab-hero-level-badge');
    if (heroLevelBadge) {
        heroLevelBadge.textContent = rpgState.levelData.fullTitle;
    }

    const heroExpNumbers = document.getElementById('cab-hero-exp-numbers');
    if (heroExpNumbers) {
        heroExpNumbers.textContent = `${rpgState.currentExp} / ${rpgState.reqExp} EXP (${rpgState.progressPct}%)`;
    }

    const heroExpBar = document.getElementById('cab-hero-exp-bar');
    if (heroExpBar) {
        heroExpBar.style.width = `${rpgState.progressPct}%`;
    }

    const heroTotalExp = document.getElementById('cab-hero-total-exp');
    if (heroTotalExp) {
        heroTotalExp.textContent = (rpgState.totalExp || 0).toLocaleString();
    }

    const heroNextLevel = document.getElementById('cab-hero-next-level');
    if (heroNextLevel) {
        const nextLvlNum = Math.min(100, rpgState.level + 1);
        const nextLvlData = RPG_SYSTEM.getLevelData(nextLvlNum, isRu ? 'Ru' : 'En');
        const diffExp = Math.max(0, rpgState.reqExp - rpgState.currentExp);
        heroNextLevel.textContent = `${isRu ? 'Следующий ранг:' : 'Next:'} ${nextLvlData.fullTitle} (+${diffExp} EXP)`;
    }

    // Lobby Card Quick Stats Row Labels
    const lblStreak = document.getElementById('lbl-profile-stat-streak');
    if (lblStreak) lblStreak.textContent = isRu ? 'дней ударно' : 'day streak';
    const lblSolved = document.getElementById('lbl-profile-stat-solved');
    if (lblSolved) lblSolved.textContent = isRu ? 'решено' : 'solved';
    const lblAccuracy = document.getElementById('lbl-profile-stat-accuracy');
    if (lblAccuracy) lblAccuracy.textContent = isRu ? 'точность' : 'accuracy';

    const headerLangBtn = document.getElementById('txt-header-lang-btn');
    if (headerLangBtn) headerLangBtn.textContent = isRu ? '🇷🇺 RU' : '🇬🇧 EN';
    const cabLangBtn = document.getElementById('txt-cab-lang-btn');
    if (cabLangBtn) cabLangBtn.textContent = isRu ? '🌐 RU' : '🌐 EN';
}
window.updateUserProfileDisplay = updateUserProfileDisplay;

/**
 * Initialize Personal Cabinet UI & Tab Navigation
 */
function initPersonalCabinet() {
    const cabinetModal = document.getElementById('quiz-profile-modal');
    const openBtn = document.getElementById('btn-open-profile-modal');
    const avatarBtn = document.getElementById('profile-avatar-btn');
    const closeBtn = document.getElementById('btn-close-profile-modal');

    const showCabinet = () => {
        renderCabinetContent();
        if (cabinetModal) {
            cabinetModal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    };

    const hideCabinet = () => {
        if (cabinetModal) {
            cabinetModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    };

    if (openBtn) openBtn.onclick = showCabinet;
    if (avatarBtn) avatarBtn.onclick = showCabinet;
    if (closeBtn) closeBtn.onclick = hideCabinet;

    if (cabinetModal) {
        cabinetModal.addEventListener('click', (e) => {
            if (e.target === cabinetModal) hideCabinet();
        });
    }

    // Cabinet Tab Navigation
    const tabBtns = document.querySelectorAll('.cabinet-tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.dataset.tab;
            document.querySelectorAll('.cabinet-tab-pane').forEach(pane => pane.style.display = 'none');
            const activePane = document.getElementById(`cabinet-tab-${targetTab}`);
            if (activePane) activePane.style.display = 'block';

            if (targetTab === 'overview') renderCabinetOverviewTab();
            if (targetTab === 'playlists') renderPlaylistsTab();
            if (targetTab === 'history') renderHistoryTab();
        };
    });

    // Create Playlist Button Handler
    const createPlaylistBtn = document.getElementById('btn-create-playlist');
    if (createPlaylistBtn) {
        createPlaylistBtn.onclick = () => window.createNewCustomPlaylist();
    }

    // Profile Save Button Handler
    const saveProfileBtn = document.getElementById('btn-save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = () => window.saveUserProfileChanges();
    }

    // 100-Level RPG Codex Button Handler
    const codexBtn = document.getElementById('btn-open-rpg-codex');
    if (codexBtn) {
        codexBtn.onclick = () => window.openRpgCodexModal();
    }
}

/**
 * Create New Custom Playlist
 */
window.createNewCustomPlaylist = function() {
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const promptMsg = isRu ? 'Введите название нового плейлиста (например, Аортальная хирургия):' : 'Enter new custom playlist title (e.g., Aortic Surgery Review):';
    const title = prompt(promptMsg);
    
    if (title && title.trim()) {
        const newPl = {
            id: 'pl_' + Date.now(),
            title: title.trim(),
            questionIds: [],
            createdAt: new Date().toISOString()
        };
        if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
        state.userPlaylists.push(newPl);
        
        enqueueCloudSync(null);
        renderPlaylistsTab();
    }
};

/**
 * Select Profile Avatar Symbol
 */
window.selectAvatarSymbol = function(avatarKey) {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    state.currentSelectedAvatar = avatarKey;
    
    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatar === avatarKey);
    });

    if (user) {
        user.avatar = avatarKey;
        window.AuthSystem.setAuthenticated(user);
    }
    if (!state.userProfile) state.userProfile = {};
    state.userProfile.avatar = avatarKey;
    localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));

    updateUserProfileDisplay();
    schedulePush();
};

/**
 * Save User Profile Nickname and Avatar Changes
 */
window.saveUserProfileChanges = function() {
    const nickInput = document.getElementById('input-profile-nickname');
    const newNick = nickInput ? nickInput.value.trim() : '';
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    
    const selectedAvatar = state.currentSelectedAvatar || (state.userProfile && state.userProfile.avatar) || (user && user.avatar) || 'doc';

    if (user) {
        if (newNick) user.nickname = newNick;
        user.avatar = selectedAvatar;
        window.AuthSystem.setAuthenticated(user);
        const nameDisplay = document.getElementById('profile-nickname-display');
        if (nameDisplay) nameDisplay.textContent = user.nickname;
    }

    if (!state.userProfile) state.userProfile = {};
    if (newNick) state.userProfile.nickname = newNick;
    state.userProfile.avatar = selectedAvatar;
    localStorage.setItem('starley_user_profile', JSON.stringify(state.userProfile));

    updateUserProfileDisplay();
    pushToSheets(true);

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    alert(isRu ? '✓ Профиль и настройки сохранены!' : '✓ Profile and cloud settings updated successfully!');
};

/**
 * Render Personal Cabinet Content across all tabs
 */
function renderCabinetContent() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const nickInput = document.getElementById('input-profile-nickname');

    updateUserProfileDisplay();

    if (user && nickInput) {
        nickInput.value = user.nickname || user.username || '';
    }

    const currentAvatar = (user && user.avatar) || (state.userProfile && state.userProfile.avatar) || 'doc';
    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatar === currentAvatar);
    });

    renderCabinetOverviewTab();
    renderPlaylistsTab();
    renderHistoryTab();
}

/**
 * Calculate Row 16 Progress Metrics for Dashboard & Google Sheets Sync
 */
function calculateProgressMetrics() {
    let totalBankQ = 2949;
    if (state.quizManifestIndex && Array.isArray(state.quizManifestIndex.manifests)) {
        const sum = state.quizManifestIndex.manifests.reduce((acc, m) => acc + (m.count || 0), 0);
        if (sum > 0) totalBankQ = sum;
    }

    const history = state.sessionHistory || [];
    const totalSessions = history.length;

    let totalAnsweredQ = 0;
    let totalCorrectQ = 0;
    let maxSessionQ = 0;
    const uniqueSolvedSet = new Set();
    const correctSolvedSet = new Set();
    let oldestDate = Date.now();

    history.forEach(s => {
        const qCount = Number(s.totalQ || s.count) || 0;
        const cCount = Number(s.correctQ || s.correctCount) || 0;
        totalAnsweredQ += qCount;
        totalCorrectQ += cCount;

        if (qCount > maxSessionQ) maxSessionQ = qCount;

        if (s.date) {
            const dt = new Date(s.date).getTime();
            if (!isNaN(dt) && dt < oldestDate) oldestDate = dt;
        }

        if (Array.isArray(s.errors)) {
            s.errors.forEach(e => {
                const specId = e.specialId || e.questionId;
                if (specId) {
                    const parsed = parseSpecialId(specId);
                    const cleanId = (parsed && parsed.cleanSpecialId) ? parsed.cleanSpecialId : specId;
                    uniqueSolvedSet.add(cleanId);
                    if (e.isCorrect) correctSolvedSet.add(cleanId);
                }
            });
        }
        if (s.detailString) {
            const tokens = String(s.detailString).split(',');
            tokens.forEach(tok => {
                const parsed = parseSpecialId(tok.trim());
                if (parsed && parsed.cleanSpecialId) {
                    uniqueSolvedSet.add(parsed.cleanSpecialId);
                }
            });
        }
    });

    const uniqueSolvedCount = uniqueSolvedSet.size;
    const uniquePct = totalBankQ > 0 ? ((uniqueSolvedCount / totalBankQ) * 100).toFixed(1) : '0.0';
    const uniqueSolvedStr = `${uniqueSolvedCount} (${uniquePct}%)`;

    const avgAccuracyPct = totalAnsweredQ > 0 ? Math.round((totalCorrectQ / totalAnsweredQ) * 100) : 0;
    const avgAccuracyStr = `${avgAccuracyPct}%`;

    const diffMs = Math.max(1000 * 60 * 60 * 24, Date.now() - oldestDate);
    const days = Math.max(1, diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.max(1, days / 7);
    const months = Math.max(1, days / 30);

    const sessPerDay = (totalSessions / days).toFixed(1);
    const sessPerWk = (totalSessions / weeks).toFixed(1);
    const sessPerMo = (totalSessions / months).toFixed(1);
    const avgSessionsFreq = `${sessPerDay}/d | ${sessPerWk}/w | ${sessPerMo}/m`;

    const qPerDay = (totalAnsweredQ / days).toFixed(1);
    const qPerWk = (totalAnsweredQ / weeks).toFixed(1);
    const qPerMo = (totalAnsweredQ / months).toFixed(1);
    const avgQFreq = `${qPerDay}/d | ${qPerWk}/w | ${qPerMo}/m`;

    const topicWeeklyMap = {};
    if (history.length > 0) {
        const topicAccuraciesMap = {};
        history.slice().reverse().forEach(s => {
            const tList = Array.isArray(s.topics) ? s.topics : [s.setTitle || 'General'];
            const scorePct = s.scorePct !== undefined ? s.scorePct : (s.accuracyPct || 0);
            tList.forEach(t => {
                if (!topicAccuraciesMap[t]) topicAccuraciesMap[t] = [0];
                topicAccuraciesMap[t].push(Math.round(scorePct));
            });
        });
        Object.keys(topicAccuraciesMap).forEach(t => {
            topicWeeklyMap[t] = topicAccuraciesMap[t].map(v => `${v}%`).join(' - ');
        });
    }

    return {
        totalBankQ: totalBankQ,
        totalSessions: totalSessions,
        totalAnsweredQ: totalAnsweredQ,
        totalCorrectQ: totalCorrectQ,
        uniqueSolvedCount: uniqueSolvedCount,
        uniqueSolvedStr: uniqueSolvedStr,
        avgAccuracyStr: avgAccuracyStr,
        avgAccuracyPct: avgAccuracyPct,
        avgSessionsFreq: avgSessionsFreq,
        avgQFreq: avgQFreq,
        sessPerDay: sessPerDay,
        sessPerWk: sessPerWk,
        sessPerMo: sessPerMo,
        qPerDay: qPerDay,
        qPerWk: qPerWk,
        qPerMo: qPerMo,
        maxSessionQ: maxSessionQ,
        topicWeeklyProgressJSON: JSON.stringify(topicWeeklyMap)
    };
}

/**
 * Global Variable & Function for Momentum Chart Range Filter
 */
window.currentMomentumDays = 7;
window.switchMomentumRange = function(days) {
    window.currentMomentumDays = Number(days) || 7;
    document.querySelectorAll('.rpg-time-filter-btn').forEach(btn => {
        btn.classList.toggle('active', Number(btn.dataset.days) === window.currentMomentumDays);
    });
    renderMomentumChart(window.currentMomentumDays);
};

/**
 * Render Interactive 14-Day / 7-Day Activity Momentum SVG Chart
 */
function renderMomentumChart(daysCount) {
    const svg = document.getElementById('cab-momentum-svg');
    const tooltip = document.getElementById('cab-chart-tooltip');
    if (!svg) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const history = state.sessionHistory || [];
    const count = Number(daysCount) || 7;

    const dayMap = {};
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000);
        const key = d.toISOString().split('T')[0];
        const month = d.getMonth() + 1;
        const day = d.getDate();
        dayMap[key] = {
            dateKey: key,
            dateLabel: `${month}/${day}`,
            displayDate: isRu ? `${day}.${month < 10 ? '0' + month : month}` : `${month}/${day}`,
            sessions: 0,
            totalQ: 0,
            correctQ: 0
        };
    }

    history.forEach(s => {
        const key = (s.date ? s.date.split('T')[0] : '');
        if (dayMap[key]) {
            dayMap[key].sessions++;
            dayMap[key].totalQ += (Number(s.totalQ || s.count) || 0);
            dayMap[key].correctQ += (Number(s.correctQ || s.correctCount) || 0);
        }
    });

    const dayItems = Object.values(dayMap);
    let maxQ = 10;
    dayItems.forEach(d => {
        if (d.totalQ > maxQ) maxQ = d.totalQ;
    });

    const chartW = 580;
    const chartH = 110;
    const padTop = 10;
    const padBottom = 22;
    const barAreaH = chartH - padTop - padBottom;
    const slotW = chartW / count;
    const barW = Math.max(8, Math.min(36, slotW - (count === 30 ? 2 : 6)));

    let svgInner = '';

    dayItems.forEach((d, idx) => {
        const x = idx * slotW + (slotW - barW) / 2;
        const barH = d.totalQ > 0 ? Math.max(6, (d.totalQ / maxQ) * barAreaH) : 3;
        const y = padTop + (barAreaH - barH);

        const acc = d.totalQ > 0 ? Math.round((d.correctQ / d.totalQ) * 100) : 0;
        let fillColor = 'rgba(255, 255, 255, 0.08)';
        if (d.totalQ > 0) {
            if (acc >= 80) fillColor = '#3fb950';
            else if (acc >= 60) fillColor = '#eab308';
            else fillColor = '#f87171';
        }

        const tooltipData = JSON.stringify({
            date: d.displayDate,
            sessions: d.sessions,
            questions: d.totalQ,
            correct: d.correctQ,
            acc: acc
        }).replace(/"/g, '&quot;');

        svgInner += `
            <g class="rpg-bar-group" data-info="${tooltipData}">
                <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="4" ry="4" fill="${fillColor}" class="rpg-bar-item" />
                <text x="${x + barW / 2}" y="${chartH - 6}" text-anchor="middle" font-size="10" fill="#8b949e" font-weight="600">${escapeHTML(d.displayDate)}</text>
            </g>
        `;
    });

    svg.setAttribute('viewBox', `0 0 ${chartW} ${chartH}`);
    svg.innerHTML = svgInner;

    // Attach interactive hover tooltips
    const barGroups = svg.querySelectorAll('.rpg-bar-group');
    barGroups.forEach(grp => {
        grp.addEventListener('mouseenter', (ev) => {
            if (!tooltip) return;
            try {
                const info = JSON.parse(grp.getAttribute('data-info').replace(/&quot;/g, '"'));
                tooltip.innerHTML = `
                    <div style="font-weight: 800; color: #fff; margin-bottom: 2px;">📅 ${info.date}</div>
                    <div style="color: var(--quiz-muted);">
                        ${isRu ? 'Сессий' : 'Sessions'}: <strong style="color: #58a6ff;">${info.sessions}</strong> | 
                        ${isRu ? 'Вопросов' : 'Questions'}: <strong style="color: #3fb950;">${info.questions}</strong>
                    </div>
                    <div style="color: var(--quiz-muted);">
                        ${isRu ? 'Точность' : 'Accuracy'}: <strong style="color: ${info.acc >= 80 ? '#3fb950' : (info.acc >= 60 ? '#eab308' : '#f87171')};">${info.acc}%</strong>
                    </div>
                `;
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';

                const rect = svg.getBoundingClientRect();
                const mouseX = ev.clientX - rect.left;
                const mouseY = ev.clientY - rect.top;
                tooltip.style.left = `${Math.max(10, Math.min(rect.width - 160, mouseX - 60))}px`;
                tooltip.style.top = `${Math.max(0, mouseY - 55)}px`;
            } catch (e) {}
        });

        grp.addEventListener('click', () => {
            showMomentumDateDrilldown(d.dateKey, isRu);
        });

        grp.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.display = 'none';
            }
        });
    });
}

/**
 * Render Interactive Day Sessions Drilldown Panel
 */
function showMomentumDateDrilldown(dateKey, isRu) {
    const drilldownEl = document.getElementById('cab-momentum-drilldown');
    if (!drilldownEl) return;

    const history = state.sessionHistory || [];
    const sessions = history.filter(s => (s.date ? s.date.split('T')[0] : '') === dateKey);

    if (sessions.length === 0) {
        drilldownEl.style.display = 'block';
        drilldownEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #58a6ff; font-size: 0.85rem;">📅 ${dateKey}</span>
                <button type="button" onclick="document.getElementById('cab-momentum-drilldown').style.display='none'" style="background: none; border: none; color: var(--quiz-muted); cursor: pointer; font-size: 1rem;">✕</button>
            </div>
            <div style="color: var(--quiz-muted); font-size: 0.8rem;">${isRu ? 'В этот день сессий не зафиксировано.' : 'No sessions recorded for this day.'}</div>
        `;
        return;
    }

    const itemsHtml = sessions.map(s => {
        const correct = Number(s.correctQ || s.correctCount) || 0;
        const total = Number(s.totalQ || s.count) || 0;
        const acc = s.scorePct !== undefined ? s.scorePct : (total > 0 ? Math.round((correct / total) * 100) : 0);
        const accColor = acc >= 80 ? '#3fb950' : (acc >= 60 ? '#eab308' : '#f87171');
        const sTime = s.date ? new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const sId = s.sessionId || s.date || 'sess';
        const title = s.setTitle || (isRu ? 'Клинический квиз' : 'Clinical Quiz');

        return `
            <div style="background: rgba(13, 17, 23, 0.7); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 6px;">
                <div style="min-width: 0; flex: 1;">
                    <div style="font-weight: 700; font-size: 0.85rem; color: var(--quiz-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(title)}</div>
                    <div style="font-size: 0.72rem; color: var(--quiz-muted); margin-top: 2px;">
                        <span>⏰ ${sTime}</span> • <span>${correct}/${total} Qs</span> • <strong style="color: ${accColor};">${acc}%</strong>
                    </div>
                </div>
                <div style="display: flex; gap: 4px; flex-shrink: 0;">
                    <button type="button" onclick="openSessionDetailsModal('${escapeHTML(String(sId))}')" class="btn-outline" style="padding: 4px 8px; font-size: 0.72rem; border-radius: 6px;">🔍 ${isRu ? 'Детали' : 'Details'}</button>
                </div>
            </div>
        `;
    }).join('');

    drilldownEl.style.display = 'block';
    drilldownEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--quiz-border); padding-bottom: 6px; margin-bottom: 6px;">
            <span style="font-weight: 800; color: #58a6ff; font-size: 0.85rem;">📅 ${isRu ? 'Активность за' : 'Activity on'} ${dateKey} (${sessions.length} ${isRu ? 'сессий' : 'sessions'})</span>
            <button type="button" onclick="document.getElementById('cab-momentum-drilldown').style.display='none'" style="background: none; border: none; color: var(--quiz-muted); cursor: pointer; font-size: 0.95rem;">✕</button>
        </div>
        ${itemsHtml}
    `;
}
window.showMomentumDateDrilldown = showMomentumDateDrilldown;

/**
 * Render Interactive Accuracy Progression Spline Line Graph
 */
function renderAccuracyDynamicsChart() {
    const svg = document.getElementById('cab-acc-curve-svg');
    const tooltip = document.getElementById('cab-chart-tooltip');
    const badgeEl = document.getElementById('cab-acc-trend-badge');
    const summaryEl = document.getElementById('cab-acc-stats-summary');
    if (!svg) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const history = state.sessionHistory || [];

    if (history.length === 0) {
        svg.innerHTML = `
            <text x="50%" y="55%" text-anchor="middle" font-size="12" fill="#8b949e" font-weight="600">
                ${isRu ? 'Пройдите несколько сессий для построения кривой точности' : 'Complete test sessions to generate learning curve'}
            </text>
        `;
        if (badgeEl) badgeEl.textContent = isRu ? '⚖️ Ожидание сессий' : '⚖️ Baseline Pending';
        return;
    }

    // Take up to last 16 sessions in chronological order
    const sessions = history.slice(0, 16).reverse();
    const chartW = 580;
    const chartH = 120;
    const padL = 30;
    const padR = 20;
    const padT = 15;
    const padB = 25;
    const plotW = chartW - padL - padR;
    const plotH = chartH - padT - padB;

    let peakAcc = 0;
    let floorAcc = 100;

    const points = sessions.map((s, idx) => {
        const acc = s.scorePct !== undefined ? Number(s.scorePct) : (s.totalQ ? Math.round((s.correctQ / s.totalQ) * 100) : 0);
        if (acc > peakAcc) peakAcc = acc;
        if (acc < floorAcc) floorAcc = acc;

        const x = padL + (sessions.length > 1 ? (idx / (sessions.length - 1)) * plotW : plotW / 2);
        const y = padT + (plotH - (acc / 100) * plotH);

        const expDelta = s.expGained !== undefined ? s.expGained : (acc >= 75 ? '+50' : '-20');
        const dt = s.date ? new Date(s.date) : new Date();
        const dateStr = `${dt.getMonth() + 1}/${dt.getDate()}`;

        return {
            x: x,
            y: y,
            acc: acc,
            sessionNum: idx + 1,
            title: s.setTitle || (isRu ? 'Клинический квиз' : 'Clinical Quiz'),
            totalQ: s.totalQ || 10,
            dateStr: dateStr,
            expDelta: expDelta
        };
    });

    // Spline path builder
    let linePathD = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midX = (p0.x + p1.x) / 2;
        linePathD += ` C ${midX},${p0.y} ${midX},${p1.y} ${p1.x},${p1.y}`;
    }

    const areaPathD = `${linePathD} L ${points[points.length - 1].x},${padT + plotH} L ${points[0].x},${padT + plotH} Z`;

    let nodesHtml = '';
    points.forEach(p => {
        const dataStr = JSON.stringify(p).replace(/"/g, '&quot;');
        nodesHtml += `
            <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#58a6ff" stroke="#ffffff" stroke-width="2" class="rpg-chart-node" data-info="${dataStr}" style="cursor: pointer;" />
        `;
    });

    svg.setAttribute('viewBox', `0 0 ${chartW} ${chartH}`);
    svg.innerHTML = `
        <defs>
            <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#58a6ff" stop-opacity="0.0"/>
            </linearGradient>
        </defs>
        <!-- Horizontal Guide Lines -->
        <line x1="${padL}" y1="${padT}" x2="${chartW - padR}" y2="${padT}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
        <line x1="${padL}" y1="${padT + plotH / 2}" x2="${chartW - padR}" y2="${padT + plotH / 2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3 3"/>
        <line x1="${padL}" y1="${padT + plotH}" x2="${chartW - padR}" y2="${padT + plotH}" stroke="rgba(255,255,255,0.12)"/>
        
        <text x="${padL - 6}" y="${padT + 4}" font-size="9" fill="#8b949e" text-anchor="end">100%</text>
        <text x="${padL - 6}" y="${padT + plotH / 2 + 3}" font-size="9" fill="#8b949e" text-anchor="end">50%</text>
        <text x="${padL - 6}" y="${padT + plotH + 3}" font-size="9" fill="#8b949e" text-anchor="end">0%</text>

        <!-- Area & Spline Line -->
        <path d="${areaPathD}" fill="url(#accGradient)"/>
        <path d="${linePathD}" fill="none" stroke="var(--tier-accent, #58a6ff)" stroke-width="2.5" stroke-linecap="round"/>
        ${nodesHtml}
    `;

    // Interactive tooltip on node hover
    const nodes = svg.querySelectorAll('.rpg-chart-node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', (ev) => {
            if (!tooltip) return;
            try {
                const info = JSON.parse(node.getAttribute('data-info').replace(/&quot;/g, '"'));
                tooltip.innerHTML = `
                    <div style="font-weight: 800; color: #fff;">${escapeHTML(info.title)}</div>
                    <div style="font-size: 0.72rem; color: var(--quiz-muted); margin: 2px 0;">
                        ${isRu ? 'Сессия' : 'Session'} #${info.sessionNum} • ${info.dateStr}
                    </div>
                    <div style="display: flex; gap: 8px; font-weight: 700;">
                        <span style="color: ${info.acc >= 80 ? '#3fb950' : (info.acc >= 60 ? '#eab308' : '#f87171')};">🎯 ${info.acc}%</span>
                        <span style="color: #58a6ff;">${info.totalQ} Qs</span>
                        <span style="color: ${String(info.expDelta).startsWith('-') ? '#f87171' : '#3fb950'};">${info.expDelta} EXP</span>
                    </div>
                `;
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';

                const rect = svg.getBoundingClientRect();
                const mouseX = ev.clientX - rect.left;
                const mouseY = ev.clientY - rect.top;
                tooltip.style.left = `${Math.max(10, Math.min(rect.width - 160, mouseX - 60))}px`;
                tooltip.style.top = `${Math.max(0, mouseY - 55)}px`;
            } catch (e) {}
        });

        node.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.display = 'none';
            }
        });
    });

    // Evaluate Trend Badge
    if (sessions.length >= 4 && badgeEl) {
        const recent3 = sessions.slice(sessions.length - 2).reduce((sum, s) => sum + (s.scorePct || 0), 0) / 2;
        const prev3 = sessions.slice(0, 2).reduce((sum, s) => sum + (s.scorePct || 0), 0) / 2;
        const delta = Math.round(recent3 - prev3);

        if (delta >= 3) {
            badgeEl.className = 'rpg-tier-badge-pill';
            badgeEl.style.background = 'rgba(35, 134, 54, 0.2)';
            badgeEl.style.color = '#3fb950';
            badgeEl.style.borderColor = 'rgba(35, 134, 54, 0.4)';
            badgeEl.textContent = isRu ? `📈 Прогресс (+${delta}%)` : `📈 Improving (+${delta}%)`;
        } else if (delta <= -3) {
            badgeEl.className = 'rpg-tier-badge-pill';
            badgeEl.style.background = 'rgba(218, 54, 51, 0.2)';
            badgeEl.style.color = '#f87171';
            badgeEl.style.borderColor = 'rgba(218, 54, 51, 0.4)';
            badgeEl.textContent = isRu ? `📉 Спад (${delta}%)` : `📉 Regressing (${delta}%)`;
        } else {
            badgeEl.className = 'rpg-tier-badge-pill';
            badgeEl.style.background = 'rgba(88, 166, 255, 0.15)';
            badgeEl.style.color = '#58a6ff';
            badgeEl.style.borderColor = 'rgba(88, 166, 255, 0.35)';
            badgeEl.textContent = isRu ? `⚖️ Стабильность (${Math.round(recent3)}%)` : `⚖️ Consistent (${Math.round(recent3)}%)`;
        }
    }

    if (summaryEl) {
        summaryEl.textContent = isRu 
            ? `Пик: ${peakAcc}% • Мин: ${floorAcc}%`
            : `Peak: ${peakAcc}% • Floor: ${floorAcc}%`;
    }
}

/**
 * Render 6 Clinical RPG Character Attributes Grid (Interactive Diagnostics)
 */
function renderRpgAttributesGrid(attributes, isRu) {
    const container = document.getElementById('cab-rpg-attrs-grid');
    if (!container) return;

    container.innerHTML = attributes.map(attr => {
        const name = isRu ? attr.nameRu : attr.nameEn;
        return `
            <div class="rpg-attr-card" onclick="window.openAttrDiagnostic('${attr.id}')" style="cursor: pointer;" title="${isRu ? 'Нажмите для диагностики навыка' : 'Click for diagnostic breakdown'}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--quiz-text); display: flex; align-items: center; gap: 4px;">
                        <span>${attr.icon}</span> ${escapeHTML(name)}
                    </span>
                    <span class="rpg-attr-rank-badge ${attr.rank.cls}">${attr.rank.grade}</span>
                </div>
                <div class="rpg-attr-bar-bg">
                    <div class="rpg-attr-bar-val" style="width: ${attr.score}%; background: ${attr.color};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--quiz-muted);">
                    <span>${isRu ? 'Уровень навыка' : 'Skill Level'}</span>
                    <strong style="color: var(--quiz-text);">${attr.score} / 100 🔍</strong>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Render Full Cabinet Overview & Premium RPG Infographics Dashboard
 */
function renderCabinetOverviewTab() {
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const pm = calculateProgressMetrics();
    const rpgState = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');

    // 1. Render RPG Hero Card
    const heroCard = document.getElementById('cab-hero-card');
    const heroNick = document.getElementById('cab-hero-nickname');
    const heroTierBadge = document.getElementById('cab-hero-tier-badge');
    const heroLevelBadge = document.getElementById('cab-hero-level-badge');
    const heroExpNumbers = document.getElementById('cab-hero-exp-numbers');
    const heroExpBar = document.getElementById('cab-hero-exp-bar');
    const heroTotalExp = document.getElementById('cab-hero-total-exp');
    const heroNextLevel = document.getElementById('cab-hero-next-level');
    const heroRiskBadge = document.getElementById('cab-hero-risk-badge');

    if (heroCard) {
        heroCard.className = `rpg-hero-card rpg-tier-${rpgState.tierId}`;
    }
    if (heroNick) {
        const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
        heroNick.textContent = (user && (user.nickname || user.username)) || (state.userProfile && state.userProfile.nickname) || (isRu ? 'Доктор' : 'Doctor User');
    }
    if (heroTierBadge) {
        heroTierBadge.textContent = `${rpgState.levelData.tierIcon} Tier ${rpgState.tierId}: ${rpgState.levelData.tierName}`;
    }
    if (heroLevelBadge) {
        heroLevelBadge.textContent = rpgState.levelData.fullTitle;
    }
    if (heroExpNumbers) {
        heroExpNumbers.textContent = `${rpgState.currentExp} / ${rpgState.reqExp} EXP (${rpgState.progressPct}%)`;
    }
    if (heroExpBar) {
        heroExpBar.style.width = `${rpgState.progressPct}%`;
    }
    if (heroTotalExp) {
        heroTotalExp.textContent = rpgState.totalExp.toLocaleString();
    }
    if (heroNextLevel) {
        const nextData = RPG_SYSTEM.getLevelData(Math.min(100, rpgState.level + 1), isRu ? 'Ru' : 'En');
        const remaining = Math.max(0, rpgState.reqExp - rpgState.currentExp);
        heroNextLevel.textContent = `${isRu ? 'Следующий ранг:' : 'Next Rank:'} ${nextData.fullTitle} (+${remaining} EXP)`;
    }

    // Regression Risk Indicator
    if (heroRiskBadge) {
        const penalty = RPG_SYSTEM.getMistakePenalty(rpgState.level);
        const safeCount = Math.floor(rpgState.currentExp / (penalty || 1));

        if (safeCount <= 1) {
            heroRiskBadge.className = 'rpg-risk-indicator rpg-risk-high';
            heroRiskBadge.innerHTML = isRu
                ? `<span>⚠️ Критический риск: <strong>-${penalty} EXP/ошибка</strong></span><span>• След. ошибка приведет к понижению уровня!</span>`
                : `<span>⚠️ Critical Risk: <strong>-${penalty} EXP/error</strong></span><span>• 1 mistake will demote you to Lv.${Math.max(1, rpgState.level - 1)}!</span>`;
        } else if (safeCount <= 5) {
            heroRiskBadge.className = 'rpg-risk-indicator rpg-risk-med';
            heroRiskBadge.innerHTML = isRu
                ? `<span>⚡ Осторожно: <strong>-${penalty} EXP/ошибка</strong></span><span>• Запас: ${safeCount} ошибок до регресса</span>`
                : `<span>⚡ Caution: <strong>-${penalty} EXP/error</strong></span><span>• Safe for ${safeCount} errors before regression</span>`;
        } else {
            heroRiskBadge.className = 'rpg-risk-indicator rpg-risk-low';
            heroRiskBadge.innerHTML = isRu
                ? `<span>🛡️ Стабильно: <strong>-${penalty} EXP/ошибка</strong></span><span>• Запас: ${safeCount} ошибок до регресса</span>`
                : `<span>🛡️ Resilient: <strong>-${penalty} EXP/error</strong></span><span>• Safe for ${safeCount} errors before regression</span>`;
        }
    }

    // 2. Top 4 Quick Stats
    const elStreak = document.getElementById('cab-stat-streak');
    const elSessions = document.getElementById('cab-stat-sessions');
    const elSolved = document.getElementById('cab-stat-solved');
    const elAcc = document.getElementById('cab-stat-accuracy');

    const uniqueDays = new Set(state.sessionHistory.map(s => s.date ? s.date.split('T')[0] : ''));
    uniqueDays.delete('');
    const streakDays = Math.max(uniqueDays.size, 1);

    if (elStreak) elStreak.textContent = streakDays;
    if (elSessions) elSessions.textContent = pm.totalSessions;
    if (elSolved) elSolved.textContent = pm.totalAnsweredQ;
    if (elAcc) elAcc.textContent = pm.avgAccuracyStr;

    // 3. Cadence & Velocity Triple Cards
    const velSessEl = document.getElementById('cab-velocity-sessions');
    const velSessSub = document.getElementById('cab-velocity-sessions-sub');
    const velQEl = document.getElementById('cab-velocity-questions');
    const velQSub = document.getElementById('cab-velocity-questions-sub');
    const velMaxEl = document.getElementById('cab-velocity-max');
    const velMaxSub = document.getElementById('cab-velocity-max-sub');

    if (velSessEl) velSessEl.innerHTML = `${pm.sessPerDay} <span style="font-size: 0.8rem; font-weight: 600; color: var(--quiz-muted);">${isRu ? '/день' : '/d'}</span>`;
    if (velSessSub) velSessSub.textContent = isRu 
        ? `${pm.sessPerWk} в неделю • ${pm.sessPerMo} в месяц`
        : `${pm.sessPerWk} / week • ${pm.sessPerMo} / month`;

    if (velQEl) velQEl.innerHTML = `${pm.qPerDay} <span style="font-size: 0.8rem; font-weight: 600; color: var(--quiz-muted);">${isRu ? '/день' : '/d'}</span>`;
    if (velQSub) velQSub.textContent = isRu 
        ? `${pm.qPerWk} в неделю • ${pm.qPerMo} в месяц`
        : `${pm.qPerWk} / week • ${pm.qPerMo} / month`;

    if (velMaxEl) velMaxEl.innerHTML = `${pm.maxSessionQ} <span style="font-size: 0.8rem; font-weight: 600; color: var(--quiz-muted);">${isRu ? 'вопр.' : 'Qs'}</span>`;
    if (velMaxSub) {
        let title = isRu ? 'Спринтер' : 'Sprinter';
        if (pm.maxSessionQ >= 50) title = isRu ? 'Хирургический марафонец' : 'Iron Will Surgeon';
        else if (pm.maxSessionQ >= 25) title = isRu ? 'Операционный стайер' : 'Endurance Specialist';
        velMaxSub.textContent = `${isRu ? 'Ранг выносливости' : 'Endurance'}: ${title}`;
    }

    // 4. Render Daily Momentum SVG Chart
    renderMomentumChart(window.currentMomentumDays || 7);

    // 5. Render Accuracy Progression Spline Chart
    renderAccuracyDynamicsChart();

    // 6. Render 6 RPG Attributes
    const attrs = RPG_SYSTEM.calculateRpgAttributes(state.sessionHistory, pm.totalBankQ);
    renderRpgAttributesGrid(attrs, isRu);

    // 7. Global Question Bank Conquest
    const covPctEl = document.getElementById('cab-bank-coverage-pct');
    const barMastered = document.getElementById('cab-bank-mastered-bar');
    const barLearning = document.getElementById('cab-bank-learning-bar');
    const barUnseen = document.getElementById('cab-bank-unseen-bar');
    const legendEl = document.getElementById('cab-bank-counts-legend');

    const totalSolved = pm.uniqueSolvedCount || 0;
    const masteredCount = Math.round(totalSolved * 0.65);
    const learningCount = Math.round(totalSolved * 0.25);
    const criticalCount = Math.max(0, totalSolved - masteredCount - learningCount);

    const masteredPct = pm.totalBankQ > 0 ? (masteredCount / pm.totalBankQ) * 100 : 0;
    const learningPct = pm.totalBankQ > 0 ? (learningCount / pm.totalBankQ) * 100 : 0;
    const criticalPct = pm.totalBankQ > 0 ? (criticalCount / pm.totalBankQ) * 100 : 0;

    if (covPctEl) covPctEl.textContent = `${pm.uniqueSolvedStr} / ${pm.totalBankQ}`;
    if (barMastered) barMastered.style.width = `${masteredPct}%`;
    if (barLearning) barLearning.style.width = `${learningPct}%`;
    if (barUnseen) barUnseen.style.width = `${criticalPct}%`;
    if (legendEl) {
        legendEl.innerHTML = isRu
            ? `🟢 ${masteredCount} освоено • 🟡 ${learningCount} в процессе • 🔵 ${criticalCount} на повторении`
            : `🟢 ${masteredCount} Mastered • 🟡 ${learningCount} Learning • 🔵 ${criticalCount} Review`;
    }

    // 8. Interactive Question Manifests & Topics Dashboard
    renderTopicManifestsSection();
}
window.renderCabinetOverviewTab = renderCabinetOverviewTab;

/**
 * Filter and Render Interactive 18 Question Manifests Dashboard
 */
window.currentTopicFilter = 'all';

window.switchTopicFilter = function(filterKey) {
    window.currentTopicFilter = filterKey;
    document.querySelectorAll('.rpg-topic-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.topicFilter === filterKey);
    });
    renderTopicManifestsSection();
};

function renderTopicManifestsSection() {
    const container = document.getElementById('cab-topics-mastery-list');
    const summaryEl = document.getElementById('cab-topics-active-summary');
    if (!container) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const allManifestStats = calculateTopicManifestAnalytics(state.sessionHistory);

    const activeCount = allManifestStats.filter(m => m.attemptedCount > 0).length;
    const weakCount = allManifestStats.filter(m => m.attemptedCount > 0 && (m.accuracy < 75 || m.wrongCount > 0)).length;

    if (summaryEl) {
        summaryEl.textContent = isRu 
            ? `Осваивается тем: ${activeCount} из 18 • Требуют внимания: ${weakCount}`
            : `Practiced: ${activeCount} / 18 manifests • Weak areas: ${weakCount}`;
    }

    const filter = window.currentTopicFilter || 'all';
    let filtered = allManifestStats;

    if (filter === 'active') {
        filtered = allManifestStats.filter(m => m.attemptedCount > 0);
    } else if (filter === 'weak') {
        filtered = allManifestStats.filter(m => m.attemptedCount > 0 && (m.accuracy < 75 || m.wrongCount > 0));
    }

    if (filtered.length === 0) {
        const noMsg = filter === 'weak'
            ? (isRu ? '🎉 Отлично! Нет проблемных тем с точностью ниже 75%.' : '🎉 Great job! No weak topics below 75% accuracy.')
            : (filter === 'active'
                ? (isRu ? 'Вы пока не прошли ни одной темы. Нажмите "Все темы (18)" и выберите интересующее направление!' : 'No practiced topics yet. Select "All Manifests" to start your first specialty quiz!')
                : (isRu ? 'Темы не найдены' : 'No topics found'));
        container.innerHTML = `<div style="grid-column: 1 / -1; color: var(--quiz-muted); font-size: 0.85rem; text-align: center; padding: 24px; background: rgba(13,17,23,0.4); border-radius: 10px; border: 1px dashed var(--quiz-border);">${noMsg}</div>`;
        return;
    }

    container.innerHTML = filtered.map(m => {
        const title = isRu ? m.titleRu : m.titleEn;
        const total = m.totalBankQ;
        const solved = m.attemptedCount;
        const correct = m.correctCount;
        const wrong = m.wrongCount;
        const acc = m.accuracy;
        const cov = m.coveragePct;

        let badgeHtml = '';
        let barColor = '#8b949e';
        if (solved === 0) {
            badgeHtml = `<span style="background: rgba(255,255,255,0.06); color: var(--quiz-muted); font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">${isRu ? 'Не начато' : 'Unseen'}</span>`;
        } else if (acc >= 80) {
            barColor = '#3fb950';
            badgeHtml = `<span style="background: rgba(63, 185, 80, 0.15); color: #3fb950; border: 1px solid rgba(63, 185, 80, 0.3); font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">🟢 ${acc}% ${isRu ? 'точность' : 'acc'}</span>`;
        } else if (acc >= 60) {
            barColor = '#eab308';
            badgeHtml = `<span style="background: rgba(234, 179, 8, 0.15); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.3); font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">🟡 ${acc}% ${isRu ? 'точность' : 'acc'}</span>`;
        } else {
            barColor = '#f87171';
            badgeHtml = `<span style="background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 4px;">🔴 ${acc}% ${isRu ? 'внимание' : 'warning'}</span>`;
        }

        const errBtnHtml = wrong > 0 ? `
            <button type="button" onclick="window.launchManifestErrorsQuiz('${m.id}')" class="rpg-topic-btn-danger" title="${isRu ? 'Тренировать только ошибки по этой теме' : 'Retest missed questions'}">
                ⚠️ ${isRu ? 'Ошибки' : 'Errors'} (${wrong})
            </button>
        ` : '';

        return `
            <div class="rpg-topic-card">
                <div class="rpg-topic-header">
                    <div style="display: flex; align-items: flex-start; gap: 8px; min-width: 0; flex: 1;">
                        <span style="font-size: 1.3rem; line-height: 1;">${m.icon}</span>
                        <div style="min-width: 0;">
                            <div class="rpg-topic-title" title="${escapeHTML(title)}">${escapeHTML(title)}</div>
                            <div style="font-size: 0.72rem; color: var(--quiz-muted); margin-top: 2px;">
                                ${isRu ? 'Банк' : 'Bank'}: <strong>${total}</strong> Qs • #${m.num}
                            </div>
                        </div>
                    </div>
                    <div style="flex-shrink: 0;">
                        ${badgeHtml}
                    </div>
                </div>

                <!-- Progress info & bar -->
                <div style="margin: 8px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--quiz-muted); margin-bottom: 4px;">
                        <span>${isRu ? 'Решено:' : 'Solved:'} <strong>${correct}/${solved}</strong> (${cov}% ${isRu ? 'банка' : 'bank'})</span>
                        <span style="color: ${barColor}; font-weight: 700;">${solved > 0 ? `${acc}%` : '0%'}</span>
                    </div>
                    <div style="height: 6px; background: rgba(48,54,61,0.5); border-radius: 3px; overflow: hidden; display: flex;">
                        <div style="width: ${Math.min(100, (correct / (total || 1)) * 100)}%; height: 100%; background: #3fb950;" title="Correct"></div>
                        <div style="width: ${Math.min(100, (wrong / (total || 1)) * 100)}%; height: 100%; background: #f87171;" title="Errors"></div>
                    </div>
                </div>

                <!-- Action Buttons: Interactive Training Triggers -->
                <div class="rpg-topic-actions">
                    <button type="button" onclick="window.launchManifestQuiz('${m.id}', 25)" class="rpg-topic-btn-primary">
                        🚀 ${isRu ? 'Тренировать (25)' : 'Practice (25)'}
                    </button>
                    ${errBtnHtml}
                </div>
            </div>
        `;
    }).join('');
}
window.renderTopicManifestsSection = renderTopicManifestsSection;

/**
 * Launch Practice Session on Target Manifest
 */
window.launchManifestQuiz = async function(manifestId, count) {
    const mItem = ALL_MANIFESTS_REGISTRY.find(m => m.id === manifestId || String(m.num) === String(manifestId));
    if (!mItem) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    await loadAllQuizManifestIndex();

    let qList = state.setQuestionsMap[mItem.id] || [];
    if (qList.length === 0) {
        try {
            const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
            const res = await fetch(`${rootPath}${mItem.file}`);
            if (res.ok) {
                const data = await res.json();
                let rawList = Array.isArray(data) ? data : (data.questions || []);
                qList = rawList.map((q, idx) => decorateQuestionWithSpecialId(q, idx, mItem.id, mItem.file, ''));
                state.setQuestionsMap[mItem.id] = qList;
            }
        } catch (e) {
            console.error('Failed to load manifest questions:', e);
        }
    }

    if (!qList || qList.length === 0) {
        alert(isRu ? 'Не удалось загрузить вопросы выбранного манифеста.' : 'Could not load questions for selected manifest.');
        return;
    }

    const shuffled = shuffleArray(qList.slice());
    const limit = (count === 'all' || !count) ? shuffled.length : Math.min(Number(count) || 25, shuffled.length);

    state.questions = shuffled.slice(0, limit);
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();
    state.isFinished = false;
    state.sessionMode = 'smart';
    state.bookMeta = {
        title: mItem.titleEn,
        russian_title: mItem.titleRu
    };

    switchScreen('screen-question');
    renderQuestion();
};

/**
 * Launch Practice Session for Manifest Missed Errors
 */
window.launchManifestErrorsQuiz = async function(manifestId) {
    const mItem = ALL_MANIFESTS_REGISTRY.find(m => m.id === manifestId || String(m.num) === String(manifestId));
    if (!mItem) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    const errSpecialIds = new Set();
    const history = state.sessionHistory || [];
    history.forEach(s => {
        if (Array.isArray(s.errors)) {
            s.errors.filter(e => !e.isCorrect).forEach(e => {
                const specId = e.specialId || e.questionId || '';
                const resolvedM = resolveQuestionManifestItem(e, specId);
                if (resolvedM && resolvedM.id === mItem.id) {
                    const parsed = parseSpecialId(specId);
                    errSpecialIds.add(parsed ? parsed.cleanSpecialId : specId);
                }
            });
        }
    });

    if (errSpecialIds.size === 0) {
        alert(isRu ? 'В этом манифесте нет сохранённых ошибок!' : 'No missed questions recorded for this manifest!');
        return;
    }

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    await loadAllQuizManifestIndex();

    const practiceQuestions = [];
    errSpecialIds.forEach(sId => {
        const q = resolveQuestionBySpecialId(sId);
        if (q) practiceQuestions.push(q);
    });

    if (practiceQuestions.length === 0) {
        alert(isRu ? 'Не удалось загрузить вопросы с ошибками из базы данных.' : 'Could not resolve error questions from bank.');
        return;
    }

    state.questions = shuffleArray(practiceQuestions);
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();
    state.isFinished = false;
    state.sessionMode = 'weak';
    state.bookMeta = {
        title: `${mItem.titleEn} (Error Workout)`,
        russian_title: `${mItem.titleRu} (Работа над ошибками)`
    };

    switchScreen('screen-question');
    renderQuestion();
};

/**
 * 100-Level RPG Codex Modal & Tier Roadmap
 */
window.openRpgCodexModal = function() {
    const modal = document.getElementById('quiz-rpg-codex-modal');
    if (!modal) return;
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const rpgState = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');
    renderRpgCodex(rpgState.tierId);
    modal.style.display = 'flex';
};

window.closeRpgCodexModal = function() {
    const modal = document.getElementById('quiz-rpg-codex-modal');
    if (modal) modal.style.display = 'none';
};

window.renderRpgCodex = function(activeTierId) {
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const rpgState = RPG_SYSTEM.getProfileRpgState(state.userProfile, state.sessionHistory, isRu ? 'Ru' : 'En');
    const selectedTierId = Math.min(10, Math.max(1, Number(activeTierId) || rpgState.tierId));
    const tier = RPG_SYSTEM.TIERS[selectedTierId - 1] || RPG_SYSTEM.TIERS[0];

    const navEl = document.getElementById('codex-tier-tabs');
    const bodyEl = document.getElementById('codex-modal-body');

    if (navEl) {
        navEl.innerHTML = RPG_SYSTEM.TIERS.map(t => {
            const isSelected = t.id === selectedTierId;
            const isUserTier = t.id === rpgState.tierId;
            const userPill = isUserTier ? `<span style="font-size: 0.65rem; background: #eab308; color: #000; padding: 1px 4px; border-radius: 3px; font-weight: 800; margin-left: 2px;">📍</span>` : '';
            return `
                <button type="button" class="rpg-codex-tier-tab ${isSelected ? 'active' : ''}" onclick="window.renderRpgCodex(${t.id})" style="${isSelected ? `border-color: ${t.color}; color: ${t.color}; background: rgba(255,255,255,0.06);` : ''}">
                    <span>${t.icon} T${t.id}</span>${userPill}
                </button>
            `;
        }).join('');
    }

    if (bodyEl) {
        const tierName = isRu ? tier.nameRu : tier.nameEn;
        const startLvl = (tier.id - 1) * 10 + 1;
        const endLvl = tier.id * 10;
        const baseExp = RPG_SYSTEM.getCorrectExp(startLvl);
        const penalty = RPG_SYSTEM.getMistakePenalty(startLvl);

        let levelsRowsHtml = '';
        for (let l = startLvl; l <= endLvl; l++) {
            const lData = RPG_SYSTEM.getLevelData(l, isRu ? 'Ru' : 'En');
            const req = RPG_SYSTEM.getRequiredExp(l);
            const isCur = l === rpgState.level;
            const isPast = l < rpgState.level;

            let rowClass = 'rpg-level-row';
            let statusBadge = `<span style="color: var(--quiz-muted); font-size: 0.72rem;">🔒</span>`;
            if (isCur) {
                rowClass += ' current-level';
                statusBadge = `<span style="background: #eab308; color: #000; font-weight: 800; font-size: 0.7rem; padding: 2px 8px; border-radius: 10px;">📍 ${isRu ? 'ВЫ ЗДЕСЬ' : 'CURRENT'}</span>`;
            } else if (isPast) {
                rowClass += ' past-level';
                statusBadge = `<span style="color: #3fb950; font-weight: 700; font-size: 0.75rem;">✓ ${isRu ? 'Пройдено' : 'Achieved'}</span>`;
            }

            levelsRowsHtml += `
                <div class="${rowClass}">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 800; color: ${tier.color}; min-width: 45px; font-size: 0.85rem;">Lv.${l}</span>
                        <span style="font-weight: 700; color: var(--quiz-text); font-size: 0.85rem;">${escapeHTML(lData.title)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 0.75rem; color: var(--quiz-muted);">${req.toLocaleString()} EXP</span>
                        ${statusBadge}
                    </div>
                </div>
            `;
        }

        bodyEl.innerHTML = `
            <!-- Tier Banner -->
            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.08)); border: 1px solid ${tier.color}; border-radius: 12px; padding: 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 2rem;">${tier.icon}</span>
                        <div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; color: ${tier.color}; font-weight: 800;">Tier ${tier.id} • Lv.${startLvl} - Lv.${endLvl}</div>
                            <div style="font-size: 1.15rem; font-weight: 800; color: var(--quiz-text);">${escapeHTML(tierName)}</div>
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 0.75rem; color: var(--quiz-muted);">
                        <div>${isRu ? 'Базовый опыт' : 'Correct EXP'}: <strong style="color: #3fb950;">+${baseExp} EXP</strong></div>
                        <div>${isRu ? 'Штраф ошибки' : 'Mistake Loss'}: <strong style="color: #f87171;">-${penalty} EXP</strong></div>
                    </div>
                </div>
            </div>

            <!-- Levels Roadmap List -->
            <div style="display: flex; flex-direction: column; gap: 4px;">
                ${levelsRowsHtml}
            </div>
        `;
    }
};

/**
 * Character Attribute Diagnostic Modal
 */
window.openAttrDiagnostic = function(attrId) {
    const modal = document.getElementById('quiz-rpg-attr-modal');
    const bodyEl = document.getElementById('rpg-attr-modal-body');
    const titleEl = document.getElementById('rpg-attr-modal-title');
    if (!modal || !bodyEl) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    const pm = calculateProgressMetrics();
    const attrs = RPG_SYSTEM.calculateRpgAttributes(state.sessionHistory, pm.totalBankQ);
    const attr = attrs.find(a => a.id === attrId) || attrs[0];

    const diagData = {
        knowledge: {
            titleRu: 'Клинический кругозор',
            titleEn: 'Clinical Knowledge',
            descRu: 'Отражает объём охваченных уникальных вопросов клинической библиотеки (2,949 вопросов в 18 манифестах). Чем больше разных клинических тем вы решаете, тем выше этот показатель.',
            descEn: 'Measures your breadth across the total 2,949 question library. Solve more diverse questions across all 18 manifests to advance.',
            formulaRu: 'Уникальные решенные вопросы / Референсный объем библиотеки (40% банка)',
            formulaEn: 'Unique questions solved / Reference bank target (40% of bank)',
            ctaRu: '🚀 Тренировать новый манифест',
            ctaEn: '🚀 Drill New Manifest',
            ctaAction: "window.switchTopicFilter('all'); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        },
        precision: {
            titleRu: 'Хирургическая точность',
            titleEn: 'Surgical Precision',
            descRu: 'Отражает процент правильных ответов за всю историю тренировок. Высокая точность защищает от потери очков опыта (EXP) и регресса на старших рангах.',
            descEn: 'Measures overall answer accuracy across your history. Crucial for avoiding EXP regression penalties in higher tiers.',
            formulaRu: 'Всего правильных ответов / Всего данных ответов × 100%',
            formulaEn: 'Total correct / Total answered × 100%',
            ctaRu: '🎯 Запустить тест на точность',
            ctaEn: '🎯 Start Precision Drill',
            ctaAction: "window.launchManifestQuiz('quiz-adult', 25); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        },
        velocity: {
            titleRu: 'Скорость мышления',
            titleEn: 'Cognitive Velocity',
            descRu: 'Отражает темп клинического мышления и скорость правильного выбора тактики в экзаменационных сценариях.',
            descEn: 'Reflects decision-making speed and fluid diagnostic reasoning during timed clinical scenarios.',
            formulaRu: 'Темп ответов и общий объем решенных кейсов',
            formulaEn: 'Throughput pace and answered volume',
            ctaRu: '⚡ Скоростной спринт',
            ctaEn: '⚡ Speed Sprint',
            ctaAction: "window.launchManifestQuiz('quiz-seats', 15); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        },
        stamina: {
            titleRu: 'Интеллектуальная выносливость',
            titleEn: 'Mental Stamina',
            descRu: 'Отражает способность сохранять высокую концентрацию в длинных тестах (50-100 вопросов) и непрерывность серий ежедневных тренировок.',
            descEn: 'Measures cognitive endurance during long marathon tests (50-100 Qs) and consistent day-streak training.',
            formulaRu: 'Максимальная длина сессии + Длина серии дней',
            formulaEn: 'Peak single session volume + Training consistency',
            ctaRu: '🛡️ Марафонская сессия (50)',
            ctaEn: '🛡️ Endurance Marathon (50)',
            ctaAction: "window.launchManifestQuiz('quiz-adult', 50); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        },
        breadth: {
            titleRu: 'Широта специализаций',
            titleEn: 'Specialty Breadth',
            descRu: 'Отражает количество охваченных тем из 18 специализированных направлений: от врожденных пороков сердца до онкологии и кардиореанимации.',
            descEn: 'Measures coverage across all 18 clinical specialties, from pediatric CHD to thoracic oncology and surgical ICU.',
            formulaRu: 'Изученные направления / 18 манифестов библиотеки',
            formulaEn: 'Covered specialties / 18 total library manifests',
            ctaRu: '🌐 Выбрать неизученную тему',
            ctaEn: '🌐 Explore Unseen Specialty',
            ctaAction: "window.switchTopicFilter('all'); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        },
        consistency: {
            titleRu: 'Стабильность результатов',
            titleEn: 'Consistency & Fortitude',
            descRu: 'Отражает надежность результатов между разными тестами и отсутствие резких провалов в качестве ответов.',
            descEn: 'Reflects performance stability and resilience against variance across your latest 10 quiz sessions.',
            formulaRu: 'Стандартное отклонение точности в последних 10 сессиях',
            formulaEn: 'Standard deviation across last 10 quiz runs',
            ctaRu: '⚖️ Закрепить результат',
            ctaEn: '⚖️ Solidify Baseline',
            ctaAction: "window.launchManifestQuiz('quiz-icu', 25); document.getElementById('quiz-rpg-attr-modal').style.display='none';"
        }
    };

    const dInfo = diagData[attr.id] || diagData.knowledge;
    const titleText = isRu ? dInfo.titleRu : dInfo.titleEn;
    const descText = isRu ? dInfo.descRu : dInfo.descEn;
    const formulaText = isRu ? dInfo.formulaRu : dInfo.formulaEn;
    const ctaText = isRu ? dInfo.ctaRu : dInfo.ctaEn;

    if (titleEl) {
        titleEl.innerHTML = `<span>${attr.icon}</span> <span>${escapeHTML(titleText)}</span>`;
    }

    bodyEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; background: rgba(13,17,23,0.5); padding: 12px; border-radius: 10px; border: 1px solid var(--quiz-border);">
            <div>
                <div style="font-size: 0.72rem; color: var(--quiz-muted); text-transform: uppercase;">${isRu ? 'Ранг клинического навыка' : 'Skill Rank'}</div>
                <div style="font-size: 1.4rem; font-weight: 800; color: ${attr.color};">${attr.score} / 100</div>
            </div>
            <span class="rpg-attr-rank-badge ${attr.rank.cls}" style="font-size: 1.2rem; padding: 4px 14px;">${attr.rank.grade}</span>
        </div>
        <div style="margin-bottom: 12px; font-size: 0.88rem; line-height: 1.5; color: var(--quiz-text);">
            ${escapeHTML(descText)}
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px dashed var(--quiz-border); border-radius: 8px; padding: 10px; font-size: 0.75rem; color: var(--quiz-muted); margin-bottom: 16px;">
            <strong>${isRu ? 'Формула расчета' : 'Calculation'}:</strong> ${escapeHTML(formulaText)}
        </div>
        <button type="button" onclick="${dInfo.ctaAction}" class="btn-primary" style="width: 100%; padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.88rem;">
            ${ctaText}
        </button>
    `;

    modal.style.display = 'flex';
};

window.closeRpgAttrModal = function() {
    const modal = document.getElementById('quiz-rpg-attr-modal');
    if (modal) modal.style.display = 'none';
};

/**
 * Render 10 Custom Question Collections / Playlists (Rows 3-12) & Favorites (Row 14)
 */
function renderPlaylistsTab() {
    const grid = document.getElementById('cabinet-playlists-grid');
    const favList = document.getElementById('cabinet-favorites-list');
    const favCountEl = document.getElementById('cab-fav-count');

    ensureTenPlaylists();

    if (favCountEl) favCountEl.textContent = state.userFavorites.length;

    // Render 10 Custom Collections
    if (grid) {
        grid.innerHTML = state.userPlaylists.map(pl => {
            const iconChar = getPlaylistIconChar(pl.iconId);
            const qCount = Array.isArray(pl.questionIds) ? pl.questionIds.length : 0;
            const isRu = state.settings.lang === 'Ru';

            return `
                <div style="background: rgba(13, 17, 23, 0.7); border: 1px solid var(--quiz-border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                            <span style="font-size: 1.5rem; line-height: 1;">${iconChar}</span>
                            <div style="font-weight: 800; font-size: 0.95rem; color: var(--quiz-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(pl.title)}</div>
                        </div>
                        <div style="font-size: 0.78rem; color: var(--quiz-muted);">${qCount} ${isRu ? 'вопросов' : 'questions'} (${isRu ? 'Сборник' : 'Collection'} #${pl.id})</div>
                    </div>
                    <div style="display: flex; gap: 6px; margin-top: 12px;">
                        <button type="button" onclick="launchPlaylistQuiz(${pl.id})" class="btn-primary" style="flex: 1; padding: 6px; font-size: 0.78rem; border-radius: 8px;">🚀 ${isRu ? 'Старт' : 'Play'}</button>
                        <button type="button" onclick="openPlaylistEditorModal(${pl.id})" class="btn-outline" style="padding: 6px 10px; font-size: 0.78rem; border-radius: 8px;" title="Edit Title & Icon">✏️ ${isRu ? 'Изменить' : 'Edit'}</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Starred Favorites (Row 14: Special IDs)
    if (favList) {
        const isRu = state.settings.lang === 'Ru';
        state.userFavorites = sanitizeFavoritesList(state.userFavorites);
        if (favCountEl) favCountEl.textContent = state.userFavorites.length;

        // If manifests are not loaded yet, schedule background load and re-render
        if (!state.allQuizRegistry || state.allQuizRegistry.length === 0) {
            loadAllQuizManifestIndex().then(() => {
                const refreshedFavList = document.getElementById('cabinet-favorites-list');
                if (refreshedFavList) {
                    renderPlaylistsTab();
                }
            }).catch(() => {});
        }

        if (!state.userFavorites || state.userFavorites.length === 0) {
            favList.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 15px; font-size: 0.85rem;">${isRu ? 'Нет избранных вопросов. Нажмите ⭐ во время тестирования, чтобы добавить вопрос в избранное!' : 'No starred questions yet. Click the ⭐ star icon during a session to bookmark questions!'}</div>`;
        } else {
            favList.innerHTML = state.userFavorites.map((specialIdStr, idx) => {
                const cleanId = String(specialIdStr).trim();
                const parsed = parseSpecialId(cleanId);
                const resolvedQ = resolveQuestionBySpecialId(cleanId);
                const qSnippet = resolvedQ ? ((isRu ? (resolvedQ.questionRu || resolvedQ.questionEn) : (resolvedQ.questionEn || resolvedQ.questionRu)) || '').replace(/<[^>]*>/g, '').substring(0, 90) : (isRu ? `Спец-ID: ${cleanId}` : `Special ID: ${cleanId}`);

                return `
                    <div onclick="previewFavoriteQuestion('${escapeHTML(cleanId)}')" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--quiz-border); font-size: 0.85rem; color: var(--quiz-text); cursor: pointer; border-radius: 6px; margin-bottom: 4px;" onmouseover="this.style.background='rgba(88,166,255,0.1)'" onmouseout="this.style.background='transparent'">
                        <div style="flex: 1; min-width: 0; padding-right: 10px;">
                            <span style="color: #eab308; font-weight: 800;">[${parsed ? parsed.cleanSpecialId : escapeHTML(cleanId)}]</span> ${escapeHTML(qSnippet)}
                        </div>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="font-size: 0.75rem; color: #58a6ff; font-weight: 700;">▶ ${isRu ? 'Решить' : 'Solve'}</span>
                            <button type="button" onclick="event.stopPropagation(); removeFavorite('${escapeHTML(cleanId)}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.9rem;" title="Remove Star">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

let currentEditingPlaylistId = null;

window.renderPlaylistEditorQuestions = function() {
    const pl = state.userPlaylists.find(p => p.id === currentEditingPlaylistId || String(p.id) === String(currentEditingPlaylistId));
    if (!pl) return;
    if (!Array.isArray(pl.questionIds)) pl.questionIds = [];

    const isRu = state.settings.lang === 'Ru';
    const countEl = document.getElementById('pl-editor-q-count');
    const itemsEl = document.getElementById('pl-editor-q-items');

    if (countEl) countEl.textContent = pl.questionIds.length;

    if (itemsEl) {
        if (pl.questionIds.length === 0) {
            itemsEl.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 12px; font-size: 0.8rem;">${isRu ? 'В этом сборнике пока нет вопросов.' : 'No questions in this collection yet.'}</div>`;
        } else {
            itemsEl.innerHTML = pl.questionIds.map(specId => {
                const parsed = parseSpecialId(specId);
                const resolvedQ = resolveQuestionBySpecialId(specId);
                const snippet = resolvedQ ? ((isRu ? (resolvedQ.questionRu || resolvedQ.questionEn) : (resolvedQ.questionEn || resolvedQ.questionRu)) || '').replace(/<[^>]*>/g, '').substring(0, 70) : (isRu ? `Спец ID: ${specId}` : `Special ID: ${specId}`);

                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; background: rgba(22,27,34,0.6); border: 1px solid var(--quiz-border); border-radius: 6px; font-size: 0.82rem; color: var(--quiz-text);">
                        <div style="flex: 1; min-width: 0; padding-right: 8px;">
                            <span style="color: #eab308; font-weight: 800;">[${parsed ? parsed.cleanSpecialId : specId}]</span> ${escapeHTML(snippet)}
                        </div>
                        <button type="button" onclick="removeQuestionFromPlaylistEditor('${specId}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.9rem; padding: 2px 6px;" title="Remove Question">✕</button>
                    </div>
                `;
            }).join('');
        }
    }
};

window.removeQuestionFromPlaylistEditor = function(specId) {
    const pl = state.userPlaylists.find(p => p.id === currentEditingPlaylistId || String(p.id) === String(currentEditingPlaylistId));
    if (!pl) return;
    if (Array.isArray(pl.questionIds)) {
        pl.questionIds = pl.questionIds.filter(id => id !== specId);
        pl.count = pl.questionIds.length;
    }
    renderPlaylistEditorQuestions();
    renderPlaylistsTab();
    syncCloudUserData();
};

window.initPlaylistEditorManifestSelect = async function() {
    const selManifest = document.getElementById('select-pl-editor-manifest');
    const selQ = document.getElementById('select-pl-editor-question');
    if (!selManifest) return;

    await loadAllQuizManifestIndex();
    const isRu = state.settings.lang === 'Ru';

    if (state.allQuizRegistry && state.allQuizRegistry.length > 0) {
        selManifest.innerHTML = `<option value="">${isRu ? '-- Выберите тему / манифест --' : '-- Select Topic / Manifest --'}</option>` +
            state.allQuizRegistry.map(m => `
                <option value="${m.id}">№${m.num}. ${m.title} (${m.totalQuestions || 0} ${isRu ? 'вопр.' : 'q.'})</option>
            `).join('');
    }

    if (selQ) {
        selQ.innerHTML = `<option value="">${isRu ? '-- Сначала выберите тему выше --' : '-- First select topic above --'}</option>`;
        selQ.disabled = true;
    }
};

window.onPlaylistEditorManifestSelected = async function() {
    const selManifest = document.getElementById('select-pl-editor-manifest');
    const selQ = document.getElementById('select-pl-editor-question');
    if (!selManifest || !selQ) return;

    const manifestId = selManifest.value;
    const isRu = state.settings.lang === 'Ru';

    if (!manifestId) {
        selQ.innerHTML = `<option value="">${isRu ? '-- Сначала выберите тему выше --' : '-- First select topic above --'}</option>`;
        selQ.disabled = true;
        return;
    }

    selQ.innerHTML = `<option value="">${isRu ? 'Загрузка вопросов...' : 'Loading questions...'}</option>`;
    selQ.disabled = true;

    // Check if questions are loaded for this manifest
    if (!state.setQuestionsMap[manifestId]) {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const manifestObj = (state.allQuizRegistry || []).find(m => m.id === manifestId);
        if (manifestObj && manifestObj.file) {
            try {
                const res = await fetch(`${rootPath}${manifestObj.file}`);
                if (res.ok) {
                    const data = await res.json();
                    let qList = Array.isArray(data) ? data : (data.questions || []);
                    qList = qList.map((q, idx) => decorateQuestionWithSpecialId(q, idx, manifestObj.id, manifestObj.file, ''));
                    state.setQuestionsMap[manifestId] = qList;
                }
            } catch (err) {
                console.error('Error loading manifest questions:', err);
            }
        }
    }

    const questions = state.setQuestionsMap[manifestId] || [];
    if (questions.length === 0) {
        selQ.innerHTML = `<option value="">${isRu ? 'Вопросы не найдены' : 'No questions found'}</option>`;
        selQ.disabled = true;
        return;
    }

    selQ.innerHTML = `<option value="">${isRu ? `-- Выберите вопрос (всего ${questions.length}) --` : `-- Select Question (${questions.length} total) --`}</option>` +
        questions.map((q, idx) => {
            const specId = q.specialId || `${idx + 1}`;
            const text = (isRu ? (q.questionRu || q.questionEn) : (q.questionEn || q.questionRu)) || '';
            const snippet = text.replace(/<[^>]*>/g, '').trim().substring(0, 75);
            return `<option value="${specId}">[${specId}] №${idx + 1}: ${escapeHTML(snippet)}</option>`;
        }).join('');
    selQ.disabled = false;
};

window.addSelectedQuestionToPlaylist = function() {
    const selQ = document.getElementById('select-pl-editor-question');
    if (!selQ) return;
    const specId = selQ.value;
    const isRu = state.settings.lang === 'Ru';

    if (!specId) {
        alert(isRu ? 'Пожалуйста, выберите вопрос из списка!' : 'Please select a question from the list!');
        return;
    }

    const pl = state.userPlaylists.find(p => p.id === currentEditingPlaylistId || String(p.id) === String(currentEditingPlaylistId));
    if (!pl) return;
    if (!Array.isArray(pl.questionIds)) pl.questionIds = [];

    if (!pl.questionIds.includes(specId)) {
        pl.questionIds.push(specId);
        pl.count = pl.questionIds.length;
        renderPlaylistEditorQuestions();
        renderPlaylistsTab();
        syncCloudUserData();
    } else {
        alert(isRu ? 'Этот вопрос уже добавлен в этот сборник!' : 'This question is already in this collection!');
    }
};

window.openPlaylistEditorModal = function(playlistId) {
    const pl = state.userPlaylists.find(p => p.id === playlistId || String(p.id) === String(playlistId));
    if (!pl) return;

    currentEditingPlaylistId = pl.id;

    const modal = document.getElementById('quiz-playlist-editor-modal');
    const inputName = document.getElementById('input-pl-editor-name');
    const iconGrid = document.getElementById('pl-editor-icon-grid');

    if (inputName) inputName.value = pl.title || String(pl.id);

    let selectedIconId = pl.iconId || 1;
    state.currentSelectedPlaylistIconId = selectedIconId;

    if (iconGrid) {
        const isRu = state.settings.lang === 'Ru';
        iconGrid.innerHTML = PLAYLIST_ICONS_MAP.map(item => `
            <button type="button" class="pl-icon-opt-btn ${item.id === selectedIconId ? 'active' : ''}" data-icon-id="${item.id}" onclick="selectPlaylistEditorIcon(${item.id})" style="background: ${item.id === selectedIconId ? 'rgba(88,166,255,0.2)' : 'rgba(13,17,23,0.6)'}; border: 1px solid ${item.id === selectedIconId ? '#58a6ff' : 'var(--quiz-border)'}; border-radius: 10px; padding: 10px 4px; font-size: 1.4rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 4px; transition: all 0.2s;">
                <span>${item.icon}</span>
                <span style="font-size: 0.65rem; color: var(--quiz-muted); font-weight: 700;">${isRu ? item.nameRu : item.nameEn}</span>
            </button>
        `).join('');
    }

    renderPlaylistEditorQuestions();
    window.initPlaylistEditorManifestSelect();

    const btnSave = document.getElementById('btn-pl-editor-save');
    if (btnSave) {
        btnSave.onclick = () => {
            const newTitle = inputName ? inputName.value.trim() : '';
            pl.title = newTitle || String(pl.id);
            pl.iconId = state.currentSelectedPlaylistIconId || selectedIconId;
            syncCloudUserData();
            renderPlaylistsTab();
            if (modal) modal.style.display = 'none';
        };
    }

    const btnClear = document.getElementById('btn-pl-editor-clear');
    if (btnClear) {
        const isRu = state.settings.lang === 'Ru';
        btnClear.onclick = () => {
            if (confirm(isRu ? 'Очистить все вопросы из этого сборника?' : 'Clear all questions from this collection?')) {
                pl.questionIds = [];
                pl.count = 0;
                renderPlaylistEditorQuestions();
                syncCloudUserData();
                renderPlaylistsTab();
            }
        };
    }

    const btnClose = document.getElementById('btn-close-pl-editor-modal');
    if (btnClose) {
        btnClose.onclick = () => {
            if (modal) modal.style.display = 'none';
        };
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
        modal.style.display = 'flex';
    }
};

window.selectPlaylistEditorIcon = function(iconId) {
    state.currentSelectedPlaylistIconId = iconId;
    document.querySelectorAll('.pl-icon-opt-btn').forEach(btn => {
        const matches = Number(btn.dataset.iconId) === Number(iconId);
        btn.style.background = matches ? 'rgba(88,166,255,0.2)' : 'rgba(13,17,23,0.6)';
        btn.style.borderColor = matches ? '#58a6ff' : 'var(--quiz-border)';
    });
};

/**
 * Launch Quiz Session from a Custom Playlist
 */
window.launchPlaylistQuiz = async function(playlistId) {
    const pl = state.userPlaylists.find(p => p.id === playlistId || String(p.id) === String(playlistId));
    if (!pl || !Array.isArray(pl.questionIds) || pl.questionIds.length === 0) {
        const isRu = state.settings.lang === 'Ru';
        alert(isRu ? 'В этом сборнике пока нет вопросов. Нажмите ⭐ или кнопку включения в сборник во время квиза!' : 'This collection has no questions yet. Star questions during a session to add them to playlists!');
        return;
    }

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    await loadAllQuizManifestIndex();

    const plQuestions = [];
    pl.questionIds.forEach(specId => {
        const q = resolveQuestionBySpecialId(specId);
        if (q) plQuestions.push(q);
    });

    if (plQuestions.length === 0) {
        const isRu = state.settings.lang === 'Ru';
        alert(isRu ? 'Не удалось найти вопросы из этого сборника в базе данных.' : 'Questions in this collection could not be matched in the current quiz bank.');
        return;
    }

    state.questions = shuffleArray(plQuestions);
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();

    switchScreen('screen-question');
    renderQuestion();
};

window.removeFavorite = function(specialIdStr) {
    if (!specialIdStr) return;
    const targetStr = String(specialIdStr).trim();
    state.userFavorites = (state.userFavorites || []).filter(f => {
        const id = (typeof f === 'string') ? f.trim() : String((f && (f.id || f.specialId)) || '').trim();
        return id !== targetStr && id !== '[object Object]' && !id.includes('[object');
    });
    state.userFavorites = sanitizeFavoritesList(state.userFavorites);
    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
    syncCloudUserData();
    renderPlaylistsTab();
    if (typeof updateQuizStatsUI === 'function') updateQuizStatsUI();
};

/**
 * Preview/Launch a Single Starred Question from Cabinet
 */
window.previewFavoriteQuestion = async function(specialIdStr) {
    if (!specialIdStr) return;
    const cleanId = (typeof specialIdStr === 'string') ? specialIdStr.trim() : String((specialIdStr && (specialIdStr.id || specialIdStr.specialId)) || '').trim();
    if (!cleanId || cleanId === '[object Object]' || cleanId.includes('[object')) return;

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    await loadAllQuizManifestIndex();
    let targetQ = resolveQuestionBySpecialId(cleanId);

    // If still not found in memory, try searching current loaded questions
    if (!targetQ && state.questions && state.questions.length > 0) {
        targetQ = state.questions.find(q => getQuestionSpecialId(q) === cleanId || String(q.id) === cleanId);
    }

    if (!targetQ) {
        const isRu = state.settings.lang === 'Ru';
        alert(isRu ? `Вопрос со спец-ID ${cleanId} не найден в базе квизов.` : `Question with special ID ${cleanId} was not found in the quiz database.`);
        return;
    }

    // Launch single question in test mode
    state.questions = [targetQ];
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();
    state.isSingleQuestionPreview = true;

    switchScreen('screen-question');
    renderQuestion();
};

window.deletePlaylist = function(playlistId) {
    const pl = state.userPlaylists.find(p => p.id === playlistId || String(p.id) === String(playlistId));
    if (!pl) return;
    pl.questionIds = [];
    pl.count = 0;
    syncCloudUserData();
    renderPlaylistsTab();
};

/**
 * Render Session History Tab
 */
function renderHistoryTab() {
    const container = document.getElementById('cabinet-history-container');
    if (!container) return;

    const isRu = state.settings.lang === 'Ru';

    if (!state.sessionHistory || state.sessionHistory.length === 0) {
        container.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px; font-size: 0.85rem;">${isRu ? 'Нет пройденных сессий. Пройдите квиз, чтобы сохранить историю сессий!' : 'No test sessions completed yet. Complete a quiz to view your history log and score tracking!'}</div>`;
        return;
    }

    container.innerHTML = state.sessionHistory.map(sess => {
        const dateStr = sess.date ? new Date(sess.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
        const score = Number(sess.scorePct ?? sess.accuracyPct ?? 0);
        const scoreColor = score >= 80 ? '#3fb950' : (score >= 60 ? '#eab308' : '#f87171');
        const langLabel = sess.lang === 'Ru' ? '🇷🇺 RU' : '🇬🇧 EN';
        const countModeLabel = sess.countMode === 'all' ? (isRu ? 'Все' : 'All') : (sess.countMode ? `${sess.countMode} Qs` : '');
        const timeSec = Number(sess.timeSpentSec || 0);
        const timeStr = sess.timeSpentStr || (timeSec > 0 ? `${Math.floor(timeSec / 60)}m ${timeSec % 60}s` : '0m 0s');
        
        // Topics chips (up to 3)
        const topics = Array.isArray(sess.topics) ? sess.topics : (typeof sess.topics === 'string' && sess.topics ? [sess.topics] : []);
        const topicsHtml = topics.slice(0, 3).map(t => `<span style="background: rgba(88,166,255,0.12); color: #58a6ff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(88,166,255,0.25);">${escapeHTML(t)}</span>`).join('');
        const topicOverflow = topics.length > 3 ? `<span style="font-size: 0.7rem; color: var(--quiz-muted);">+${topics.length - 3}</span>` : '';

        const sId = sess.sessionId || sess.date || 'sess';
        const correct = sess.correctQ ?? sess.correctCount ?? 0;
        const total = sess.totalQ ?? sess.count ?? 0;

        return `
            <div onclick="openSessionDetailsModal('${escapeHTML(String(sId))}')" style="background: rgba(13, 17, 23, 0.6); border: 1px solid var(--quiz-border); border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(30,35,45,0.8)'; this.style.borderColor='rgba(88,166,255,0.4)';" onmouseout="this.style.background='rgba(13, 17, 23, 0.6)'; this.style.borderColor='var(--quiz-border)';">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 0.92rem; color: var(--quiz-text); margin-bottom: 4px;">${escapeHTML(sess.setTitle || (isRu ? 'Клинический квиз' : 'Clinical Quiz'))}</div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; align-items: center;">
                            <span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${langLabel}</span>
                            ${countModeLabel ? `<span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">🔢 ${countModeLabel}</span>` : ''}
                            <span style="background: rgba(56, 139, 253, 0.15); color: #58a6ff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">🎯 ${sess.mode || 'smart'}</span>
                        </div>
                        ${topicsHtml ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-top: 4px;">${topicsHtml}${topicOverflow}</div>` : ''}
                        <div style="font-size: 0.75rem; color: var(--quiz-muted); margin-top: 6px;">
                            <span>📅 ${dateStr}</span> • <span>⏱️ ${timeStr}</span>
                        </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                        <div style="font-size: 1.2rem; font-weight: 800; color: ${scoreColor};">${score}%</div>
                        <div style="font-size: 0.75rem; color: var(--quiz-muted); margin-top: 2px;">${correct} / ${total} ${isRu ? 'Верно' : 'Correct'}</div>
                        <div style="font-size: 0.72rem; color: #58a6ff; font-weight: 700; margin-top: 6px;">🔍 ${isRu ? 'Детали сессии' : 'Details'} →</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Open Session Details Breakdown Modal
 */
window.openSessionDetailsModal = function(sessionId) {
    const sess = state.sessionHistory.find(s => String(s.sessionId) === String(sessionId));
    if (!sess) return;

    const modal = document.getElementById('quiz-session-detail-modal');
    if (!modal) return;

    const isRu = state.settings.lang === 'Ru';

    document.getElementById('lbl-session-detail-title').textContent = isRu ? '📜 Детали учебной сессии' : '📜 Test Session Overview';
    document.getElementById('sess-detail-set-title').textContent = sess.setTitle || (isRu ? 'Клинический квиз' : 'Clinical Quiz');

    // Score & Meta
    const scoreColor = sess.scorePct >= 80 ? '#3fb950' : (sess.scorePct >= 60 ? '#eab308' : '#f87171');
    const scorePctEl = document.getElementById('sess-detail-score-pct');
    scorePctEl.textContent = `${sess.scorePct}%`;
    scorePctEl.style.color = scoreColor;

    document.getElementById('sess-detail-score-raw').textContent = `${sess.correctQ} / ${sess.totalQ} ` + (isRu ? 'Верно' : 'Correct');
    
    const m = Math.floor((sess.timeSpentSec || 0) / 60);
    const s = (sess.timeSpentSec || 0) % 60;
    document.getElementById('sess-detail-time').textContent = `⏱️ ${m}m ${s}s`;

    // Badges
    const badgesCont = document.getElementById('sess-detail-badges');
    const langBadge = sess.lang === 'Ru' ? '🇷🇺 Русский' : '🇬🇧 English';
    const countBadge = sess.countMode === 'all' ? (isRu ? 'Все вопросы' : 'All Questions') : `${sess.countMode || 10} ` + (isRu ? 'вопросов' : 'Qs');
    badgesCont.innerHTML = `
        <span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">${langBadge}</span>
        <span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">🔢 ${countBadge}</span>
        <span style="background: rgba(88,166,255,0.15); color: #58a6ff; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(88,166,255,0.3);">🎯 ${sess.mode || 'smart'}</span>
    `;

    // Topics pills
    const topicsCont = document.getElementById('sess-detail-topics-pills');
    const topics = Array.isArray(sess.topics) ? sess.topics : [];
    if (topics.length > 0) {
        topicsCont.innerHTML = topics.map(t => `<span style="background: rgba(88,166,255,0.12); color: #58a6ff; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(88,166,255,0.25);">🏷️ ${escapeHTML(t)}</span>`).join('');
    } else {
        topicsCont.innerHTML = `<span style="font-size: 0.75rem; color: var(--quiz-muted);">${isRu ? 'Общая медицинская база' : 'General Medical Bank'}</span>`;
    }

    // Filter Buttons state
    const btnErrors = document.getElementById('btn-filter-sess-errors');
    const btnAll = document.getElementById('btn-filter-sess-all');

    const renderBreakdownList = (filterMode) => {
        if (btnErrors && btnAll) {
            if (filterMode === 'errors') {
                btnErrors.style.background = '#58a6ff';
                btnErrors.style.color = '#fff';
                btnAll.style.background = 'transparent';
                btnAll.style.color = 'var(--quiz-muted)';
            } else {
                btnAll.style.background = '#58a6ff';
                btnAll.style.color = '#fff';
                btnErrors.style.background = 'transparent';
                btnErrors.style.color = 'var(--quiz-muted)';
            }
        }

        const listCont = document.getElementById('session-detail-questions-list');
        if (!listCont) return;

        const items = sess.errors || [];
        const filteredItems = (filterMode === 'errors') ? items.filter(it => !it.isCorrect) : items;

        if (filteredItems.length === 0) {
            listCont.innerHTML = `
                <div style="background: rgba(13, 17, 23, 0.4); border: 1px dashed var(--quiz-border); border-radius: 12px; padding: 20px; text-align: center; color: var(--quiz-muted); font-size: 0.88rem;">
                    ${filterMode === 'errors' 
                        ? (isRu ? '🎉 В этой сессии нет ошибок! Все ответы верны.' : '🎉 No errors in this session! Perfect score.')
                        : (isRu ? 'Подробности вопросов недоступны для старых записей.' : 'Question details unavailable for older records.')}
                </div>
            `;
            return;
        }

        listCont.innerHTML = filteredItems.map((item, idx) => {
            const isOk = item.isCorrect;
            const cardBg = isOk ? 'rgba(35, 134, 54, 0.08)' : 'rgba(218, 54, 51, 0.08)';
            const borderCol = isOk ? 'rgba(35, 134, 54, 0.3)' : 'rgba(218, 54, 51, 0.3)';
            const badgeTag = isOk 
                ? `<span style="background: rgba(35,134,54,0.2); color: #3fb950; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;">✅ ${isRu ? 'Верно' : 'Correct'}</span>`
                : `<span style="background: rgba(218,54,51,0.2); color: #f87171; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;">❌ ${isRu ? 'Ошибка' : 'Incorrect'}</span>`;

            const qText = item['question' + (sess.lang || 'En')] || item.questionEn || item.questionRu || item.question || '';
            const expText = item['explanation' + (sess.lang || 'En')] || item.explanationEn || item.explanationRu || item.explanation || '';

            return `
                <div style="background: ${cardBg}; border: 1px solid ${borderCol}; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 800; font-size: 0.82rem; color: var(--quiz-accent);">${isRu ? 'Вопрос' : 'Question'} #${item.questionIndex || (idx + 1)}</span>
                        ${badgeTag}
                    </div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: var(--quiz-text); line-height: 1.4;">
                        ${_markdownToHtml(qText)}
                    </div>

                    <div style="background: rgba(13, 17, 23, 0.5); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 10px; margin-top: 4px; font-size: 0.82rem; display: flex; flex-direction: column; gap: 6px;">
                        ${!isOk ? `
                            <div style="color: #f87171; font-weight: 600;">
                                <strong>${isRu ? 'Ваш ответ:' : 'Your Answer:'}</strong> ${escapeHTML(item.chosenText || item.chosen || 'N/A')}
                            </div>
                        ` : ''}
                        <div style="color: #3fb950; font-weight: 600;">
                            <strong>${isRu ? 'Правильный ответ:' : 'Correct Answer:'}</strong> ${escapeHTML(item.correctText || item.correct || 'N/A')}
                        </div>
                    </div>

                    ${expText ? `
                        <div style="font-size: 0.82rem; color: var(--quiz-muted); margin-top: 4px; line-height: 1.4; background: rgba(88,166,255,0.05); border-left: 3px solid #58a6ff; padding: 8px 10px; border-radius: 0 6px 6px 0;">
                            <strong style="color: #58a6ff;">💡 ${isRu ? 'Клиническое объяснение:' : 'Explanation:'}</strong>
                            <div>${_markdownToHtml(expText)}</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        renderLatexInElement(listCont);
    };

    if (btnErrors) btnErrors.onclick = () => renderBreakdownList('errors');
    if (btnAll) btnAll.onclick = () => renderBreakdownList('all');

    const errorCount = (sess.errors || []).filter(e => !e.isCorrect).length;
    renderBreakdownList(errorCount > 0 ? 'errors' : 'all');

    // Retest / Practice Mistakes button
    const retestBtn = document.getElementById('btn-retest-session-errors');
    if (retestBtn) {
        if (errorCount === 0) {
            retestBtn.style.display = 'none';
        } else {
            retestBtn.style.display = 'flex';
            retestBtn.innerHTML = `🚀 ${isRu ? 'Отработать ошибки (' + errorCount + ')' : 'Retest Incorrect Questions (' + errorCount + ')'}`;
            retestBtn.onclick = () => launchErrorPracticeSession(sess);
        }
    }

    modal.style.display = 'flex';
};

/**
 * Launch Practice Session with Session Error Questions
 */
window.launchErrorPracticeSession = async function(sess) {
    let specIdsToRetest = [];

    if (Array.isArray(sess.errors) && sess.errors.length > 0) {
        sess.errors.filter(e => !e.isCorrect).forEach(e => {
            const specId = e.specialId || e.questionId;
            if (specId) specIdsToRetest.push(specId);
        });
    }

    if (specIdsToRetest.length === 0 && sess.detailString) {
        const tokens = String(sess.detailString).split(',');
        tokens.forEach(tok => {
            const parsed = parseSpecialId(tok.trim());
            if (parsed && parsed.chosenAnswer) {
                specIdsToRetest.push(parsed.cleanSpecialId);
            }
        });
    }

    if (specIdsToRetest.length === 0) return;

    await loadAllQuizManifestIndex();

    const practiceQuestions = [];
    specIdsToRetest.forEach(specIdStr => {
        const resolved = resolveQuestionBySpecialId(specIdStr);
        if (resolved) {
            practiceQuestions.push(resolved);
        }
    });

    if (practiceQuestions.length === 0) {
        alert('⚠️ Unable to load questions for retest.');
        return;
    }

    const detailModal = document.getElementById('quiz-session-detail-modal');
    if (detailModal) detailModal.style.display = 'none';

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    state.questions = shuffleArray(practiceQuestions);
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();
    state.isFinished = false;
    state.sessionMode = 'weak';

    switchScreen('screen-question');
    renderQuestion();
};

function initSessionDetailModalHandlers() {
    const modal = document.getElementById('quiz-session-detail-modal');
    const closeBtnHeader = document.getElementById('btn-close-session-detail-modal');
    const closeBtnFooter = document.getElementById('btn-close-sess-detail-footer');

    if (closeBtnHeader) {
        closeBtnHeader.onclick = () => {
            if (modal) modal.style.display = 'none';
        };
    }
    if (closeBtnFooter) {
        closeBtnFooter.onclick = () => {
            if (modal) modal.style.display = 'none';
        };
    }
}

/**
 * Toggle Favorite Star inside Quiz Question View
 */
function initFavoriteButtonHandler() {
    const favBtn = document.getElementById('btn-toggle-favorite');
    if (!favBtn) return;

    favBtn.onclick = () => {
        const q = state.questions[state.currentIndex];
        if (!q) return;
        toggleFavoriteQuestion(q);
    };
}

/**
 * Initialize Admin Account Manager Panel
 */
function initAdminAccountManager() {
    const adminModal = document.getElementById('quiz-admin-modal');
    const openBtn = document.getElementById('btn-open-admin-modal');
    const closeBtn = document.getElementById('btn-close-admin-modal');

    if (openBtn) {
        openBtn.onclick = () => {
            loadAdminData();
            if (adminModal) adminModal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (adminModal) adminModal.style.display = 'none';
        };
    }

    // Admin Tabs Navigation
    const adminTabBtns = document.querySelectorAll('.admin-tab-btn');
    adminTabBtns.forEach(btn => {
        btn.onclick = () => {
            adminTabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderBottomColor = 'transparent';
                b.style.color = 'var(--quiz-muted)';
            });
            btn.classList.add('active');
            btn.style.borderBottomColor = '#eab308';
            btn.style.color = 'var(--quiz-text)';

            const targetTab = btn.dataset.tab;
            document.querySelectorAll('.admin-tab-pane').forEach(pane => pane.style.display = 'none');
            const activePane = document.getElementById(`admin-tab-${targetTab}`);
            if (activePane) activePane.style.display = 'block';

            if (targetTab === 'requests') loadAdminRequests();
            if (targetTab === 'users') loadAdminUsers();
        };
    });

    // Admin Add New User
    const addUserBtn = document.getElementById('btn-admin-add-user');
    if (addUserBtn) {
        addUserBtn.onclick = async () => {
            const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
            if (!admin || admin.role !== 'admin') return;

            const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
            const password = prompt(isRu ? 'Введите пароль / PIN для нового пользователя (например: 778899):' : 'Enter Password / PIN for new user (e.g. 778899):');
            if (!password || !password.trim()) return;

            const nickname = prompt(isRu ? 'Введите имя / никнейм врача (например: Д-р Иванов):' : 'Enter Doctor Nickname (e.g. Dr. Ivanov):') || ('User ' + password.trim());
            const email = prompt(isRu ? 'Email адрес (необязательно):' : 'Email address (optional):') || '';
            const role = confirm(isRu ? 'Назначить права администратора? (ОК = Администратор, Отмена = Пользователь)' : 'Assign Administrator privileges? (OK = Admin, Cancel = User)') ? 'admin' : 'user';

            if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminCreateUser === 'function') {
                const adminPass = (admin && admin.password) ? admin.password : '456755';
                const res = await window.GoogleSheetsAPI.adminCreateUser(admin.username || 'admin', adminPass, {
                    username: 'user_' + password.trim(),
                    password: password.trim(),
                    nickname: nickname.trim(),
                    email: email.trim(),
                    role: role
                });

                if (res && res.success) {
                    alert(`✓ ${res.message || (isRu ? 'Аккаунт успешно создан и добавлена страница в Google Таблице!' : 'Account created and page added in Google Sheet!')}`);
                    loadAdminUsers();
                } else {
                    alert(`❌ ${isRu ? 'Не удалось создать пользователя:' : 'Failed to create user:'} ${res ? res.error : 'Unknown error'}`);
                }
            }
        };
    }
}

async function loadAdminData() {
    await loadAdminUsers();
}

async function loadAdminUsers() {
    const list = document.getElementById('admin-users-list');
    const countEl = document.getElementById('admin-user-count');
    const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;

    if (!admin || !list) return;

    const adminPass = (admin && admin.password) ? admin.password : '456755';

    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminGetUsers === 'function') {
        const res = await window.GoogleSheetsAPI.adminGetUsers(admin.username || 'admin', adminPass);
        if (res && res.success && res.users) {
            if (countEl) countEl.textContent = res.users.length;

            list.innerHTML = `
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; color: var(--quiz-text);">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--quiz-border); text-align: left; color: var(--quiz-muted);">
                            <th style="padding: 8px;">User</th>
                            <th style="padding: 8px;">Role</th>
                            <th style="padding: 8px;">PIN / Pass</th>
                            <th style="padding: 8px;">Email</th>
                            <th style="padding: 8px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${res.users.map(u => `
                            <tr style="border-bottom: 1px solid rgba(48, 54, 61, 0.4);">
                                <td style="padding: 8px; font-weight: 700;">${escapeHTML(u.nickname || u.username)}</td>
                                <td style="padding: 8px;"><span style="color: ${u.role === 'admin' ? '#eab308' : '#58a6ff'}; font-weight: 700;">${u.role}</span></td>
                                <td style="padding: 8px;"><code>${escapeHTML(u.password)}</code></td>
                                <td style="padding: 8px; color: var(--quiz-muted);">${escapeHTML(u.email || '-')}</td>
                                <td style="padding: 8px;">
                                    ${u.password !== '456755' && u.username !== 'admin' ? `<button type="button" onclick="deleteAdminUser('${u.password || u.username}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.85rem; font-weight: 700;" title="Delete User and Sheet">🗑️ Delete</button>` : '<span style="color: var(--quiz-muted); font-size: 0.8rem;">Primary Admin</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            return;
        }
    }

    list.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px;">Could not connect to Google Sheets backend to retrieve user directory.</div>`;
}

window.deleteAdminUser = async function(targetUser) {
    const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!admin || !targetUser) return;
    const adminPass = (admin && admin.password) ? admin.password : '456755';
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    if (confirm(isRu ? `Удалить аккаунт '${targetUser}' и персональный лист в Google Таблице?` : `Are you sure you want to permanently delete user account '${targetUser}' and their sheet in Google Spreadsheet?`)) {
        if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminDeleteUser === 'function') {
            const res = await window.GoogleSheetsAPI.adminDeleteUser(admin.username || 'admin', adminPass, targetUser);
            if (res && res.success) {
                alert(`✓ ${res.message || (isRu ? 'Пользователь успешно удален.' : 'User deleted successfully.')}`);
                loadAdminUsers();
            } else {
                alert(`❌ ${isRu ? 'Ошибка удаления:' : 'Error deleting user:'} ${res ? res.error : 'Unknown error'}`);
            }
        }
    }
};

function escapeHTML(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Hook into DOM Loaded Initialization
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initGoogleSheetsAccountSync();
        initPersonalCabinet();
        initFavoriteButtonHandler();
        initAdminAccountManager();
        initSessionDetailModalHandlers();
    }, 500);
});

/* ==========================================================================
 * PLAYLIST MANAGER MODAL HANDLERS
 * ========================================================================== */
window.activeManagedPlaylistId = null;

window.openPlaylistManagerModal = function(playlistId) {
    if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
    const pl = state.userPlaylists.find(p => String(p.id) === String(playlistId));
    if (!pl) return;

    window.activeManagedPlaylistId = playlistId;

    const modal = document.getElementById('quiz-playlist-manager-modal');
    if (modal) modal.style.display = 'flex';

    const titleEl = document.getElementById('pl-mgr-title');
    const countEl = document.getElementById('pl-mgr-count');

    if (titleEl) titleEl.textContent = `📁 ${pl.title}`;
    if (countEl) countEl.textContent = (pl.questionIds || []).length;

    try {
        renderPlaylistManagerQuestions(pl);
    } catch (e) {
        console.error('Error rendering playlist questions:', e);
    }

    populatePlaylistManagerManifestSelect().catch(e => console.error(e));
};

function renderPlaylistManagerQuestions(pl) {
    const listCont = document.getElementById('pl-mgr-questions-list');
    if (!listCont) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    if (!pl.questionIds || pl.questionIds.length === 0) {
        listCont.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px; font-size: 0.85rem;">${isRu ? 'В этом плейлисте пока нет вопросов. Нажмите "+ Добавить вопросы из библиотеки" выше!' : 'No questions in this playlist yet. Click "+ Add Questions from Library" above!'}</div>`;
        return;
    }

    listCont.innerHTML = pl.questionIds.map((qId, idx) => {
        let favMatch = (state.userFavorites || []).find(f => String(f.id) === String(qId));
        let snippet = favMatch ? favMatch.questionSnippet : `Question #${idx + 1} (${qId})`;

        return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(13, 17, 23, 0.6); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; color: var(--quiz-text);">
                <div style="flex: 1; min-width: 0; padding-right: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <span style="color: var(--quiz-accent); font-weight: 700;">#${idx + 1}</span> ${escapeHTML(snippet)}
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <button type="button" onclick="previewFavoriteQuestion('${qId}')" class="btn-outline" style="padding: 4px 10px; font-size: 0.75rem; border-radius: 6px; color: #58a6ff;">▶ Study</button>
                    <button type="button" onclick="removeQuestionFromPlaylist('${pl.id}', '${qId}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.95rem;" title="Remove Question">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

window.removeQuestionFromPlaylist = function(playlistId, qId) {
    if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
    const pl = state.userPlaylists.find(p => String(p.id) === String(playlistId));
    if (!pl) return;

    pl.questionIds = (pl.questionIds || []).filter(id => String(id) !== String(qId));
    syncCloudUserData();

    const countEl = document.getElementById('pl-mgr-count');
    if (countEl) countEl.textContent = pl.questionIds.length;

    renderPlaylistManagerQuestions(pl);
    renderPlaylistsTab();
};

async function ensureAllLibraryBooksLoaded() {
    if (Array.isArray(state.allBooksWithQuizzes) && state.allBooksWithQuizzes.length > 0) {
        return state.allBooksWithQuizzes;
    }

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    try {
        const response = await fetch(`${rootPath}library.json`);
        if (response.ok) {
            const data = await response.json();
            const categories = data.categories || [];
            const metadataPromises = [];
            state.allBooksWithQuizzes = [];

            for (const category of categories) {
                for (const book of (category.books || [])) {
                    const bookPath = `${category.path}/${book.folder}`;
                    metadataPromises.push(
                        fetch(`${rootPath}${bookPath}/metadata.json`)
                            .then(async r => {
                                if (r.ok) {
                                    const metaList = await r.json();
                                    const meta = metaList[0];
                                    if (meta && meta.quiz) {
                                        state.allBooksWithQuizzes.push({
                                            bookPath: bookPath,
                                            meta: meta,
                                            quiz_sets: meta.quiz_sets || []
                                        });
                                    }
                                }
                            })
                            .catch(err => console.error(`Error loading metadata for ${bookPath}`, err))
                    );
                }
            }
            await Promise.all(metadataPromises);
        }
    } catch (e) {
        console.warn('ensureAllLibraryBooksLoaded error:', e);
    }
    return state.allBooksWithQuizzes || [];
}

async function fetchQuestionsForSet(setObj, bookPath) {
    if (!setObj) return [];
    const setId = setObj.id || setObj.setId;
    if (state.setQuestionsMap && state.setQuestionsMap[setId] && state.setQuestionsMap[setId].length > 0) {
        return state.setQuestionsMap[setId];
    }

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    const bookPrefix = bookPath || setObj.bookPath || state.bookPath || '';

    try {
        let jsonUrl = '';
        if (setObj.file) {
            jsonUrl = bookPrefix ? `${rootPath}${bookPrefix}/${setObj.file}` : `${rootPath}${setObj.file}`;
        } else {
            jsonUrl = bookPrefix ? `${rootPath}${bookPrefix}/quizzes/${setId}.json` : `${rootPath}quizzes/${setId}.json`;
        }
        const res = await fetch(jsonUrl);
        if (res.ok) {
            const data = await res.json();
            let questions = Array.isArray(data) ? data : (data.questions || []);
            const manifestId = setId || 'set';
            questions = questions.map((q, idx) => {
                return Object.assign({}, q, {
                    id: q.id || `${manifestId}_q${idx + 1}`,
                    manifestId: manifestId,
                    setId: setId,
                    bookPath: bookPrefix
                });
            });
            if (!state.setQuestionsMap) state.setQuestionsMap = {};
            state.setQuestionsMap[setId] = questions;
            return questions;
        }
    } catch (e) {
        console.warn(`Failed to fetch questions for set ${setId}:`, e);
    }
    return [];
}

window.availableLibrarySetsMap = {};

async function populatePlaylistManagerManifestSelect() {
    const selectEl = document.getElementById('select-pl-mgr-manifest');
    if (!selectEl) return;

    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;
    selectEl.innerHTML = `<option value="">${isRu ? '⏳ Загрузка доступных источников...' : '⏳ Loading available sources...'}</option>`;

    await ensureAllLibraryBooksLoaded();

    let allAvailableSets = [];
    window.availableLibrarySetsMap = {};

    if (Array.isArray(state.allBooksWithQuizzes) && state.allBooksWithQuizzes.length > 0) {
        state.allBooksWithQuizzes.forEach(book => {
            const bookTitle = isRu ? (book.meta.titleRu || book.meta.title || book.meta.titleEn || book.bookPath) : (book.meta.titleEn || book.meta.title || book.bookPath);
            (book.quiz_sets || []).forEach(set => {
                const item = {
                    id: set.id,
                    bookPath: book.bookPath,
                    title: set.title || set.id,
                    russian_title: set.russian_title || set.title || set.id,
                    label: `${bookTitle} — ${isRu ? (set.russian_title || set.title || set.id) : (set.title || set.russian_title || set.id)}`,
                    question_count: set.question_count || 0,
                    setObj: set
                };
                allAvailableSets.push(item);
                window.availableLibrarySetsMap[set.id] = item;
            });
        });
    }

    if (allAvailableSets.length === 0 && Array.isArray(state.selectedSets) && state.selectedSets.length > 0) {
        allAvailableSets = state.selectedSets.map(s => {
            const item = {
                id: s.id || s.setId,
                bookPath: s.bookPath || 'general',
                title: s.title || s.id,
                russian_title: s.russian_title || s.title || s.id,
                label: s.russian_title || s.title || s.id,
                question_count: s.question_count || 0,
                setObj: s
            };
            window.availableLibrarySetsMap[item.id] = item;
            return item;
        });
    }

    if (allAvailableSets.length === 0) {
        selectEl.innerHTML = `<option value="">${isRu ? 'Нет доступных источников' : 'No available sources'}</option>`;
        return;
    }

    selectEl.innerHTML = allAvailableSets.map(s => `
        <option value="${s.id}">${escapeHTML(s.label)} (${s.question_count || '?'} ${isRu ? 'вопр.' : 'q'})</option>
    `).join('');

    selectEl.onchange = () => {
        renderPlaylistManagerAddQuestions(selectEl.value);
    };

    if (allAvailableSets.length > 0) {
        renderPlaylistManagerAddQuestions(allAvailableSets[0].id);
    }
}

async function renderPlaylistManagerAddQuestions(setId) {
    const listCont = document.getElementById('pl-mgr-add-questions-list');
    if (!listCont) return;

    if (!Array.isArray(state.userPlaylists)) state.userPlaylists = [];
    const pl = state.userPlaylists.find(p => String(p.id) === String(window.activeManagedPlaylistId));
    const isRu = (state.settings && state.settings.lang) ? state.settings.lang === 'Ru' : true;

    let questionsInSet = (state.setQuestionsMap && state.setQuestionsMap[setId]) ? state.setQuestionsMap[setId] : [];
    const setInfo = window.availableLibrarySetsMap ? window.availableLibrarySetsMap[setId] : null;

    if (questionsInSet.length === 0 && setInfo) {
        listCont.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 15px; font-size: 0.82rem;">${isRu ? '⏳ Загрузка вопросов...' : '⏳ Loading questions...'}</div>`;
        questionsInSet = await fetchQuestionsForSet(setInfo.setObj || setInfo, setInfo.bookPath);
    }

    if (questionsInSet.length === 0) {
        listCont.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 15px; font-size: 0.82rem;">${isRu ? 'Вопросы не найдены в выбранном сете' : 'No questions found in selected set'}</div>`;
        return;
    }

    listCont.innerHTML = questionsInSet.map((q, idx) => {
        const qId = String(q.id || getQuestionKey(q));
        const isAdded = pl && Array.isArray(pl.questionIds) && pl.questionIds.includes(qId);
        const qText = (q['question' + (isRu ? 'Ru' : 'En')] || q.questionEn || q.questionRu || q.question || '').replace(/<[^>]*>/g, '');

        return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(13, 17, 23, 0.6); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; color: var(--quiz-text);">
                <div style="flex: 1; min-width: 0; padding-right: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    <span style="color: var(--quiz-accent); font-weight: 700;">#${idx + 1}</span> ${escapeHTML(qText.substring(0, 90))}...
                </div>
                <button type="button" onclick="toggleAddQuestionInPlaylistManager('${pl ? pl.id : ''}', '${qId}')" class="${isAdded ? 'btn-outline' : 'btn-primary'}" style="padding: 4px 12px; font-size: 0.78rem; border-radius: 6px; ${isAdded ? 'color:#f87171; border-color:rgba(248,113,113,0.3);' : ''}">
                    ${isAdded ? '✓ ' + (isRu ? 'Добавлено' : 'Added') : '+ ' + (isRu ? 'Добавить' : 'Add')}
                </button>
            </div>
        `;
    }).join('');
}

window.toggleAddQuestionInPlaylistManager = function(playlistId, qId) {
    const pl = state.userPlaylists.find(p => String(p.id) === String(playlistId));
    if (!pl) return;

    if (!Array.isArray(pl.questionIds)) pl.questionIds = [];

    if (pl.questionIds.includes(qId)) {
        pl.questionIds = pl.questionIds.filter(id => id !== qId);
    } else {
        pl.questionIds.push(qId);
    }

    syncCloudUserData();

    const countEl = document.getElementById('pl-mgr-count');
    if (countEl) countEl.textContent = pl.questionIds.length;

    const selectEl = document.getElementById('select-pl-mgr-manifest');
    if (selectEl) renderPlaylistManagerAddQuestions(selectEl.value);

    renderPlaylistManagerQuestions(pl);
    renderPlaylistsTab();
};

function initPlaylistManagerModalHandlers() {
    const modal = document.getElementById('quiz-playlist-manager-modal');
    const closeBtnHeader = document.getElementById('btn-close-pl-mgr-modal');
    const closeBtnFooter = document.getElementById('btn-pl-mgr-done');
    const playBtnFooter = document.getElementById('btn-pl-mgr-play');
    const renameBtn = document.getElementById('btn-pl-mgr-rename');
    const deleteBtn = document.getElementById('btn-pl-mgr-delete');

    const tabItems = document.getElementById('btn-pl-mgr-tab-items');
    const tabAdd = document.getElementById('btn-pl-mgr-tab-add');
    const paneItems = document.getElementById('pl-mgr-pane-items');
    const paneAdd = document.getElementById('pl-mgr-pane-add');

    if (tabItems && tabAdd && paneItems && paneAdd) {
        tabItems.onclick = () => {
            tabItems.style.color = 'var(--quiz-accent)';
            tabItems.style.borderBottom = '2px solid var(--quiz-accent)';
            tabAdd.style.color = 'var(--quiz-muted)';
            tabAdd.style.borderBottom = 'none';
            paneItems.style.display = 'block';
            paneAdd.style.display = 'none';
        };

        tabAdd.onclick = () => {
            tabAdd.style.color = 'var(--quiz-accent)';
            tabAdd.style.borderBottom = '2px solid var(--quiz-accent)';
            tabItems.style.color = 'var(--quiz-muted)';
            tabItems.style.borderBottom = 'none';
            paneItems.style.display = 'none';
            paneAdd.style.display = 'block';
        };
    }

    if (renameBtn) {
        renameBtn.onclick = () => {
            const pl = state.userPlaylists.find(p => String(p.id) === String(window.activeManagedPlaylistId));
            if (!pl) return;
            const newTitle = prompt('Rename Playlist:', pl.title);
            if (newTitle && newTitle.trim()) {
                pl.title = newTitle.trim();
                const titleEl = document.getElementById('pl-mgr-title');
                if (titleEl) titleEl.textContent = `📁 ${pl.title}`;
                syncCloudUserData();
                renderPlaylistsTab();
            }
        };
    }

    if (deleteBtn) {
        deleteBtn.onclick = () => {
            if (window.activeManagedPlaylistId) {
                deletePlaylist(window.activeManagedPlaylistId);
                if (modal) modal.style.display = 'none';
            }
        };
    }

    if (playBtnFooter) {
        playBtnFooter.onclick = () => {
            if (window.activeManagedPlaylistId) {
                if (modal) modal.style.display = 'none';
                launchPlaylistQuiz(window.activeManagedPlaylistId);
            }
        };
    }

    if (closeBtnHeader) closeBtnHeader.onclick = () => { if (modal) modal.style.display = 'none'; };
    if (closeBtnFooter) closeBtnFooter.onclick = () => { if (modal) modal.style.display = 'none'; };
}

