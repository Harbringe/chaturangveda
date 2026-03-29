'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  FaChessKnight,
  FaChalkboardTeacher,
  FaLaptop,
  FaChartLine,
  FaTrophy,
  FaRobot,
} from 'react-icons/fa';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: <FaChessKnight />,
    title: 'Critical Thinking',
    description: 'Multi-step planning skills that carry directly into academics and real-world decisions.',
    chess: '♚',
  },
  {
    icon: <FaChalkboardTeacher />,
    title: 'Laser Focus',
    description: 'Chess concentration exercises improve attention span in school and everyday life.',
    chess: '♛',
  },
  {
    icon: <FaLaptop />,
    title: 'Pattern Recognition',
    description: 'Opening theory and pattern exercises train both short and long-term memory.',
    chess: '♝',
  },
  {
    icon: <FaChartLine />,
    title: 'Confidence & Resilience',
    description: 'Winning and losing gracefully builds character and the mindset for lifelong success.',
    chess: '♞',
  },
  {
    icon: <FaTrophy />,
    title: 'Better Grades',
    description: 'Students show measurable improvement in math and logical reasoning after 3 months.',
    chess: '♜',
  },
  {
    icon: <FaRobot />,
    title: 'True Sportsmanship',
    description: 'Respect for opponents and fair play — values that define great humans.',
    chess: '♟',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(66,165,245,0.1)' }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.cardBg}>{feature.chess}</div>
      <motion.div
        className={styles.featureIcon}
        whileHover={{ scale: 1.2, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className={styles.iconInner}>{feature.icon}</span>
      </motion.div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
      <div className={styles.cardLine} />
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.features}>
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
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Why Choose Us
          </motion.span>
          <h2>
            Everything Your Child Needs to <br />
            Master the Royal Game
          </h2>
          <p>
            A comprehensive chess education platform designed to nurture champions
            from beginners to masters.
          </p>
        </motion.div>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
