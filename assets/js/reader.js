async function loadChapter(bookPath, chapterId, edition) {
    const area = document.getElementById('content-area');
    area.innerHTML = '<p class="loading">Loading content...</p>';

    try {
        // Определяем суффикс файла
        let suffix = '';
        if (edition === 'starley') suffix = '-starley';
        if (edition === 'russian') suffix = '-ru';

        const url = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        const res = await fetch(url);
        
        // Если файла перевода нет, загружаем оригинал
        if (!res.ok && suffix === '-ru') {
            console.warn("Russian version not found, loading original...");
            return loadChapter(bookPath, chapterId, 'original');
        }

        let md = await res.text();

        // Парсинг кастомных стилей
        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        
        area.innerHTML = marked.parse(md);

        // Исправление путей картинок (ищем в папке /images текущей главы)
        area.querySelectorAll('img').forEach(img => {
            const rawSrc = img.getAttribute('src');
            if (!rawSrc.startsWith('http')) {
                const fileName = rawSrc.split('/').pop();
                img.src = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/images/${fileName}`;
            }
            img.classList.add('med-img');
        });

        window.scrollTo(0, 0);
    } catch (e) {
        area.innerHTML = `<div class="error-box">Error loading chapter: ${e.message}</div>`;
    }
}
