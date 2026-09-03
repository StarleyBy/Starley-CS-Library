#!/usr/bin/env node
/**
 * scripts/upload-r2.js
 *
 * Скрипт синхронизации изображений библиотеки с облачным хранилищем Cloudflare R2.
 * Сканирует директорию `books/`, находит изображения и загружает их в R2,
 * сохраняя точную относительную структуру путей.
 *
 * Поддерживает инкрементальную загрузку (кэширование в .r2-manifest.json),
 * благодаря чему повторные запуски занимают считанные секунды.
 *
 * Использование:
 *   node scripts/upload-r2.js              # Инкрементальная синхронизация
 *   node scripts/upload-r2.js --force      # Принудительная перезапись всех файлов
 *   node scripts/upload-r2.js --dry-run    # Симуляция, ничего не загружает
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// 1. Проверка конфигурации из .env
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');

const MANIFEST_PATH = path.join(__dirname, '../.r2-manifest.json');
const BOOKS_DIR = path.join(__dirname, '../books');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

function printHelp() {
  console.log(`
======================================================
  Starley Library — Cloudflare R2 Media Sync Tool
======================================================
  Перед использованием убедитесь, что в корне проекта
  создан файл .env с настройками вашей R2 корзины:

    R2_ACCOUNT_ID=ваш_account_id
    R2_ACCESS_KEY_ID=ваш_access_key
    R2_SECRET_ACCESS_KEY=ваш_secret_key
    R2_BUCKET_NAME=starley-library-media
    R2_PUBLIC_URL=https://pub-xxx.r2.dev

======================================================
`);
}

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
  printHelp();
  console.error('❌ ОШИБКА: Не заполнена конфигурация R2 в файле .env!');
  console.error('Пожалуйста, создайте/заполните .env файл по примеру выше и запустите скрипт снова.\n');
  process.exit(1);
}

// 2. Инициализация S3 Клиента для Cloudflare R2
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

// 3. Загрузка манифеста прошлых загрузок
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

function saveManifest() {
  if (!DRY_RUN) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  }
}

// 4. Сканирование файлов
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function uploadFile(filePath, key) {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = getMimeType(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);
}

// 5. Главный процесс синхронизации
(async () => {
  console.log('🔍 Сканирование локальных изображений в папке books/...');
  const allImages = walkDir(BOOKS_DIR);
  console.log(`📦 Найдено локальных изображений: ${allImages.length}`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let totalBytesUploaded = 0;

  console.log('\n🚀 Начинаю синхронизацию с Cloudflare R2...\n');

  for (let i = 0; i < allImages.length; i++) {
    const filePath = allImages[i];
    const stat = fs.statSync(filePath);
    
    // Преобразуем путь вида e:\...\books\surgery\ch1\img.jpg в относительный ключ POSIX: books/surgery/ch1/img.jpg
    const relPath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
    const key = relPath; // Ключ в R2 сохраняет ровно структуру books/...

    const cached = manifest[key];

    // Проверяем, менялся ли файл с последней выгрузки
    if (!FORCE && cached && cached.size === stat.size && cached.mtime === stat.mtimeMs) {
      skippedCount++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${allImages.length}] Загрузка: ${key} (${(stat.size / 1024).toFixed(0)} KB)... `);

    if (DRY_RUN) {
      console.log(' [DRY-RUN - пропущено]');
      uploadedCount++;
      continue;
    }

    try {
      await uploadFile(filePath, key);
      manifest[key] = {
        size: stat.size,
        mtime: stat.mtimeMs,
        uploadedAt: new Date().toISOString(),
      };
      uploadedCount++;
      totalBytesUploaded += stat.size;
      console.log('✅ OK');

      // Сохраняем манифест каждые 20 файлов на случай сбоя сети
      if (uploadedCount % 20 === 0) {
        saveManifest();
      }
    } catch (err) {
      errorCount++;
      console.log(`❌ Ошибка: ${err.message}`);
    }
  }

  saveManifest();

  console.log('\n======================================================');
  console.log('🎉 Синхронизация завершена!');
  console.log(`   Загружено новых/обновленных: ${uploadedCount}`);
  console.log(`   Пропущено (без изменений):   ${skippedCount}`);
  console.log(`   Ошибок:                      ${errorCount}`);
  console.log(`   Передано данных:             ${(totalBytesUploaded / 1024 / 1024).toFixed(2)} MB`);
  console.log('======================================================\n');
})();
