import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/content/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid content id" });
    return;
  }

  const result = await pool.query(
    `SELECT
       co.id, co.chapter_id, co.title, co.body, co.video_url, co.video_id,
       co.order_index, co.created_at,
       ch.title AS chapter_title,
       b.id AS book_id,
       b.title AS book_title
     FROM contents co
     JOIN chapters ch ON ch.id = co.chapter_id
     JOIN books b ON b.id = ch.book_id
     WHERE co.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: "Content not found" });
    return;
  }

  res.json(result.rows[0]);
});

export default router;
