const state = {
    bookPath: '',
    bookMeta: null,
    quizData: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    settings: {
        count: 50,
        shuffle: true,
        setId: 'full'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    state.bookPath = params.get('book');

    if (!state.bookPath) {
        alert('No book specified');
        window.location.href = 'index.html';
        return;
    }

    await initQuizApp();
});

async function initQuizApp() {
    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const metadataUrl = `${rootPath}${state.bookPath}/metadata.json`;
        const res = await fetch(metadataUrl);
        const data = await res.json();
        state.bookMeta = data[0];

        if (!state.bookMeta.quiz) {
            throw new Error('This book does not have a quiz configured.');
        }

        document.getElementById('lobby-book-title').textContent = state.bookMeta.title;
        
        renderQuizSets();
        setupLobbyListeners();
        setupQuestionListeners();
        setupResultsListeners();

    } catch (err) {
        console.error('[Quiz] Init error:', err);
        alert(err.message);
    }
}

function renderQuizSets() {
    const container = document.getElementById('quiz-set-list');
    container.innerHTML = '';

    const sets = state.bookMeta.quiz_sets || [];
    sets.forEach(set => {
        const div = document.createElement('div');
        div.className = `set-option ${state.settings.setId === set.id ? 'active' : ''}`;
        div.textContent = set.label;
        div.dataset.id = set.id;
        div.dataset.file = set.file;
        div.onclick = () => {
            document.querySelectorAll('.set-option').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            state.settings.setId = set.id;
        };
        container.appendChild(div);
    });
}

function setupLobbyListeners() {
    const slider = document.getElementById('setting-count');
    const valCount = document.getElementById('val-count');
    slider.oninput = () => {
        state.settings.count = parseInt(slider.value);
        valCount.textContent = state.settings.count === 50 ? 'All' : state.settings.count;
    };

    document.getElementById('btn-start-quiz').onclick = startQuiz;
}

async function startQuiz() {
    const activeSet = state.bookMeta.quiz_sets.find(s => s.id === state.settings.setId);
    if (!activeSet) return;

    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const quizUrl = `${rootPath}${state.bookPath}/${activeSet.file}`;
        const res = await fetch(quizUrl);
        state.quizData = await res.json();

        let qs = [...state.quizData.questions];
        if (document.getElementById('setting-shuffle').checked) {
            qs = shuffleArray(qs);
        }

        const limit = state.settings.count;
        state.questions = qs.slice(0, limit);
        state.currentIndex = 0;
        state.score = 0;
        state.answers = [];
        state.startTime = Date.now();

        switchScreen('screen-question');
        renderQuestion();

    } catch (err) {
        alert('Failed to load quiz questions: ' + err.message);
    }
}

function renderQuestion() {
    const q = state.questions[state.currentIndex];
    state.questionStartTime = Date.now();

    // UI Updates
    document.getElementById('q-current').textContent = state.currentIndex + 1;
    document.getElementById('q-total').textContent = state.questions.length;
    document.getElementById('q-progress-fill').style.width = `${((state.currentIndex) / state.questions.length) * 100}%`;
    document.getElementById('q-score-live').textContent = `Correct: ${state.score}`;

    document.getElementById('q-chapter').textContent = q.chapter || '';
    document.getElementById('q-difficulty').textContent = q.difficulty || '';
    
    const tagsCont = document.getElementById('q-tags');
    tagsCont.innerHTML = '';
    (q.tags || []).forEach(t => {
        const span = document.createElement('span');
        span.className = 'q-tag-item';
        span.textContent = t;
        tagsCont.appendChild(span);
    });

    document.getElementById('q-text').innerHTML = q.question;
    
    const optionsCont = document.getElementById('q-options');
    optionsCont.innerHTML = '';
    
    Object.entries(q.options).forEach(([letter, text]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${text}</span>`;
        btn.onclick = () => selectAnswer(letter, btn);
        optionsCont.appendChild(btn);
    });

    document.getElementById('q-explanation').style.display = 'none';
}

function selectAnswer(letter, btn) {
    const q = state.questions[state.currentIndex];
    const isCorrect = letter === q.correctAnswer;
    
    if (isCorrect) {
        state.score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        // Highlight correct one
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.querySelector('.option-letter').textContent === q.correctAnswer) {
                b.classList.add('correct');
            }
        });
    }

    // Disable all options
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    state.answers.push({
        questionId: q.id,
        chosen: letter,
        correct: q.correctAnswer,
        time: Date.now() - state.questionStartTime
    });

    showExplanation();
}

function showExplanation() {
    const q = state.questions[state.currentIndex];
    const expBox = document.getElementById('q-explanation');
    document.getElementById('exp-text').innerHTML = q.explanation || 'No explanation provided.';
    expBox.style.display = 'block';
    
    // Scroll explanation into view
    expBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const nextBtn = document.getElementById('btn-next-q');
    if (state.currentIndex === state.questions.length - 1) {
        nextBtn.innerHTML = 'See Results <i class="fas fa-flag-checkered"></i>';
    } else {
        nextBtn.innerHTML = 'Next Question <i class="fas fa-chevron-right"></i>';
    }
}

function setupQuestionListeners() {
    document.getElementById('btn-next-q').onclick = () => {
        if (state.currentIndex < state.questions.length - 1) {
            state.currentIndex++;
            renderQuestion();
            document.querySelector('.quiz-screen.active').scrollTo(0,0);
        } else {
            showResults();
        }
    };

    document.getElementById('btn-exit-quiz').onclick = () => {
        if (confirm('Exit quiz? Progress will be lost.')) {
            switchScreen('screen-lobby');
        }
    };

    document.getElementById('btn-open-reader').onclick = () => {
        const q = state.questions[state.currentIndex];
        if (q.chapter) {
            // Assume chapter format is "Chapter X" -> chapter-0X.md
            const num = q.chapter.match(/\d+/);
            if (num) {
                const chFile = `chapter-${num[0].padStart(2, '0')}.md`;
                window.open(`reader.html?book=${state.bookPath}&chapter=${chFile}`, '_blank');
            }
        }
    };
}

function showResults() {
    switchScreen('screen-results');
    
    const pct = Math.round((state.score / state.questions.length) * 100);
    document.getElementById('res-score-big').textContent = `${pct}%`;
    document.getElementById('res-score-raw').textContent = `${state.score} / ${state.questions.length} Correct`;
    
    const totalTime = Math.round((Date.now() - state.startTime) / 1000);
    const m = Math.floor(totalTime / 60);
    const s = totalTime % 60;
    document.getElementById('res-time').textContent = `${m}m ${s}s`;
    
    const avg = Math.round(totalTime / state.questions.length);
    document.getElementById('res-avg-time').textContent = `${avg}s`;

    let grade = 'Needs Work';
    let trophy = '🔭';
    if (pct >= 90) { grade = 'Excellent!'; trophy = '🏆'; }
    else if (pct >= 75) { grade = 'Great Job!'; trophy = '🌟'; }
    else if (pct >= 60) { grade = 'Passed'; trophy = '✅'; }
    
    document.getElementById('res-grade').textContent = grade;
    document.getElementById('res-trophy').textContent = trophy;
}

function setupResultsListeners() {
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

function formulaInsert(tex) {
    // Dummy for KaTeX if needed later, but questions can have HTML
}
