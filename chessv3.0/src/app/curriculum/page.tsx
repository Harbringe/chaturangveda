import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Chess Curriculum & Schedule | Chaturangveda',
  description: 'Structured beginner to advanced chess curriculum designed by FIDE-rated coaches. View batch schedules and start your journey.',
};

const levels = [
  {
    num: '01',
    title: 'Beginner',
    duration: '3 Months',
    topics: [
      'Rules & how pieces move',
      'Basic checkmates',
      'Opening principles',
      'Simple tactics (forks, pins)',
      'Pawn structure basics',
    ],
    goal: 'Play a complete game confidently and spot basic tactics.',
  },
  {
    num: '02',
    title: 'Intermediate',
    duration: '4 Months',
    topics: [
      'Opening theory',
      'Tactical motifs (skewers, discovered attacks)',
      'Basic endgames',
      'Middlegame strategy',
      'Game analysis',
    ],
    goal: 'Win club tournaments and analyse your own games.',
  },
  {
    num: '03',
    title: 'Advanced',
    duration: '6 Months',
    topics: [
      'Deep opening preparation',
      'Complex tactical combinations',
      'Full endgame theory',
      'Positional & pawn play',
      'Tournament psychology',
    ],
    goal: 'Compete at state and national level tournaments.',
  },
];

const schedule = [
  { day: 'Monday', time: '5:00 – 6:00 PM', batch: 'Beginner Group A' },
  { day: 'Tuesday', time: '5:00 – 6:00 PM', batch: 'Intermediate Group A' },
  { day: 'Wednesday', time: '4:00 – 5:00 PM', batch: 'Beginner Group B' },
  { day: 'Wednesday', time: '6:00 – 7:00 PM', batch: 'Advanced Group' },
  { day: 'Thursday', time: '5:00 – 6:00 PM', batch: 'Intermediate Group B' },
  { day: 'Saturday', time: '10:00 – 11:00 AM', batch: 'Weekend Batch (Beginner)' },
  { day: 'Saturday', time: '11:30 AM – 1:00 PM', batch: 'Weekend Batch (Advanced)' },
  { day: 'Sunday', time: '10:00 – 11:30 AM', batch: 'Private Sessions (All levels)' },
];

export default function CurriculumPage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>Curriculum &amp; Schedule</div>
        <h1 className={styles.heroTitle}>Structured Path From Beginner to Champion</h1>
        <p className={styles.heroSub}>
          Designed by FIDE-rated coaches to take students from their first move all the way to tournament play — at their own pace.
        </p>
      </section>

      <div className={styles.levelsSection}>
        <div className={styles.sectionLabel}>Learning Path</div>
        <h2 className={styles.sectionTitle}>Three Levels, One Journey</h2>
        <div className={styles.levelsGrid}>
          {levels.map((level) => (
            <div key={level.num} className={styles.levelCard}>
              <div className={styles.levelNum}>{level.num}</div>
              <div className={styles.levelTitle}>{level.title}</div>
              <div className={styles.levelDuration}>{level.duration}</div>
              <div className={styles.topicsLabel}>Topics Covered</div>
              <ul className={styles.topics}>
                {level.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className={styles.levelGoal}>
                <div className={styles.levelGoalLabel}>Goal</div>
                {level.goal}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scheduleSection}>
        <div className={styles.sectionLabel}>Batch Times</div>
        <h2 className={styles.sectionTitle}>Weekly Schedule</h2>
        <table className={styles.scheduleTable}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time (IST)</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.day}</strong></td>
                <td>{row.time}</td>
                <td>{row.batch}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.scheduleNote}>Sessions include recording. Private sessions are fully flexible.</p>
      </div>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaSub}>
            Our coaches will assess your child&apos;s level and place them in the perfect batch.
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
