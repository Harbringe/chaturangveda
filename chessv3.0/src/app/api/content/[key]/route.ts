import { NextRequest, NextResponse } from 'next/server';
import { getContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

const PUBLIC_KEYS = new Set([
  'coaches', 'curriculum', 'hero-settings', 'stats',
  'achievements', 'testimonials', 'contact', 'courses', 'featured',
]);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!PUBLIC_KEYS.has(key)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const value = await getContent(key, null);
  return NextResponse.json({ value });
}
