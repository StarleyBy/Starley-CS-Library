#!/usr/bin/env node
/**
 * tools/check-sw-shell.mjs
 * Проверка Service Worker (sw.js): оболочка приложения (APP_SHELL), версии кэшей, манифест PWA,
 * необходимость поднять версию кэша после правок. Без внешних зависимостей.
 * Правила — из навыка cache-keeper (.agents/skills/cache-keeper/SKILL.md).
 *
 * Использование:
 *   node tools/check-sw-shell.mjs                 # проверка; изменения сравниваются с HEAD
 *   node tools/check-sw-shell.mjs --since=REF     # сравнить с другим состоянием (тег, ветка, коммит), например origin/main
 *   node tools/check-sw-shell.mjs --bump          # поднять static-vNN и dynamic-vNN в sw.js на единицу (обе одинаково)
 *   node tools/check-sw-shell.mjs --add <файл> ...  # внести файлы в APP_SHELL (формат и переводы строк sw.js сохраняются; версия НЕ меняется)
 *
 * Параметры:
 *   --strict      предупреждения тоже дают код возврата 1
 *   --json        машинный вывод
 *   --quiet       только итог
 *   --no-git      не проверять необходимость повышения версии (без обращения к git)
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды:
 *   S001 ошибка      файл из APP_SHELL не существует (install Service Worker упадёт целиком: cache.addAll атомарна)
 *   S002 ошибка      дубль в APP_SHELL
 *   S003 ошибка      не удалось разобрать sw.js (CACHE_STATIC / CACHE_DYNAMIC / APP_SHELL)
 *   S004 предупр.    номера версий static и dynamic различаются
 *   S005 предупр.    имена кэшей не вида static-vN / dynamic-vN
 *   S010 предупр.    локальный скрипт из страницы оболочки не входит в APP_SHELL (попадёт в dynamic-кэш только после онлайн-визита)
 *   S011 предупр.    локальный стиль (CSS) из страницы оболочки не входит в APP_SHELL; ветка «остальное» в sw.js CSS в кэш не кладёт — офлайн возможна страница без стилей
 *   S020 ошибка      изменён файл оболочки типа cache-first (CSS и др.), а sw.js не менялся вовсе: клиенты не переустановят Service Worker и останутся со старой копией
 *   S021 предупр.    изменён JS/HTML/JSON из оболочки, sw.js не менялся: онлайн обновится, офлайн-копия останется старой
 *   S022 предупр.    версия поднята, но файлы оболочки не менялись (подъём очищает dynamic-кэш: индекс поиска и главы скачаются заново)
 *   S023 инфо        sw.js изменён без подъёма версии: клиенты переустановят Service Worker и обновят static-кэш на месте, dynamic сохранится
 *   S024 предупр.    файлы убраны из APP_SHELL: без подъёма версии они останутся в static-кэше
 *   S030 ошибка      manifest.json: не читается или иконка не найдена
 *   S031 предупр.    manifest.json: нет name/short_name или start_url
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SW_PATH = path.join(ROOT, 'sw.js');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');

const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--') && !a.includes('=')));
const opt = Object.fromEntries(argv.filter(a => a.startsWith('--') && a.includes('=')).map(a => a.slice(2).split('=')));
const STRICT = flags.has('--strict');
const AS_JSON = flags.has('--json');
const QUIET = flags.has('--quiet');
const NO_GIT = flags.has('--no-git');
const BUMP = flags.has('--bump');
const SINCE = opt.since || 'HEAD';

if (!fs.existsSync(SW_PATH)) { console.error('Не найден sw.js в корне проекта'); process.exit(2); }

const findings = [];
const add = (severity, code, msg) => findings.push({ severity, code, msg });
const ADD_MODE = flags.has('--add');

// ---------- разбор sw.js ----------
function parseSw(text) {
  const st = text.match(/CACHE_STATIC\s*=\s*'([^']+)'/);
  const dy = text.match(/CACHE_DYNAMIC\s*=\s*'([^']+)'/);
  const start = text.indexOf('APP_SHELL');
  let shell = null;
  if (start >= 0) {
    const open = text.indexOf('[', start), close = text.indexOf('];', open);
    if (open >= 0 && close > open) shell = [...text.slice(open, close).matchAll(/'([^']+)'/g)].map(m => m[1]);
  }
  return { static: st && st[1], dynamic: dy && dy[1], shell };
}
const verNum = name => { const m = String(name || '').match(/-v(\d+)$/); return m ? Number(m[1]) : null; };

// ---------- внести файлы в APP_SHELL ----------
if (ADD_MODE) {
  const wanted = argv.filter(a => !a.startsWith('--'));
  if (!wanted.length) { console.error('Укажите файлы: node tools/check-sw-shell.mjs --add assets/css/style.css ...'); process.exit(2); }
  let raw = fs.readFileSync(SW_PATH, 'utf8');
  const cur = parseSw(raw);
  if (!cur.shell) { console.error('APP_SHELL в sw.js не найден'); process.exit(2); }
  const have = new Set(cur.shell.map(e => e.replace(/^\.\//, '')));
  const toAdd = [], skipped = [];
  for (const w of wanted) {
    const clean = w.replace(/\\/g, '/').replace(/^\.\//, '');
    if (have.has(clean)) { skipped.push(`${clean} (уже есть)`); continue; }
    if (!fs.existsSync(path.join(ROOT, clean))) { skipped.push(`${clean} (файл не существует)`); continue; }
    have.add(clean); toAdd.push('./' + clean);
  }
  if (toAdd.length) {
    const start = raw.indexOf('APP_SHELL');
    const open = raw.indexOf('[', start), close = raw.indexOf('];', open);
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    const body = raw.slice(open, close).replace(/\s+$/, '');
    const lastLine = body.slice(body.lastIndexOf('\n') + 1);
    const indent = (lastLine.match(/^\s*/) || ['  '])[0] || '  ';
    const withComma = body.endsWith(',') ? body : body + ',';
    raw = raw.slice(0, open) + withComma + eol + toAdd.map(e => `${indent}'${e}'`).join(',' + eol) + eol + raw.slice(close);
    fs.writeFileSync(SW_PATH, raw);
  }
  console.log(`Добавлено в APP_SHELL: ${toAdd.length}${toAdd.length ? ' — ' + toAdd.join(', ') : ''}`);
  if (skipped.length) console.log(`Пропущено: ${skipped.join('; ')}`);
  if (toAdd.length) console.log('Версия кэша не менялась. sw.js изменён, поэтому после публикации браузеры переустановят Service Worker и заново скачают оболочку (static-кэш обновится на месте, dynamic сохранится).');
  process.exit(0);
}

// ---------- поднять версию ----------
if (BUMP) {
  const raw = fs.readFileSync(SW_PATH, 'utf8');
  const cur = parseSw(raw);
  const n = Math.max(verNum(cur.static) ?? 0, verNum(cur.dynamic) ?? 0) + 1;
  if (!cur.static || !cur.dynamic) { console.error('Не удалось найти CACHE_STATIC / CACHE_DYNAMIC в sw.js'); process.exit(2); }
  const out = raw
    .replace(/(CACHE_STATIC\s*=\s*')static-v\d+(')/, `$1static-v${n}$2`)
    .replace(/(CACHE_DYNAMIC\s*=\s*')dynamic-v\d+(')/, `$1dynamic-v${n}$2`);
  if (out === raw) { console.error('Имена кэшей не вида static-vN / dynamic-vN: автоматический подъём невозможен'); process.exit(2); }
  fs.writeFileSync(SW_PATH, out);
  console.log(`Версия кэша поднята: static-v${n}, dynamic-v${n} (было ${cur.static}, ${cur.dynamic}).`);
  console.log('Напоминание: подъём очищает dynamic-кэш у пользователей (индекс поиска и главы скачаются заново).');
  process.exit(0);
}

const sw = parseSw(fs.readFileSync(SW_PATH, 'utf8'));
if (!sw.static || !sw.dynamic || !sw.shell) {
  add('error', 'S003', `Не удалось разобрать sw.js: CACHE_STATIC=${sw.static}, CACHE_DYNAMIC=${sw.dynamic}, APP_SHELL=${sw.shell ? sw.shell.length + ' записей' : 'не найден'}`);
} else {
  // версии
  if (!/^static-v\d+$/.test(sw.static) || !/^dynamic-v\d+$/.test(sw.dynamic)) {
    add('warning', 'S005', `Имена кэшей не вида static-vN / dynamic-vN: ${sw.static}, ${sw.dynamic} (автоматический подъём версии невозможен)`);
  } else if (verNum(sw.static) !== verNum(sw.dynamic)) {
    add('warning', 'S004', `Версии различаются: ${sw.static} и ${sw.dynamic}`);
  }

  // оболочка: существование и дубли
  const seen = new Set();
  const shellFiles = new Set();      // нормализованные пути относительно корня
  for (const e of sw.shell) {
    if (seen.has(e)) add('error', 'S002', `Дубль в APP_SHELL: ${e}`);
    seen.add(e);
    const clean = e.replace(/^\.\//, '').split('?')[0].split('#')[0];
    const file = clean === '' ? 'index.html' : clean;
    shellFiles.add(file);
    if (!fs.existsSync(path.join(ROOT, file))) add('error', 'S001', `Файл из APP_SHELL не существует: ${e}`);
  }

  // страницы оболочки: локальные скрипты и стили, не попавшие в оболочку
  const pages = [...shellFiles].filter(f => f.endsWith('.html') && fs.existsSync(path.join(ROOT, f)));
  for (const page of pages) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const refs = new Set();
    for (const m of html.matchAll(/<script\b[^>]*?\bsrc=["']([^"']+)["']/gi)) refs.add(m[1]);
    for (const m of html.matchAll(/<link\b[^>]*?rel=["']stylesheet["'][^>]*?\bhref=["']([^"']+)["']/gi)) refs.add(m[1]);
    for (const m of html.matchAll(/<link\b[^>]*?\bhref=["']([^"']+)["'][^>]*?rel=["']stylesheet["']/gi)) refs.add(m[1]);
    const missing = [];
    for (const r of refs) {
      if (/^(https?:)?\/\//i.test(r) || r.startsWith('data:')) continue;
      const clean = r.split('?')[0].split('#')[0];
      const resolved = clean.startsWith('/') ? clean.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(page), clean));
      if (!shellFiles.has(resolved)) missing.push(resolved);
    }
    const uniq = [...new Set(missing)];
    const miss_css = uniq.filter(f => /\.css$/i.test(f)), miss_other = uniq.filter(f => !/\.css$/i.test(f));
    if (miss_other.length) add('warning', 'S010', `${page}: скрипты не входят в APP_SHELL (кэшируются в dynamic только после онлайн-визита) — ${miss_other.join(', ')}`);
    if (miss_css.length) add('warning', 'S011', `${page}: стили не входят в APP_SHELL; sw.js нигде не кладёт CSS в кэш при загрузке, поэтому офлайн страница может остаться без стилей — ${miss_css.join(', ')}`);
  }

  // нужно ли поднимать версию
  if (!NO_GIT) {
    try {
      const run = c => execSync(c, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const changed = new Set([
        ...run(`git diff --name-only ${SINCE}`).split('\n'),
        ...run('git ls-files --others --exclude-standard').split('\n'),
      ].map(s => s.trim()).filter(Boolean));
      const changedShell = [...changed].filter(f => shellFiles.has(f));
      const swChanged = changed.has('sw.js');
      let before = null;
      try { before = parseSw(run(`git show ${SINCE}:sw.js`)); } catch { /* sw.js не было в ref */ }
      const vNow = verNum(sw.static), vBefore = before ? verNum(before.static) : null;
      const bumped = vBefore !== null && vNow !== null && vNow > vBefore;
      const norm = e => e.replace(/^\.\//, '');
      const beforeSet = new Set(((before && before.shell) || []).map(norm));
      const nowSet = new Set(sw.shell.map(norm));
      const added = before && before.shell ? [...nowSet].filter(f => !beforeSet.has(f)) : [];
      const removed = before && before.shell ? [...beforeSet].filter(f => !nowSet.has(f)) : [];

      if (changedShell.length && !swChanged) {
        const strict = changedShell.filter(f => !/\.(js|json|html)$/i.test(f));
        const soft = changedShell.filter(f => /\.(js|json|html)$/i.test(f));
        if (strict.length) add('error', 'S020', `Изменены файлы оболочки с политикой cache-first (${strict.join(', ')}), а sw.js не менялся: клиенты не переустановят Service Worker и останутся со старой копией. Поднимите версию: node tools/check-sw-shell.mjs --bump`);
        if (soft.length) add('warning', 'S021', `Изменены JS/HTML/JSON оболочки (${soft.join(', ')}), sw.js не менялся (версия ${sw.static}): онлайн-пользователи получат новую копию, офлайн — старую до следующего изменения sw.js`);
      } else if (swChanged && !bumped && (changedShell.length || added.length || removed.length)) {
        add('info', 'S023', `sw.js изменён без подъёма версии (${sw.static}): после публикации клиенты переустановят Service Worker и заново скачают оболочку в тот же static-кэш (dynamic сохранится)` + (added.length ? `; добавлено в оболочку: ${added.join(', ')}` : ''));
      }
      if (removed.length && !bumped) add('warning', 'S024', `Убраны из APP_SHELL: ${removed.join(', ')}. Без подъёма версии они останутся в static-кэше`);
      if (bumped && !changedShell.length && !added.length && !removed.length) {
        add('warning', 'S022', `Версия поднята (${before.static} → ${sw.static}), но файлы оболочки с ${SINCE} не менялись: подъём очищает dynamic-кэш пользователей (индекс поиска и главы скачаются заново)`);
      }
    } catch (e) {
      add('warning', 'S021', `git недоступен или ref "${SINCE}" не найден: проверка необходимости подъёма версии пропущена (${String(e.message).split('\n')[0]})`);
    }
  }
}

// ---------- manifest.json ----------
const manPath = path.join(ROOT, 'manifest.json');
if (fs.existsSync(manPath)) {
  try {
    const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
    if (!(man.name || man.short_name)) add('warning', 'S031', 'manifest.json: нет name и short_name');
    if (!man.start_url) add('warning', 'S031', 'manifest.json: нет start_url');
    for (const ic of man.icons || []) {
      const src = String(ic.src || '');
      if (/^(https?:)?\/\//i.test(src)) continue;
      const clean = src.split('?')[0].replace(/^\.?\//, '');
      if (!fs.existsSync(path.join(ROOT, clean))) add('error', 'S030', `manifest.json: иконка не найдена: ${src}`);
    }
  } catch (e) { add('error', 'S030', 'manifest.json не читается: ' + e.message); }
}

// ---------- вывод ----------
const errors = findings.filter(f => f.severity === 'error').length;
const warnings = findings.filter(f => f.severity === 'warning').length;
const infos = findings.filter(f => f.severity === 'info').length;
const byCode = {};
for (const f of findings) byCode[f.code] = (byCode[f.code] || 0) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({ static: sw.static, dynamic: sw.dynamic, shellEntries: sw.shell ? sw.shell.length : null, since: NO_GIT ? null : SINCE, errors, warnings, infos, byCode, findings }, null, 2));
} else {
  if (!QUIET) for (const f of findings) console.log(`${f.severity === 'error' ? 'ERROR' : f.severity === 'info' ? 'info ' : 'warn '} ${f.code}  ${f.msg}`);
  console.log('');
  console.log(`sw.js: ${sw.static || '?'} / ${sw.dynamic || '?'}; записей в APP_SHELL: ${sw.shell ? sw.shell.length : '?'}` + (NO_GIT ? '' : `; сравнение с ${SINCE}`));
  console.log(`Ошибок: ${errors} · предупреждений: ${warnings}` + (infos ? ` · сведений: ${infos}` : '') + (Object.keys(byCode).length ? ' · по кодам: ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join(' ') : ''));
}
process.exitCode = errors > 0 || (STRICT && warnings > 0) ? 1 : 0;
