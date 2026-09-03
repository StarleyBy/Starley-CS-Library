document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Magazine] Script version 1.3 active');
    
    const params = new URLSearchParams(window.location.search);
    const bookPath = params.get('book');

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

    const rootPath = (typeof BASE_URL !== 'undefined') ? BASE_URL : './';
    const fullBookPath = `${rootPath}${bookPath}`;

    try {
        const fullDataUrl = `${fullBookPath}/magazine.json?nocache=${Date.now()}`;
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
        container.innerHTML = '';
        magazineData.cards.forEach((card, index) => {
            const imgSrc = (typeof window.getImageUrl === 'function') 
                ? window.getImageUrl(`${bookPath}/${card.src}`) 
                : `${fullBookPath}/${card.src}`;
            console.log(`[Magazine] Rendering card ${index}:`, imgSrc);
            
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            // Use normal loading for first slide to ensure immediate feedback
            const loadingAttr = index === 0 ? 'eager' : 'lazy';
            slide.innerHTML = `
                <div class="swiper-zoom-container">
                    <img src="${imgSrc}" loading="${loadingAttr}" class="mag-card-image" alt="${card.caption || ''}" 
                         onerror="this.src='assets/img/book-placeholder.png'; console.error('Image load failed:', '${imgSrc}')">
                </div>
            `;
            container.appendChild(slide);
        });

        console.log('[Magazine] Initializing Swiper with Zoom...');
        
        // Wait a bit for DOM injection
        setTimeout(() => {
            try {
                swiper = new Swiper('.swiper', {
                    loop: false,
                    keyboard: true,
                    zoom: {
                        maxRatio: 5,
                        minRatio: 1,
                        toggle: true, // double tap to toggle
                    },
                    mousewheel: {
                        forceToAxis: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        init: function() {
                            console.log('[Magazine] Swiper initialized with Zoom');
                            updateUI(this);
                            loader.style.display = 'none';
                        },
                        slideChange: function() {
                            updateUI(this);
                        },
                        zoomChange: function(s, scale, imageEl, slideEl) {
                            // Hide caption overlay when zoomed in to see more image
                            if (scale > 1.1) {
                                overlay.classList.remove('visible');
                            }
                        }
                    }
                });
            } catch (swiperErr) {
                console.error('[Magazine] Swiper initialization failed:', swiperErr);
                loader.innerHTML = `<div style="color:white; text-align:center;"><h2>Swiper Error</h2><p>${swiperErr.message}</p></div>`;
            }
        }, 100);

        // Handle Back Button
        document.getElementById('btn-back-to-reader').addEventListener('click', () => {
            window.history.back();
        });

        // Handle Contrast Toggle
        const contrastToggleBtn = document.getElementById('mag-contrast-toggle');
        if (contrastToggleBtn) {
            contrastToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                contrastToggleBtn.classList.toggle('active');
                const images = container.querySelectorAll('.mag-card-image');
                images.forEach(img => {
                    img.classList.toggle('contrast-boosted');
                });
            });
        }

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
        console.error('[Magazine] Critical Error:', error);
        loader.innerHTML = `<div style="color:white; text-align:center; padding: 20px;">
            <h2 style="color: #e74c3c">Loading Failed</h2>
            <p>${error.message}</p>
            <button class="mag-btn" style="margin-top:20px" onclick="window.location.reload()">Retry</button>
            <button class="mag-btn" style="margin-top:10px" onclick="window.history.back()">Go Back</button>
        </div>`;
    }

    function updateUI(s) {
        if (!magazineData || !magazineData.cards) return;
        const index = s.activeIndex;
        const total = magazineData.cards.length;
        progressEl.textContent = `${index + 1} / ${total}`;

        const card = magazineData.cards[index];
        if (!card) return;
        
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
