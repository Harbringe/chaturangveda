'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/lib/db';
import styles from '../../../admin.module.css';

const CATEGORIES = ['Student Stories', 'Education', 'Coaching', 'Tips & Tricks', 'News'];

export default function EditPostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: post.author || '',
    authorImage: post.authorImage || '',
    date: post.date || '',
    image: post.image || '',
    category: post.category || '',
    tags: (post.tags || []).join(', '),
    readTime: post.readTime || '',
    featured: post.featured || false,
    published: post.published ?? true,
    password: '',
  });

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/posts/${post.slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': form.password,
      },
      body: JSON.stringify({
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        authorImage: form.authorImage,
        date: form.date,
        image: form.image,
        category: form.category,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: form.readTime,
        featured: form.featured,
        published: form.published,
      }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to update post.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.adminWrap}>
      <nav className={styles.adminNav}>
        <Link href="/admin" className={styles.adminNavBrand}>♟ Chaturangaveda Admin</Link>
        <Link href="/admin" className={styles.adminNavLink}>← Back to posts</Link>
      </nav>

      <main className={styles.adminMain}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Edit Post</h1>
          <Link href={`/blogs/${post.slug}`} target="_blank" className={`${styles.btn} ${styles.btnSecondary}`}>
            View Live ↗
          </Link>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input className={styles.input} value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Slug (read-only)</label>
              <input className={styles.input} value={post.slug} readOnly style={{ opacity: 0.5 }} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt</label>
            <textarea className={styles.textarea} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Content (HTML)</label>
            <textarea className={styles.textarea} rows={16} value={form.content} onChange={(e) => set('content', e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author</label>
              <input className={styles.input} value={form.author} onChange={(e) => set('author', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Author Image Path</label>
              <input className={styles.input} value={form.authorImage} onChange={(e) => set('authorImage', e.target.value)} />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input type="date" className={styles.input} value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Read Time</label>
              <input className={styles.input} value={form.readTime} onChange={(e) => set('readTime', e.target.value)} placeholder="5 min" />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Image Path</label>
              <input className={styles.input} value={form.image} onChange={(e) => set('image', e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— select —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tags (comma-separated)</label>
            <input className={styles.input} value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </div>

          <div className={styles.formRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
              Featured post
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Published
            </label>
          </div>

          <div className={styles.formGroup} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #2d3748' }}>
            <label className={styles.label}>Admin Password *</label>
            <input type="password" className={styles.input} value={form.password} onChange={(e) => set('password', e.target.value)} required />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <Link href="/admin" className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
