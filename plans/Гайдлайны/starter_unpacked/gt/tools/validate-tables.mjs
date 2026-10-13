#!/usr/bin/env node
// Usage: node tools/validate-tables.mjs [dataDir=data/guidelines]
// Requires: npm i -D ajv
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.resolve(process.argv[2] || path.join(root, 'data/guidelines'));
const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
const schema = (n) => readJson(path.join(root, 'schema', n));
const vTable = ajv.compile(schema('guideline-table.schema.json'));
const vGuide = ajv.compile(schema('guideline.schema.json'));
const vLegend = ajv.compile(schema('legend.schema.json'));

let errors = 0, warnings = 0;
const err = (f, m) => { errors++; console.error(`ERROR  ${f}: ${m}`); };
const warn = (f, m) => { warnings++; console.warn(`warn   ${f}: ${m}`); };
const schemaErrors = (f, v) => v.errors.forEach(e => err(f, `${e.instancePath || '/'} ${e.message}${e.params?.additionalProperty ? ` (${e.params.additionalProperty})` : ''}`));

// legends
const legends = new Set();
const legDir = path.join(dataDir, 'legends');
for (const f of fs.existsSync(legDir) ? fs.readdirSync(legDir) : []) {
  const p = path.join(legDir, f), j = readJson(p);
  if (!vLegend(j)) schemaErrors(f, vLegend); else legends.add(j.id);
  if (j.id + '.json' !== f) err(f, `legend id "${j.id}" must match file name`);
}

// registry
const registry = readJson(path.join(dataDir, 'guidelines.json'));
const texts = (o, out = []) => { // collect i18n objects
  if (Array.isArray(o)) o.forEach(x => texts(x, out));
  else if (o && typeof o === 'object') { if (typeof o.en === 'string' && Object.keys(o).every(k => k === 'en' || k === 'ru')) out.push(o); else Object.values(o).forEach(x => texts(x, out)); }
  return out;
};

for (const { id, path: rel } of registry.guidelines) {
  const gdir = path.join(dataDir, rel);
  const gj = readJson(path.join(gdir, 'guideline.json'));
  if (!vGuide(gj)) schemaErrors(`${id}/guideline.json`, vGuide);
  if (gj.id !== id || path.basename(path.resolve(gdir)) !== id) err(id, 'guideline id, registry id and folder name must be equal');
  if (!legends.has(gj.legend)) err(id, `legend "${gj.legend}" not found`);
  const tableIds = new Set();

  for (const f of fs.readdirSync(gdir).filter(f => f !== 'guideline.json' && f.endsWith('.json'))) {
    const tag = `${id}/${f}`, t = readJson(path.join(gdir, f));
    if (!vTable(t)) { schemaErrors(tag, vTable); continue; }
    if (t.guidelineId !== id) err(tag, `guidelineId "${t.guidelineId}" ≠ folder "${id}"`);
    if (tableIds.has(t.id)) err(tag, `duplicate table id ${t.id}`); tableIds.add(t.id);

    // collect rows / ids
    const rows = t.type === 'recommendations' ? t.sections.flatMap(s => s.rows) : t.rows;
    const local = new Set(), seen = (kind, x) => { const k = kind + ':' + x; if (local.has(k)) err(tag, `duplicate ${kind} id "${x}"`); local.add(k); };
    (t.sections || []).forEach(s => seen('section', s.id));
    rows.forEach(r => seen('row', r.id));
    if (t.source?.expectedRows && t.source.expectedRows !== rows.length) err(tag, `expectedRows=${t.source.expectedRows} but found ${rows.length}`);

    // notes: targets and references
    const colIds = t.type === 'recommendations' ? ['text', 'class', 'level'] : t.columns.map(c => c.id);
    for (const [nid, n] of Object.entries(t.notes || {})) {
      const [kind, rest] = n.target.split(':');
      if (kind === 'section' && !local.has('section:' + rest)) err(tag, `note ${nid}: unknown ${n.target}`);
      if (kind === 'row' && !local.has('row:' + rest)) err(tag, `note ${nid}: unknown ${n.target}`);
      if (kind === 'cell') { const [r, c] = rest.split('.'); if (!local.has('row:' + r) || !colIds.includes(c)) err(tag, `note ${nid}: unknown ${n.target}`); }
    }
    const refNotes = (o) => { if (Array.isArray(o)) o.forEach(refNotes); else if (o && typeof o === 'object') { if (Array.isArray(o.notes)) o.notes.forEach(n => { if (!t.notes?.[n]) err(tag, `unknown note id "${n}"`); }); Object.entries(o).forEach(([k, v]) => k !== 'notes' && refNotes(v)); } };
    refNotes(t.sections || t.rows);
    if (t.type === 'grid') rows.forEach(r => { const span = r.cells.reduce((a, c) => a + (c.colspan || 1), 0); if (span !== t.columns.length) err(tag, `row ${r.id}: cells span ${span} ≠ ${t.columns.length} columns`); });

    // footnote markers + RU coverage
    const all = texts(t.type === 'recommendations' ? t.sections : t.rows).concat(texts(t.title));
    let missingRu = 0;
    for (const x of all) {
      for (const [, k] of x.en.matchAll(/\^\[([a-z]{1,2})\]/g)) if (!t.footnotes?.[k]) err(tag, `footnote marker ^[${k}] has no footnote`);
      if (x.ru) for (const [, k] of x.ru.matchAll(/\^\[([a-z]{1,2})\]/g)) if (!t.footnotes?.[k]) err(tag, `RU footnote marker ^[${k}] has no footnote`);
      if (x.ru) { const m = (s) => (s.match(/\^\[[a-z]{1,2}\]/g) || []).join(''); if (m(x.en) !== m(x.ru)) err(tag, `footnote markers differ EN/RU: "${x.en.slice(0, 40)}…"`); }
      if (!x.ru) missingRu++;
    }
    if (missingRu) warn(tag, `${missingRu} text(s) without RU`);
    if (missingRu === 0 && t.i18nStatus?.ru === 'missing') warn(tag, 'i18nStatus.ru=missing but RU is complete');
    console.log(`ok     ${tag}: ${rows.length} rows, ${Object.keys(t.notes || {}).length} notes, RU status=${t.i18nStatus?.ru ?? '—'}`);
  }
}
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
