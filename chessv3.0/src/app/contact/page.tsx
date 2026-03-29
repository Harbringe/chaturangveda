import Link from 'next/link';
import { FaWhatsapp, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Contact Us | Chaturangveda',
  description: 'Get in touch with Chaturangveda. Book a free trial or ask us anything via WhatsApp, phone, or the contact form.',
};

const methods = [
  {
    title: 'WhatsApp',
    description: 'Usually responds within minutes',
    value: '+91 75691 94709',
    href: 'https://wa.me/+917569194709',
    cta: 'Chat Now →',
  },
  {
    title: 'Phone',
    description: 'Mon–Sat, 9 AM – 7 PM IST',
    value: '+91 75691 94709',
    href: 'tel:+917569194709',
    cta: 'Call Us →',
  },
  {
    title: 'Location',
    description: 'Online — available nationwide',
    value: 'Hyderabad, India',
    href: null,
    cta: 'Online Classes',
  },
];

const methodIcons = [<FaWhatsapp key="wa" />, <FaPhone key="ph" />, <FaMapMarkerAlt key="loc" />];

const businessHours = [
  { day: 'Monday – Friday', hours: '9:00 AM – 7:00 PM IST' },
  { day: 'Saturday', hours: '9:00 AM – 5:00 PM IST' },
  { day: 'Sunday', hours: 'Private sessions only' },
  { day: 'WhatsApp', hours: '24/7 (replies in business hours)' },
];

const faqs = [
  {
    question: 'What age group do you teach?',
    answer: 'Children from age 5 and above. Our curriculum adapts to each age group.',
  },
  {
    question: 'Are classes online or in-person?',
    answer: 'All classes are conducted online via Zoom, accessible anywhere in India.',
  },
  {
    question: 'How long is each class?',
    answer: 'Standard classes run 45–60 minutes. Private sessions can be extended as needed.',
  },
  {
    question: 'Do I need any special equipment?',
    answer: 'Just a device with stable internet. A physical chess board is helpful but not required.',
  },
  {
    question: 'What happens in the free trial?',
    answer: 'A full 45-minute session — level assessment, fundamentals, and personalised feedback. Completely free.',
  },
  {
    question: 'Can adults join?',
    answer: 'Absolutely. While we specialise in kids, adult learners are very welcome. Contact us to discuss.',
  },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>Contact</div>
        <h1 className={styles.heroTitle}>We&apos;d Love to Hear From You</h1>
        <p className={styles.heroSub}>
          Questions? Want to book a trial? Reach out via WhatsApp for the fastest reply.
        </p>
      </section>

      <div className={styles.methodsSection}>
        <div className={styles.sectionLabel}>Get in Touch</div>
        <h2 className={styles.sectionTitle}>How to Reach Us</h2>
        <div className={styles.methodsGrid}>
          {methods.map((m, i) => (
            <div key={m.title} className={styles.methodCard}>
              <div className={styles.methodIcon}>{methodIcons[i]}</div>
              <div className={styles.methodTitle}>{m.title}</div>
              <div className={styles.methodDesc}>{m.description}</div>
              <div className={styles.methodValue}>{m.value}</div>
              {m.href ? (
                <a href={m.href} className={styles.methodCta} target={m.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {m.cta}
                </a>
              ) : (
                <span className={styles.methodCta} style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>
                  {m.cta}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.hoursSection}>
        <div className={styles.sectionLabel}>Availability</div>
        <h2 className={styles.sectionTitle}>Business Hours</h2>
        <table className={styles.hoursTable}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map((row) => (
              <tr key={row.day}>
                <td><strong>{row.day}</strong></td>
                <td>{row.hours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.faqSection}>
        <div className={styles.sectionLabel}>FAQ</div>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.question} className={styles.faqItem}>
            <div className={styles.faqQuestion}>{faq.question}</div>
            <div className={styles.faqAnswer}>{faq.answer}</div>
          </div>
        ))}
      </div>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaSub}>
            Book a free trial and discover what Chaturangveda can do for your child.
          </p>
          <Link href="/book-free-trial" className="btn-primary">
            Book Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
