/**
 * Starley CS Library - Quiz i18n Localization Layer
 * Supports seamless bilingual switching (EN / RU) with zero hardcoded UI strings.
 */

(function () {
    const I18N = {
        En: {
            // General & Common
            back: "Back",
            close: "Close",
            save: "Save",
            cancel: "Cancel",
            done: "Done",
            clear: "Clear",
            search: "Search",
            loading: "Loading...",
            all: "All",
            questions: "Questions",
            error: "Error",
            success: "Success",
            warning: "Warning",
            correct: "Correct",
            incorrect: "Incorrect",
            unanswered: "Unanswered",
            skipped: "Skipped",

            // Lobby Header & Nav
            quizTitle: "Starley Clinical Quiz",
            navLibrary: "📚 Library",
            navHighlights: "🔖 Highlights",
            navSearch: "🔍 Search",
            navQuiz: "🧠 Quiz",
            navMagazine: "📰 Magazine",
            navEditor: "✏️ Editor",
            navManifest: "🛠️ Manifest",
            toggleSound: "Toggle Sound & Haptics",
            switchLang: "Switch EN/RU Language",

            // Profile Card
            guestDoctor: "Guest Doctor",
            guestLocal: "👤 Guest (Local)",
            streakDays: "day streak",
            solvedCount: "solved",
            accuracyRate: "accuracy",
            cabinetBtn: "Cabinet",
            adminBtn: "👑 Admin",
            loginBtn: "Sign In",
            logoutBtn: "Sign Out",

            // Radar & Weak Spots
            weakSpotRadar: "📊 Weak-Spot Radar",
            mastered: "Mastered",
            learning: "Learning",
            weakNew: "Weak / New",
            topicMasteryTitle: "Topic Mastery (Tap for Express Quiz)",

            // Source Selector & Search
            selectQuestionSet: "Select Question Set",
            byCollections: "By Collections",
            byDisciplines: "By Disciplines & Topics",
            quickSearch: "🔎 Quick Search",
            searchPlaceholder: "Type to search questions, options, or explanations...",
            searchIndexing: "Indexing quiz sets...",

            // Presets & Settings
            sessionSettings: "Session Settings",
            volumePreset: "Volume Preset",
            questionsCount: "Questions:",
            tierBlitz: "BLITZ",
            tierStandard: "STANDARD",
            tierMaster: "MASTER",
            tierFanatic: "FANATIC",
            tierAll: "ALL QUESTIONS",
            quizMode: "Quiz Mode",
            modeSmart: "Smart Drill",
            modeSmartDesc: "70% weak/new, 30% mastered questions",
            modeWeak: "Weak Spots",
            modeWeakDesc: "Only questions answered incorrectly before",
            modeExam: "Exam Sim",
            modeExamDesc: "Strict timer, no explanations during test",
            modeAllList: "All Questions List",
            shuffleQuestions: "Shuffle Questions",
            startQuizBtn: "🚀 Start Quiz",
            selectTopicPrompt: "Please select at least one topic or set to start",

            // Setup Checklist
            guideTitle: "Quick Setup Guide",
            guideLang: "a) Language selection",
            guideTopics: "b) Select one or more topics",
            guideMode: "c) Select quiz mode",
            guidePreset: "d) Question volume preset",
            guideReady: "All set! Press Start Quiz now!",
            guidePill: "Quiz Guide",

            // Question Screen
            exitBtn: "Exit",
            libraryBtn: "Library",
            refLibrary: "Reference Library",
            openRefLibrary: "Open Reference Library",
            backToQuiz: "Back to Quiz",
            allBooks: "All Books",
            favAdd: "Add to Favorites / Playlist",
            reportIssue: "Report Issue to Admin",
            questionScore: "Correct: ",
            clinicalExplanation: "Clinical Explanation",
            activeRecallCard: "Active Recall Card",
            tapToShowAnswer: "Tap to show answer",
            answer: "Answer",
            rateQuestion: "How was this question?",
            difficultUnsure: "Difficult / Unsure",
            easyConfident: "Easy / Confident",
            nextQuestion: "Next Question",
            skipQuestion: "Skip",
            calculator: "Calculator",
            scratchpad: "Draw / Notes",
            paused: "Paused",
            resume: "Resume",

            // Report Modal
            reportTitle: "Report Question / Admin Feedback",
            reportQMeta: "Question ID:",
            reportType: "Issue Type",
            optAnsDisagree: "Incorrect correct answer / Disagree with answer",
            optTypo: "Typo / Translation error in question",
            optMissingExp: "Unclear or missing clinical explanation",
            optBrokenImg: "Broken image or formatting issue",
            optOther: "Other feedback",
            reportComment: "Your Comment / Clinical Rationale",
            reportCommentPh: "Describe the issue or provide clinical rationale (e.g. According to ESC 2023 guidelines...)...",
            sendFeedback: "Send Feedback",

            // Session Overview / Details Modal
            sessionOverviewTitle: "📜 Test Session Overview",
            breakdownTitle: "Question & Answer Breakdown",
            errorsOnly: "Errors Only",
            allQuestionsFilter: "All Questions",
            retestErrors: "🚀 Retest Incorrect Questions",

            // Playlist Picker Modal
            plPickerTitle: "Add to Question Collection",
            plPickerSubtitle: "Select Question Collection (1-10):",

            // Playlist Editor Modal
            plEditorTitle: "Edit Question Collection",
            plNameLabel: "Collection Name",
            plNamePlaceholder: "Enter collection name...",
            plIconLabel: "Select Icon (1 of 20)",
            plQuestionsLabel: "Questions in collection",
            plAddTitle: "➕ Add question to collection",
            plSelectManifest: "1. Select topic (manifest):",
            plSelectManifestPlaceholder: "-- Select topic / manifest --",
            plSelectQuestion: "2. Select specific question:",
            plSelectQuestionPlaceholder: "-- Select topic above first --",
            plAddBtn: "➕ Add selected question",
            plClearBtn: "🗑️ Clear questions",
            plSaveBtn: "💾 Save",

            // Exit Modal
            exitModalTitle: "Abort Quiz Session?",
            exitModalDesc: "Are you sure you want to abort the current quiz session? Unfinished session progress will not be saved.",
            exitSavePartial: "Save & Finalize Results",
            exitPeekLib: "Open Library (Keep Quiz Active)",
            exitDiscard: "Discard & Return to Library",
            exitLobby: "Return to Lobby",
            exitContinue: "Continue Quiz",

            // RPG Codex & Attributes
            codexTitle: "Atlas of 100 Ranks & Rewards",
            attrTitle: "Clinical Skill Diagnostics",

            // Cabinet Tabs & Labels
            tabOverview: "Overview",
            tabPlaylists: "Playlists",
            tabHistory: "History",
            tabSettings: "Settings",
            cabinetSynced: "🟢 Synced"
        },
        Ru: {
            // General & Common
            back: "Назад",
            close: "Закрыть",
            save: "Сохранить",
            cancel: "Отмена",
            done: "Готово",
            clear: "Очистить",
            search: "Поиск",
            loading: "Загрузка...",
            all: "Все",
            questions: "Вопросы",
            error: "Ошибка",
            success: "Успешно",
            warning: "Предупреждение",
            correct: "Верно",
            incorrect: "Неверно",
            unanswered: "Без ответа",
            skipped: "Пропущено",

            // Lobby Header & Nav
            quizTitle: "Starley Clinical Quiz",
            navLibrary: "📚 Библиотека",
            navHighlights: "🔖 Закладки",
            navSearch: "🔍 Поиск",
            navQuiz: "🧠 Квиз",
            navMagazine: "📰 Журнал",
            navEditor: "✏️ Редактор",
            navManifest: "🛠️ Манифест",
            toggleSound: "Звук и тактильный отклик",
            switchLang: "Сменить язык EN/RU",

            // Profile Card
            guestDoctor: "Врач-ординатор",
            guestLocal: "👤 Гость (Локально)",
            streakDays: "дней ударно",
            solvedCount: "решено",
            accuracyRate: "точность",
            cabinetBtn: "Кабинет",
            adminBtn: "👑 Админ",
            loginBtn: "Войти",
            logoutBtn: "Выйти",

            // Radar & Weak Spots
            weakSpotRadar: "📊 Радар слабых мест",
            mastered: "Освоено",
            learning: "Изучение",
            weakNew: "Слабые / Новые",
            topicMasteryTitle: "Освоение тем (Экспресс-квиз по нажатию)",

            // Source Selector & Search
            selectQuestionSet: "Выбор вопросов",
            byCollections: "По сборникам",
            byDisciplines: "По дисциплинам и темам",
            quickSearch: "🔎 Быстрый поиск",
            searchPlaceholder: "Введите слово для поиска (например, \"аденозин\")...",
            searchIndexing: "Индексация вопросов...",

            // Presets & Settings
            sessionSettings: "Настройки сессии",
            volumePreset: "Количество вопросов",
            questionsCount: "Количество вопросов:",
            tierBlitz: "БЛИЦ",
            tierStandard: "СТАНДАРТ",
            tierMaster: "МАСТЕР",
            tierFanatic: "ФАНАТИК",
            tierAll: "ВСЕ ВОПРОСЫ",
            quizMode: "Режим теста",
            modeSmart: "Умный режим",
            modeSmartDesc: "70% слабых/новых вопросов, 30% закрепленных",
            modeWeak: "Ошибки",
            modeWeakDesc: "Только вопросы, в которых ранее были ошибки",
            modeExam: "Экзамен",
            modeExamDesc: "Таймер, без подсказок во время теста",
            modeAllList: "Все вопросы (список)",
            shuffleQuestions: "Случайный порядок",
            startQuizBtn: "🚀 Начать квиз",
            selectTopicPrompt: "Выберите хотя бы одну тему или сборник для старта",

            // Setup Checklist
            guideTitle: "Быстрый старт",
            guideLang: "a) Выбор языка",
            guideTopics: "b) Выберите одну или несколько тем",
            guideMode: "c) Выберите режим квиза",
            guidePreset: "d) Задайте объём вопросов",
            guideReady: "Всё готово! Нажмите «Начать квиз»!",
            guidePill: "Гайд квиза",

            // Question Screen
            exitBtn: "Выход",
            libraryBtn: "Библиотека",
            refLibrary: "Справочная библиотека",
            openRefLibrary: "Открыть справочную библиотеку",
            backToQuiz: "К квизу",
            allBooks: "Все книги",
            favAdd: "В избранное / Плейлист",
            reportIssue: "Сообщить об ошибке",
            questionScore: "Верно: ",
            clinicalExplanation: "Клиническое объяснение",
            activeRecallCard: "Карточка самопроверки",
            tapToShowAnswer: "Показать ответ",
            answer: "Ответ",
            rateQuestion: "Как вам этот вопрос?",
            difficultUnsure: "Сложно / Не уверен",
            easyConfident: "Легко / Уверен",
            nextQuestion: "Следующий вопрос",
            skipQuestion: "Пропустить",
            calculator: "Калькулятор",
            scratchpad: "Черновик",
            paused: "Пауза",
            resume: "Продолжить",

            // Report Modal
            reportTitle: "Сообщить об ошибке / Отзыв",
            reportQMeta: "ID вопроса:",
            reportType: "Категория проблемы",
            optAnsDisagree: "Неверный правильный ответ / Не согласен",
            optTypo: "Опечатка / Ошибка перевода в вопросе",
            optMissingExp: "Непонятное или отсутствующее объяснение",
            optBrokenImg: "Битая картинка или форматирование",
            optOther: "Другой отзыв",
            reportComment: "Ваш комментарий / Клиническое обоснование",
            reportCommentPh: "Опишите проблему или приведите клиническое обоснование (например, по гайдлайнам ESC 2023...)...",
            sendFeedback: "Отправить отзыв",

            // Session Overview / Details Modal
            sessionOverviewTitle: "📜 Обзор сессии тестирования",
            breakdownTitle: "Детализация вопросов и ответов",
            errorsOnly: "Только ошибки",
            allQuestionsFilter: "Все вопросы",
            retestErrors: "🚀 Повторить вопросы с ошибками",

            // Playlist Picker Modal
            plPickerTitle: "Добавить в сборник вопросов",
            plPickerSubtitle: "Выберите сборник вопросов (1-10):",

            // Playlist Editor Modal
            plEditorTitle: "Редактирование сборника вопросов",
            plNameLabel: "Название сборника",
            plNamePlaceholder: "Введите название...",
            plIconLabel: "Выбор иконки (1 из 20)",
            plQuestionsLabel: "Вопросы в сборнике",
            plAddTitle: "➕ Добавить вопрос в сборник",
            plSelectManifest: "1. Выберите тему (манифест):",
            plSelectManifestPlaceholder: "-- Выберите тему / манифест --",
            plSelectQuestion: "2. Выберите конкретный вопрос:",
            plSelectQuestionPlaceholder: "-- Сначала выберите тему выше --",
            plAddBtn: "➕ Добавить выбранный вопрос",
            plClearBtn: "🗑️ Очистить вопросы",
            plSaveBtn: "💾 Сохранить",

            // Exit Modal
            exitModalTitle: "Прервать сессию квиза?",
            exitModalDesc: "Вы действительно хотите прервать текущую тренировку? Прогресс незавершённой сессии не будет сохранён.",
            exitSavePartial: "Сохранить и подвести итоги",
            exitPeekLib: "Открыть библиотеку (без сброса сессии)",
            exitDiscard: "Прервать без сохранения (в библиотеку)",
            exitLobby: "В меню квизов (Лобби)",
            exitContinue: "Продолжить тест",

            // RPG Codex & Attributes
            codexTitle: "Атлас 100 рангов и наград",
            attrTitle: "Диагностика клинического навыка",

            // Cabinet Tabs & Labels
            tabOverview: "Обзор",
            tabPlaylists: "Сборники",
            tabHistory: "История",
            tabSettings: "Настройки",
            cabinetSynced: "🟢 Синхронизировано"
        }
    };

    // SVG Flag Icons for bulletproof rendering across Windows, macOS, Android, iOS
    const SVG_FLAGS = {
        En: `<svg viewBox="0 0 60 30" width="18" height="12" style="border-radius:2px;vertical-align:middle;flex-shrink:0;box-shadow:0 0 1px rgba(0,0,0,0.5);" aria-hidden="true"><clipPath id="uk-flag-clip"><rect width="60" height="30" rx="2" ry="2"/></clipPath><g clip-path="url(#uk-flag-clip)"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M0,30 L60,0" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M0,30 L60,0" stroke="#C8102E" stroke-width="2"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/><path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" stroke-width="6"/></g></svg>`,
        Ru: `<svg viewBox="0 0 60 30" width="18" height="12" style="border-radius:2px;vertical-align:middle;flex-shrink:0;box-shadow:0 0 1px rgba(0,0,0,0.5);" aria-hidden="true"><clipPath id="ru-flag-clip"><rect width="60" height="30" rx="2" ry="2"/></clipPath><g clip-path="url(#ru-flag-clip)"><rect width="60" height="10" fill="#fff"/><rect y="10" width="60" height="10" fill="#0039a6"/><rect y="20" width="60" height="10" fill="#d52b1e"/></g></svg>`
    };

    function normalizeLang(lang) {
        if (!lang) return 'Ru';
        const l = String(lang).trim().toLowerCase();
        if (l === 'en' || l === 'eng') return 'En';
        return 'Ru';
    }

    function t(key, lang) {
        const activeLang = normalizeLang(lang || (window.state && window.state.settings && window.state.settings.lang) || localStorage.getItem('starley_quiz_lang') || 'Ru');
        const dict = I18N[activeLang] || I18N.Ru;
        if (dict[key] !== undefined) return dict[key];
        if (I18N.En[key] !== undefined) return I18N.En[key];
        return key;
    }

    function applyQuizI18n(targetLang) {
        const lang = normalizeLang(targetLang || (window.state && window.state.settings && window.state.settings.lang) || localStorage.getItem('starley_quiz_lang') || 'Ru');
        document.documentElement.lang = (lang === 'En') ? 'en' : 'ru';

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = t(key, lang);
            if (translation) el.textContent = translation;
        });

        // Update all elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = t(key, lang);
            if (translation) el.title = translation;
        });

        // Update all elements with data-i18n-ph
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            const translation = t(key, lang);
            if (translation) el.placeholder = translation;
        });

        // Update all global-lang-btn elements with unified SVG flags
        document.querySelectorAll('.global-lang-btn').forEach(btn => {
            const flagSvg = SVG_FLAGS[lang];
            btn.innerHTML = `${flagSvg} <span class="txt-lang-code" style="font-weight:800;letter-spacing:0.5px;margin-left:4px;">${lang.toUpperCase()}</span>`;
            btn.title = (lang === 'En') ? 'Switch to Russian' : 'Переключить на английский';
        });

        // Notify subscribers
        window.dispatchEvent(new CustomEvent('starley:langchange', { detail: { lang } }));
    }

    window.StarleyQuizI18N = I18N;
    window.StarleyQuizFlags = SVG_FLAGS;
    window.tQuiz = t;
    window.applyQuizI18n = applyQuizI18n;
    window.normalizeLang = normalizeLang;
})();
