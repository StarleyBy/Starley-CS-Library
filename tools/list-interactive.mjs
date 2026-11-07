#!/usr/bin/env node
/**
 * tools/list-interactive.mjs
 * Инспекция и валидация реестра интерактивных схем и симуляторов (data/interactive/interactive-index.json).
 * Без внешних зависимостей.
 *
 * Использование:
 *   node tools/list-interactive.mjs              # список всех интерактивных схем и их внедрений
 *   node tools/list-interactive.mjs --validate   # проверка целостности файлов, sw.js и ссылок в главах/квизах
 *   node tools/list-interactive.mjs --json       # вывод в формате JSON
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'interactive', 'interactive-index.json');
const SW_PATH = path.join(ROOT, 'sw.js');

const argv = process.argv.slice(2);
const DO_VALIDATE = argv.includes('--validate');
const AS_JSON = argv.includes('--json');

function readJsonSafe(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return { data: JSON.parse(raw), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error(`[ERROR] Файл реестра не найден: ${REGISTRY_PATH}`);
  process.exit(1);
}

const { data: registry, error: regErr } = readJsonSafe(REGISTRY_PATH);
if (regErr || !Array.isArray(registry)) {
  console.error(`[ERROR] Ошибка чтения data/interactive/interactive-index.json: ${regErr || 'Не является массивом'}`);
  process.exit(1);
}

if (AS_JSON) {
  console.log(JSON.stringify(registry, null, 2));
  process.exit(0);
}

if (!DO_VALIDATE) {
  console.log(`\n🎛️  Интерактивные схемы Starley Medical Library (всего: ${registry.length})\n`);
  for (const item of registry) {
    console.log(`• [${item.id}] ${item.titleRu} (${item.titleEn})`);
    console.log(`  Категория: ${item.category} | Файл: ${item.path}`);
    console.log(`  Теги: ${(item.tags || []).join(', ')}`);
    console.log(`  Источники: ${(item.sources || []).join('; ')}`);
    console.log(`  Внедрения (${(item.embeddings || []).length}):`);
    for (const emb of item.embeddings || []) {
      if (emb.type === 'chapter') {
        console.log(`    - [Глава] ${emb.book} / ${emb.chapter} (раздел: ${emb.section || '—'})`);
      } else if (emb.type === 'quiz') {
        console.log(`    - [Квиз] ${emb.manifest} (вопрос #${emb.questionId})`);
      } else {
        console.log(`    - [${emb.type}] ${JSON.stringify(emb)}`);
      }
    }
    console.log('');
  }
  process.exit(0);
}

// ----------------- РЕЖИМ ВАЛИДАЦИИ (--validate) -----------------
console.log(`\n🔍 Валидация реестра интерактивных схем (${registry.length} записей)...\n`);

let errorsCount = 0;
let warningsCount = 0;

function report(type, msg) {
  if (type === 'error') {
    errorsCount++;
    console.error(`  ❌ [ERROR] ${msg}`);
  } else if (type === 'warn') {
    warningsCount++;
    console.warn(`  ⚠️  [WARN]  ${msg}`);
  } else {
    console.log(`  ✅ ${msg}`);
  }
}

// 1. Читаем sw.js для проверки APP_SHELL
let swContent = '';
if (fs.existsSync(SW_PATH)) {
  swContent = fs.readFileSync(SW_PATH, 'utf8');
} else {
  report('warn', 'sw.js не найден в корне проекта');
}

const seenIds = new Set();

for (const item of registry) {
  console.log(`Проверка: ${item.id} (${item.titleEn})...`);

  // Обязательные поля
  if (!item.id || typeof item.id !== 'string') {
    report('error', `Запись не имеет корректного id`);
  } else if (seenIds.has(item.id)) {
    report('error', `Дубликат id: ${item.id}`);
  } else {
    seenIds.add(item.id);
  }

  if (!item.titleRu || !item.titleEn) {
    report('error', `[${item.id}] Отсутствует titleRu или titleEn`);
  }
  if (!item.path || typeof item.path !== 'string') {
    report('error', `[${item.id}] Отсутствует путь к файлу (path)`);
    continue;
  }

  // Проверка существования HTML файла
  const absHtmlPath = path.join(ROOT, item.path);
  if (!fs.existsSync(absHtmlPath)) {
    report('error', `[${item.id}] Файл не существует на диске: ${item.path}`);
  } else {
    report('ok', `HTML файл найден: ${item.path}`);
  }

  // Проверка наличия в APP_SHELL
  if (swContent) {
    const normPath = item.path.replace(/^\.\//, '');
    const inShell = swContent.includes(normPath) || swContent.includes(`./${normPath}`);
    if (!inShell) {
      report('error', `[${item.id}] Файл ${item.path} отсутствует в APP_SHELL файла sw.js (нарушение PWA offline-стандарта)`);
    } else {
      report('ok', `Зарегистрирован в APP_SHELL (sw.js)`);
    }
  }

  // Проверка источников
  if (!Array.isArray(item.sources) || item.sources.length === 0) {
    report('warn', `[${item.id}] Массив источников (sources) пуст`);
  }

  // Проверка внедрений
  if (!Array.isArray(item.embeddings) || item.embeddings.length === 0) {
    report('warn', `[${item.id}] Нет зарегистрированных внедрений (embeddings)`);
  } else {
    for (const [idx, emb] of item.embeddings.entries()) {
      const fileName = path.basename(item.path);
      if (emb.type === 'chapter') {
        // Проверка главы
        const bookPath = path.isAbsolute(emb.book) ? emb.book : path.join(ROOT, emb.book);
        const chapterDir = path.join(bookPath, 'chapters', emb.chapter);
        const enFile = path.join(chapterDir, `${emb.chapter}.md`);
        const ruFile = path.join(chapterDir, `${emb.chapter}-ru.md`);

        if (!fs.existsSync(enFile)) {
          report('error', `[${item.id}] Внедрение #${idx + 1} (глава): не найден файл ${enFile}`);
        } else {
          const content = fs.readFileSync(enFile, 'utf8');
          if (!content.includes(fileName)) {
            report('warn', `[${item.id}] В файле ${emb.chapter}.md не обнаружена ссылка на ${fileName}`);
          } else {
            report('ok', `Внедрение в ${emb.chapter}.md подтверждено`);
          }
        }

        if (fs.existsSync(ruFile)) {
          const ruContent = fs.readFileSync(ruFile, 'utf8');
          if (!ruContent.includes(fileName)) {
            report('warn', `[${item.id}] В файле ${emb.chapter}-ru.md не обнаружена ссылка на ${fileName}`);
          }
        }
      } else if (emb.type === 'quiz') {
        // Проверка квиза
        const manifestPath = path.isAbsolute(emb.manifest) ? emb.manifest : path.join(ROOT, emb.manifest);
        if (!fs.existsSync(manifestPath)) {
          report('error', `[${item.id}] Внедрение #${idx + 1} (квиз): манифест не найден ${manifestPath}`);
        } else {
          const { data: qData, error: qErr } = readJsonSafe(manifestPath);
          if (qErr || !qData || !Array.isArray(qData.questions)) {
            report('error', `[${item.id}] Манифест квиза поврежден: ${manifestPath}`);
          } else {
            const q = qData.questions.find(x => x.id === emb.questionId);
            if (!q) {
              report('error', `[${item.id}] В манифесте ${emb.manifest} не найден вопрос #${emb.questionId}`);
            } else {
              const inEn = q.explanationEn && q.explanationEn.includes(fileName);
              const inRu = q.explanationRu && q.explanationRu.includes(fileName);
              if (!inEn && !inRu) {
                report('warn', `[${item.id}] В вопросе #${emb.questionId} манифеста ${emb.manifest} не найдена ссылка на ${fileName}`);
              } else {
                report('ok', `Внедрение в манифест ${emb.manifest} (вопрос #${emb.questionId}) подтверждено`);
              }
            }
          }
        }
      } else {
        report('warn', `[${item.id}] Неизвестный тип внедрения: ${emb.type}`);
      }
    }
  }
  console.log('');
}

console.log('----------------------------------------------------');
if (errorsCount === 0) {
  console.log(`✅ Валидация интерактивных схем успешно завершена! Ошибок: 0, предупреждений: ${warningsCount}\n`);
  process.exit(0);
} else {
  console.error(`❌ Валидация завершилась с ошибками! Ошибок: ${errorsCount}, предупреждений: ${warningsCount}\n`);
  process.exit(1);
}
