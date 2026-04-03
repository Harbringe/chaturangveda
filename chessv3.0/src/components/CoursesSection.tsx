'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaBullseye, FaUsers, FaBolt } from 'react-icons/fa';
import styles from './CoursesSection.module.css';

const courses = [
  {
    level: 'beginner',
    icon: <FaBullseye />,
    title: 'Free Trial Class',
    tag: 'Start Here',
    badge: 'FREE',
    outcomes: [
      'Full 45-minute session',
      'FIDE-rated coach assessment',
      'Personalised feedback report',
      'Instant WhatsApp confirmation',
    ],
    chessIcon: '♙',
  },
  {
    level: 'intermediate',
    icon: <FaUsers />,
    title: 'Group Classes',
    tag: 'POPULAR',
    badge: 'POPULAR',
    outcomes: [
      'Maximum 5 students per batch',
      '2–3 sessions per week',
      'Opening theory & tactical puzzles',
      'Peer games and live analysis',
      'Monthly progress review',
    ],
    chessIcon: '♘',
  },
  {
    level: 'advanced',
    icon: <FaBolt />,
    title: 'Private 1-on-1',
    tag: 'Elite',
    badge: 'PREMIUM',
    outcomes: [
      '100% 1-on-1 with expert coach',
      'Completely custom curriculum',
      'Flexible scheduling',
      'Tournament preparation',
      'Deep grandmaster game analysis',
    ],
    chessIcon: '♔',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export default function CoursesSection() {
  return (
    <section id="courses" className={styles.courses}>
      <div className="container">
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="section-subtitle"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Our Programs
          </motion.span>
          <h2>
            Structured Learning Paths for <br />
            Every Skill Level
          </h2>
          <p>
            From absolute beginners to aspiring masters, we have a tailored
            program to elevate every player.
          </p>
        </motion.div>
      </div>

      <motion.div
        className={styles.coursesGrid}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {courses.map((course) => (
          <motion.div
            key={course.level}
            variants={cardVariants}
            style={{ height: '100%' }}
          >
            <TiltCard className={styles.courseCardWrap}>
              <div className={styles.courseCard}>
                <div className={`${styles.courseHeader} ${styles[course.level]}`}>
                  <span className={styles.courseLevel}>{course.level}</span>
                  <span className={styles.courseEmoji}>
                    {course.icon}
                  </span>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <span className={styles.courseChessIcon}>{course.chessIcon}</span>
                </div>
                <div className={styles.courseBody}>
                  <span className={styles.courseTag}>{course.tag}</span>
                  <ul className={styles.courseOutcomes}>
                    {course.outcomes.map((outcome) => (
                      <li key={outcome}>
                        <span className={styles.checkmark}>✓</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                  <motion.a
                    href="/book-free-trial"
                    className={`btn-primary ${styles.courseCTA}`}
                    whileHover={{ scale: 1.03, boxShadow: '0 8px 28px rgba(0,77,153,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Get Started →
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
