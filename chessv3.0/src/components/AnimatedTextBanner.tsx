'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AnimatedTextBanner.module.css';

const textLines = [
  { text: 'Where Grandmasters Are Born', icon: '♚' },
  { text: 'Learn • Play • Conquer', icon: '♛' },
  { text: 'Transform Moves Into Mastery', icon: '♞' },
  { text: 'Building Champions Since Day One', icon: '♜' },
  { text: 'Every Pawn Has the Power to Become a Queen', icon: '♟' },
  { text: 'Think Ahead. Play Smart. Win Big.', icon: '♔' },
];

const marqueeWords = [
  '150+ Tournament Champions', '♟', 'Hyderabad', '♞', '5 Expert Coaches', '♝',
  'Chennai', '♜', '100+ Students Trained', '♛', 'Bengaluru', '♚',
  'New York', '♟', 'Mumbai', '♞', 'State & National Winners', '♝',
  'London', '♜', 'Toronto', '♛', 'Kolkata', '♚',
  'Online Worldwide', '♟', 'Pune', '♞', 'Los Angeles', '♝',
  'Dubai', '♜', 'Delhi', '♛', 'Singapore', '♚',
];

export default function AnimatedTextBanner() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % textLines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.banner}>
      {/* Scrolling marquee top */}
      <div className={styles.marqueeWrapper}>
        <div className={styles.marquee}>
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className={styles.marqueeWord}>{word}</span>
          ))}
        </div>
      </div>

      {/* Main animated text */}
      <div className={styles.mainText}>
        <AnimatePresence mode="wait">
          <motion.div
            key={lineIndex}
            className={styles.textLine}
            initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -50, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={styles.textIcon}>{textLines[lineIndex].icon}</span>
            <span className={styles.textContent}>{textLines[lineIndex].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className={styles.progressDots}>
        {textLines.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === lineIndex ? styles.dotActive : ''}`}
            onClick={() => setLineIndex(i)}
            aria-label={`Show text ${i + 1}`}
          />
        ))}
      </div>

      {/* Scrolling marquee bottom (reversed) */}
      <div className={styles.marqueeWrapper}>
        <div className={`${styles.marquee} ${styles.marqueeReverse}`}>
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className={styles.marqueeWord}>{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
