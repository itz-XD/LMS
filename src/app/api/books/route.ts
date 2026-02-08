import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { books } from "@/lib/schema/books";

export async function POST(req: Request) {
  const body = await req.json();

  const { title, isbn, publicationYear, genre } = body;

  if (!title || !isbn) {
    return NextResponse.json(
      { error: "Title and ISBN are required" },
      { status: 400 },
    );
  }

  await db.insert(books).values({
    title,
    isbn,
    publicationYear,
    genre,
  });

  return NextResponse.json({ success: true });
}
