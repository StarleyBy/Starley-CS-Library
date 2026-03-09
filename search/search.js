document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');
    let lunrIndex, docStore;

    // Function to handle URL query parameters
    function handleUrlQuery() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            searchInput.value = query;
            performSearch(query);
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
        // If a query was in the URL, perform the search now that the index is loaded
        handleUrlQuery();
    }).catch(error => {
        console.error('Error loading search data:', error);
        resultsContainer.innerHTML = '<p>Ошибка при загрузке данных для поиска.</p>';
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
            resultsContainer.innerHTML = '<p>Поисковый индекс еще не загружен. Пожалуйста, подождите.</p>';
            return;
        }

        resultsContainer.innerHTML = ''; // Clear previous results
        const searchResults = lunrIndex.search(query);
        
        if (searchResults.length > 0) {
            searchResults.forEach(result => {
                const doc = docStore[result.ref];
                if (doc) {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');

                    // Construct the link to reader.html
                    const readerLink = `reader.html?book=${doc.bookId}&chapter=${doc.chapterUrlPath}`;

                    // Display the snippet without highlighting for now, as it's more complex with Lunr's term matching
                    resultItem.innerHTML = `
                        <h3><a href="${readerLink}">${doc.bookTitle} - ${doc.chapterTitle}</a> <small>(Score: ${result.score.toFixed(2)})</small></h3>
                        <p class="snippet">${doc.snippet}</p>
                    `;
                    resultsContainer.appendChild(resultItem);
                }
            });
        } else {
            resultsContainer.innerHTML = '<p>Ничего не найдено.</p>';
        }
    }
});
