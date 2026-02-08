import { pgTable, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { authors } from "./authors";
import { books } from "./books";

export const authorBook = pgTable(
  "author_book",
  {
    authorId: integer("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),

    bookId: integer("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.authorId, table.bookId),
  }),
);
