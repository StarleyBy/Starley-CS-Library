// Quick script to upload eacvi-echo-handbook to R2
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.error("Missing R2 credentials in .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function uploadFile(localPath, r2Key) {
  const ext = path.extname(localPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileContent = fs.readFileSync(localPath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3.send(command);
  console.log(`✅ Uploaded to R2: ${r2Key} (${fileContent.length} bytes)`);
}

async function main() {
  const targetDir = path.join(__dirname, '../books/cardiac-echo/eacvi-echo-handbook');
  
  function scan(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        files = files.concat(scan(full));
      } else {
        const ext = path.extname(full).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          files.push(full);
        }
      }
    }
    return files;
  }

  const allImages = scan(targetDir);
  console.log(`Found ${allImages.length} images to upload for eacvi-echo-handbook...`);

  for (const imgPath of allImages) {
    const rel = path.relative(path.join(__dirname, '..'), imgPath).replace(/\\/g, '/');
    try {
      await uploadFile(imgPath, rel);
    } catch (e) {
      console.error(`Failed ${rel}:`, e.message);
    }
  }

  console.log("Done syncing eacvi images to R2!");
}

main().catch(console.error);
