import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookCopies } from "@/lib/schema/bookCopies";

export async function POST(req: Request) {
  const body = await req.json();
  const { bookId, quantity } = body;

  if (!bookId || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "Invalid bookId or quantity" },
      { status: 400 },
    );
  }

  // Create N copies
  const copies = Array.from({ length: quantity }).map(() => ({
    bookId,
  }));

  await db.insert(bookCopies).values(copies);

  return NextResponse.json({ success: true });
}
