#!/usr/bin/env node
/**
 * tools/map-functions.mjs
 * Карта функций большого JS-файла: имя, строки начала и конца, размер, вложенность, разделы-комментарии.
 * Нужна, чтобы агент читал огромные файлы (assets/js/quiz.js ~10 000 строк) по диапазонам, а не целиком.
 * Без внешних зависимостей. Разбор приблизительный (лексический, не полноценный парсер JS): для точной правки
 * всегда открывай найденный диапазон и проверяй границы глазами.
 *
 * Использование:
 *   node tools/map-functions.mjs assets/js/quiz.js                 # вся карта + разделы
 *   node tools/map-functions.mjs assets/js/quiz.js --top           # только функции верхнего уровня
 *   node tools/map-functions.mjs assets/js/quiz.js --find=timer    # функции, в имени которых есть подстрока (без учёта регистра)
 *   node tools/map-functions.mjs assets/js/quiz.js --at=4210       # какая функция содержит строку 4210
 *   node tools/map-functions.mjs assets/js/quiz.js --min=80        # только функции от 80 строк
 *   node tools/map-functions.mjs assets/js/quiz.js --biggest=15    # 15 самых больших
 *   node tools/map-functions.mjs assets/js/quiz.js --json
 *
 * Код возврата: 0; 2 — ошибка запуска.
 */

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const file = argv.find(a => !a.startsWith('--'));
const flag = n => argv.includes('--' + n);
const val = n => { const a = argv.find(x => x.startsWith('--' + n + '=')); return a ? a.split('=').slice(1).join('=') : null; };
if (!file) { console.error('Укажите файл: node tools/map-functions.mjs <файл.js> [--top|--find=текст|--at=строка|--min=N|--biggest=N|--json]'); process.exit(2); }
if (!fs.existsSync(file)) { console.error('Не найден файл: ' + file); process.exit(2); }

const src = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const lines = src.split('\n');

// ---------- лексер: превращает код в «очищенный» текст той же длины (строки, комментарии, regex -> пробелы) ----------
function clean(text) {
  const out = text.split('');
  const n = text.length;
  let i = 0, prevSig = '';        // последний значимый символ — для распознавания regex
  const tplStack = [];            // для ${ ... } внутри шаблонных строк
  const blank = (a, b) => { for (let k = a; k < b; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = text[i], d = text[i + 1];
    if (c === '/' && d === '/') { const j = text.indexOf('\n', i); const e = j < 0 ? n : j; blank(i, e); i = e; continue; }
    if (c === '/' && d === '*') { const j = text.indexOf('*/', i + 2); const e = j < 0 ? n : j + 2; blank(i, e); i = e; continue; }
    if (c === '\'' || c === '"') {
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== '\n') { if (text[j] === '\\') j++; j++; }
      blank(i + 1, j); i = j + 1; prevSig = c; continue;
    }
    if (c === '`') {
      let j = i + 1;
      while (j < n && text[j] !== '`') {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === '$' && text[j + 1] === '{') {
          // вложенное выражение: пропускаем с учётом скобок
          let depth = 1, k = j + 2;
          while (k < n && depth > 0) { if (text[k] === '{') depth++; else if (text[k] === '}') depth--; k++; }
          blank(j, k); j = k; continue;
        }
        j++;
      }
      blank(i + 1, j); i = j + 1; prevSig = '`'; continue;
    }
    if (c === '/' && '(,=:[!&|?{};+-*%<>~^'.includes(prevSig || '(')) {
      // литерал регулярного выражения
      let j = i + 1, inClass = false;
      while (j < n && text[j] !== '\n') {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === '[') inClass = true; else if (text[j] === ']') inClass = false;
        else if (text[j] === '/' && !inClass) break;
        j++;
      }
      if (j < n && text[j] === '/') { blank(i + 1, j); i = j + 1; prevSig = ')'; continue; }
    }
    if (!/\s/.test(c)) prevSig = c;
    i++;
  }
  return out.join('');
}

const cleaned = clean(src);
const clines = cleaned.split('\n');

// смещения начала строк для перевода позиции в номер строки
const lineStart = []; { let p = 0; for (const l of clines) { lineStart.push(p); p += l.length + 1; } }
const lineOf = pos => { let lo = 0, hi = lineStart.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (lineStart[m] <= pos) lo = m; else hi = m - 1; } return lo + 1; };

// сопоставление скобок на очищенном тексте
const closeOf = new Map(); { const st = []; for (let i = 0; i < cleaned.length; i++) { const c = cleaned[i]; if (c === '{') st.push(i); else if (c === '}') { const o = st.pop(); if (o !== undefined) closeOf.set(o, i); } } }

// ---------- поиск объявлений ----------
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'else', 'do', 'with', 'try', 'typeof', 'new', 'await', 'super']);
const decls = [];
const patterns = [
  { kind: 'function', re: /(?:^|[\s;{}(])(?:export\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)\s*\(/g },
  { kind: 'func-expr', re: /(?:^|[\s;{}])(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b/g },
  { kind: 'arrow', re: /(?:^|[\s;{}])(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*=>/g },
  { kind: 'assigned', re: /(?:^|[\s;{}])((?:window|self|globalThis|module\.exports|exports|[A-Za-z_$][\w$]*)\.[A-Za-z_$][\w$.]*)\s*=\s*(?:async\s+)?(?:function\b|(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*=>)/g },
  { kind: 'method', re: /(?:^|\n)[ \t]*(?:static\s+)?(?:async\s+)?(?:get\s+|set\s+)?([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\{/g },
];
for (const { kind, re } of patterns) {
  let m;
  while ((m = re.exec(cleaned))) {
    const name = m[1];
    if (kind === 'method' && KEYWORDS.has(name)) continue;
    const declPos = m.index + m[0].indexOf(name);
    // тело: первая «{» после заголовка (для стрелок без {} — одна строка)
    let bodyOpen = -1;
    const after = cleaned.indexOf('=>', declPos);
    if ((kind === 'arrow' || kind === 'assigned') && after >= 0 && after < declPos + 400) {
      const rest = cleaned.slice(after + 2, after + 80).trimStart();
      if (!rest.startsWith('{')) { decls.push({ name, kind, start: lineOf(declPos), end: lineOf(declPos), }); continue; }
    }
    const searchFrom = kind === 'arrow' && after >= 0 ? after : declPos;
    bodyOpen = cleaned.indexOf('{', searchFrom);
    if (bodyOpen < 0) continue;
    // «{» должна быть близко к заголовку (не дальше 600 символов), иначе это не тело функции
    if (bodyOpen - declPos > 600) continue;
    const close = closeOf.get(bodyOpen);
    if (close === undefined) continue;
    decls.push({ name, kind, start: lineOf(declPos), end: lineOf(close) });
  }
}

// убрать дубли (одна и та же функция могла подойти под два шаблона) и вычислить вложенность
decls.sort((a, b) => a.start - b.start || b.end - a.end);
const uniq = [];
for (const d of decls) { const dup = uniq.find(u => u.start === d.start && u.name === d.name); if (!dup) uniq.push(d); }
for (const d of uniq) {
  d.size = d.end - d.start + 1;
  d.depth = uniq.filter(o => o !== d && o.start <= d.start && o.end >= d.end && (o.start < d.start || o.end > d.end)).length;
}

// ---------- разделы (комментарии-баннеры) ----------
const sections = [];
lines.forEach((l, i) => {
  const t = l.trim();
  let m = t.match(/^\/\/\s*[=\-─━#*]{3,}\s*(.*?)\s*[=\-─━#*]*\s*$/);          // // ===== Заголовок =====
  if (m && m[1]) sections.push({ line: i + 1, title: m[1] });
  else if ((m = t.match(/^\/\/\s*[=\-─━]{2,}\s*(.+?)\s*[=\-─━]{2,}\s*$/))) sections.push({ line: i + 1, title: m[1] });
  else if ((m = t.match(/^\/\*+\s*[=\-─━#*]*\s*([^*]{4,}?)\s*[=\-─━#*]*\s*\*+\/$/))) sections.push({ line: i + 1, title: m[1] });
});

// ---------- фильтры ----------
let list = uniq;
if (flag('top')) { const minDepth = Math.min(...uniq.map(d => d.depth)); list = list.filter(d => d.depth <= minDepth + (uniq.some(d => d.depth === minDepth && d.size > lines.length * 0.5) ? 1 : 0)); }
if (val('find')) { const q = val('find').toLowerCase(); list = list.filter(d => d.name.toLowerCase().includes(q)); }
if (val('min')) list = list.filter(d => d.size >= Number(val('min')));
if (val('at')) { const at = Number(val('at')); list = uniq.filter(d => d.start <= at && d.end >= at).sort((a, b) => b.depth - a.depth); }
if (val('biggest')) list = [...list].sort((a, b) => b.size - a.size).slice(0, Number(val('biggest')));

const rel = path.relative(process.cwd(), path.resolve(file)).split(path.sep).join('/');
if (flag('json')) {
  console.log(JSON.stringify({ file: rel, lines: lines.length, functions: uniq.length, sections, items: list }, null, 2));
} else {

console.log(`${rel}: строк ${lines.length}, найдено функций ${uniq.length}, разделов-комментариев ${sections.length}`);
const showSections = !val('find') && !val('at') && !val('min') && !val('biggest');
if (showSections && sections.length) {
  console.log('\nРазделы:');
  for (const s of sections) console.log(`  L${s.line}  ${s.title}`);
}
console.log('\nФункции (L<начало>–L<конец> (<размер>) вид имя):');
const merged = [...list].sort((a, b) => a.start - b.start);
for (const d of merged) {
  const pad = '  '.repeat(Math.min(d.depth, 4));
  console.log(`  ${pad}L${d.start}–L${d.end} (${d.size}) ${d.kind} ${d.name}`);
}
if (!flag('json') && !val('biggest') && !val('at') && !val('find') && !val('min')) {
  const big = [...uniq].sort((a, b) => b.size - a.size).slice(0, 8);
  console.log('\nСамые большие функции: ' + big.map(d => `${d.name} (${d.size})`).join(', '));
}
console.log('\nПримечание: границы получены лексическим разбором; перед правкой откройте диапазон и убедитесь в границах.');
}
