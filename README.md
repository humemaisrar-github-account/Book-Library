# 📚 Book Library

A clean, responsive book library app built with **Next.js 15**, **React**, **TypeScript** and **Tailwind CSS**.
Browse your collection, borrow and return books, rate them, and keep a list of favourites.

## Features

- 🔐 **Accounts** via Clerk — email, Google and more. Each person sees only their own shelf
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
2. Open **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql) and hit **Run**.
   That creates the `books` table. Accounts live in Clerk, so there is nothing else to create.
3. Open **Connect** on the project home, choose the **Connection string** tab and then
   **Transaction pooler**, and copy the URI. Replace `[YOUR-PASSWORD]` with your database password.
   Use the pooler (port 6543) rather than a direct connection — serverless functions open many
   short-lived connections and a direct connection runs out of slots.

### 3. Create a Clerk application

1. Sign up at [clerk.com](https://clerk.com) and create an application.
2. Pick the sign-in methods you want (email, Google, GitHub — Clerk hosts these,
   so there is no OAuth app to register yourself).
3. Open **API keys** and copy the publishable key and the secret key.
   The secret is shown only once.

### 4. Add your environment variables

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Supabase transaction-pooler connection string, password filled in |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From Clerk → API keys |
| `CLERK_SECRET_KEY` | From Clerk → API keys. Never commit this |

With any of them missing the site still builds and loads; the sign-in page says
which ones are absent rather than showing a server error.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Deploying

There is no separate backend to deploy. The API routes become serverless functions,
Clerk hosts the accounts and Supabase hosts the database.

1. Import the repo on [Vercel](https://vercel.com/new).
2. Add the three variables above under **Settings → Environment Variables**
   (tick Production, Preview and Development).
3. Deploy. Every later push to `main` redeploys automatically.

If you add or change env vars after a deploy, redeploy once so they are picked up.

## Project Structure

```
app/
├── api/books/route.ts     # REST API: GET, POST, PUT, DELETE, scoped to the signed-in user
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
│   ├── db.ts              # Postgres connection pool
│   ├── auth-config.ts     # Which auth env vars are present
│   └── images.ts          # Photography URLs
├── sign-in/  sign-up/     # Clerk auth pages
middleware.ts              # Clerk middleware
├── library/  about/
├── layout.tsx
└── page.tsx
supabase/schema.sql        # The books table
```

## API

| Method | Endpoint     | Body                                   | Result            |
| ------ | ------------ | -------------------------------------- | ----------------- |
| GET    | `/api/books` | –                                      | All books         |
| POST   | `/api/books` | `title`, `author`, `genre`, `image`, … | The created book  |
| PUT    | `/api/books` | `id` + any fields to change            | The updated book  |
| DELETE | `/api/books` | `id`                                   | Confirmation      |

Every `/api/books` route requires a signed-in user and only ever touches that user's rows,
so one account can never read or change another's books. Routes return `401` when nobody is
signed in, `400` for invalid input, `404` for a book the user does not own, and `503` with a
setup hint when `DATABASE_URL` is missing.

Accounts are handled by [Clerk](https://clerk.com). Books are stored in
**PostgreSQL (hosted by Supabase)**, so changes survive restarts and redeploys.

## Ideas for Next Steps

- Move cover uploads to object storage instead of storing them inline
- Add due dates and reminders for borrowed books
- Share a shelf with another account, read-only

---

Made by Humema Israr.
