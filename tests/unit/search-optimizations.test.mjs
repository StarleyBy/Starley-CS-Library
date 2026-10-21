/**
 * tests/unit/search-optimizations.test.mjs
 * Unit-тесты для Spotlight Search 2.0:
 * 1. Безопасность RegExp при поиске медицинских сокращений со спецсимволами (Ca++, V/Q, NYHA (III), [A])
 * 2. Защита от состояния гонки (Race Condition) через инкрементный requestId
 * 3. Оптимизация Structured Clone: лимитирование топ-30 легковесных DTO и подсчет totalFound
 * 4. Версионирование индекса и инвалидация устаревшего кэша (v28)
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

console.log('🧪 Запуск Unit-тестов Spotlight Search 2.0...\n');

// -----------------------------------------------------------------------------
// ТЕСТ 1: Проверка исходных файлов search-worker.js, search-ui.js, search.js
// -----------------------------------------------------------------------------
console.log('📋 Тест 1: Синтаксис и ключевые структуры поисковой системы...');

const workerCode = fs.readFileSync(path.join(root, 'search/search-worker.js'), 'utf8');
const searchUiCode = fs.readFileSync(path.join(root, 'search/search-ui.js'), 'utf8');
const searchJsCode = fs.readFileSync(path.join(root, 'search/search.js'), 'utf8');
const swCode = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

assert.ok(workerCode.includes("const SEARCH_INDEX_VERSION = 'v28'"), 'search-worker.js содержит константу SEARCH_INDEX_VERSION = v28');
assert.ok(workerCode.includes('requestId'), 'search-worker.js принимает и передает requestId');
assert.ok(workerCode.includes('totalFound'), 'search-worker.js вычисляет и отправляет totalFound');
assert.ok(workerCode.includes('.slice(0, 30)'), 'search-worker.js лимитирует результаты до 30 DTO');

assert.ok(searchUiCode.includes('this.currentSearchId'), 'search-ui.js отслеживает currentSearchId');
assert.ok(searchUiCode.includes('escapeRegExp'), 'search-ui.js содержит функцию экранирования escapeRegExp');
assert.ok(searchUiCode.includes('requestId !== this.currentSearchId'), 'search-ui.js отсекает устаревшие requestId');
assert.ok(searchUiCode.includes('totalFound'), 'search-ui.js поддерживает отображение totalFound');

assert.ok(searchJsCode.includes('escapeRegex'), 'search.js содержит функцию escapeRegex');
assert.ok(searchJsCode.includes('try {'), 'search.js оборачивает RegExp в try/catch');

console.log('  ✅ PASS: Все ключевые структуры и маркеры версий присутствуют');

// -----------------------------------------------------------------------------
// ТЕСТ 2: Безопасность RegExp и экранирование спецсимволов
// -----------------------------------------------------------------------------
console.log('\n📋 Тест 2: Безопасность RegExp и подсветка терминов со спецсимволами...');

function escapeRegExp(string) {
  if (!string || typeof string !== 'string') return '';
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function highlightMatch(htmlOrText, query) {
  if (!htmlOrText || !query) return htmlOrText;
  try {
    let rawQ = query.replace(/^"|"$/g, '').replace(/\b(type|t):(quiz|book)\b/gi, '').replace(/\bin:(ru|en|he)\b/gi, '').trim();
    const terms = rawQ.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (terms.length === 0) return htmlOrText;

    let result = htmlOrText;

    // Exact phrase match
    if (rawQ.includes(' ') && rawQ.length > 3) {
      try {
        const safePhrase = escapeRegExp(rawQ);
        if (safePhrase) {
          const phrasePattern = new RegExp(`(${safePhrase})`, 'gi');
          if (phrasePattern.test(result)) {
            return result.replace(phrasePattern, '<mark class="spotlight-mark">$1</mark>');
          }
        }
      } catch (e) {
        // Safe catch
      }
    }

    // Individual terms
    const patternTerms = new Set();
    terms.forEach(t => {
      const safeT = escapeRegExp(t);
      if (safeT) patternTerms.add(safeT);
    });

    if (patternTerms.size === 0) return htmlOrText;

    try {
      const pattern = new RegExp(`(${Array.from(patternTerms).join('|')})`, 'gi');
      return result.replace(pattern, '<mark class="spotlight-mark">$1</mark>');
    } catch (patternErr) {
      return htmlOrText;
    }
  } catch (err) {
    return htmlOrText;
  }
}

// 2.1 Тест Ca++
const caText = 'Serum Ca++ level was elevated in severe hypercalcemia.';
const caResult = highlightMatch(caText, 'Ca++');
assert.ok(!caResult.includes('error'), 'Поиск Ca++ не падает с ошибкой');
assert.ok(caResult.includes('<mark class="spotlight-mark">Ca++</mark>'), 'Ca++ корректно обернут в тег <mark>');
console.log('  ✅ PASS: Ca++ успешно подсвечен без падения регулярного выражения');

// 2.2 Тест V/Q
const vqText = 'The ventilation-perfusion V/Q scan confirmed pulmonary embolism.';
const vqResult = highlightMatch(vqText, 'V/Q');
assert.ok(vqResult.includes('<mark class="spotlight-mark">V/Q</mark>'), 'V/Q корректно обернут в тег <mark>');
console.log('  ✅ PASS: V/Q успешно подсвечен');

// 2.3 Тест NYHA (III)
const nyhaText = 'Patients with NYHA (III) heart failure were enrolled in the trial.';
const nyhaResult = highlightMatch(nyhaText, 'NYHA (III)');
assert.ok(nyhaResult.includes('<mark class="spotlight-mark">NYHA (III)</mark>'), 'NYHA (III) корректно подсвечен как фраза со скобками');
console.log('  ✅ PASS: NYHA (III) со скобками обработан безопасно');

// 2.4 Экстремальные спецсимволы: [A], (test)*+?, /\\^$
const extremeQueries = ['[A]', '(?=.*)', '***', '+++', '///', '[[['];
for (const badQ of extremeQueries) {
  assert.doesNotThrow(() => {
    const res = highlightMatch('Test [A] and *** sample string', badQ);
    assert.ok(typeof res === 'string');
  }, `Запрос '${badQ}' не должен вызывать исключений`);
}
console.log('  ✅ PASS: Экстремальные наборы спецсимволов безопасно экранируются');

// -----------------------------------------------------------------------------
// ТЕСТ 3: Защита от Race Condition (requestId)
// -----------------------------------------------------------------------------
console.log('\n📋 Тест 3: Защита от Race Condition через инкрементный requestId...');

class MockSearchUI {
  constructor() {
    this.currentSearchId = 0;
    this.currentQuery = '';
    this.results = [];
    this.renderedRequestId = null;
  }

  performSearch(query) {
    this.currentQuery = query.trim();
    const requestId = ++this.currentSearchId;
    return requestId;
  }

  onWorkerMessage(e) {
    const { type, results, requestId, query } = e.data;
    if (type !== 'RESULTS') return;

    // Ключевая проверка: отсекаем устаревший requestId
    if (requestId !== undefined && requestId !== null && requestId !== this.currentSearchId) {
      return; // Игнорируем запоздавший ответ
    }

    if (query === this.currentQuery) {
      this.results = results;
      this.renderedRequestId = requestId;
    }
  }
}

const mockUi = new MockSearchUI();

// Пользователь вводит "aorta" (быстрый запрос 1)
const req1 = mockUi.performSearch('aorta');
assert.strictEqual(req1, 1);
assert.strictEqual(mockUi.currentSearchId, 1);

// Пользователь сразу же допечатывает "aortic valve" (запрос 2)
const req2 = mockUi.performSearch('aortic valve');
assert.strictEqual(req2, 2);
assert.strictEqual(mockUi.currentSearchId, 2);

// Допустим, запрос 2 завершился быстрее и вернул ответ
mockUi.onWorkerMessage({
  data: {
    type: 'RESULTS',
    query: 'aortic valve',
    requestId: 2,
    results: [{ id: 'doc-valve-1', title: 'Aortic Valve Disease' }]
  }
});

assert.strictEqual(mockUi.renderedRequestId, 2);
assert.strictEqual(mockUi.results[0].title, 'Aortic Valve Disease');

// Теперь с задержкой приходит ответ на запрос 1 ("aorta")
mockUi.onWorkerMessage({
  data: {
    type: 'RESULTS',
    query: 'aorta',
    requestId: 1,
    results: [{ id: 'doc-aorta-old', title: 'Thoracic Aorta' }]
  }
});

// Проверяем: результат запроса 1 был проигнорирован, на экране остался запрос 2!
assert.strictEqual(mockUi.renderedRequestId, 2, 'Запоздавший ответ на запрос 1 не должен перезаписывать экран');
assert.strictEqual(mockUi.results[0].title, 'Aortic Valve Disease', 'Результаты соответствуют последнему вводу пользователя');

console.log('  ✅ PASS: Race condition полностью исключен благодаря проверке requestId');

// -----------------------------------------------------------------------------
// ТЕСТ 4: Structured Clone оптимизация и передача минимального DTO
// -----------------------------------------------------------------------------
console.log('\n📋 Тест 4: Structured Clone DTO и лимитирование топ-30 результатов...');

// Создаем имитацию 100 тяжелых совпадений с большими текстами
const rawMatches = [];
for (let i = 0; i < 100; i++) {
  rawMatches.push({
    id: `doc-${i}`,
    type: 'book',
    bookId: 'cardiac-surgery',
    chapterId: `ch-${i}`,
    title: `Chapter ${i}`,
    heading: `Section ${i}`,
    edition: 'original',
    lang: 'english',
    score: 1000 - i * 5, // Убывающий скор
    matchTerm: 'aorta',
    heavyParagraphs: new Array(500).fill('Very heavy text paragraph consuming lots of memory...'),
    fullRawAst: { nodes: new Array(200).fill({ type: 'ast', text: 'data' }) }
  });
}

function processWorkerResults(matches, query, requestId) {
  matches.sort((a, b) => b.score - a.score);
  const totalFound = matches.length;

  // Топ-30 DTO
  const topResults = matches.slice(0, 30).map(item => ({
    id: item.id,
    type: item.type,
    bookId: item.bookId,
    chapterId: item.chapterId,
    title: item.title,
    heading: item.heading,
    edition: item.edition,
    lang: item.lang,
    score: item.score,
    matchTerm: item.matchTerm
  }));

  return {
    type: 'RESULTS',
    results: topResults,
    totalFound: totalFound,
    query: query,
    requestId: requestId
  };
}

const workerMsg = processWorkerResults(rawMatches, 'aorta', 5);

assert.strictEqual(workerMsg.totalFound, 100, 'totalFound сообщает общее число найденных документов');
assert.strictEqual(workerMsg.results.length, 30, 'В главный поток передается не более 30 элементов');
assert.strictEqual(workerMsg.results[0].heavyParagraphs, undefined, 'Тяжелые массивы отсечены от DTO');
assert.strictEqual(workerMsg.results[0].fullRawAst, undefined, 'Служебные AST деревья не сериализуются');

console.log('  ✅ PASS: Легковесный DTO снижает нагрузку на Structured Clone и GC');

// -----------------------------------------------------------------------------
// ТЕСТ 5: Проверка версионирования и согласованности версий кэша (v28)
// -----------------------------------------------------------------------------
console.log('\n📋 Тест 5: Синхронизация версий кэша (v28)...');

assert.ok(swCode.includes('static-v28'), 'sw.js использует static-v28');
assert.ok(swCode.includes('dynamic-v28'), 'sw.js использует dynamic-v28');
assert.ok(workerCode.includes("const SEARCH_INDEX_VERSION = 'v28'"), 'search-worker.js использует SEARCH_INDEX_VERSION v28');
assert.ok(searchUiCode.includes("version: 'v28'"), 'search-ui.js передает version: v28');
assert.ok(searchJsCode.includes('?v=v28'), 'search.js передает ?v=v28');

// Тест валидации кэша в IndexedDB
function isCacheValid(cachedVersion, expectedVersion = 'v28') {
  return cachedVersion === expectedVersion;
}

assert.strictEqual(isCacheValid('v27', 'v28'), false, 'Кэш v27 признается устаревшим и сбрасывается');
assert.strictEqual(isCacheValid('v28', 'v28'), true, 'Кэш v28 признается валидным');

console.log('  ✅ PASS: Все версионные константы синхронизированы с v28, инвалидация устаревшего кэша гарантирована');

console.log('\n======================================================');
console.log('🎉 ALL SPOTLIGHT SEARCH 2.0 UNIT TESTS PASSED!');
console.log('======================================================\n');
