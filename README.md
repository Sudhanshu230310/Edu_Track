# EduTrack — Content Analytics Platform

A full-stack learning platform that serves structured educational content (Books → Chapters → Content) and tracks how users interact with it in real time. Users sign up, browse courses, read content with embedded videos, mark lessons complete, and view an analytics dashboard showing engagement across all content.

**Live demo:** *(deploy URL goes here)*

---

## What Was Built

### Content Hierarchy

```
Books
└── Chapters
    └── Content Pages
        ├── YouTube video player (IFrame API, tracks watch time)
        ├── Interactive action buttons (Mark as Complete, Take Quiz, Download Notes)
        └── Readable content body
```

### Three Analytics Implemented

| # | Metric | What's captured | Table |
|---|---|---|---|
| A | **Button Click Tracking** | user, button label, content page, timestamp | `button_clicks` |
| B | **Video Watch Time** | user, video ID, content page, seconds watched per session | `video_watch_events` |
| C | **Scroll Depth** *(custom)* | user, content page, max scroll % reached | `content_scroll_depth` |

### Analytics Dashboard (`/analytics`)

- Summary stat cards (total clicks, total watch time, avg scroll depth)
- Bar chart: button clicks grouped by button label
- Bar chart: total video watch time per content page
- Scroll depth table: avg depth per content page with **Engaged** / **Partial** / **Bounced** status badges

---

## Architecture

### Monorepo Structure

```
/
├── artifacts/
│   ├── content-analytics/    # React + Vite frontend
│   └── api-server/           # Express 5 REST API
├── lib/
│   ├── db/                   # Drizzle schema + pg connection pool
│   ├── api-spec/             # OpenAPI 3.1 spec + Orval codegen config
│   ├── api-client-react/     # Generated React Query hooks
│   └── api-zod/              # Generated Zod schemas
```

A shared reverse proxy routes traffic so the frontend calls `/api/*` paths without CORS configuration — this works identically in development and production.

---

## Data Modeling Decisions

### Why a separate table per analytics event type?

The common alternative is a single generic `events` table with a `type` column and a `JSON payload` field. This is flexible but creates problems at scale:

- Every analytics query requires filtering by `type` first — an extra scan step before any useful work begins.
- JSON fields cannot be indexed efficiently with standard B-tree indexes.
- Schema validation is lost: a malformed `watched_seconds` can't be caught at the database level.
- Dashboard queries joining multiple event types end up doing expensive self-joins on one large table.

With separate tables (`button_clicks`, `video_watch_events`, `content_scroll_depth`), each table has typed columns, targeted indexes, and queries that touch only the data they need.

**Trade-off accepted:** More schema surface area and slightly more migration work to add a new event type. At scale, this is preferable to the query performance degradation of a generic events table.

### Why store `watched_seconds` as session rows rather than a running total?

The client sends watch events every 30 seconds while playing, and on pause/stop via `beforeunload`. Storing each session as a new row means:

- **No write contention.** Updating a single running-total row under concurrent users creates hot-row locking.
- **Session-level granularity.** You can reconstruct per-session engagement patterns, not just lifetime totals.
- **Simple aggregation.** `SUM(watched_seconds)` over indexed rows is a single efficient pass.

At very high scale (billions of rows), materialized views pre-computing `SUM`/`AVG` into a summary table, refreshed periodically, would avoid scanning all historical rows on every dashboard load.

### Analytics tables are append-only

No analytics rows are ever updated or deleted. This design enables:

- Write operations are simple `INSERT`s with no locking concerns.
- Future time-range partitioning (e.g., `button_clicks_2025_q1`) without data migration.
- A permanent audit trail — you always know what actually happened.

---

## Performance Decisions

### Indexes

Every column appearing in a `WHERE` or `GROUP BY` clause in analytics queries has a B-tree index:

```sql
-- button_clicks
CREATE INDEX idx_button_clicks_content ON button_clicks(content_id);
CREATE INDEX idx_button_clicks_label   ON button_clicks(button_label);

-- video_watch_events
CREATE INDEX idx_video_watch_content   ON video_watch_events(content_id);
CREATE INDEX idx_video_watch_video     ON video_watch_events(video_id);

-- content_scroll_depth
CREATE INDEX idx_scroll_content        ON content_scroll_depth(content_id);

-- user_progress
CREATE INDEX idx_user_progress_user_id    ON user_progress(user_id);
CREATE INDEX idx_user_progress_content_id ON user_progress(content_id);
UNIQUE(user_id, content_id)  -- also serves as the lookup index for duplicate prevention
```

Without `idx_button_clicks_content`, the analytics summary query would full-scan the entire `button_clicks` table for every dashboard load. At 1M rows that degrades from ~5ms (index seek) to 500ms+.

### SQL Aggregation, Not JavaScript Iteration

All three analytics queries perform `SUM`, `AVG`, and `COUNT` directly in SQL:

```sql
SELECT bc.button_label, bc.content_id, co.title, COUNT(*)::int AS count
FROM button_clicks bc
JOIN contents co ON co.id = bc.content_id
GROUP BY bc.button_label, bc.content_id, co.title
ORDER BY count DESC
```

The alternative — fetching raw rows into JavaScript and iterating — would transfer N rows across the database connection instead of M aggregated result rows, and use application memory for work the database can do with an index-assisted `GROUP BY`. The `::int` / `::float` casts also happen at the SQL layer, avoiding type coercions in JavaScript.

### Parallel Dashboard Queries

`GET /api/analytics/summary` runs all three aggregation queries concurrently:

```js
const [buttonClicks, videoWatch, scrollDepth] = await Promise.all([
  pool.query(buttonClicksSQL),
  pool.query(videoWatchSQL),
  pool.query(scrollDepthSQL),
]);
```

Client to server: one round trip. Server to database: three parallel queries. Dashboard load time is bounded by the slowest single query, not their sum.

### `navigator.sendBeacon` for Unload Events

Scroll depth and final video watch time are submitted when users leave a page. Regular `fetch` calls are cancelled by the browser on unload. `sendBeacon` queues the request in the browser's network stack and guarantees delivery even after the page is destroyed.

The payload must be sent as a `Blob` with an explicit content-type so Express parses it correctly:

```js
navigator.sendBeacon(
  url,
  new Blob([JSON.stringify(payload)], { type: 'application/json' })
);
```

Sending a plain string results in a `text/plain` body that `express.json()` silently drops — this was a real bug encountered and fixed during development.

---

## Third Analytic: Scroll Depth

**Business question it answers:** *Are users actually reading the content, or just watching the video and leaving?*

Scroll depth is a passive, objective engagement signal that neither of the other two metrics can capture:

- **Video watch time** tells you if users consumed the media.
- **Button clicks** tell you if users took deliberate actions.
- **Scroll depth** tells you if users read the written content that follows.

A page with high video watch time but 12% average scroll depth means users stop engaging after the video — the written content below may be redundant, too long, or off-topic. A page with low video watch time but 90% scroll depth means users skip the video but read thoroughly.

**This is directly actionable for content creators:** consistently low scroll depth on a page signals it needs restructuring. Consistently high depth signals learners value the text and it shouldn't be cut.

**Why a table instead of a bar chart?** The primary action on this metric is comparison and triage — which pages have the lowest engagement. A table is faster to scan than a bar chart for ranking. The Engaged / Partial / Bounced badges make problem pages immediately visible without requiring users to read percentage numbers.

**Threshold rationale:**
- **Engaged** (>75%): user read most of the content — reached past the midpoint and the conclusion.
- **Partial** (40–75%): user read some of the content — likely got the key information.
- **Bounced** (<40%): user left very early — the content isn't holding attention past the initial section.

---

## Handling High-Frequency Events

Scroll and video events are inherently high-frequency. Three client-side techniques reduce write volume significantly:

1. **Ratchet scroll tracking.** The scroll listener fires continuously, but `max_scroll_percent` only updates when a new maximum is reached. This produces one row per page visit, not one row per pixel scrolled.

2. **30-second video batching.** A `setInterval` accumulates `watchedSeconds` client-side and flushes every 30 seconds. A 10-minute viewing session generates ~20 writes instead of 600.

3. **`beforeunload` as the final flush.** Remaining accumulated seconds and the final scroll depth are submitted on page exit, ensuring no data is lost even if the user leaves quickly.

**At production scale** (10k+ concurrent users), the next step is an async event queue (BullMQ + Redis). The API handler enqueues the event and returns `202 Accepted` immediately; a background worker drains the queue with batch `INSERT`s. This fully decouples ingest throughput from database write latency.

---

## Authentication

- **JWT tokens**, 30-day expiry, signed with `SESSION_SECRET`
- Stored in `localStorage`, attached to every API request via `Authorization: Bearer`
- **bcrypt** password hashing (10 rounds)
- Protected routes redirect to `/login` if no valid token is present
- `setAuthTokenGetter` hook wires the token to all generated React Query hooks automatically

**Security note:** `localStorage` is simpler to implement but is vulnerable to XSS. A production deployment would use `httpOnly; Secure; SameSite=Strict` cookies with CSRF tokens on mutating routes.

---

## Database Schema

```sql
-- Content hierarchy
books     (id, title, description, cover_url, created_at)
chapters  (id, book_id, title, order_index, created_at)
contents  (id, chapter_id, title, body, video_url, video_id, order_index, created_at)

> If you are running against an older or manually created database schema, apply `scripts/init-db.sql` with `psql -U postgres -d content_insight -f scripts/init-db.sql` to add the missing schema objects required by the server.
>
> This script also creates `users`, `user_progress`, `video_watch_events`, `content_scroll_depth`, and the updated `button_clicks` shape, and migrates legacy `chapters.content` values into `contents` when present.

-- Auth & Progress
users          (id, name, email, password_hash, created_at)
user_progress  (id, user_id, content_id, completed_at)  -- UNIQUE(user_id, content_id)

-- Analytics (append-only)
button_clicks         (id, user_id, button_label, content_id, clicked_at)
video_watch_events    (id, user_id, video_id, content_id, watched_seconds, recorded_at)
content_scroll_depth  (id, user_id, content_id, max_scroll_percent, recorded_at)
```

---

## API Reference

### Auth
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create account (returns JWT) |
| `POST` | `/api/auth/login` | Login (returns JWT) |
| `GET` | `/api/auth/me` | Current user from token |

### Content
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/books` | All books with chapter counts |
| `GET` | `/api/books/:id` | Book with nested chapters and contents |
| `GET` | `/api/content/:id` | Content page with book/chapter context |

### Analytics
| Method | Route | Body / Returns |
|---|---|---|
| `POST` | `/api/analytics/button-click` | `{ user_id, button_label, content_id }` |
| `POST` | `/api/analytics/video-watch` | `{ user_id, video_id, content_id, watched_seconds }` |
| `POST` | `/api/analytics/scroll-depth` | `{ user_id, content_id, max_scroll_percent }` |
| `GET` | `/api/analytics/summary` | `{ buttonClicks[], videoWatch[], scrollDepth[] }` |

### Progress
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/progress/complete` | Mark lesson complete |
| `DELETE` | `/api/progress/complete` | Unmark lesson complete |
| `GET` | `/api/progress` | All completed lessons for current user |
| `GET` | `/api/progress/book/:id` | Completion % for a book |

---

## Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast HMR, lightweight and composable |
| Routing | Wouter | Tiny React Router alternative, 1.5kb gzipped |
| Styling | Tailwind CSS v4 | Utility-first, consistent design tokens |
| Charts | Recharts | SVG-based, composable, zero configuration |
| Data fetching | TanStack Query | Caching, background refetch, typed loading states |
| API | Express 5 + TypeScript | Minimal, typed, battle-tested HTTP server |
| Database | PostgreSQL | ACID transactions, rich aggregation functions, native indexing |
| Auth | bcryptjs + jsonwebtoken | Industry standard, no external service dependency |
| API client | Orval codegen from OpenAPI spec | Type-safe React Query hooks with zero hand-written fetch |
| Schema | Drizzle ORM (types) + raw `pg` (queries) | Type inference for schema; raw SQL for complex aggregations |

**Why raw SQL for analytics and not the ORM?**

Drizzle and other ORMs add abstraction layers that can generate suboptimal query plans for complex aggregations, and make it harder to reason about which indexes a query is actually using. The analytics queries are few in number, stable, and benefit from being written explicitly — the SQL is readable and the execution plan is predictable. Drizzle is still used for schema type inference and simple CRUD on content and auth routes.

---

## Trade-offs Considered

### Single server vs microservices
All API routes share one Express server and one database connection pool. This is simpler to deploy, debug, and monitor. Sharing a pool between analytics and content routes is more efficient (fewer open connections) than two services maintaining independent pools. Microservices would add network latency and operational complexity with no meaningful benefit at this scale.

### Polling vs WebSockets for the dashboard
The analytics dashboard uses standard query refresh rather than WebSockets. Analytics data doesn't need to be real-time to the millisecond — it's reviewed periodically, not watched live. WebSockets would add persistent connection overhead, reconnection logic, and server-side event broadcasting for a use case that doesn't benefit from subsecond freshness.

### What would change at production scale

1. **Async write queue (BullMQ + Redis):** Analytics writes become non-blocking; API responds with `202 Accepted` immediately.
2. **Materialized views:** Pre-compute dashboard aggregations every 60 seconds — live queries don't scan growing tables on every request.
3. **Time-series table partitioning:** Partition analytics tables by month. Old partitions can be archived or dropped without touching current data.
4. **CDN-hosted video:** Replace YouTube embeds with S3-hosted video behind signed URLs for proprietary educational content.
5. **Session IDs for unauthenticated users:** Analytics tables accept any string for `user_id`, so a UUID stored in `localStorage` would enable pre-login tracking with zero schema changes.

---

## Running Locally

**Prerequisites:** Node.js 20+, pnpm 9+, PostgreSQL

```bash
# Install dependencies
pnpm install

# Push schema to database
pnpm --filter @workspace/db run push

# Start API server (port from environment)
pnpm --filter @workspace/api-server run dev

# Start frontend (separate terminal)
pnpm --filter @workspace/content-analytics run dev
```

**Required environment variables:**
```
DATABASE_URL    # PostgreSQL connection string
SESSION_SECRET  # JWT signing secret (≥32 chars recommended for production)
```
