
const colors = ['red', 'blue', 'green', 'gold', 'purple', 'orange', 'teal', 'pink', 'indigo', 'lime', 'brown', 'grey'];
const colorValues = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22', '#1abc9c', '#fd79a8', '#6c5ce7', '#badc58', '#a0522d', '#95a5a6'];

// Генерация кнопок выбора цвета
document.addEventListener('DOMContentLoaded', () => {
    const ovalGrid = document.getElementById('oval-colors');
    const markerGrid = document.getElementById('marker-colors');
    
    colors.forEach((name, i) => {
        // Кнопки для овалов
        let dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.backgroundColor = colorValues[i];
        dot.onclick = () => applyStyle('oval', `ov-${name}`);
        ovalGrid.appendChild(dot);
        
        // Кнопки для маркеров
        let mark = document.createElement('div');
        mark.className = 'color-dot';
        mark.style.backgroundColor = colorValues[i];
        mark.style.opacity = '0.4';
        mark.onclick = () => applyStyle('marker', `m-${name}`);
        markerGrid.appendChild(mark);
    });
    
    // Живое превью
    const input = document.getElementById('markdown-input');
    input.addEventListener('input', () => {
        document.getElementById('editor-preview').innerHTML = marked.parse(input.value);
    });
});

function applyStyle(type, className) {
    const area = document.getElementById('markdown-input');
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const text = area.value.substring(start, end);
    
    let wrapped = '';
    if(type === 'oval') wrapped = `<span class="oval ${className}">${text}</span>`;
    if(type === 'marker') wrapped = `<mark class="${className}">${text}</mark>`;
    
    area.setRangeText(wrapped, start, end, 'select');
    area.dispatchEvent(new Event('input')); // Обновить превью
}

function wrapInBlock(type) {
    const area = document.getElementById('markdown-input');
    const text = area.value.substring(area.selectionStart, area.selectionEnd);
    const wrapped = `\n<div class="med-note ${type}">\n${text}\n</div>\n`;
    area.setRangeText(wrapped, area.selectionStart, area.selectionEnd, 'select');
    area.dispatchEvent(new Event('input'));
}

function addDetails() {
    const area = document.getElementById('markdown-input');
    const title = prompt("Введите заголовок блока:", "Подробности");
    const text = area.value.substring(area.selectionStart, area.selectionEnd);
    const wrapped = `\n<details class="med-details">\n<summary>${title}</summary>\n<div class="details-content">\n${text}\n</div>\n</details>\n`;
    area.setRangeText(wrapped, area.selectionStart, area.selectionEnd, 'select');
    area.dispatchEvent(new Event('input'));
}
