#!/usr/bin/env node
/**
 * tools/check-supabase-sql.mjs
 * Статическая проверка безопасности SQL-файлов Supabase и Edge Functions в репозитории.
 * Это эвристический линтер по тексту (не парсер PostgreSQL и не доступ к живой базе): он видит, как база
 * ДОЛЖНА быть устроена по файлам. Как база устроена на самом деле, показывает quiz/verify-live-db.sql.
 * Без внешних зависимостей. Правила — из навыка supabase-engineer (.agents/skills/supabase-engineer/SKILL.md).
 *
 * Какие файлы читаются (в порядке применения; более позднее определение функции заменяет раннее):
 *   quiz/NEW/*.sql, quiz/*.sql, quiz/applied/*.sql, supabase/**\/*.sql (и клиентский код assets/js/*.js для SQ013)
 *   (quiz/proposed/*.sql — предложения, не применённые в живой базе, в расчёт НЕ берутся)
 *   Edge Functions: supabase/functions/**\/index.ts
 *
 * Использование:
 *   node tools/check-supabase-sql.mjs
 *   node tools/check-supabase-sql.mjs --json | --quiet | --strict
 *
 * Принятые владельцем риски: tools/supabase-sql-allow.json
 *   { "allow": [ { "code": "SQ001", "file": "quiz/supabase_admin_setup.sql", "acknowledged": true, "reason": "..." } ] }
 *   Находка остаётся видимой как предупреждение «принято владельцем», молча не скрывается.
 *
 * Код возврата: 0 — ошибок нет; 1 — есть ошибки (или предупреждения при --strict); 2 — ошибка запуска.
 *
 * Коды:
 *   SQ001 ошибка   политика UPDATE/ALL без WITH CHECK на таблице с колонкой role и без защиты колонки (триггер или отзыв прав):
 *                  пользователь может сам себе выдать роль администратора
 *   SQ002 предупр. политика UPDATE без WITH CHECK, условие которой не привязано к auth.uid() (в PostgreSQL USING применяется и как проверка новых данных; убедитесь, что это задумано)
 *   SQ003 ошибка   функция SECURITY DEFINER берёт идентификатор пользователя из входных данных: COALESCE(auth.uid(), <данные клиента>)
 *   SQ004 предупр. функция SECURITY DEFINER без SET search_path
 *   SQ005 предупр. функция SECURITY DEFINER, которая пишет в таблицы, доступна анонимной роли (нет REVOKE EXECUTE ... FROM anon/public) и не имеет проверки доступа
 *   SQ006 инфо     функция SECURITY DEFINER доступна анонимной роли, но сама проверяет права (is_admin() или auth.uid()): лишняя поверхность, лучше закрыть REVOKE
 *   SQ007 ошибка   таблица в схеме public создана без включённого RLS
 *   SQ010 ошибка   Edge Function использует service_role-ключ без проверки роли администратора вызывающего
 *   SQ011 инфо     Edge Function разрешает CORS для любого источника (допустимо, если функция проверяет авторизацию)
 *   SQ012 предупр. служебные файлы Supabase CLI (supabase/.temp) отслеживаются git
 *   SQ013 предупр. клиентский код использует auth.signUp / signInAnonymously: публичная регистрация или анонимные сессии должны быть осознанно разрешены
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = p => path.relative(ROOT, p).split(path.sep).join('/');
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith('--')));
const AS_JSON = flags.has('--json'), QUIET = flags.has('--quiet'), STRICT = flags.has('--strict');

const findings = [];
const add = (severity, code, file, msg) => findings.push({ severity, code, file, msg });

// ---------- сбор файлов ----------
const listDir = (d, re) => fs.existsSync(d) ? fs.readdirSync(d).filter(n => re.test(n)).sort().map(n => path.join(d, n)) : [];
const walk = (d, re, out = []) => { if (!fs.existsSync(d)) return out; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, re, out); else if (re.test(e.name)) out.push(p); } return out; };
const sqlFiles = [
  ...listDir(path.join(ROOT, 'quiz', 'NEW'), /\.sql$/i),
  ...listDir(path.join(ROOT, 'quiz'), /\.sql$/i).filter(f => !/verify-live-db\.sql$/i.test(f)),
  ...listDir(path.join(ROOT, 'quiz', 'applied'), /\.sql$/i),
  ...walk(path.join(ROOT, 'supabase'), /\.sql$/i),
];
const edgeFiles = walk(path.join(ROOT, 'supabase', 'functions'), /^index\.ts$/i);

// ---------- разбор SQL ----------
const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/--[^\n]*/g, ' ');
const tables = new Map();      // name -> { cols:Set, file }
const rls = new Set();         // имена таблиц с включённым RLS
const policies = [];           // { table, cmd, hasCheck, name, file }
const functions = new Map();   // name -> { header, body, file, secdef, searchPath, returnsTrigger }
const triggers = [];           // { table, event, timing, fn, file }
const revokes = new Set();     // имена функций, у которых отозван EXECUTE у anon или public
const revokedColumns = new Set(); // 'table.col'

for (const f of sqlFiles) {
  const raw = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const text = stripComments(raw);
  const file = rel(f);
  let m;

  const reTable = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)\s*\(([\s\S]*?)\n\s*\)\s*;/gi;
  while ((m = reTable.exec(text))) {
    const cols = new Set(); for (const line of m[2].split('\n')) { const c = line.trim().match(/^"?(\w+)"?\s+(?!primary|unique|foreign|check|constraint)\w/i); if (c) cols.add(c[1].toLowerCase()); }
    tables.set(m[1].toLowerCase(), { cols, file });
  }
  const reRls = /alter\s+table\s+(?:public\.)?(\w+)\s+enable\s+row\s+level\s+security/gi;
  while ((m = reRls.exec(text))) rls.add(m[1].toLowerCase());

  const rePol = /create\s+policy\s+"?([\w ]+)"?\s+on\s+(?:public\.)?(\w+)([\s\S]*?);/gi;
  while ((m = rePol.exec(text))) {
    const body = m[3]; const cmd = (body.match(/\bfor\s+(select|insert|update|delete|all)\b/i) || [null, 'all'])[1].toLowerCase();
    policies.push({ table: m[2].toLowerCase(), cmd, hasCheck: /with\s+check/i.test(body), ownsRows: /auth\.uid\s*\(\s*\)/i.test((body.match(/using\s*\(([\s\S]*)/i) || ['', ''])[1].split(/with\s+check/i)[0]), name: m[1].trim(), file });
  }
  // функции: заголовок до AS $tag$, тело между $tag$ ... $tag$
  const reFn = /create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?(\w+)\s*\(([\s\S]*?)\)\s*([\s\S]*?)\bas\s+(\$\w*\$)([\s\S]*?)\4([\s\S]*?);/gi;
  while ((m = reFn.exec(text))) {
    const header = (m[3] + ' ' + m[6]).toLowerCase();
    functions.set(m[1].toLowerCase(), { header, body: m[5], file, secdef: /security\s+definer/.test(header), searchPath: /set\s+search_path/.test(header), returnsTrigger: /returns\s+trigger/.test(header) });
  }
  const reTrig = /create\s+trigger\s+\w+\s+(before|after|instead\s+of)\s+([\w\s]+?)\s+on\s+(?:public\.|auth\.)?(\w+)[\s\S]*?execute\s+(?:function|procedure)\s+(?:public\.)?(\w+)/gi;
  while ((m = reTrig.exec(text))) triggers.push({ timing: m[1].toLowerCase(), event: m[2].toLowerCase(), table: m[3].toLowerCase(), fn: m[4].toLowerCase(), file });
  const reRev = /revoke\s+execute\s+on\s+function\s+(?:public\.)?(\w+)\s*\([^)]*\)\s+from\s+([\w\s,]+);/gi;
  while ((m = reRev.exec(text))) if (/\b(anon|public)\b/i.test(m[2])) revokes.add(m[1].toLowerCase());
  const reRevCol = /revoke\s+update\s*\(\s*([\w\s,]+)\)\s+on\s+(?:table\s+)?(?:public\.)?(\w+)\s+from/gi;
  while ((m = reRevCol.exec(text))) for (const c of m[1].split(',')) revokedColumns.add(`${m[2].toLowerCase()}.${c.trim().toLowerCase()}`);
}

// ---------- SQ007: таблицы без RLS ----------
for (const [name, t] of tables) if (!rls.has(name)) add('error', 'SQ007', t.file, `Таблица public.${name} создана без включённого RLS`);

// ---------- SQ001 / SQ002: политики обновления ----------
const columnProtected = (table, col) =>
  revokedColumns.has(`${table}.${col}`) ||
  triggers.some(t => t.table === table && t.timing === 'before' && /update/.test(t.event) && (() => { const fn = functions.get(t.fn); return fn && new RegExp(`\\b${col}\\b`, 'i').test(fn.body) && /raise\s+exception/i.test(fn.body); })());
for (const p of policies) {
  if ((p.cmd === 'update' || p.cmd === 'all') && !p.hasCheck) {
    const t = tables.get(p.table);
    if (t && t.cols.has('role') && !columnProtected(p.table, 'role')) {
      add('error', 'SQ001', p.file, `Политика "${p.name}" на public.${p.table}: обновление без WITH CHECK, таблица содержит колонку role и защиты колонки нет: пользователь может сам себе выдать роль администратора (update ${p.table} set role = 'admin' where id = auth.uid())`);
    } else if (p.cmd === 'update' && !p.ownsRows) {
      add('warning', 'SQ002', p.file, `Политика "${p.name}" на public.${p.table}: UPDATE без WITH CHECK (условие USING применяется и к новым данным; убедитесь, что это задумано)`);
    }
  }
}

// ---------- функции SECURITY DEFINER ----------
for (const [name, fn] of functions) {
  if (!fn.secdef) continue;
  if (/coalesce\s*\(\s*auth\.uid\s*\(\s*\)\s*,/i.test(fn.body)) add('error', 'SQ003', fn.file, `Функция ${name} (SECURITY DEFINER) берёт user_id из auth.uid() ИЛИ из входных данных: неавторизованный вызов с чужим идентификатором обходит RLS`);
  if (!fn.searchPath) add('warning', 'SQ004', fn.file, `Функция ${name} (SECURITY DEFINER) без SET search_path`);
  if (!fn.returnsTrigger && !revokes.has(name) && /\b(insert|update|delete)\b/i.test(fn.body)) {
    const guarded = /is_admin\s*\(\s*\)/i.test(fn.body) || /auth\.uid\s*\(\s*\)\s+is\s+null/i.test(fn.body) || /auth\.uid\s*\(\s*\)\s*(=|<>)/i.test(fn.body);
    if (guarded) add('info', 'SQ006', fn.file, `Функция ${name} (SECURITY DEFINER) доступна анонимной роли (отказывает внутри): закройте REVOKE EXECUTE ... FROM anon, public`);
    else add('warning', 'SQ005', fn.file, `Функция ${name} (SECURITY DEFINER) доступна анонимной роли и не проверяет права вызывающего`);
  }
}

// ---------- Edge Functions ----------
for (const f of edgeFiles) {
  const t = fs.readFileSync(f, 'utf8'), file = rel(f);
  if (/SERVICE_ROLE_KEY/.test(t) && !/role\s*(!==|===|!=|==)\s*['"]admin['"]/.test(t)) add('error', 'SQ010', file, 'Edge Function использует service_role-ключ, но проверки роли администратора вызывающего не видно');
  if (/Access-Control-Allow-Origin['"]?\s*:\s*['"]\*['"]/.test(t)) add('info', 'SQ011', file, 'CORS разрешён для любого источника (допустимо, если функция проверяет авторизацию вызывающего)');
}

// ---------- клиентский код: публичная регистрация ----------
for (const f of walk(path.join(ROOT, 'assets', 'js'), /\.js$/i)) {
  const t = fs.readFileSync(f, 'utf8');
  if (/\.auth\.signUp\s*\(/.test(t)) add('warning', 'SQ013', rel(f), 'Клиент вызывает auth.signUp с публичным ключом: это работает, только если в Dashboard (Authentication → Providers → Email) включена регистрация новых пользователей, то есть любой посетитель может завести аккаунт. Если пользователей создаёт только администратор (Edge Function admin-create-user), регистрацию лучше выключить');
  if (/signInAnonymously\s*\(/.test(t)) add('warning', 'SQ013', rel(f), 'Клиент вызывает signInAnonymously: любой посетитель получает аутентифицированную сессию без пароля; убедитесь, что политики доступа это учитывают');
}

// ---------- служебные файлы CLI ----------
try {
  const tracked = execSync('git ls-files supabase/.temp', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').filter(Boolean);
  for (const f of tracked) add('warning', 'SQ012', f, 'Служебный файл Supabase CLI отслеживается git (добавьте supabase/.temp/ в .gitignore и уберите из индекса: git rm --cached)');
} catch { /* git недоступен */ }

// ---------- принятые владельцем ----------
const allowPath = path.join(ROOT, 'tools', 'supabase-sql-allow.json');
let shown = findings, acknowledged = 0;
if (fs.existsSync(allowPath)) {
  try {
    const allow = JSON.parse(fs.readFileSync(allowPath, 'utf8')).allow || [];
    shown = findings.map(f => {
      const hit = allow.find(a => a.code === f.code && (!a.file || f.file === a.file || f.file.startsWith(a.file)));
      if (hit && hit.acknowledged === true && f.severity === 'error') { acknowledged++; return { ...f, severity: 'warning', msg: f.msg + ` [ПРИНЯТО ВЛАДЕЛЬЦЕМ: ${hit.reason || 'причина не указана'}]` }; }
      return f;
    });
  } catch { console.error('tools/supabase-sql-allow.json не читается: исключения не применены'); }
}

const errors = shown.filter(f => f.severity === 'error').length;
const warnings = shown.filter(f => f.severity === 'warning').length;
const infos = shown.filter(f => f.severity === 'info').length;
const byCode = {}; for (const f of shown) byCode[f.code] = (byCode[f.code] || 0) + 1;

if (AS_JSON) {
  console.log(JSON.stringify({ files: { sql: sqlFiles.map(rel), edge: edgeFiles.map(rel) }, errors, warnings, infos, acknowledged, byCode, findings: shown }, null, 2));
} else {
  if (!QUIET) for (const f of shown) console.log(`${f.severity === 'error' ? 'ERROR' : f.severity === 'info' ? 'info ' : 'warn '} ${f.code}  ${f.file}\n      ${f.msg}`);
  console.log('');
  console.log(`Файлов SQL: ${sqlFiles.length}, Edge Functions: ${edgeFiles.length}; таблиц ${tables.size}, политик ${policies.length}, функций ${functions.size}` + (acknowledged ? ` · принято владельцем: ${acknowledged}` : ''));
  console.log(`Ошибок: ${errors} · предупреждений: ${warnings}` + (infos ? ` · сведений: ${infos}` : '') + (Object.keys(byCode).length ? ' · по кодам: ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join(' ') : ''));
  console.log('Примечание: проверка статическая; состояние живой базы показывает quiz/verify-live-db.sql.');
}
process.exitCode = errors > 0 || (STRICT && warnings > 0) ? 1 : 0;
