"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
 

type Book = {
  id: number;
  title: string;
  author: string;
  image: string;
  available: boolean;
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<{
    title: string;
    author: string;
    image: string | File;
    available: boolean;
  }>({
    title: "",
    author: "",
    image: "",
    available: true,
  });
  const [editBook, setEditBook] = useState<Book | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const addBook = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("image", newBook.image);
      formData.append("available", newBook.available.toString());

      await fetch("/api/books", {
        method: "POST",
        body: JSON.stringify(newBook),
        headers: { "Content-Type": "application/json" },
      });
      setNewBook({ title: "", author: "", image: "", available: true });
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const updateBook = async () => {
    try {
      await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBook),
      });
      setEditBook(null);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (id:number) => {
    try {
      await fetch("/api/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<
      React.SetStateAction<{
        title: string;
        author: string;
        image: string | File;
        available: boolean;
      }>
    >
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file); // Convert the file to a base64 string
    }
  };
  

  return (
    <div className="p-6 bg-[#c0bfbb] min-h-screen" >
      <h1 className="text-4xl font-bold text-[#0c0c0c] text-center mb-6 hover:text-gray-800">
        Book Collection📚
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {books.length > 0 ? (
          books.map((book) => (
            <li
              key={book.id}
              className="bg-stone-500 shadow-md rounded-lg p-4 relative hover:bg-slate-300"
            > 
            <Image
                src={book.image}
                alt={book.title}
                width={200}
                height={300}
                className="rounded-md object-cover w-full h-[300px]"
              /> 
               <h2 className="text-lg font-semibold mt-4 text-center text-zinc-950">
                {book.title}
              </h2>
              
              <p className="text-center text-gray-900">
                <strong>Author:</strong> {book.author}
               </p>
               <p className="text-center font-bold">
                Status: {book.available ? "Available" : "Not Available"}
              </p>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                onClick={() => setEditBook(book)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded ml-2 float-end hover:bg-red-700"
                onClick={() => deleteBook(book.id)}
              >
                  delete
              </button>
              
            </li>
          ))
        ) : (
          <p className="text-center col-span-full">No books available.</p>
        )}
      </ul> 
      {editBook && (
        <div className="my-[20px] flex flex-col justify-center items-center w-full  bg-gray-600 hover:bg-neutral-500 ">
          <h2 className="text-3xl my-3 font-bold text-stone-950">Edit Book</h2>
          <input
            type="text"
            placeholder="Title"
            value={editBook.title}
            onChange={(e) =>
              setEditBook({ ...editBook, title: e.target.value })
            }
            className="md:w-[50%] w-[100%] p-3 my-2 text-2xl outline-none"
          />
          <input
            type="text"
            placeholder="Author"
            value={editBook.author}
            onChange={(e) =>
              setEditBook({ ...editBook, author: e.target.value })
            }
            className="md:w-[50%] w-[100%] p-3 my-2 text-2xl outline-none"
          />
          <input
            type="file"
            onChange={(e) =>
              setEditBook((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }

            className="md:w-[50%] w-[100%] p-3 my-2 bg-white"
          />
          <button
            className=" bg-gray-900 hover:bg-stone-600 text-white px-2 py-3 rounded md:w-[20%] w-[90%] my-2 mx-auto"
            onClick={updateBook}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-900 hover:bg-stone-600 text-white px-2 py-3 rounded mx-auto md:w-[20%] w-[90%] my-2"
            onClick={() => setEditBook(null)}
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className=" w-full my-40 flex flex-col justify-center items-center bg-gray-600 hover:bg-neutral-500 ">
        <h2 className="text-3xl my-3 font-bold text-stone-950">Add a New Book</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          className="md:w-[50%] w-[100%] p-3 my-2 text-2xl outline-none"
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          className="md:w-[50%] w-[100%] p-3 my-2 text-2xl outline-none"
        />
        <input
          type="file"
          onChange={(e) => handleImageUpload(e, setNewBook)}
          className="md:w-[50%] w-[100%] p-3 my-2 bg-white"
        />
        <button
          className="bg-gray-900 hover:bg-stone-600 text-white mx-auto  py-3 text-xl rounded my-2 md:w-[20%] w-[90%]"
          onClick={addBook}
        >
          Add Book
        </button>
        </div>
      </div>
     
  );
}
    