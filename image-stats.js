#!/usr/bin/env node
// image-stats.js — статистика по размерам/разрешениям, ничего не меняет.
// Запуск: node image-stats.js --dir books

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : (args[i + 1] || def);
}
const DIR = getArg('dir', 'books');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

(async () => {
  const all = walk(DIR);
  console.log(`Файлов: ${all.length}\n`);

  const sizes = all.map(f => ({ file: f, size: fs.statSync(f).size }));
  sizes.sort((a, b) => b.size - a.size);

  const total = sizes.reduce((s, x) => s + x.size, 0);
  const top20 = sizes.slice(0, 20).reduce((s, x) => s + x.size, 0);
  const top100 = sizes.slice(0, 100).reduce((s, x) => s + x.size, 0);

  console.log('=== Топ-10 самых тяжёлых файлов ===');
  for (const x of sizes.slice(0, 10)) {
    console.log(`  ${(x.size / 1024).toFixed(0)} KB  ${x.file}`);
  }

  console.log('\n=== Распределение веса ===');
  console.log('Всего:                 ', (total / 1024 / 1024).toFixed(1), 'MB');
  console.log('Топ-20 файлов весят:   ', (top20 / 1024 / 1024).toFixed(1), 'MB', `(${(100 * top20 / total).toFixed(1)}%)`);
  console.log('Топ-100 файлов весят:  ', (top100 / 1024 / 1024).toFixed(1), 'MB', `(${(100 * top100 / total).toFixed(1)}%)`);

  // разрешения — на случайной выборке 150 файлов, чтобы не тормозить
  const sample = [...sizes].sort(() => Math.random() - 0.5).slice(0, 150);
  const dims = [];
  for (const x of sample) {
    try {
      const meta = await sharp(x.file).metadata();
      dims.push(Math.max(meta.width || 0, meta.height || 0));
    } catch {}
  }
  dims.sort((a, b) => a - b);
  const pct = p => dims[Math.floor(dims.length * p)];
  console.log('\n=== Разрешение (большая сторона, выборка', dims.length, 'файлов) ===');
  console.log('10-й перцентиль: ', pct(0.10), 'px');
  console.log('50-й (медиана):  ', pct(0.50), 'px');
  console.log('90-й перцентиль: ', pct(0.90), 'px');
  console.log('Максимум:        ', dims[dims.length - 1], 'px');
})();
