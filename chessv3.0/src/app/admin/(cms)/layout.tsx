import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import AdminSidebar from '../AdminSidebar';
import styles from '../admin.module.css';

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return (
    <div className={styles.adminShell}>
      <AdminSidebar />
      <div className={styles.adminContent}>
        {children}
      </div>
    </div>
  );
}
