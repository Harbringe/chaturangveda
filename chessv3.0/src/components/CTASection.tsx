'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section id="cta" className={styles.cta}>
      <div className={styles.ctaBgPiece1}>♛</div>
      <div className={styles.ctaBgPiece2}>♞</div>
      <div className={styles.ctaBgPiece3}>♜</div>

      <motion.div
        className={styles.ctaContent}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className={styles.ctaEmoji}>♟</span>
        <h2 className={styles.ctaTitle}>
          Start Your Child&apos;s Chess Journey Today
        </h2>
        <p className={styles.ctaDescription}>
          Book a free 45-minute trial. Our FIDE-rated coaches will assess your child and create a personalised plan.
        </p>

        <div className={styles.ctaButtons}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/book-free-trial"
              className={styles.ctaBtnPrimary}
            >
              Book Free Trial
            </Link>
          </motion.div>
          <motion.a
            href="https://wa.me/+917569194709"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtnSecondary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            WhatsApp Us
          </motion.a>
        </div>

        <p className={styles.ctaNote}>
          100% Free · Zero Obligation · No Credit Card Required
        </p>
      </motion.div>
    </section>
  );
}
