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
    const labelShuffle = document.getElementById('label-setting-shuffle');
    const labelExam = document.getElementById('label-setting-exam');
    
    const updateLobbyLabels = () => {
        const isRu = state.settings.lang === 'Ru';
        if (labelShuffle) labelShuffle.textContent = isRu ? 'Случайный порядок' : 'Shuffle Questions';
        if (labelExam) labelExam.textContent = isRu ? 'Режим экзамена' : 'Exam Mode';
        
        // Update slider value text if it's set to all
        const slider = document.getElementById('setting-count');
        if (slider) {
            const val = parseInt(slider.value);
            const valCount = document.getElementById('val-count');
            if (valCount) {
                valCount.textContent = (val === 100 || val === parseInt(slider.max)) ? (isRu ? 'Все' : 'All') : val;
            }
        }
    };
    
    btnEn.onclick = () => { 
        btnEn.classList.add('active'); 
        btnRu.classList.remove('active'); 
        state.settings.lang = 'En'; 
        updateLobbyLabels();
    };
    btnRu.onclick = () => { 
        btnRu.classList.add('active'); 
        btnEn.classList.remove('active'); 
        state.settings.lang = 'Ru'; 
        updateLobbyLabels();
    };

    // Initial label update
    updateLobbyLabels();

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

        state.settings.exam = document.getElementById('setting-exam').checked;

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

        document.getElementById('exam-errors-section').style.display = 'none';
        switchScreen('screen-question');
        renderQuestion();

    } catch (err) {
        alert('Failed to load quiz questions: ' + err.message);
    }
}

function renderQuestion() {
    const q = state.questions[state.currentIndex];
    state.questionStartTime = Date.now();
    state.currentSelected = []; // Reset selections for new question
    const lang = state.settings.lang;

    document.getElementById('q-current').textContent = state.currentIndex + 1;
    document.getElementById('q-total').textContent = state.questions.length;
    document.getElementById('q-progress-fill').style.width = `${((state.currentIndex) / state.questions.length) * 100}%`;
    
    const liveScoreEl = document.getElementById('q-score-live');
    liveScoreEl.textContent = (lang === 'Ru' ? 'Верно: ' : 'Correct: ') + state.score;
    liveScoreEl.style.display = state.settings.exam ? 'none' : 'block';

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

    // Handle Submit Button
    let submitBtnCont = document.getElementById('q-submit-container');
    if (!submitBtnCont) {
        submitBtnCont = document.createElement('div');
        submitBtnCont.id = 'q-submit-container';
        submitBtnCont.className = 'quiz-submit-container';
        submitBtnCont.innerHTML = `<button id="btn-submit-q" class="btn-submit-q" disabled>
            <i class="fas fa-check-circle"></i> <span>${lang === 'Ru' ? 'Ответить' : 'Submit Answer'}</span>
        </button>`;
        document.getElementById('q-options').after(submitBtnCont);
        document.getElementById('btn-submit-q').onclick = submitAnswer;
    }
    
    submitBtnCont.style.display = q.multiAnswer ? 'flex' : 'none';
    const submitBtn = document.getElementById('btn-submit-q');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = lang === 'Ru' ? 'Ответить' : 'Submit Answer';
}

function selectAnswer(letter, btn) {
    const q = state.questions[state.currentIndex];
    
    if (q.multiAnswer) {
        // Toggle selection
        if (state.currentSelected.includes(letter)) {
            state.currentSelected = state.currentSelected.filter(l => l !== letter);
            btn.classList.remove('selected');
        } else {
            state.currentSelected.push(letter);
            btn.classList.add('selected');
        }
        
        // Update submit button
        const submitBtn = document.getElementById('btn-submit-q');
        if (submitBtn) submitBtn.disabled = state.currentSelected.length === 0;
    } else {
        // Single answer mode
        state.currentSelected = [letter];
        
        if (state.settings.exam) {
            // Highlight selected button immediately in exam mode
            const optionsCont = document.getElementById('q-options');
            const buttons = optionsCont.querySelectorAll('.option-btn');
            buttons.forEach(b => {
                b.disabled = true;
                if (b === btn) {
                    b.classList.add('selected');
                }
            });
        }
        
        submitAnswer();
    }
}

function submitAnswer() {
    const q = state.questions[state.currentIndex];
    const userChoices = [...state.currentSelected].sort();
    const correctChoices = (Array.isArray(q.correctAnswer) ? [...q.correctAnswer] : [q.correctAnswer]).sort();
    
    const isCorrect = JSON.stringify(userChoices) === JSON.stringify(correctChoices);
    
    if (isCorrect) {
        state.score++;
    }

    state.answers.push({
        questionId: q.id,
        chosen: q.multiAnswer ? userChoices : userChoices[0],
        correct: q.correctAnswer,
        time: Date.now() - state.questionStartTime,
        isCorrect: isCorrect
    });

    if (state.settings.exam) {
        // Disable options to prevent multiple clicks
        const optionsCont = document.getElementById('q-options');
        const buttons = optionsCont.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        if (q.multiAnswer) {
            const submitBtnCont = document.getElementById('q-submit-container');
            if (submitBtnCont) submitBtnCont.style.display = 'none';
        }

        // Auto-advance after 250ms
        setTimeout(() => {
            if (state.currentIndex < state.questions.length - 1) {
                state.currentIndex++;
                renderQuestion();
                document.querySelector('.quiz-screen.active').scrollTo(0,0);
            } else {
                showResults();
            }
        }, 250);
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
    expImgCont.innerHTML = ''; // Clear previous

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    
    // Helper to add an image
    const addImg = (src) => {
        const imgSrc = src.startsWith('http') ? src : `${rootPath}${state.bookPath}/quiz/images/${src}`;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'quiz-q-image';
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
        .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    document.getElementById('exp-text').innerHTML = formattedExp;
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
        textDiv.innerHTML = q['question' + state.settings.lang] || q['questionEn'] || q.question || '';
        itemDiv.appendChild(textDiv);

        // Question image (if exists)
        if (q.image) {
            const imgCont = document.createElement('div');
            imgCont.className = 'quiz-image-container';
            const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
            const imgSrc = q.image.startsWith('http') ? q.image : `${rootPath}${state.bookPath}/quiz/images/${q.image}`;
            imgCont.innerHTML = `<img src="${imgSrc}" class="quiz-q-image" onclick="window.open('${imgSrc}', '_blank')">`;
            itemDiv.appendChild(imgCont);
        }

        // Options grid
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'options-grid';

        const options = q['options' + state.settings.lang] || q['optionsEn'] || q.options || {};
        const correctChoices = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const userChoices = Array.isArray(ans.chosen) ? ans.chosen : [ans.chosen];

        Object.entries(options).forEach(([letter, text]) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-letter">${letter}</span> <span class="option-text">${text}</span>`;

            if (correctChoices.includes(letter)) {
                btn.classList.add('correct');
            } else if (userChoices.includes(letter)) {
                btn.classList.add('wrong');
            }
            optionsGrid.appendChild(btn);
        });
        itemDiv.appendChild(optionsGrid);

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

        const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
        const addImg = (src) => {
            const imgSrc = src.startsWith('http') ? src : `${rootPath}${state.bookPath}/quiz/images/${src}`;
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'quiz-q-image';
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
            .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
            .join('');
        expTextDiv.innerHTML = formattedExp;
        expBox.appendChild(expTextDiv);

        // Exp actions (Reader link)
        const expActions = document.createElement('div');
        expActions.className = 'exp-actions';

        const metaChapters = state.quizData.meta.chapter || [];
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
                btn.textContent = getChapterTitle(ch);
                btn.onclick = () => showChapterPreview(ch);
                linksGrid.appendChild(btn);
            });

            pickerDiv.appendChild(linksGrid);
            expBox.appendChild(pickerDiv);
        } else if (chapterList.length === 1) {
            const readBtn = document.createElement('button');
            readBtn.className = 'btn-secondary';
            readBtn.innerHTML = `<i class="fas fa-book-open"></i> ${isRu ? 'В читалку' : 'Open in Reader'}`;
            readBtn.onclick = () => showChapterPreview(chapterList[0]);
            expActions.appendChild(readBtn);
            expBox.appendChild(expActions);
        }

        itemDiv.appendChild(expBox);
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
