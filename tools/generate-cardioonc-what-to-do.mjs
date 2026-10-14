import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, '../data/guidelines/esc-cardioonc-2022');
const files = fs.readdirSync(baseDir).filter(f => /^rt\d+.*\.json$/.test(f)).sort((a, b) => {
  const numA = parseInt(a.match(/rt(\d+)/)[1], 10);
  const numB = parseInt(b.match(/rt(\d+)/)[1], 10);
  return numA - numB;
});

const sections = [];
let globalRowCount = 0;

for (const file of files) {
  const filePath = path.join(baseDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const num = parseInt(file.match(/rt(\d+)/)[1], 10);

  const sectionRows = [];
  for (const sec of (data.sections || [])) {
    for (const r of (sec.rows || [])) {
      if (r.class === 'I' || r.class === 'III') {
        globalRowCount++;
        sectionRows.push({
          id: `r${String(globalRowCount).padStart(2, '0')}`,
          text: r.text,
          class: r.class,
          level: r.level
        });
      }
    }
  }

  if (sectionRows.length > 0) {
    sections.push({
      id: `sec-rt${num}`,
      title: {
        en: data.title.en,
        ru: data.title.ru
      },
      rows: sectionRows
    });
  }
}

const whatToDo = {
  schemaVersion: 1,
  id: 'esc-cardioonc-2022.t14-what-to-do',
  guidelineId: 'esc-cardioonc-2022',
  number: 'Table 14 (What to do)',
  type: 'recommendations',
  title: {
    en: "'What to do' and 'what not to do' messages from the Guidelines",
    ru: "Ключевые положения «Что делать» и «Чего не делать» из руководства"
  },
  tags: [
    'cardio-oncology',
    'what-to-do',
    'what-not-to-do',
    'summary',
    'class-i',
    'class-iii'
  ],
  sections: sections
};

const targetPath = path.join(baseDir, 't14-what-to-do.json');
fs.writeFileSync(targetPath, JSON.stringify(whatToDo, null, 2), 'utf8');
console.log(`✅ Successfully generated t14-what-to-do.json with ${sections.length} sections and ${globalRowCount} rows.`);
