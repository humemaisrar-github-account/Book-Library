# 📚 Book Library

A clean, responsive book library app built with **Next.js 15**, **React**, **TypeScript** and **Tailwind CSS**.
Browse your collection, borrow and return books, rate them, and keep a list of favourites.

## Features

- 🔐 **Accounts** — email and password, plus optional Google sign-in. Each person sees only their own shelf
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
   That creates the `books` table and the four tables Better Auth needs for users and sessions.
3. Open **Connect** on the project home, choose the **Transaction pooler** URI, and copy it.
   Use the pooler (port 6543) rather than a direct connection — serverless functions open
   many short-lived connections and a direct connection runs out of slots.

### 3. Add your environment variables

```bash
cp .env.example .env.local
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | The Supabase transaction-pooler connection string, with your database password filled in |
| `BETTER_AUTH_SECRET` | A random string, 32+ characters. Generate one with `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | The site's public URL, no trailing slash |
| `GOOGLE_CLIENT_ID` | Optional — only needed for Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Optional — the matching secret |

Leave the two Google values out and the app runs on email and password alone;
the Google button is hidden rather than broken.

### 4. Google sign-in (optional)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) create an
**OAuth client ID** of type *Web application*, and add these authorised redirect URIs:

```
http://localhost:3000/api/auth/callback/google
https://your-domain.com/api/auth/callback/google
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Deploying

There is no separate backend to deploy. The API routes become serverless functions and
the database is hosted by Supabase.

1. Import the repo on [Vercel](https://vercel.com/new).
2. Add the variables from the table above under **Settings → Environment Variables**
   (tick Production, Preview and Development). `BETTER_AUTH_URL` is your Vercel URL.
3. Deploy. Every later push to `main` redeploys automatically.

If you add or change env vars after a deploy, redeploy once so they are picked up.

## Project Structure

```
app/
├── api/
│   ├── auth/[...all]/     # Better Auth endpoints (sign in, sign up, callbacks)
│   └── books/route.ts     # REST API: GET, POST, PUT, DELETE, scoped to the signed-in user
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
│   ├── auth.ts            # Better Auth server config
│   ├── auth-client.ts     # Better Auth browser client
│   └── images.ts          # Photography URLs
├── signin/  signup/       # Auth pages
├── library/  about/
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

Every `/api/books` route requires a signed-in user and only ever touches that user's rows,
so one account can never read or change another's books. Routes return `401` when nobody is
signed in, `400` for invalid input, `404` for a book the user does not own, and `503` with a
setup hint when `DATABASE_URL` is missing.

Authentication runs on [Better Auth](https://www.better-auth.com) at `/api/auth/*`.
Books are stored in **PostgreSQL (hosted by Supabase)**, so changes survive restarts and redeploys.

## Ideas for Next Steps

- Email verification and password reset
- Move cover uploads to object storage instead of storing them inline
- Add due dates and reminders for borrowed books
- Share a shelf with another account, read-only

---

Made by Humema Israr.
