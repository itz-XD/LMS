"use client";

import { ThemeToggle } from "@/components/theme-toggle";
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

  const [selectedBookId, setSelectedBookId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);

  async function addCopies() {
    if (!selectedBookId) return;

    await fetch("/api/book-copies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: selectedBookId,
        quantity,
      }),
    });

    setQuantity(1);
    setSelectedBookId("");
  }

  return (
    <main className="p-6 max-w-xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Library</h1>
        <ThemeToggle />
      </div>

      {/* Add Book Form */}
      <div className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold">Add Book</h2>

        <div>
          <Label className="mb-2">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label className="mb-2">ISBN</Label>
          <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </div>

        <Button onClick={addBook}>Add Book</Button>
      </div>

      {/* Add Book Copies */}
      <div className="space-y-4 border p-4 rounded">
        <h2 className="font-semibold">Add Book Copies</h2>

        <div>
          <Label>Select Book</Label>
          <select
            className="w-full border rounded p-2"
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(Number(e.target.value))}
          >
            <option value="">Select a book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Number of Copies</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <Button onClick={addCopies}>Add Copies</Button>
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
