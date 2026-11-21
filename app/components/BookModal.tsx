"use client";
import { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { GENRES, type Book, type BookInput } from "../lib/types";
import StarRating from "./StarRating";

type Props = {
  /** Pass a book to edit it, or null to add a new one. */
  book: Book | null;
  onClose: () => void;
  onSave: (data: BookInput, id?: number) => Promise<void>;
};

const EMPTY: BookInput = {
  title: "",
  author: "",
  image: "",
  available: true,
  genre: "Fiction",
  rating: 0,
};

/** Shrinks the picked image so we never send a huge base64 string to the API. */
function resizeImage(file: File, maxWidth = 500): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-50";

export default function BookModal({ book, onClose, onSave }: Props) {
  const [form, setForm] = useState<BookInput>(book ? { ...book } : EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = <K extends keyof BookInput>(key: K, value: BookInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      set("image", await resizeImage(file));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError("Please enter both a title and an author.");
      return;
    }
    setSaving(true);
    try {
      await onSave(form, book?.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book ? "Edit book" : "Add a new book"}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-800"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
            {book ? "Edit book" : "Add a new book"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700">
            <FiX size={20} />
          </button>
        </div>

        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Title
          <input className={`${inputClass} mt-1`} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. The Alchemist" autoFocus />
        </label>

        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
          Author
          <input className={`${inputClass} mt-1`} value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="e.g. Paulo Coelho" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
            Genre
            <select className={`${inputClass} mt-1`} value={form.genre} onChange={(e) => set("genre", e.target.value)}>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Your rating
            <div className="mt-3">
              <StarRating value={form.rating} onChange={(r) => set("rating", r)} size={24} />
            </div>
          </div>
        </div>

        <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
          Cover image
          <div className="mt-1 flex items-center gap-4">
            <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-stone-200 dark:bg-stone-700">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <FiImage className="text-stone-400" size={24} />
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImage} className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-white dark:file:bg-amber-600" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-300">
          <input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} className="h-4 w-4 accent-amber-600" />
          Available to borrow
        </label>

        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-stone-700 ring-1 ring-stone-300 hover:bg-stone-100 dark:text-stone-200 dark:ring-stone-600 dark:hover:bg-stone-700">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-amber-600 px-5 py-2 font-medium text-white hover:bg-amber-500 disabled:opacity-60">
            {saving ? "Saving…" : book ? "Save changes" : "Add book"}
          </button>
        </div>
      </form>
    </div>
  );
}
