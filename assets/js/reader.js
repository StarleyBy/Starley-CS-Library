
// assets/js/reader.js

const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

async function loadChapter(bookPath, chapterId) {
    const contentArea = document.getElementById('content-area');
    
    try {
        // 1. Загружаем текст из MD
        const response = await fetch(`${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}.md`);
        let markdown = await response.text();

        // 2. Пре-процессинг: заменяем наши кастомные маркеры на HTML классы
        // Овальное выделение для терминов: [[текст]] -> <span class="medical-oval">текст</span>
        markdown = markdown.replace(/\[\[(.*?)\]\]/g, '<span class="medical-oval">$1</span>');
        
        // Красный текст для алертов: !!текст!! -> <span class="text-red">$1</span>
        markdown = markdown.replace(/!!(.*?)!!/g, '<span class="text-red">$1</span>');

        // 3. Рендерим Markdown в HTML с помощью библиотеки marked
        contentArea.innerHTML = marked.parse(markdown);

        // 4. Настраиваем пути к картинкам (так как в MD они могут быть локальными)
        fixImagePaths(bookPath, chapterId);

    } catch (error) {
        console.error('Ошибка загрузки главы:', error);
        contentArea.innerHTML = '<p class="error">Не удалось загрузить текст главы.</p>';
    }
}

function fixImagePaths(bookPath, chapterId) {
    const images = document.querySelectorAll('#content-area img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (!src.startsWith('http')) {
            // Исправляем путь к картинкам на GitHub Raw
            img.src = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${src}`;
        }
    });
}
