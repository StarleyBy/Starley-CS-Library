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
        
                const renderer = new marked.Renderer();
                renderer.image = (href, title, text) => {
                    let finalHref = href;
                    if (href && !href.startsWith('http')) {
                        finalHref = `${BASE_URL}${bookPath}/chapters/${chapterId}/images/${href}`;
                    }
                    const titleAttr = title ? ` title="${title}"` : '';
                    return `<img src="${finalHref}" alt="${text}"${titleAttr} class="med-img">`;
                };
                
                area.innerHTML = marked.parse(md, { renderer: renderer });
        
                window.scrollTo(0, 0);    } catch (e) {
        area.innerHTML = `<div class="error">Error loading chapter: ${e.message}</div>`;
        console.error("Failed to load chapter:", e);
    }
}
