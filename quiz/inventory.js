const fs = require('fs');

const html = fs.readFileSync('quiz.html', 'utf8');
const matches = html.match(/(?:id|data-[a-z-]+|onclick)="[^"]+"/g) || [];
const unique = Array.from(new Set(matches)).sort();

fs.writeFileSync('quiz/inv_before.txt', unique.join('\n'), 'utf8');
console.log('Baseline snapshot complete:', unique.length, 'attributes recorded in quiz/inv_before.txt');
