-- =============================================================================
-- STARLEY: ПРЕДЛОЖЕНИЕ ПО УКРЕПЛЕНИЮ ДОСТУПА (не применено; подготовлено агентом, ждёт вашей проверки)
-- Не выполняйте вслепую. Порядок:
--   1. Выполните quiz/verify-live-db.sql и убедитесь, что проблема существует именно в живой базе.
--   2. Сделайте резервную копию (Dashboard → Database → Backups) или выполните на тестовом проекте.
--   3. Выполняйте разделы по одному. Откат каждого раздела указан в его конце.
--   4. После применения повторите verify-live-db.sql и перенесите этот файл в quiz/applied/ (git mv), чтобы
--      статическая проверка tools/check-supabase-sql.mjs считала защиту применённой.
-- Файл проверен PostgreSQL-парсером (pglast) на синтаксис; на живой базе не запускался.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- РАЗДЕЛ 1. Запрет самостоятельного повышения роли.
-- Проблема: политика profiles_update_own_or_admin разрешает пользователю обновлять СВОЮ строку целиком,
-- включая колонку role. Достаточно выполнить update profiles set role = 'admin' where id = auth.uid().
-- Решение: триггер, запрещающий не-администраторам менять role, is_guest, username и id.
-- Серверный ключ (service_role, Edge Function admin-create-user) и администраторы не ограничиваются.
-- Прогресс (level_num, current_exp, total_exp, tier_id) остаётся управляемым клиентом: так устроено приложение.
-- -----------------------------------------------------------------------------
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text;
begin
  jwt_role := coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  );

  -- серверные вызовы (service_role) и администраторы могут менять всё
  if jwt_role = 'service_role' or public.is_admin() then
    return new;
  end if;

  -- прямые вызовы из SQL Editor (нет JWT) тоже не блокируем
  if jwt_role is null and auth.uid() is null then
    return new;
  end if;

  if new.role is distinct from old.role then
    raise exception 'Forbidden: only administrators can change role';
  end if;
  if new.is_guest is distinct from old.is_guest then
    raise exception 'Forbidden: only administrators can change is_guest';
  end if;
  if new.username is distinct from old.username then
    raise exception 'Forbidden: only administrators can change username';
  end if;
  if new.id is distinct from old.id then
    raise exception 'Forbidden: id cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_protect_columns on public.profiles;
create trigger trg_profiles_protect_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- Откат раздела 1:
--   drop trigger if exists trg_profiles_protect_columns on public.profiles;
--   drop function if exists public.protect_profile_columns();

-- -----------------------------------------------------------------------------
-- РАЗДЕЛ 2. submit_quiz_session: обязательная аутентификация, фиксированный search_path, исправленный синтаксис.
-- Проблемы исходного quiz/submit_quiz_session.sql:
--   а) функция SECURITY DEFINER берёт user_id из auth.uid() ИЛИ из переданных данных: неавторизованный вызов
--      с чужим user_id запишет сессию этому пользователю (RLS обходится);
--   б) нет set search_path;
--   в) в блоке BEGIN ... EXCEPTION отсутствует закрывающий END; (PL/pgSQL: синтаксическая ошибка),
--      исходный файл в таком виде выполнить нельзя.
-- Поведение для авторизованного пользователя прежнее.
-- -----------------------------------------------------------------------------
create or replace function public.submit_quiz_session(
  p_session_data jsonb,
  p_answers_data jsonb default '[]'::jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_id uuid;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.quiz_sessions (
    user_id, session_id, date, set_title, mode, lang, total_q, correct_q,
    score_pct, time_spent_sec, exp_gained, topics, detail_summary
  )
  values (
    v_user_id,
    coalesce(p_session_data->>'session_id', 'sess_' || extract(epoch from now())::bigint),
    coalesce((p_session_data->>'date')::timestamptz, now()),
    coalesce(p_session_data->>'set_title', p_session_data->>'deck_id', 'Quiz Session'),
    coalesce(p_session_data->>'mode', 'smart'),
    coalesce(p_session_data->>'lang', 'En'),
    coalesce((p_session_data->>'total_q')::int, (p_session_data->>'total')::int, 0),
    coalesce((p_session_data->>'correct_q')::int, (p_session_data->>'score')::int, 0),
    coalesce((p_session_data->>'score_pct')::numeric, 0),
    coalesce((p_session_data->>'time_spent_sec')::int, (p_session_data->>'duration')::int, 0),
    coalesce((p_session_data->>'exp_gained')::int, 0),
    array(select jsonb_array_elements_text(coalesce(p_session_data->'topics', '[]'::jsonb))),
    p_session_data->>'detail_summary'
  )
  on conflict (user_id, session_id) do update set
    score_pct = excluded.score_pct,
    correct_q = excluded.correct_q,
    total_q = excluded.total_q,
    detail_summary = coalesce(excluded.detail_summary, quiz_sessions.detail_summary)
  returning id into v_session_id;

  if p_answers_data is not null and jsonb_array_length(p_answers_data) > 0 then
    begin
      insert into public.quiz_answers (session_id, question_id, is_correct, chosen_option)
      select
        v_session_id,
        item->>'question_id',
        (item->>'is_correct')::boolean,
        (item->>'chosen_option')::int
      from jsonb_array_elements(p_answers_data) as item;
    exception when undefined_table then
      null;  -- если таблицы quiz_answers нет, сессия всё равно сохраняется
    end;
  end if;

  return v_session_id;
end;
$$;

revoke execute on function public.submit_quiz_session(jsonb, jsonb) from public, anon;
grant execute on function public.submit_quiz_session(jsonb, jsonb) to authenticated;

-- Откат раздела 2: вернуть прежнее определение из quiz/submit_quiz_session.sql после исправления синтаксиса,
-- либо: grant execute on function public.submit_quiz_session(jsonb, jsonb) to public, anon;

-- -----------------------------------------------------------------------------
-- РАЗДЕЛ 3. Административные функции: запретить вызов анонимной ролью.
-- Сейчас они сами проверяют is_admin() и отказывают, но выполнение разрешено всем с публичным ключом.
-- Это даёт лишний шум и поверхность атаки; закрываем на уровне прав.
-- -----------------------------------------------------------------------------
revoke execute on function public.admin_create_user(text, text, text) from public, anon;
grant  execute on function public.admin_create_user(text, text, text) to authenticated;

revoke execute on function public.admin_update_user(uuid, text, text) from public, anon;
grant  execute on function public.admin_update_user(uuid, text, text) to authenticated;

revoke execute on function public.delete_user_by_admin(uuid) from public, anon;
grant  execute on function public.delete_user_by_admin(uuid) to authenticated;

revoke execute on function public.admin_clear_user_history(uuid) from public, anon;
grant  execute on function public.admin_clear_user_history(uuid) to authenticated;

-- Откат раздела 3 (разрешить анонимам, как раньше):
--   grant execute on function public.admin_create_user(text, text, text) to public, anon;
--   grant execute on function public.admin_update_user(uuid, text, text) to public, anon;
--   grant execute on function public.delete_user_by_admin(uuid) to public, anon;
--   grant execute on function public.admin_clear_user_history(uuid) to public, anon;
