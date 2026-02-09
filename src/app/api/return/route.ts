import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { borrowRecords } from "@/lib/schema/borrowRecords";
import { eq, isNull } from "drizzle-orm";

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
  const activeBorrow = await db
    .select()
    .from(borrowRecords)
    .where(eq(borrowRecords.borrowerId, borrowerId))
    .where(eq(borrowRecords.status, "borrowed"))
    .where(isNull(borrowRecords.returnDate))
    .limit(1);

  if (activeBorrow.length === 0) {
    return NextResponse.json(
      { error: "No active borrow found" },
      { status: 400 },
    );
  }

  const borrowId = activeBorrow[0].id;

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
