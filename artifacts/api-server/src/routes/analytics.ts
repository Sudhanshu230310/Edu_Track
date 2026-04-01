import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.post("/analytics/button-click", async (req, res): Promise<void> => {
  const { user_id, button_label, content_id } = req.body;
  if (!user_id || !button_label || content_id == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  await pool.query(
    "INSERT INTO button_clicks (user_id, button_label, content_id) VALUES ($1, $2, $3)",
    [user_id, button_label, content_id]
  );
  res.status(201).json({ ok: true });
});

router.post("/analytics/video-watch", async (req, res): Promise<void> => {
  const { user_id, video_id, content_id, watched_seconds } = req.body;
  if (!user_id || !video_id || content_id == null || watched_seconds == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  await pool.query(
    "INSERT INTO video_watch_events (user_id, video_id, content_id, watched_seconds) VALUES ($1, $2, $3, $4)",
    [user_id, video_id, content_id, watched_seconds]
  );
  res.status(201).json({ ok: true });
});

router.post("/analytics/scroll-depth", async (req, res): Promise<void> => {
  const { user_id, content_id, max_scroll_percent } = req.body;
  if (!user_id || content_id == null || max_scroll_percent == null) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  await pool.query(
    "INSERT INTO content_scroll_depth (user_id, content_id, max_scroll_percent) VALUES ($1, $2, $3)",
    [user_id, content_id, max_scroll_percent]
  );
  res.status(201).json({ ok: true });
});

router.get("/analytics/summary", async (_req, res): Promise<void> => {
  const [buttonClicksResult, videoWatchResult, scrollDepthResult] = await Promise.all([
    pool.query(`
      SELECT
        bc.button_label,
        bc.content_id,
        co.title AS content_title,
        COUNT(*)::int AS count
      FROM button_clicks bc
      JOIN contents co ON co.id = bc.content_id
      GROUP BY bc.button_label, bc.content_id, co.title
      ORDER BY count DESC
    `),
    pool.query(`
      SELECT
        vwe.video_id,
        vwe.content_id,
        co.title AS content_title,
        SUM(vwe.watched_seconds)::int AS total_seconds,
        ROUND(AVG(vwe.watched_seconds)::numeric, 1)::float AS avg_seconds,
        COUNT(*)::int AS sessions
      FROM video_watch_events vwe
      JOIN contents co ON co.id = vwe.content_id
      GROUP BY vwe.video_id, vwe.content_id, co.title
      ORDER BY total_seconds DESC
    `),
    pool.query(`
      SELECT
        csd.content_id,
        co.title AS content_title,
        ROUND(AVG(csd.max_scroll_percent)::numeric, 1)::float AS avg_scroll_percent
      FROM content_scroll_depth csd
      JOIN contents co ON co.id = csd.content_id
      GROUP BY csd.content_id, co.title
      ORDER BY avg_scroll_percent DESC
    `),
  ]);

  res.json({
    buttonClicks: buttonClicksResult.rows,
    videoWatch: videoWatchResult.rows,
    scrollDepth: scrollDepthResult.rows,
  });
});

export default router;
