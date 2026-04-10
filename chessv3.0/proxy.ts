import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'cv-admin-session';
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'fallback-dev-secret-32-chars-min!!'
);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Login page is always accessible
  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ['HS256'] });
    if (
      typeof payload === 'object' &&
      payload !== null &&
      typeof (payload as Record<string, unknown>).isAdmin === 'boolean' &&
      typeof (payload as Record<string, unknown>).expiresAt === 'string'
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin/login', req.url));
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
