'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';
import LogoutButton from './LogoutButton';

const NAV = [
  { href: '/admin/hero', label: 'Hero Settings', icon: '🏠' },
  { href: '/admin', label: 'Blog Posts', icon: '📝' },
  { href: '/admin/coaches', label: 'Coaches', icon: '👤' },
  { href: '/admin/achievements', label: 'Achievements', icon: '🏆' },
  { href: '/admin/stats', label: 'Stats', icon: '📊' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { href: '/admin/courses', label: 'Courses', icon: '📚' },
  { href: '/admin/curriculum', label: 'Curriculum', icon: '🗂' },
  { href: '/admin/contact', label: 'Contact Info', icon: '📞' },
  { href: '/admin/featured', label: 'Featured Post', icon: '⭐' },
  { href: '/admin/become-coach', label: 'Become a Coach', icon: '♟' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.adminSidebar}>
      <div className={styles.sidebarBrand}>♟ Chaturangaveda</div>
      <div className={styles.sidebarSectionLabel}>Content</div>
      <nav>
        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.sidebarLink} ${pathname === href ? styles.sidebarLinkActive : ''}`}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <div className={styles.sidebarBottom}>
        <LogoutButton variant="link" />
      </div>
    </aside>
  );
}
