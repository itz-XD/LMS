import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { borrowers } from "./borrowers";
import { bookCopies } from "./bookCopies";

export const borrowRecords = pgTable("borrow_records", {
  id: serial("id").primaryKey(),

  borrowerId: integer("borrower_id")
    .notNull()
    .references(() => borrowers.id, { onDelete: "cascade" }),

  bookCopyId: integer("book_copy_id")
    .notNull()
    .references(() => bookCopies.id, { onDelete: "cascade" }),

  borrowDate: timestamp("borrow_date").defaultNow().notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});
