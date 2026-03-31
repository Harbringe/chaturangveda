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
    title: 'Foundation',
    subtitle: '8×8 Beginner',
    duration: '3 Months · 24 Sessions',
    topics: [
      'Rules & how all pieces move',
      'Attack, defence & piece value',
      'Check, checkmate & stalemate',
      'Basic checkmates (K+Q, K+R)',
      'Opening principles & pawn structure',
    ],
    goal: 'Play a complete game confidently and understand the board.',
    badge: 'Start Here',
  },
  {
    num: '02',
    title: 'Level 1',
    subtitle: '8×8 Elementary',
    duration: '3 Months · 24 Sessions',
    topics: [
      'Piece coordination & exchanges',
      'Basic tactical patterns (forks, pins)',
      'Simple pawn endgames',
      'Intro to opening theory',
      'Tournament rules & etiquette',
    ],
    goal: 'Compete in school and club-level tournaments.',
    badge: 'Beginner+',
  },
  {
    num: '03',
    title: 'Level 2',
    subtitle: '8×8 Intermediate',
    duration: '4 Months · 32 Sessions',
    topics: [
      'Opening theory (common systems)',
      'Tactical motifs (skewers, discovered attacks)',
      'Basic endgame theory',
      'Middlegame strategy & planning',
      'Game analysis & self-review',
    ],
    goal: 'Win district & state-level tournaments and analyse your games.',
    badge: 'Intermediate',
  },
  {
    num: '04',
    title: 'Level 3',
    subtitle: '8×8 Advanced',
    duration: '5 Months · 40 Sessions',
    topics: [
      'Advanced tactical combinations',
      'Coordination, mobilisation & piece activity',
      'Advanced attacking patterns',
      'Full endgame theory',
      'Positional & pawn play',
    ],
    goal: 'Compete at national level and work towards FIDE rating.',
    badge: 'Advanced',
  },
  {
    num: '05',
    title: 'Level 4',
    subtitle: '8×8 Expert / FIDE Prep',
    duration: '6 Months · 48 Sessions',
    topics: [
      'Deep opening preparation & repertoire',
      'Master-level endgame strategies',
      'Advanced calculation & visualisation',
      'International tournament preparation',
      'Tournament psychology & time management',
    ],
    goal: 'Ace international tournaments and earn your FIDE rating.',
    badge: 'FIDE Prep',
  },
];

const schedule = [
  {
    day: 'Monday',
    batch: 'Beginner Group A',
    IST: '6:30 – 7:30 PM',
    EST: '8:00 – 9:00 AM',
    CST: '7:00 – 8:00 AM',
    PST: '5:00 – 6:00 AM',
    GMT: '1:00 – 2:00 PM',
  },
  {
    day: 'Tuesday',
    batch: 'Intermediate Group A',
    IST: '6:30 – 7:30 PM',
    EST: '8:00 – 9:00 AM',
    CST: '7:00 – 8:00 AM',
    PST: '5:00 – 6:00 AM',
    GMT: '1:00 – 2:00 PM',
  },
  {
    day: 'Wednesday',
    batch: 'Beginner Group B',
    IST: '8:00 – 9:00 PM',
    EST: '9:30 – 10:30 AM',
    CST: '8:30 – 9:30 AM',
    PST: '6:30 – 7:30 AM',
    GMT: '2:30 – 3:30 PM',
  },
  {
    day: 'Wednesday',
    batch: 'Advanced Group',
    IST: '9:30 – 10:30 PM',
    EST: '11:00 AM – 12:00 PM',
    CST: '10:00 – 11:00 AM',
    PST: '8:00 – 9:00 AM',
    GMT: '4:00 – 5:00 PM',
  },
  {
    day: 'Thursday',
    batch: 'Intermediate Group B',
    IST: '6:30 – 7:30 PM',
    EST: '8:00 – 9:00 AM',
    CST: '7:00 – 8:00 AM',
    PST: '5:00 – 6:00 AM',
    GMT: '1:00 – 2:00 PM',
  },
  {
    day: 'Saturday',
    batch: 'Weekend Batch (Beginner)',
    IST: '8:00 – 9:00 PM',
    EST: '9:30 – 10:30 AM',
    CST: '8:30 – 9:30 AM',
    PST: '6:30 – 7:30 AM',
    GMT: '2:30 – 3:30 PM',
  },
  {
    day: 'Saturday',
    batch: 'Weekend Batch (Advanced)',
    IST: '9:30 – 11:00 PM',
    EST: '11:00 AM – 12:30 PM',
    CST: '10:00 – 11:30 AM',
    PST: '8:00 – 9:30 AM',
    GMT: '4:00 – 5:30 PM',
  },
  {
    day: 'Sunday',
    batch: 'Private Sessions (All levels)',
    IST: 'Flexible',
    EST: 'Flexible',
    CST: 'Flexible',
    PST: 'Flexible',
    GMT: 'Flexible',
  },
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
        <h2 className={styles.sectionTitle}>8×8 Chess Academy — Five Levels, One Journey</h2>
        <p className={styles.sectionSubtitle}>Our 8×8 curriculum is designed by FIDE-rated coaches and follows a structured progression from absolute beginner to FIDE-rated player.</p>
        <div className={styles.levelsGrid}>
          {levels.map((level) => (
            <div key={level.num} className={styles.levelCard}>
              <div className={styles.levelHeader}>
                <div className={styles.levelNum}>{level.num}</div>
                <span className={styles.levelBadge}>{level.badge}</span>
              </div>
              <div className={styles.levelTitle}>{level.title}</div>
              <div className={styles.levelSubtitle}>{level.subtitle}</div>
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
        <p className={styles.scheduleTimezoneNote}>We are available across all major time zones — India (IST), UK (GMT/BST), USA Eastern (EST), Central (CST), and Pacific (PST).</p>
        <div className={styles.scheduleTableWrap}>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Day</th>
                <th>Batch</th>
                <th>IST (India)</th>
                <th>GMT (UK)</th>
                <th>EST (US East)</th>
                <th>CST (US Central)</th>
                <th>PST (US West)</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr key={i}>
                  <td><strong>{row.day}</strong></td>
                  <td>{row.batch}</td>
                  <td>{row.IST}</td>
                  <td>{row.GMT}</td>
                  <td>{row.EST}</td>
                  <td>{row.CST}</td>
                  <td>{row.PST}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.scheduleNote}>Sessions include recording. Private sessions are fully flexible — contact us to arrange a time that works for you.</p>
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
