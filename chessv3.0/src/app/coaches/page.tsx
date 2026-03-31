import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'World-Class Chess Coaches | Chaturangveda',
  description: 'Meet our FIDE-rated chess coaches — decade-long experience, national and international players who teach, inspire, and build champions.',
};

const coaches = [
  {
    name: 'Manoj Reddy Maram',
    title: 'Head Coach & Founder',
    experience: '10+ Years',
    badge: 'FIDE Rated',
    image: '/images/2025/02/ManojReddyMaram.jpg',
    bio: 'A FIDE-rated international player who has dedicated over a decade to mastering and teaching chess. With 100+ students trained from beginner to tournament level, Manoj brings deep expertise in opening theory, endgame mastery, and psychological preparation.',
    specialties: ['Opening Theory', 'Endgame Mastery', 'Tournament Prep', 'Tactics'],
    achievements: [
      'FIDE-Rated International Player',
      'Trained 100+ students',
      '10+ years of coaching',
    ],
  },
  {
    name: 'Uttham Naresh Patti',
    title: 'Senior Coach',
    experience: '10+ Years',
    badge: 'National Level',
    image: '/images/2025/02/1697257716831.jpg',
    bio: 'A two-time national-level player with 5+ years of dedicated coaching experience. Uttham specialises in tactical play and building the competitive mindset required to succeed at tournaments.',
    specialties: ['Tactical Play', 'Middlegame Strategy', 'National Prep', 'Youth Coaching'],
    achievements: [
      'Two-time National-Level Player',
      '5+ years coaching',
      'Tournament preparation specialist',
    ],
  },
  {
    name: 'Rajdip',
    title: 'Coach',
    experience: '5+ Years',
    badge: 'State Level',
    image: '/images/2025/02/resume.png',
    bio: 'Brings an energetic and accessible approach to chess coaching, having trained 30+ students to impressive state-level results. Known for making complex ideas fun — Rajdip has a special talent for engaging young learners.',
    specialties: ['Beginner Curriculum', 'State-Level Prep', 'Fun Learning', 'Youth Development'],
    achievements: [
      'Trained 30+ students',
      'State-level wins',
      'Youth coaching specialist',
    ],
  },
  {
    name: 'Coach 4',
    title: 'Online Chess Specialist',
    experience: '6+ Years',
    badge: 'International',
    image: '/images/2025/02/ManojReddyMaram.jpg',
    bio: 'Specialises in online chess pedagogy with students across USA, UK and Canada. Brings a structured, data-driven approach to student improvement, tracking every game and identifying patterns that hold players back from reaching their next level.',
    specialties: ['Online Coaching', 'Opening Preparation', 'Game Analysis', 'International Students'],
    achievements: [
      'Coached students in 4+ countries',
      'Specialised online pedagogy',
      'Tournament preparation expert',
    ],
  },
  {
    name: 'Coach 5',
    title: 'Junior Development Coach',
    experience: '5+ Years',
    badge: 'Youth Specialist',
    image: '/images/2025/02/1697257716831.jpg',
    bio: 'Dedicated to nurturing chess talent in young learners aged 5–12. Uses game-based learning and storytelling to make chess concepts click for even the youngest students. Has developed the academy\'s foundational curriculum for beginners.',
    specialties: ['Ages 5–12', 'Foundational Chess', 'Game-Based Learning', 'Beginner Curriculum'],
    achievements: [
      'Curriculum designer for beginners',
      'Trained 40+ young students',
      'Child-first coaching methodology',
    ],
  },
];

export default function CoachesPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>The Team</div>
        <h1 className={styles.heroTitle}>World-Class Chess Coaches</h1>
        <p className={styles.heroSub}>
          Decades of combined experience, FIDE ratings, and a genuine passion for teaching.
        </p>
      </section>

      <div className={styles.coachesSection}>
        {coaches.map((coach) => (
          <div key={coach.name} className={styles.coachCard}>
            <div className={styles.coachImageWrap}>
              <Image
                src={coach.image}
                alt={coach.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 320px"
              />
              <span className={styles.coachBadge}>{coach.badge}</span>
            </div>
            <div className={styles.coachInfo}>
              <h2 className={styles.coachName}>{coach.name}</h2>
              <div className={styles.coachTitle}>{coach.title}</div>
              <div className={styles.coachExp}>{coach.experience} experience</div>
              <p className={styles.coachBio}>{coach.bio}</p>

              <div className={styles.specialtiesLabel}>Specialties</div>
              <div className={styles.specialties}>
                {coach.specialties.map((s) => (
                  <span key={s} className={styles.specialty}>{s}</span>
                ))}
              </div>

              <div className={styles.achievementsLabel}>Achievements</div>
              <ul className={styles.achievements}>
                {coach.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.joinCta}>
        <div className={styles.joinCtaInner}>
          <h2 className={styles.joinCtaTitle}>Are You a Chess Expert?</h2>
          <p className={styles.joinCtaSub}>
            We&apos;re always looking for passionate coaches to join our growing team.
          </p>
          <Link href="/become-a-coach" className="btn-primary">
            Become a Coach
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
