'use client';

import { motion } from 'framer-motion';
import { FaCalendarCheck, FaChessKnight, FaTrophy } from 'react-icons/fa';
import styles from './StatsSection.module.css';

const steps = [
  {
    icon: <FaCalendarCheck />,
    step: '01',
    title: 'Book a Free Trial',
    description:
      'Schedule a 45-minute session at zero cost. No commitment, no pressure — just great chess with a FIDE-rated coach.',
    accent: 'Free & instant',
  },
  {
    icon: <FaChessKnight />,
    step: '02',
    title: 'Get Assessed & Placed',
    description:
      'Your coach evaluates your current level, identifies gaps, and places you in the perfect batch or 1-on-1 plan.',
    accent: 'Personalised path',
  },
  {
    icon: <FaTrophy />,
    step: '03',
    title: 'Learn, Compete & Win',
    description:
      'Follow our structured five-level curriculum, play tournaments, and track real progress — from first move to FIDE rating.',
    accent: 'Proven results',
  },
];

export default function StatsSection() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tag}>The Process</span>
          <h2 className={styles.title}>From Zero to Tournament-Ready in 3 Steps</h2>
          <p className={styles.sub}>
            We make the path to chess excellence clear, structured, and achievable for every child.
          </p>
        </motion.div>

        <div className={styles.stepsGrid}>
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <div className={styles.stepTop}>
                <span className={styles.stepNum}>{s.step}</span>
                <span className={styles.stepIcon}>{s.icon}</span>
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.description}</p>
              <span className={styles.stepAccent}>{s.accent}</span>
            </motion.div>
          ))}
        </div>

        {/* Connecting line (desktop only) */}
        <div className={styles.connector} aria-hidden="true">
          <div className={styles.connectorLine} />
        </div>
      </div>
    </section>
  );
}
