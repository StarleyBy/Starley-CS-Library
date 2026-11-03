#!/usr/bin/env node
/**
 * tools/validate-library.mjs
 * Согласованность каталога библиотеки: library.json <-> папки книг <-> books/**\/metadata.json <-> файлы глав.
 * Без внешних зависимостей. Правила — из навыка catalogist (.agents/skills/catalogist/SKILL.md).
 *
 * Использование:
 *   node tools/validate-library.mjs                    # все книги (сводка + первые находки)
 *   node tools/validate-library.mjs <книга> ...        # конкретные книги: путь вида books/icu/marino или icu/marino
 *   node tools/validate-library.mjs --baseline         # только НОВЫЕ находки относительно tools/library-baseline.json
 *   node tools/validate-library.mjs --update-baseline  # записать текущее состояние
 *
 * Параметры: --json, --quiet, --strict, --max=N (находок на книгу и код в выводе, по умолчанию 6; 0 — без лимита)
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Раскладка файлов (как её читает читалка):
 *   запись главы  { "file": "chapter-05.md" }   ->  chapters/chapter-05/chapter-05.md  (запасной вариант: chapters/chapter-05.md)
 *   подглава      { "file": "chapter-05-02.md" } внутри "subchapters" ->  chapters/chapter-05/chapter-05-02.md (папка родителя)
 *   приложение    { "file": "chapter-Appendix 1.md" } в "appendices" ->  chapters/chapter-Appendix 1/chapter-Appendix 1.md
 *   переводы: <имя>-ru.md, <имя>-he.md рядом с основным файлом
 *
 * Коды:
 *   C001 ошибка   книга есть в library.json, но нет папки или metadata.json
 *   C002 ошибка   папка книги с metadata.json не внесена в library.json
 *   C003 ошибка   путь категории из library.json не существует
 *   C010 ошибка   в file нет расширения .md (опечатка вроде "chapter-31md": глава не откроется)
 *   C011 ошибка   файл главы из metadata.json не найден на диске
 *   C012 предупр. файл главы на диске не внесён в metadata.json
 *   C013 ошибка   дубль file в metadata.json
 *   C014 предупр. пустой title или russian у главы
 *   C015 предупр. номер в title не совпадает с номером в имени файла
 *   C016 предупр. пропуски в нумерации основных глав
 *   C017 предупр. имя файла не соответствует имени папки главы (например, chapter-.md в папке chapter-50)
 *   C020 предупр. versions.russian=true, но файлов -ru.md нет совсем / есть не у всех глав
 *   C021 предупр. versions.russian=false, но файлы -ru.md есть (влияет только на бейдж RU на карточке книги)
 *   C022 предупр. то же для иврита: true без файлов -he.md
 *   C023 предупр. versions.hebrew=false, но файлы -he.md есть
 *   C024 предупр. versions.original=false, но файлы глав есть
 *   C030 предупр. quiz=true, но у книги нет манифестов quiz/ и quiz_sets
 *   C031 предупр. quiz_sets указывает на несуществующий файл
 *   C040 ошибка   metadata.json не читается или нет объекта книги / title
 *   C041 предупр. нет russian_title или cover_image
 *   C042 предупр. category (теги книги) не массив строк
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const targets = argv.filter(a => !a.startsWith('--'));
const AS_JSON = flags.has('--json'), QUIET = flags.has('--quiet'), STRICT = flags.has('--strict');
const USE_BASELINE = flags.has('--baseline'), UPDATE_BASELINE = flags.has('--update-baseline');
const MAX = opt.max !== undefined ? Number(opt.max) : 6;
const BASELINE_PATH = path.join(ROOT, 'tools', 'library-baseline.json');

const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const libPath = path.join(ROOT, 'library.json');
if (!fs.existsSync(libPath)) { console.error('Не найден library.json'); process.exit(2); }
let lib; try { lib = readJson(libPath); } catch (e) { console.error('library.json не читается: ' + e.message); process.exit(2); }

const results = new Map();   // ключ — путь файла, к которому относится находка
const add = (file, severity, code, msg) => { if (!results.has(file)) results.set(file, []); results.get(file).push({ severity, code, msg }); };

// ---------- library.json ----------
const libBooks = new Set();      // 'books/icu/marino'
const categories = lib.categories || [];
for (const c of categories) {
  const catDir = path.join(ROOT, c.path || '');
  if (!c.path || !fs.existsSync(catDir)) { add('library.json', 'error', 'C003', `Категория "${c.id}": путь не существует (${c.path})`); continue; }
  for (const b of c.books || []) {
    const bookRel = `${c.path}/${b.folder}`;
    libBooks.add(bookRel);
    if (!fs.existsSync(path.join(ROOT, bookRel, 'metadata.json'))) add('library.json', 'error', 'C001', `${c.id}/${b.folder}: нет папки или metadata.json (${bookRel}/metadata.json)`);
  }
  for (const d of fs.readdirSync(catDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const bookRel = `${c.path}/${d.name}`;
    if (!libBooks.has(bookRel) && fs.existsSync(path.join(ROOT, bookRel, 'metadata.json'))) add('library.json', 'error', 'C002', `${bookRel}: есть metadata.json, но книга не внесена в library.json`);
  }
}

// ---------- книги ----------
const normTarget = t => t.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^books\//, 'books/');
const wanted = targets.map(normTarget).map(t => (t.startsWith('books/') ? t : 'books/' + t).replace(/\/$/, ''));
const bookDirs = [];
for (const c of categories) for (const b of c.books || []) {
  const bookRel = `${c.path}/${b.folder}`;
  if (wanted.length && !wanted.includes(bookRel)) continue;
  if (fs.existsSync(path.join(ROOT, bookRel, 'metadata.json'))) bookDirs.push(bookRel);
}
if (wanted.length && !bookDirs.length) { console.error('Книги не найдены в library.json: ' + targets.join(', ')); process.exit(2); }

const listMd = dir => { const out = []; const walk = d => { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.toLowerCase().endsWith('.md')) out.push(p); } }; walk(dir); return out; };
const parseNum = s => { const m = String(s || '').match(/^\s*(\d+)(?:\.(\d+))?[.\s]/); return m ? [Number(m[1]), m[2] ? Number(m[2]) : null] : null; };
const parseFileNum = f => { const m = String(f).match(/^chapter-(\d+)(?:-(\d+))?\.md$/); return m ? [Number(m[1]), m[2] ? Number(m[2]) : null] : null; };
const sameNum = (a, b) => a[0] === b[0] && a[1] === b[1];

let booksChecked = 0;
for (const bookRel of bookDirs) {
  booksChecked++;
  const metaRel = `${bookRel}/metadata.json`;
  const bdir = path.join(ROOT, bookRel), chdir = path.join(bdir, 'chapters');
  let m;
  try { const raw = readJson(path.join(ROOT, metaRel)); m = Array.isArray(raw) ? raw[0] : raw; }
  catch (e) { add(metaRel, 'error', 'C040', 'metadata.json не читается: ' + e.message); continue; }
  if (!m || typeof m !== 'object') { add(metaRel, 'error', 'C040', 'В metadata.json нет объекта книги'); continue; }
  if (!m.title) add(metaRel, 'error', 'C040', 'Нет title');
  if (!m.russian_title) add(metaRel, 'warning', 'C041', 'Нет russian_title');
  if (!m.cover_image) add(metaRel, 'warning', 'C041', 'Нет cover_image');
  if (m.category !== undefined && !(Array.isArray(m.category) && m.category.every(x => typeof x === 'string'))) add(metaRel, 'warning', 'C042', 'category должен быть массивом строк-тегов');

  // собрать записи
  const entries = [];       // { file, e, parent, appendix }
  const walk = (list, parent) => { for (const e of list || []) { entries.push({ file: e.file || '', e, parent }); if (e.subchapters) walk(e.subchapters, e); } };
  walk(m.chapters, null);
  for (const ap of m.appendices || []) entries.push({ file: ap.file || '', e: ap, parent: null, appendix: true });

  const seen = new Set();
  let ruHave = 0, ruMissing = 0, heHave = 0, existing = 0;
  const registered = new Set();
  for (const { file, e, parent, appendix } of entries) {
    registered.add(file);
    if (seen.has(file)) add(metaRel, 'error', 'C013', `Дубль file: ${file}`); seen.add(file);
    if (!e.title) add(metaRel, 'warning', 'C014', `${file}: пустой title`);
    if (!e.russian) add(metaRel, 'warning', 'C014', `${file}: пустой russian`);
    if (!file.endsWith('.md')) { add(metaRel, 'error', 'C010', `file "${file}" без расширения .md: глава не откроется`); continue; }
    const stem = file.slice(0, -3);
    const folder = parent ? path.join(chdir, parent.file.replace(/\.md$/, '')) : path.join(chdir, stem);
    let found = path.join(folder, file);
    let flat = false;
    if (!fs.existsSync(found)) { const alt = path.join(chdir, file); if (fs.existsSync(alt)) { found = alt; flat = true; } else { add(metaRel, 'error', 'C011', `Нет файла главы: ${rel(path.join(folder, file))}`); continue; } }
    existing++;
    const dirOf = path.dirname(found);
    if (fs.existsSync(path.join(dirOf, stem + '-ru.md'))) ruHave++; else ruMissing++;
    if (fs.existsSync(path.join(dirOf, stem + '-he.md'))) heHave++;
    // номер в title и в имени файла
    if (!appendix) {
      const a = parseNum(e.title), b = parseFileNum(file);
      if (a && b && !sameNum(a, b)) add(metaRel, 'warning', 'C015', `${file}: номер в title "${String(e.title).slice(0, 32)}" не совпадает с номером файла`);
    }
    void flat;
  }

  // файлы на диске, которых нет в metadata.json, и несоответствие имени папке
  const onDisk = listMd(chdir).filter(p => !/-(ru|he|starley)\.md$/i.test(p));
  for (const p of onDisk) {
    const base = path.basename(p);
    if (!registered.has(base)) add(metaRel, 'warning', 'C012', `На диске есть, в metadata.json нет: ${rel(p)}`);
    const folderName = path.basename(path.dirname(p));
    if (path.dirname(p) !== chdir) {
      const stem = base.slice(0, -3);
      if (stem !== folderName && !stem.startsWith(folderName + '-')) add(metaRel, 'warning', 'C017', `Имя файла не соответствует имени папки: ${rel(p)}`);
    }
  }

  // нумерация основных глав
  const nums = entries.filter(x => !x.parent && !x.appendix).map(x => (String(x.file).match(/^chapter-(\d+)\.md$/) || [])[1]).filter(Boolean).map(Number);
  if (nums.length > 1) {
    const set = new Set(nums), gaps = [];
    for (let i = Math.min(...nums); i <= Math.max(...nums); i++) if (!set.has(i)) gaps.push(i);
    if (gaps.length) add(metaRel, 'warning', 'C016', `Пропуски в нумерации основных глав: ${gaps.slice(0, 8).join(', ')}${gaps.length > 8 ? '…' : ''}`);
  }

  // флаги версий (в приложении влияют на бейджи EN/RU/HE на карточке книги)
  const v = m.versions || {};
  if (v.russian && ruHave === 0) add(metaRel, 'warning', 'C020', 'versions.russian=true, но нет ни одного -ru.md');
  else if (v.russian && ruMissing > 0) add(metaRel, 'warning', 'C020', `versions.russian=true, но у ${ruMissing} из ${ruHave + ruMissing} глав нет -ru.md`);
  if (!v.russian && ruHave > 0) add(metaRel, 'warning', 'C021', `versions.russian=false, но -ru.md есть у ${ruHave} глав (бейдж RU не показывается)`);
  if (v.hebrew && heHave === 0) add(metaRel, 'warning', 'C022', 'versions.hebrew=true, но нет ни одного -he.md');
  if (!v.hebrew && heHave > 0) add(metaRel, 'warning', 'C023', `versions.hebrew=false, но -he.md есть у ${heHave} глав (бейдж HE не показывается)`);
  if (!v.original && existing > 0) add(metaRel, 'warning', 'C024', `versions.original=false, но файлы глав есть (${existing}): бейдж EN не показывается`);

  // квиз
  const manifests = fs.existsSync(path.join(bdir, 'quiz')) ? fs.readdirSync(path.join(bdir, 'quiz')).filter(n => /^quiz-.*\.json$/.test(n)) : [];
  if (m.quiz === true && !manifests.length && !(m.quiz_sets || []).length) add(metaRel, 'warning', 'C030', 'quiz=true, но нет манифестов quiz/ и quiz_sets');
  for (const qs of m.quiz_sets || []) if (!fs.existsSync(path.join(bdir, qs.file || ''))) add(metaRel, 'warning', 'C031', `quiz_sets[${qs.id}]: нет файла ${qs.file}`);
}

// ---------- базовая линия и вывод ----------
const countsOf = list => { const c = {}; for (const f of list) c[f.code] = (c[f.code] || 0) + 1; return c; };
if (UPDATE_BASELINE) {
  const files = {}; for (const [f, list] of results) files[f] = countsOf(list);
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ version: 1, generated: new Date().toISOString().slice(0, 10), files }, null, 1) + '\n');
  console.log(`Базовая линия записана: ${rel(BASELINE_PATH)} (файлов с известными находками: ${Object.keys(files).length})`);
  process.exit(0);
}
let hidden = 0;
if (USE_BASELINE) {
  if (!fs.existsSync(BASELINE_PATH)) { console.error('Нет tools/library-baseline.json: сначала --update-baseline'); process.exit(2); }
  const base = readJson(BASELINE_PATH).files || {};
  for (const [f, list] of results) {
    const known = base[f] || {}, by = {};
    for (const x of list) (by[x.code] = by[x.code] || []).push(x);
    const kept = [];
    for (const [code, l] of Object.entries(by)) { const k = known[code] || 0; hidden += Math.min(k, l.length); kept.push(...l.slice(k)); }
    results.set(f, kept);
  }
}

const all = [...results.entries()].filter(([, l]) => l.length);
const errors = all.reduce((a, [, l]) => a + l.filter(x => x.severity === 'error').length, 0);
const warnings = all.reduce((a, [, l]) => a + l.filter(x => x.severity === 'warning').length, 0);
const byCode = {}; for (const [, l] of all) for (const x of l) byCode[x.code] = (byCode[x.code] || 0) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({ books: booksChecked, errors, warnings, byCode, files: all.map(([file, findings]) => ({ file, findings })) }, null, 2));
} else {
  if (!QUIET) {
    for (const [file, list] of all) {
      console.log(file);
      const byC = {};
      for (const x of list) (byC[x.code] = byC[x.code] || []).push(x);
      for (const [code, l] of Object.entries(byC)) {
        const lim = MAX > 0 ? MAX : l.length;
        for (const x of l.slice(0, lim)) console.log(`  ${x.severity === 'error' ? 'ERROR' : 'warn '} ${x.code}  ${x.msg}`);
        if (l.length > lim) console.log(`  ... ещё ${code}: ${l.length - lim}`);
      }
    }
  }
  console.log('');
  console.log(`Проверено книг: ${booksChecked}, категорий: ${categories.length}` + (USE_BASELINE ? ` · режим baseline (известных находок скрыто: ${hidden})` : ''));
  console.log(`Ошибок: ${errors} · предупреждений: ${warnings}` + (Object.keys(byCode).length ? ' · по кодам: ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join(' ') : ''));
}
process.exitCode = errors > 0 || (STRICT && warnings > 0) ? 1 : 0;
