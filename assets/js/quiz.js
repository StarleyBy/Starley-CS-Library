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
    settings: {
        count: 100, // Default to a higher number
        shuffle: true,
        exam: false,
        allQuestions: false,
        setId: 'full',
        lang: 'En' // 'En' or 'Ru'
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
    const qId = q.id !== undefined ? q.id : (q.questionEn || q.question || '').substring(0, 50).replace(/[^a-zA-Z0-9]/g, '_');
    const setId = q.setId || state.settings.setId || 'full';
    const bookPath = q.bookPath || state.bookPath || 'general';
    return `starley_sr_${bookPath.replace(/[^a-zA-Z0-9]/g, '_')}_${setId.replace(/[^a-zA-Z0-9]/g, '_')}_${qId}`;
}

function getQuestionTopic(q) {
    const lang = state.settings.lang;
    const topic = q.topic;
    if (topic) return topic;
    
    // Fallback: Chapter title
    if (q.meta && q.meta.chapter) {
        return getChapterTitle(Array.isArray(q.meta.chapter) ? q.meta.chapter[0] : q.meta.chapter, q.bookPath);
    }
    
    // Fallback 2: Set label or book title
    const book = state.allBooksWithQuizzes.find(b => b.bookPath === q.bookPath);
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
    if (user && !user.isGuest) {
        return {
            nickname: user.nickname || user.username || 'Doctor',
            avatar: user.avatar || 'doc',
            streak: 1,
            lastActiveDate: new Date().toDateString(),
            totalSolved: 0,
            correctCount: 0
        };
    }
    
    try {
        localStorage.removeItem('starley_user_profile');
    } catch (e) {}

    return {
        nickname: 'Guest Doctor',
        avatar: 'doc',
        streak: 1,
        lastActiveDate: new Date().toDateString(),
        totalSolved: 0,
        correctCount: 0
    };
}

function saveUserProfile(profile) {
    try {
        localStorage.setItem('starley_user_profile', JSON.stringify(profile));
    } catch (e) {}
}

function updateUserProfileDisplay() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const profile = state.userProfile || loadUserProfile();
    state.userProfile = profile;

    const nickDisplay = document.getElementById('profile-nickname-display');
    const avatarIcon = document.getElementById('profile-avatar-icon');
    const statStreak = document.getElementById('profile-stat-streak');
    const statSolved = document.getElementById('profile-stat-solved');
    const statAcc = document.getElementById('profile-stat-accuracy');
    const levelBadge = document.getElementById('profile-level-badge');

    const displayName = (user && !user.isGuest) ? (user.nickname || user.username) : 'Guest Doctor';
    if (nickDisplay) nickDisplay.textContent = displayName;
    
    if (avatarIcon) {
        avatarIcon.className = `avatar-glow-ring avatar-${profile.avatar || 'doc'}`;
        const iconTag = avatarIcon.querySelector('i');
        if (iconTag) {
            iconTag.className = AVATAR_ICONS_MAP[profile.avatar] || 'fas fa-stethoscope';
        }
    }

    if (statStreak) statStreak.textContent = profile.streak || 1;
    if (statSolved) statSolved.textContent = profile.totalSolved || 0;
    
    const accPct = profile.totalSolved > 0 ? Math.round((profile.correctCount / profile.totalSolved) * 100) : 0;
    if (statAcc) statAcc.textContent = `${accPct}%`;

    const level = Math.floor((profile.totalSolved || 0) / 25) + 1;
    const isRu = state.settings.lang === 'Ru';
    let levelTitle = isRu ? 'Резидент' : 'Resident';
    if (level >= 10) levelTitle = isRu ? 'Шеф / Эксперт' : 'Chief Specialist';
    else if (level >= 5) levelTitle = isRu ? 'Врач' : 'Attending';
    else if (level >= 3) levelTitle = isRu ? 'Старший Fellow' : 'Senior Fellow';

    if (levelBadge) {
        levelBadge.textContent = `Lv.${level} ${levelTitle}`;
    }
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
    const key = getQuestionKey(q);
    const favs = getFavoriteQuestionKeys();
    return favs.includes(key);
}

function toggleFavoriteQuestion(q) {
    if (!q) return;
    const key = getQuestionKey(q);
    let favs = getFavoriteQuestionKeys();
    let isFav = false;

    if (favs.includes(key)) {
        favs = favs.filter(k => k !== key);
        isFav = false;
    } else {
        favs.push(key);
        isFav = true;
    }

    try {
        localStorage.setItem('starley_favorite_questions', JSON.stringify(favs));
    } catch (e) {}

    const btnFav = document.getElementById('btn-toggle-favorite');
    if (btnFav) {
        const icon = btnFav.querySelector('i');
        if (icon) icon.className = isFav ? 'fas fa-star' : 'far fa-star';
        btnFav.style.transform = 'scale(1.3)';
        setTimeout(() => btnFav.style.transform = 'scale(1)', 200);
    }

    playSound('click');
    triggerHaptic('click');
}

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
    
    btnEn.onclick = () => { 
        btnEn.classList.add('active'); 
        btnRu.classList.remove('active'); 
        state.settings.lang = 'En'; 
        updateLobbyLabels();
        if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
    };
    btnRu.onclick = () => { 
        btnRu.classList.add('active'); 
        btnEn.classList.remove('active'); 
        state.settings.lang = 'Ru'; 
        updateLobbyLabels();
        if (typeof updateChecklistStatus === 'function') updateChecklistStatus();
    };

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

    document.getElementById('btn-exit-quiz').onclick = () => {
        const msg = state.settings.lang === 'Ru' ? 'Выйти из теста? Прогресс будет утерян.' : 'Exit quiz? Progress will be lost.';
        if (confirm(msg)) {
            if (state.timerInterval) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
            }
            state.activeTopicFilter = null;
            switchScreen('screen-lobby');
            updateWeakSpotRadar();
        }
    };

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

    // Gather unique topic titles / set labels involved in this session
    const topicSet = new Set();
    if (state.questions && state.questions.length > 0) {
        state.questions.forEach(q => {
            const t = getQuestionTopic(q);
            if (t) topicSet.add(t);
        });
    }
    const topicsList = Array.from(topicSet);

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
        setTitle: (state.bookMeta && (state.bookMeta.russian_title || state.bookMeta.title)) || (isRu ? 'Клинический квиз' : 'Clinical Quiz'),
        errors: sessionDetailsList
    };

    syncCloudUserData(newSessionObj);
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

function initChecklistWidget() {
    const widget = document.getElementById('quiz-checklist-widget');
    if (!widget) return;

    if (localStorage.getItem('starley_quiz_checklist_closed') === 'true') {
        widget.classList.add('is-closed');
        return;
    }

    if (localStorage.getItem('starley_quiz_checklist_minimized') === 'true') {
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

    const isRu = state.settings.lang === 'Ru';

    // Step A: Language selection
    const itemLang = document.getElementById('chk-item-lang');
    const textLang = document.getElementById('chk-text-lang');
    const stepA = true;
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

    // Headers & Labels
    const titleText = document.getElementById('checklist-title-text');
    if (titleText) titleText.textContent = isRu ? 'Гид по запуску квиза' : 'Quick Setup Guide';

    const pillText = document.getElementById('chk-pill-text');
    if (pillText) pillText.textContent = isRu ? 'Гид по квизу' : 'Quiz Guide';

    // Count
    let count = 0;
    if (stepA) count++;
    if (stepB) count++;
    if (stepC) count++;

    const badge = document.getElementById('checklist-counter-badge');
    if (badge) badge.textContent = `${count}/3`;

    const pillBadge = document.getElementById('chk-pill-count');
    if (pillBadge) pillBadge.textContent = `${count}/3`;

    // Completion Ready Banner & Start Button pulse
    const readyBanner = document.getElementById('checklist-ready-banner');
    const readyText = document.getElementById('checklist-ready-text');
    const btnStart = document.getElementById('btn-start-quiz');

    if (count === 3) {
        if (readyBanner) readyBanner.style.display = 'flex';
        if (readyText) {
            readyText.innerHTML = isRu ? 'Все готово! Нажмите <strong>Старт</strong>!' : 'All set! Press <strong>Start Quiz</strong> now!';
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

    if (nameDisplay) {
        nameDisplay.textContent = user.nickname || user.username || 'Doctor User';
    }

    if (user.role === 'admin' && adminBtn) {
        adminBtn.style.display = 'inline-block';
    }

    if (user.isGuest) {
        if (syncBadge) {
            syncBadge.textContent = '👤 Guest (Local)';
            syncBadge.style.color = '#8b949e';
            syncBadge.style.borderColor = 'rgba(139, 148, 158, 0.3)';
        }
        if (cabinetBadge) cabinetBadge.textContent = '👤 Guest Mode (No Cloud Sync)';
        loadLocalUserData();
        return;
    }

    // Attempt to load remote data from Google Sheets API
    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.getUserData === 'function') {
        if (syncBadge) syncBadge.textContent = '⏳ Loading Cloud...';
        
        try {
            const res = await window.GoogleSheetsAPI.getUserData(user.username);
            if (res && res.success && res.progress) {
                const p = res.progress;
                state.userFavorites = p.favorites || [];
                state.userPlaylists = p.playlists || [];
                state.sessionHistory = res.history || [];

                // Compute streak and solved stats dynamically from session history
                const histSolved = state.sessionHistory.reduce((sum, s) => sum + (s.totalQ || 0), 0);
                const histCorrect = state.sessionHistory.reduce((sum, s) => sum + (s.correctQ || 0), 0);
                const calculatedSolved = Math.max(p.solvedCount || 0, histSolved);
                const calculatedAcc = calculatedSolved > 0 ? Math.round((histCorrect / (calculatedSolved || 1)) * 100) : Math.round(p.accuracyPct || 0);

                const uniqueDays = new Set(state.sessionHistory.map(s => s.date ? s.date.split('T')[0] : ''));
                uniqueDays.delete('');
                const calculatedStreak = Math.max(p.streakDays || 1, uniqueDays.size, 1);

                const profileStreak = document.getElementById('profile-stat-streak');
                const cabStreak = document.getElementById('cab-stat-streak');
                if (profileStreak) profileStreak.textContent = calculatedStreak;
                if (cabStreak) cabStreak.textContent = calculatedStreak;

                const profileSolved = document.getElementById('profile-stat-solved');
                const cabSolved = document.getElementById('cab-stat-solved');
                if (profileSolved) profileSolved.textContent = calculatedSolved;
                if (cabSolved) cabSolved.textContent = calculatedSolved;

                const profileAcc = document.getElementById('profile-stat-accuracy');
                const cabAcc = document.getElementById('cab-stat-accuracy');
                if (profileAcc) profileAcc.textContent = calculatedAcc + '%';
                if (cabAcc) cabAcc.textContent = calculatedAcc + '%';

                if (syncBadge) {
                    syncBadge.textContent = '☁️ Cloud Synced';
                    syncBadge.style.color = '#3fb950';
                    syncBadge.style.borderColor = 'rgba(63, 185, 80, 0.3)';
                }
                if (cabinetBadge) cabinetBadge.textContent = '☁️ Cloud Synced to Google Sheets';
                return;
            }
        } catch (e) {
            console.warn('[GoogleSheetsSync] Remote load error:', e);
        }
    }

    // Fallback to local data
    if (syncBadge) {
        syncBadge.textContent = '🔌 Local Mode';
        syncBadge.style.color = '#eab308';
    }
    loadLocalUserData();
}

function loadLocalUserData() {
    try {
        state.userFavorites = JSON.parse(localStorage.getItem('starley_user_favorites') || '[]');
        state.userPlaylists = JSON.parse(localStorage.getItem('starley_user_playlists') || '[]');
        state.sessionHistory = JSON.parse(localStorage.getItem('starley_session_history') || '[]');
    } catch (e) {}
}

/**
 * Background Sync to Google Sheets
 */
async function syncCloudUserData(newSessionObj) {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;

    if (newSessionObj) {
        state.sessionHistory.unshift(newSessionObj);
        localStorage.setItem('starley_session_history', JSON.stringify(state.sessionHistory));
    }

    // Dynamic stats calculation from session history
    const totalSolved = state.sessionHistory.reduce((sum, s) => sum + (s.totalQ || 0), 0);
    const totalCorrect = state.sessionHistory.reduce((sum, s) => sum + (s.correctQ || 0), 0);
    const accuracyPct = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const uniqueDays = new Set(state.sessionHistory.map(s => s.date ? s.date.split('T')[0] : ''));
    uniqueDays.delete('');
    const streakDays = Math.max(uniqueDays.size, 1);

    // Update UI elements
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

    if (!user || user.isGuest) {
        // Save locally
        localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
        localStorage.setItem('starley_user_playlists', JSON.stringify(state.userPlaylists));
        return;
    }

    const syncBadge = document.getElementById('quiz-sync-status-badge');
    if (syncBadge) syncBadge.textContent = '⏳ Syncing...';

    // Local backup
    localStorage.setItem('starley_user_favorites', JSON.stringify(state.userFavorites));
    localStorage.setItem('starley_user_playlists', JSON.stringify(state.userPlaylists));

    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.syncUserData === 'function') {
        const payload = {
            streakDays: streakDays,
            solvedCount: totalSolved,
            accuracyPct: accuracyPct,
            favorites: state.userFavorites,
            playlists: state.userPlaylists,
            newSession: newSessionObj || null
        };

        const res = await window.GoogleSheetsAPI.syncUserData(user.username, payload);
        if (res && res.success) {
            if (syncBadge) {
                syncBadge.textContent = '☁️ Cloud Synced';
                syncBadge.style.color = '#3fb950';
            }
        } else {
            if (syncBadge) {
                syncBadge.textContent = '🔌 Local Saved';
                syncBadge.style.color = '#eab308';
            }
        }
    }
}

/**
 * Update Profile Avatar and Nickname Display Across UI
 */
function updateUserProfileDisplay() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const avatar = (user && user.avatar) || (state.userProfile && state.userProfile.avatar) || 'doc';
    const avatarMap = {
        'doc': '👨‍⚕️',
        'heart': '🩺',
        'brain': '🧠',
        'flask': '🔬',
        'bolt': '⚡',
        'titan': '💪',
        'guru': '🧘',
        'rocket': '🚀'
    };
    const avatarEmoji = avatarMap[avatar] || '👨‍⚕️';
    
    const profileAvatarBtn = document.getElementById('profile-avatar-btn');
    if (profileAvatarBtn) profileAvatarBtn.textContent = avatarEmoji;
    
    const cabAvatarBtn = document.getElementById('cab-header-avatar');
    if (cabAvatarBtn) cabAvatarBtn.textContent = avatarEmoji;

    document.querySelectorAll('.avatar-opt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatar === avatar);
    });

    const nameDisplay = document.getElementById('profile-nickname-display');
    if (user && nameDisplay) {
        nameDisplay.textContent = user.nickname || user.username || 'Doctor User';
    }
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

    if (openBtn) {
        openBtn.onclick = () => {
            renderCabinetContent();
            if (cabinetModal) cabinetModal.style.display = 'flex';
        };
    }

    if (avatarBtn) {
        avatarBtn.onclick = () => {
            renderCabinetContent();
            if (cabinetModal) cabinetModal.style.display = 'flex';
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            if (cabinetModal) cabinetModal.style.display = 'none';
        };
    }

    // Cabinet Tab Navigation
    const tabBtns = document.querySelectorAll('.cabinet-tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderBottomColor = 'transparent';
                b.style.color = 'var(--quiz-muted)';
            });
            btn.classList.add('active');
            btn.style.borderBottomColor = 'var(--quiz-accent)';
            btn.style.color = 'var(--quiz-text)';

            const targetTab = btn.dataset.tab;
            document.querySelectorAll('.cabinet-tab-pane').forEach(pane => pane.style.display = 'none');
            const activePane = document.getElementById(`cabinet-tab-${targetTab}`);
            if (activePane) activePane.style.display = 'block';

            if (targetTab === 'overview') renderCabinetOverviewTab();
            if (targetTab === 'playlists') renderPlaylistsTab();
            if (targetTab === 'history') renderHistoryTab();
        };
    });

    // Create Playlist Button
    const createPlaylistBtn = document.getElementById('btn-create-playlist');
    if (createPlaylistBtn) {
        createPlaylistBtn.onclick = () => {
            const title = prompt('Enter new custom playlist title (e.g., CABG Board Review):');
            if (title && title.trim()) {
                const newPlaylist = {
                    id: 'pl_' + Date.now(),
                    title: title.trim(),
                    questionIds: [],
                    createdAt: new Date().toISOString()
                };
                state.userPlaylists.push(newPlaylist);
                syncCloudUserData();
                renderPlaylistsTab();
            }
        };
    }

    // Avatar Option Selection Grid
    const avatarOptBtns = document.querySelectorAll('.avatar-opt-btn');
    avatarOptBtns.forEach(btn => {
        btn.onclick = () => {
            avatarOptBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedAvatar = btn.dataset.avatar || 'doc';
            const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
            if (user) {
                user.avatar = selectedAvatar;
                window.AuthSystem.setAuthenticated(user);
            }
            if (state.userProfile) {
                state.userProfile.avatar = selectedAvatar;
            }
            updateUserProfileDisplay();
            syncCloudUserData();
        };
    });

    // Profile Save Button
    const saveProfileBtn = document.getElementById('btn-save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = () => {
            const nickInput = document.getElementById('input-profile-nickname');
            const newNick = nickInput ? nickInput.value.trim() : '';
            if (newNick) {
                const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
                if (user) {
                    user.nickname = newNick;
                    window.AuthSystem.setAuthenticated(user);
                    const nameDisplay = document.getElementById('profile-nickname-display');
                    if (nameDisplay) nameDisplay.textContent = newNick;
                }
            }
            syncCloudUserData();
            if (cabinetModal) cabinetModal.style.display = 'none';
            alert('✓ Profile and cloud settings updated successfully!');
        };
    }
}

function renderCabinetContent() {
    const user = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    const nickInput = document.getElementById('input-profile-nickname');

    updateUserProfileDisplay();

    if (user && nickInput && !nickInput.value) {
        nickInput.value = user.nickname || user.username || '';
    }

    renderCabinetOverviewTab();
    renderPlaylistsTab();
    renderHistoryTab();
}

/**
 * Render Cabinet Overview & Expanded Analytics Dashboard
 */
function renderCabinetOverviewTab() {
    const isRu = state.settings.lang === 'Ru';

    // 1. Core Metrics
    const totalSessions = state.sessionHistory.length;
    const totalSolved = state.sessionHistory.reduce((sum, s) => sum + (s.totalQ || 0), 0);
    const totalCorrect = state.sessionHistory.reduce((sum, s) => sum + (s.correctQ || 0), 0);
    const avgAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const uniqueDays = new Set(state.sessionHistory.map(s => s.date ? s.date.split('T')[0] : ''));
    uniqueDays.delete('');
    const streakDays = Math.max(uniqueDays.size, 1);

    const elStreak = document.getElementById('cab-stat-streak');
    const elSessions = document.getElementById('cab-stat-sessions');
    const elSolved = document.getElementById('cab-stat-solved');
    const elAcc = document.getElementById('cab-stat-accuracy');

    if (elStreak) elStreak.textContent = streakDays;
    if (elSessions) elSessions.textContent = totalSessions;
    if (elSolved) elSolved.textContent = totalSolved;
    if (elAcc) elAcc.textContent = avgAccuracy + '%';

    // Sync lobby header statistics
    const profStreak = document.getElementById('profile-stat-streak');
    const profSolved = document.getElementById('profile-stat-solved');
    const profAcc = document.getElementById('profile-stat-accuracy');
    if (profStreak) profStreak.textContent = streakDays;
    if (profSolved) profSolved.textContent = totalSolved;
    if (profAcc) profAcc.textContent = avgAccuracy + '%';

    // 2. Growth & Trend Box
    const trendTitle = document.getElementById('cab-trend-title');
    const trendDesc = document.getElementById('cab-trend-desc');

    if (totalSessions >= 2) {
        const recentSessions = state.sessionHistory.slice(0, 3);
        const initialSessions = state.sessionHistory.slice(-3);

        const recentAvg = Math.round(recentSessions.reduce((sum, s) => sum + (s.scorePct || 0), 0) / recentSessions.length);
        const initialAvg = Math.round(initialSessions.reduce((sum, s) => sum + (s.scorePct || 0), 0) / initialSessions.length);
        const delta = recentAvg - initialAvg;

        if (trendTitle) trendTitle.textContent = isRu ? '📈 Динамика успешности решений' : '📈 Accuracy Growth Trend';
        if (trendDesc) {
            const growthTag = delta >= 0 ? `+${delta}%` : `${delta}%`;
            const colorStyle = delta >= 0 ? '#3fb950' : '#f87171';
            trendDesc.innerHTML = isRu 
                ? `Старт обучения: <strong>${initialAvg}%</strong> ➔ Текущий уровень: <strong>${recentAvg}%</strong> (<span style="color:${colorStyle}; font-weight:800;">${growthTag}</span>)`
                : `Initial baseline: <strong>${initialAvg}%</strong> ➔ Recent average: <strong>${recentAvg}%</strong> (<span style="color:${colorStyle}; font-weight:800;">${growthTag}</span>)`;
        }
    } else {
        if (trendTitle) trendTitle.textContent = isRu ? '📈 Динамика успешности решений' : '📈 Accuracy Growth Trend';
        if (trendDesc) trendDesc.textContent = isRu 
            ? 'Пройдите хотя бы 2 сеанса тестирования для отслеживания динамики точности.'
            : 'Complete at least 2 quiz sessions to track your accuracy growth trend.';
    }

    // 3. Global Question Bank Coverage
    let totalBankQ = 0;
    if (state.allBooksWithQuizzes && state.allBooksWithQuizzes.length > 0) {
        state.allBooksWithQuizzes.forEach(b => {
            if (b.quiz_sets) {
                b.quiz_sets.forEach(s => totalBankQ += (s.question_count || 10));
            }
        });
    }
    if (totalBankQ === 0) totalBankQ = Math.max(totalSolved, 250);

    const uniqueSolvedSet = new Set();
    state.sessionHistory.forEach(sess => {
        if (sess.errors && Array.isArray(sess.errors)) {
            sess.errors.forEach(item => {
                if (item.questionId) uniqueSolvedSet.add(item.questionId);
            });
        }
    });

    const uniqueCount = uniqueSolvedSet.size > 0 ? uniqueSolvedSet.size : Math.min(totalSolved, totalBankQ);
    const coveragePct = Math.min(Math.round((uniqueCount / totalBankQ) * 100), 100);

    const covPctEl = document.getElementById('cab-bank-coverage-pct');
    const covBarEl = document.getElementById('cab-bank-coverage-bar');
    const covSubEl = document.getElementById('cab-bank-coverage-sub');

    if (covPctEl) covPctEl.textContent = `${coveragePct}% (${uniqueCount} / ${totalBankQ})`;
    if (covBarEl) covBarEl.style.width = `${coveragePct}%`;
    if (covSubEl) covSubEl.textContent = isRu 
        ? `Уникальных вопросов решено из общей базы знаний Starley Library`
        : `Unique questions answered out of total questions in Starley Library`;

    // 4. Topic & Specialty Breakdown
    const topicListEl = document.getElementById('cab-topics-mastery-list');
    if (topicListEl) {
        const topicMap = {};

        state.sessionHistory.forEach(sess => {
            const sessTopics = Array.isArray(sess.topics) && sess.topics.length > 0 ? sess.topics : [sess.setTitle || 'General'];
            
            sessTopics.forEach(tName => {
                if (!topicMap[tName]) {
                    topicMap[tName] = { topic: tName, totalQ: 0, correctQ: 0, sessionsCount: 0 };
                }
                topicMap[tName].totalQ += (sess.totalQ || 0) / sessTopics.length;
                topicMap[tName].correctQ += (sess.correctQ || 0) / sessTopics.length;
                topicMap[tName].sessionsCount += 1;
            });
        });

        const topicEntries = Object.values(topicMap);

        if (topicEntries.length === 0) {
            topicListEl.innerHTML = `<div style="color: var(--quiz-muted); font-size: 0.82rem; text-align: center; padding: 10px;">${isRu ? 'Пройдите первый квиз для наглядного анализа успеваемости по разделам.' : 'Complete your first quiz to generate topic mastery analytics.'}</div>`;
        } else {
            topicListEl.innerHTML = topicEntries.map(t => {
                const total = Math.round(t.totalQ);
                const correct = Math.round(t.correctQ);
                const acc = total > 0 ? Math.round((correct / total) * 100) : 0;
                const accColor = acc >= 80 ? '#3fb950' : (acc >= 60 ? '#eab308' : '#f87171');

                return `
                    <div style="background: rgba(13, 17, 23, 0.5); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
                            <span style="font-weight: 700; color: var(--quiz-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%;">🏷️ ${escapeHTML(t.topic)}</span>
                            <span style="font-weight: 800; color: ${accColor};">${acc}% <span style="font-size: 0.72rem; color: var(--quiz-muted); font-weight: normal;">(${correct}/${total})</span></span>
                        </div>
                        <div style="height: 6px; background: var(--quiz-border); border-radius: 3px; overflow: hidden; display: flex;">
                            <div style="width: ${acc}%; height: 100%; background: ${accColor}; transition: width 0.4s ease;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

/**
 * Spotify-Style Playlist Picker Modal Logic
 */
window.openPlaylistPickerModal = function(q) {
    if (!q) return;

    const modal = document.getElementById('quiz-playlist-picker-modal');
    if (!modal) return;

    const isRu = state.settings.lang === 'Ru';

    const snippetEl = document.getElementById('playlist-picker-q-snippet');
    const qText = (q['question' + state.settings.lang] || q.questionEn || q.question || '').replace(/<[^>]*>/g, '');
    if (snippetEl) snippetEl.textContent = `"${qText.substring(0, 110)}..."`;

    const qId = String(q.id || getQuestionKey(q));

    renderPlaylistPickerOptionsList(qId);

    const btnCreate = document.getElementById('btn-picker-create-playlist');
    const inputNew = document.getElementById('input-picker-new-playlist');

    if (btnCreate && inputNew) {
        btnCreate.onclick = () => {
            const title = inputNew.value.trim();
            if (title) {
                const newPl = {
                    id: 'pl_' + Date.now(),
                    title: title,
                    questionIds: [qId],
                    createdAt: new Date().toISOString()
                };
                state.userPlaylists.push(newPl);
                inputNew.value = '';
                syncCloudUserData();
                renderPlaylistPickerOptionsList(qId);
                renderPlaylistsTab();
            }
        };
    }

    modal.style.display = 'flex';
};

function renderPlaylistPickerOptionsList(qId) {
    const listCont = document.getElementById('playlist-picker-options-list');
    if (!listCont) return;

    const isRu = state.settings.lang === 'Ru';

    if (!state.userPlaylists || state.userPlaylists.length === 0) {
        listCont.innerHTML = `<div style="color: var(--quiz-muted); font-size: 0.82rem; text-align: center; padding: 10px;">${isRu ? 'Плейлистов пока нет. Создайте первый ниже!' : 'No custom playlists yet. Create your first playlist below!'}</div>`;
        return;
    }

    listCont.innerHTML = state.userPlaylists.map(pl => {
        const isIncluded = Array.isArray(pl.questionIds) && pl.questionIds.includes(qId);
        return `
            <label style="display: flex; align-items: center; justify-content: space-between; background: rgba(13, 17, 23, 0.6); border: 1px solid var(--quiz-border); border-radius: 8px; padding: 10px 14px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(30,35,45,0.8)'" onmouseout="this.style.background='rgba(13, 17, 23, 0.6)'">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" ${isIncluded ? 'checked' : ''} onchange="toggleQuestionInPlaylist('${pl.id}', '${qId}')" style="width: 18px; height: 18px; accent-color: #58a6ff; cursor: pointer;">
                    <span style="font-weight: 700; font-size: 0.88rem; color: var(--quiz-text);">📁 ${escapeHTML(pl.title)}</span>
                </div>
                <span style="font-size: 0.75rem; color: var(--quiz-muted);">${(pl.questionIds || []).length} ${isRu ? 'вопр.' : 'questions'}</span>
            </label>
        `;
    }).join('');
}

window.toggleQuestionInPlaylist = function(playlistId, qId) {
    const pl = state.userPlaylists.find(p => String(p.id) === String(playlistId));
    if (!pl) return;

    if (!Array.isArray(pl.questionIds)) pl.questionIds = [];

    if (pl.questionIds.includes(qId)) {
        pl.questionIds = pl.questionIds.filter(id => id !== qId);
    } else {
        pl.questionIds.push(qId);
    }

    syncCloudUserData();
    renderPlaylistPickerOptionsList(qId);
    renderPlaylistsTab();
};

function initPlaylistPickerModalHandlers() {
    const modal = document.getElementById('quiz-playlist-picker-modal');
    const closeBtnHeader = document.getElementById('btn-close-playlist-picker-modal');
    const closeBtnFooter = document.getElementById('btn-done-playlist-picker');

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
 * Render Custom Playlists & Starred Favorites Tab
 */
function renderPlaylistsTab() {
    const grid = document.getElementById('cabinet-playlists-grid');
    const favList = document.getElementById('cabinet-favorites-list');
    const favCountEl = document.getElementById('cab-fav-count');

    if (favCountEl) favCountEl.textContent = state.userFavorites.length;

    // Render Playlists
    if (grid) {
        if (state.userPlaylists.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; background: rgba(13, 17, 23, 0.4); border: 1px dashed var(--quiz-border); border-radius: 12px; padding: 20px; text-align: center; color: var(--quiz-muted); font-size: 0.85rem;">
                    No custom playlists created yet. Click <strong>+ New Playlist</strong> above to build custom question lists!
                </div>
            `;
        } else {
            grid.innerHTML = state.userPlaylists.map(pl => `
                <div style="background: rgba(13, 17, 23, 0.7); border: 1px solid var(--quiz-border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="font-weight: 800; font-size: 0.95rem; color: var(--quiz-text); margin-bottom: 4px;">📁 ${escapeHTML(pl.title)}</div>
                        <div style="font-size: 0.78rem; color: var(--quiz-muted);">${pl.questionIds.length} questions included</div>
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button type="button" onclick="launchPlaylistQuiz('${pl.id}')" class="btn-primary" style="flex: 1; padding: 6px; font-size: 0.78rem; border-radius: 8px;">🚀 Play</button>
                        <button type="button" onclick="deletePlaylist('${pl.id}')" class="btn-outline" style="color: #f87171; border-color: rgba(248,113,113,0.3); padding: 6px 10px; font-size: 0.78rem; border-radius: 8px;" title="Delete Playlist">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Render Starred Favorites
    if (favList) {
        if (state.userFavorites.length === 0) {
            favList.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 15px; font-size: 0.85rem;">No starred questions yet. Click the ⭐ star icon during a quiz session to bookmark questions!</div>`;
        } else {
            favList.innerHTML = state.userFavorites.map((fav, idx) => `
                <div onclick="previewFavoriteQuestion('${fav.id}')" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--quiz-border); font-size: 0.85rem; color: var(--quiz-text); cursor: pointer; border-radius: 6px; margin-bottom: 4px;" onmouseover="this.style.background='rgba(88,166,255,0.1)'" onmouseout="this.style.background='transparent'">
                    <div style="flex: 1; min-width: 0; padding-right: 10px;">
                        <span style="color: var(--quiz-accent); font-weight: 700;">#${idx + 1}</span> ${escapeHTML(fav.questionSnippet || 'Starred Question')}
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <span style="font-size: 0.75rem; color: #58a6ff; font-weight: 700;">▶ Study</span>
                        <button type="button" onclick="event.stopPropagation(); removeFavorite('${fav.id}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.9rem;" title="Remove Star">✕</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

/**
 * Preview/Launch a Single Starred Question from Cabinet
 */
/**
 * Preview/Launch a Single Starred Question from Cabinet
 */
window.previewFavoriteQuestion = async function(favId) {
    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    const favObj = state.userFavorites.find(f => String(f.id) === String(favId));
    let targetQ = null;

    if (state.questions && state.questions.length > 0) {
        targetQ = state.questions.find(q => String(q.id) === String(favId) || getQuestionKey(q) === String(favId));
    }

    if (!targetQ && favObj && favObj.questionObj) {
        targetQ = favObj.questionObj;
    } else if (!targetQ && favObj) {
        targetQ = {
            id: favObj.id,
            questionEn: favObj.questionSnippet || 'Starred Question',
            questionRu: favObj.questionSnippet || 'Избранный вопрос',
            optionsEn: { 'A': 'Review clinical concept', 'B': 'Check guidelines', 'C': 'Consult reference' },
            optionsRu: { 'A': 'Изучить концепцию', 'B': 'Проверить гайдлайн', 'C': 'Обратиться к источнику' },
            correctAnswer: 'A',
            explanationEn: 'Starred question saved in Personal Cabinet.',
            explanationRu: 'Вопрос из Избранного, сохраненный в Личном кабинете.'
        };
    }

    if (!targetQ) {
        alert('This question is not currently available in the loaded quiz set.');
        return;
    }

    state.questions = [targetQ];
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();

    switchScreen('screen-question');
    renderQuestion();
};

/**
 * Launch Quiz Session from a Custom Playlist
 */
window.launchPlaylistQuiz = async function(playlistId) {
    const pl = state.userPlaylists.find(p => p.id === playlistId);
    if (!pl || pl.questionIds.length === 0) {
        alert('This playlist has no questions yet. Star questions during a session to add them to playlists!');
        return;
    }

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    // Load full set and filter
    await loadAllSetsForBook();
    const allQ = getAllQuestionsFromSelectedSets();
    const plQuestions = allQ.filter(q => pl.questionIds.includes(String(q.id)));

    if (plQuestions.length === 0) {
        alert('Questions in this playlist could not be matched in the current quiz bank.');
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

window.deletePlaylist = function(playlistId) {
    if (confirm('Are you sure you want to delete this playlist?')) {
        state.userPlaylists = state.userPlaylists.filter(p => p.id !== playlistId);
        syncCloudUserData();
        renderPlaylistsTab();
    }
};

window.removeFavorite = function(favId) {
    state.userFavorites = state.userFavorites.filter(f => String(f.id) !== String(favId));
    syncCloudUserData();
    renderPlaylistsTab();
};

/**
 * Render Session History Tab
 */
function renderHistoryTab() {
    const container = document.getElementById('cabinet-history-container');
    if (!container) return;

    if (!state.sessionHistory || state.sessionHistory.length === 0) {
        container.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px; font-size: 0.85rem;">No test sessions completed yet. Complete a quiz to view your history log and score tracking!</div>`;
        return;
    }

    container.innerHTML = state.sessionHistory.map(sess => {
        const dateStr = sess.date ? new Date(sess.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';
        const scoreColor = sess.scorePct >= 80 ? '#3fb950' : (sess.scorePct >= 60 ? '#eab308' : '#f87171');
        const langLabel = sess.lang === 'Ru' ? '🇷🇺 RU' : '🇬🇧 EN';
        const countModeLabel = sess.countMode === 'all' ? 'All' : (sess.countMode ? `${sess.countMode} Qs` : '');
        
        // Topics chips (up to 3)
        const topics = Array.isArray(sess.topics) ? sess.topics : [];
        const topicsHtml = topics.slice(0, 3).map(t => `<span style="background: rgba(88,166,255,0.12); color: #58a6ff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(88,166,255,0.25);">${escapeHTML(t)}</span>`).join('');
        const topicOverflow = topics.length > 3 ? `<span style="font-size: 0.7rem; color: var(--quiz-muted);">+${topics.length - 3}</span>` : '';

        return `
            <div onclick="openSessionDetailsModal('${sess.sessionId}')" style="background: rgba(13, 17, 23, 0.6); border: 1px solid var(--quiz-border); border-radius: 12px; padding: 14px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(30,35,45,0.8)'; this.style.borderColor='rgba(88,166,255,0.4)';" onmouseout="this.style.background='rgba(13, 17, 23, 0.6)'; this.style.borderColor='var(--quiz-border)';">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 0.92rem; color: var(--quiz-text); margin-bottom: 4px;">${escapeHTML(sess.setTitle || 'Quiz Session')}</div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; align-items: center;">
                            <span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">${langLabel}</span>
                            ${countModeLabel ? `<span style="background: rgba(255,255,255,0.08); color: var(--quiz-text); font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">🔢 ${countModeLabel}</span>` : ''}
                            <span style="background: rgba(56, 139, 253, 0.15); color: #58a6ff; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">🎯 ${sess.mode || 'smart'}</span>
                        </div>
                        ${topicsHtml ? `<div style="display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-top: 4px;">${topicsHtml}${topicOverflow}</div>` : ''}
                        <div style="font-size: 0.75rem; color: var(--quiz-muted); margin-top: 6px;">
                            <span>📅 ${dateStr}</span> • <span>⏱️ ${Math.round((sess.timeSpentSec || 0) / 60)}m ${(sess.timeSpentSec || 0) % 60}s</span>
                        </div>
                    </div>
                    <div style="text-align: right; flex-shrink: 0;">
                        <div style="font-size: 1.2rem; font-weight: 800; color: ${scoreColor};">${sess.scorePct}%</div>
                        <div style="font-size: 0.75rem; color: var(--quiz-muted); margin-top: 2px;">${sess.correctQ} / ${sess.totalQ} Correct</div>
                        <div style="font-size: 0.72rem; color: #58a6ff; font-weight: 700; margin-top: 6px;">🔍 Details & Retest →</div>
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
window.launchErrorPracticeSession = function(sess) {
    const errorItems = (sess.errors || []).filter(e => !e.isCorrect);
    if (errorItems.length === 0) return;

    const detailModal = document.getElementById('quiz-session-detail-modal');
    if (detailModal) detailModal.style.display = 'none';

    const cabinetModal = document.getElementById('quiz-profile-modal');
    if (cabinetModal) cabinetModal.style.display = 'none';

    const practiceQuestions = errorItems.map(item => ({
        id: item.questionId || ('err_q_' + Date.now()),
        bookPath: item.bookPath || state.bookPath || 'general',
        setId: item.setId || 'errors',
        questionEn: item.questionEn || '',
        questionRu: item.questionRu || '',
        optionsEn: item.optionsEn || {},
        optionsRu: item.optionsRu || {},
        correctAnswer: item.correct,
        explanationEn: item.explanationEn || '',
        explanationRu: item.explanationRu || '',
        chapterId: item.chapterId
    }));

    state.questions = shuffleArray(practiceQuestions);
    state.currentIndex = 0;
    state.score = 0;
    state.answers = [];
    state.startTime = Date.now();
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

        const qId = String(q.id || (q.questionEn || q.question || '').substring(0, 30));
        const isFav = state.userFavorites.some(f => String(f.id) === qId);

        if (isFav) {
            state.userFavorites = state.userFavorites.filter(f => String(f.id) !== qId);
            favBtn.innerHTML = '<i class="far fa-star"></i>';
            favBtn.style.color = '#eab308';
        } else {
            const isRu = state.settings.lang === 'Ru';
            state.userFavorites.push({
                id: qId,
                questionSnippet: (q['question' + state.settings.lang] || q.questionEn || q.question || '').replace(/<[^>]*>/g, '').substring(0, 80),
                questionObj: {
                    id: qId,
                    bookPath: q.bookPath || state.bookPath || 'general',
                    setId: q.setId || 'favorite',
                    questionEn: q.questionEn || q.question || '',
                    questionRu: q.questionRu || q.question || '',
                    optionsEn: q.optionsEn || q.options || {},
                    optionsRu: q.optionsRu || q.options || {},
                    correctAnswer: q.correctAnswer,
                    explanationEn: q.explanationEn || q.explanation || '',
                    explanationRu: q.explanationRu || q.explanation || '',
                    chapterId: q.chapterId,
                    multiAnswer: q.multiAnswer
                },
                addedAt: new Date().toISOString()
            });
            favBtn.innerHTML = '<i class="fas fa-star"></i>';
            favBtn.style.color = '#eab308';
        }

        syncCloudUserData();
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

            const username = prompt('Enter new Username (alphanumeric):');
            if (!username) return;
            const password = prompt('Enter Password:');
            if (!password) return;
            const nickname = prompt('Enter Nickname (e.g. Dr. Smith):') || username;
            const email = prompt('Enter Email address (optional):') || '';
            const role = confirm('Assign Administrator privileges to this user?') ? 'admin' : 'user';

            if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminCreateUser === 'function') {
                const res = await window.GoogleSheetsAPI.adminCreateUser(admin.username, admin.password, {
                    username: username,
                    password: password,
                    nickname: nickname,
                    email: email,
                    role: role
                });

                if (res && res.success) {
                    alert(`✓ ${res.message}`);
                    loadAdminUsers();
                } else {
                    alert(`❌ Failed to create user: ${res ? res.error : 'Unknown error'}`);
                }
            }
        };
    }
}

async function loadAdminData() {
    await loadAdminRequests();
    await loadAdminUsers();
}

async function loadAdminRequests() {
    const list = document.getElementById('admin-requests-list');
    const countEl = document.getElementById('admin-req-count');
    const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;

    if (!admin || !list) return;

    list.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px;">Fetching pending Telegram registration requests from Google Sheets...</div>`;

    const adminPass = (admin && admin.password) ? admin.password : '456755';

    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminGetRequests === 'function') {
        const res = await window.GoogleSheetsAPI.adminGetRequests(admin.username || 'admin', adminPass);
        if (res && res.success && res.requests) {
            const pendingReqs = res.requests.filter(r => r.status === 'pending');
            if (countEl) countEl.textContent = pendingReqs.length;

            if (pendingReqs.length === 0) {
                list.innerHTML = `<div style="color: #3fb950; text-align: center; padding: 20px; font-weight: 700;">✓ No pending Telegram registration requests. All clear!</div>`;
                return;
            }

            list.innerHTML = pendingReqs.map(req => `
                <div style="background: rgba(13, 17, 23, 0.7); border: 1px solid var(--quiz-border); border-radius: 12px; padding: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <div style="font-weight: 800; font-size: 0.95rem; color: var(--quiz-accent);">👤 ${escapeHTML(req.nickname)}</div>
                        <div style="font-size: 0.82rem; color: var(--quiz-text); margin-top: 4px;">
                            <span>Password: <code style="color: #3fb950;">${escapeHTML(req.password)}</code></span> • 
                            <span>Email: ${escapeHTML(req.email || 'N/A')}</span>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--quiz-muted); margin-top: 2px;">
                            Telegram: @${escapeHTML(req.telegramUsername || 'N/A')} (ID: ${req.telegramId}) • Requested: ${new Date(req.requestedAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" onclick="processAdminRequest('${req.requestId}', 'approve')" class="btn-primary" style="padding: 8px 16px; font-size: 0.82rem; background: #238636; border-color: #2ea043; border-radius: 8px;">✓ Approve & Notify</button>
                        <button type="button" onclick="processAdminRequest('${req.requestId}', 'reject')" class="btn-outline" style="color: #f87171; border-color: rgba(248,113,113,0.4); padding: 8px 12px; font-size: 0.82rem; border-radius: 8px;">✕ Reject</button>
                    </div>
                </div>
            `).join('');
            return;
        }
    }

    list.innerHTML = `<div style="color: var(--quiz-muted); text-align: center; padding: 20px;">Could not connect to Google Sheets backend to retrieve registration requests.</div>`;
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
                            <th style="padding: 8px;">Password</th>
                            <th style="padding: 8px;">Email</th>
                            <th style="padding: 8px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${res.users.map(u => `
                            <tr style="border-bottom: 1px solid rgba(48, 54, 61, 0.4);">
                                <td style="padding: 8px; font-weight: 700;">${escapeHTML(u.nickname || u.username)} (${escapeHTML(u.username)})</td>
                                <td style="padding: 8px;"><span style="color: ${u.role === 'admin' ? '#eab308' : '#58a6ff'}; font-weight: 700;">${u.role}</span></td>
                                <td style="padding: 8px;"><code>${escapeHTML(u.password)}</code></td>
                                <td style="padding: 8px; color: var(--quiz-muted);">${escapeHTML(u.email || '-')}</td>
                                <td style="padding: 8px;">
                                    ${u.username !== 'admin' ? `<button type="button" onclick="deleteAdminUser('${u.username}')" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 0.9rem;" title="Delete User">🗑️ Delete</button>` : '<span style="color: var(--quiz-muted);">Primary Admin</span>'}
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

window.processAdminRequest = async function(requestId, decision) {
    const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!admin || !requestId) return;
    const adminPass = (admin && admin.password) ? admin.password : '456755';

    if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminProcessRequest === 'function') {
        const res = await window.GoogleSheetsAPI.adminProcessRequest(admin.username || 'admin', adminPass, requestId, decision);
        if (res && res.success) {
            alert(`✓ Request ${decision}ed successfully! Notifications sent via Telegram & Email.`);
            loadAdminData();
        } else {
            alert(`❌ Error processing request: ${res ? res.error : 'Unknown error'}`);
        }
    }
};

window.deleteAdminUser = async function(targetUser) {
    const admin = window.AuthSystem ? window.AuthSystem.getCurrentUser() : null;
    if (!admin || !targetUser) return;
    const adminPass = (admin && admin.password) ? admin.password : '456755';

    if (confirm(`Are you sure you want to permanently delete user account '${targetUser}'?`)) {
        if (window.GoogleSheetsAPI && typeof window.GoogleSheetsAPI.adminDeleteUser === 'function') {
            const res = await window.GoogleSheetsAPI.adminDeleteUser(admin.username || 'admin', adminPass, targetUser);
            if (res && res.success) {
                alert(`✓ User '${targetUser}' deleted successfully.`);
                loadAdminUsers();
            } else {
                alert(`❌ Error deleting user: ${res ? res.error : 'Unknown error'}`);
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
        initPlaylistPickerModalHandlers();
    }, 500);
});

