'use client';

import { useState } from 'react';
import { Post } from '@/lib/db';
import styles from '../../admin.module.css';

export default function FeaturedForm({ posts, currentSlug }: { posts: Post[]; currentSlug: string }) {
  const [slug, setSlug] = useState(currentSlug);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/content/featured_post', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: { slug } }),
    });
    setSaving(false); setStatus('Saved'); setTimeout(() => setStatus(''), 2000);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Featured Post</h1>
        {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
      </div>
      <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        The featured post appears prominently at the top of the blog page.
      </p>
      <form onSubmit={save} className={styles.form} style={{ maxWidth: 500 }}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Featured Post</label>
          <select className={styles.input} value={slug} onChange={(e) => setSlug(e.target.value)}>
            <option value="">— Use most recent (default) —</option>
            {posts.map((p) => (
              <option key={p.slug} value={p.slug ?? ''}>{p.title}</option>
            ))}
          </select>
        </div>
        <div className={styles.formActions}>
          <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
