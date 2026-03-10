document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    let lunrIndex, docStore;

    // Modal elements
    const modal = document.getElementById('chapterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const readFullButton = document.getElementById('readFullButton');
    const closeButton = document.querySelector('.close-button');

    // Function to handle URL query parameters
    function handleUrlQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            searchInput.value = query;
            // Wait for the index to load before searching
            if (lunrIndex) {
                performSearch(query);
            }
        }
    }

    // Load the search index and document store
    Promise.all([
        fetch('lunr-index.json').then(res => res.json()),
        fetch('document-store.json').then(res => res.json())
    ]).then(([indexData, storeData]) => {
        lunrIndex = lunr.Index.load(indexData);
        docStore = storeData;
        console.log('Lunr index and document store loaded successfully.');
        handleUrlQuery();
    }).catch(error => {
        console.error('Error loading search data:', error);
        resultsContainer.innerHTML = '<p>Error loading search data.</p>';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        }
    });

    function performSearch(query) {
        if (!lunrIndex || !docStore) {
            resultsContainer.innerHTML = '<p>Search index is not loaded yet. Please wait.</p>';
            return;
        }

        resultsContainer.innerHTML = '';
        const searchResults = lunrIndex.search(query);
        
        if (searchResults.length > 0) {
            searchResults.forEach(result => {
                const doc = docStore[result.ref];
                if (doc) {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.dataset.bookId = doc.bookId;
                    resultItem.dataset.chapterId = doc.chapterId;
                    resultItem.dataset.edition = doc.edition;
                    resultItem.dataset.bookTitle = doc.bookTitle;
                    resultItem.dataset.chapterTitle = doc.chapterTitle;

                    resultItem.innerHTML = `
                        <h3 class="result-title">${doc.bookTitle} - ${doc.chapterTitle}</a> <small>(Score: ${result.score.toFixed(2)})</small></h3>
                        <p class="snippet">${doc.snippet}</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                }
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }

    // --- Modal Logic ---

    // Open modal when a result is clicked
    resultsContainer.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.result-item');
        if (resultItem) {
            const query = searchInput.value.trim();
            openModal(resultItem.dataset, query);
        }
    });

    function openModal(data, query) {
        modalTitle.textContent = `${data.bookTitle} - ${data.chapterTitle}`;
        modalBody.innerHTML = '<p>Loading...</p>';
        
        const readerLink = `../reader.html?book=${data.bookId}&chapter=${data.chapterId}&edition=${data.edition}`;
        readFullButton.href = readerLink;
        
        const markdownPath = `../${data.bookId}/chapters/${data.chapterId}/${data.chapterId}.md`;

        fetch(markdownPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                let highlightedText = text;
                if (query) {
                    // Use a regex to find all occurrences of the query, case-insensitively
                    const regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
                    highlightedText = text.replace(regex, match => `<mark>${match}</mark>`);
                }
                modalBody.innerHTML = marked.parse(highlightedText);
            })
            .catch(error => {
                modalBody.innerHTML = `<p>Could not load chapter content. Please try opening it in full mode.</p><p><small>Error: ${error.message}</small></p>`;
                console.error('Error fetching chapter content:', error);
            });

        modal.style.display = 'block';
    }

    // Close modal logic
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
