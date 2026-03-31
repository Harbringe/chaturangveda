import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Chess Classes For Every Level | Chaturangveda',
  description: 'Free trial, group classes, and private 1-on-1 chess coaching for kids. FIDE-rated coaches, small batches, personalised curriculum.',
};

const programs = [
  {
    title: 'Free Trial Class',
    subtitle: 'Zero cost · Zero commitment',
    description: 'Not sure if chess is right for your child? Our experts will run a full 45-minute session completely free. We assess their current level, introduce the fundamentals, and create a personalised learning plan — before you spend a single rupee.',
    image: '/images/2024/03/Downloader.la-65fe7f398ff44.jpg',
    badge: 'FREE',
    badgeClass: 'badgeFree',
    features: [
      'Full 45-minute session',
      'FIDE-rated coach assessment',
      'Personalised feedback report',
      'Instant WhatsApp confirmation',
    ],
  },
  {
    title: 'Group Chess Classes',
    subtitle: 'Max 5 students per batch',
    description: 'Small-group coaching strikes the perfect balance between focused instruction and the energy of peer learning. With never more than 5 students, every child gets meaningful time with their coach while competing with and learning from their peers.',
    image: '/images/2024/08/adorable-siblings-lying-ground-playing-chess-with-each-other.webp',
    badge: 'POPULAR',
    badgeClass: 'badgePopular',
    features: [
      'Maximum 5 students per batch',
      '2–3 sessions per week',
      'Opening theory & tactical puzzles',
      'Peer games and live analysis',
      'Monthly progress review',
    ],
  },
  {
    title: 'Private 1-on-1 Classes',
    subtitle: 'Fully personalised coaching',
    description: 'For students who want rapid progress or have specific tournament goals, private sessions give them undivided coach attention. Every session is built around your child\'s unique strengths, weaknesses, and ambitions.',
    image: '/images/2024/08/kids-playing-around-calm-cosy-spaces.webp',
    badge: 'PREMIUM',
    badgeClass: 'badgePremium',
    features: [
      '100% 1-on-1 with expert coach',
      'Completely custom curriculum',
      'Flexible scheduling',
      'Tournament preparation',
      'Deep grandmaster game analysis',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>Programs</div>
        <h1 className={styles.heroTitle}>Chess Classes For Every Level</h1>
        <p className={styles.heroSub}>
          From your child&apos;s very first move to tournament-ready play — we have a program designed to meet them exactly where they are.
        </p>
      </section>

      <div className={styles.programs}>
        {programs.map((program, i) => (
          <div key={program.title} className={`${styles.programCard} ${i % 2 === 1 ? styles.reverse : ''}`}>
            <div className={styles.programImage}>
              <Image
                src={program.image}
                alt={program.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <span className={`${styles.programBadge} ${styles[program.badgeClass]}`}>
                {program.badge}
              </span>
            </div>
            <div className={styles.programInfo}>
              <div className={styles.programSubtitle}>{program.subtitle}</div>
              <h2 className={styles.programTitle}>{program.title}</h2>
              <p className={styles.programDesc}>{program.description}</p>
              <ul className={styles.featureList}>
                {program.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href="/book-free-trial" className="btn-primary">
                Book Free Trial →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Not Sure Which Plan Is Right?</h2>
          <p className={styles.ctaSub}>
            Start with a free trial and our coaches will recommend the perfect program for your child.
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
