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
        return { state: 'red', consecutiveCorrect: 0 };
    }
    try {
        return JSON.parse(stored);
    } catch (e) {
        return { state: 'red', consecutiveCorrect: 0 };
    }
}

function saveQuestionMastery(q, mastery) {
    const key = getQuestionKey(q);
    localStorage.setItem(key, JSON.stringify(mastery));
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

    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
        startBtn.disabled = state.selectedSets.length === 0;
    }
    
    // Update Spaced Repetition Radar / Mastery dashboard on selected sets change
    updateWeakSpotRadar();
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

        // Localize segmented button text and tooltips
        const btnSmartTitle = document.getElementById('btn-mode-smart').querySelector('.mode-title');
        if (btnSmartTitle) btnSmartTitle.textContent = isRu ? 'Умный режим' : 'Smart Drill';
        document.getElementById('btn-mode-smart').title = isRu ? '70% слабых/новых вопросов, 30% закрепленных' : '70% weak/new, 30% mastered questions';

        const btnWeakTitle = document.getElementById('btn-mode-weak').querySelector('.mode-title');
        if (btnWeakTitle) btnWeakTitle.textContent = isRu ? 'Ошибки' : 'Weak Spots';
        document.getElementById('btn-mode-weak').title = isRu ? 'Только вопросы, в которых были ошибки' : 'Only questions answered incorrectly before';

        const btnExamTitle = document.getElementById('btn-mode-exam').querySelector('.mode-title');
        if (btnExamTitle) btnExamTitle.textContent = isRu ? 'Экзамен' : 'Exam Sim';
        document.getElementById('btn-mode-exam').title = isRu ? 'Таймер, без подсказок во время теста' : 'Timer, no explanations during the test';

        const confidenceLabel = document.getElementById('confidence-label');
        if (confidenceLabel) confidenceLabel.textContent = isRu ? 'Как вам этот вопрос?' : 'How was this question?';

        const lblUnsure = document.getElementById('lbl-unsure');
        if (lblUnsure) lblUnsure.textContent = isRu ? 'Сложно / Не уверен' : 'Difficult / Unsure';

        const lblEasy = document.getElementById('lbl-easy');
        if (lblEasy) lblEasy.textContent = isRu ? 'Легко / Знаю' : 'Easy / Know';

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
                    
                    questions.forEach(q => {
                        q.bookPath = set.bookPath;
                        q.meta = data.meta;
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
                const poolA = []; // Red & Yellow
                const poolB = []; // Green

                flatQuestions.forEach(q => {
                    const mastery = getQuestionMastery(q);
                    if (mastery.state === 'green') {
                        poolB.push(q);
                    } else {
                        poolA.push(q);
                    }
                });

                const targetA = Math.round(0.7 * totalRequested);
                const targetB = totalRequested - targetA;

                const shuffledA = shuffleArray([...poolA]);
                const shuffledB = shuffleArray([...poolB]);

                let selectedA = [];
                let selectedB = [];

                if (shuffledA.length <= targetA) {
                    selectedA = shuffledA;
                    const remainder = totalRequested - selectedA.length;
                    selectedB = shuffledB.slice(0, remainder);
                } else if (shuffledB.length <= targetB) {
                    selectedB = shuffledB;
                    const remainder = totalRequested - selectedB.length;
                    selectedA = shuffledA.slice(0, remainder);
                } else {
                    selectedA = shuffledA.slice(0, targetA);
                    selectedB = shuffledB.slice(0, targetB);
                }

                finalQuestions = selectedA.concat(selectedB);
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
}

function showResults() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    state.activeTopicFilter = null; // Reset Express quiz filter
    
    switchScreen('screen-results');
    const isRu = state.settings.lang === 'Ru';
    
    const pct = Math.round((state.score / state.questions.length) * 100);
    document.getElementById('res-score-big').textContent = `${pct}%`;
    document.getElementById('res-score-raw').textContent = `${state.score} / ${state.questions.length} ` + (isRu ? 'Верно' : 'Correct');
    
    const totalTime = Math.round((Date.now() - state.startTime) / 1000);
    const m = Math.floor(totalTime / 60);
    const s = totalTime % 60;
    document.getElementById('res-time').textContent = `${m}m ${s}s`;
    
    const avg = Math.round(totalTime / state.questions.length);
    document.getElementById('res-avg-time').textContent = `${avg}s`;

    let grade = isRu ? 'Нужно подтянуть' : 'Needs Work';
    let trophy = '🔭';
    if (pct >= 90) { grade = isRu ? 'Отлично!' : 'Excellent!'; trophy = '🏆'; }
    else if (pct >= 75) { grade = isRu ? 'Хороший результат!' : 'Great Job!'; trophy = '🌟'; }
    else if (pct >= 60) { grade = isRu ? 'Зачтено' : 'Passed'; trophy = '✅'; }
    
    document.getElementById('res-grade').textContent = grade;
    document.getElementById('res-trophy').textContent = trophy;

    renderIncorrectAnswers();
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
    document.getElementById(id).classList.add('active');
}

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
