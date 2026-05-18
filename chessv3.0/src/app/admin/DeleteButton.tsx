'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setLoading(true);
    setError('');

    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Delete failed.');
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#c53030', whiteSpace: 'nowrap' }}>Delete?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`${styles.btn} ${styles.btnDanger}`}
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          {loading ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className={`${styles.btn} ${styles.btnSecondary}`}
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          No
        </button>
        {error && <span style={{ color: '#fc8181', fontSize: '0.8rem' }}>{error}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      Delete
    </button>
  );
}
