CREATE TABLE "author_book" (
	"author_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "author_book_author_id_book_id_pk" PRIMARY KEY("author_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"country" text,
	"date_of_birth" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "book_copies" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isbn" text NOT NULL,
	"publication_year" integer,
	"genre" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "books_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
CREATE TABLE "borrowers" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "borrowers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "borrow_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"borrower_id" integer NOT NULL,
	"book_copy_id" integer NOT NULL,
	"borrow_date" timestamp DEFAULT now() NOT NULL,
	"return_date" timestamp,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "author_book" ADD CONSTRAINT "author_book_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "author_book" ADD CONSTRAINT "author_book_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_copies" ADD CONSTRAINT "book_copies_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_borrower_id_borrowers_id_fk" FOREIGN KEY ("borrower_id") REFERENCES "public"."borrowers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_book_copy_id_book_copies_id_fk" FOREIGN KEY ("book_copy_id") REFERENCES "public"."book_copies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_active_borrow" ON "borrow_records" USING btree ("book_copy_id") WHERE "borrow_records"."return_date" IS NULL;