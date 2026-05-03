import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const staticRoutes = [
  { path: '/',                priority: 1.0,  changeFreq: 'weekly'  as const, lastMod: '2026-04-24' },
  { path: '/book-free-trial', priority: 0.95, changeFreq: 'monthly' as const, lastMod: '2026-04-24' },
  { path: '/services',        priority: 0.9,  changeFreq: 'monthly' as const, lastMod: '2026-04-24' },
  { path: '/curriculum',      priority: 0.9,  changeFreq: 'monthly' as const, lastMod: '2026-04-24' },
  { path: '/coaches',         priority: 0.85, changeFreq: 'monthly' as const, lastMod: '2026-04-24' },
  { path: '/blogs',           priority: 0.75, changeFreq: 'weekly'  as const, lastMod: '2026-04-24' },
  { path: '/contact',         priority: 0.65, changeFreq: 'yearly'  as const, lastMod: '2026-04-24' },
  { path: '/become-a-coach',  priority: 0.5,  changeFreq: 'yearly'  as const, lastMod: '2026-04-24' },
];

function safeDate(val: unknown): Date {
  if (!val) return new Date();
  const d = new Date(val as string | number | Date);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = staticRoutes.map(({ path, priority, changeFreq, lastMod }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: safeDate(lastMod),
    changeFrequency: changeFreq,
    priority,
  }));

  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT slug, date, created_at FROM posts WHERE published = 1 ORDER BY date DESC'
    );
    blogPosts = rows.map((row) => ({
      url: `${SITE_URL}/blogs/${row.slug}`,
      lastModified: safeDate(row.date ?? row.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }));
  } catch {
    // DB unavailable at build time — sitemap will only include static routes
  }

  return [...statics, ...blogPosts];
}
