document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');
    const startCardId = params.get('card');

    if (!bookPath) {
        alert('No book specified');
        window.location.href = 'index.html';
        return;
    }

    const loader = document.getElementById('mag-loader');
    const container = document.getElementById('mag-slides-container');
    const bookTitleEl = document.getElementById('mag-book-title');
    const bookSubtitleEl = document.getElementById('mag-book-subtitle');
    const progressEl = document.getElementById('mag-progress');
    const overlay = document.getElementById('mag-caption-overlay');
    
    let magazineData = null;
    let swiper = null;

    try {
        const fullDataUrl = `${bookPath}/magazine.json`;
        console.log('[Magazine] Fetching data from:', fullDataUrl);
        
        const response = await fetch(fullDataUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        magazineData = await response.json();
        console.log('[Magazine] Data loaded:', magazineData);

        if (!magazineData.cards || magazineData.cards.length === 0) {
            throw new Error('No cards found in magazine.json');
        }

        // Setup titles
        bookTitleEl.textContent = magazineData.title || 'Visual Magazine';
        bookSubtitleEl.textContent = magazineData.subtitle || '';

        // Render slides
        magazineData.cards.forEach((card, index) => {
            const imgSrc = `${bookPath}/${card.src}`;
            console.log(`[Magazine] Card ${index} image src:`, imgSrc);
            
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img data-src="${imgSrc}" class="swiper-lazy mag-card-image" alt="${card.caption || ''}">
                <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
            `;
            container.appendChild(slide);
        });

        console.log('[Magazine] Initializing Swiper...');
        swiper = new Swiper('.swiper', {
            loop: false,
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 2
            },
            keyboard: {
                enabled: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function() {
                    updateUI(this);
                    loader.style.display = 'none';
                },
                slideChange: function() {
                    updateUI(this);
                }
            }
        });

        // Handle Back Button
        document.getElementById('btn-back-to-reader').addEventListener('click', () => {
            window.history.back();
        });

        // Tap to show caption
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mag-btn, .swiper-button-next, .swiper-button-prev')) return;
            overlay.classList.toggle('visible');
        });

        // Keyboard ESC to go back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.history.back();
        });

    } catch (error) {
        console.error(error);
        loader.innerHTML = `<div style="color:white; text-align:center;">
            <h2>Oops!</h2>
            <p>${error.message}</p>
            <button class="mag-btn" onclick="window.history.back()">Go Back</button>
        </div>`;
    }

    function updateUI(s) {
        const index = s.activeIndex;
        const total = magazineData.cards.length;
        progressEl.textContent = `${index + 1} / ${total}`;

        const card = magazineData.cards[index];
        document.getElementById('mag-card-title').textContent = card.caption || '';
        
        const chapterEl = document.getElementById('mag-card-chapter');
        if (Array.isArray(card.chapter)) {
            chapterEl.textContent = (card.chapter.length > 1 ? 'Chapters: ' : 'Chapter: ') + card.chapter.join(', ');
        } else {
            chapterEl.textContent = card.chapter || '';
        }
        
        const tagsContainer = document.getElementById('mag-card-tags');
        tagsContainer.innerHTML = '';
        if (card.tags) {
            card.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'mag-tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
        }
    }
});
