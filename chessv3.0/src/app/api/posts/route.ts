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
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }
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
