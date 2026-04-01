-- Initialize missing schema elements for the Content Insight database.
-- Run with:
--   psql -U postgres -d content_insight -f scripts/init-db.sql

ALTER TABLE chapters
  ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS contents (
  id serial PRIMARY KEY,
  chapter_id integer REFERENCES chapters(id),
  title text NOT NULL,
  body text,
  video_url text,
  video_id text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  content_id integer REFERENCES contents(id),
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_watch_events (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  video_id text NOT NULL,
  content_id integer REFERENCES contents(id),
  watched_seconds integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_scroll_depth (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  content_id integer REFERENCES contents(id),
  max_scroll_percent integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS button_clicks (
  id serial PRIMARY KEY,
  user_id text,
  button_label text,
  content_id integer REFERENCES contents(id),
  clicked_at timestamptz NOT NULL DEFAULT now(),
  button_name text,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'button_clicks'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE button_clicks
      DROP CONSTRAINT IF EXISTS button_clicks_user_id_fkey;
    ALTER TABLE button_clicks
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS button_label text;
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS content_id integer REFERENCES contents(id);
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS clicked_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS button_name text;
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS clicks integer NOT NULL DEFAULT 0;
ALTER TABLE button_clicks
  ADD COLUMN IF NOT EXISTS created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE button_clicks
SET button_label = button_name
WHERE button_label IS NULL
  AND button_name IS NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'video_watch_events'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE video_watch_events
      DROP CONSTRAINT IF EXISTS video_watch_events_user_id_fkey;
    ALTER TABLE video_watch_events
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'content_scroll_depth'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE content_scroll_depth
      DROP CONSTRAINT IF EXISTS content_scroll_depth_user_id_fkey;
    ALTER TABLE content_scroll_depth
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_user_progress'
  ) THEN
    ALTER TABLE user_progress
      ADD CONSTRAINT unique_user_progress UNIQUE (user_id, content_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_button_clicks_content ON button_clicks(content_id);
CREATE INDEX IF NOT EXISTS idx_button_clicks_label   ON button_clicks(button_label);
CREATE INDEX IF NOT EXISTS idx_video_watch_content   ON video_watch_events(content_id);
CREATE INDEX IF NOT EXISTS idx_video_watch_video     ON video_watch_events(video_id);
CREATE INDEX IF NOT EXISTS idx_scroll_content        ON content_scroll_depth(content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id    ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content_id ON user_progress(content_id);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'chapters'
      AND column_name = 'content'
  ) THEN
    INSERT INTO contents (chapter_id, title, body, order_index)
    SELECT id, 'Overview', content, 0
    FROM chapters
    WHERE content IS NOT NULL
      AND content <> ''
      AND NOT EXISTS (
        SELECT 1 FROM contents c WHERE c.chapter_id = chapters.id
      );

    ALTER TABLE chapters
      DROP COLUMN IF EXISTS content;
  END IF;
END $$;
