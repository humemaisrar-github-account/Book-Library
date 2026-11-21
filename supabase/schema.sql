-- Book Library — database schema.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run again; it skips anything that already exists.
--
-- Accounts live in Clerk, not here, so this file only creates the books table.
-- user_id holds the Clerk user id (a string such as "user_2ab...").

create table if not exists public.books (
  id         bigint generated always as identity primary key,
  user_id    text        not null,
  title      text        not null,
  author     text        not null,
  image      text        not null default '',
  available  boolean     not null default true,
  genre      text        not null default 'Other',
  rating     smallint    not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

create index if not exists books_user_id_idx on public.books using btree (user_id);

-- The app connects straight to Postgres with DATABASE_URL, so it is unaffected
-- by this. Row Level Security with no policies blocks Supabase's public API
-- keys entirely, which is what we want: nothing should reach this table except
-- the app itself.
alter table public.books enable row level security;

drop policy if exists "Public read access"   on public.books;
drop policy if exists "Public insert access" on public.books;
drop policy if exists "Public update access" on public.books;
drop policy if exists "Public delete access" on public.books;

-- If an earlier version of this project created Better Auth tables, they are no
-- longer used. Uncomment to remove them:
-- drop table if exists public.session, public.account, public.verification, public."user" cascade;
