// assets/js/reader.js

const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

async function loadChapter(bookPath, chapterId, editionId = 'original') {
    const contentArea = document.getElementById('content-area');
    
    try {
        // Определяем суффикс файла на основе выбранной версии
        let suffix = '';
        if (editionId === 'starley') suffix = '-starley';
        if (editionId === 'diman') suffix = '-diman';

        // Формируем путь: например, .../chapter-01/chapter-01-starley.md
        const url = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Версия "${editionId}" не найдена для этой главы.`);
        
        let markdown = await response.text();

        // Весь ваш парсинг стилей (овалы, блоки и т.д.)
        markdown = applyMedicalStyles(markdown);

        contentArea.innerHTML = marked.parse(markdown);
        fixImagePaths(bookPath, chapterId);

    } catch (error) {
        contentArea.innerHTML = `<div class="error-box"><h3>Упс!</h3><p>${error.message}</p></div>`;
    }
}

function applyMedicalStyles(md) {
    return md
        .replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>')
        .replace(/!!(.*?)!!/g, '<span class="text-red">$1</span>');
    // Сюда добавь все остальные замены для блоков
}
