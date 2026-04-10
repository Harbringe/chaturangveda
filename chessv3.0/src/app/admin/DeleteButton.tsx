'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setLoading(true);
    const adminPassword = prompt('Enter admin password to confirm:');
    if (!adminPassword) { setLoading(false); return; }

    await fetch(`/api/posts/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPassword },
    });

    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`${styles.btn} ${styles.btnDanger}`}
    >
      {loading ? '…' : 'Delete'}
    </button>
  );
}
