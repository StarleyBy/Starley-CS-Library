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
        
        // Set the base URL for relative image paths to the chapter's images folder
        marked.setOptions({
            baseUrl: `${BASE_URL}${bookPath}/chapters/${chapterId}/images/`
        });
        
        area.innerHTML = marked.parse(md);
        
        // Use a timeout to ensure the DOM has been updated by the browser
        // after setting innerHTML, before we try to query it.
        setTimeout(() => {
            area.querySelectorAll('img').forEach(img => {
                const rawSrc = img.getAttribute('src');
                if (rawSrc && !rawSrc.startsWith('http')) {
                    // Extract filename from rawSrc to handle cases where it might already contain path
                    const fileName = rawSrc.split('/').pop();
                    
                    // Determine the correct path based on the current chapter and book
                    img.src = `${BASE_URL}${bookPath}/chapters/${chapterId}/images/${fileName}`;
                }
                img.classList.add('med-img');
            });
        }, 0);

        window.scrollTo(0, 0);
    } catch (e) {
        area.innerHTML = `<div class="error">Error loading chapter: ${e.message}</div>`;
        console.error("Failed to load chapter:", e);
    }
}
