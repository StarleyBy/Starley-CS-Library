# 🧠 План реализации: Режим тестирования (QZ) — Starley CS Library

> Статус: **черновик плана** · Версия 1.0  
> Цель: добавить к книгам интерактивный режим тестирования на основе JSON-манифестов с вопросами MCQ.

---

## 1. Концепция и философия

### 1.1 Что это такое

Режим **QZ (Quiz)** — это самостоятельная страница `quiz.html`, открывающаяся из ридера книги. Вопросы хранятся в JSON-файлах рядом с книгой. Никакого текста из глав — только клиническое тестирование в стиле board exam.

### 1.2 UX-принципы

- **Клинический стиль** — длинные вопросы-виньетки, как в USMLE/MRCS/европейских экзаменах
- **Нет суеты** — один вопрос на экране, полное погружение
- **Мгновенная обратная связь** — при выборе ответа сразу подсвечивается правильный вариант и разворачивается объяснение
- **Статистика** — прогресс, счёт, слабые зоны
- **Офлайн** — работает без интернета (PWA, SW кеш)

---

## 2. Структура файлов

### 2.1 Новые файлы

```
books/
  cardiac-surgery/
    cohn/
      quiz/                       ← папка с тестами книги
        quiz-full.json            ← все вопросы (полный банк)
        quiz-ch01.json            ← вопросы по главе 1
        quiz-ch02.json            ← вопросы по главе 2
        quiz-ch01-ch03.json       ← набор по нескольким главам
        ...
      book.yaml                   ← добавить quiz: true

quiz.html                         ← страница тестирования (корень репо)
assets/
  css/
    quiz.css                      ← стили
  js/
    quiz.js                       ← логика
icons/
  quiz-icon.svg                   ← иконка для edition-picker
```

### 2.2 Формат `quiz-*.json`

```json
{
  "meta": {
    "title": "Cohn: Cardiac Surgery — Full Question Bank",
    "book": "Cardiac Surgery in the Adult, 5th ed.",
    "chapter": null,
    "totalQuestions": 3,
    "difficulty": "board-level",
    "tags": ["CABG", "valve", "aorta", "CPB"]
  },
  "questions": [
    {
      "id": 1,
      "chapter": "Chapter 3",
      "difficulty": "hard",
      "tags": ["CABG", "diabetes", "SYNTAX"],
      "question": "A 65-year-old diabetic patient presents with triple-vessel disease and a SYNTAX score of 28. According to the FREEDOM trial and SYNTAX 5-year data, what is the most appropriate management?",
      "options": {
        "A": "PCI with second-generation drug-eluting stents.",
        "B": "Medical therapy alone (GDMT).",
        "C": "Coronary Artery Bypass Grafting (CABG).",
        "D": "Hybrid revascularization (LITA to LAD + PCI to others)."
      },
      "correctAnswer": "C",
      "explanation": "For diabetic patients with multivessel disease, the FREEDOM trial demonstrated that CABG is superior to PCI in reducing rates of death and MI. For intermediate SYNTAX scores (23–32) in three-vessel disease, CABG yields significantly better long-term outcomes and lower MACCE rates compared to PCI."
    }
  ]
}
```

**Поля `meta`:**

| Поле | Описание |
|---|---|
| `title` | Название набора |
| `book` | Название книги |
| `chapter` | `null` для полного банка, `"Chapter 3"` для частичного |
| `difficulty` | `basic` / `intermediate` / `board-level` |
| `tags` | Теги для фильтрации |

**Поля вопроса:**

| Поле | Описание |
|---|---|
| `id` | Порядковый номер |
| `chapter` | Глава-источник (для фильтрации) |
| `difficulty` | `easy` / `medium` / `hard` |
| `tags` | Массив тегов |
| `question` | Текст вопроса (HTML разрешён) |
| `options` | Объект `{A, B, C, D}` — до 5 вариантов |
| `correctAnswer` | `"A"` / `"B"` / `"C"` / `"D"` |
| `explanation` | Подробное объяснение с клинической аргументацией |

---

## 3. Изменения в существующих файлах

### 3.1 `book.yaml`

```yaml
quiz: true
quiz_sets:
  - id: full
    label: "Full Bank"
    file: quiz/quiz-full.json
  - id: ch01
    label: "Chapter 1"
    file: quiz/quiz-ch01.json
  - id: ch02
    label: "Chapter 2"
    file: quiz/quiz-ch02.json
```

Список `quiz_sets` позволяет динамически строить меню выбора набора вопросов прямо из конфига книги — без хардкода в JS.

### 3.2 `reader.html`

В `#edition-picker` добавить кнопку:

```html
<button class="edition-option edition-quiz" data-edition="quiz">
  🧠 <span class="font-tag">Quiz</span>
</button>
```

### 3.3 `assets/js/reader.js`

```javascript
if (edition === 'quiz') {
  window.location.href = `quiz.html?book=${encodeURIComponent(bookPath)}`;
  return;
}
```

Кнопка отображается только если в `book.yaml` есть `quiz: true`.

### 3.4 `sw.js`

Добавить в precache:
- `quiz.html`
- `assets/css/quiz.css`
- `assets/js/quiz.js`
- `books/*/quiz/*.json` (стратегия `cache-first`)

---

## 4. Страница `quiz.html` — детальный UX

### 4.1 Три экрана приложения

```
┌─────────────────────────┐
│      ЭКРАН 1: ЛОББИ     │  ← выбор набора, настройки, старт
├─────────────────────────┤
│     ЭКРАН 2: ВОПРОС     │  ← основной игровой экран
├─────────────────────────┤
│    ЭКРАН 3: РЕЗУЛЬТАТЫ  │  ← итоги, разбор ошибок, повтор
└─────────────────────────┘
```

---

### 4.2 Экран 1 — Лобби

**Элементы:**
- Название книги + обложка (или цветной градиент)
- Выбор набора вопросов (dropdown или карточки): Full Bank / Chapter 1 / Chapter 2 / ...
- Настройки сессии:
  - **Количество вопросов** (слайдер: 10 / 20 / 50 / Все)
  - **Перемешать** (toggle, default: ON)
  - **Режим**: Обучение (с объяснением сразу) / Экзамен (объяснение только в конце)
  - **Фильтр по сложности**: All / Easy / Medium / Hard
- Кнопка **→ Начать**
- Статистика предыдущих сессий (из localStorage): «Лучший результат: 87% · 23 сессии»

---

### 4.3 Экран 2 — Вопрос (главный экран)

**Структура экрана:**

```
┌────────────────────────────────────────────────┐
│  ← Выход    Вопрос 7 / 20    ████████░░░░  65% │  ← header
├────────────────────────────────────────────────┤
│                                                │
│  [Chapter 3]  [●●○ hard]  [CABG] [diabetes]   │  ← метки
│                                                │
│  A 65-year-old diabetic patient presents       │
│  with triple-vessel disease and a SYNTAX       │  ← ВОПРОС
│  score of 28. According to the FREEDOM         │
│  trial and SYNTAX 5-year data, what is the     │
│  most appropriate management?                  │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  A  PCI with drug-eluting stents         │  │  ← варианты
│  └──────────────────────────────────────────┘  │     ответов
│  ┌──────────────────────────────────────────┐  │
│  │  B  Medical therapy alone (GDMT)         │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  C  Coronary Artery Bypass Grafting      │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  D  Hybrid revascularization             │  │
│  └──────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

**Состояния кнопок ответа:**

| Состояние | Визуал |
|---|---|
| Не выбрано | Нейтральный border, лёгкий hover |
| Выбрано — верно ✓ | Зелёный фон + ✓ + анимация pulse |
| Выбрано — неверно ✗ | Красный фон + ✗, параллельно подсвечивается правильный |
| После ответа: остальные | Серые, disabled |

**Объяснение** (раскрывается после ответа):

```
┌──────────────────────────────────────────────────────┐
│  💡 Explanation                                      │
│                                                      │
│  For diabetic patients with multivessel disease,     │
│  the FREEDOM trial demonstrated that CABG is         │
│  superior to PCI in reducing rates of death and MI…  │
│                                                      │
│  [📖 Open in Reader: Chapter 3]    [→ Next Question] │
└──────────────────────────────────────────────────────┘
```

Кнопка **«Open in Reader»** открывает `reader.html?book=...&chapter=chapter-03-en.md` — прямой переход к источнику.

---

### 4.4 Экран 3 — Результаты

**Верхняя секция — итог:**

```
       🏆
    Score: 17/20
      85% Correct

  ████████████████░░░░  85%

  ⏱ Time: 8m 42s    📊 Avg: 26s/question
```

**Цветовой код результата:**

| % | Оценка | Цвет |
|---|---|---|
| 90–100 | Excellent | Золотой |
| 75–89 | Good | Зелёный |
| 60–74 | Average | Жёлтый |
| < 60 | Needs Work | Красный |

**Разбивка по тегам:**

```
  CABG      ████████████░░░░  75%   6/8
  Valve     ████████████████  100%  4/4
  CPB       ████████░░░░░░░░  50%   4/8
```

**Список ошибок** (accordion, только неправильные):

```
▼ Q7 — SYNTAX / CABG / diabetes
  Ваш ответ: A  ✗
  Правильно:  C  ✓
  [Показать объяснение]
```

**Кнопки:**
- 🔁 **Повторить только ошибки**
- 🔀 **Новая сессия**
- 📖 **Вернуться в ридер**

---

## 5. Анимации и стиль

### 5.1 Цветовая палитра (темная тема, основная)

```css
--quiz-bg:          #0d1117;   /* GitHub dark */
--quiz-surface:     #161b22;
--quiz-card:        #21262d;
--quiz-border:      #30363d;
--quiz-accent:      #58a6ff;   /* синий акцент */
--quiz-correct:     #238636;   /* зелёный */
--quiz-wrong:       #da3633;   /* красный */
--quiz-warning:     #d29922;   /* жёлтый */
--quiz-text:        #e6edf3;
--quiz-muted:       #8b949e;
```

### 5.2 Ключевые анимации

```css
/* Правильный ответ — пульс */
@keyframes correct-pulse {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(35, 134, 54, 0.7); }
  50%  { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(35, 134, 54, 0); }
  100% { transform: scale(1); }
}

/* Неправильный ответ — shake */
@keyframes wrong-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

/* Объяснение — slide up */
@keyframes explanation-slide {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Прогресс-бар — fill */
.progress-fill {
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5.3 Типографика

- Вопрос: `font-size: clamp(1rem, 2.5vw, 1.15rem)` — читаемо на любом экране
- Варианты ответов: чуть меньше, `0.95rem`
- Объяснение: `font-family: 'Source Serif 4'` или `Inter` — академический тон
- Метки тегов: `font-size: 0.72rem`, `letter-spacing: 0.05em`, capslock

---

## 6. Логика и состояние (quiz.js)

### 6.1 Объект состояния сессии

```javascript
const state = {
  book: '',              // путь к книге
  quizSet: '',           // файл набора
  questions: [],         // полный массив (после shuffle)
  currentIndex: 0,
  answers: [],           // { questionId, chosen, correct, timeSpent }
  mode: 'study',         // 'study' | 'exam'
  startTime: null,
  questionStartTime: null,
  stats: {               // загружается/сохраняется из localStorage
    sessions: 0,
    bestScore: 0,
    totalAnswered: 0,
    correctByTag: {}
  }
};
```

### 6.2 Ключевые функции

```javascript
loadQuiz(bookPath, setFile)     // fetch + parse + shuffle
renderQuestion(index)           // рендер вопроса и вариантов
selectAnswer(letter)            // обработка выбора
showExplanation()               // раскрыть explanation
nextQuestion()                  // переход к следующему
showResults()                   // финальный экран
saveStats()                     // сохранить в localStorage
openInReader(chapter)           // переход в ридер к нужной главе
```

### 6.3 Shuffle (Fisher-Yates)

```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
```

Варианты ответов тоже перемешиваются (опционально) — тогда `correctAnswer` хранится как текст, а не буква. Или shuffle отключён (буква остаётся валидной) — решить при реализации. **Рекомендация: не перемешивать варианты** для медицинских MCQ, так как клинически порядок имеет значение.

---

## 7. Интеграция с ридером

### 7.1 URL-схема

```
quiz.html?book=books/cardiac-surgery/cohn
quiz.html?book=books/cardiac-surgery/cohn&set=quiz/quiz-ch01.json
quiz.html?book=books/cardiac-surgery/cohn&set=quiz/quiz-full.json&count=20&mode=exam
```

### 7.2 Связь «объяснение → глава»

В поле `explanation` (или отдельном поле `source_chapter`) можно хранить:

```json
"source": "chapter-03-en.md"
```

Кнопка в объяснении:
```
📖 Open in Reader: Chapter 3
```

Открывает:
```
reader.html?book=books/cardiac-surgery/cohn&chapter=chapter-03-en.md
```

---

## 8. Пошаговый план реализации

### Шаг 1 — JSON-схема (10 мин)
- [ ] Определить финальную схему вопроса (из п. 2.2)
- [ ] Создать `quiz/quiz-sample.json` с 5 тестовыми вопросами для разработки

### Шаг 2 — `quiz.html` — скелет (30 мин)
- [ ] HTML-структура: три экрана (лобби / вопрос / результаты)
- [ ] Базовая навигация между экранами (show/hide)
- [ ] Подключить `quiz.css` и `quiz.js`

### Шаг 3 — `quiz.css` — стиль (45 мин)
- [ ] CSS-переменные (темная/светлая тема)
- [ ] Карточка вопроса
- [ ] Кнопки вариантов + состояния correct/wrong
- [ ] Анимации pulse, shake, slide-up
- [ ] Прогресс-бар
- [ ] Экран результатов
- [ ] Адаптив mobile/desktop

### Шаг 4 — `quiz.js` — логика (60 мин)
- [ ] Чтение URL-параметров
- [ ] Загрузка JSON
- [ ] Объект state, shuffle
- [ ] `renderQuestion()` — полный рендер
- [ ] `selectAnswer()` — анимации + feedback
- [ ] `showExplanation()` — раскрытие
- [ ] `nextQuestion()` с автоскроллом
- [ ] `showResults()` — подсчёт, разбивка по тегам
- [ ] `saveStats()` / `loadStats()` с localStorage
- [ ] `openInReader()` — кнопка в explanation

### Шаг 5 — Лобби (20 мин)
- [ ] Динамическое меню наборов (из `book.yaml`)
- [ ] Слайдер количества вопросов
- [ ] Переключатели режима и сложности
- [ ] Отображение прошлой статистики

### Шаг 6 — Правки `reader.js` + `reader.html`
- [ ] Кнопка 🧠 в edition-picker
- [ ] Условный показ (если `quiz: true`)

### Шаг 7 — `sw.js`
- [ ] Добавить в precache
- [ ] `quiz/*.json` — cache-first

### Шаг 8 — Тестирование
- [ ] Desktop: мышь, клавиатура (1–4 для выбора, Enter для следующего)
- [ ] Mobile: tap, scroll
- [ ] Offline: работа из кеша
- [ ] localStorage: статистика сохраняется/загружается

---

## 9. Клавиатурные сокращения (бонус)

| Клавиша | Действие |
|---|---|
| `1` / `A` | Выбрать вариант A |
| `2` / `B` | Выбрать вариант B |
| `3` / `C` | Выбрать вариант C |
| `4` / `D` | Выбрать вариант D |
| `Space` / `Enter` | Следующий вопрос (после ответа) |
| `Esc` | Пауза / выход |

---

## 10. Будущие расширения (после MVP)

| Функция | Сложность | Ценность |
|---|---|---|
| Интервальное повторение (SRS) — Anki-подобный алгоритм | Высокая | Очень высокая |
| Режим «Match» — сопоставление термин/определение | Средняя | Средняя |
| Экспорт ошибок в PDF | Средняя | Высокая |
| Генерация вопросов из главы через AI (Ollama/Combiner) | Высокая | Очень высокая |
| Многопользовательский режим (battle) | Очень высокая | Средняя |
| Таймер обратного отсчёта (режим exam с давлением) | Низкая | Средняя |
| Статистика по времени (trend: улучшаюсь ли?) | Средняя | Высокая |

---

## 11. Сводная таблица — что и где менять

| Файл | Действие |
|---|---|
| `book.yaml` | Добавить `quiz: true` + `quiz_sets[]` |
| `library.json` | ❌ Не трогать |
| `manifest.json` (PWA) | ❌ Не трогать |
| `reader.html` | Добавить кнопку 🧠 в edition-picker |
| `assets/js/reader.js` | Обработчик клика + проверка `book.yaml` |
| `sw.js` | Добавить `quiz.html`, `quiz.css`, `quiz.js`, `quiz/*.json` |
| `quiz.html` | ✨ Создать |
| `assets/css/quiz.css` | ✨ Создать |
| `assets/js/quiz.js` | ✨ Создать |
| `books/<book>/quiz/*.json` | ✨ Создать (наполнение) |

---

*Как только план одобрен — реализуем, начав с `quiz.html` + `quiz.css` + `quiz.js` на тестовых данных.*
