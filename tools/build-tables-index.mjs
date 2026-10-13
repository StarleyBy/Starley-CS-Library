/**
 * build-tables-index.mjs
 * Generates data/guidelines/tables-index.json for search and catalog.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data', 'guidelines');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function normalizeText(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/ё/g, 'е').replace(/[^\w\s\u0400-\u04FF-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function run() {
  const regPath = path.join(dataDir, 'guidelines.json');
  if (!fs.existsSync(regPath)) {
    console.error('No guidelines.json found');
    process.exit(1);
  }

  const registry = readJson(regPath);
  const tables = [];
  const searchRows = [];
  const guidelinesMetaList = [];

  for (const g of registry.guidelines) {
    const gDir = path.join(dataDir, g.path);
    const metaPath = path.join(gDir, 'guideline.json');
    if (!fs.existsSync(metaPath)) continue;
    const meta = readJson(metaPath);
    guidelinesMetaList.push({ meta, gDir, path: g.path });
  }

  // Sort guidelines by year descending (newest first)
  guidelinesMetaList.sort((a, b) => (b.meta.year || 0) - (a.meta.year || 0));

  for (const item of guidelinesMetaList) {
    const { meta, gDir, path: gPath } = item;
    const files = fs.readdirSync(gDir).filter(f => f.endsWith('.json') && f !== 'guideline.json');
    for (const f of files) {
      const tPath = path.join(gDir, f);
      const table = readJson(tPath);

      const tableEntry = {
        id: table.id,
        guidelineId: table.guidelineId,
        guidelineTitle: meta.title,
        guidelineShortTitle: meta.shortTitle,
        year: meta.year || 0,
        society: meta.society || '',
        number: table.number,
        type: table.type,
        title: table.title,
        tags: table.tags || [],
        relativeFilePath: `${gPath}${f}`
      };
      tables.push(tableEntry);

      if (table.type === 'recommendations' && table.sections) {
        for (const s of table.sections) {
          for (const r of s.rows || []) {
            searchRows.push({
              tableId: table.id,
              rowId: r.id,
              guideline: meta.shortTitle?.en || meta.shortTitle?.ru || g.id,
              tableNumber: table.number,
              tableTitleEn: table.title?.en || '',
              tableTitleRu: table.title?.ru || '',
              sectionTitleEn: s.title?.en || '',
              sectionTitleRu: s.title?.ru || '',
              textEn: r.text?.en || '',
              textRu: r.text?.ru || '',
              class: r.class || '',
              level: r.level || '',
              tags: table.tags || [],
              searchableEn: normalizeText(`${r.text?.en || ''} ${table.title?.en || ''} ${(table.tags || []).join(' ')}`),
              searchableRu: normalizeText(`${r.text?.ru || ''} ${table.title?.ru || ''} ${(table.tags || []).join(' ')}`)
            });
          }
        }
      }
    }
  }

  const outIndex = {
    version: '1.0',
    generated: new Date().toISOString(),
    guidelines: guidelinesMetaList.map(item => ({
      id: item.meta.id,
      year: item.meta.year || 0,
      society: item.meta.society || '',
      title: item.meta.title,
      shortTitle: item.meta.shortTitle,
      citation: item.meta.citation || '',
      tablesCount: tables.filter(t => t.guidelineId === item.meta.id).length
    })),
    totalTables: tables.length,
    totalRows: searchRows.length,
    tables,
    rows: searchRows
  };

  const outputPath = path.join(dataDir, 'tables-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(outIndex, null, 2), 'utf8');
  console.log(`✅ Tables index generated: ${outputPath} (${tables.length} tables, ${searchRows.length} rows)`);
}

run();
