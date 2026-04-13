import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const value = await getContent(key, null);
  return NextResponse.json({ value });
}
