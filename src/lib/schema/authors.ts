import { pgTable, serial, text, date, timestamp } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  country: text("country"),
  dateOfBirth: date("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
