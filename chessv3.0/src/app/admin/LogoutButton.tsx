'use client';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function LogoutButton({ variant = 'button' }: { variant?: 'button' | 'link' }) {
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }
  if (variant === 'link') {
    return (
      <button
        onClick={logout}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.83rem', padding: 0, textAlign: 'left' }}
      >
        ↩ Logout
      </button>
    );
  }
  return (
    <button onClick={logout} className={`${styles.btn} ${styles.btnDanger}`}>
      Logout
    </button>
  );
}
