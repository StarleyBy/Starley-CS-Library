// assets/js/reader.js

const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

/**
 * Исправляет пути к изображениям, добавляя подпапку /images/
 */
function fixImagePaths(bookPath, chapterId) {
    const images = document.querySelectorAll('#content-area img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http')) {
            const fileName = src.split('/').pop(); 
            const newSrc = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/images/${fileName}`;
            img.src = newSrc;
            img.style.maxWidth = '100%';
            img.classList.add('medical-illustration');
            img.onerror = () => {
                img.alt = `Ошибка: ${fileName} не найден в /images/`;
                img.style.border = '1px dashed red';
            };
        }
    });
}

/**
 * Применяет кастомные стили (овалы, блоки) к тексту перед рендерингом
 */
function applyMedicalStyles(md) {
    return md
        // [[текст]] -> овал
        .replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>')
        // !!текст!! -> красный
        .replace(/!!(.*?)!!/g, '<span class="text-red">$1</span>');
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ ЗАГРУЗКИ
 */
async function loadChapter(bookPath, chapterId, editionId = 'original') {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    try {
        let suffix = '';
        if (editionId === 'starley') suffix = '-starley';
        if (editionId === 'diman') suffix = '-diman';

        const url = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Файл версии "${editionId}" не найден.`);
        
        let markdown = await response.text();
        
        // Сначала применяем наши метки
        markdown = applyMedicalStyles(markdown);

        // Затем парсим Markdown в HTML
        if (typeof marked !== 'undefined') {
            contentArea.innerHTML = marked.parse(markdown);
        } else {
            contentArea.innerHTML = '<pre>' + markdown + '</pre>';
        }

        // В конце фиксим картинки
        fixImagePaths(bookPath, chapterId);

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Reader Error:', error);
        contentArea.innerHTML = `<div class="error-box"><h3>Упс!</h3><p>${error.message}</p></div>`;
    }
}
