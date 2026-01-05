// assets/js/reader.js

// Базовый путь к вашему репозиторию на GitHub
const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';

/**
 * Основная функция загрузки содержимого главы
 * @param {string} bookPath - Путь к книге (например, 'books/icu/bojar')
 * @param {string} chapterId - ID главы (например, 'chapter-01')
 */
async function loadChapter(bookPath, chapterId) {
    const contentArea = document.getElementById('content-area');
    
    try {
        // Формируем прямой URL к .md файлу на GitHub
        const url = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}.md`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить файл главы (HTTP ${response.status})`);
        }
        
        let markdown = await response.text();

        // 1. ОБРАБОТКА КАСТОМНЫХ МАРКЕРОВ (Стилизация)
        // [[текст]] -> Медицинский овал (стили прописаны в styles.css)
        markdown = markdown.replace(/\[\[(.*?)\]\]/g, '<span class="medical-oval">$1</span>');
        
        // !!текст!! -> Красный текст (важные предупреждения)
        markdown = markdown.replace(/!!(.*?)!!/g, '<span class="text-red">$1</span>');

        // 2. РЕНДЕРИНГ MARKDOWN В HTML
        // Используем библиотеку marked.js, которая подключена в reader.html
        if (typeof marked !== 'undefined') {
            contentArea.innerHTML = marked.parse(markdown);
        } else {
            console.error('Библиотека marked.js не загружена');
            contentArea.innerHTML = '<pre>' + markdown + '</pre>';
        }

        // 3. КОРРЕКЦИЯ ПУТЕЙ К ИЗОБРАЖЕНИЯМ
        // Перенаправляем все картинки в подпапку /images/
        fixImagePaths(bookPath, chapterId);

        // 4. ЗАВЕРШЕНИЕ
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Ошибка в reader.js:', error);
        contentArea.innerHTML = `
            <div class="error-message" style="color: #721c24; background: #f8d7da; padding: 20px; border-radius: 8px;">
                <h2>Ошибка загрузки текста</h2>
                <p>${error.message}</p>
                <small>Путь: ${bookPath}/chapters/${chapterId}/</small>
            </div>`;
    }
}

/**
 * Исправляет пути к изображениям, добавляя подпапку /images/
 */
function fixImagePaths(bookPath, chapterId) {
    const images = document.querySelectorAll('#content-area img');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        
        if (src && !src.startsWith('http')) {
            // Извлекаем только имя файла (например, _page_11_Picture_6.jpeg)
            const fileName = src.split('/').pop(); 
            
            // Собираем правильный путь с учетом вашей структуры /images/
            const newSrc = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/images/${fileName}`;
            
            img.src = newSrc;
            img.style.maxWidth = '100%'; // Чтобы картинки не вылезали за края
            img.classList.add('medical-illustration');
            img.setAttribute('loading', 'lazy');
            
            // Если картинка всё равно не найдена
            img.onerror = () => {
                console.warn(`Изображение не найдено в /images/: ${fileName}`);
                img.style.border = '1px dashed red';
                img.alt = `Ошибка: файл ${fileName} не найден в папке /images/`;
            };
        }
    });
}
