#!/usr/bin/env node
/**
 * tools/preflight.mjs
 * Одна команда «перед коммитом/релизом»: запускает все проверки проекта и печатает короткую сводку.
 * Без внешних зависимостей. Ничего не меняет в файлах и не обращается к сети.
 *
 * Использование:
 *   node tools/preflight.mjs                   # все проверки
 *   node tools/preflight.mjs --only=chapters,quiz
 *   node tools/preflight.mjs --skip=repo,tests
 *   node tools/preflight.mjs --verbose         # полный вывод проваленных проверок
 *   node tools/preflight.mjs --json
 *
 * Проверки (id): tests, tables, chapters, library, quiz, i18n, sw, interactive, supabase, repo
 * Проверка supabase «мягкая»: при находках показывается как WARN и не мешает коду возврата (пока владелец не принял решение по аудиту)
 *   tests       node tests/run-all.mjs                         (нужны зависимости: npm ci --ignore-scripts)
 *   tables      node tools/validate-tables.mjs                 (нужны зависимости)
 *   chapters    node tools/validate-chapters.mjs --baseline
 *   library     node tools/validate-library.mjs --baseline
 *   quiz        node tools/validate-quiz.mjs --baseline
 *   i18n        node tools/check-quiz-i18n.mjs --baseline
 *   sw          node tools/check-sw-shell.mjs
 *   interactive node tools/list-interactive.mjs --validate
 *   supabase    node tools/check-supabase-sql.mjs        (мягкая: WARN вместо FAIL)
 *   repo        node tools/check-repo-health.mjs
 *
 * Код возврата: 0 — все выполненные проверки пройдены; 1 — есть проваленные; 2 — ошибка запуска.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const only = opt.only ? opt.only.split(',') : null;
const skip = opt.skip ? opt.skip.split(',') : [];
const VERBOSE = flags.has('--verbose'), AS_JSON = flags.has('--json');

const steps = [
  { id: 'tests', name: 'Автотесты', script: 'tests/run-all.mjs', args: [], needsDeps: true },
  { id: 'tables', name: 'Таблицы гайдлайнов', script: 'tools/validate-tables.mjs', args: [], needsDeps: true },
  { id: 'chapters', name: 'Главы (новые дефекты)', script: 'tools/validate-chapters.mjs', args: ['--baseline', '--quiet'] },
  { id: 'library', name: 'Каталог книг и глав (новые дефекты)', script: 'tools/validate-library.mjs', args: ['--baseline', '--quiet'] },
  { id: 'quiz', name: 'Манифесты квиза (новые дефекты)', script: 'tools/validate-quiz.mjs', args: ['--baseline', '--quiet'] },
  { id: 'i18n', name: 'Локализация квиза (новые отклонения)', script: 'tools/check-quiz-i18n.mjs', args: ['--baseline', '--quiet'] },
  { id: 'sw', name: 'Service Worker и оболочка PWA', script: 'tools/check-sw-shell.mjs', args: ['--quiet'] },
  { id: 'interactive', name: 'Интерактивные схемы и симуляторы', script: 'tools/list-interactive.mjs', args: ['--validate'] },
  { id: 'supabase', name: 'Безопасность SQL и Edge Functions Supabase (статическая)', script: 'tools/check-supabase-sql.mjs', args: ['--quiet'], soft: true },
  { id: 'repo', name: 'Гигиена репозитория и секреты', script: 'tools/check-repo-health.mjs', args: ['--quiet'] },
];

const depsOk = fs.existsSync(path.join(ROOT, 'node_modules', 'ajv'));
const results = [];
for (const s of steps) {
  if ((only && !only.includes(s.id)) || skip.includes(s.id)) continue;
  const file = path.join(ROOT, s.script);
  if (!fs.existsSync(file)) { results.push({ ...s, status: 'SKIP', summary: `нет файла ${s.script}` }); continue; }
  if (s.needsDeps && !depsOk) { results.push({ ...s, status: 'SKIP', summary: 'нет зависимостей: выполните npm ci --ignore-scripts' }); continue; }
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [file, ...s.args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1048576 });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  const lines = out.split('\n').map(l => l.trim()).filter(Boolean);
  const pick = lines.filter(l => /Ошибок:|error\(s\)|Итог:|ИТОГ|Провалено/.test(l));
  const summary = (pick.length ? pick.slice(-2).join(' | ') : (lines[lines.length - 1] || '')).slice(0, 190);
  results.push({ ...s, status: r.status === 0 ? 'OK' : (s.soft ? 'WARN' : 'FAIL'), summary, ms: Date.now() - t0, output: out });
}

const failed = results.filter(r => r.status === 'FAIL');
if (AS_JSON) {
  console.log(JSON.stringify({ ok: failed.length === 0, results: results.map(({ id, name, status, summary, ms }) => ({ id, name, status, summary, ms })) }, null, 2));
} else {
  console.log('Проверки перед коммитом\n');
  for (const r of results) {
    const mark = r.status === 'OK' ? 'OK  ' : r.status === 'FAIL' ? 'FAIL' : r.status === 'WARN' ? 'WARN' : 'SKIP';
    console.log(`${mark}  ${r.name}${r.ms !== undefined ? ` (${(r.ms / 1000).toFixed(1)} с)` : ''}\n      ${r.summary}`);
  }
  if (VERBOSE) for (const r of failed) { console.log(`\n===== ${r.name}: полный вывод =====\n${r.output}`); }
  console.log('');
  const skipped = results.filter(r => r.status === 'SKIP').length;
  const warned = results.filter(r => r.status === 'WARN').length;
  console.log(failed.length ? `ИТОГ: проваленных проверок ${failed.length}${skipped ? `, пропущено ${skipped}` : ''}. Подробности: node tools/preflight.mjs --verbose или запуск отдельной проверки.`
    : `ИТОГ: все выполненные проверки пройдены${warned ? ` (с предупреждениями: ${warned})` : ''}${skipped ? ` (пропущено ${skipped})` : ''}.`);
}
process.exitCode = failed.length ? 1 : 0;
