#!/usr/bin/env node
/**
 * tools/check-repo-health.mjs
 * Гигиена репозитория: размер файлов и истории, секреты, остатки LFS, лишнее в git, хук R2,
 * что попадёт на сайт GitHub Pages, несинхронизированные картинки. Без внешних зависимостей, сеть не используется.
 * Правила — из навыка repo-keeper (.agents/skills/repo-keeper/SKILL.md).
 *
 * Использование:
 *   node tools/check-repo-health.mjs               # проверка текущего состояния
 *   node tools/check-repo-health.mjs --history     # + анализ истории git (самые тяжёлые файлы, число версий)
 *
 * Параметры:
 *   --json     машинный вывод
 *   --quiet    только итог
 *   --strict   предупреждения тоже дают код возврата 1
 *
 * Исключения: файл tools/repo-health-allow.json (необязательный), записи вида
 *   { "code": "G001", "file": "search/search-index.json", "reason": "решение владельца от 2026-10-25" }
 * Секреты (G005) молча не скрываются никогда. Владелец может осознанно принять риск: запись с "acknowledged": true и причиной
 * переводит находку из ошибки в предупреждение «принято владельцем» (она остаётся видимой при каждом запуске).
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды:
 *   G001 предупр./ошибка  отслеживаемый файл крупный: от 50 МиБ — предупреждение (GitHub предупреждает), от 90 МиБ — ошибка (жёсткий предел push 100 МиБ)
 *   G002 ошибка           в git отслеживается картинка из books/** (картинки хранятся в облаке R2 и игнорируются)
 *   G003 предупр.         в git отслеживаются резервные и временные файлы (.orig, .backup, .bak, .tmp, .log, ~)
 *   G004 ошибка           в git отслеживается .env (кроме .env.example)
 *   G005 ошибка           в отслеживаемом файле найден секрет (токен бота, ключ доступа, приватный ключ, ключ service_role); значение маскируется
 *   G006 предупр.         workflow просит LFS (lfs: true), но LFS не используется (.gitattributes без filter=lfs, указателей нет)
 *   G007 ошибка           в рабочем дереве есть LFS-указатели (файл не скачан, а заменён заглушкой)
 *   G008 предупр.         хук pre-commit для R2 не установлен или не вызывает scripts/upload-r2.js (npm run setup-hooks)
 *   G009 предупр.         в .gitignore нет обязательных записей (.env, .r2-manifest.json, node_modules/, картинки books/**)
 *   G010 предупр.         файлы и папки разработки, не удаляемые шагом очистки workflow, попадут на сайт GitHub Pages
 *   G011 предупр.         в git отслеживаются документы и архивы (pdf, docx, zip) вне books/**
 *   G012 предупр.         локальные картинки books/** не синхронизированы с R2 по записям .r2-manifest.json (изменены или новые)
 *   G020 инфо             (--history) самые тяжёлые версии файлов в истории и число версий
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--')));
const AS_JSON = flags.has('--json'), QUIET = flags.has('--quiet'), STRICT = flags.has('--strict'), HISTORY = flags.has('--history');

const MiB = 1048576;
const git = (cmd, opts = {}) => execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * MiB, stdio: ['ignore', 'pipe', 'ignore'], ...opts });
let tracked;
try { tracked = git('ls-files -z').split('\0').filter(Boolean); }
catch { console.error('Не git-репозиторий или git недоступен'); process.exit(2); }
tracked = tracked.filter(f => fs.existsSync(path.join(ROOT, f)));   // файлы, удалённые в рабочем дереве, но ещё не закоммиченные, не считаем

const findings = [];
const add = (severity, code, file, msg) => findings.push({ severity, code, file, msg });

// ---------- G001: размер ----------
for (const f of tracked) {
  let size = 0;
  try { size = fs.statSync(path.join(ROOT, f)).size; } catch { continue; }
  if (size >= 90 * MiB) add('error', 'G001', f, `${(size / MiB).toFixed(1)} МиБ: близко к жёсткому пределу GitHub (100 МиБ на файл), push скоро будет отклонён`);
  else if (size >= 50 * MiB) add('warning', 'G001', f, `${(size / MiB).toFixed(1)} МиБ: GitHub предупреждает от 50 МиБ; каждая пересборка добавляет в историю новый тяжёлый объект`);
}

// ---------- G002–G004, G011 ----------
const IMG = /\.(jpe?g|png|webp|gif)$/i;
for (const f of tracked) {
  if (f.startsWith('books/') && IMG.test(f)) add('error', 'G002', f, 'Картинка из books/** отслеживается git (должна жить в R2 и игнорироваться)');
  if (/(\.orig|\.backup|\.bak|\.tmp|\.log|~)$/i.test(f) || /(^|\/)(\.DS_Store|Thumbs\.db)$/.test(f)) add('warning', 'G003', f, 'Резервный или временный файл в git');
  if (/(^|\/)\.env(\..+)?$/.test(f) && !/\.env\.example$/.test(f)) add('error', 'G004', f, '.env отслеживается git: секреты окажутся в репозитории');
  if (!f.startsWith('books/') && /\.(pdf|docx?|zip|7z|rar|pptx?)$/i.test(f)) {
    let size = 0; try { size = fs.statSync(path.join(ROOT, f)).size; } catch { /* файл удалён */ }
    add('warning', 'G011', f, `Документ/архив в git (${(size / MiB).toFixed(1)} МиБ) вне books/**; если папка не очищается в workflow, он публикуется на сайте`);
  }
}

// ---------- G005: секреты ----------
const mask = s => s.slice(0, 3) + '…(скрыто)';
const SECRET_PATTERNS = [
  { name: 'токен Telegram-бота', re: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/g },
  { name: 'ключ доступа AWS/R2', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'токен GitHub', re: /\b(?:ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,})\b/g },
  { name: 'приватный ключ', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'ключ OpenAI-подобный', re: /\bsk-[A-Za-z0-9]{32,}\b/g },
];
const JWT = /\beyJ[A-Za-z0-9_-]{15,}\.(eyJ[A-Za-z0-9_-]{15,})\.[A-Za-z0-9_-]{10,}\b/g;
const SKIP_SCAN = /^(books\/|search\/search-index\.json$|package-lock\.json$|data\/guidelines\/tables-index\.json$)/;
for (const f of tracked) {
  if (SKIP_SCAN.test(f)) continue;
  const abs = path.join(ROOT, f);
  let st; try { st = fs.statSync(abs); } catch { continue; }
  if (st.size > 3 * MiB || /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|zip|mp3|mp4)$/i.test(f)) continue;
  let text; try { text = fs.readFileSync(abs, 'utf8'); } catch { continue; }
  if (text.includes('\0')) continue;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const p of SECRET_PATTERNS) {
      p.re.lastIndex = 0;
      let m; while ((m = p.re.exec(line))) add('error', 'G005', `${f}:${i + 1}`, `Найден секрет (${p.name}): ${mask(m[0])}. Его нужно отозвать у выпустившего сервиса и убрать из кода; чистка истории не заменяет отзыв`);
    }
    JWT.lastIndex = 0;
    let j; while ((j = JWT.exec(line))) {
      try {
        const payload = JSON.parse(Buffer.from(j[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
        if (payload.role && payload.role !== 'anon') add('error', 'G005', `${f}:${i + 1}`, `JWT с ролью "${payload.role}" (не anon): серверный ключ в клиентском репозитории`);
      } catch { /* не JWT */ }
    }
  });
}

// ---------- G006, G007: LFS ----------
{
  const attrPath = path.join(ROOT, '.gitattributes');
  const attrs = fs.existsSync(attrPath) ? fs.readFileSync(attrPath, 'utf8') : '';
  const usesLfsAttr = /filter=lfs/.test(attrs);
  let pointers = [];
  try { pointers = git('grep -l "git-lfs.github.com/spec/v1" -- . ":!tools" ":!.agents" ":!plans"').split('\n').filter(Boolean); } catch { /* ничего не найдено */ }
  for (const p of pointers) add('error', 'G007', p, 'LFS-указатель в дереве: файл не скачан');
  const wfDir = path.join(ROOT, '.github', 'workflows');
  if (fs.existsSync(wfDir)) {
    for (const wf of fs.readdirSync(wfDir).filter(n => /\.ya?ml$/.test(n))) {
      const text = fs.readFileSync(path.join(wfDir, wf), 'utf8');
      const m = text.match(/^\s*lfs:\s*true\s*$/m);
      if (m && !usesLfsAttr && !pointers.length) add('warning', 'G006', `.github/workflows/${wf}`, 'lfs: true, хотя LFS не используется (.gitattributes без filter=lfs, указателей нет): лишнее обращение к LFS при каждой сборке');
    }
  }
}

// ---------- G008: хук ----------
{
  const hook = path.join(ROOT, '.git', 'hooks', 'pre-commit');
  if (!fs.existsSync(hook)) add('warning', 'G008', '.git/hooks/pre-commit', 'Хук не установлен (npm run setup-hooks): коммит не синхронизирует картинки с R2');
  else if (!/upload-r2\.js/.test(fs.readFileSync(hook, 'utf8'))) add('warning', 'G008', '.git/hooks/pre-commit', 'Хук не вызывает scripts/upload-r2.js (npm run setup-hooks)');
}

// ---------- G009: .gitignore ----------
{
  const gi = fs.existsSync(path.join(ROOT, '.gitignore')) ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8') : '';
  const need = [['.env', /^\.env\s*$/m], ['.r2-manifest.json', /^\.r2-manifest\.json\s*$/m], ['node_modules/', /^node_modules\/?\s*$/m], ['картинки books/** (jpg, png, webp, gif)', /^books\/\*\*\/\*\.(jpg|jpeg|png|webp|gif)\s*$/m]];
  for (const [label, re] of need) if (!re.test(gi)) add('warning', 'G009', '.gitignore', `Нет записи: ${label}`);
}

// ---------- G010: что попадёт на сайт ----------
{
  const wfDir = path.join(ROOT, '.github', 'workflows');
  let removed = new Set(), hasCleanStep = false;
  if (fs.existsSync(wfDir)) {
    for (const wf of fs.readdirSync(wfDir).filter(n => /\.ya?ml$/.test(n))) {
      const text = fs.readFileSync(path.join(wfDir, wf), 'utf8');
      const m = text.match(/rm\s+-rf\s+([^\n]+)/);
      if (m) { hasCleanStep = true; m[1].trim().split(/\s+/).forEach(x => removed.add(x.replace(/\/$/, ''))); }
    }
  }
  if (hasCleanStep) {
    const DEV = ['tools', 'tests', 'scratch', 'plans', 'combain', 'AGENTS.md', 'Master_prompt.md', 'scripts', 'supabase', 'package.json', 'package-lock.json', 'SEARCH_GUIDE.md'];   // скрытые файлы и папки (.agents, .github, .env.example) не перечисляем: действие публикации их, как правило, исключает
    const topLevel = new Set(tracked.map(f => f.split('/')[0]));
    const leaks = DEV.filter(d => topLevel.has(d) && !removed.has(d));
    if (leaks.length) add('warning', 'G010', '.github/workflows', `Шаг очистки удаляет только: ${[...removed].join(', ') || '—'}. На сайт GitHub Pages могут попасть: ${leaks.join(', ')}. Решение владельца: расширить строку rm -rf (проверьте, что приложение к этим путям не обращается)`);
  }
}

// ---------- G012: несинхронизированные картинки ----------
{
  const manifestPath = path.join(ROOT, '.r2-manifest.json');
  const booksDir = path.join(ROOT, 'books');
  const IMGX = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
  if (fs.existsSync(manifestPath) && fs.existsSync(booksDir)) {
    let manifest = {}; try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch { /* повреждён */ }
    let local = 0, dirty = 0; const sample = [];
    const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (IMGX.has(path.extname(e.name).toLowerCase())) { local++; const st = fs.statSync(p); const c = manifest[rel(p)]; if (!c || c.size !== st.size || c.mtime !== st.mtimeMs) { dirty++; if (sample.length < 3) sample.push(rel(p)); } } } };
    walk(booksDir);
    if (dirty) add('warning', 'G012', '.r2-manifest.json', `Не синхронизировано с R2: ${dirty} из ${local} локальных картинок (например: ${sample.join(', ')}). Выгрузка идёт при коммите (хук) или командой npm run sync-media`);
  }
}

// ---------- G020: история ----------
let historyInfo = null;
if (HISTORY) {
  try {
    const out = git('rev-list --objects --all');
    const withNames = out.split('\n').filter(l => l.includes(' '));
    const objs = withNames.map(l => l.split(' ')[0]).join('\n');
    const info = execSync('git cat-file --batch-check="%(objectname) %(objecttype) %(objectsize)"', { cwd: ROOT, input: objs, encoding: 'utf8', maxBuffer: 256 * MiB }).split('\n');
    const nameOf = new Map(withNames.map(l => { const i = l.indexOf(' '); return [l.slice(0, i), l.slice(i + 1)]; }));
    const byPath = {};
    for (const l of info) { const [h, t, s] = l.split(' '); if (t !== 'blob') continue; const p = nameOf.get(h); if (!p) continue; const size = Number(s); (byPath[p] = byPath[p] || { versions: 0, total: 0, max: 0 }); byPath[p].versions++; byPath[p].total += size; byPath[p].max = Math.max(byPath[p].max, size); }
    const heavy = Object.entries(byPath).filter(([, v]) => v.total > 20 * MiB).sort((a, b) => b[1].total - a[1].total).slice(0, 8);
    historyInfo = heavy.map(([p, v]) => ({ file: p, versions: v.versions, totalMiB: +(v.total / MiB).toFixed(0), maxMiB: +(v.max / MiB).toFixed(1) }));
    for (const h of historyInfo) add('info', 'G020', h.file, `В истории ${h.versions} версий, суммарно ${h.totalMiB} МиБ (без сжатия), самая тяжёлая ${h.maxMiB} МиБ`);
    try { const cnt = git('count-objects -vH'); const m = cnt.match(/size-pack:\s*(.+)/); if (m) add('info', 'G020', '.git', `Размер упакованной истории: ${m[1].trim()}`); } catch { /* ignore */ }
  } catch (e) { add('warning', 'G020', '.git', 'Не удалось проанализировать историю: ' + String(e.message).split('\n')[0]); }
}

// ---------- исключения ----------
let allowed = 0, acknowledged = 0;
const allowPath = path.join(ROOT, 'tools', 'repo-health-allow.json');
let shown = findings;
if (fs.existsSync(allowPath)) {
  try {
    const allow = JSON.parse(fs.readFileSync(allowPath, 'utf8')).allow || [];
    shown = [];
    for (const f of findings) {
      const hit = allow.find(a => a.code === f.code && (!a.file || f.file === a.file || f.file.startsWith(a.file)));
      if (!hit) { shown.push(f); continue; }
      if (f.code === 'G005') {
        if (hit.acknowledged === true) { acknowledged++; shown.push({ ...f, severity: 'warning', msg: f.msg + ` [ПРИНЯТО ВЛАДЕЛЬЦЕМ: ${hit.reason || 'причина не указана'}]` }); }
        else shown.push(f);   // без acknowledged секрет остаётся ошибкой
        continue;
      }
      allowed++;
    }
  } catch { console.error('tools/repo-health-allow.json не читается: исключения не применены'); }
}

const errors = shown.filter(f => f.severity === 'error').length;
const warnings = shown.filter(f => f.severity === 'warning').length;
const infos = shown.filter(f => f.severity === 'info').length;
const byCode = {}; for (const f of shown) byCode[f.code] = (byCode[f.code] || 0) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({ errors, warnings, infos, allowed, byCode, history: historyInfo, findings: shown }, null, 2));
} else {
  if (!QUIET) for (const f of shown) console.log(`${f.severity === 'error' ? 'ERROR' : f.severity === 'info' ? 'info ' : 'warn '} ${f.code}  ${f.file}  ${f.msg}`);
  console.log('');
  console.log(`Отслеживаемых файлов: ${tracked.length}${allowed ? ` · исключено по allow-файлу: ${allowed}` : ''}${acknowledged ? ` · секретов принято владельцем: ${acknowledged}` : ''}`);
  console.log(`Ошибок: ${errors} · предупреждений: ${warnings}` + (infos ? ` · сведений: ${infos}` : '') + (Object.keys(byCode).length ? ' · по кодам: ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join(' ') : ''));
}
process.exitCode = errors > 0 || (STRICT && warnings > 0) ? 1 : 0;
