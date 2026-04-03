'use client';

import { motion } from 'framer-motion';
import {
  FaBrain,
  FaBullseye,
  FaLightbulb,
  FaMedal,
  FaPuzzlePiece,
  FaGraduationCap,
} from 'react-icons/fa';
import {
  FiCpu,
  FiTarget,
  FiClock,
  FiShield,
  FiUsers,
  FiGrid,
  FiHash,
} from 'react-icons/fi';
import styles from './BenefitsSection.module.css';

const benefitCards = [
  { icon: <FaBrain />, title: 'Critical Thinking', desc: 'Multi-step planning skills that carry directly into academics and real-world decisions.', color: '#1565C0' },
  { icon: <FaBullseye />, title: 'Laser Focus', desc: 'Chess concentration exercises improve attention span in school and everyday life.', color: '#0D47A1' },
  { icon: <FaLightbulb />, title: 'Fast Memory', desc: 'Pattern recognition and opening theory train both short and long-term memory.', color: '#1976D2' },
  { icon: <FaMedal />, title: 'Resilience', desc: 'Winning and losing gracefully builds character and the mindset for lifelong success.', color: '#1E88E5' },
  { icon: <FaPuzzlePiece />, title: 'Better Grades', desc: 'Students show measurable improvement in math and logical reasoning after 3 months.', color: '#2196F3' },
  { icon: <FaGraduationCap />, title: 'True Sportsmanship', desc: 'Respect for opponents and fair play — values that define great humans.', color: '#42A5F5' },
];

const tags = [
  { icon: <FiCpu size={14} />, label: 'Memory' },
  { icon: <FiTarget size={14} />, label: 'Focus' },
  { icon: <FiClock size={14} />, label: 'Patience' },
  { icon: <FiShield size={14} />, label: 'Resilience' },
  { icon: <FiUsers size={14} />, label: 'Sportsmanship' },
  { icon: <FiGrid size={14} />, label: 'Spatial Reasoning' },
  { icon: <FiHash size={14} />, label: 'Math Skills' },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className={styles.benefits}>
      <div className={styles.benefitsContent}>
        <motion.div
          className={styles.benefitsText}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="section-subtitle"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            The Power of Chess
          </motion.span>
          <h2>
            Student <span>Achievements</span> <br />
            In Chess, Academics &amp; Life
          </h2>
          <p>
            At Chaturangveda, we believe chess is more than a game — it&apos;s a powerful
            tool for cognitive development. Our methodology nurtures essential life
            skills that give your child an edge in academics, social situations, and
            personal growth.
          </p>
          <div className={styles.benefitsList}>
            {tags.map((tag, i) => (
              <motion.span
                key={tag.label}
                className={styles.benefitTag}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4, type: 'spring' }}
                whileHover={{ scale: 1.06 }}
              >
                <span className={styles.tagIcon}>{tag.icon}</span>
                {tag.label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.benefitsGrid}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {benefitCards.map((card, i) => (
            <motion.div
              key={card.title}
              className={styles.benefitCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(21,101,192,0.14)' }}
            >
              <div className={styles.benefitCardIconWrap} style={{ background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)` }}>
                <span className={styles.benefitCardIcon} style={{ color: card.color }}>
                  {card.icon}
                </span>
              </div>
              <div className={styles.benefitCardContent}>
                <h4 className={styles.benefitCardTitle}>{card.title}</h4>
                <p className={styles.benefitCardDesc}>{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
