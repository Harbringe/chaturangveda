import Link from 'next/link';
import { getDb, rowToPost, Post } from '@/lib/db';
import styles from '../admin.module.css';
import DeleteButton from '../DeleteButton';
import { RowDataPacket } from 'mysql2/promise';

async function getPosts(): Promise<Post[]> {
  const db = getDb();
  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, slug, title, date, category, published, featured FROM posts ORDER BY ISNULL(date), date DESC'
  );
  return rows.map(rowToPost);
}

function formatDate(d?: string): string {
  if (!d) return '—';
  const [y, m, day] = d.split('-').map(Number);
  if (!y || !m || !day) return '—';
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminDashboard() {
  const posts = await getPosts();
  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Blog Posts</h1>
        <Link href="/admin/posts/new" className={`${styles.btn} ${styles.btnPrimary}`}>
          + New Post
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug}>
              <td>{post.title}</td>
              <td>{post.category || '—'}</td>
              <td>{formatDate(post.date)}</td>
              <td>
                <span className={`${styles.badge} ${post.published ? styles.badgeGreen : styles.badgeGray}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>
                <div className={styles.tableActions}>
                  <Link href={`/admin/posts/${post.slug}/edit`} className={`${styles.btn} ${styles.btnSecondary}`}>
                    Edit
                  </Link>
                  <DeleteButton slug={post.slug} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
