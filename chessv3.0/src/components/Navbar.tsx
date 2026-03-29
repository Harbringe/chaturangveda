'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Services', href: '/services' },
    { label: 'Coaches', href: '/coaches' },
    { label: 'Curriculum', href: '/curriculum' },
    { label: 'Blog', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="Chaturangveda" width={45} height={45} className={styles.logoImage} />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Chaturangveda</span>
              <span className={styles.logoSubtitle}>New Era in Teaching Chess</span>
            </div>
          </Link>

          <ul className={styles.navLinks}>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/become-a-coach"
                className={`${styles.navLink} ${pathname === '/become-a-coach' ? styles.navLinkActive : ''}`}
              >
                Become a Coach
              </Link>
            </li>
            <li>
              <Link href="/book-free-trial" className={`btn-primary ${styles.navCTA}`}>
                Book Free Trial
              </Link>
            </li>
          </ul>

          <button className={styles.mobileMenuBtn} onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <button className={styles.closeBtn} onClick={() => setMobileOpen(false)}>✕</button>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/become-a-coach" className={styles.navLink} onClick={() => setMobileOpen(false)}>
          Become a Coach
        </Link>
        <Link href="/book-free-trial" className="btn-primary" onClick={() => setMobileOpen(false)}>
          Book Free Trial
        </Link>
      </div>
    </>
  );
}
