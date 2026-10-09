const fs = require('fs');

const baseline = new Set(fs.readFileSync('quiz/inv_before.txt', 'utf8').split(/\r?\n/).filter(Boolean));
const html = fs.readFileSync('quiz.html', 'utf8');
const currentMatches = new Set(html.match(/(?:id|data-[a-z-]+|onclick)="[^"]+"/g) || []);

const missing = [];
for (const item of baseline) {
  if (!currentMatches.has(item)) {
    missing.push(item);
  }
}

if (missing.length > 0) {
  console.error('ERROR: Inventory regression! Missing baseline items (' + missing.length + '):');
  missing.forEach(m => console.error('  - ' + m));
  process.exit(1);
} else {
  console.log('SUCCESS: All ' + baseline.size + ' baseline attributes intact. Current total: ' + currentMatches.size);
}
