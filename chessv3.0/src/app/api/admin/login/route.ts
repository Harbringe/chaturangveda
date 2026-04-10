import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD || 'chess2024';

  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
