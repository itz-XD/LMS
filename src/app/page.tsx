"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Book = {
  id: number;
  title: string;
  isbn: string;
  publicationYear: number | null;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");

  async function fetchBooks() {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  }

  async function addBook() {
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        isbn,
        publicationYear: 2024,
        genre: "Math",
      }),
    });

    setTitle("");
    setIsbn("");
    fetchBooks(); // 🔥 NO reload
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Library</h1>

      {/* Add Book Form */}
      <div className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold">Add Book</h2>

        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>ISBN</Label>
          <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </div>

        <Button onClick={addBook}>Add Book</Button>
      </div>

      {/* Books List */}
      <div className="space-y-2">
        <h2 className="font-semibold">Books</h2>

        <ul className="list-disc pl-5">
          {books.map((book) => (
            <li key={book.id}>
              {book.title} ({book.publicationYear ?? "N/A"})
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
