# План реализации новых инструментов для редактора

## Описание задачи
Необходимо добавить в редактор новый набор инструментов:
1. Размер шрифта: 60%, 75%, 90%, 110%, 125%
2. Заголовки от # до ######

## Техническое решение

### 1. Функции для размера шрифта
Нужно создать функцию, которая будет оборачивать выделенный текст в span с соответствующим значением font-size:

```javascript
function wrapInFontSize(fontSize) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    if(!sel) return alert('Выделите текст!');
    
    const res = `<span style="font-size:${fontSize}%">${sel}</span>`;
    editor.replaceSelection(res);
    updatePreview();
}
```

### 2. Функции для заголовков
Нужно создать функцию, которая будет оборачивать выделенный текст в соответствующий тег заголовка:

```javascript
function wrapInHeader(headerLevel) {
    if (!editor) return;
    
    const sel = editor.getSelection();
    const headerTag = `h${headerLevel}`;
    const res = `\n<${headerTag}>${sel || 'Заголовок'}</${headerTag}>\n`;
    editor.replaceSelection(res);
    updatePreview();
}
```

### 3. HTML элементы для панели инструментов
Добавить новую группу инструментов в editor.html:

```html
<div class="tool-group">
    <h4>🔤 Font Size & Headers</h4>
    <button onclick="wrapInFontSize(60)" style="background: #f8f9fa; color: #495057;">60%</button>
    <button onclick="wrapInFontSize(75)" style="background: #f8f9fa; color: #495057;">75%</button>
    <button onclick="wrapInFontSize(90)" style="background: #f8f9fa; color: #495057;">90%</button>
    <button onclick="wrapInFontSize(110)" style="background: #f8f9fa; color: #495057;">110%</button>
    <button onclick="wrapInFontSize(125)" style="background: #f8f9fa; color: #495057;">125%</button>
    <button onclick="wrapInHeader(1)" style="background: #e9ecef; color: #495057;"># H1</button>
    <button onclick="wrapInHeader(2)" style="background: #e9ecef; color: #495057;">## H2</button>
    <button onclick="wrapInHeader(3)" style="background: #e9ecef; color: #495057;">### H3</button>
    <button onclick="wrapInHeader(4)" style="background: #e9ecef; color: #495057;">#### H4</button>
    <button onclick="wrapInHeader(5)" style="background: #e9ecef; color: #495057;">##### H5</button>
    <button onclick="wrapInHeader(6)" style="background: #e9ecef; color: #495057;">###### H6</button>
</div>
```

### 4. CSS стили
Добавить стили для отображения размеров шрифта в превью, если это необходимо.

## Последовательность реализации
1. Добавить новые функции в editor.js
2. Добавить новую группу инструментов в editor.html
3. При необходимости добавить стили в editor.css
4. Протестировать функциональность