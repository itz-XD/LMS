import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { borrowRecords } from "@/lib/schema/borrowRecords";
import { eq, isNull, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { borrowerId, bookId } = body;

  if (!borrowerId || !bookId) {
    return NextResponse.json(
      { error: "borrowerId and bookId required" },
      { status: 400 },
    );
  }

  // Find active borrow record
  // const activeBorrow = await db
  //   .select()
  //   .from(borrowRecords)
  //   .where(eq(borrowRecords.borrowerId, borrowerId))
  //   .where(eq(borrowRecords.status, "borrowed"))
  //   .where(isNull(borrowRecords.returnDate))
  //   .limit(1);

  const activeBorrow = await db.execute(sql`
  SELECT br.id
  FROM borrow_records br
  JOIN book_copies bc ON bc.id = br.book_copy_id
  WHERE br.borrower_id = ${borrowerId}
    AND bc.book_id = ${bookId}
    AND br.return_date IS NULL
  LIMIT 1
`);

  if (activeBorrow.length === 0) {
    return NextResponse.json(
      { error: "No active borrow found" },
      { status: 400 },
    );
  }

  // const borrowId = activeBorrow[0].id;

  const borrowId = activeBorrow.rows[0]?.id;

  if (!borrowId) {
    return NextResponse.json(
      { error: "This borrower has not borrowed this book" },
      { status: 400 },
    );
  }

  // Update return
  await db
    .update(borrowRecords)
    .set({
      status: "returned",
      returnDate: new Date(),
    })
    .where(eq(borrowRecords.id, borrowId));

  return NextResponse.json({ success: true });
}
