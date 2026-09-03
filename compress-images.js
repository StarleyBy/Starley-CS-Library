#!/usr/bin/env node
/**
 * compress-images.js
 *
 * Разумное сжатие сканов книг для StarleyBy CS Library.
 * Сначала запусти в режиме --dry-run на выборке файлов, чтобы увидеть
 * оценку экономии ДО того, как трогать все 15 000+ файлов.
 *
 * Установка:
 *   npm install sharp
 *
 * Оценка на выборке (ничего не меняет на диске):
 *   node compress-images.js --dir books --dry-run --sample 80
 *
 * Реальный прогон (перезаписывает файлы на месте):
 *   node compress-images.js --dir books --quality 85 --max-dimension 2000
 *
 * Параметры:
 *   --dir            папка для обхода (по умолчанию: books)
 *   --quality        качество JPEG 1-100 (по умолчанию: 85 — безопасно для текста)
 *   --max-dimension  максимальная сторона в пикселях, больше — ужимается (по умолчанию: 2000)
 *   --dry-run        только оценка на случайной выборке, ничего не пишет
 *   --sample         сколько файлов брать в выборку для --dry-run (по умолчанию: 80)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = process.argv.slice(2);
function getArg(name, def) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  return v === undefined ? true : v;
}

const DIR = getArg('dir', 'books');
const QUALITY = parseInt(getArg('quality', '85'), 10);
const MAX_DIM = parseInt(getArg('max-dimension', '2000'), 10);
const DRY_RUN = args.includes('--dry-run');
const SAMPLE = parseInt(getArg('sample', '80'), 10);

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function humanMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function compressBuffer(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const image = sharp(inputPath).rotate(); // rotate() = respect EXIF orientation, then strip it
  const meta = await image.metadata();

  let pipeline = image.resize({
    width: MAX_DIM,
    height: MAX_DIM,
    fit: 'inside',
    withoutEnlargement: true, // никогда не увеличиваем маленькие картинки
  });

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: 85, compressionLevel: 9, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  const buffer = await pipeline.toBuffer();
  return { buffer, meta };
}

async function dryRun() {
  console.log(`Ищу изображения в "${DIR}"...`);
  const all = walk(DIR);
  console.log(`Найдено файлов: ${all.length}`);

  // случайная выборка, чтобы оценка была честной по всему дереву, а не только по первым файлам
  const shuffled = all.sort(() => Math.random() - 0.5).slice(0, Math.min(SAMPLE, all.length));

  let origTotal = 0;
  let newTotal = 0;
  let failed = 0;

  for (const file of shuffled) {
    try {
      const origSize = fs.statSync(file).size;
      const { buffer } = await compressBuffer(file);
      origTotal += origSize;
      newTotal += buffer.length;
    } catch (e) {
      failed++;
      console.warn(`  не удалось обработать: ${file} (${e.message})`);
    }
  }

  const ratio = newTotal / origTotal;
  console.log('\n=== Оценка по выборке из', shuffled.length, 'файлов ===');
  console.log('Было (выборка):   ', humanMB(origTotal));
  console.log('Стало (выборка):  ', humanMB(newTotal));
  console.log('Коэффициент сжатия:', (ratio * 100).toFixed(1) + '% от исходного размера');
  if (failed) console.log('Ошибок при обработке:', failed);

  // экстраполяция на весь корпус
  const allSize = all.reduce((sum, f) => sum + fs.statSync(f).size, 0);
  console.log('\n=== Прогноз на весь корпус (', all.length, 'файлов ) ===');
  console.log('Сейчас весит:     ', humanMB(allSize));
  console.log('Ожидаемо после:   ', humanMB(allSize * ratio));
  console.log('\nЕсли устраивает — запусти без --dry-run для реального прогона.');
}

async function realRun() {
  console.log(`Ищу изображения в "${DIR}"...`);
  const all = walk(DIR);
  console.log(`Найдено файлов: ${all.length}. Начинаю сжатие (quality=${QUALITY}, max-dimension=${MAX_DIM})...\n`);

  let origTotal = 0;
  let newTotal = 0;
  let done = 0;
  let failed = 0;

  for (const file of all) {
    try {
      const origSize = fs.statSync(file).size;
      const { buffer } = await compressBuffer(file);

      // атомарная запись: сначала во временный файл, потом переименование
      const tmp = file + '.tmp';
      fs.writeFileSync(tmp, buffer);
      fs.renameSync(tmp, file);

      origTotal += origSize;
      newTotal += buffer.length;
      done++;
      if (done % 250 === 0) {
        console.log(`  ...${done}/${all.length} обработано (пока сэкономлено ${humanMB(origTotal - newTotal)})`);
      }
    } catch (e) {
      failed++;
      console.warn(`  ошибка на файле ${file}: ${e.message}`);
    }
  }

  console.log('\n=== Готово ===');
  console.log('Обработано файлов:', done, 'из', all.length);
  console.log('Ошибок:           ', failed);
  console.log('Было:             ', humanMB(origTotal));
  console.log('Стало:            ', humanMB(newTotal));
  console.log('Сэкономлено:      ', humanMB(origTotal - newTotal));
}

(async () => {
  if (!fs.existsSync(DIR)) {
    console.error(`Папка "${DIR}" не найдена. Запускай скрипт из корня репозитория.`);
    process.exit(1);
  }
  if (DRY_RUN) {
    await dryRun();
  } else {
    console.log('ВНИМАНИЕ: это перезапишет оригинальные файлы на месте.');
    console.log('Если ещё не коммитил текущее состояние в git — сначала сделай commit,');
    console.log('чтобы при необходимости можно было откатиться через git checkout.\n');
    await realRun();
  }
})();
