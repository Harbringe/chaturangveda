import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Chaturangveda',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'var(--primary-fixed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <Image src="/chaturangveda_logo.png" alt="Chaturangveda" width={54} height={54} style={{ objectFit: 'contain' }} />
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            background: 'var(--primary-fixed)',
            color: 'var(--primary)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: 20,
            marginBottom: 20,
          }}>
            Coming Soon
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--on-surface)',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Terms of Service
          </h1>

          <p style={{
            color: 'var(--on-surface-variant)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            marginBottom: 40,
          }}>
            We&apos;re working on our Terms of Service page. It will cover enrollment policies, class guidelines, and usage terms. Check back soon.
          </p>

          <div style={{
            background: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 'var(--border-radius)',
            padding: '24px 28px',
            marginBottom: 40,
            textAlign: 'left',
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)', margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--on-surface)' }}>Have a question about our policies?</strong><br />
              Drop us a message on WhatsApp — our team responds quickly and can walk you through any terms or policies.
            </p>
            <a
              href="https://wa.me/+917569194709"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 14,
                background: 'var(--primary)',
                color: '#fff',
                padding: '10px 22px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Chat on WhatsApp →
            </a>
          </div>

          <Link
            href="/"
            style={{
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
