#!/usr/bin/env node
/**
 * tools/check-quiz-i18n.mjs
 * Проверка локализации интерфейса квиза (RU/EN) без смешения языков.
 * Файлы: quiz.html, assets/js/quiz.js, assets/js/quiz-i18n.js. Без внешних зависимостей.
 * Правила — из навыка quiz-ux (.agents/skills/quiz-ux/SKILL.md).
 *
 * Использование:
 *   node tools/check-quiz-i18n.mjs                    # полная проверка (сводка + первые находки)
 *   node tools/check-quiz-i18n.mjs --baseline         # только НОВЫЕ находки относительно tools/quiz-i18n-baseline.json
 *   node tools/check-quiz-i18n.mjs --update-baseline  # записать текущее состояние
 *
 * Параметры:
 *   --json     машинный вывод
 *   --quiet    только итог
 *   --max=N    максимум находок на файл и код в выводе (по умолчанию 8; 0 — без лимита)
 *   --strict   предупреждения тоже дают код возврата 1
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды:
 *   L001 ошибка      ключ есть в одном словаре (En/Ru), в другом нет
 *   L002 предупр.    значение одинаково в En и Ru (вероятно, не переведено)
 *   L003 ошибка      в коде вызывается tQuiz('ключ'), которого нет в словаре En
 *   L004 предупр.    ключ словаря нигде не используется (нет вызова tQuiz и атрибутов data-i18n*)
 *   L010 предупр.    смешение языков в одной статической подписи в quiz.html (кириллица и латиница в одном title/placeholder/тексте)
 *   L011 предупр.    строка интерфейса только на русском, захардкоженная в quiz.js (вне словаря и вне пар «RU/EN»)
 *   L012 инфо        встроенный перевод «isRu ? 'ру' : 'en'» вместо ключа словаря (кандидат на перенос в quiz-i18n.js)
 *   L013 предупр.    видимый текст в quiz.html без data-i18n (не переключается при смене языка)
 *   L020 предупр.    язык по умолчанию — русский (по плану владельца интерфейс квиза по умолчанию английский: при пустой настройке сейчас откроется русский)
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const FILES = {
  html: path.join(ROOT, 'quiz.html'),
  js: path.join(ROOT, 'assets', 'js', 'quiz.js'),
  i18n: path.join(ROOT, 'assets', 'js', 'quiz-i18n.js'),
};
const BASELINE_PATH = path.join(ROOT, 'tools', 'quiz-i18n-baseline.json');

const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const AS_JSON = flags.has('--json'), QUIET = flags.has('--quiet'), STRICT = flags.has('--strict');
const USE_BASELINE = flags.has('--baseline'), UPDATE_BASELINE = flags.has('--update-baseline');
const MAX = opt.max !== undefined ? Number(opt.max) : 8;

for (const f of Object.values(FILES)) if (!fs.existsSync(f)) { console.error('Не найден файл: ' + rel(f)); process.exit(2); }
const read = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

const findings = [];   // { file, severity, code, line, msg }
const add = (file, severity, code, line, msg) => findings.push({ file: rel(file), severity, code, line, msg });

const CYR = /[А-Яа-яЁё]/;
const LAT_WORD = /[A-Za-z]{4,}/;
const CYR_WORD = /[А-Яа-яЁё]{4,}/;

// ---------- словари ----------
function loadDictionaries() {
  const sandbox = {
    window: {}, localStorage: { getItem: () => null },
    document: { documentElement: {}, querySelectorAll: () => [] },
    CustomEvent: class { constructor(n, d) { this.type = n; this.detail = d && d.detail; } },
    console,
  };
  sandbox.window.state = null; sandbox.window.dispatchEvent = () => {};
  vm.createContext(sandbox);
  vm.runInContext(read(FILES.i18n), sandbox, { timeout: 2000 });
  return sandbox.window.StarleyQuizI18N;
}
let DICT;
try { DICT = loadDictionaries(); } catch (e) { console.error('Не удалось выполнить quiz-i18n.js: ' + e.message); process.exit(2); }
const en = DICT.En || {}, ru = DICT.Ru || {};
const i18nLines = read(FILES.i18n).split('\n');
const keyLine = k => { const i = i18nLines.findIndex(l => new RegExp(`^\\s*${k}\\s*:`).test(l)); return i >= 0 ? i + 1 : 0; };

// L001 / L002
for (const k of Object.keys(en)) if (!(k in ru)) add(FILES.i18n, 'error', 'L001', keyLine(k), `Ключ "${k}" есть в En, нет в Ru`);
for (const k of Object.keys(ru)) if (!(k in en)) add(FILES.i18n, 'error', 'L001', keyLine(k), `Ключ "${k}" есть в Ru, нет в En`);
for (const k of Object.keys(en)) {
  if (!(k in ru)) continue;
  const a = String(en[k]).trim(), b = String(ru[k]).trim();
  if (a === b && /[A-Za-zА-Яа-я]{3,}/.test(a) && !/^(OK|QUIZ|EN|RU|Quiz)$/i.test(a)) add(FILES.i18n, 'warning', 'L002', keyLine(k), `Значение "${a.slice(0, 40)}" одинаково в En и Ru (ключ ${k})`);
}

// ---------- использование ключей ----------
const html = read(FILES.html), js = read(FILES.js);
const used = new Set();
const reCall = /\b(?:tQuiz|window\.tQuiz)\(\s*(['"`])([A-Za-z0-9_.]+)\1/g;
for (const [text, file] of [[js, FILES.js], [html, FILES.html]]) {
  const lns = text.split('\n');
  lns.forEach((l, i) => {
    let m; reCall.lastIndex = 0;
    while ((m = reCall.exec(l))) { used.add(m[2]); if (!(m[2] in en)) add(file, 'error', 'L003', i + 1, `tQuiz('${m[2]}'): ключа нет в словаре En`); }
    const re2 = /data-i18n(?:-title|-ph)?=["']([A-Za-z0-9_.]+)["']/g;
    while ((m = re2.exec(l))) { used.add(m[1]); if (!(m[1] in en)) add(file, 'error', 'L003', i + 1, `data-i18n="${m[1]}": ключа нет в словаре En`); }
  });
}
// динамические ключи (tQuiz(переменная)) не учитываем — они могут «спасти» часть ключей, но это тоже сигнал к переносу на явные ключи
const unusedKeys = Object.keys(en).filter(k => !used.has(k));
for (const k of unusedKeys) add(FILES.i18n, 'warning', 'L004', keyLine(k), `Ключ "${k}" не используется ни в quiz.js, ни в quiz.html`);

// ---------- quiz.html: смешение языков и непереводимый текст ----------
{
  const lns = html.split('\n');
  let inScript = false, inStyle = false, inComment = false;
  lns.forEach((raw, i) => {
    let l = raw;
    if (/<script\b/i.test(l)) inScript = !/<\/script>/i.test(l);
    else if (inScript) { if (/<\/script>/i.test(l)) inScript = false; return; }
    if (/<style\b/i.test(l)) inStyle = !/<\/style>/i.test(l);
    else if (inStyle) { if (/<\/style>/i.test(l)) inStyle = false; return; }
    if (inComment) { if (l.includes('-->')) { inComment = false; l = l.slice(l.indexOf('-->') + 3); } else return; }
    l = l.replace(/<!--.*?-->/g, '');
    if (l.includes('<!--')) { inComment = true; l = l.slice(0, l.indexOf('<!--')); }
    // атрибуты
    for (const m of l.matchAll(/\b(title|placeholder|aria-label|alt)="([^"]*)"/g)) {
      const v = m[2];
      if (CYR_WORD.test(v) && LAT_WORD.test(v)) add(FILES.html, 'warning', 'L010', i + 1, `${m[1]}="${v.slice(0, 60)}": два языка в одной подписи`);
    }
    // текстовые узлы между тегами
    for (const m of l.matchAll(/>([^<>]{2,})</g)) {
      const t = m[1].replace(/&[a-z]+;/gi, ' ').trim();
      if (!/[A-Za-zА-Яа-я]{2,}/.test(t)) continue;
      if (/^\{\{|^\$\{/.test(t)) continue;
      if (CYR_WORD.test(t) && LAT_WORD.test(t)) add(FILES.html, 'warning', 'L010', i + 1, `Текст "${t.slice(0, 60)}": два языка в одной подписи`);
      // L013: видимый текст без data-i18n в той же открывающей разметке
      const before = l.slice(0, m.index + 1);
      const openTag = before.slice(before.lastIndexOf('<'));
      if (!/data-i18n/.test(openTag) && !/^<(script|style|option)/i.test(openTag)) add(FILES.html, 'warning', 'L013', i + 1, `Текст "${t.slice(0, 50)}" без data-i18n`);
    }
  });
}

// ---------- quiz.js ----------
{
  const lns = js.split('\n');
  const BILINGUAL_DATA = /\b\w*[Rr]u\s*:/;   // nameRu: 'x', ctaRu: 'x', ru: 'x' — пары данных RU/EN допустимы
  const RU_EN_PAIR = /(?:isRu|isRussian|lang\s*===?\s*['"]Ru['"]|settings\.lang\s*===?\s*['"]Ru['"]|currentLang\s*===?\s*['"]Ru['"])\s*\?/;
  lns.forEach((raw, i) => {
    const code = raw.replace(/\/\/.*$/, '');          // грубо отрезаем комментарий
    if (/^\s*(\*|\/\*)/.test(raw)) return;
    if (/\.key\s*===|\bkey\s*===/.test(code)) return;   // сочетания клавиш в русской раскладке
    if (/^\s*[?:]\s*['"`]/.test(code) && CYR.test(code)) { add(FILES.js, 'info', 'L012', i + 1, `Встроенный перевод (многострочный): ${code.trim().slice(0, 90)}`); return; }
    if (RU_EN_PAIR.test(code) && /['"`]/.test(code)) { add(FILES.js, 'info', 'L012', i + 1, `Встроенный перевод: ${code.trim().slice(0, 90)}`); return; }
    if (!/['"`][^'"`\n]*[А-Яа-яЁё][^'"`\n]*['"`]/.test(code)) return;
    if (BILINGUAL_DATA.test(code)) return;            // пары данных nameRu/nameEn — допустимы
    if (/\bconsole\.(log|warn|error|info)\b/.test(code)) return;   // отладочные сообщения
    if (/\.(includes|test|match|indexOf|startsWith|endsWith|replace|split)\(|new RegExp|\/[^/\n]*[А-Яа-яЁё][^/\n]*\/[gimsu]*[.,;)]/.test(code)) return;   // сопоставление с текстом (классификация), а не интерфейс
    add(FILES.js, 'warning', 'L011', i + 1, `Русский текст вне словаря: ${code.trim().slice(0, 90)}`);
  });
  // L020: язык по умолчанию
  lns.forEach((raw, i) => {
    if (/(getItem\(\s*['"]starley_quiz_lang['"]\s*\)\s*\|\|\s*['"]Ru['"])|(lang\s*:\s*['"]Ru['"])|(:\s*['"]Ru['"]\s*;?\s*$)/.test(raw) && /lang/i.test(raw) && !/===/.test(raw)) add(FILES.js, 'warning', 'L020', i + 1, `Язык по умолчанию «Ru»: ${raw.trim().slice(0, 100)}`);
  });
  i18nLines.forEach((raw, i) => { if (/return\s+['"]Ru['"]\s*;/.test(raw) || /\|\|\s*['"]Ru['"]/.test(raw) && /lang/i.test(raw)) add(FILES.i18n, 'warning', 'L020', i + 1, `Язык по умолчанию «Ru»: ${raw.trim().slice(0, 100)}`); });
}

// ---------- базовая линия ----------
const key = f => `${f.file}`;
const countsBy = list => { const c = {}; for (const f of list) { c[f.file] = c[f.file] || {}; c[f.file][f.code] = (c[f.file][f.code] || 0) + 1; } return c; };

if (UPDATE_BASELINE) {
  fs.writeFileSync(BASELINE_PATH, JSON.stringify({ version: 1, generated: new Date().toISOString().slice(0, 10), files: countsBy(findings) }, null, 1) + '\n');
  console.log(`Базовая линия записана: ${rel(BASELINE_PATH)} (находок: ${findings.length})`);
  process.exit(0);
}
let shown = findings, hidden = 0;
if (USE_BASELINE) {
  if (!fs.existsSync(BASELINE_PATH)) { console.error('Нет tools/quiz-i18n-baseline.json: сначала --update-baseline'); process.exit(2); }
  const base = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')).files || {};
  shown = [];
  const grouped = {};
  for (const f of findings) (grouped[f.file + '|' + f.code] = grouped[f.file + '|' + f.code] || []).push(f);
  for (const [k, list] of Object.entries(grouped)) {
    const [file, code] = k.split('|');
    const known = (base[file] || {})[code] || 0;
    hidden += Math.min(known, list.length);
    shown.push(...list.slice(known));
  }
}

const errors = shown.filter(f => f.severity === 'error').length;
const warnings = shown.filter(f => f.severity === 'warning').length;
const infos = shown.filter(f => f.severity === 'info').length;
const byCode = {}; for (const f of shown) byCode[f.code] = (byCode[f.code] || 0) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({ errors, warnings, infos, byCode, dictionary: { en: Object.keys(en).length, ru: Object.keys(ru).length, used: used.size }, findings: shown }, null, 2));
} else {
  if (!QUIET) {
    const groups = {};
    for (const f of shown) (groups[f.file + ' ' + f.code] = groups[f.file + ' ' + f.code] || []).push(f);
    for (const [k, list] of Object.entries(groups)) {
      const lim = MAX > 0 ? MAX : list.length;
      console.log(`${k}  (${list.length})`);
      for (const f of list.slice(0, lim)) console.log(`  ${f.severity === 'error' ? 'ERROR' : f.severity === 'info' ? 'info ' : 'warn '} :${f.line}  ${f.msg}`);
      if (list.length > lim) console.log(`  ... ещё: ${list.length - lim}`);
    }
  }
  console.log('');
  console.log(`Словари: En ${Object.keys(en).length} ключей, Ru ${Object.keys(ru).length}; используется в коде: ${used.size}` + (USE_BASELINE ? ` · режим baseline (известных находок скрыто: ${hidden})` : ''));
  console.log(`Ошибок: ${errors} · предупреждений: ${warnings} · сведений: ${infos}` + (Object.keys(byCode).length ? ' · по кодам: ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join(' ') : ''));
}
process.exitCode = errors > 0 || (STRICT && warnings > 0) ? 1 : 0;
