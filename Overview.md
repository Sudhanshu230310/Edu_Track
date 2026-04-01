# EduTrack

## Overview

A full-stack learning platform with built-in analytics. Users browse books, read content chapters, watch embedded YouTube videos, and analytics are tracked (button clicks, video watch time, scroll depth) and displayed on a dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite (wouter, TanStack Query, recharts, Tailwind CSS v4)
- **API framework**: Express 5
- **Database**: PostgreSQL (Replit built-in) + Drizzle ORM + raw pg for analytics queries
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API server)

## Structure

```text
/
├── artifacts/
│   ├── content-analytics/    # React + Vite frontend (served at /)
│   └── api-server/           # Express 5 API server (served at /api)
├── lib/
│   ├── api-spec/             # OpenAPI 3.1 spec + Orval codegen config
│   ├── api-client-react/     # Generated React Query hooks
│   ├── api-zod/              # Generated Zod schemas
│   └── db/                   # Drizzle schema + DB connection
└── scripts/                  # Utility scripts
```

## Database Tables

- `books` — top-level learning materials
- `chapters` — sections within books (ordered)
- `contents` — individual content pages (body text + video)
- `users` — registered students (name, email, bcrypt-hashed password)
- `user_progress` — completed lessons per user (user_id, content_id, unique constraint)
- `button_clicks` — analytics: action button click events
- `video_watch_events` — analytics: video watch session records
- `content_scroll_depth` — analytics: max scroll % per visit

## Pages

- `/login` — Login page (JWT auth)
- `/signup` — Signup page (name, email, password, confirm password)
- `/` — Library home (protected, shows real progress % per book)
- `/books/:id` — Book detail, chapters with expandable content lists
- `/content/:id` — Content viewer (text + YouTube embed + action buttons + progress tracking)
- `/analytics` — Dashboard: button clicks, video watch time, scroll depth charts

## API Routes

### Auth
- `POST /api/auth/signup` — Register user (returns JWT)
- `POST /api/auth/login` — Login user (returns JWT)
- `GET /api/auth/me` — Get current user (protected)

### Progress
- `POST /api/progress/complete` — Mark lesson complete (protected)
- `DELETE /api/progress/complete` — Unmark lesson complete (protected)
- `GET /api/progress` — Get all completed lessons for user (protected)
- `GET /api/progress/book/:bookId` — Get progress % for a book (protected)

### Content
- `GET /api/books` — All books with chapter counts
- `GET /api/books/:id` — Book with chapters and contents nested
- `GET /api/content/:id` — Content page with chapter/book context
- `POST /api/analytics/button-click` — Track button click
- `POST /api/analytics/video-watch` — Track video watch event
- `POST /api/analytics/scroll-depth` — Track scroll depth
- `GET /api/analytics/summary` — Aggregated analytics dashboard data

## Auth Architecture

- JWT tokens (30-day expiry) signed with SESSION_SECRET
- Tokens stored in localStorage
- `setAuthTokenGetter` wires token to all API client calls automatically
- Protected routes redirect to `/login` if no token present
- Passwords hashed with bcrypt (10 rounds)

## Performance Notes

- Analytics queries use PostgreSQL indexes on content_id, button_label, video_id
- Analytics summary uses SQL aggregation (SUM/AVG/COUNT), not JS iteration
- Scroll/video unload events use navigator.sendBeacon (fire-and-forget, survives page unload)
- Dashboard fetches all analytics in a single API call with Promise.all on the server

## Development Commands

```bash
pnpm --filter @workspace/api-server run dev     # Start API server
pnpm --filter @workspace/content-analytics run dev  # Start frontend
pnpm --filter @workspace/db run push            # Sync DB schema
pnpm --filter @workspace/api-spec run codegen   # Regenerate API hooks
```
