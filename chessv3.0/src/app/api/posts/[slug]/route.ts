import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

type Params = { params: Promise<{ slug: string }> };

function checkAuth(req: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const password = req.headers.get('x-admin-password');
  return password === adminPassword;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const db = getDb();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM posts WHERE slug = ?',
    [slug]
  );
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
  const [result] = await db.query<ResultSetHeader>(
    `UPDATE posts SET
       title        = COALESCE(?, title),
       excerpt      = COALESCE(?, excerpt),
       content      = COALESCE(?, content),
       author       = COALESCE(?, author),
       author_image = COALESCE(?, author_image),
       date         = COALESCE(?, date),
       image        = COALESCE(?, image),
       category     = COALESCE(?, category),
       tags         = COALESCE(?, tags),
       read_time    = COALESCE(?, read_time),
       featured     = COALESCE(?, featured),
       published    = COALESCE(?, published)
     WHERE slug = ?`,
    [
      body.title ?? null,
      body.excerpt ?? null,
      body.content ?? null,
      body.author ?? null,
      body.authorImage ?? null,
      body.date ?? null,
      body.image ?? null,
      body.category ?? null,
      tags !== undefined ? JSON.stringify(tags) : null,
      body.readTime ?? null,
      body.featured !== undefined ? (body.featured ? 1 : 0) : null,
      body.published !== undefined ? (body.published ? 1 : 0) : null,
      slug,
    ]
  );

  if (result.affectedRows === 0) {
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
  const [result] = await db.query<ResultSetHeader>(
    'DELETE FROM posts WHERE slug = ?',
    [slug]
  );
  if (result.affectedRows === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
