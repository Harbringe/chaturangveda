import Link from 'next/link';
import { getDb, rowToPost, Post } from '@/lib/db';
import styles from './admin.module.css';
import DeleteButton from './DeleteButton';

async function getPosts(): Promise<Post[]> {
  const db = getDb();
  const { rows } = await db.query('SELECT id, slug, title, date, category, published, featured FROM posts ORDER BY date DESC NULLS LAST');
  return rows.map(rowToPost);
}

function formatDate(d?: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default async function AdminDashboard() {
  const posts = await getPosts();

  return (
    <div className={styles.adminWrap}>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={styles.adminNavBrand}>♟ Chaturangveda Admin</Link>
        <LogoutButton />
      </nav>

      <main className={styles.adminMain}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <Link href="/admin/posts/new" className={`${styles.btn} ${styles.btnPrimary}`}>
            + New Post
          </Link>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
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
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                      Edit
                    </Link>
                    <DeleteButton slug={post.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <button type="submit" className={`${styles.btn} ${styles.btnSecondary}`}>
        Log out
      </button>
    </form>
  );
}
