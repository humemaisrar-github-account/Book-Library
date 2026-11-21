# 📚 Book Library

A clean, responsive book library app built with **Next.js 15**, **React**, **TypeScript** and **Tailwind CSS**.
Browse your collection, borrow and return books, rate them, and keep a list of favourites.

## Features

- 🔎 **Live search** by title or author
- 🏷️ **Filters** for All / Available / Borrowed / Favourites, plus a **genre** filter
- ↕️ **Sorting**: newest, title (A–Z), author (A–Z), top rated
- 📖 **Borrow / Return** a book with one click
- ⭐ **Star ratings** (click the same star again to clear it)
- ❤️ **Favourites**, saved in your browser
- ➕ **Add / edit books** in a modal with cover upload (images are resized automatically) and validation
- 🗑️ **Delete confirmation** so nothing disappears by accident
- 🌙 **Dark mode** that remembers your choice
- 📊 **Stats** for total, available, borrowed and favourite books
- ✨ Loading skeletons, empty states, toast messages and cover fallbacks

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Create the database (free Supabase project)

1. Make a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste everything from [`supabase/schema.sql`](supabase/schema.sql) and hit **Run**.
   That creates the `books` table, its security policies, and nine starter books.
3. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key.

### 3. Add your keys

```bash
cp .env.example .env.local
```

Then fill in:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

Supabase's own Next.js quickstart names the same two values
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
Either pair works — the app checks both. The un-prefixed names are preferred,
because keys without `NEXT_PUBLIC_` stay on the server and never ship to the browser.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

> Without the two env vars the app still builds and loads — it just shows a
> "Database not connected yet" message instead of books.

## Deploying

There is no separate backend to deploy. The API lives in `app/api/books/route.ts`,
which Next.js turns into a serverless function, and Supabase is already hosted for you.

1. Import the repo on [Vercel](https://vercel.com/new).
2. Add the project URL and anon key under **Settings → Environment Variables**
   (tick Production, Preview and Development).
3. Deploy. Every later push to `main` redeploys automatically.

If you add the env vars after the first deploy, redeploy once so they are picked up.

## Project Structure

```
app/
├── api/books/route.ts     # REST API: GET, POST, PUT, DELETE (validated, Supabase-backed)
├── components/
│   ├── Library.tsx        # Main page logic: search, filters, sorting, CRUD
│   ├── BookCard.tsx       # One book card
│   ├── BookModal.tsx      # Add / edit form
│   ├── StarRating.tsx
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   └── Footer.tsx
├── lib/
│   ├── types.ts           # Shared types and genre list
│   └── supabase.ts        # Server-side Supabase client
├── layout.tsx
└── page.tsx
supabase/schema.sql        # Table, policies and starter data
```

## API

| Method | Endpoint     | Body                                   | Result            |
| ------ | ------------ | -------------------------------------- | ----------------- |
| GET    | `/api/books` | –                                      | All books         |
| POST   | `/api/books` | `title`, `author`, `genre`, `image`, … | The created book  |
| PUT    | `/api/books` | `id` + any fields to change            | The updated book  |
| DELETE | `/api/books` | `id`                                   | Confirmation      |

Every route returns `503` with a setup hint when the Supabase env vars are missing,
`400` for invalid input and `404` for a book that does not exist.

Books are stored in **Supabase (PostgreSQL)**, so changes survive restarts and redeploys.

## Ideas for Next Steps

- Add Supabase Auth so each person has their own library, and tighten the table policies
- Move cover uploads to Supabase Storage instead of storing them inline
- Add due dates and reminders for borrowed books

---

Made by Humema Israr.
