'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBullseye, FaUsers, FaBolt } from 'react-icons/fa';
import styles from './Navbar.module.css';

const serviceDropdownItems = [
  { icon: <FaBullseye />, label: 'Free Trial Class', desc: 'Full 45-min session, zero cost', href: '/services#free-trial' },
  { icon: <FaUsers />, label: 'Group Classes', desc: 'Max 5 students per batch', href: '/services#group' },
  { icon: <FaBolt />, label: 'Private 1-on-1', desc: 'Fully personalised coaching', href: '/services#private' },
];

const LMS_URL = 'https://chaturangveda.wise.live';
const BOOK_URL = 'https://chaturangveda.wise.live/book/consultation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
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
            <div style={{
              width: 45, height: 45, borderRadius: 10,
              background: 'var(--primary-fixed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                width: 33, height: 33, borderRadius: 6,
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <Image src="/chaturangveda_logo.png" alt="Chaturangveda" width={28} height={28} style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>Chaturangveda</span>
              <span className={styles.logoSubtitle}>New Era in Teaching Chess</span>
            </div>
          </Link>

          <ul className={styles.navLinks}>
            <li>
              <Link
                href="/"
                className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
              >
                Home
              </Link>
            </li>
            {/* Services with dropdown */}
            <li
              className={styles.dropdownParent}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                className={`${styles.navLink} ${pathname === '/services' ? styles.navLinkActive : ''} ${styles.hasDropdown}`}
              >
                Services <span className={styles.dropdownCaret}>▾</span>
              </Link>
              {servicesOpen && (
                <div className={styles.dropdown}>
                  {serviceDropdownItems.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.dropdownItem}>
                      <span className={styles.dropdownIcon}>{item.icon}</span>
                      <span className={styles.dropdownText}>
                        <span className={styles.dropdownLabel}>{item.label}</span>
                        <span className={styles.dropdownDesc}>{item.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

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
              <a href={LMS_URL} target="_blank" rel="noopener noreferrer" className={styles.lmsBtn}>
                Student Login
              </a>
            </li>
            <li>
              <Link href="/book-free-trial" className={`btn-primary ${styles.navCTA}`}>
                Book Free Trial
              </Link>
            </li>
          </ul>

          <button
            className={`${styles.mobileMenuBtn} ${mobileOpen ? styles.mobileMenuBtnOpen : ''}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <Link href="/services" className={`${styles.navLink} ${pathname === '/services' ? styles.navLinkActive : ''}`} onClick={() => setMobileOpen(false)}>
          Services
        </Link>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/become-a-coach" className={styles.navLink} onClick={() => setMobileOpen(false)}>
          Become a Coach
        </Link>
        <a href={LMS_URL} target="_blank" rel="noopener noreferrer" className={styles.lmsBtn} onClick={() => setMobileOpen(false)}>
          Student Login
        </a>
        <Link href="/book-free-trial" className={styles.mobileCTA} onClick={() => setMobileOpen(false)}>
          Book Free Trial
        </Link>
      </div>
    </>
  );
}
