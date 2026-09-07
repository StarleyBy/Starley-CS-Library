const fs = require('fs');
const path = require('path');

const hookPath = path.join(__dirname, '../.git/hooks/pre-commit');
const hookDir = path.dirname(hookPath);

if (!fs.existsSync(hookDir)) {
  console.log('📁 Директория .git/hooks не найдена (не git репозиторий).');
  process.exit(0);
}

const hookContent = `#!/bin/sh
# Git pre-commit hook for Starley CS Library
# Автоматическая синхронизация изображений с Cloudflare R2 перед каждом коммитом

echo "🚀 [Pre-commit] Автоматическая синхронизация изображений с Cloudflare R2..."
node scripts/upload-r2.js

if [ $? -ne 0 ]; then
  echo "❌ Ошибка при синхронизации медиа с Cloudflare R2. Коммит отменен."
  exit 1
fi

echo "✅ Синхронизация с Cloudflare R2 выполнена успешно!"
exit 0
`;

fs.writeFileSync(hookPath, hookContent, { encoding: 'utf8', mode: 0o755 });
console.log('✅ Git pre-commit hook успешно установлен в .git/hooks/pre-commit');
