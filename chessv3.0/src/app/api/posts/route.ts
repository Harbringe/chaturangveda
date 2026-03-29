import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const postsPath = path.join(process.cwd(), 'src', 'data', 'posts.json');

async function getPosts() {
  const raw = await readFile(postsPath, 'utf-8');
  return JSON.parse(raw);
}

export async function GET() {
  const data = await getPosts();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';
  if (password !== adminPassword) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const data = await getPosts();

  // Generate slug from title if not provided
  if (!body.slug) {
    body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Check duplicate slug
  if (data.posts.find((p: { slug: string }) => p.slug === body.slug)) {
    body.slug = body.slug + '-' + Date.now();
  }

  body.date = body.date || new Date().toISOString().split('T')[0];
  data.posts.unshift(body);
  await writeFile(postsPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true, slug: body.slug });
}
