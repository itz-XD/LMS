import { NextResponse } from "next/server";
import { db } from "@/lib/db";
// import { bookCopies } from "@/lib/schema/bookCopies";
import { borrowRecords } from "@/lib/schema/borrowRecords";
// import { eq, notExists } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();
  const { borrowerId, bookId } = body;

  if (!borrowerId || !bookId) {
    return NextResponse.json(
      { error: "borrowerId and bookId required" },
      { status: 400 },
    );
  }

  // Find an available copy
  // const availableCopy = await db
  //   .select()
  //   .from(bookCopies)
  //   .where(eq(bookCopies.bookId, bookId))
  //   .where(
  //     notExists(
  //       db
  //         .select()
  //         .from(borrowRecords)
  //         .where(eq(borrowRecords.bookCopyId, bookCopies.id))
  //         .where(eq(borrowRecords.returnDate, null)),
  //     ),
  //   )
  //   .limit(1);

  const availableCopy = await db.execute(sql`
  SELECT bc.id
  FROM book_copies bc
  WHERE bc.book_id = ${bookId}
  AND bc.id NOT IN (
    SELECT br.book_copy_id
    FROM borrow_records br
    WHERE br.return_date IS NULL
  )
  LIMIT 1
`);

  // if (availableCopy.length === 0) {
  //   return NextResponse.json({ error: "No available copies" }, { status: 400 });
  // }

  // // const copyId = availableCopy[0].id;
  // const copyId = availableCopy.rows[0]?.id;

  if (availableCopy.rows.length === 0) {
    return NextResponse.json({ error: "No available copies" }, { status: 400 });
  }

  const copyId = availableCopy.rows[0].id as number;

  if (!copyId) {
    return NextResponse.json({ error: "No available copies" }, { status: 400 });
  }

  // Create borrow record
  await db.insert(borrowRecords).values({
    borrowerId,
    bookCopyId: copyId,
    status: "borrowed",
  });

  return NextResponse.json({ success: true });
}
