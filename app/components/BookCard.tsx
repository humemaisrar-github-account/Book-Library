"use client";
import Image from "next/image";
import { useState } from "react";
import { FiEdit2, FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { Book } from "../lib/types";
import StarRating from "./StarRating";

type Props = {
  book: Book;
  favourite: boolean;
  onToggleFavourite: (id: number) => void;
  onToggleAvailable: (book: Book) => void;
  onRate: (book: Book, rating: number) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

export default function BookCard({
  book,
  favourite,
  onToggleFavourite,
  onToggleAvailable,
  onRate,
  onEdit,
  onDelete,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = book.image && !imgFailed;

  return (
    <li className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200 transition hover:-translate-y-1 hover:shadow-xl dark:bg-stone-800 dark:ring-stone-700">
      <div className="relative h-72 w-full bg-stone-200 dark:bg-stone-700">
        {hasImage ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={book.image.startsWith("data:")}
            onError={() => setImgFailed(true)}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500 to-stone-700 p-4 text-center text-2xl font-bold text-white">
            {book.title}
          </div>
        )}

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
            book.available ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {book.available ? "Available" : "Borrowed"}
        </span>

        <button
          onClick={() => onToggleFavourite(book.id)}
          aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={favourite}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-600 shadow transition hover:scale-110"
        >
          {favourite ? <FaHeart size={16} /> : <FiHeart size={16} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
          {book.genre}
        </span>
        <h2 className="text-lg font-semibold leading-snug text-stone-900 dark:text-stone-50">{book.title}</h2>
        <p className="text-sm text-stone-600 dark:text-stone-400">by {book.author}</p>
        <StarRating value={book.rating} onChange={(r) => onRate(book, r)} />

        <div className="mt-auto flex items-center gap-2 pt-3">
          <button
            onClick={() => onToggleAvailable(book)}
            className="flex-1 rounded-lg bg-stone-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-stone-700 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {book.available ? "Borrow" : "Return"}
          </button>
          <button
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.title}`}
            className="rounded-lg p-2.5 text-stone-700 ring-1 ring-stone-300 transition hover:bg-stone-100 dark:text-stone-200 dark:ring-stone-600 dark:hover:bg-stone-700"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(book)}
            aria-label={`Delete ${book.title}`}
            className="rounded-lg p-2.5 text-rose-600 ring-1 ring-rose-300 transition hover:bg-rose-50 dark:ring-rose-800 dark:hover:bg-rose-950"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
