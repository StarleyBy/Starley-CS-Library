#!/usr/bin/env node
/**
 * tools/migrate-taxonomy-ids.mjs
 * Миграция устаревших и неверно размещённых ссылок на таксономию в манифестах квиза (поля disciplines / topics / tags).
 * Без внешних зависимостей. Задача агента «Таксономист» (.agents/skills/taxonomist/SKILL.md).
 *
 * Что делает: для каждого значения, которого нет в своём словаре, ищет, чем оно является:
 *   - корректный id из ДРУГОГО словаря (id темы лежит в disciplines, id тега в topics и т. п.): значение переносится в нужное поле;
 *   - точное название или алиас записи таксономии (nameEn, nameRu, aliases): заменяется на её id и ставится в нужное поле;
 *   - иначе значение «не сопоставлено»: оно не меняется, а попадает в карту с подсказками для решения человеком.
 * Правится только текст трёх массивов; остальная часть файла (отступы, порядок ключей, текст вопросов) остаётся байт в байт.
 * Перед записью делается самопроверка: все остальные данные вопросов должны остаться равными исходным, иначе файл не пишется.
 *
 * Использование:
 *   node tools/migrate-taxonomy-ids.mjs                      # ПРОБНЫЙ запуск: сводка, ничего не пишется
 *   node tools/migrate-taxonomy-ids.mjs --write-map          # + записать карту quiz/proposed/legacy-taxonomy-map.json (с подсказками)
 *   node tools/migrate-taxonomy-ids.mjs --map=путь.json      # учесть решения человека из карты (поле target у несопоставленных)
 *   node tools/migrate-taxonomy-ids.mjs --apply              # ПРИМЕНИТЬ изменения к манифестам (только по решению владельца)
 *
 * Параметры:
 *   --only=текст        обрабатывать только манифесты, в пути которых есть текст
 *   --fill-disciplines  дополнительно добавить в disciplines родительскую дисциплину каждой темы вопроса, если её там нет
 *   --json              машинный вывод сводки
 *
 * Карта (legacy-taxonomy-map.json): раздел "auto" — применяемые автоматически соответствия; раздел "unresolved" — значения без
 * однозначного соответствия, у каждого есть "suggestions" и поле "target": null. Чтобы решить: "target": {"field":"tags","id":"aortic_stenosis"}
 * или "target": "drop" (удалить значение). Применяются только заполненные target.
 *
 * Код возврата: 0; 2 — ошибка запуска или самопроверка не пройдена.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const APPLY = flags.has('--apply'), AS_JSON = flags.has('--json'), FILL = flags.has('--fill-disciplines');
const WRITE_MAP = flags.has('--write-map');
const MAP_OUT = path.join(ROOT, 'quiz', 'proposed', 'legacy-taxonomy-map.json');

const FIELDS = ['disciplines', 'topics', 'tags'];
const taxPath = path.join(ROOT, 'quiz', 'quiz-taxonomy.json');
if (!fs.existsSync(taxPath)) { console.error('Не найден quiz/quiz-taxonomy.json'); process.exit(2); }
const tax = JSON.parse(fs.readFileSync(taxPath, 'utf8'));

// ---------- словари ----------
const vocab = { disciplines: new Map(), topics: new Map(), tags: new Map() };
for (const d of tax.disciplines || []) vocab.disciplines.set(d.id, d);
for (const t of tax.topics || []) vocab.topics.set(t.id, t);
for (const t of tax.tags || []) vocab.tags.set(t.id, t);
const norm = s => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const nameIndex = new Map();   // нормализованное имя -> [{field,id}]
const tokenIndex = new Map();  // токен -> Set("field|id")
const labels = new Map();      // "field|id" -> строка для подсказки
const addName = (name, field, id) => {
  const n = norm(name); if (!n) return;
  if (!nameIndex.has(n)) nameIndex.set(n, []);
  const arr = nameIndex.get(n); if (!arr.some(x => x.field === field && x.id === id)) arr.push({ field, id });
  for (const tok of n.split(' ')) { if (tok.length < 3) continue; if (!tokenIndex.has(tok)) tokenIndex.set(tok, new Set()); tokenIndex.get(tok).add(field + '|' + id); }
};
for (const field of FIELDS) for (const [id, e] of vocab[field]) {
  labels.set(field + '|' + id, e.nameEn || e.nameRu || id);
  for (const n of [e.nameEn, e.nameRu, ...(e.aliases || [])]) addName(n, field, id);
}
const idOwners = new Map();    // id -> [field]
for (const field of FIELDS) for (const id of vocab[field].keys()) { if (!idOwners.has(id)) idOwners.set(id, []); idOwners.get(id).push(field); }

// ---------- карта решений человека ----------
let manual = {};
if (opt.map) {
  const mp = path.resolve(process.cwd(), opt.map);
  if (!fs.existsSync(mp)) { console.error('Не найдена карта: ' + opt.map); process.exit(2); }
  const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
  for (const [value, info] of Object.entries(m.unresolved || {})) if (info.target) manual[value] = info.target;
}

// ---------- подсказки для несопоставленных ----------
function suggest(value) {
  const n = norm(value); if (!n) return [];
  const toks = [...new Set(n.split(' ').filter(t => t.length >= 3))];
  const cand = new Map();
  for (const t of toks) for (const key of tokenIndex.get(t) || []) cand.set(key, (cand.get(key) || 0) + 1);
  const out = [];
  for (const [key] of cand) {
    const lab = norm(labels.get(key)); const lt = new Set(lab.split(' ')); const vt = new Set(toks);
    const inter = [...vt].filter(x => lt.has(x)).length; const uni = new Set([...vt, ...lt]).size;
    const score = inter / uni;
    if (score >= 0.34) { const [field, id] = key.split('|'); out.push({ field, id, name: labels.get(key), score: Math.round(score * 100) / 100 }); }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 3);
}

// ---------- разрешение одного значения ----------
const auto = new Map();        // value -> { to:{field,id}, how, from:Set, count }
const unresolved = new Map();  // value -> { fields:Set, count }
function resolve(value, currentField) {
  if (vocab[currentField].has(value)) return { keep: true };
  if (manual[value] !== undefined) {
    const t = manual[value];
    if (t === 'drop') return { drop: true, how: 'drop' };
    if (t && t.field && vocab[t.field] && vocab[t.field].has(t.id)) return { to: { field: t.field, id: t.id }, how: 'manual' };
  }
  const owners = idOwners.get(value) || [];
  if (owners.length === 1) return { to: { field: owners[0], id: value }, how: 'id-in-other-field' };
  if (owners.length > 1) return { ambiguous: true };
  const hits = nameIndex.get(norm(value)) || [];
  if (hits.length === 1) return { to: hits[0], how: 'name-or-alias' };
  return { ambiguous: hits.length > 1, none: hits.length === 0 };
}

// ---------- разбор текста манифеста ----------
function questionRanges(raw) {
  const m = /"questions"\s*:\s*\[/.exec(raw); if (!m) return [];
  let i = m.index + m[0].length, depth = 0, start = -1, inStr = false, esc = false; const out = [];
  for (; i < raw.length; i++) {
    const c = raw[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '{') { if (depth === 0) start = i; depth++; }
    else if (c === '}') { depth--; if (depth === 0) out.push([start, i + 1]); }
    else if (c === ']' && depth === 0) break;
  }
  return out;
}
function serializeLike(orig, arr) {
  if (!arr.length) return '[]';
  if (orig.includes('\n')) {
    const el = orig.match(/\n([ \t]*)"/); const cl = orig.match(/\n([ \t]*)\]$/);
    const elIndent = el ? el[1] : '  ', clIndent = cl ? cl[1] : '';
    const eol = orig.includes('\r\n') ? '\r\n' : '\n';
    return '[' + eol + arr.map(x => elIndent + JSON.stringify(x)).join(',' + eol) + eol + clIndent + ']';
  }
  return '[' + arr.map(x => JSON.stringify(x)).join(orig.includes('", "') ? ', ' : ',') + ']';
}

// ---------- файлы ----------
const walk = (d, out = []) => { if (!fs.existsSync(d)) return out; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, out); else out.push(p); } return out; };
let files = walk(path.join(ROOT, 'books')).filter(p => /\/quiz\/quiz-[^/]+\.json$/.test(rel(p))).sort();
if (opt.only) files = files.filter(p => rel(p).includes(opt.only));

const summary = { files: [], moved: 0, renamed: 0, dropped: 0, unresolvedValues: 0, filled: 0, skipped: 0 };
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  let data; try { data = JSON.parse(raw); } catch (e) { console.error(`Пропуск ${rel(file)}: JSON не читается`); continue; }
  const qs = data.questions || [];
  const ranges = questionRanges(raw);
  if (ranges.length !== qs.length) { console.error(`Пропуск ${rel(file)}: не удалось сопоставить вопросы с текстом (${ranges.length} против ${qs.length})`); summary.skipped++; continue; }

  const edits = [];   // { start, end, text }
  const expected = JSON.parse(raw);
  let fileMoved = 0, fileRenamed = 0, fileDropped = 0, fileFilled = 0, fileUnres = 0;

  qs.forEach((q, qi) => {
    const present = FIELDS.filter(f => Array.isArray(q[f]));
    if (!present.length) return;
    const next = { disciplines: [], topics: [], tags: [] };
    let changed = false;
    for (const field of FIELDS) {
      for (const v of q[field] || []) {
        const r = typeof v === 'string' ? resolve(v, field) : { keep: true };
        if (r.keep) { next[field].push(v); continue; }
        if (r.drop) { changed = true; fileDropped++; continue; }
        if (r.to) {
          if (!Array.isArray(q[r.to.field])) { next[field].push(v); fileUnres++; registerUnresolved(v, field); continue; }   // нет массива-приёмника: не меняем
          next[r.to.field].push(r.to.id); changed = true;
          if (r.how === 'id-in-other-field') fileMoved++; else fileRenamed++;
          registerAuto(v, field, r);
          continue;
        }
        next[field].push(v); fileUnres++; registerUnresolved(v, field);
      }
    }
    if (FILL && Array.isArray(q.disciplines)) {
      for (const t of next.topics) { const d = vocab.topics.get(t) && vocab.topics.get(t).disciplineId; if (d && vocab.disciplines.has(d) && !next.disciplines.includes(d)) { next.disciplines.push(d); changed = true; fileFilled++; } }
    }
    const dedup = a => [...new Set(a)];
    for (const f of FIELDS) next[f] = dedup(next[f]);
    // сравнить с исходным: изменяем только если что-то поменялось
    for (const f of FIELDS) if (Array.isArray(q[f]) && JSON.stringify(q[f]) !== JSON.stringify(next[f])) changed = true;
    if (!changed) return;
    // правки текста массивов
    const [s, e] = ranges[qi];
    const seg = raw.slice(s, e);
    for (const f of FIELDS) {
      if (!Array.isArray(q[f]) || JSON.stringify(q[f]) === JSON.stringify(next[f])) continue;
      const re = new RegExp(`("${f}"\\s*:\\s*)(\\[[^\\[\\]]*\\])`);
      const m = re.exec(seg);
      if (!m) { fileUnres++; continue; }
      let parsed; try { parsed = JSON.parse(m[2]); } catch { continue; }
      if (JSON.stringify(parsed) !== JSON.stringify(q[f])) continue;
      const start = s + m.index + m[1].length;
      edits.push({ start, end: start + m[2].length, text: serializeLike(m[2], next[f]) });
      expected.questions[qi][f] = next[f];
    }
  });

  summary.moved += fileMoved; summary.renamed += fileRenamed; summary.dropped += fileDropped; summary.filled += fileFilled; summary.unresolvedValues += fileUnres;
  summary.files.push({ file: rel(file), moved: fileMoved, renamed: fileRenamed, dropped: fileDropped, filled: fileFilled, unresolvedValues: fileUnres, edits: edits.length });

  if (APPLY && edits.length) {
    let out = raw;
    for (const ed of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, ed.start) + ed.text + out.slice(ed.end);
    // самопроверка: всё, кроме трёх массивов, равно исходному; массивы равны ожидаемым
    let parsedOut; try { parsedOut = JSON.parse(out); } catch (e) { console.error(`САМОПРОВЕРКА НЕ ПРОЙДЕНА ${rel(file)}: результат не JSON. Файл не записан.`); process.exit(2); }
    if (JSON.stringify(parsedOut) !== JSON.stringify(expected)) { console.error(`САМОПРОВЕРКА НЕ ПРОЙДЕНА ${rel(file)}: данные отличаются от ожидаемых. Файл не записан.`); process.exit(2); }
    fs.writeFileSync(file, out);
  }
}

function registerAuto(value, from, r) {
  if (!auto.has(value)) auto.set(value, { to: r.to, how: r.how, from: new Set(), count: 0 });
  const a = auto.get(value); a.from.add(from); a.count++;
}
function registerUnresolved(value, from) {
  if (!unresolved.has(value)) unresolved.set(value, { fields: new Set(), count: 0 });
  const u = unresolved.get(value); u.fields.add(from); u.count++;
}

// ---------- карта ----------
if (WRITE_MAP) {
  const mapObj = {
    version: 1, generated: new Date().toISOString().slice(0, 10),
    note: 'auto — применяется автоматически; unresolved — решает человек: заполните target как {"field":"tags","id":"..."} или "drop", затем запуск с --map=<этот файл>.',
    auto: Object.fromEntries([...auto].sort((a, b) => b[1].count - a[1].count).map(([v, a]) => [v, { from: [...a.from], to: a.to, how: a.how, count: a.count }])),
    unresolved: Object.fromEntries([...unresolved].sort((a, b) => b[1].count - a[1].count).map(([v, u]) => [v, { fields: [...u.fields], count: u.count, suggestions: suggest(v), target: manual[v] || null }])),
  };
  fs.mkdirSync(path.dirname(MAP_OUT), { recursive: true });
  fs.writeFileSync(MAP_OUT, JSON.stringify(mapObj, null, 1) + '\n');
}

// ---------- вывод ----------
const autoTop = [...auto].sort((a, b) => b[1].count - a[1].count).slice(0, 6);
const unTop = [...unresolved].sort((a, b) => b[1].count - a[1].count).slice(0, 6);
const result = { mode: APPLY ? 'ПРИМЕНЕНО' : 'пробный запуск (файлы не менялись)', manifests: summary.files.length, moved: summary.moved, renamed: summary.renamed, dropped: summary.dropped, filledDisciplines: summary.filled, unresolvedOccurrences: summary.unresolvedValues, distinctAuto: auto.size, distinctUnresolved: unresolved.size, perFile: summary.files.filter(f => f.edits || f.unresolvedValues) };
if (AS_JSON) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Режим: ${result.mode}`);
  console.log(`Манифестов: ${result.manifests}`);
  console.log(`Перенесено в нужное поле (корректный id в чужом поле): ${summary.moved}`);
  console.log(`Заменено по названию или алиасу: ${summary.renamed}`);
  if (summary.dropped) console.log(`Удалено по решению (drop): ${summary.dropped}`);
  if (FILL) console.log(`Добавлено родительских дисциплин: ${summary.filled}`);
  console.log(`Не сопоставлено (значения остаются как есть): ${summary.unresolvedValues} вхождений, ${unresolved.size} различных значений`);
  console.log('\nПо манифестам (правок текста / не сопоставлено):');
  for (const f of summary.files.filter(x => x.edits || x.unresolvedValues)) console.log(`  ${f.file}: ${f.edits} / ${f.unresolvedValues}`);
  if (autoTop.length) { console.log('\nЧаще всего автоматически:'); for (const [v, a] of autoTop) console.log(`  ${a.count} × "${v}" -> ${a.to.field}:${a.to.id} (${a.how})`); }
  if (unTop.length) { console.log('\nЧаще всего без соответствия:'); for (const [v, u] of unTop) console.log(`  ${u.count} × "${v}" [${[...u.fields].join(',')}]`); }
  if (WRITE_MAP) console.log(`\nКарта записана: ${rel(MAP_OUT)}`);
  if (!APPLY) console.log('\nФайлы манифестов не менялись. Применить: --apply (только по решению владельца; перед этим коммит или резервная копия).');
  else console.log('\nГотово. Дальше: node tools/validate-quiz.mjs, затем node scripts/generate-taxonomy-bridge.js (счётчики) и пересборка поискового индекса.');
}
