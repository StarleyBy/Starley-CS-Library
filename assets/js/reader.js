// assets/js/reader.js

const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

/**
 * Загрузка главы
 */
async function loadChapter(bookPath, chapterId) {
    const contentArea = document.getElementById('content-area');
    
    try {
        const url = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}.md`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        
        let markdown = await response.text();

        // Обработка кастомных стилей
        // [[термин]] -> овал
        markdown = markdown.replace(/\[\[(.*?)\]\]/g, '<span class="medical-oval">$1</span>');
        // !!важное!! -> красный текст
        markdown = markdown.replace(/!!(.*?)!!/g, '<span class="text-red">$1</span>');

        // Рендерим Markdown
        if (typeof marked !== 'undefined') {
            contentArea.innerHTML = marked.parse(markdown);
        } else {
            contentArea.innerHTML = '<pre>' + markdown + '</pre>';
        }

        // КОРРЕКЦИЯ ПУТЕЙ ИЗОБРАЖЕНИЙ
        fixImagePaths(bookPath, chapterId);

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Reader Error:', error);
        contentArea.innerHTML = `<div class="error">Не удалось загрузить главу: ${error.message}</div>`;
    }
}

/**
 * Функция исправления путей картинок
 * Перенаправляет запросы из корня главы в папку /images/
 */
function fixImagePaths(bookPath, chapterId) {
    const images = document.querySelectorAll('#content-area img');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        
        // Если путь не начинается с http, значит он локальный
        if (src && !src.startsWith('http')) {
            // Извлекаем только имя файла (например, _page_15_Picture_2.jpeg)
            // Убираем лишние точки и слеши в начале, если они есть
            const fileName = src.split('/').pop(); 
            
            // Собираем правильный путь к GitHub с папкой images
            const newSrc = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/images/${fileName}`;
            
            console.log(`Исправляем путь изображения: ${newSrc}`);
            img.src = newSrc;
            
            // Стили для красоты
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '1rem auto';
            
            // Обработка ошибки, если файла нет и в папке images
            img.onerror = () => {
                console.error(`Файл не найден даже в /images/: ${fileName}`);
                img.alt = `Ошибка: ${fileName} отсутствует в репозитории`;
                img.style.border = '1px solid #ff0000';
            };
        }
    });
}
