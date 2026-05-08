import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Page Not Found | Chaturangveda',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        gap: '1.5rem',
      }}>
        <div style={{ fontSize: '5rem', lineHeight: 1 }}>♟</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--on-surface)' }}>
          This square is empty.
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.125rem', maxWidth: '480px' }}>
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="/" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Back to Home
          </Link>
          <Link href="/book-free-trial" style={{
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            border: '1.5px solid var(--primary)',
            color: 'var(--primary)',
            fontWeight: 600,
          }}>
            Book Free Trial
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
          <Link href="/blogs" style={{ color: 'var(--primary)' }}>Blog</Link>
          <Link href="/coaches" style={{ color: 'var(--primary)' }}>Coaches</Link>
          <Link href="/curriculum" style={{ color: 'var(--primary)' }}>Curriculum</Link>
          <Link href="/contact" style={{ color: 'var(--primary)' }}>Contact</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
