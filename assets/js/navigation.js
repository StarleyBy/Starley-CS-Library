// assets/js/navigation.js

document.addEventListener('DOMContentLoaded', () => {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookPath = urlParams.get('book'); // например, 'icu/bojar'
    const chapterId = urlParams.get('chapter'); // например, 'chapter-01'

    if (bookPath && chapterId) {
        initNavigation(bookPath, chapterId);
    } else {
        console.error('Неверные параметры в URL');
        document.getElementById('content-area').innerHTML = '<h2>Ошибка: Книга не найдена</h2>';
    }
});

async function initNavigation(bookPath, chapterId) {
    const GITHUB_BASE = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';
    const metadataUrl = `${GITHUB_BASE}${bookPath}/chapters/${chapterId}/${chapterId}-metadata.json`;

    try {
        const response = await fetch(metadataUrl);
        const metadata = await response.json();

        // 1. Устанавливаем заголовок книги
        document.getElementById('book-title').textContent = metadata.title || `Глава ${metadata.chapter_number}`;

        // 2. Строим оглавление в сайдбаре
        renderTOC(metadata);

        // 3. Настраиваем кнопки навигации (след/пред глава)
        setupChapterNavigation(metadata, bookPath);

        // 4. Инициализируем загрузку текста (вызываем функцию из reader.js)
        if (typeof loadChapter === 'function') {
            loadChapter(bookPath, chapterId);
        }

    } catch (error) {
        console.error('Ошибка навигации:', error);
        document.getElementById('chapter-list').innerHTML = '<p>Оглавление недоступно</p>';
    }
}

function renderTOC(metadata) {
    const tocContainer = document.getElementById('chapter-list');
    let html = '<ul>';

    // Рендерим разделы из JSON
    metadata.sections.forEach(section => {
        html += `
            <li class="toc-level-${section.level}">
                <a href="#${section.anchor}" class="toc-link">${section.title}</a>
            </li>
        `;
    });

    // Если есть таблицы, добавим их в оглавление
    if (metadata.tables && metadata.tables.length > 0) {
        html += '<li class="toc-divider">Таблицы</li>';
        metadata.tables.forEach(table => {
            html += `<li><a href="#${table.anchor}" class="toc-link table-link">Таблица ${table.id}</a></li>`;
        });
    }

    html += '</ul>';
    tocContainer.innerHTML = html;

    // Добавляем плавный скролл при клике на оглавление
    setupSmoothScroll();
}

function setupSmoothScroll() {
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Закрываем мобильный сайдбар после клика
                if (window.innerWidth < 1024) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
        });
    });
}

function setupChapterNavigation(metadata, bookPath) {
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');

    // Логика переключения: вычисляем номер текущей главы
    const currentNum = parseInt(metadata.chapter_number);
    
    // Предыдущая глава
    if (currentNum > 1) {
        prevBtn.style.display = 'block';
        prevBtn.onclick = () => {
            const prevId = `chapter-${String(currentNum - 1).padStart(2, '0')}`;
            window.location.href = `reader.html?book=${bookPath}&chapter=${prevId}`;
        };
    }

    // Следующая глава (здесь можно добавить проверку на общее кол-во глав из общего конфига книги)
    nextBtn.style.display = 'block';
    nextBtn.onclick = () => {
        const nextId = `chapter-${String(currentNum + 1).padStart(2, '0')}`;
        window.location.href = `reader.html?book=${bookPath}&chapter=${nextId}`;
    };
}

// Управление отображением сайдбара
const tocToggle = document.getElementById('toc-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

if (tocToggle) {
    tocToggle.onclick = () => sidebar.classList.toggle('active');
}
if (sidebarClose) {
    sidebarClose.onclick = () => sidebar.classList.remove('active');
}
