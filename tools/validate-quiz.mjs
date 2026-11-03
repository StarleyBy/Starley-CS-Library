#!/usr/bin/env node
/**
 * tools/validate-quiz.mjs
 * Проверка манифестов квиза (books/**\/quiz/quiz-*.json), их реестров и ссылок на таксономию.
 * Без внешних зависимостей. Правила — из навыков quiz-master / quiz-verifier / taxonomist.
 *
 * Использование:
 *   node tools/validate-quiz.mjs                    # все манифесты и реестры (сводка + первые находки)
 *   node tools/validate-quiz.mjs <файл|папка> ...   # конкретные манифесты (реестры проверяются всегда)
 *   node tools/validate-quiz.mjs --changed          # только изменённые/новые манифесты по git
 *
 * Параметры:
 *   --strict           предупреждения тоже дают код возврата 1
 *   --json             машинный вывод
 *   --quiet            только итог
 *   --max=N            максимум находок на файл в выводе (по умолчанию 20; 0 — без лимита)
 *   --no-registry      не проверять реестры (allquiz.json, metadata.json, список в quiz.js)
 *   --baseline         показывать только НОВЫЕ находки относительно tools/quiz-baseline.json
 *   --update-baseline  записать текущее состояние в tools/quiz-baseline.json
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды: M — манифест, Q — вопрос (Q013 — пояснение называет не тот вариант, что correctAnswer), T — таксономия,
 *        I001 — предупреждение: картинка не найдена в <папка книги>/quiz/images/ (если папка есть локально), R — реестры.
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
const NO_REGISTRY = flags.has('--no-registry');
const USE_BASELINE = flags.has('--baseline');
const UPDATE_BASELINE = flags.has('--update-baseline');
const MAX_PER_FILE = opt.max !== undefined ? Number(opt.max) : 20;
const BASELINE_PATH = path.join(ROOT, 'tools', 'quiz-baseline.json');

const TAXONOMY_PATH = path.join(ROOT, 'quiz', 'quiz-taxonomy.json');
const ALLQUIZ_PATH = path.join(ROOT, 'quiz', 'allquiz.json');
const EXAMEN_META_PATH = path.join(ROOT, 'books', 'work', 'examen', 'metadata.json');
const QUIZ_JS_PATH = path.join(ROOT, 'assets', 'js', 'quiz.js');

// ---------- утилиты ----------
function walk(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.git') walk(p, out); }
    else if (e.isFile()) out.push(p);
  }
}
const isManifestPath = p => /\/quiz\/quiz-[^/]+\.json$/.test(rel(p)) && rel(p).startsWith('books/');
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const norm = s => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const asList = v => (v === undefined || v === null || v === '' ? [] : Array.isArray(v) ? v : [v]);

function allManifestsOnDisk() {
  const all = [];
  walk(path.join(ROOT, 'books'), all);
  return all.filter(isManifestPath).sort();
}

function collectTargets() {
  if (flags.has('--changed')) {
    let names = '';
    try {
      names = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' })
        + '\n' + execSync('git ls-files --others --exclude-standard', { cwd: ROOT, encoding: 'utf8' });
    } catch (e) { console.error('git недоступен: ' + e.message); process.exit(2); }
    return [...new Set(names.split('\n').map(s => s.trim()).filter(Boolean))]
      .map(n => path.join(ROOT, n)).filter(p => fs.existsSync(p) && isManifestPath(p)).sort();
  }
  if (targets.length) {
    const files = [];
    for (const t of targets) {
      const p = path.resolve(process.cwd(), t);
      if (!fs.existsSync(p)) { console.error('Не найден путь: ' + t); process.exit(2); }
      if (fs.statSync(p).isDirectory()) walk(p, files); else files.push(p);
    }
    return [...new Set(files)].filter(isManifestPath).sort();
  }
  return allManifestsOnDisk();
}

// ---------- таксономия ----------
let TAX = null;
function loadTaxonomy() {
  if (!fs.existsSync(TAXONOMY_PATH)) return null;
  const t = readJson(TAXONOMY_PATH);
  return {
    disciplines: new Set((t.disciplines || []).map(d => d.id)),
    topics: new Map((t.topics || []).map(x => [x.id, x])),
    tags: new Set((t.tags || []).map(x => x.id)),
  };
}

// ---------- проверка HTML-баланса в пояснениях ----------
const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
function htmlBalanced(s) {
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w-]*)[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(s))) {
    const closing = m[1] === '/', tag = m[2].toLowerCase(), selfClosed = m[3] === '/';
    if (VOID.has(tag) || selfClosed) continue;
    if (!closing) stack.push(tag);
    else if (stack.length && stack[stack.length - 1] === tag) stack.pop();
    else return false;
  }
  return stack.length === 0;
}
// Согласованность пояснения с правильным ответом: «Correct Answer: Option D», «Правильный ответ: D»
const stripMarkup = t => String(t || '').replace(/<[^>]+>/g, ' ').replace(/\*+/g, '');
const RE_STATED_EN = /correct\s+answer(?:\s+is)?\s*[:\-–—]?\s*(?:option\s*)?\(?\b([A-E])\b[\s).:,]/i;
const RE_STATED_RU = /правильн\w+\s+ответ(?:\s+—|\s*[:\-–—])?\s*(?:вариант\s*)?\(?\b([A-E])\b[\s).:,]/i;
const RE_CITATION = /(?<![\w\]])\[\d+(?:\s*[,–-]\s*\d+)*\](?!\()/;

// ---------- проверка одного манифеста ----------
function checkManifest(file) {
  const findings = [];
  const add = (severity, code, qid, msg) => findings.push({ severity, code, id: qid, msg });
  let data;
  try { data = readJson(file); }
  catch (e) { add('error', 'M001', null, 'JSON не читается: ' + e.message); return { file, findings, count: 0 }; }
  if (!data || !Array.isArray(data.questions)) { add('error', 'M001', null, 'Нет массива questions'); return { file, findings, count: 0 }; }

  const qs = data.questions;
  if (data.meta && data.meta.totalQuestions !== undefined && data.meta.totalQuestions !== qs.length) {
    add('warning', 'M002', null, `meta.totalQuestions = ${data.meta.totalQuestions}, фактически вопросов ${qs.length}`);
  }

  // Картинки квиза лежат рядом с манифестом: <папка книги>/quiz/images/ (проверяется, только если папка есть локально)
  const imagesDir = path.join(path.dirname(file), 'images');
  let imageSet = null;
  try { const names = fs.readdirSync(imagesDir); if (names.length) imageSet = new Set(names); } catch { /* папки нет — пропускаем */ }

  const seenIds = new Map();
  const seenText = new Map();

  qs.forEach((q, idx) => {
    const id = q.id !== undefined ? q.id : `#${idx + 1}`;

    // идентификаторы
    if (q.id === undefined) add('error', 'Q001', id, 'У вопроса нет id');
    else if (seenIds.has(q.id)) add('error', 'Q001', id, `Дублирующийся id ${q.id} (первый раз вопрос №${seenIds.get(q.id)})`);
    else seenIds.set(q.id, idx + 1);

    // тексты и варианты
    const legacy = (q.question && !q.questionEn && !q.questionRu) || (q.options && !q.optionsEn && !q.optionsRu);
    if (legacy) add('warning', 'Q012', id, 'Устаревшие поля question/options вместо questionEn/questionRu и optionsEn/optionsRu');
    const qEn = q.questionEn || q.question, qRu = q.questionRu;
    const oEn = q.optionsEn || q.options || {}, oRu = q.optionsRu || {};
    if (!qEn && !qRu) add('error', 'Q003', id, 'Нет текста вопроса');
    if (!qRu) add('warning', 'Q004', id, 'Нет questionRu (вопрос должен быть двуязычным)');
    if (!q.optionsRu || !Object.keys(oRu).length) add('warning', 'Q004', id, 'Нет optionsRu');
    else if (Object.keys(oRu).sort().join() !== Object.keys(oEn).sort().join()) {
      add('error', 'Q005', id, `Буквы вариантов различаются: EN [${Object.keys(oEn).join('')}], RU [${Object.keys(oRu).join('')}]`);
    }
    const n = Object.keys(oEn).length;
    if (n < 2) add('error', 'Q006', id, `Меньше двух вариантов ответа (${n})`);
    else if (n < 4) add('warning', 'Q007', id, `Вариантов ответа меньше четырёх (${n})`);

    // правильный ответ
    const answers = asList(q.correctAnswer);
    if (!answers.length) add('error', 'Q002', id, 'Не указан correctAnswer');
    else for (const a of answers) if (!(a in oEn)) add('error', 'Q002', id, `correctAnswer "${a}" отсутствует среди вариантов [${Object.keys(oEn).join('')}]`);
    if (Array.isArray(q.correctAnswer) && !q.multiAnswer) add('warning', 'Q002', id, 'correctAnswer — массив, но multiAnswer не задан');

    // пояснения
    const eEn = q.explanationEn, eRu = q.explanationRu;
    if (!eEn && !eRu) add('error', 'Q008', id, 'Нет пояснений (ни EN, ни RU)');
    else if (!eRu) add('warning', 'Q008', id, 'Нет explanationRu');
    else if (!eEn) add('warning', 'Q008', id, 'Нет explanationEn');
    for (const [k, v] of [['explanationEn', eEn], ['explanationRu', eRu]]) {
      if (!v) continue;
      if (RE_CITATION.test(v)) add('error', 'Q009', id, `${k}: остатки сносок-цитат вида [1], [2,4] (вместо них — название источника, глава, раздел)`);
      if (!htmlBalanced(v)) add('warning', 'Q010', id, `${k}: нарушен баланс HTML-тегов`);
    }

    // пояснение должно называть тот же вариант, что и correctAnswer
    if (answers.length === 1 && !Array.isArray(q.correctAnswer)) {
      for (const [k, v, rx] of [['explanationEn', eEn, RE_STATED_EN], ['explanationRu', eRu, RE_STATED_RU]]) {
        if (!v) continue;
        const m = stripMarkup(v).match(rx);
        if (m && m[1].toUpperCase() !== String(answers[0]).toUpperCase()) {
          add('error', 'Q013', id, `${k}: в пояснении назван вариант ${m[1].toUpperCase()}, а correctAnswer = ${answers[0]}`);
        }
      }
    }

    // повтор формулировки внутри файла
    const key = norm(qEn || qRu);
    if (key) {
      if (seenText.has(key)) add('warning', 'Q011', id, `Совпадает формулировка с вопросом id ${seenText.get(key)} в этом же файле`);
      else seenText.set(key, id);
    }

    // таксономия
    const ds = asList(q.disciplines), tp = asList(q.topics), tg = asList(q.tags);
    if (!ds.length || !tp.length || !tg.length) add('warning', 'T005', id, `Не заполнены: ${[!ds.length && 'disciplines', !tp.length && 'topics', !tg.length && 'tags'].filter(Boolean).join(', ')}`);
    if (TAX) {
      for (const d of ds) if (!TAX.disciplines.has(d)) add('error', 'T001', id, `Неизвестная дисциплина "${d}"`);
      for (const t of tp) if (!TAX.topics.has(t)) add('error', 'T002', id, `Неизвестная тема "${t}"`);
      for (const g of tg) if (!TAX.tags.has(g)) add('error', 'T003', id, `Неизвестный тег "${g}"`);
      if (ds.length) for (const t of tp) {
        const info = TAX.topics.get(t);
        if (info && !ds.includes(info.disciplineId)) add('warning', 'T004', id, `Тема "${t}" относится к дисциплине "${info.disciplineId}", которой нет в disciplines вопроса`);
      }
    }

    // изображения (проверяются, только если папка images есть локально: в git картинок нет)
    if (imageSet) {
      const refs = [...asList(q.image), ...asList(q.images), ...asList(q.explanationImage), ...asList(q.explanationImages)];
      for (const r of refs) if (!imageSet.has(String(r))) add('warning', 'I001', id, `Файл изображения не найден в ${rel(imagesDir)}: ${r}`);
    }
  });

  return { file, findings, count: qs.length };
}

// ---------- реестры ----------
function checkRegistries(manifests, counts) {
  const out = [];
  const mk = (filePath, code, severity, msg) => {
    let r = out.find(x => x.file === filePath);
    if (!r) { r = { file: filePath, findings: [], count: 0 }; out.push(r); }
    r.findings.push({ severity, code, id: null, msg });
  };
  const onDisk = new Map(manifests.map(p => [rel(p), counts.get(rel(p))]));

  // allquiz.json
  if (fs.existsSync(ALLQUIZ_PATH)) {
    const reg = readJson(ALLQUIZ_PATH);
    const list = reg.quizzes || [];
    const regFiles = new Set();
    let sum = 0;
    for (const e of list) {
      regFiles.add(e.file);
      sum += Number(e.totalQuestions) || 0;
      const abs = path.join(ROOT, e.file);
      if (!fs.existsSync(abs)) { mk('quiz/allquiz.json', 'R001', 'error', `Файл из реестра не существует: ${e.file}`); continue; }
      const actual = counts.get(e.file);
      if (actual !== undefined && actual !== e.totalQuestions) mk('quiz/allquiz.json', 'R003', 'warning', `${e.id}: в реестре ${e.totalQuestions} вопросов, фактически ${actual}`);
    }
    for (const f of onDisk.keys()) if (!regFiles.has(f)) mk('quiz/allquiz.json', 'R002', 'error', `Манифест не внесён в реестр: ${f}`);
    if (reg.meta) {
      if (reg.meta.totalManifests !== list.length) mk('quiz/allquiz.json', 'R004', 'warning', `meta.totalManifests = ${reg.meta.totalManifests}, записей в реестре ${list.length}`);
      if (reg.meta.totalQuestions !== sum) mk('quiz/allquiz.json', 'R004', 'warning', `meta.totalQuestions = ${reg.meta.totalQuestions}, сумма по записям ${sum}`);
    }
  } else mk('quiz/allquiz.json', 'R001', 'error', 'Реестр quiz/allquiz.json не найден');

  // books/work/examen/metadata.json -> quiz_sets
  if (fs.existsSync(EXAMEN_META_PATH)) {
    const meta = readJson(EXAMEN_META_PATH);
    const sets = (Array.isArray(meta) ? meta[0] : meta).quiz_sets || [];
    const base = 'books/work/examen/';
    const setFiles = new Set();
    for (const s of sets) {
      const f = base + s.file; setFiles.add(f);
      if (!fs.existsSync(path.join(ROOT, f))) mk(base + 'metadata.json', 'R005', 'error', `quiz_sets[${s.id}]: файл не существует: ${s.file}`);
    }
    for (const f of onDisk.keys()) if (f.startsWith(base + 'quiz/') && !setFiles.has(f)) mk(base + 'metadata.json', 'R006', 'warning', `Манифест не указан в quiz_sets: ${f.slice(base.length)}`);
  }

  // список-запасной вариант в assets/js/quiz.js
  if (fs.existsSync(QUIZ_JS_PATH)) {
    const js = fs.readFileSync(QUIZ_JS_PATH, 'utf8');
    const re = /\{\s*num:\s*\d+,\s*id:\s*'([^']+)'[^}]*?totalQ:\s*(\d+),\s*file:\s*'([^']+)'/g;
    let m; const jsFiles = new Set();
    while ((m = re.exec(js))) {
      const [, id, totalQ, file] = m; jsFiles.add(file);
      if (!fs.existsSync(path.join(ROOT, file))) mk('assets/js/quiz.js', 'R007', 'warning', `Запасной список: файл не существует: ${file}`);
      else if (counts.get(file) !== undefined && counts.get(file) !== Number(totalQ)) mk('assets/js/quiz.js', 'R007', 'warning', `Запасной список: ${id} — totalQ ${totalQ}, фактически ${counts.get(file)}`);
    }
    for (const f of onDisk.keys()) if (f.startsWith('books/work/examen/quiz/') && jsFiles.size && !jsFiles.has(f)) mk('assets/js/quiz.js', 'R007', 'warning', `Запасной список не содержит манифест: ${f}`);
  }
  return out;
}

// ---------- запуск ----------
TAX = loadTaxonomy();
if (!TAX) console.error('Предупреждение: quiz/quiz-taxonomy.json не найден — проверки T001–T004 пропущены');

const manifestsAll = allManifestsOnDisk();
const selected = UPDATE_BASELINE ? manifestsAll : collectTargets();
if (!selected.length && NO_REGISTRY) { console.log('Нет манифестов для проверки.'); process.exit(0); }

let results = selected.map(checkManifest);

// число вопросов для всех манифестов (нужно реестрам); для невыбранных считаем без полной проверки
const counts = new Map();
for (const p of manifestsAll) {
  const r = results.find(x => x.file === p);
  if (r) counts.set(rel(p), r.count);
  else { try { const d = readJson(p); counts.set(rel(p), Array.isArray(d.questions) ? d.questions.length : undefined); } catch { counts.set(rel(p), undefined); } }
}
if (!NO_REGISTRY) results = results.concat(checkRegistries(manifestsAll, counts).map(r => ({ ...r, file: path.join(ROOT, r.file) })));

const countsOf = r => { const c = {}; for (const f of r.findings) c[f.code] = (c[f.code] || 0) + 1; return c; };

if (UPDATE_BASELINE) {
  const files = {};
  for (const r of results) { const c = countsOf(r); if (Object.keys(c).length) files[rel(r.file)] = c; }
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ version: 1, generated: new Date().toISOString().slice(0, 10), files }, null, 1) + '\n');
  console.log(`Базовая линия записана: ${rel(BASELINE_PATH)} (файлов с известными находками: ${Object.keys(files).length})`);
  process.exit(0);
}

let hidden = 0;
if (USE_BASELINE) {
  if (!fs.existsSync(BASELINE_PATH)) { console.error('Нет tools/quiz-baseline.json: сначала --update-baseline'); process.exit(2); }
  const base = readJson(BASELINE_PATH).files || {};
  for (const r of results) {
    const known = base[rel(r.file)] || {};
    const byCode = {};
    for (const f of r.findings) (byCode[f.code] = byCode[f.code] || []).push(f);
    const kept = [];
    for (const [code, list] of Object.entries(byCode)) {
      const k = known[code] || 0;
      hidden += Math.min(k, list.length);
      kept.push(...list.slice(k));
    }
    r.findings = kept;
  }
}

const totals = { manifests: selected.length, questions: results.reduce((a, r) => a + (r.count || 0), 0), errors: 0, warnings: 0, filesWithErrors: 0, filesWithWarnings: 0 };
const byCode = {};
for (const r of results) {
  const e = r.findings.filter(f => f.severity === 'error').length;
  const w = r.findings.filter(f => f.severity === 'warning').length;
  totals.errors += e; totals.warnings += w;
  if (e) totals.filesWithErrors++; if (w) totals.filesWithWarnings++;
  for (const f of r.findings) byCode[f.code] = (byCode[f.code] || 0) + 1;
}

if (AS_JSON) {
  console.log(JSON.stringify({ totals, byCode, files: results.filter(r => r.findings.length).map(r => ({ file: rel(r.file), findings: r.findings })) }, null, 2));
} else {
  if (!QUIET) {
    for (const r of results.filter(x => x.findings.length)) {
      console.log(rel(r.file));
      const lim = MAX_PER_FILE > 0 ? MAX_PER_FILE : r.findings.length;
      for (const f of r.findings.slice(0, lim)) console.log(`  ${f.severity === 'error' ? 'ERROR' : 'warn '} ${f.code}${f.id !== null && f.id !== undefined ? ' id=' + f.id : ''}  ${f.msg}`);
      if (r.findings.length > lim) console.log(`  ... ещё находок в файле: ${r.findings.length - lim}`);
    }
  }
  console.log('');
  console.log(`Проверено манифестов: ${totals.manifests}, вопросов: ${totals.questions}` + (USE_BASELINE ? ` · режим baseline (известных находок скрыто: ${hidden})` : ''));
  console.log(`Ошибок: ${totals.errors} (в ${totals.filesWithErrors} файлах) · предупреждений: ${totals.warnings} (в ${totals.filesWithWarnings} файлах)`);
  const codes = Object.entries(byCode).sort();
  if (codes.length) console.log('По кодам: ' + codes.map(([c, n]) => `${c}=${n}`).join(' '));
  if (!selected.some(p => fs.existsSync(path.join(path.dirname(p), 'images')))) console.log('Примечание: папок images/ рядом с манифестами нет локально (картинки хранятся в облаке и в git не попадают), проверка I001 пропущена.');
}

process.exitCode = totals.errors > 0 || (STRICT && totals.warnings > 0) ? 1 : 0;
