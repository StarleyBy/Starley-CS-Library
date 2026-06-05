# 📰 План реализации: Режим «Журнал» (MZ) — Starley CS Library

> Статус: **черновик плана** · Версия 1.0  
> Цель: добавить к каждой книге режим просмотра инфографических карточек в стиле глянцевого журнала.

---

## 1. Концепция и архитектурные решения

### 1.1 Что такое MZ-версия

«Журнал» — это отдельный тип контента на уровне **книги** (не главы). Он не является ещё одной языковой версией главы, а представляет собой галерею изображений-инфографик, охватывающую всю книгу целиком. Поэтому:

- файл называется **`magazine.json`** (а не `chapter-mz.md`), потому что MD — это текст, а нам нужен список изображений;
- изображения хранятся в папке книги в подпапке **`magazine/`**;
- просмотр открывается в отдельной странице **`magazine.html`** (по аналогии с `reader.html`), а не внутри ридера;
- в `reader.html` добавляется кнопка-иконка 📰 в edition-picker и/или в header — при клике выполняется переход на `magazine.html?book=...`.

### 1.2 Почему не MD-файл

| Вариант | Плюсы | Минусы |
|---|---|---|
| `chapter-mz.md` с `![](img)` | Вписывается в текущую схему | MD-ридер показывает скучный скролл картинок, нет эффекта листания |
| `magazine.json` + `magazine.html` | Полный контроль над UI, CSS-анимации, touch-жесты, lazy-load | Новый файл формата, новая страница |

**Решение: `magazine.json` + `magazine.html`.** Это единственный способ получить настоящий эффект журнала.

---

## 2. Структура файлов

### 2.1 Новые файлы

```
books/
  cardiac-surgery/
    cohn/
      magazine/               ← папка с изображениями
        card-001.jpg
        card-002.jpg
        card-003.png
        ...
      magazine.json           ← манифест журнала книги
      book.yaml               ← (уже существует, нужна правка)

magazine.html                 ← новый просмотрщик журнала (корень репо)
assets/
  css/
    magazine.css              ← стили журнала
  js/
    magazine.js               ← логика журнала
icons/
  mz-icon.svg                 ← иконка журнала для edition-picker
```

### 2.2 Структура `magazine.json`

```json
{
  "title": "Cohn: Cardiac Surgery in the Adult",
  "subtitle": "Visual Magazine",
  "cover": "magazine/cover.jpg",
  "cards": [
    {
      "id": "card-001",
      "src": "magazine/card-001.jpg",
      "caption": "Anatomy of the Aortic Valve",
      "chapter": "Chapter 1",
      "tags": ["anatomy", "valve"]
    },
    {
      "id": "card-002",
      "src": "magazine/card-002.jpg",
      "caption": "Cardiopulmonary Bypass Setup",
      "chapter": "Chapter 3",
      "tags": ["cpb", "perfusion"]
    }
  ]
}
```

**Поля:**
- `cover` — обложка (опционально, может совпадать с `card-001`)
- `cards[].caption` — подпись (отображается при задержке/свайпе вниз)
- `cards[].chapter` — откуда карточка (для фильтра по главам)
- `cards[].tags` — для будущей фильтрации

### 2.3 Правки `book.yaml`

Добавить флаг наличия журнала:

```yaml
magazine: true          # добавить эту строку
```

Это позволит `reader.js` и `index.html` знать, показывать ли кнопку 📰.

---

## 3. Изменения в существующих файлах

### 3.1 `library.json` — без изменений

Структура `library.json` не нуждается в правке, так как журнал — атрибут книги, а не категории. Флаг `"magazine": true` хранится в `book.yaml` книги.

### 3.2 `reader.html` — добавить кнопку

В `#edition-picker` добавить новую кнопку:

```html
<!-- В div#edition-picker -->
<button class="edition-option edition-magazine" data-edition="magazine">
  📰 <span class="font-tag">Magazine</span>
</button>
```

Альтернатива: отдельная иконка в header рядом с другими кнопками.

### 3.3 `assets/js/reader.js` — обработка клика на Magazine

```javascript
// При клике на edition-magazine:
if (edition === 'magazine') {
  const bookPath = getCurrentBookPath(); // уже должно быть доступно
  window.location.href = `magazine.html?book=${encodeURIComponent(bookPath)}`;
  return;
}
```

Также: перед рендером edition-picker — проверять `book.yaml` на наличие `magazine: true`, и только тогда показывать кнопку.

### 3.4 `index.html` — опционально

На карточке книги можно добавить иконку 📰 как прямую ссылку на журнал книги. Это удобно для быстрого доступа без захода в ридер.

### 3.5 `sw.js` (Service Worker)

Добавить в список кешируемых файлов:
- `magazine.html`
- `assets/css/magazine.css`
- `assets/js/magazine.js`

Изображения журнала (`magazine/*.jpg`) — стратегия **cache-first** или **network-first** (зависит от размера; для медицинских карточек рекомендую `cache-first` после первой загрузки).

---

## 4. Новая страница `magazine.html`

### 4.1 UX-концепция

- Полноэкранный просмотр, без обычного текста
- Одна карточка = один «разворот» (как страница журнала)
- Навигация: свайп влево/вправо (touch), стрелки клавиатуры, кнопки на экране
- Эффект перелистывания: CSS `transform: rotateY()` (3D flip) или `translateX` с ease-in-out
- Прогресс: индикатор `3 / 47` в нижней части
- Подпись: появляется при задержке тапа / hover / свайпе вниз
- Кнопка возврата в ридер книги (← назад)
- Thumbnail-стрип снизу (опционально): миниатюры всех карточек

### 4.2 Технический стек

- Vanilla JS + CSS — никаких внешних зависимостей
- `IntersectionObserver` для lazy-load изображений
- CSS `scroll-snap` как запасной вариант (если не хочется JS-анимации)
- Touch: `touchstart` / `touchend` / `touchmove` — вычисление `deltaX`

### 4.3 URL-схема

```
magazine.html?book=books/cardiac-surgery/cohn
magazine.html?book=books/cardiac-surgery/cohn&card=005
```

Параметр `card` — для прямой ссылки на конкретную карточку (из поиска, ридера и т.д.).

---

## 5. Эффект листания журнала — выбор реализации

### Вариант A: CSS Scroll Snap (простой, нативный)

```css
.magazine-track {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
.magazine-page {
  scroll-snap-align: center;
  flex: 0 0 100vw;
  height: 100vh;
}
```

Плюсы: нативная производительность, работает на мобильных.  
Минусы: нет визуального эффекта «страницы».

### Вариант B: JS-анимация с 3D flip (эффектный)

```javascript
// Анимация перелистывания через CSS class toggle
page.classList.add('flipping');
// transform: perspective(1200px) rotateY(-180deg)
```

Плюсы: визуальный wow-эффект.  
Минусы: сложнее, может быть медленным на слабых устройствах.

### Вариант C: Swiper.js (библиотека)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js"></script>
```

Плюсы: готовые эффекты `effect="flip"`, `effect="cards"`, touch из коробки.  
Минусы: внешняя зависимость (~50 KB), но с cdnjs доступен.

**Рекомендация: Вариант C (Swiper.js)** — эффект `cards` или `flip` даст именно ощущение глянцевого журнала, а Swiper доступен на cdnjs.cloudflare.com (уже разрешённый домен).

---

## 6. Пошаговый план реализации

### Шаг 1 — Подготовка структуры (5 мин)
- [ ] Создать папку `books/<category>/<book>/magazine/`
- [ ] Поместить туда тестовые изображения (хотя бы 3–5 штук)
- [ ] Создать `magazine.json` по шаблону из п. 2.2

### Шаг 2 — Правка `book.yaml` (2 мин)
- [ ] Добавить `magazine: true` в `book.yaml` нужной книги

### Шаг 3 — Создать `magazine.html` (основная работа)
- [ ] Базовая HTML-структура (header, slider container, caption, progress)
- [ ] Подключить Swiper.js с cdnjs
- [ ] Чтение параметра `?book=` из URL
- [ ] Загрузка `magazine.json` через fetch
- [ ] Динамический рендер слайдов
- [ ] Кнопка возврата в ридер

### Шаг 4 — Создать `magazine.css`
- [ ] Полноэкранный тёмный/светлый фон
- [ ] Стили карточки: border-radius, box-shadow, object-fit: contain/cover
- [ ] Стили caption: slide-in снизу при hover/tap
- [ ] Прогресс-индикатор
- [ ] Адаптив (portrait/landscape)

### Шаг 5 — Создать `magazine.js`
- [ ] Инициализация Swiper
- [ ] Lazy-load
- [ ] Обработка caption (показ/скрытие)
- [ ] Keyboard navigation
- [ ] Сохранение текущей позиции в `localStorage` (чтобы вернуться)

### Шаг 6 — Правки `reader.html` / `reader.js`
- [ ] Добавить кнопку 📰 в edition-picker
- [ ] Логика: показывать кнопку только если `magazine: true`
- [ ] Обработчик клика → переход на `magazine.html?book=...`

### Шаг 7 — Service Worker
- [ ] Добавить `magazine.html`, `magazine.css`, `magazine.js` в precache
- [ ] Добавить стратегию cache-first для `magazine/*.jpg`

### Шаг 8 — Тестирование
- [ ] Desktop: клавиши ←→, hover на caption
- [ ] Mobile: swipe left/right, tap для caption
- [ ] Возврат к нужной позиции после закрытия
- [ ] Offline: работает ли из кеша

---

## 7. Иконка и интеграция в edition-picker

Текущие кнопки выглядят как `EN`, `RU`, `STL`, `HE`. Для MZ предлагаю:

```html
<button class="edition-option edition-magazine" data-edition="magazine">
  📰 <span class="font-tag">Visual</span>
</button>
```

Или SVG-иконка журнала в стиле остальных иконок проекта.

В коде `reader.js` при рендере edition-picker добавить условную проверку:

```javascript
if (bookMeta.magazine) {
  // добавить кнопку MZ в picker
}
```

---

## 8. Формат файлов — итоговое решение

| Вопрос | Решение |
|---|---|
| Формат манифеста | `magazine.json` (JSON) |
| Формат изображений | JPG/PNG/WebP — без ограничений |
| Страница просмотра | `magazine.html` (новый файл) |
| Именование изображений | `card-001.jpg`, `card-002.jpg`, ... |
| Папка изображений | `books/<cat>/<book>/magazine/` |
| Нужен ли MD-файл? | Нет, не нужен |
| Нужно ли менять `library.json`? | Нет |
| Нужно ли менять `manifest.json` (PWA)? | Нет (это манифест PWA, не книжный) |
| Нужно ли менять `book.yaml`? | Да — добавить `magazine: true` |
| Нужно ли менять `reader.js`? | Да — добавить кнопку и обработчик |
| Нужно ли менять `sw.js`? | Да — добавить кеш для новых файлов |

---

## 9. Приоритеты и что оставить на потом

**MVP (реализуем сейчас):**
- `magazine.json` + папка `magazine/`
- `magazine.html` с Swiper.js
- кнопка в edition-picker

**После MVP (расширения):**
- Фильтр по главам (показывать только карточки из Ch.1)
- Thumbnail-лента прокрутки снизу
- Полноэкранный zoom при двойном тапе
- Кнопка «поделиться карточкой»
- Автоматическое создание `magazine.json` скриптом (добавить в Combiner)

---

*Как только план одобрен — приступаем к реализации по шагам.*
