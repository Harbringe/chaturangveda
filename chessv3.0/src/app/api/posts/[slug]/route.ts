import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

type Params = { params: Promise<{ slug: string }> };
const postsPath = path.join(process.cwd(), 'src', 'data', 'posts.json');

async function getPosts() {
  const raw = await readFile(postsPath, 'utf-8');
  return JSON.parse(raw);
}

function checkAuth(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';
  return password === adminPassword;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const data = await getPosts();
  const post = data.posts.find((p: { slug: string }) => p.slug === slug);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const body = await req.json();
  const data = await getPosts();
  const idx = data.posts.findIndex((p: { slug: string }) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  data.posts[idx] = { ...data.posts[idx], ...body };
  await writeFile(postsPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await params;
  const data = await getPosts();
  data.posts = data.posts.filter((p: { slug: string }) => p.slug !== slug);
  await writeFile(postsPath, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
