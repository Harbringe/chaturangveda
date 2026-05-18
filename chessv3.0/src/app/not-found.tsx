import Image from 'next/image';
import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Page Not Found | Chaturangveda',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoRing}>
          <div className={styles.logoInner}>
            <Image
              src="/chaturangveda_logo.png"
              alt="Chaturangveda"
              width={46}
              height={46}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 404 */}
        <p className={styles.number}>404</p>

        <h1 className={styles.heading}>This square is empty.</h1>

        <p className={styles.sub}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        {/* CTAs */}
        <div className={styles.ctas}>
          <Link href="/" className="btn-primary" style={{ padding: '0.7rem 1.75rem', fontSize: '0.9rem' }}>
            ← Back to Home
          </Link>
          <Link href="/book-free-trial" className={styles.btnOutline}>
            Book Free Trial
          </Link>
        </div>

        <div className={styles.divider} />

        {/* Quick links */}
        <nav className={styles.quickLinks} aria-label="Quick navigation">
          {[
            { href: '/blogs', label: 'Blog' },
            { href: '/coaches', label: 'Coaches' },
            { href: '/curriculum', label: 'Curriculum' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className={styles.quickLink}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
