import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/books", async (req, res): Promise<void> => {
  const result = await pool.query(`
    SELECT b.id, b.title, b.description, b.cover_url, b.created_at,
           COUNT(c.id)::int AS chapter_count
    FROM books b
    LEFT JOIN chapters c ON c.book_id = b.id
    GROUP BY b.id
    ORDER BY b.created_at ASC
  `);
  res.json(result.rows);
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid book id" });
    return;
  }

  const bookResult = await pool.query(
    "SELECT * FROM books WHERE id = $1",
    [id]
  );

  if (bookResult.rows.length === 0) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  const chaptersResult = await pool.query(
    "SELECT * FROM chapters WHERE book_id = $1 ORDER BY order_index ASC",
    [id]
  );

  const chapterIds = chaptersResult.rows.map((c: { id: number }) => c.id);
  let contentRows: Array<{ id: number; chapter_id: number; title: string; order_index: number; created_at: string }> = [];
  if (chapterIds.length > 0) {
    const contentsResult = await pool.query(
      `SELECT id, chapter_id, title, order_index, created_at
       FROM contents
       WHERE chapter_id = ANY($1)
       ORDER BY order_index ASC`,
      [chapterIds]
    );
    contentRows = contentsResult.rows;
  }

  const contentsByChapter: Record<number, typeof contentRows> = {};
  for (const row of contentRows) {
    if (!contentsByChapter[row.chapter_id]) contentsByChapter[row.chapter_id] = [];
    contentsByChapter[row.chapter_id].push(row);
  }

  const chapters = chaptersResult.rows.map((ch: { id: number; book_id: number; title: string; order_index: number; created_at: string }) => ({
    ...ch,
    contents: contentsByChapter[ch.id] || [],
  }));

  res.json({
    ...bookResult.rows[0],
    chapters,
  });
});

export default router;
