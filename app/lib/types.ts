export type Book = {
  id: number;
  title: string;
  author: string;
  image: string;
  available: boolean;
  genre: string;
  rating: number; // 0 = not rated yet, 1-5 stars
};

export type BookInput = Omit<Book, "id">;

export const GENRES = [
  "Classic",
  "Fiction",
  "Romance",
  "Historical",
  "Psychology",
  "Self-Help",
  "Adventure",
  "Fantasy",
  "Mystery",
  "Science",
  "Biography",
  "Other",
] as const;
