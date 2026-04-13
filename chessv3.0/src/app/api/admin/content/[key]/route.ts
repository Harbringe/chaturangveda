import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import { getContent, setContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { key } = await params;
  const value = await getContent(key, null);
  return NextResponse.json({ value });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { key } = await params;
  const body = await req.json();
  await setContent(key, body.value);
  return NextResponse.json({ ok: true });
}
