# Admin CMS Expansion — Design Spec
**Date:** 2026-04-11
**Project:** Chaturangaveda Chess Academy (chessv3.0)
**Stack:** Next.js 16.2.1, PostgreSQL (Render.com), App Router, `pg`, `jose`

---

## 1. Scope

### Group A — Quick wins
1. **Auto-timestamp** — new posts default to today's date
2. **Blog pagination** — show 6 posts, "Load more" fetches next batch (no full reload)
3. **Supabase image server** — uploads POST to Supabase Storage via `IMAGE_SERVER_URL` env var; adapter pattern so Hostinger can replace it later

### Group B — Full CMS (all 9 sections)
4. Coaches
5. Student achievements
6. Stats (tournament wins, student count, etc.)
7. Testimonials
8. Courses
9. Curriculum
10. Contact info
11. Featured blog picker
12. Become a Coach page

---

## 2. Architecture

### 2.1 Data storage

All Group B content lives in a single `site_content` PostgreSQL table:

```sql
CREATE TABLE site_content (
  key        TEXT PRIMARY KEY,         -- e.g. 'coaches', 'stats', 'contact'
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Each section is one row. JSON schema per section is defined in application code (no DB-level schema enforcement). This avoids 9 separate migration files and lets sections evolve independently.

**Why not separate tables?** Most sections are small read-rarely-write datasets (coaches, stats, testimonials). A single key/value store is simpler to migrate, back up, and query. The tradeoff is weaker DB-level constraints — acceptable here because the admin is a single trusted user.

### 2.2 Image uploads (Group A #3 + all Group B sections)

Upload flow:
1. Admin browser `POST /api/admin/upload` (multipart/form-data)
2. Route validates session, validates MIME type + size (max 5MB)
3. Route uploads to Supabase Storage via `@supabase/storage-js` (or `fetch` directly)
4. Returns `{ url: "https://..." }` — URL stored in DB JSONB

**Adapter pattern:** `src/lib/image-upload.ts` exports a single `uploadImage(file: File): Promise<string>` function. The route calls this. To swap Hostinger in later, only `image-upload.ts` changes.

Environment variables required:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET` (default: `cms-images`)

### 2.3 Admin sidebar navigation

New layout wrapping all `/admin/*` pages:

```
src/app/admin/
  layout.tsx          ← NEW: sidebar shell (replaces current per-page nav)
  AdminSidebar.tsx    ← NEW: nav component
  page.tsx            ← dashboard (stat cards)
```

Sidebar structure:
- **Content:** Blog Posts, Coaches, Achievements, Stats, Testimonials, Courses, Curriculum, Contact, Become a Coach
- **Settings:** Site Settings (future), Logout

Theme: navy `#004D99` gradient sidebar + `#F7F9FB` content area (Option C selected).

### 2.4 Shared UI components

Located at `src/app/admin/components/`:

| Component | Used by |
|---|---|
| `ImageUpload.tsx` | All sections with images (updated to use Supabase) |
| `FocusGrid.tsx` | Sections where image crop position matters (coaches, achievements) |
| `MarkdownEditor.tsx` | Coach bio, courses, curriculum, become-a-coach |
| `SortableList.tsx` | Achievements, testimonials, coaches, courses, curriculum |
| `StatEditor.tsx` | Stats section |

---

## 3. Group A — Detailed design

### 3.1 Auto-timestamp

In `src/app/admin/posts/new/page.tsx`, set the date input default:
```tsx
defaultValue={new Date().toISOString().split('T')[0]}
```
No API change needed.

### 3.2 Blog pagination — "Load more"

**API change:** `GET /api/blog/posts?limit=6&offset=0` — add `limit` and `offset` query params. Existing callers with no params get all posts (backwards compatible).

**Page change:** `src/app/blogs/page.tsx`
- Initial server render: fetch first 6 posts + total count
- "Load more" button: client-side fetch with increasing offset, append to list
- Button hidden when `posts.length >= total`

**No infinite scroll** — explicit button is better for this audience (parents, students).

### 3.3 Supabase image server

Replace the current local-disk upload in `src/app/api/admin/upload/route.ts` with a call to `src/lib/image-upload.ts`. The route interface (`POST`, returns `{ url }`) stays identical — `ImageUpload.tsx` needs no changes.

---

## 4. Group B — CMS sections

### 4.1 Admin routing

Each section gets its own admin page:

```
src/app/admin/
  coaches/page.tsx
  achievements/page.tsx
  stats/page.tsx
  testimonials/page.tsx
  courses/page.tsx
  curriculum/page.tsx
  contact/page.tsx
  featured/page.tsx
  become-coach/page.tsx
```

All pages are Server Components that read from `site_content` via a shared `getContent(key)` helper. Edit forms are Client Components rendered within them.

### 4.2 Content API routes

```
POST /api/admin/content/[key]   ← save full section (replaces entire JSONB value)
GET  /api/admin/content/[key]   ← read section (used by admin pages)
```

Public read routes (no auth):
```
GET /api/content/[key]          ← read-only, used by public pages
```

### 4.3 Section data schemas

**Coaches**
```json
[{ "id": "uuid", "name": "", "title": "", "fideRating": "", "experience": "", "specialties": [], "bio": "", "photo": "", "photoFocus": "center center", "order": 0 }]
```

**Achievements**
```json
[{ "id": "uuid", "name": "", "achievement": "", "event": "", "year": "", "photo": "", "photoFocus": "center center", "badge": "gold|silver|bronze", "order": 0 }]
```

**Stats**
```json
[{ "id": "uuid", "number": "2000+", "label": "Students Trained", "order": 0 }]
```

**Testimonials**
```json
[{ "id": "uuid", "parentName": "", "childName": "", "quote": "", "rating": 5, "photo": "", "order": 0 }]
```

**Courses**
```json
[{ "id": "uuid", "title": "", "price": "", "features": [], "cta": "", "highlighted": false, "order": 0 }]
```

**Curriculum**
```json
[{ "id": "uuid", "level": "Beginner|Intermediate|Advanced", "modules": [{ "name": "", "description": "", "duration": "" }], "order": 0 }]
```

**Contact**
```json
{ "phone": "", "whatsapp": "", "email": "", "location": "", "hours": "", "faqs": [{ "q": "", "a": "" }] }
```

**Featured post**
```json
{ "slug": "" }
```
— references existing `blog_posts.slug`.

**Become a Coach**
```json
{ "intro": "", "requirements": [], "perks": [], "formFields": [] }
```
— `intro` is markdown.

### 4.4 Public page integration

Each public page section (HeroSection, CoachesSection, etc.) currently uses hardcoded arrays. After this change:

1. Page fetches `getContent(key)` at request time (server component, no caching needed for admin-edited content)
2. Falls back to existing hardcoded data if the DB row is missing (so pages never break before content is entered)

### 4.5 Drag-to-reorder

`SortableList.tsx` uses `@hello-pangea/dnd` (a maintained React DnD fork, no native DnD API). On drop, updates `order` field in the local state; saved on "Save" button click along with all other changes.

---

## 5. UI theme

**Sidebar:** `linear-gradient(180deg, #004D99 0%, #003a75 100%)`
**Content area:** `#F7F9FB` background, white cards, `#e2e8f0` borders
**Active nav item:** white background at 18% opacity + left border `#60a5fa`
**Primary button:** `#004D99` fill
**Danger button:** `#fff5f5` bg + `#c53030` text + `#fed7d7` border
**Font:** inherits Space Grotesk / Manrope from main site

The existing `admin.module.css` is extended (not replaced) with new sidebar and content area classes.

---

## 6. Migration

One migration file: `src/lib/migrations/002_site_content.sql`

```sql
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

Run via existing `src/lib/db.ts` migration runner (or manually on Render). No seed data needed — pages fall back to hardcoded defaults until admin fills in content.

---

## 7. Implementation order

1. `site_content` DB migration
2. `image-upload.ts` Supabase adapter + update upload route
3. Auto-timestamp (trivial, do first)
4. Blog pagination
5. Admin layout + sidebar (prerequisite for all Group B pages)
6. Shared components: `ImageUpload` (update), `FocusGrid`, `MarkdownEditor`, `SortableList`, `StatEditor`
7. Content API routes (`/api/admin/content/[key]`, `/api/content/[key]`)
8. Admin pages (one per section, in order: coaches → achievements → stats → testimonials → courses → curriculum → contact → featured → become-coach)
9. Public page integration (connect each section to DB)

---

## 8. Out of scope

- Image CDN / resizing (URLs stored as-is from Supabase)
- Role-based access (single admin user)
- Draft/publish workflow for CMS sections (blog posts already have this; CMS sections are always live on save)
- Audit log
