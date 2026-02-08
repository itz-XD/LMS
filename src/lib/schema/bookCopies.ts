import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { books } from "./books";

export const bookCopies = pgTable("book_copies", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
