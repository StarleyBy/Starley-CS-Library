#!/usr/bin/env node
/**
 * tools/validate-chapters.mjs
 * Проверка структуры и оформления глав books/**\/chapters/** (EN / RU / HE).
 * Без внешних зависимостей. Правила — из навыка «Редактор» (.agents/skills/editor/SKILL.md).
 *
 * Использование:
 *   node tools/validate-chapters.mjs                      # весь каталог books/ (только сводка + первые находки)
 *   node tools/validate-chapters.mjs <файл|папка> [...]   # конкретные файлы или папки
 *   node tools/validate-chapters.mjs --changed            # только изменённые/новые .md (по git)
 *
 * Параметры:
 *   --strict        предупреждения тоже дают код возврата 1
 *   --json          машинный вывод (JSON)
 *   --quiet         печатать только итог
 *   --max=N         максимум выводимых находок на файл (по умолчанию 20; 0 — без лимита)
 *   --no-parity     не сверять EN <-> RU/HE
 *   --baseline      сравнивать с tools/chapters-baseline.json: показывать и считать только НОВЫЕ находки
 *                   (известные дефекты старых глав скрыты; для новых и правленых глав запускать БЕЗ --baseline)
 *   --update-baseline  записать текущее состояние всех глав в tools/chapters-baseline.json
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды находок:
 *   E-серия — ошибки, W-серия — предупреждения, P-серия — паритет языков,
 *   I001 — предупреждение: рисунок из разметки не найден в локальной папке images/ главы
 *   (проверяется, только если папка есть локально: рисунки в git не хранятся, а переносятся в облако R2).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');

// ---------- аргументы ----------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const targets = argv.filter(a => !a.startsWith('--'));
const STRICT = flags.has('--strict');
const AS_JSON = flags.has('--json');
const QUIET = flags.has('--quiet');
const NO_PARITY = flags.has('--no-parity');
const USE_BASELINE = flags.has('--baseline');
const UPDATE_BASELINE = flags.has('--update-baseline');
const BASELINE_PATH = path.join(ROOT, 'tools', 'chapters-baseline.json');
const MAX_PER_FILE = opt.max !== undefined ? Number(opt.max) : 20;

// ---------- поиск файлов ----------
function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.git') walk(p, out); }
    else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) out.push(p);
  }
}

function isChapterPath(p) {
  const rel = path.relative(ROOT, p).split(path.sep).join('/');
  return rel.startsWith('books/') && rel.includes('/chapters/');
}

function collectFiles() {
  const files = [];
  if (flags.has('--changed')) {
    let names = '';
    try {
      names = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' })
        + '\n' + execSync('git ls-files --others --exclude-standard', { cwd: ROOT, encoding: 'utf8' });
    } catch (e) { console.error('git недоступен: ' + e.message); process.exit(2); }
    for (const n of names.split('\n').map(s => s.trim()).filter(Boolean)) {
      const p = path.join(ROOT, n);
      if (n.toLowerCase().endsWith('.md') && fs.existsSync(p) && isChapterPath(p)) files.push(p);
    }
  } else if (targets.length) {
    for (const t of targets) {
      const p = path.resolve(process.cwd(), t);
      if (!fs.existsSync(p)) { console.error('Не найден путь: ' + t); process.exit(2); }
      if (fs.statSync(p).isDirectory()) walk(p, files); else files.push(p);
    }
  } else {
    const booksDir = path.join(ROOT, 'books');
    if (fs.existsSync(booksDir)) walk(booksDir, files);
  }
  return [...new Set(files)].filter(isChapterPath).sort();
}

// ---------- язык файла ----------
function langOf(file) {
  const n = path.basename(file).toLowerCase();
  if (/-ru\.md$/.test(n)) return 'ru';
  if (/-he\.md$/.test(n)) return 'he';
  if (/-starley\.md$/.test(n)) return 'starley';
  return 'en';
}
function baseNameOf(file) {
  return path.basename(file).replace(/-(ru|he|starley)\.md$/i, '.md');
}

// ---------- подготовка текста ----------
/** Возвращает массив строк; строки внутри ``` блоков помечены как код. */
function splitLines(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let inFence = false;
  return lines.map((raw, i) => {
    const t = raw.trim();
    let code = inFence;
    if (/^(```|~~~)/.test(t)) { inFence = !inFence; code = true; }
    return { n: i + 1, raw, code };
  });
}

/** Удаляет inline-код и LaTeX-формулы из строки для проверок типографики. */
function stripInline(s) {
  return s
    .replace(/`[^`]*`/g, '')
    .replace(/\$\$[^$]*\$\$/g, '')
    .replace(/\$[^$\n]+\$/g, '');
}

const RE_EMOJI = /\p{Emoji_Presentation}|\uFE0F/u;
const RE_REF_HEADING = /^#{1,6}\s*(?:<[^>]+>\s*)*(references?|bibliography|литература|список литературы|библиография|литературa)\b/i;
const RE_CITATION = /(?<![\]\w^])\[\d+(?:\s*[–—,-]\s*\d+)*\](?!\()/;
const RE_TILDE = /(?<![~\\])~(?=\d)/;
const RE_DOLLAR_MONEY = /\$\s?\d/;
const RE_ANCHOR_DEF = /\bid="([^"]+)"/g;   // якорь: id на любом элементе (<span id>, <figure id>, заголовки и т. д.)
const RE_LINK_FRAG = /\]\(#([^)\s]+)\)/g;

// ---------- числа в тексте (для сверки EN <-> RU/HE) ----------
/** Для каждого числа хранит варианты записи: запятая как десятичный или как разделитель тысяч. */
function numericTokens(lines) {
  const alts = new Set();      // все допустимые варианты всех чисел
  const tokens = [];           // [{ dec, thou }]
  for (const L of lines) {
    if (L.code) continue;
    let t = L.raw
      .replace(/<span\s+id="[^"]*"\s*>\s*<\/span>/g, ' ')   // якоря
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                // изображения
      .replace(/\]\([^)]*\)/g, '] ')                         // цели ссылок
      .replace(/<[^>]+>/g, ' ')                                // html-теги
      .replace(/`[^`]*`/g, ' ');
    t = t.replace(/(\d)[\u00A0\u202F ](?=\d{3}(?!\d))/g, '$1');        // «100 000» -> «100000»
    const m = t.match(/(?<![\w.,])\d+(?:[.,]\d+)*(?![\w])/g) || [];
    for (const x of m) {
      const dec = x.replace(/,/g, '.');
      const thou = /^[1-9]\d{0,2}(,\d{3})+$/.test(x) ? x.replace(/,/g, '') : dec;
      if (/^\d$/.test(dec)) continue;                          // одиночные цифры — нумерация, шум
      tokens.push({ dec, thou });
      alts.add(dec); alts.add(thou);
    }
  }
  return { alts, tokens };
}

// ---------- папка рисунков главы ----------
/** Рисунки главы: chapters/chapter-XX/images/ (для подглав chapter-XX-YY — images родительской главы chapter-XX). */
function chapterImagesDir(file) {
  const dir = path.dirname(file);
  const m = path.basename(dir).match(/^(chapter-\d+)-\d+$/);
  return m ? path.join(path.dirname(dir), m[1], 'images') : path.join(dir, 'images');
}

// ---------- проверка одного файла ----------
function checkFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = splitLines(text);
  const findings = [];
  const add = (severity, code, line, msg) => findings.push({ severity, code, line, msg });

  // --- <details>: баланс, глубина, формат ---
  let depth = 0, opens = 0, closes = 0;
  const anchors = new Map();
  const figAnchors = new Set(), tblAnchors = new Set();
  let headingCount = 0;

  for (const L of lines) {
    if (L.code) continue;
    const raw = L.raw;

    // открывающие
    const openMatches = raw.match(/<details\b/g) || [];
    for (const _ of openMatches) { opens++; depth++; }
    // формат открытия: <details class="med-details"> (допускаются атрибуты data-*; <summary> может быть на этой или следующей строке)
    if (openMatches.length) {
      const okOpen = (raw.match(/<details class="med-details"(?:\s+(?:data-[\w-]+="[^"]*"|open))*>/g) || []).length;
      if (okOpen !== openMatches.length) {
        add('error', 'E005', L.n, 'Открывающий тег не в каноничном формате: <details class="med-details"...>');
      }
    }
    // закрывающие
    const closeMatches = raw.match(/<\/details>/g) || [];
    for (const _ of closeMatches) {
      closes++; depth--;
      if (depth < 0) { add('error', 'E002', L.n, 'Лишний </details>: глубина ушла в минус'); depth = 0; }
    }
    if (closeMatches.length) {
      const good = (raw.match(/<\/div><\/details>/g) || []).length;
      if (good !== closeMatches.length) {
        add('error', 'E004', L.n, 'Закрывающий тег должен быть строго </div></details> на одной строке');
      }
    }
    // одиночный </div> без </details> на строке (кроме закрытия содержимого вне details — не принято в проекте)
    if (/<\/div>/.test(raw) && !/<\/div><\/details>/.test(raw) && !/<div\b/.test(raw)) {
      add('error', 'E004', L.n, 'Одиночный </div>: закрывающая пара </div></details> разорвана');
    }

    // якоря
    let m;
    RE_ANCHOR_DEF.lastIndex = 0;
    while ((m = RE_ANCHOR_DEF.exec(raw))) {
      const id = m[1];
      if (anchors.has(id)) add('error', 'E020', L.n, `Дублирующийся якорь id="${id}" (первый раз на строке ${anchors.get(id)})`);
      else anchors.set(id, L.n);
      if (/^fig/i.test(id)) figAnchors.add(id.toLowerCase());
      if (/^(table|tbl)/i.test(id)) tblAnchors.add(id.toLowerCase());
    }

    if (/^#{1,6}\s/.test(raw.replace(/^<details[^>]*><summary>\s*/, '').trimStart())) headingCount++;
  }
  if (opens !== closes) add('error', 'E001', 0, `Дисбаланс <details>: открывающих ${opens}, закрывающих ${closes}`);
  if (depth !== 0 && opens === closes) add('error', 'E003', 0, `Глубина в конце файла ${depth}, ожидается 0`);
  else if (depth > 0) add('error', 'E003', 0, `Глубина в конце файла ${depth}, ожидается 0`);

  // --- ссылки на якоря ---
  for (const L of lines) {
    if (L.code) continue;
    let m;
    RE_LINK_FRAG.lastIndex = 0;
    while ((m = RE_LINK_FRAG.exec(L.raw))) {
      const id = m[1];
      if (/^(fig|table|tbl)/i.test(id) && !anchors.has(id)) {
        add('error', 'E021', L.n, `Ссылка на несуществующий якорь #${id}`);
      }
    }
  }

  // --- рисунки: файл из разметки должен лежать в images/ главы (проверяется, только если папка есть локально) ---
  const imgDir = chapterImagesDir(file);
  let imgSet = null;
  try { const names = fs.readdirSync(imgDir); if (names.length) imgSet = new Set(names); } catch { /* папки нет — пропускаем */ }
  if (imgSet) {
    const reported = new Set();
    for (const L of lines) {
      if (L.code) continue;
      const reImg = /!\[[^\]]*\]\(([^)\s]+)[^)]*\)|<img\b[^>]*?\bsrc="([^"]+)"/g;
      let mi;
      while ((mi = reImg.exec(L.raw))) {
        const src = mi[1] || mi[2];
        if (!src || /^(https?:|data:)/i.test(src)) continue;
        let name = src.split('?')[0].split('#')[0].split('/').pop();
        try { name = decodeURIComponent(name); } catch { /* оставляем как есть */ }
        if (!imgSet.has(name) && !reported.has(name)) {
          reported.add(name);
          add('warning', 'I001', L.n, `Рисунок не найден в ${rel(imgDir)}: ${name}`);
        }
      }
    }
  }

  // --- построчные проверки ---
  let consecutiveParas = 0, paraStartLine = 0, paraReported = false;
  for (const L of lines) {
    if (L.code) { consecutiveParas = 0; paraReported = false; continue; }
    const raw = L.raw;
    const t = raw.trim();

    if (RE_REF_HEADING.test(t)) add('error', 'E010', L.n, 'Раздел литературы (References/Список литературы) должен быть удалён');
    // исключение: маркер 📋 внутри ссылки на интерактивную таблицу гайдлайна ([📋 …](#/tables/…))
    // и маркер 🎛️ для интерактивных схем/симуляторов
    const noTableLinkEmoji = raw.replace(/\[[^\]]*\]\(#\/tables\/[^)]*\)/g, '').replace(/🎛️/gu, '');
    if (RE_EMOJI.test(noTableLinkEmoji)) add('error', 'E011', L.n, 'Эмодзи в файле главы запрещены (исключения: [📋 …](#/tables/…), 🎛️)');
    if (/\[\?\]/.test(raw)) add('error', 'E012', L.n, 'Остался маркер [?] (нечитаемый фрагмент не разрешён)');

    const bare = stripInline(raw);
    if (RE_CITATION.test(bare)) add('warning', 'W030', L.n, 'Остаток библиографической ссылки вида [12] / [1–4]');
    if (RE_TILDE.test(bare)) add('warning', 'W031', L.n, 'Тильда слитно с числом (~5): нужен пробел (~ 5)');
    if (RE_DOLLAR_MONEY.test(bare)) add('warning', 'W032', L.n, 'Знак $ у числа вне формулы: заменить на USD');

    // подряд идущие обычные абзацы
    const isStructural = t === '' || /^(#{1,6}\s|[-*+]\s|\d+[.)]\s|\||>|<details|<\/div>|<span|!\[|<div|<\/details>|<figure|<\/figure>|<figcaption|<img|\*\*(FIGURE|TABLE|РИСУНОК|ТАБЛИЦА)\b)/i.test(t)
      || /^<?\/?(details|summary|div)/i.test(t);
    if (t === '') continue;
    if (isStructural) { consecutiveParas = 0; paraReported = false; continue; }
    // новый абзац начинается после пустой строки
    const prev = lines[L.n - 2];
    if (!prev || prev.raw.trim() === '') {
      if (consecutiveParas === 0) paraStartLine = L.n;
      consecutiveParas++;
      if (consecutiveParas > 3 && !paraReported) {
        add('warning', 'W033', paraStartLine, 'Более 3 обычных абзацев подряд без подраздела (правило дробления: не более 2–3)');
        paraReported = true;
      }
    }
  }

  const info = { details: opens, figs: figAnchors, tables: tblAnchors, headings: headingCount, nums: numericTokens(lines) };
  return { file, lang: langOf(file), findings, info };
}

// ---------- паритет EN <-> RU/HE ----------
function parity(results) {
  const byDirBase = new Map();
  for (const r of results) {
    const key = path.dirname(r.file) + '::' + baseNameOf(r.file);
    if (!byDirBase.has(key)) byDirBase.set(key, {});
    byDirBase.get(key)[r.lang] = r;
  }
  for (const group of byDirBase.values()) {
    const en = group.en;
    if (!en) continue;
    for (const lang of ['ru', 'he']) {
      const tr = group[lang];
      if (!tr) continue;
      const sev = lang === 'ru' ? 'error' : 'warning';
      const add = (code, msg) => tr.findings.push({ severity: sev, code, line: 0, msg: `[EN↔${lang.toUpperCase()}] ${msg}` });
      if (en.info.details !== tr.info.details) add('P001', `Число <details>: EN ${en.info.details}, ${lang.toUpperCase()} ${tr.info.details}`);
      const diff = (a, b) => [...a].filter(x => !b.has(x));
      const dFigA = diff(en.info.figs, tr.info.figs), dFigB = diff(tr.info.figs, en.info.figs);
      if (dFigA.length || dFigB.length) add('P002', `Якоря рисунков различаются: только в EN [${dFigA.join(', ')}], только в ${lang.toUpperCase()} [${dFigB.join(', ')}]`);
      const dTblA = diff(en.info.tables, tr.info.tables), dTblB = diff(tr.info.tables, en.info.tables);
      if (dTblA.length || dTblB.length) add('P003', `Якоря таблиц различаются: только в EN [${dTblA.join(', ')}], только в ${lang.toUpperCase()} [${dTblB.join(', ')}]`);
      // числа: значения, которых нет на другой стороне (возможная потеря/искажение цифры или дозы)
      const missing = (from, to) => [...new Set(from.tokens.filter(t => !to.alts.has(t.dec) && !to.alts.has(t.thou)).map(t => t.dec))];
      const onlyEn = missing(en.info.nums, tr.info.nums);
      const onlyTr = missing(tr.info.nums, en.info.nums);
      if (onlyEn.length || onlyTr.length) {
        const cut = a => a.slice(0, 10).join(', ') + (a.length > 10 ? ` … (+${a.length - 10})` : '');
        tr.findings.push({ severity: 'warning', code: 'P005', line: 0, msg: `[EN↔${lang.toUpperCase()}] Числа только в EN: [${cut(onlyEn)}]; только в ${lang.toUpperCase()}: [${cut(onlyTr)}]` });
      }
      if (en.info.headings !== tr.info.headings) {
        tr.findings.push({ severity: 'warning', code: 'P004', line: 0, msg: `[EN↔${lang.toUpperCase()}] Число заголовков: EN ${en.info.headings}, ${lang.toUpperCase()} ${tr.info.headings}` });
      }
    }
  }
}

// ---------- запуск ----------
const files = collectFiles();
if (!files.length) {
  console.log('Нет глав для проверки.');
  process.exit(0);
}

let results = files.map(checkFile);
if (!NO_PARITY) {
  // для паритета могут понадобиться парные файлы, которых нет в списке (например, проверяют только -ru)
  const have = new Set(files);
  const extra = [];
  for (const r of results) {
    if (r.lang === 'en') continue;
    const enName = path.join(path.dirname(r.file), baseNameOf(r.file));
    if (!have.has(enName) && fs.existsSync(enName)) { extra.push(enName); have.add(enName); }
  }
  const extraResults = extra.map(checkFile);
  parity([...results, ...extraResults]);
}


function countsOf(r) {
  const c = {};
  for (const f of r.findings) c[f.code] = (c[f.code] || 0) + 1;
  return c;
}

if (UPDATE_BASELINE) {
  // Базовую линию строим по ВСЕМУ каталогу books/, а не по выбранным файлам
  const all = [];
  walk(path.join(ROOT, 'books'), all);
  let rs = all.filter(isChapterPath).sort().map(checkFile);
  if (!NO_PARITY) parity(rs);
  const files = {};
  for (const r of rs) { const c = countsOf(r); if (Object.keys(c).length) files[rel(r.file)] = c; }
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ version: 1, generated: new Date().toISOString().slice(0, 10), files }, null, 1) + '\n');
  console.log(`Базовая линия записана: ${rel(BASELINE_PATH)} (файлов с известными находками: ${Object.keys(files).length} из ${rs.length})`);
  process.exit(0);
}

let hiddenByBaseline = 0;
if (USE_BASELINE) {
  if (!fs.existsSync(BASELINE_PATH)) { console.error('Нет tools/chapters-baseline.json: сначала --update-baseline'); process.exit(2); }
  const base = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')).files || {};
  for (const r of results) {
    const known = { ...(base[rel(r.file)] || {}) };
    const kept = [];
    // скрываем первые N находок каждого кода, где N — число известных; новые — те, что сверх базы
    const byCode = {};
    for (const f of r.findings) (byCode[f.code] = byCode[f.code] || []).push(f);
    for (const [code, list] of Object.entries(byCode)) {
      const k = known[code] || 0;
      hiddenByBaseline += Math.min(k, list.length);
      kept.push(...list.slice(k));
    }
    r.findings = kept;
  }
}

const totals = { files: results.length, errors: 0, warnings: 0, filesWithErrors: 0, filesWithWarnings: 0 };
const byCode = {};
for (const r of results) {
  const e = r.findings.filter(f => f.severity === 'error').length;
  const w = r.findings.filter(f => f.severity === 'warning').length;
  totals.errors += e; totals.warnings += w;
  if (e) totals.filesWithErrors++; if (w) totals.filesWithWarnings++;
  for (const f of r.findings) byCode[f.code] = (byCode[f.code] || 0) + 1;
}

if (AS_JSON) {
  console.log(JSON.stringify({
    totals, byCode,
    files: results.filter(r => r.findings.length).map(r => ({ file: rel(r.file), findings: r.findings }))
  }, null, 2));
} else {
  if (!QUIET) {
    const printable = results.filter(r => r.findings.length);
    // Для полного обхода каталога без явных путей ограничиваем вывод, чтобы не заливать консоль
    const full = targets.length > 0 || flags.has('--changed');
    const limitFiles = full ? Infinity : 15;
    let shown = 0;
    for (const r of printable) {
      if (shown++ >= limitFiles) { console.log(`... ещё файлов с находками: ${printable.length - limitFiles} (укажите путь или --json)`); break; }
      console.log(rel(r.file));
      const list = r.findings.slice().sort((a, b) => (a.line || 0) - (b.line || 0));
      const lim = MAX_PER_FILE > 0 ? MAX_PER_FILE : list.length;
      for (const f of list.slice(0, lim)) {
        console.log(`  ${f.severity === 'error' ? 'ERROR' : 'warn '} ${f.code}${f.line ? ' :' + f.line : ''}  ${f.msg}`);
      }
      if (list.length > lim) console.log(`  ... ещё находок в файле: ${list.length - lim}`);
    }
  }
  console.log('');
  console.log(`Проверено файлов: ${totals.files}` + (USE_BASELINE ? ` · режим baseline (известных находок скрыто: ${hiddenByBaseline})` : ''));
  console.log(`Ошибок: ${totals.errors} (в ${totals.filesWithErrors} файлах) · предупреждений: ${totals.warnings} (в ${totals.filesWithWarnings} файлах)`);
  const codes = Object.entries(byCode).sort();
  if (codes.length) console.log('По кодам: ' + codes.map(([c, n]) => `${c}=${n}`).join(' '));
}

process.exitCode = totals.errors > 0 || (STRICT && totals.warnings > 0) ? 1 : 0;
