async function loadChapter(bookPath, chapterId, edition) {
    const area = document.getElementById('content-area');
    try {
        let suffix = edition === 'starley' ? '-starley' : '';
        // Russian Edition тоже грузит оригинал, перевод делает Google поверх HTML
        const url = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        const res = await fetch(url);
        if(!res.ok) throw new Error("Файл не найден");
        let md = await res.text();

        // Применяем медицинские стили (Regex)
        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        
        area.innerHTML = marked.parse(md);

        // Исправляем картинки (теперь ищем в папке /images главы)
        document.querySelectorAll('#content-area img').forEach(img => {
            const src = img.getAttribute('src');
            img.src = `${GITHUB_RAW}${bookPath}/chapters/${chapterId}/images/${src}`;
            img.classList.add('med-img');
        });

    } catch (e) { area.innerHTML = `Error: ${e.message}`; }
}
