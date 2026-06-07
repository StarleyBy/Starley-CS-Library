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
        count: 100, // Default to a higher number
        shuffle: true,
        setId: 'full',
        lang: 'En' // 'En' or 'Ru'
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
        const metadataUrl = `${rootPath}${state.bookPath}/metadata.json?v=${Date.now()}`;
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
        setupPreviewModal();

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
        div.onclick = async () => {
            document.querySelectorAll('.set-option').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            state.settings.setId = set.id;
            await updateSliderForActiveSet();
        };
        container.appendChild(div);
    });

    // Initial slider update
    if (sets.length > 0) {
        updateSliderForActiveSet();
    }
}

async function updateSliderForActiveSet() {
    const activeSet = state.bookMeta.quiz_sets.find(s => s.id === state.settings.setId);
    if (!activeSet) return;

    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const quizUrl = `${rootPath}${state.bookPath}/${activeSet.file}?v=${Date.now()}`;
        const res = await fetch(quizUrl);
        const data = await res.json();
        
        const totalQs = data.questions.length;
        const slider = document.getElementById('setting-count');
        const valCount = document.getElementById('val-count');
        
        slider.max = totalQs;
        slider.value = totalQs;
        state.settings.count = totalQs;
        valCount.textContent = state.settings.lang === 'Ru' ? 'Все' : 'All';
        
    } catch (err) {
        console.error('[Quiz] Failed to pre-load set for slider:', err);
    }
}

function setupLobbyListeners() {
    // Language buttons
    const btnEn = document.getElementById('btn-lang-en');
    const btnRu = document.getElementById('btn-lang-ru');
    
    btnEn.onclick = () => { btnEn.classList.add('active'); btnRu.classList.remove('active'); state.settings.lang = 'En'; };
    btnRu.onclick = () => { btnRu.classList.add('active'); btnEn.classList.remove('active'); state.settings.lang = 'Ru'; };

    // Slider
    const slider = document.getElementById('setting-count');
    const valCount = document.getElementById('val-count');
    
    slider.oninput = () => {
        const val = parseInt(slider.value);
        state.settings.count = val;
        valCount.textContent = (val === 100 || val === parseInt(slider.max)) ? (state.settings.lang === 'Ru' ? 'Все' : 'All') : val;
    };

    document.getElementById('btn-start-quiz').onclick = startQuiz;
}

async function startQuiz() {
    const activeSet = state.bookMeta.quiz_sets.find(s => s.id === state.settings.setId);
    if (!activeSet) return;

    try {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const quizUrl = `${rootPath}${state.bookPath}/${activeSet.file}?v=${Date.now()}`;
        const res = await fetch(quizUrl);
        state.quizData = await res.json();

        let qs = [...state.quizData.questions];
        
        const totalQs = qs.length;
        const slider = document.getElementById('setting-count');
        const valCount = document.getElementById('val-count');
        slider.max = totalQs;
        if (state.settings.count > totalQs) state.settings.count = totalQs;
        if (slider.value > totalQs) slider.value = totalQs;
        valCount.textContent = (parseInt(slider.value) >= totalQs) ? (state.settings.lang === 'Ru' ? 'Все' : 'All') : slider.value;

        if (document.getElementById('setting-shuffle').checked) {
            qs = shuffleArray(qs);
        }

        const limit = state.settings.count;
        state.questions = qs.slice(0, limit);
        state.currentIndex = 0;
        state.score = 0;
        state.answers = [];
        state.startTime = Date.now();

        const isRu = state.settings.lang === 'Ru';
        document.getElementById('exp-title-text').textContent = isRu ? 'Клиническое объяснение' : 'Clinical Explanation';
        document.getElementById('exp-picker-label').textContent = isRu ? 'Выберите главу для открытия:' : 'Select chapter to open:';
        document.getElementById('btn-open-reader-main').innerHTML = `<i class="fas fa-book-open"></i> ${isRu ? 'В читалку' : 'Open in Reader'}`;

        switchScreen('screen-question');
        renderQuestion();

    } catch (err) {
        alert('Failed to load quiz questions: ' + err.message);
    }
}

function renderQuestion() {
    const q = state.questions[state.currentIndex];
    state.questionStartTime = Date.now();
    const lang = state.settings.lang;

    document.getElementById('q-current').textContent = state.currentIndex + 1;
    document.getElementById('q-total').textContent = state.questions.length;
    document.getElementById('q-progress-fill').style.width = `${((state.currentIndex) / state.questions.length) * 100}%`;
    document.getElementById('q-score-live').textContent = (lang === 'Ru' ? 'Верно: ' : 'Correct: ') + state.score;

    document.getElementById('q-text').innerHTML = q['question' + lang] || q['questionEn'] || q.question || 'Missing question text';
    
    // Handle Question Image
    const imgCont = document.getElementById('q-image-container');
    if (q.image) {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const imgSrc = q.image.startsWith('http') ? q.image : `${rootPath}${state.bookPath}/quiz/images/${q.image}`;
        imgCont.innerHTML = `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')">`;
        imgCont.style.display = 'block';
    } else {
        imgCont.innerHTML = '';
        imgCont.style.display = 'none';
    }

    const optionsCont = document.getElementById('q-options');
    optionsCont.innerHTML = '';
    
    const options = q['options' + lang] || q['optionsEn'] || q.options || {};
    
    Object.entries(options).forEach(([letter, text]) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${text}</span>`;
        btn.onclick = () => selectAnswer(letter, btn);
        optionsCont.appendChild(btn);
    });

    document.getElementById('q-explanation').style.display = 'none';
    document.getElementById('exp-chapter-select').style.display = 'none';
}

function selectAnswer(letter, btn) {
    const q = state.questions[state.currentIndex];
    const isCorrect = letter === q.correctAnswer;
    
    if (isCorrect) {
        state.score++;
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.querySelector('.option-letter').textContent === q.correctAnswer) {
                b.classList.add('correct');
            }
        });
    }

    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    state.answers.push({
        questionId: q.id,
        chosen: letter,
        correct: q.correctAnswer,
        time: Date.now() - state.questionStartTime
    });

    showExplanation();
}

function getChapterTitle(chapterId) {
    if (!state.bookMeta || !state.bookMeta.chapters) return chapterId.replace('chapter-', 'Chapter ');
    const cleanId = chapterId.replace('.md', '');
    const chapter = state.bookMeta.chapters.find(ch => ch.file.replace('.md', '') === cleanId);
    return chapter ? chapter.title : chapterId.replace('chapter-', 'Chapter ');
}

function showExplanation() {
    const q = state.questions[state.currentIndex];
    const lang = state.settings.lang;
    const expBox = document.getElementById('q-explanation');
    
    // Handle Explanation Image
    const expImgCont = document.getElementById('exp-image-container');
    if (q.explanationImage) {
        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const imgSrc = q.explanationImage.startsWith('http') ? q.explanationImage : `${rootPath}${state.bookPath}/quiz/images/${q.explanationImage}`;
        expImgCont.innerHTML = `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')">`;
        expImgCont.style.display = 'block';
    } else {
        expImgCont.innerHTML = '';
        expImgCont.style.display = 'none';
    }

    document.getElementById('exp-text').innerHTML = q['explanation' + lang] || q['explanationEn'] || q.explanation || 'No explanation provided.';
    expBox.style.display = 'block';
    
    const metaChapters = state.quizData.meta.chapter || [];
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
            btn.textContent = getChapterTitle(ch);
            btn.onclick = () => showChapterPreview(ch);
            pickerGrid.appendChild(btn);
        });
    } else if (chapterList.length === 1) {
        mainReaderBtn.style.display = 'inline-flex';
        picker.style.display = 'none';
        mainReaderBtn.onclick = () => showChapterPreview(chapterList[0]);
    } else {
        mainReaderBtn.style.display = 'none';
        picker.style.display = 'none';
    }

    expBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const nextBtn = document.getElementById('btn-next-q');
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

function showChapterPreview(chapterId) {
    const title = getChapterTitle(chapterId);
    const isRu = state.settings.lang === 'Ru';
    
    document.getElementById('preview-chapter-title').textContent = title;
    document.getElementById('preview-chapter-info').textContent = isRu 
        ? 'Открыть эту главу в полноэкранном режиме чтения?' 
        : 'Open this chapter in full reading mode?';
    
    const confirmBtn = document.getElementById('btn-confirm-read');
    confirmBtn.textContent = isRu ? 'Перейти к чтению' : 'Go to Reader';
    confirmBtn.onclick = () => {
        hideChapterPreview();
        openReader(chapterId);
    };

    const cancelBtn = document.getElementById('btn-cancel-read');
    cancelBtn.textContent = isRu ? 'Отмена' : 'Cancel';

    document.getElementById('chapter-preview-modal').classList.add('active');
}

function hideChapterPreview() {
    document.getElementById('chapter-preview-modal').classList.remove('active');
}

function openReader(chapterId) {
    const lang = state.settings.lang;
    const edition = lang === 'Ru' ? 'russian' : 'original';
    const cleanId = chapterId.replace('.md', '');
    const url = `reader.html?book=${state.bookPath}&chapter=${cleanId}&edition=${edition}`;
    window.open(url, '_blank');
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
        const msg = state.settings.lang === 'Ru' ? 'Выйти из теста? Прогресс будет утерян.' : 'Exit quiz? Progress will be lost.';
        if (confirm(msg)) {
            switchScreen('screen-lobby');
        }
    };
}

function showResults() {
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
