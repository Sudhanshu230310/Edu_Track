import { Router, type IRouter, type Request, type Response } from "express";
import { pool } from "@workspace/db";
import { authMiddleware, type JwtPayload } from "./auth";

const router: IRouter = Router();

router.post("/progress/complete", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as any).user as JwtPayload;
  const { content_id } = req.body;

  if (content_id == null) {
    res.status(400).json({ error: "content_id is required" });
    return;
  }

  await pool.query(
    "INSERT INTO user_progress (user_id, content_id) VALUES ($1, $2) ON CONFLICT (user_id, content_id) DO NOTHING",
    [userId, content_id]
  );

  res.status(201).json({ ok: true });
});

router.delete("/progress/complete", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as any).user as JwtPayload;
  const { content_id } = req.body;

  if (content_id == null) {
    res.status(400).json({ error: "content_id is required" });
    return;
  }

  await pool.query(
    "DELETE FROM user_progress WHERE user_id = $1 AND content_id = $2",
    [userId, content_id]
  );

  res.json({ ok: true });
});

router.get("/progress", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as any).user as JwtPayload;

  const result = await pool.query(
    `SELECT up.content_id, c.title as content_title, c.chapter_id,
            ch.book_id, ch.title as chapter_title, b.title as book_title,
            up.completed_at
     FROM user_progress up
     JOIN contents c ON c.id = up.content_id
     JOIN chapters ch ON ch.id = c.chapter_id
     JOIN books b ON b.id = ch.book_id
     WHERE up.user_id = $1
     ORDER BY up.completed_at DESC`,
    [userId]
  );

  res.json({ progress: result.rows });
});

router.get("/progress/book/:bookId", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { userId } = (req as any).user as JwtPayload;
  const bookId = parseInt(req.params.bookId as string, 10);

  if (isNaN(bookId)) {
    res.status(400).json({ error: "Invalid book id" });
    return;
  }

  const totalResult = await pool.query(
    `SELECT COUNT(c.id)::int as total
     FROM contents c
     JOIN chapters ch ON ch.id = c.chapter_id
     WHERE ch.book_id = $1`,
    [bookId]
  );

  const completedResult = await pool.query(
    `SELECT COUNT(up.content_id)::int as completed, ARRAY_AGG(up.content_id) as completed_ids
     FROM user_progress up
     JOIN contents c ON c.id = up.content_id
     JOIN chapters ch ON ch.id = c.chapter_id
     WHERE up.user_id = $1 AND ch.book_id = $2`,
    [userId, bookId]
  );

  const total = totalResult.rows[0].total;
  const completed = completedResult.rows[0].completed;
  const completedIds: number[] = completedResult.rows[0].completed_ids || [];
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({ total, completed, percent, completedIds });
});

export default router;
