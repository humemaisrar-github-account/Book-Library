-- Book Library schema.
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run.

create table if not exists public.books (
  id         bigint generated always as identity primary key,
  title      text        not null,
  author     text        not null,
  image      text        not null default '',
  available  boolean     not null default true,
  genre      text        not null default 'Other',
  rating     smallint    not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

-- Row Level Security is on, with open policies because this app has no login yet.
-- Add Supabase Auth and tighten these policies before using real user data.
alter table public.books enable row level security;

drop policy if exists "Public read access"   on public.books;
drop policy if exists "Public insert access" on public.books;
drop policy if exists "Public update access" on public.books;
drop policy if exists "Public delete access" on public.books;

create policy "Public read access"   on public.books for select using (true);
create policy "Public insert access" on public.books for insert with check (true);
create policy "Public update access" on public.books for update using (true) with check (true);
create policy "Public delete access" on public.books for delete using (true);

-- Starter books (only inserted while the table is still empty).
insert into public.books (title, author, image, available, genre)
select * from (values
  ('Read People Like a Book', 'Patrick King',        '/img1.jpg',  true, 'Psychology'),
  ('To Kill a Mockingbird',   'Harper Lee',          '/img.3.jpg', true, 'Classic'),
  ('Normal People',           'Sally Rooney',        '/img2.jpg',  true, 'Romance'),
  ('Animal Farm',             'George Orwell',       '/img.4.jpg', true, 'Classic'),
  ('Pride and Prejudice',     'Jane Austen',         '/img5.jpg',  true, 'Romance'),
  ('The Great Gatsby',        'F. Scott Fitzgerald', '/img6.jpg',  true, 'Classic'),
  ('The Alchemist',           'Paulo Coelho',        '/img7.jpg',  true, 'Adventure'),
  ('The Book Thief',          'Markus Zusak',        '/img8.jpg',  true, 'Historical'),
  ('The Kite Runner',         'Khaled Hosseini',     '/img9.jpg',  true, 'Fiction')
) as seed(title, author, image, available, genre)
where not exists (select 1 from public.books);
