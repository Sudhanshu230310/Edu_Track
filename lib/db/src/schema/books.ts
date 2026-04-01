import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const booksTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  cover_url: text("cover_url"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBookSchema = createInsertSchema(booksTable).omit({ id: true, created_at: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof booksTable.$inferSelect;

export const chaptersTable = pgTable("chapters", {
  id: serial("id").primaryKey(),
  book_id: integer("book_id").references(() => booksTable.id),
  title: text("title").notNull(),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChapterSchema = createInsertSchema(chaptersTable).omit({ id: true, created_at: true });
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chaptersTable.$inferSelect;

export const contentsTable = pgTable("contents", {
  id: serial("id").primaryKey(),
  chapter_id: integer("chapter_id").references(() => chaptersTable.id),
  title: text("title").notNull(),
  body: text("body"),
  video_url: text("video_url"),
  video_id: text("video_id"),
  order_index: integer("order_index").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContentSchema = createInsertSchema(contentsTable).omit({ id: true, created_at: true });
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contentsTable.$inferSelect;
