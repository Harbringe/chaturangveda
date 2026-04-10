'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    const adminPassword = prompt('Enter admin password to confirm:');
    if (!adminPassword) return;

    setLoading(true);
    setError('');

    const res = await fetch(`/api/posts/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPassword },
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed. Check your password.');
    }
    setLoading(false);
  }

  return (
    <span>
      <button
        onClick={handleDelete}
        disabled={loading}
        className={`${styles.btn} ${styles.btnDanger}`}
      >
        {loading ? '…' : 'Delete'}
      </button>
      {error && <span style={{ color: '#fc8181', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error}</span>}
    </span>
  );
}
