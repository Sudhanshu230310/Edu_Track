import { pgTable, bigserial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contentsTable } from "./books";

export const buttonClicksTable = pgTable("button_clicks", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: text("user_id").notNull(),
  button_label: text("button_label").notNull(),
  content_id: integer("content_id").references(() => contentsTable.id),
  clicked_at: timestamp("clicked_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertButtonClickSchema = createInsertSchema(buttonClicksTable).omit({ id: true, clicked_at: true });
export type InsertButtonClick = z.infer<typeof insertButtonClickSchema>;
export type ButtonClick = typeof buttonClicksTable.$inferSelect;

export const videoWatchEventsTable = pgTable("video_watch_events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: text("user_id").notNull(),
  video_id: text("video_id").notNull(),
  content_id: integer("content_id").references(() => contentsTable.id),
  watched_seconds: integer("watched_seconds").notNull(),
  recorded_at: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVideoWatchSchema = createInsertSchema(videoWatchEventsTable).omit({ id: true, recorded_at: true });
export type InsertVideoWatch = z.infer<typeof insertVideoWatchSchema>;
export type VideoWatchEvent = typeof videoWatchEventsTable.$inferSelect;

export const contentScrollDepthTable = pgTable("content_scroll_depth", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  user_id: text("user_id").notNull(),
  content_id: integer("content_id").references(() => contentsTable.id),
  max_scroll_percent: integer("max_scroll_percent").notNull(),
  recorded_at: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertScrollDepthSchema = createInsertSchema(contentScrollDepthTable).omit({ id: true, recorded_at: true });
export type InsertScrollDepth = z.infer<typeof insertScrollDepthSchema>;
export type ContentScrollDepth = typeof contentScrollDepthTable.$inferSelect;
