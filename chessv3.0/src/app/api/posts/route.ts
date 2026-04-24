import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('api/posts start');
    console.log('DB_CONN exists:', Boolean(process.env.DB_CONN));
    if (process.env.DB_CONN) {
      try {
        const dbUrl = new URL(process.env.DB_CONN);
        console.log('api/posts DB target', {
          host: dbUrl.hostname,
          database: dbUrl.pathname.replace(/^\//, ''),
          user: dbUrl.username,
        });
      } catch (error) {
        console.error('api/posts could not parse DB_CONN', error);
      }
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') ?? '0', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);
    console.log('api/posts params', { limit, offset });

    const db = getDb();
    console.log('api/posts db pool ready');

    console.log('api/posts before count query');
    const [countRows] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM posts WHERE published = 1'
    );
    console.log('api/posts after count query', countRows[0]);
    const total = parseInt(String(countRows[0].count), 10);

    console.log('api/posts before posts query');
    const [rows] =
      limit > 0
        ? await db.query<RowDataPacket[]>(
            'SELECT * FROM posts WHERE published = 1 ORDER BY ISNULL(date), date DESC LIMIT ? OFFSET ?',
            [limit, offset]
          )
        : await db.query<RowDataPacket[]>(
            'SELECT * FROM posts ORDER BY ISNULL(date), date DESC'
          );
    console.log('api/posts after posts query', { rowCount: rows.length, total });

    return NextResponse.json({ posts: rows.map(rowToPost), total });
  } catch (error) {
    console.error('Failed to load posts', error);
    if (error instanceof Error) {
      console.error('Failed to load posts message:', error.message);
      console.error('Failed to load posts stack:', error.stack);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
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
