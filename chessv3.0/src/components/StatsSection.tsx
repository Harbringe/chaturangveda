'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaGlobeAmericas, FaStar } from 'react-icons/fa';
import styles from './StatsSection.module.css';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className={styles.statNumber}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { icon: <FaGraduationCap />, number: 100, suffix: '+', label: 'Students Trained' },
  { icon: <FaChalkboardTeacher />, number: 10, suffix: '+', label: 'Years Experience' },
  { icon: <FaGlobeAmericas />, number: 5, suffix: '', label: 'Expert Coaches' },
  { icon: <FaStar />, number: 150, suffix: '+', label: 'Tournament Wins' },
];

export default function StatsSection() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            whileHover={{ y: -8 }}
          >
            <span className={styles.statIcon}>{stat.icon}</span>
            <AnimatedCounter target={stat.number} suffix={stat.suffix} />
            <p className={styles.statLabel}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
