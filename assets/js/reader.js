async function loadChapter(bookPath, chapterId, edition) {
    const area = document.getElementById('content-area');
    area.innerHTML = '<p class="loading">Loading content...</p>';

    try {
        let suffix = '';
        if (edition === 'starley') suffix = '-starley';
        if (edition === 'russian') suffix = '-ru';

        let url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}${suffix}.md`;
        
        let response = await fetch(url);
        
        if (!response.ok && suffix === '-ru') {
            console.warn("Russian version not found, falling back to original.");
            url = `${BASE_URL}${bookPath}/chapters/${chapterId}/${chapterId}.md`;
            response = await fetch(url);
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let md = await response.text();

        // Custom styling parser
        md = md.replace(/\[\[(.*?)\]\]/g, '<span class="oval">$1</span>');
        
        area.innerHTML = marked.parse(md);

        // Correct image paths
        area.querySelectorAll('img').forEach(img => {
            const rawSrc = img.getAttribute('src');
            if (rawSrc && !rawSrc.startsWith('http')) {
                // All relative image paths are assumed to be in the 'images' subdirectory of the current chapter
                const correctedSrc = rawSrc.startsWith('images/') ? rawSrc : `images/${rawSrc}`;
                img.src = `${BASE_URL}${bookPath}/chapters/${chapterId}/${correctedSrc}`;
                console.log('Constructed image source:', img.src);
            }
            img.classList.add('med-img');
        });

        window.scrollTo(0, 0);
    } catch (e) {
        area.innerHTML = `<div class="error">Error loading chapter: ${e.message}</div>`;
        console.error("Failed to load chapter:", e);
    }
}
