# Srinika Achievement + Blog Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the blog backend from a JSON file to PostgreSQL, add a full admin panel for managing blog posts, add Srinika's U11 National School Games silver medal achievement to the hero section, and seed her blog post into the database.

**Architecture:** PostgreSQL via `pg` Pool for data persistence; JWT cookies via `jose` (Edge-compatible) for admin authentication guarded by `proxy.ts`; Server Actions for admin CRUD operations; all existing blog API routes rewritten to query the DB while keeping identical response shapes.

**Tech Stack:** Next.js 16 (App Router), `pg`, `jose`, `tsx` (dev, for seed script), TypeScript, CSS Modules

---

## Important Next.js 16 Notes

- `middleware.ts` is **deprecated** — the file is now `proxy.ts` with a named export `proxy` (not default `middleware`)
- `cookies()` from `next/headers` is **async** — always `await cookies()`
- `proxy.ts` runs in **Edge Runtime** — no Node.js built-ins (`fs`, `pg`). Use `jose` only.
- Server Components and Route Handlers run in **Node Runtime** — `pg` is fine there.

---

## File Map

```
chessv3.0/
├── src/
│   ├── lib/
│   │   ├── db.ts                              NEW — pg Pool + query helpers + Post type
│   │   └── session.ts                         NEW — jose JWT encrypt/decrypt + cookie helpers
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts                   REWRITE — list + create via DB
│   │   │   │   └── [slug]/route.ts            REWRITE — get/update/delete via DB
│   │   │   └── admin/
│   │   │       ├── login/route.ts             NEW — validate password, set session cookie
│   │   │       └── logout/route.ts            NEW — clear session cookie
│   │   ├── admin/
│   │   │   ├── login/page.tsx                 NEW — login form (client component)
│   │   │   ├── page.tsx                       NEW — dashboard: list posts
│   │   │   ├── admin.module.css               NEW — shared admin styles
│   │   │   └── posts/
│   │   │       ├── new/page.tsx               NEW — create post form
│   │   │       └── [slug]/edit/page.tsx       NEW — edit post form
│   │   └── blogs/
│   │       └── [slug]/page.tsx                EDIT — read from DB instead of posts.json
│   └── scripts/
│       └── seed-db.ts                         NEW — one-time seed: create table + insert posts
├── proxy.ts                                   NEW — session guard for /admin/* routes
└── public/
    └── images/
        └── achievements/
            ├── national_winner.png            COPY from repo root
            └── national_winner_silver.png     COPY from repo root
```

---

## Task 1: Install dependencies

**Files:**
- Modify: `chessv3.0/package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd chessv3.0 && npm install pg jose
```

Expected: `added N packages` with no errors.

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev @types/pg tsx
```

Expected: `added N packages` with no errors.

- [ ] **Step 3: Add seed script to package.json**

Open `chessv3.0/package.json` and add `"seed"` to the `scripts` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "seed": "tsx src/scripts/seed-db.ts"
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pg, jose, tsx dependencies"
```

---

## Task 2: DB layer (`lib/db.ts`)

**Files:**
- Create: `chessv3.0/src/lib/db.ts`

- [ ] **Step 1: Create `src/lib/db.ts`**

```typescript
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DB_CONN,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export interface Post {
  id?: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  authorImage?: string;
  date?: string;
  image?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
}

/** Map a DB row (snake_case) to the Post interface (camelCase) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToPost(row: Record<string, any>): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    author: row.author ?? undefined,
    authorImage: row.author_image ?? undefined,
    date: row.date ? String(row.date).split('T')[0] : undefined,
    image: row.image ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? [],
    readTime: row.read_time ?? undefined,
    featured: row.featured ?? false,
    published: row.published ?? true,
    created_at: row.created_at ?? undefined,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add pg database layer with Post type"
```

---

## Task 3: Session library (`lib/session.ts`)

**Files:**
- Create: `chessv3.0/src/lib/session.ts`

- [ ] **Step 1: Create `src/lib/session.ts`**

This module handles JWT encryption/decryption for admin sessions using `jose`. It is server-only (never imported in client components).

```typescript
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'cv-admin-session';
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET ?? 'fallback-dev-secret-32-chars-min!!');

export interface SessionPayload {
  isAdmin: boolean;
  expiresAt: string;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ['HS256'] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession(): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ isAdmin: true, expiresAt: expiresAt.toISOString() });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decrypt(token);
}

export { COOKIE_NAME };
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/session.ts
git commit -m "feat: add jose-based session management for admin auth"
```

---

## Task 4: Copy achievement images

**Files:**
- Create: `chessv3.0/public/images/achievements/` (directory)

- [ ] **Step 1: Copy images**

```bash
mkdir -p chessv3.0/public/images/achievements
cp national_winner.png chessv3.0/public/images/achievements/national_winner.png
cp national_winner_silver.png chessv3.0/public/images/achievements/national_winner_silver.png
```

Run from the repo root (`E:/chaturangaveda`).

- [ ] **Step 2: Verify**

```bash
ls chessv3.0/public/images/achievements/
```

Expected output:
```
national_winner.png
national_winner_silver.png
```

- [ ] **Step 3: Commit**

```bash
git add chessv3.0/public/images/achievements/
git commit -m "feat: add Srinika achievement images to public assets"
```

---

## Task 5: DB seed script

**Files:**
- Create: `chessv3.0/src/scripts/seed-db.ts`

This script is run **once** manually (`npm run seed` from `chessv3.0/`). It creates the `posts` table and inserts all existing posts from `posts.json` plus Srinika's new post. Subsequent runs are safe — uses `ON CONFLICT DO NOTHING`.

- [ ] **Step 1: Create `src/scripts/seed-db.ts`**

```typescript
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({
  connectionString: process.env.DB_CONN,
  ssl: { rejectUnauthorized: false },
});

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  author       TEXT,
  author_image TEXT,
  date         DATE,
  image        TEXT,
  category     TEXT,
  tags         TEXT[],
  read_time    TEXT,
  featured     BOOLEAN DEFAULT FALSE,
  published    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
`;

const SRINIKA_POST = {
  slug: 'srinika-national-school-games-silver',
  title: 'Srinika Wins Silver at National School Games — U11 Chess Champion',
  excerpt:
    'Srinika, a proud Chaturangveda student, has won the Silver Medal at the 69th National School Games 2025-26 in the Under-11 Chess category, representing Karnataka on the national stage.',
  content: `<p>We are incredibly proud to share that Srinika, one of Chaturangveda's own, has won a <strong>Silver Medal</strong> at the <strong>69th National School Games 2025-26</strong> in the Under-11 Chess category. Competing as part of the Karnataka state team, Srinika delivered a remarkable performance against players from across the country to claim this prestigious honour.</p>

<p>The National School Games, organised under the aegis of the School Games Federation of India (SGFI), is one of India's most competitive scholastic sports platforms. Chess at the National School Games draws top young talents from every state — making a silver medal at the Under-11 level a truly exceptional achievement.</p>

<h2>Representing Karnataka</h2>
<p>Srinika earned her place on the Karnataka state team through consistent performances at the district and state selection rounds. The Karnataka contingent had strong representation across multiple chess categories — and Srinika's silver was a highlight of their campaign.</p>

<figure>
  <img src="/images/achievements/national_winner.png" alt="Srinika and the Karnataka chess team at the 69th National School Games" style="max-width:100%;border-radius:8px;margin:1.5rem 0" />
  <figcaption style="text-align:center;font-size:0.9rem;color:#666">The Karnataka team at the 69th National School Games 2025-26</figcaption>
</figure>

<h2>The Journey at Chaturangveda</h2>
<p>Srinika has been training at Chaturangveda under the guidance of our FIDE-rated coaches. Her progression through our curriculum — from mastering core tactical patterns to developing a solid tournament repertoire — laid the foundation for this achievement. The discipline, focus, and love for the game that she has shown in every session is what makes results like this possible.</p>

<blockquote>
  <p>"This is what we work towards with every student. Srinika's dedication in training sessions has always been exceptional. She brought that same focus to the national stage, and it showed."</p>
  <cite>— Manoj Reddy Maram, Head Coach, Chaturangveda</cite>
</blockquote>

<h2>What This Means</h2>
<p>A silver medal at the National School Games is not just a personal achievement — it is a milestone that opens doors. It places Srinika among the top Under-11 chess players in the country and marks her as a serious contender for even higher honours in the years ahead.</p>

<p>More than that, it sends a message to every student at Chaturangveda: with the right coaching, consistent training, and genuine love for the game, the national stage is within reach.</p>

<p>We cannot wait to see what Srinika achieves next. This is only the beginning.</p>

<p><em>Is your child ready to start their chess journey? <a href="/book-free-trial">Book a free trial class</a> with Chaturangveda today.</em></p>`,
  author: 'Manoj Reddy Maram',
  author_image: '/images/2025/02/ManojReddyMaram.jpg',
  date: '2026-04-10',
  image: '/images/achievements/national_winner_silver.png',
  category: 'Student Stories',
  tags: ['student achievement', 'national championship', 'u11', 'silver medal'],
  read_time: '4 min',
  featured: true,
  published: true,
};

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Creating posts table...');
    await client.query(CREATE_TABLE);
    console.log('Table ready.');

    // Load existing posts from JSON
    const postsPath = join(process.cwd(), 'src', 'data', 'posts.json');
    const raw = readFileSync(postsPath, 'utf-8');
    const { posts } = JSON.parse(raw) as {
      posts: Array<{
        slug: string;
        title: string;
        excerpt?: string;
        content?: string;
        author?: string;
        authorImage?: string;
        date?: string;
        image?: string;
        category?: string;
        readTime?: string;
        featured?: boolean;
        published?: boolean;
      }>;
    };

    const allPosts = [SRINIKA_POST, ...posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? null,
      content: p.content ?? null,
      author: p.author ?? null,
      author_image: p.authorImage ?? null,
      date: p.date ?? null,
      image: p.image ?? null,
      category: p.category ?? null,
      tags: null,
      read_time: p.readTime ?? null,
      featured: p.featured ?? false,
      published: p.published ?? true,
    }))];

    let inserted = 0;
    for (const post of allPosts) {
      const result = await client.query(
        `INSERT INTO posts
           (slug, title, excerpt, content, author, author_image, date, image,
            category, tags, read_time, featured, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          post.slug, post.title, post.excerpt, post.content, post.author,
          post.author_image, post.date, post.image, post.category,
          post.tags, post.read_time, post.featured, post.published,
        ]
      );
      if (result.rowCount && result.rowCount > 0) inserted++;
    }

    console.log(`Seeded ${inserted}/${allPosts.length} posts (skipped existing).`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Run the seed (from `chessv3.0/` directory)**

```bash
cd chessv3.0 && npm run seed
```

Expected output:
```
Creating posts table...
Table ready.
Seeded 7/7 posts (skipped existing).
```

- [ ] **Step 3: Commit**

```bash
git add src/scripts/seed-db.ts package.json
git commit -m "feat: add DB seed script with all posts + Srinika achievement"
```

---

## Task 6: `proxy.ts` — admin route guard

**Files:**
- Create: `chessv3.0/proxy.ts`

`proxy.ts` runs in Edge Runtime. It verifies the session JWT from the cookie without importing `pg` or Node-only modules.

- [ ] **Step 1: Create `proxy.ts` in the `chessv3.0/` root**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'cv-admin-session';
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'fallback-dev-secret-32-chars-min!!'
);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Login page is always accessible
  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    await jwtVerify(token, SECRET, { algorithms: ['HS256'] });
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Commit**

```bash
git add proxy.ts
git commit -m "feat: add proxy.ts session guard for /admin routes"
```

---

## Task 7: Admin auth API routes

**Files:**
- Create: `chessv3.0/src/app/api/admin/login/route.ts`
- Create: `chessv3.0/src/app/api/admin/logout/route.ts`

- [ ] **Step 1: Create `src/app/api/admin/login/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create `src/app/api/admin/logout/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/session';

export async function POST() {
  await deleteAdminSession();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/
git commit -m "feat: add admin login/logout API routes"
```

---

## Task 8: Rewrite blog API routes to use PostgreSQL

**Files:**
- Modify: `chessv3.0/src/app/api/posts/route.ts`
- Modify: `chessv3.0/src/app/api/posts/[slug]/route.ts`

Response shapes stay **identical** to the current JSON-file version.

- [ ] **Step 1: Rewrite `src/app/api/posts/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const { rows } = await db.query(
    'SELECT * FROM posts ORDER BY date DESC NULLS LAST'
  );
  return NextResponse.json({ posts: rows.map(rowToPost) });
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Generate slug from title if not provided
  let slug: string = body.slug ||
    body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const db = getDb();

  // Check slug uniqueness
  const existing = await db.query('SELECT id FROM posts WHERE slug = $1', [slug]);
  if (existing.rows.length > 0) slug = `${slug}-${Date.now()}`;

  const date = body.date || new Date().toISOString().split('T')[0];
  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === 'string'
    ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : null;

  const { rows } = await db.query(
    `INSERT INTO posts
       (slug, title, excerpt, content, author, author_image, date, image,
        category, tags, read_time, featured, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [
      slug,
      body.title,
      body.excerpt ?? null,
      body.content ?? null,
      body.author ?? null,
      body.authorImage ?? null,
      date,
      body.image ?? null,
      body.category ?? null,
      tags,
      body.readTime ?? null,
      body.featured ?? false,
      body.published ?? true,
    ]
  );

  return NextResponse.json({ ok: true, slug: rows[0].slug });
}
```

- [ ] **Step 2: Rewrite `src/app/api/posts/[slug]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';

type Params = { params: Promise<{ slug: string }> };

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';
  return password === adminPassword;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const db = getDb();
  const { rows } = await db.query('SELECT * FROM posts WHERE slug = $1', [slug]);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(rowToPost(rows[0]));
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { slug } = await params;
  const body = await req.json();

  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === 'string'
    ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : undefined;

  const db = getDb();
  const { rowCount } = await db.query(
    `UPDATE posts SET
       title        = COALESCE($1, title),
       excerpt      = COALESCE($2, excerpt),
       content      = COALESCE($3, content),
       author       = COALESCE($4, author),
       author_image = COALESCE($5, author_image),
       date         = COALESCE($6, date),
       image        = COALESCE($7, image),
       category     = COALESCE($8, category),
       tags         = COALESCE($9, tags),
       read_time    = COALESCE($10, read_time),
       featured     = COALESCE($11, featured),
       published    = COALESCE($12, published)
     WHERE slug = $13`,
    [
      body.title ?? null,
      body.excerpt ?? null,
      body.content ?? null,
      body.author ?? null,
      body.authorImage ?? null,
      body.date ?? null,
      body.image ?? null,
      body.category ?? null,
      tags ?? null,
      body.readTime ?? null,
      body.featured ?? null,
      body.published ?? null,
      slug,
    ]
  );

  if (rowCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { slug } = await params;
  const db = getDb();
  const { rowCount } = await db.query('DELETE FROM posts WHERE slug = $1', [slug]);
  if (rowCount === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/posts/
git commit -m "feat: rewrite blog API routes to use PostgreSQL"
```

---

## Task 9: Update blog detail page to read from DB

**Files:**
- Modify: `chessv3.0/src/app/blogs/[slug]/page.tsx`

The blog detail page currently reads directly from `posts.json`. Update it to use the DB via `lib/db.ts`.

- [ ] **Step 1: Replace the `getAllPosts` and file-read logic**

At the top of `src/app/blogs/[slug]/page.tsx`, replace:

```typescript
import { readFile } from 'fs/promises';
import path from 'path';
// ...
const postsPath = path.join(process.cwd(), 'src', 'data', 'posts.json');

async function getAllPosts(): Promise<Post[]> {
  const raw = await readFile(postsPath, 'utf-8');
  const data = JSON.parse(raw);
  return data.posts as Post[];
}
```

With:

```typescript
import { getDb, rowToPost } from '@/lib/db';
// ...
async function getAllPosts(): Promise<Post[]> {
  const db = getDb();
  const { rows } = await db.query('SELECT * FROM posts ORDER BY date DESC NULLS LAST');
  return rows.map(rowToPost) as Post[];
}
```

Also remove the now-unused `import path from 'path'` and `import { readFile } from 'fs/promises'` lines.

- [ ] **Step 2: Verify the `Post` type in the file still has all needed fields**

The `Post` type in `page.tsx` should match the `Post` interface from `lib/db.ts`. The fields `readTime` and `authorImage` come from `rowToPost()` mapping — no changes needed to the JSX.

- [ ] **Step 3: Commit**

```bash
git add src/app/blogs/[slug]/page.tsx
git commit -m "feat: blog detail page reads from PostgreSQL"
```

---

## Task 10: Admin login page

**Files:**
- Create: `chessv3.0/src/app/admin/login/page.tsx`
- Create: `chessv3.0/src/app/admin/admin.module.css`

- [ ] **Step 1: Create `src/app/admin/admin.module.css`**

```css
/* Shared admin panel styles */
.adminWrap {
  min-height: 100vh;
  background: #0f1117;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.adminNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1f2e;
  border-bottom: 1px solid #2d3748;
}

.adminNavBrand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #63b3ed;
  text-decoration: none;
}

.adminNavLink {
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.9rem;
}

.adminNavLink:hover {
  color: #e2e8f0;
}

.adminMain {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.loginCard {
  max-width: 400px;
  margin: 8rem auto 0;
  background: #1a1f2e;
  border: 1px solid #2d3748;
  border-radius: 12px;
  padding: 2.5rem;
}

.loginTitle {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #e2e8f0;
}

.loginSubtitle {
  color: #718096;
  font-size: 0.9rem;
  margin: 0 0 2rem;
}

.formGroup {
  margin-bottom: 1.25rem;
}

.label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #a0aec0;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: #0f1117;
  border: 1px solid #2d3748;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #63b3ed;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.2s, opacity 0.2s;
  text-decoration: none;
}

.btnPrimary {
  background: #3182ce;
  color: #fff;
  width: 100%;
  justify-content: center;
}

.btnPrimary:hover {
  background: #2b6cb0;
}

.btnPrimary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btnDanger {
  background: #c53030;
  color: #fff;
}

.btnDanger:hover {
  background: #9b2c2c;
}

.btnSecondary {
  background: #2d3748;
  color: #e2e8f0;
}

.btnSecondary:hover {
  background: #4a5568;
}

.error {
  color: #fc8181;
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.pageHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.pageTitle {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: #1a1f2e;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #2d3748;
}

.table th,
.table td {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.9rem;
}

.table th {
  background: #252c3d;
  color: #a0aec0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.table tr:not(:last-child) td {
  border-bottom: 1px solid #2d3748;
}

.table td {
  color: #e2e8f0;
}

.tableActions {
  display: flex;
  gap: 0.5rem;
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badgeGreen {
  background: #1a4731;
  color: #68d391;
}

.badgeGray {
  background: #2d3748;
  color: #a0aec0;
}

.form {
  background: #1a1f2e;
  border: 1px solid #2d3748;
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
}

.formRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.formActions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.textarea {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: #0f1117;
  border: 1px solid #2d3748;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.9rem;
  box-sizing: border-box;
  resize: vertical;
  font-family: 'Courier New', monospace;
  transition: border-color 0.2s;
}

.textarea:focus {
  outline: none;
  border-color: #63b3ed;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #a0aec0;
  cursor: pointer;
}
```

- [ ] **Step 2: Create `src/app/admin/login/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.adminWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Admin Login</h1>
        <p className={styles.loginSubtitle}>Chaturangveda blog management</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/admin.module.css src/app/admin/login/
git commit -m "feat: add admin login page"
```

---

## Task 11: Admin dashboard (post list)

**Files:**
- Create: `chessv3.0/src/app/admin/page.tsx`

This is a Server Component — it queries the DB directly and renders the post list.

- [ ] **Step 1: Create `src/app/admin/page.tsx`**

```typescript
import Link from 'next/link';
import { getDb, rowToPost, Post } from '@/lib/db';
import styles from './admin.module.css';
import DeleteButton from './DeleteButton';

async function getPosts(): Promise<Post[]> {
  const db = getDb();
  const { rows } = await db.query('SELECT id, slug, title, date, category, published, featured FROM posts ORDER BY date DESC NULLS LAST');
  return rows.map(rowToPost);
}

function formatDate(d?: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminDashboard() {
  const posts = await getPosts();

  return (
    <div className={styles.adminWrap}>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={styles.adminNavBrand}>♟ Chaturangveda Admin</Link>
        <LogoutButton />
      </nav>

      <main className={styles.adminMain}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <Link href="/admin/posts/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + New Post
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug}>
                <td>{post.title}</td>
                <td>{post.category || '—'}</td>
                <td>{formatDate(post.date)}</td>
                <td>
                  <span className={`${styles.badge} ${post.published ? styles.badgeGreen : styles.badgeGray}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className={styles.tableActions}>
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Edit
                    </Link>
                    <DeleteButton slug={post.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button type="submit" className={`${styles.btn} ${styles.btnSecondary}`}>
        Log out
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create `src/app/admin/DeleteButton.tsx`** (client component for delete action)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setLoading(true);
    const adminPassword = prompt('Enter admin password to confirm:');
    if (!adminPassword) { setLoading(false); return; }

    await fetch(`/api/posts/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPassword },
    });

    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/page.tsx src/app/admin/DeleteButton.tsx
git commit -m "feat: add admin dashboard with post list"
```

---

## Task 12: New post form

**Files:**
- Create: `chessv3.0/src/app/admin/posts/new/page.tsx`

- [ ] **Step 1: Create `src/app/admin/posts/new/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';

const CATEGORIES = ['Student Stories', 'Education', 'Coaching', 'Tips & Tricks', 'News'];

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    authorImage: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    category: '',
    tags: '',
    readTime: '',
    featured: false,
    published: true,
    password: '',
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title
      if (field === 'title' && !prev.slug) {
        updated.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': form.password,
      },
      body: JSON.stringify({
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        authorImage: form.authorImage,
        date: form.date,
        image: form.image,
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: form.readTime,
        featured: form.featured,
        published: form.published,
      }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create post.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.adminWrap}>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={styles.adminNavBrand}>♟ Chaturangveda Admin</Link>
        <Link href="/admin" className={styles.adminNavLink}>← Back to posts</Link>
      </nav>

      <main className={styles.adminMain}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input className={styles.input} value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Slug</label>
              <input className={styles.input} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea className={styles.textarea} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (HTML)</label>
            <textarea className={styles.textarea} rows={16} value={form.content} onChange={(e) => set('content', e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author</label>
              <input className={styles.input} value={form.author} onChange={(e) => set('author', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author Image Path</label>
              <input className={styles.input} value={form.authorImage} onChange={(e) => set('authorImage', e.target.value)} placeholder="/images/..." />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input type="date" className={styles.input} value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Read Time</label>
              <input className={styles.input} value={form.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="5 min" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Image Path</label>
              <input className={styles.input} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="/images/..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— select —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (comma-separated)</label>
            <input className={styles.input} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="student achievement, u11" />
          </div>

          <div className={styles.formRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured post
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Published
            </label>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2d3748' }}>
            <label className={styles.label}>Admin Password *</label>
            <input type="password" className={styles.input} value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Create Post'}
            </button>
            <Link href="/admin" className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/posts/new/
git commit -m "feat: add new post creation form in admin panel"
```

---

## Task 13: Edit post form

**Files:**
- Create: `chessv3.0/src/app/admin/posts/[slug]/edit/page.tsx`

- [ ] **Step 1: Create `src/app/admin/posts/[slug]/edit/page.tsx`**

```typescript
import { notFound } from 'next/navigation';
import { getDb, rowToPost, Post } from '@/lib/db';
import EditPostForm from './EditPostForm';

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const db = getDb();
  const { rows } = await db.query('SELECT * FROM posts WHERE slug = $1', [slug]);
  if (rows.length === 0) return null;
  return rowToPost(rows[0]);
}

export default async function EditPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <EditPostForm post={post} />;
}
```

- [ ] **Step 2: Create `src/app/admin/posts/[slug]/edit/EditPostForm.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/lib/db';
import styles from '../../../admin.module.css';

const CATEGORIES = ['Student Stories', 'Education', 'Coaching', 'Tips & Tricks', 'News'];

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: post.author || '',
    authorImage: post.authorImage || '',
    date: post.date || '',
    image: post.image || '',
    category: post.category || '',
    tags: (post.tags || []).join(', '),
    readTime: post.readTime || '',
    featured: post.featured || false,
    published: post.published ?? true,
    password: '',
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': form.password,
      },
      body: JSON.stringify({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        authorImage: form.authorImage,
        date: form.date,
        image: form.image,
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: form.readTime,
        featured: form.featured,
        published: form.published,
      }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update post.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.adminWrap}>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={styles.adminNavBrand}>♟ Chaturangveda Admin</Link>
        <Link href="/admin" className={styles.adminNavLink}>← Back to posts</Link>
      </nav>

      <main className={styles.adminMain}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Post</h1>
          <Link href={`/blogs/${post.slug}`} target="_blank" className={`${styles.btn} ${styles.btnSecondary}`}>
            View Live ↗
          </Link>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input className={styles.input} value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Slug (read-only)</label>
              <input className={styles.input} value={post.slug} readOnly style={{ opacity: 0.5 }} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea className={styles.textarea} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (HTML)</label>
            <textarea className={styles.textarea} rows={16} value={form.content} onChange={(e) => set('content', e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author</label>
              <input className={styles.input} value={form.author} onChange={(e) => set('author', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author Image Path</label>
              <input className={styles.input} value={form.authorImage} onChange={(e) => set('authorImage', e.target.value)} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input type="date" className={styles.input} value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Read Time</label>
              <input className={styles.input} value={form.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="5 min" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Image Path</label>
              <input className={styles.input} value={form.image} onChange={(e) => set('image', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— select —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (comma-separated)</label>
            <input className={styles.input} value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured post
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Published
            </label>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2d3748' }}>
            <label className={styles.label}>Admin Password *</label>
            <input type="password" className={styles.input} value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/admin" className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/posts/
git commit -m "feat: add edit post form in admin panel"
```

---

## Task 14: Update hero section — add Srinika

**Files:**
- Modify: `chessv3.0/src/components/HeroSection.tsx`

- [ ] **Step 1: Add Srinika to `studentAchievements` array**

In `src/components/HeroSection.tsx`, find:

```typescript
const studentAchievements = [
  {
    name: "Samanvith",
    achievement: "State Championship Winner",
    detail: "Youngest champion · Age 9",
    image: "/images/2025/01/Samanvith-e1738320920340.png",
    badge: "🏆 State",
  },
  {
    name: "Ekaansh Sharma",
    achievement: "Telangana State Under-9",
    detail: "Top 3 finish · 8 months training",
    image: "/images/2025/01/Ekaansh-Sharma-e1738320995620.png",
    badge: "🥇 Top 3",
  },
  {
    name: "Anish",
    achievement: "District Level Gold",
    detail: "Rapid improvement · 6 months",
    image: "/images/2025/01/ANISH-e1738320951137.png",
    badge: "🥇 District",
  },
];
```

Replace with:

```typescript
const studentAchievements = [
  {
    name: "Srinika",
    achievement: "National School Games Silver",
    detail: "U11 National Silver · Karnataka",
    image: "/images/achievements/national_winner_silver.png",
    badge: "🥈 National",
  },
  {
    name: "Samanvith",
    achievement: "State Championship Winner",
    detail: "Youngest champion · Age 9",
    image: "/images/2025/01/Samanvith-e1738320920340.png",
    badge: "🏆 State",
  },
  {
    name: "Ekaansh Sharma",
    achievement: "Telangana State Under-9",
    detail: "Top 3 finish · 8 months training",
    image: "/images/2025/01/Ekaansh-Sharma-e1738320995620.png",
    badge: "🥇 Top 3",
  },
  {
    name: "Anish",
    achievement: "District Level Gold",
    detail: "Rapid improvement · 6 months",
    image: "/images/2025/01/ANISH-e1738320951137.png",
    badge: "🥇 District",
  },
];
```

Also update the toast card below to reference Srinika's achievement. Find:

```typescript
<div className={styles.toastTitle}>Tournament Win!</div>
<div className={styles.toastSub}>
  Samanvith · State Level Championship
</div>
```

Replace with:

```typescript
<div className={styles.toastTitle}>National Achievement!</div>
<div className={styles.toastSub}>
  Srinika · U11 National School Games Silver
</div>
```

- [ ] **Step 2: Verify the image renders correctly**

Run `npm run dev` and navigate to `http://localhost:3000`. The hero panel should now show Srinika as the first achievement card with her solo tournament photo.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add Srinika national silver medal achievement to hero section"
```

---

## Task 15: Environment setup + final verification

**Files:**
- Modify: `chessv3.0/.env.local` (user action — not committed)

- [ ] **Step 1: Add `SESSION_SECRET` to `.env.local`**

Generate a secure random secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add the output to `chessv3.0/.env.local`:

```bash
SESSION_SECRET=<paste generated value here>
```

- [ ] **Step 2: Verify `.env.local` has all required variables**

```bash
grep -E "DB_CONN|ADMIN_PASSWORD|SESSION_SECRET" chessv3.0/.env.local
```

Expected: all three variables are present and non-empty.

- [ ] **Step 3: Run the seed script**

```bash
cd chessv3.0 && npm run seed
```

Expected:
```
Creating posts table...
Table ready.
Seeded 7/7 posts (skipped existing).
```

- [ ] **Step 4: Start dev server and smoke-test**

```bash
npm run dev
```

Test checklist:
- `http://localhost:3000` — Hero section shows Srinika as first achievement card
- `http://localhost:3000/blogs` — All 7 posts load (including Srinika's)
- `http://localhost:3000/blogs/srinika-national-school-games-silver` — Blog post renders correctly
- `http://localhost:3000/admin` — Redirects to `/admin/login`
- `http://localhost:3000/admin/login` — Login form loads; correct password → redirects to `/admin`
- `http://localhost:3000/admin` — Post list shows all 7 posts
- `http://localhost:3000/admin/posts/new` — New post form loads and submits
- `http://localhost:3000/admin/posts/srinika-national-school-games-silver/edit` — Edit form pre-populated

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete blog admin panel, PostgreSQL migration, Srinika achievement"
```
