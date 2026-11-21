-- Run this ONLY if you already ran an earlier version of schema.sql, the one
-- that created the Better Auth tables (user, session, account, verification).
--
-- It frees books.user_id from the Better Auth user table so it can hold a
-- Clerk user id, and drops the four tables Clerk has made unnecessary.
-- Safe to run more than once.

alter table public.books drop constraint if exists books_user_id_fkey;

drop table if exists public.session, public.account, public.verification, public."user" cascade;

create index if not exists books_user_id_idx on public.books using btree (user_id);
alter table public.books enable row level security;
