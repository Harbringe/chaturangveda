'use client';

import { motion } from 'framer-motion';
import styles from './TestimonialsSection.module.css';

const FALLBACK_TESTIMONIALS = [
  {
    text: 'My son went from not knowing the rules to winning his first school tournament in just 6 months. The coaches at Chaturangveda are absolutely phenomenal!',
    name: 'Priya Sharma',
    detail: 'Parent of Aarav, Age 9',
    initials: 'PS',
    stars: 5,
  },
  {
    text: 'The personalized attention and regular progress reports make a huge difference. I can see my daughter\'s confidence growing every week, both on and off the board.',
    name: 'Rajesh Patel',
    detail: 'Parent of Ananya, Age 11',
    initials: 'RP',
    stars: 5,
  },
  {
    text: 'What sets Chaturangveda apart is their structured curriculum. The transition from beginner to intermediate was seamless, and my child never lost interest.',
    name: 'Meena Krishnan',
    detail: 'Parent of Vikram, Age 8',
    initials: 'MK',
    stars: 5,
  },
  {
    text: 'The weekly tournaments are amazing! My son now looks forward to every Saturday. His FIDE rating has improved by 300 points in just one year.',
    name: 'Amit Deshmukh',
    detail: 'Parent of Rohan, Age 12',
    initials: 'AD',
    stars: 5,
  },
  {
    text: 'We tried 3 other chess platforms before finding Chaturangveda. The difference in teaching quality is night and day. Truly a new era in chess education.',
    name: 'Sunita Verma',
    detail: 'Parent of Ishaan, Age 7',
    initials: 'SV',
    stars: 5,
  },
  {
    text: 'The AI-powered analysis feature is fantastic. My daughter reviews her games after every session and can see exactly where she can improve. Highly recommend!',
    name: 'Deepak Gupta',
    detail: 'Parent of Kavya, Age 10',
    initials: 'DG',
    stars: 5,
  },
];

interface TestimonialItem {
  text: string;
  name: string;
  detail: string;
  initials: string;
  stars: number;
}

export default function TestimonialsSection({ testimonials: testimonialsProp }: { testimonials?: TestimonialItem[] }) {
  const testimonials = testimonialsProp ?? FALLBACK_TESTIMONIALS;
  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.testimonialsContainer}>
        <motion.div
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-subtitle">Testimonials</span>
          <h2>
            Loved by Parents <br />
            Across the Country
          </h2>
          <p>
            Hear from parents who&apos;ve seen the transformation in their children.
          </p>
        </motion.div>

        <div className={styles.testimonialsSlider}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className={styles.quoteIcon}>&ldquo;</span>
              <span className={styles.stars}>
                {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
              </span>
              <p className={styles.testimonialText}>{t.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>{t.initials}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorDetail}>{t.detail}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
