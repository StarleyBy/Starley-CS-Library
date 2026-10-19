import fs from 'fs';

const lines = fs.readFileSync('C:/Users/starl/.gemini/antigravity-ide/brain/8f6df0d6-0917-42a8-b6ea-d1e2b386d9d5/.system_generated/logs/transcript.jsonl', 'utf-8').trim().split('\n');

const hcmCreated = new Set();
lines.forEach(l => {
  try {
    const j = JSON.parse(l);
    if (j.step_index >= 5120 && j.step_index <= 5369) {
      const str = JSON.stringify(j);
      const matches = str.match(/aha-hcm-2024[a-zA-Z0-9_\-\.\/]+/g);
      if (matches) {
        matches.forEach(m => hcmCreated.add(m));
      }
    }
  } catch (e) {}
});

console.log('Files mentioned in HCM steps:');
for (const f of Array.from(hcmCreated).sort()) {
  console.log(' ', f);
}
