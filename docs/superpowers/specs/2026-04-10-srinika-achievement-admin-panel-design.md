# Design: Srinika Achievement Highlight + Blog Admin Panel

**Date:** 2026-04-10
**Status:** Approved

---

## Overview

Three things ship together:

1. Add Srinika (U11 National School Games silver medalist) to the hero section
2. Add a blog post about her achievement, seeded into PostgreSQL
3. Migrate the blog backend from `posts.json` to PostgreSQL and build a full admin panel to manage posts

---

## Section 1: Database

**Connection:** `process.env.DB_CONN` (Render PostgreSQL, already set in `.env.local`)

**Library:** `pg` package (raw SQL, no ORM)

**Wrapper:** `chessv3.0/src/lib/db.ts` — exports a single `pg.Pool` instance, reused across all API routes.

**Schema:**

```sql
CREATE TABLE IF NOT EXISTS posts (
  id        SERIAL PRIMARY KEY,
  slug      TEXT UNIQUE NOT NULL,
  title     TEXT NOT NULL,
  excerpt   TEXT,
  content   TEXT,
  author    TEXT,
  date      DATE,
  image     TEXT,
  tags      TEXT[],
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Migration strategy:** On app start (or a one-time seed script), `CREATE TABLE IF NOT EXISTS` runs, then all existing posts from `posts.json` are inserted (skipping on slug conflict). Srinika's post is included in the seed data.

**API routes rewritten** (same URLs, same response shape, new DB backend):
- `GET /api/posts` — `SELECT * FROM posts ORDER BY date DESC`
- `POST /api/posts` — `INSERT INTO posts ...`
- `GET /api/posts/[slug]` — `SELECT * FROM posts WHERE slug = $1`
- `PUT /api/posts/[slug]` — `UPDATE posts SET ... WHERE slug = $1`
- `DELETE /api/posts/[slug]` — `DELETE FROM posts WHERE slug = $1`

Auth on write routes stays the same: `x-admin-password` header checked against `process.env.ADMIN_PASSWORD`.

---

## Section 2: Admin Panel + Auth

### Authentication

**Library:** `iron-session` — signed, encrypted httponly cookie, no JWT complexity.

**Session data:** `{ isAdmin: boolean }`

**Secret:** `process.env.SESSION_SECRET` (new env var, min 32 chars)

**Flow:**
1. User visits any `/admin/*` route
2. `middleware.ts` checks for valid `iron-session` cookie
3. If missing/invalid → redirect to `/admin/login`
4. Login page at `/admin/login` — password form
5. POST to `/api/admin/login` — validates against `process.env.ADMIN_PASSWORD`, sets session cookie on success, redirects to `/admin`
6. POST to `/api/admin/logout` — clears cookie, redirects to `/admin/login`

### Pages

| Route | Purpose |
|---|---|
| `/admin/login` | Password login form |
| `/admin` | Dashboard — list all posts with Edit/Delete |
| `/admin/posts/new` | Create new post |
| `/admin/posts/[slug]/edit` | Edit existing post |

### Form Fields

- **Title** (text) — required
- **Slug** (text) — auto-generated from title, editable
- **Excerpt** (textarea)
- **Content** (textarea, markdown)
- **Author** (text)
- **Date** (date picker)
- **Image** (text — URL or path)
- **Tags** (text — comma-separated, stored as `TEXT[]`)
- **Read time** (text, e.g. "5 min read")

No rich text editor — plain markdown textarea keeps it simple and consistent with existing post format.

---

## Section 3: Hero Card + Blog Post

### Hero Card

**File:** `chessv3.0/src/components/HeroSection.tsx`

Add Srinika as the 4th entry in the `studentAchievements` array:

```ts
{
  name: "Srinika",
  achievement: "National School Games Silver",
  detail: "U11 National Silver · School Games",
  image: "/images/achievements/national_winner_silver.png",
  badge: "🥈 National",
}
```

**Images copied to:** `chessv3.0/public/images/achievements/`
- `national_winner_silver.png` → hero card profile image
- `national_winner.png` → embedded in blog article body (Karnataka team photo)

### Blog Post

**Slug:** `srinika-national-school-games-silver`

**Title:** Srinika Wins Silver at National School Games — U11 Chess Champion

**Cover image:** `/images/achievements/national_winner_silver.png`

**Tags:** `["student achievement", "national championship", "u11", "silver medal"]`

**Content outline:**
- Opening: the achievement — silver medal at the 69th National School Games 2025-26, U11 chess
- Who is Srinika — young Chaturangveda student, trained under our coaches
- The tournament — 69th National School Games 2025-26, competed representing Karnataka state
- The journey — preparation, discipline, tournament mindset coaching
- Karnataka team photo (`national_winner.png`) embedded mid-article
- Closing: reflection from the Chaturangveda team + call to action for aspiring players

**Note:** Blog content will be drafted based on the images provided and tournament context visible in them (Karnataka team, National School Games 2025-26 banner). User should review the draft and fill in any personal details about Srinika before publishing.

Post is seeded into PostgreSQL alongside the 6 existing posts migrated from `posts.json`.

---

## Files Changed / Created

```
chessv3.0/src/lib/db.ts                          NEW — pg Pool wrapper
chessv3.0/src/lib/session.ts                     NEW — iron-session config
chessv3.0/src/app/api/posts/route.ts             REWRITE — DB queries
chessv3.0/src/app/api/posts/[slug]/route.ts      REWRITE — DB queries
chessv3.0/src/app/api/admin/login/route.ts       NEW — login handler
chessv3.0/src/app/api/admin/logout/route.ts      NEW — logout handler
chessv3.0/src/app/admin/login/page.tsx           NEW — login UI
chessv3.0/src/app/admin/page.tsx                 NEW — post list dashboard
chessv3.0/src/app/admin/posts/new/page.tsx       NEW — create post form
chessv3.0/src/app/admin/posts/[slug]/edit/page.tsx  NEW — edit post form
chessv3.0/middleware.ts                          NEW — session guard
chessv3.0/src/components/HeroSection.tsx         EDIT — add Srinika card
chessv3.0/public/images/achievements/            NEW — hero/blog images
chessv3.0/src/scripts/seed.ts                    NEW — one-time DB seed
```

---

## Environment Variables Required

```
DB_CONN=<postgresql connection string>   # already set
ADMIN_PASSWORD=<password>                # already set
SESSION_SECRET=<32+ char random string>  # NEW — add to .env.local
```
