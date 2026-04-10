import type { MetadataRoute } from 'next';
import posts from '@/data/posts.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const staticRoutes = [
  // Core pages — highest priority
  { path: '/',                priority: 1.0,  changeFreq: 'weekly'  as const, lastMod: '2025-04-01' },
  { path: '/book-free-trial', priority: 0.95, changeFreq: 'monthly' as const, lastMod: '2025-04-01' },
  { path: '/services',        priority: 0.9,  changeFreq: 'monthly' as const, lastMod: '2025-03-01' },
  { path: '/curriculum',      priority: 0.9,  changeFreq: 'monthly' as const, lastMod: '2025-04-01' },
  // Authority / trust pages
  { path: '/coaches',         priority: 0.85, changeFreq: 'monthly' as const, lastMod: '2025-03-01' },
  { path: '/blogs',           priority: 0.75, changeFreq: 'weekly'  as const, lastMod: '2025-04-01' },
  { path: '/contact',         priority: 0.65, changeFreq: 'yearly'  as const, lastMod: '2025-01-01' },
  { path: '/become-a-coach',  priority: 0.5,  changeFreq: 'yearly'  as const, lastMod: '2025-01-01' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = staticRoutes.map(({ path, priority, changeFreq, lastMod }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(lastMod),
    changeFrequency: changeFreq,
    priority,
  }));

  const blogPosts = (posts.posts as Array<{ slug: string; date?: string }>).map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'never' as const, // blog posts are evergreen, rarely change
    priority: 0.65,
  }));

  return [...statics, ...blogPosts];
}
