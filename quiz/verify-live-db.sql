-- =============================================================================
-- STARLEY: ПРОВЕРКА ЖИВОЙ БАЗЫ SUPABASE (только чтение, ничего не меняет)
-- Выполнить: Supabase Dashboard → SQL Editor → New query → Run (запросы по одному или все сразу)
-- Зачем: SQL-файлы в репозитории описывают, как база ДОЛЖНА быть устроена; здесь видно, как она устроена на самом деле.
-- Результаты (особенно пункты 1–4) пришлите агенту «Supabase-инженер» без ключей и паролей: в них их нет.
-- =============================================================================

-- 1. Политики таблицы profiles: смотрим, нет ли обновления без ограничений (колонка with_check пустая?)
select polname as policy, polcmd as cmd,
       pg_get_expr(polqual, polrelid)      as using_expr,
       pg_get_expr(polwithcheck, polrelid) as with_check_expr
from pg_policy
where polrelid = 'public.profiles'::regclass
order by polname;

-- 2. Триггеры на profiles (защита колонки role от самостоятельного изменения)
select tgname as trigger_name, pg_get_triggerdef(oid) as definition
from pg_trigger
where tgrelid = 'public.profiles'::regclass and not tgisinternal;

-- 3. Могут ли обычные роли обновлять колонку role? (строки с UPDATE означают: да, на уровне прав)
select grantee, column_name, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles'
  and column_name = 'role' and privilege_type = 'UPDATE'
  and grantee in ('anon', 'authenticated', 'public');

-- 4. Функции SECURITY DEFINER в схеме public: настройка search_path и кому разрешено выполнение
select p.proname as function_name,
       p.prosecdef as security_definer,
       p.proconfig as settings,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef
order by p.proname;

-- 5. Существует ли submit_quiz_session и как выглядит её определение (ищем COALESCE(auth.uid(), ...))
select p.proname, pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'submit_quiz_session';

-- 6. Включён ли RLS на всех таблицах public (rls_enabled должно быть true везде)
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

-- 7. Сколько администраторов сейчас (ожидаемое число известно вам)
select count(*) as admins from public.profiles where role = 'admin';

-- Не видно из SQL, проверьте в Dashboard → Authentication:
--   Providers → Email: «Allow new users to sign up» (если включено, любой посетитель может завести аккаунт);
--   Sign In / Providers → «Allow anonymous sign-ins» (если включено, любой посетитель получает сессию без пароля);
--   Rate Limits: ограничения на число попыток входа (важны для коротких PIN).
