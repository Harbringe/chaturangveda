'use client';

import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>
      Log out
    </button>
  );
}
