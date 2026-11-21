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

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Project Structure

```
app/
├── api/books/route.ts     # REST API: GET, POST, PUT, DELETE (with validation)
├── components/
│   ├── Library.tsx        # Main page logic: search, filters, sorting, CRUD
│   ├── BookCard.tsx       # One book card
│   ├── BookModal.tsx      # Add / edit form
│   ├── StarRating.tsx
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   └── Footer.tsx
├── lib/types.ts           # Shared types and genre list
├── layout.tsx
└── page.tsx
```

## API

| Method | Endpoint     | Body                                   | Result            |
| ------ | ------------ | -------------------------------------- | ----------------- |
| GET    | `/api/books` | –                                      | All books         |
| POST   | `/api/books` | `title`, `author`, `genre`, `image`, … | The created book  |
| PUT    | `/api/books` | `id` + any fields to change            | The updated book  |
| DELETE | `/api/books` | `id`                                   | Confirmation      |

> **Note:** books are stored in server memory, so changes reset when the server restarts.
> To make them permanent, replace the array in `app/api/books/route.ts` with a database such as Supabase or MongoDB.

## Ideas for Next Steps

- Connect a real database for permanent storage
- Add user login so each person has their own library
- Add due dates and reminders for borrowed books

---

Made by Humema Israr.
