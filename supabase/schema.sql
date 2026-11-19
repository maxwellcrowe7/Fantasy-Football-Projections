-- FF Projection Tool — Supabase setup (project: "Personal Tools", shared with other apps).
--
-- This file was written AFTER the fact, to record what is live in the database.
-- The POLICIES below are copied exactly from the live project (pg_policies, 2026-11-18).
-- The COLUMN definitions are reconstructed from how app.js reads and writes each table;
-- confirm them against the live tables before re-running this anywhere.
--
-- Keep this file in sync: any SQL you run for this app in the Supabase SQL editor
-- should also be added here (or as a dated migration file next to it).

-- ======================================================================
-- app_state — SHARED TABLE, defined in the Disc Golf Tracker repo
-- ======================================================================
-- One row per (user_id, app). This app's rows have app = 'ff-projections';
-- the whole app state is one jsonb blob in `data`. The table and its base
-- "Users manage their own data" policy live in disc-golf-tracker/supabase-setup.sql.
-- This app adds ONE extra policy so shared viewers can read an owner's projections:

create policy "Shared viewers can read ff projections"
  on public.app_state
  for select
  to public
  using (
    app = 'ff-projections'
    and exists (
      select 1 from public.ff_shares
      where ff_shares.owner_id = app_state.user_id
        and ff_shares.viewer_email = auth.email()
    )
  );
-- The `app = 'ff-projections'` check is what stops a share from also exposing
-- the owner's Disc Golf (or any other app's) row. Never remove it.

-- ======================================================================
-- ff_shares — who an owner has shared their projections with
-- ======================================================================
create table if not exists public.ff_shares (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  owner_email  text,          -- display only; set by the client, NOT trusted
  viewer_email text not null, -- lowercased by the client
  created_at   timestamptz not null default now()
);

alter table public.ff_shares enable row level security;

create policy "Owners manage their shares"
  on public.ff_shares
  for all
  to public
  using (auth.uid() = owner_id);

create policy "Viewers can see shares addressed to them"
  on public.ff_shares
  for select
  to public
  using (auth.email() = viewer_email);

-- ======================================================================
-- ff_historical_data — one shared row of historical team stats
-- ======================================================================
-- Single row, id = '00000000-0000-0000-0000-000000000001' (HIST_ROW_ID in app.js).
-- data = { histData: [...], histCols: [...] }
create table if not exists public.ff_historical_data (
  id         uuid primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ff_historical_data enable row level security;

create policy "Anyone can read historical data"
  on public.ff_historical_data
  for select
  to public
  using (true);

create policy "Admin only insert"
  on public.ff_historical_data
  for insert
  to public
  with check (auth.email() = 'maxwellcrowe7@gmail.com');

create policy "Admin only update"
  on public.ff_historical_data
  for update
  to public
  using (auth.email() = 'maxwellcrowe7@gmail.com');

-- ======================================================================
-- Grants
-- ======================================================================
-- "Automatically expose new tables" is disabled on this project, so table
-- access must be granted explicitly. The live grants were not captured when
-- this file was written — check them with:
--
--   select table_name, grantee, privilege_type
--   from information_schema.role_table_grants
--   where table_schema = 'public' and table_name like 'ff_%';
