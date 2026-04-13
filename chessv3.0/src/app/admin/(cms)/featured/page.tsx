import { getDb, rowToPost, Post } from '@/lib/db';
import { getContent } from '@/lib/content';
import FeaturedForm from './FeaturedForm';

async function getPublishedPosts(): Promise<Post[]> {
  const db = getDb();
  const { rows } = await db.query(
    'SELECT slug, title, date FROM posts WHERE published = true ORDER BY date DESC NULLS LAST'
  );
  return rows.map(rowToPost);
}

export default async function FeaturedAdminPage() {
  const [posts, featuredData] = await Promise.all([
    getPublishedPosts(),
    getContent<{ slug: string } | null>('featured_post', null),
  ]);
  return <FeaturedForm posts={posts} currentSlug={featuredData?.slug ?? ''} />;
}
