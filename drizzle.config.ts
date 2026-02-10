import path from "path";
import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

// 🔥 FORCE load .env from project root
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export default {
  schema: "./src/lib/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
