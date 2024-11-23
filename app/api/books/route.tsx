import { NextResponse } from "next/server";

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  available: boolean;
}

let books: Book[] = [
  {
    id: 1,
    title: "Read People like a book",
    author: " Patrick King",
    image: "/img1.jpg",
    available: true,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird ",
    author: "Harper Lee",
    image: "/img.3.jpg",
    available: true,
  },
  {
    id: 3,
    title: "Normal People  ",
    author: "Sally Rooney",
    image: "/img2.jpg",
    available: true,
  },
  {
    id: 4,
    title: "Animal Farm",
    author: "George Orwell",
    image: "/img.4.jpg",
    available: true,
  },
  {
    id: 5,
    title: "Pride and Prejudice  ",
    author: "Jane Austen",
    image: "/img5.jpg",
    available: true,
  },
  {
    id: 6,
    title: "The Great Gatsby ",
    author: "F. Scott Fitzgerald ",
    image: "/img6.jpg",
    available: true,
  },
  {
    id: 7,
    title: " The Alchemist   ",
    author: " Paulo Coelho",
    image: "/img7.jpg",
    available: true,
  },
  {
    id: 8,
    title: "The Book Thief",
    author: "Markus Zusak",
    image: "/img8.jpg",
    available: true,
  },
  {
    id: 9,
    title: " The Kite Runner",
    author: "Khaled Hosseini",
    image: "/img9.jpg",
    available: true,
  },
];
 

// GET Method
export async function GET() {
  return NextResponse.json(books, { status: 200 });
}

// POST Method
export async function POST(req: Request) {
  try {
    const newBook: Book = await req.json();
    books.push({ ...newBook, id: books.length + 1 });
    return NextResponse.json({ message: "Book added successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding book!",error }, { status: 500 });
  }
}

// PUT Method
export async function PUT(req: Request) {
  try {
    const updatedBook: Book = await req.json();
    books = books.map((book) =>
      book.id === updatedBook.id ? { ...book, ...updatedBook } : book
    );
    return NextResponse.json({ message: "Book updated successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating book!",error }, { status: 500 });
  }
}

 // DELETE Method
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    books = books.filter((book) => book.id !== id);
    return NextResponse.json({ message: "Book deleted successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting book!",error }, { status: 500 });
  }
}
 