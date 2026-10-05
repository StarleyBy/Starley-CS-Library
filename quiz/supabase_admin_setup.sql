-- =============================================================================
-- STARLEY QUIZ ADMIN PROCEDURES (Supabase SQL Editor)
-- Выполните один раз в: Supabase Dashboard → SQL Editor → New query → Run
-- 
-- Что делает этот скрипт:
-- 1. Разрешает администратору редактировать профили пользователей (политика RLS).
-- 2. Создаёт функцию admin_create_user (создание аккаунтов администратором без необходимости открывать публичную регистрацию).
-- 3. Создаёт функцию admin_update_user (редактирование имени и/или смена/сброс PIN пользователя).
-- 4. Создаёт функцию delete_user_by_admin (удаление пользователя и всех связанных данных).
-- =============================================================================

create extension if not exists "pgcrypto";

-- 1. RLS Политика: Администратор может редактировать любые профили
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
    for update using (id = auth.uid() or public.is_admin());

-- 2. Функция создания нового пользователя администратором
create or replace function public.admin_create_user(pin text, nickname text, role text default 'user')
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  clean_pin text;
  user_email text;
  user_password text;
  new_user_id uuid;
  encrypted_pw text;
begin
  -- Проверка прав администратора
  if not public.is_admin() then
    raise exception 'Forbidden: admin role required';
  end if;

  clean_pin := trim(pin);
  if length(clean_pin) < 4 then
    raise exception 'PIN must be at least 4 characters';
  end if;

  user_email := 'pin_' || clean_pin || '@starley.com';
  user_password := 'starley_' || clean_pin;

  -- Проверка уникальности PIN
  if exists (select 1 from auth.users where email = user_email) or
     exists (select 1 from public.profiles where username = 'user_' || clean_pin or username = clean_pin) then
    return jsonb_build_object('ok', false, 'duplicate', true, 'error', 'Пользователь с паролем/PIN "' || clean_pin || '" уже существует.');
  end if;

  new_user_id := gen_random_uuid();
  encrypted_pw := extensions.crypt(user_password, extensions.gen_salt('bf'));

  -- Добавление в auth.users (email_confirmed_at = now() активирует аккаунт мгновенно)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('nickname', coalesce(nickname, 'Doctor'), 'username', 'user_' || clean_pin),
    now(),
    now(),
    '',
    ''
  );

  -- Добавление в auth.identities
  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    user_email,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', user_email),
    'email',
    now(),
    now(),
    now()
  );

  -- Гарантируем наличие записи в public.profiles со стандартной ролью 'user'
  insert into public.profiles (id, username, nickname, role)
  values (new_user_id, 'user_' || clean_pin, coalesce(nickname, 'Doctor'), 'user')
  on conflict (id) do update set
    username = excluded.username,
    nickname = excluded.nickname,
    role = 'user';

  return jsonb_build_object('ok', true, 'id', new_user_id, 'message', 'Пользователь для PIN ' || clean_pin || ' успешно создан!');
end;
$$;

-- 3. Функция редактирования пользователя администратором (смена имени и/или PIN/пароля)
create or replace function public.admin_update_user(target_user_id uuid, new_nickname text default null, new_pin text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  clean_pin text;
  new_email text;
  new_password text;
begin
  if not public.is_admin() then
    raise exception 'Forbidden: admin role required';
  end if;

  if new_nickname is not null and trim(new_nickname) <> '' then
    update public.profiles set nickname = trim(new_nickname), updated_at = now() where id = target_user_id;
    update auth.users set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('nickname', trim(new_nickname)), updated_at = now() where id = target_user_id;
  end if;

  if new_pin is not null and trim(new_pin) <> '' then
    clean_pin := trim(new_pin);
    if length(clean_pin) < 4 then
      raise exception 'PIN must be at least 4 characters';
    end if;

    new_email := 'pin_' || clean_pin || '@starley.com';
    new_password := 'starley_' || clean_pin;

    if exists (select 1 from auth.users where email = new_email and id <> target_user_id) or
       exists (select 1 from public.profiles where (username = 'user_' || clean_pin or username = clean_pin) and id <> target_user_id) then
      return jsonb_build_object('ok', false, 'duplicate', true, 'error', 'Пользователь с паролем/PIN "' || clean_pin || '" уже существует.');
    end if;

    update auth.users
    set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
        email = new_email,
        raw_user_meta_data = raw_user_meta_data || jsonb_build_object('username', 'user_' || clean_pin),
        updated_at = now()
    where id = target_user_id;

    update auth.identities
    set provider_id = new_email,
        identity_data = jsonb_build_object('sub', target_user_id::text, 'email', new_email),
        updated_at = now()
    where user_id = target_user_id and provider = 'email';

    update public.profiles
    set username = 'user_' || clean_pin,
        updated_at = now()
    where id = target_user_id;
  end if;

  return jsonb_build_object('ok', true, 'message', 'Данные пользователя успешно обновлены!');
end;
$$;

-- 4. Функция удаления пользователя администратором (каскадно удаляет профиль, сессии, избранное и плейлисты)
create or replace function public.delete_user_by_admin(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then raise exception 'Forbidden: admin role required'; end if;
  if target_user_id = auth.uid() then raise exception 'Cannot delete self'; end if;
  delete from auth.users where id = target_user_id;
  return true;
end;
$$;
