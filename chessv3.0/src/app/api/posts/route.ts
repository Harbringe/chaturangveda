import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') ?? '0', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  const db = getDb();
  const [countRows] = await db.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM posts WHERE published = 1'
  );
  const total = parseInt(String(countRows[0].count), 10);

  const [rows] =
    limit > 0
      ? await db.query<RowDataPacket[]>(
          'SELECT * FROM posts WHERE published = 1 ORDER BY ISNULL(date), date DESC LIMIT ? OFFSET ?',
          [limit, offset]
        )
      : await db.query<RowDataPacket[]>(
          'SELECT * FROM posts ORDER BY ISNULL(date), date DESC'
        );

  return NextResponse.json({ posts: rows.map(rowToPost), total });
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

  let slug: string = body.slug ||
    body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const db = getDb();

  const [existing] = await db.query<RowDataPacket[]>(
    'SELECT id FROM posts WHERE slug = ?',
    [slug]
  );
  if (existing.length > 0) slug = `${slug}-${Date.now()}`;

  const date = body.date || new Date().toISOString().split('T')[0];
  const tags = Array.isArray(body.tags)
    ? body.tags
    : typeof body.tags === 'string'
    ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : null;

  await db.query<ResultSetHeader>(
    `INSERT INTO posts
       (slug, title, excerpt, content, author, author_image, date, image,
        category, tags, read_time, featured, published)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
      tags ? JSON.stringify(tags) : null,
      body.readTime ?? null,
      body.featured ? 1 : 0,
      body.published !== false ? 1 : 0,
    ]
  );

  return NextResponse.json({ ok: true, slug });
}
