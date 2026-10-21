/**
 * tests/run-all.mjs
 * Главный автоматический верификатор системы перед сдачей работы агентом «Кодер».
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('🧪 Запуск комплексного тестирования приложения Starley Medical Library...\n');

// 1. Проверка манифеста библиотеки
console.log('📋 1. Проверка library.json...');
try {
  const libPath = path.join(root, 'library.json');
  assert(fs.existsSync(libPath), 'library.json существует');
  const libData = JSON.parse(fs.readFileSync(libPath, 'utf8'));
  assert(Array.isArray(libData.categories) && libData.categories.length > 0, `Найдено категорий: ${libData.categories?.length}`);
} catch (e) {
  assert(false, `Ошибка чтения library.json: ${e.message}`);
}

// 2. Проверка реестра гайдлайнов и валидатора таблиц
console.log('\n📋 2. Проверка подсистемы гайдлайнов...');
try {
  const guideRegPath = path.join(root, 'data/guidelines/guidelines.json');
  assert(fs.existsSync(guideRegPath), 'guidelines.json существует');
  const guideReg = JSON.parse(fs.readFileSync(guideRegPath, 'utf8'));
  assert(Array.isArray(guideReg.guidelines) && guideReg.guidelines.length > 0, `Зарегистрировано гайдлайнов: ${guideReg.guidelines?.length}`);

  const valOutput = execSync('node tools/validate-tables.mjs', { cwd: root, encoding: 'utf8' });
  assert(!valOutput.includes('error(s)') || valOutput.includes('0 error(s)'), 'tools/validate-tables.mjs проходит с 0 ошибок');
} catch (e) {
  assert(false, `Ошибка валидации таблиц: ${e.message}`);
}

// 3. Проверка поискового индекса
console.log('\n📋 3. Проверка поискового индекса...');
try {
  const searchIndexPath = path.join(root, 'search/search-index.json');
  const searchConfigPath = path.join(root, 'search/search-config.json');
  assert(fs.existsSync(searchIndexPath), 'search-index.json существует');
  assert(fs.existsSync(searchConfigPath), 'search-config.json существует');
  const stats = fs.statSync(searchIndexPath);
  assert(stats.size > 1000000, `search-index.json имеет валидный размер (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} catch (e) {
  assert(false, `Ошибка поискового индекса: ${e.message}`);
}

// 4. Проверка целостности Service Worker
console.log('\n📋 4. Проверка Service Worker...');
try {
  const swPath = path.join(root, 'sw.js');
  assert(fs.existsSync(swPath), 'sw.js существует');
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert(swContent.includes('CACHE_STATIC') && swContent.includes('CACHE_DYNAMIC'), 'sw.js содержит корректные константы кэша');
} catch (e) {
  assert(false, `Ошибка проверки sw.js: ${e.message}`);
}

// 5. Проверка читалки (reader-optimizations)
console.log('\n📋 5. Проверка читалки (reader-optimizations)...');
try {
  const unitOutput = execSync('node tests/unit/reader-optimizations.test.mjs', { cwd: root, encoding: 'utf8' });
  assert(unitOutput.includes('ALL READER OPTIMIZATION UNIT TESTS PASSED'), 'Unit-тесты reader.js успешно пройдены');
} catch (e) {
  assert(false, `Ошибка unit-тестирования reader.js: ${e.message}`);
}

// 6. Проверка поискового модуля Spotlight Search 2.0 (search-optimizations)
console.log('\n📋 6. Проверка Spotlight Search 2.0 (search-optimizations)...');
try {
  const searchOutput = execSync('node tests/unit/search-optimizations.test.mjs', { cwd: root, encoding: 'utf8' });
  assert(searchOutput.includes('ALL SPOTLIGHT SEARCH 2.0 UNIT TESTS PASSED'), 'Unit-тесты Spotlight Search 2.0 успешно пройдены');
} catch (e) {
  assert(false, `Ошибка unit-тестирования Spotlight Search 2.0: ${e.message}`);
}

// 7. Проверка синхронизации и авторизации Cloud Sync & Auth (supabase-sync-optimizations)
console.log('\n📋 7. Проверка Cloud Sync & Auth (supabase-sync-optimizations)...');
try {
  const syncOutput = execSync('node tests/unit/supabase-sync-optimizations.test.mjs', { cwd: root, encoding: 'utf8' });
  assert(syncOutput.includes('ALL CLOUD SYNC & AUTH OPTIMIZATION TESTS PASSED'), 'Unit-тесты Cloud Sync & Auth успешно пройдены');
} catch (e) {
  assert(false, `Ошибка unit-тестирования Cloud Sync & Auth: ${e.message}`);
}

console.log(`\n======================================================`);
console.log(`Итог: Всего проверок: ${totalTests} | Пройдено: ${passedTests} | Провалено: ${failedTests}`);
console.log(`======================================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 Все базовые тесты успешно пройдены!\n');
}
