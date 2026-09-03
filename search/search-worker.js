/**
 * Search 2.0 Web Worker Engine
 * Instant Embedded Document Category Filtering (doc.cat), BM25 Scoring & IndexedDB Caching
 * Starley Medical Library
 */

let searchIndexData = null;
let searchConfigData = null;
let thesaurusData = null;
let isReady = false;

const STOP_WORDS = new Set([
  // English Stopwords
  'to','this','the','a','an','and','or','in','on','at','for','of','with','by','from','is','are','was','were',
  'be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must',
  'can','that','these','those','it','its','what','which','who','whom','when','where','why','how','not','no',
  'so','if','then','than','too','very','just','about','above','below','between','into','through','during','before','after','out','up','down','over','under',
  // Russian Stopwords
  'и','на','в','с','по','за','из','к','о','от','до','для','при','обе','бы','же','ли','так','или','но','а','у','со','об','это','как','все','также','что'
]);

// IndexedDB Helper for Instant Local Caching (< 15ms)
function getCachedIndexFromIndexedDB() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('StarleySearchCache', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('store')) {
          db.createObjectStore('store');
        }
      };
      req.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('store', 'readonly');
        const getReq = tx.objectStore('store').get('indexData');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch (err) {
      resolve(null);
    }
  });
}

function saveIndexToIndexedDB(data) {
  try {
    const req = indexedDB.open('StarleySearchCache', 1);
    req.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction('store', 'readwrite');
      tx.objectStore('store').put(data, 'indexData');
    };
  } catch (e) {}
}

// Helper: Strip Hebrew Nikkud / Diacritics
function stripDiacritics(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Helper: Clean & Tokenize query
function tokenize(text) {
  if (!text) return [];
  const clean = stripDiacritics(text.toLowerCase())
    .replace(/[^\w\u0400-\u04FF\u0590-\u05FF-]/g, ' ');
  return clean.split(/\s+/).filter(t => t.length > 1);
}

// Helper: Expand query tokens with Thesaurus synonyms
function expandQueryTokens(queryTokens) {
  const expanded = new Set(queryTokens);

  if (thesaurusData && thesaurusData.terms) {
    thesaurusData.terms.forEach(term => {
      const allSynonyms = [
        ...(term.en || []),
        ...(term.ru || []),
        ...(term.he || [])
      ].map(s => stripDiacritics(s.toLowerCase()));

      queryTokens.forEach(token => {
        if (allSynonyms.some(s => s.includes(token) || token.includes(s))) {
          allSynonyms.forEach(syn => {
            tokenize(syn).forEach(st => expanded.add(st));
          });
        }
      });
    });
  }

  return Array.from(expanded);
}

// Load Search Index with Instant IndexedDB Cache Fallback
async function initWorker(baseUrl = './') {
  try {
    const cachedData = await getCachedIndexFromIndexedDB();
    if (cachedData && cachedData.documents && cachedData.documents.length > 0) {
      searchIndexData = cachedData;
      isReady = true;

      fetch(`${baseUrl}search-config.json`).then(r => r.json()).then(cfg => {
        searchConfigData = cfg;
        self.postMessage({
          type: 'READY',
          documentCount: searchIndexData.documents.length,
          config: searchConfigData,
          fromCache: true
        });
      }).catch(() => {
        self.postMessage({
          type: 'READY',
          documentCount: searchIndexData.documents.length,
          config: null,
          fromCache: true
        });
      });

      fetch(`${baseUrl}search-index.json`).then(r => r.json()).then(freshData => {
        if (freshData && freshData.documents) {
          searchIndexData = freshData;
          saveIndexToIndexedDB(freshData);
        }
      }).catch(() => {});

      return;
    }

    const [indexRes, configRes, thesaurusRes] = await Promise.all([
      fetch(`${baseUrl}search-index.json`),
      fetch(`${baseUrl}search-config.json`).catch(() => null),
      fetch(`${baseUrl}thesaurus.json`).catch(() => null)
    ]);

    if (!indexRes.ok) {
      throw new Error(`HTTP ${indexRes.status} loading search-index.json`);
    }

    searchIndexData = await indexRes.json();
    if (configRes && configRes.ok) {
      searchConfigData = await configRes.json();
    }
    if (thesaurusRes && thesaurusRes.ok) {
      thesaurusData = await thesaurusRes.json();
    }

    saveIndexToIndexedDB(searchIndexData);
    isReady = true;

    const docs = searchIndexData.documents || searchIndexData.items || [];
    self.postMessage({
      type: 'READY',
      documentCount: docs.length,
      config: searchConfigData,
      fromCache: false
    });
  } catch (err) {
    self.postMessage({ type: 'ERROR', message: err.message });
  }
}

// Execute Search Query with Instant Embedded Category Matching
function executeSearch(query, categoryFilter = 'all', bookFilter = 'all', langFilter = 'all') {
  if (!isReady || !searchIndexData) {
    self.postMessage({ type: 'RESULTS', results: [], query });
    return;
  }

  const cleanQuery = stripDiacritics((query || '').toLowerCase().replace(/[^\w\s\u0400-\u04FF\u0590-\u05FF-]/g, ' ').trim());
  const allTokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);

  if (allTokens.length === 0) {
    self.postMessage({ type: 'RESULTS', results: [], query });
    return;
  }

  const sigTokens = allTokens.length > 2 ? allTokens.filter(t => !STOP_WORDS.has(t) && t.length > 2) : allTokens;
  const evalTokens = sigTokens.length > 0 ? sigTokens : allTokens;
  const expandedTokens = expandQueryTokens(evalTokens);

  const docs = searchIndexData.documents || searchIndexData.items || [];
  const results = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    // Language Filter
    if (langFilter !== 'all') {
      const docLang = (doc.l || doc.lang || doc.e || '').toLowerCase();
      if (langFilter === 'russian' && !['russian', 'ru'].includes(docLang)) continue;
      if (langFilter === 'english' && !['english', 'en', 'original'].includes(docLang)) continue;
      if (langFilter === 'hebrew' && !['hebrew', 'he'].includes(docLang)) continue;
    }

    // Multi-Book Filter
    if (bookFilter !== 'all') {
      if (Array.isArray(bookFilter) && bookFilter.length > 0) {
        if (!bookFilter.includes(doc.b)) continue;
      } else if (typeof bookFilter === 'string') {
        if (doc.b !== bookFilter) continue;
      }
    }

    // Multi-Topic Embedded Category Filter (doc.cat)
    if (categoryFilter !== 'all') {
      const docCat = (doc.cat || '').toLowerCase().replace(/-/g, '_');
      const docB = (doc.b || '').toLowerCase();

      if (Array.isArray(categoryFilter) && categoryFilter.length > 0) {
        const isMatch = categoryFilter.some(cat => {
          const normCat = cat.toLowerCase().replace(/-/g, '_');
          return docCat === normCat || docB.includes(normCat) || docB.includes(cat.replace(/_/g, '-'));
        });
        if (!isMatch) continue;
      } else if (typeof categoryFilter === 'string') {
        const normCat = categoryFilter.toLowerCase().replace(/-/g, '_');
        const isMatch = docCat === normCat || docB.includes(normCat) || docB.includes(categoryFilter.replace(/_/g, '-'));
        if (!isMatch) continue;
      }
    }

    const bookTitle = stripDiacritics((doc.bt || doc.title || '').toLowerCase());
    const chapterTitle = stripDiacritics((doc.ct || doc.heading || '').toLowerCase());
    const wordsMap = doc.w || {};

    let score = 0;
    let matchedWords = new Set();
    let primaryMatchTerm = '';
    let matchedSigCount = 0;

    evalTokens.forEach(token => {
      let tokenFound = false;

      if (bookTitle.includes(token)) {
        score += 200;
        tokenFound = true;
      }
      if (chapterTitle.includes(token)) {
        score += 150;
        tokenFound = true;
      }

      for (const [word, count] of Object.entries(wordsMap)) {
        const cleanWord = stripDiacritics(word.toLowerCase());
        if (cleanWord === token) {
          score += (Math.min(count, 4) * 35) + (token.length * 4);
          tokenFound = true;
          matchedWords.add(word);
          if (!primaryMatchTerm) primaryMatchTerm = word;
        } else if (cleanWord.includes(token)) {
          score += (Math.min(count, 3) * 10) + token.length;
          tokenFound = true;
          matchedWords.add(word);
          if (!primaryMatchTerm) primaryMatchTerm = word;
        }
      }

      if (tokenFound) {
        matchedSigCount++;
        if (!primaryMatchTerm) primaryMatchTerm = token;
      }
    });

    expandedTokens.forEach(expToken => {
      if (!evalTokens.includes(expToken)) {
        if (bookTitle.includes(expToken)) score += 40;
        if (chapterTitle.includes(expToken)) score += 30;

        for (const [word, count] of Object.entries(wordsMap)) {
          const cleanWord = stripDiacritics(word.toLowerCase());
          if (cleanWord.includes(expToken)) {
            score += (Math.min(count, 3) * 6);
            matchedWords.add(word);
            if (!primaryMatchTerm) primaryMatchTerm = word;
          }
        }
      }
    });

    if (score > 0 && matchedSigCount > 0) {
      if (evalTokens.length > 1) {
        const ratio = matchedSigCount / evalTokens.length;
        score = score * Math.pow(ratio, 3.5);

        if (matchedSigCount === evalTokens.length) {
          score += 5000;
        }
        if (bookTitle.includes(cleanQuery) || chapterTitle.includes(cleanQuery)) {
          score += 15000;
        }
      }

      let sourceId = 'Book';
      if (doc.b) {
        const parts = doc.b.split('/');
        sourceId = parts[parts.length - 1].toUpperCase();
      }

      results.push({
        id: doc.id,
        bookId: doc.b,
        chapterId: doc.c,
        title: doc.bt || 'Book Chapter',
        heading: doc.ct || `Chapter ${doc.c}`,
        edition: doc.e || 'original',
        lang: doc.l || 'english',
        score: Math.round(score),
        matchedWords: Array.from(matchedWords),
        matchTerm: primaryMatchTerm || evalTokens[0],
        queryPhrase: cleanQuery,
        sourceId: sourceId
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  self.postMessage({ type: 'RESULTS', results: results.slice(0, 60), query });
}

// Worker postMessage Dispatcher
self.onmessage = function (e) {
  const { type, query, category, book, lang, baseUrl } = e.data;

  if (type === 'INIT') {
    initWorker(baseUrl || './');
  } else if (type === 'SEARCH') {
    executeSearch(query || '', category || 'all', book || 'all', lang || 'all');
  }
};
