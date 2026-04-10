import { NextRequest, NextResponse } from 'next/server';
import { getDb, rowToPost } from '@/lib/db';

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
