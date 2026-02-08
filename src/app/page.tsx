import { db } from "@/lib/db";
import { books } from "@/lib/schema/books";

export default async function Home() {
  const allBooks = await db.select().from(books);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Books</h1>

      <ul>
        {allBooks.map((book) => (
          <li key={book.id}>
            {book.title} ({book.publicationYear})
          </li>
        ))}
      </ul>
    </main>
  );
}
