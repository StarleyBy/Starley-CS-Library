-- =============================================================================
-- Starley CS Library — Quiz Backend Schema (Supabase / Postgres)
-- Replaces: single "quiz_data" Google Sheet with one giant JSON cell per user.
--
-- Design goals (each maps to a finding from the sync audit):
--   1. No more "whole profile in one JSON blob" -> no 50,000-char cell limit,
--      no full-object overwrite on every tiny change.
--   2. Every mutation (favorite, playlist item, session) is its own row ->
--      inserts/deletes are naturally idempotent and mergeable. No "union only,
--      can't delete" problem, no lost-update race condition.
--   3. Row Level Security enforces "a user can only read/write their own data"
--      at the DATABASE level — this can't be bypassed by reading client JS,
--      unlike the current admin-PIN-in-source-code situation.
--   4. Realtime subscriptions replace 30s polling, so there's no "pull silently
--      overwrites a pending local change" race class at all.
-- =============================================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES  (1:1 extension of auth.users; auth.users itself holds the
--    login identity — see "Auth model" note in MIGRATION_PLAN.md)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
    id            uuid primary key references auth.users(id) on delete cascade,
    username      text unique,                -- e.g. 'user_778899', kept for continuity with old PIN-based accounts
    nickname      text not null default 'Doctor',
    avatar        text not null default 'doc',
    role          text not null default 'user' check (role in ('user', 'admin')),
    is_guest      boolean not null default false,
    level_num     int  not null default 1,
    current_exp   int  not null default 0,
    total_exp     int  not null default 0,
    tier_id       int  not null default 1,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 2. FAVORITES — one row per favorited question. Add = insert, remove = delete.
--    No array to merge, no way for a deletion to "resurrect".
-- -----------------------------------------------------------------------------
create table if not exists public.favorites (
    user_id     uuid not null references auth.users(id) on delete cascade,
    special_id  text not null,               -- e.g. '12🧠45' (manifestNum + questionId)
    created_at  timestamptz not null default now(),
    primary key (user_id, special_id)
);

-- -----------------------------------------------------------------------------
-- 3. PLAYLISTS + PLAYLIST_ITEMS — same principle: items are rows, not an array
--    field inside a playlist JSON object.
-- -----------------------------------------------------------------------------
create table if not exists public.playlists (
    id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references auth.users(id) on delete cascade,
    title       text not null default '1',
    icon_id     int  not null default 1,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table if not exists public.playlist_items (
    playlist_id  uuid not null references public.playlists(id) on delete cascade,
    special_id   text not null,
    added_at     timestamptz not null default now(),
    primary key (playlist_id, special_id)
);

-- -----------------------------------------------------------------------------
-- 4. QUIZ_SESSIONS — one row per completed test. Insert-only from the client
--    (upsert on session_id for idempotency), so a session can never be lost
--    by a stale full-object overwrite, and history never needs re-uploading.
--
--    IMPORTANT: detail_summary stores the COMPACT per-question string
--    (specialId or specialId(correct)chosen for wrong answers), the same
--    format the dead `sanitizeSessionForSync()` in quiz.js already computes —
--    NOT the full bilingual question/options/explanation text. That text
--    lives in the static manifest JSON files already shipped with the site;
--    there is no need to duplicate it per session, ever.
-- -----------------------------------------------------------------------------
create table if not exists public.quiz_sessions (
    id                uuid primary key default gen_random_uuid(),
    user_id           uuid not null references auth.users(id) on delete cascade,
    session_id        text not null,          -- client-generated, e.g. 'sess_<timestamp>'
    date              timestamptz not null default now(),
    set_title         text,
    mode              text,
    lang              text,
    total_q           int  not null default 0,
    correct_q         int  not null default 0,
    score_pct         numeric,
    time_spent_sec    int,
    exp_gained        int  default 0,
    topics            text[] default '{}',
    detail_summary    text,                   -- compact wrong/right answer string, see note above
    created_at        timestamptz not null default now(),
    unique (user_id, session_id)
);

create index if not exists idx_quiz_sessions_user_date
    on public.quiz_sessions (user_id, date desc);

-- -----------------------------------------------------------------------------
-- 5. updated_at trigger helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();

drop trigger if exists trg_playlists_updated_at on public.playlists;
create trigger trg_playlists_updated_at
    before update on public.playlists
    for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.profiles       enable row level security;
alter table public.favorites      enable row level security;
alter table public.playlists      enable row level security;
alter table public.playlist_items enable row level security;
alter table public.quiz_sessions  enable row level security;

-- Helper: is the current auth'd user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

-- Admin action: securely delete a user and cascade all their data
create or replace function public.delete_user_by_admin(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
begin
    if not public.is_admin() then
        raise exception 'Forbidden: only administrators can delete users';
    end if;

    if target_user_id = auth.uid() then
        raise exception 'Cannot delete your own administrator account';
    end if;

    delete from auth.users where id = target_user_id;
    return true;
end;
$$;

-- ---- profiles ----
create policy "profiles_select_own_or_admin" on public.profiles
    for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
    for update using (id = auth.uid());
-- Row insertion happens via the handle_new_user trigger below (security definer),
-- not directly by the client — see MIGRATION_PLAN.md.

-- ---- favorites ----
create policy "favorites_all_own" on public.favorites
    for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- playlists ----
create policy "playlists_all_own" on public.playlists
    for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- playlist_items (ownership checked via parent playlist) ----
create policy "playlist_items_all_own" on public.playlist_items
    for all using (
        exists (select 1 from public.playlists p
                where p.id = playlist_id and p.user_id = auth.uid())
    )
    with check (
        exists (select 1 from public.playlists p
                where p.id = playlist_id and p.user_id = auth.uid())
    );

-- ---- quiz_sessions ----
create policy "quiz_sessions_select_own_or_admin" on public.quiz_sessions
    for select using (user_id = auth.uid() or public.is_admin());
create policy "quiz_sessions_insert_own" on public.quiz_sessions
    for insert with check (user_id = auth.uid());
create policy "quiz_sessions_update_own" on public.quiz_sessions
    for update using (user_id = auth.uid());

-- =============================================================================
-- Auto-create a profile row whenever a new auth user signs up
-- (so the client never needs elevated privileges to create its own profile)
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
    insert into public.profiles (id, username, nickname)
    values (new.id, new.raw_user_meta_data->>'username',
            coalesce(new.raw_user_meta_data->>'nickname', 'Doctor'));
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- =============================================================================
-- Realtime — enable live push updates so clients don't need to poll at all.
-- =============================================================================
alter publication supabase_realtime add table public.favorites;
alter publication supabase_realtime add table public.playlists;
alter publication supabase_realtime add table public.playlist_items;
alter publication supabase_realtime add table public.quiz_sessions;
alter publication supabase_realtime add table public.profiles;
