# План реализации эффекта книжных полок с обложками

## Описание задачи
Необходимо добавить к каждой книге на главной странице обложку (в виде изображения) и реализовать эффект книжных полок: видимые с торца книги с названием, при выборе - поворот к обложке.

## Текущая ситуация
- В приложении отображаются книги только с названием и авторами
- У книг есть изображения в главах, но нет обложек как отдельного элемента
- Карточки книг представляют собой простые прямоугольники без визуальных эффектов

## Предлагаемое решение
Реализовать 3D-эффект книжной полки, где:
- При обычном состоянии виден "торец" книги с названием (эффект книжной полки)
- При наведении курсора книга поворачивается, показывая обложку
- Обложка может быть указана в метаданных книги или выбрана автоматически

## Техническая реализация

### 1. Модификация метаданных книг
Добавить в каждый файл `metadata.json` поле `cover_image`:
```json
{
  "title": "Название книги",
  "cover_image": "cover.jpg",  // <-- новое поле
  "authors": [...],
  ...
}
```

### 2. HTML-структура для 3D-книги
Изменить функцию `renderBookCard` в `assets/js/app.js` для генерации следующей структуры:
```html
<div class="book-card-3d" data-book-path="${bookPath}" data-first-chapter="${firstChapter}">
  <div class="book-container">
    <div class="book-front">
      <div class="book-spine">
        <div class="book-title-vert">${bookMeta.title}</div>
      </div>
    </div>
    <div class="book-back">
      <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img" />
      <div class="book-info-overlay">
        <h3 class="book-title">${bookMeta.title}</h3>
        <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
      </div>
    </div>
  </div>
</div>
```

### 3. CSS-стили для 3D-эффекта
Добавить в `assets/css/styles.css`:
```css
.book-card-3d {
  perspective: 1500px;
  width: 40px;
  height: 200px;
  margin: 20px auto;
  cursor: pointer;
}

.book-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.85, 0.32, 1.275);
}

.book-card-3d:hover .book-container {
  transform: rotateY(180deg);
}

.book-front, .book-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.book-front {
  background: linear-gradient(90deg, #8B4513, #A0522D, #8B4513);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.book-spine {
  transform: rotate(90deg);
  text-align: center;
  width: 200px;
  height: 40px;
}

.book-title-vert {
  font-size: 0.7em;
  color: white;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transform: rotate(180deg);
}

.book-back {
  background: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
}

.book-cover-img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.book-info-overlay {
  padding: 5px;
  text-align: center;
  height: 20%;
}
```

### 4. JavaScript-логика
Обновить функцию `renderBookCard` с обработкой пути к обложке и добавить вспомогательную функцию для получения обложки по умолчанию:

```javascript
function renderBookCard(bookPath, bookMeta) {
    // Определить путь к обложке
    const coverImage = bookMeta.cover_image || getDefaultCoverImage(bookPath);
    const coverImagePath = coverImage ? `${BASE_URL}${bookPath}/${coverImage}` : 'assets/img/book-placeholder.png';
    
    const firstChapter = bookMeta.chapters && bookMeta.chapters.length > 0 ? bookMeta.chapters[0].file.replace('.md', '') : 'chapter-01';
    
    return `
        <div class="book-card-3d" data-book-path="${bookPath}" data-first-chapter="${firstChapter}">
            <div class="book-container">
                <div class="book-front">
                    <div class="book-spine">
                        <div class="book-title-vert">${bookMeta.title}</div>
                    </div>
                </div>
                <div class="book-back">
                    <img src="${coverImagePath}" alt="${bookMeta.title}" class="book-cover-img" 
                         onerror="this.onerror=null; this.src='assets/img/book-placeholder.png';" />
                    <div class="book-info-overlay">
                        <h3 class="book-title">${bookMeta.title}</h3>
                        <p class="book-authors"><i>${(bookMeta.authors || []).join(', ')}</i></p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Функция для получения изображения по умолчанию, если обложка не указана
function getDefaultCoverImage(bookPath) {
    // Логика поиска первого изображения в главах книги
    // Возвращает относительный путь к изображению
    return null; // временно
}
```

Также потребуется обновить функцию `attachBookClickHandlers`, чтобы она работала с новой структурой.

## Преимущества реализации
- Улучшенный визуальный опыт пользователя
- Более реалистичное представление библиотеки (как настоящие книжные полки)
- Возможность быстро распознать книгу по обложке
- Современный 3D-эффект, повышающий привлекательность интерфейса

## Рекомендации по реализации
1. Начать с добавления обложек к нескольким книгам для тестирования
2. Обновить один файл metadata.json, чтобы проверить работу системы
3. Реализовать CSS-стили и протестировать 3D-эффект
4. Обновить JavaScript-логику
5. Распространить изменения на все книги в библиотеке