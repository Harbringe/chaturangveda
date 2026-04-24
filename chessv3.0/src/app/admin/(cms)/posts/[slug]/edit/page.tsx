import { notFound } from 'next/navigation';
import { getDb, rowToPost, Post } from '@/lib/db';
import EditPostForm from './EditPostForm';
import { RowDataPacket } from 'mysql2/promise';

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<Post | null> {
  const db = getDb();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts WHERE slug = ?', [slug]);
  if (rows.length === 0) return null;
  return rowToPost(rows[0]);
}

export default async function EditPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <EditPostForm post={post} />;
}
