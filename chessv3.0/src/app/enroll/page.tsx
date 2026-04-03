'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaUser, FaMobileAlt, FaEnvelope, FaChessKnight, FaCheck, FaTimes } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

/* ─── Course Data ─── */
const courses = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Start Your Chess Journey',
    icon: '♟',
    badge: 'Beginner',
    badgeColor: '#2e7d32',
    outcome: 'Master the rules, basic tactics, and opening principles to play confidently.',
    topics: ['Piece movement & values', 'Basic checkmates (K+Q, K+R)', 'Opening principles', 'Simple tactics — forks, pins, skewers'],
    duration: '3 months',
    pricing: {
      individual: { 2: 26400, 3: 35200, 4: 44000 },
      group:      { 2: 13200, 3: 17600, 4: 22000 },
    },
  },
  {
    id: 'level1',
    title: 'Level 1',
    subtitle: 'Build a Solid Foundation',
    icon: '♞',
    badge: 'Elementary',
    badgeColor: '#1565C0',
    outcome: 'Develop tactical vision and basic endgame technique for rated play.',
    topics: ['Tactical combinations (2–3 moves)', 'Pawn structures & plans', 'Basic endgames', 'Opening systems for white & black'],
    duration: '3 months',
    pricing: {
      individual: { 2: 29700, 3: 39600, 4: 49500 },
      group:      { 2: 14850, 3: 19800, 4: 24750 },
    },
  },
  {
    id: 'level2',
    title: 'Level 2',
    subtitle: 'Sharpen Your Strategy',
    icon: '♝',
    badge: 'Intermediate',
    badgeColor: '#6a1b9a',
    outcome: 'Understand positional concepts and complex tactics to cross 1200 ELO.',
    topics: ['Positional play & weak squares', 'Deep tactical puzzles', 'Rook endgames', 'Opening theory (15+ moves)'],
    duration: '3 months',
    pricing: {
      individual: { 2: 33000, 3: 44000, 4: 55000 },
      group:      { 2: 16500, 3: 22000, 4: 27500 },
    },
  },
  {
    id: 'level3',
    title: 'Level 3',
    subtitle: 'Advanced Mastery',
    icon: '♜',
    badge: 'Advanced',
    badgeColor: '#c62828',
    outcome: 'Master advanced strategy, deep calculation, and tournament preparation.',
    topics: ['Advanced positional themes', 'Complex endgames', 'Opening preparation & repertoire', 'Tournament game analysis'],
    duration: '3 months',
    pricing: {
      individual: { 2: 36300, 3: 48400, 4: 60500 },
      group:      { 2: 18150, 3: 24200, 4: 30250 },
    },
  },
  {
    id: 'fide',
    title: 'FIDE Rating Course',
    subtitle: 'Compete on the World Stage',
    icon: '♚',
    badge: 'Elite',
    badgeColor: '#e65100',
    outcome: 'Achieve your FIDE rating with professional tournament coaching and game analysis.',
    topics: ['Personalised game analysis', 'FIDE tournament strategy', 'Deep opening preparation', 'Clock management & psychology'],
    duration: '3 months',
    pricing: {
      individual: { 2: 39600, 3: 52800, 4: 66000 },
      group:      { 2: 19800, 3: 26400, 4: 33000 },
    },
  },
];

type ClassType = 'individual' | 'group';
type SessionsPerWeek = 2 | 3 | 4;

interface EnrollForm {
  name: string;
  email: string;
  phone: string;
}

type ModalStatus = 'idle' | 'loading' | 'success' | 'error';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function formatINR(amount: number) {
  return '₹' + amount.toLocaleString('en-IN');
}

function sessionsLabel(spw: SessionsPerWeek) {
  const total = spw * 4 * 3; // per week × 4 weeks × 3 months
  return `${spw}×/week · ${total} sessions`;
}

export default function EnrollPage() {
  const [classType, setClassType] = useState<ClassType>('individual');
  const [sessionsPerWeek, setSessionsPerWeek] = useState<SessionsPerWeek>(2);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [form, setForm] = useState<EnrollForm>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<EnrollForm>>({});
  const [modalStatus, setModalStatus] = useState<ModalStatus>('idle');
  const [razorpayReady, setRazorpayReady] = useState(false);

  // Load Razorpay checkout script
  useEffect(() => {
    if (document.getElementById('razorpay-script')) { setRazorpayReady(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedCourse(null);
    setForm({ name: '', email: '', phone: '' });
    setErrors({});
    setModalStatus('idle');
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  const validate = () => {
    const e: Partial<EnrollForm> = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!/^[+\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnrollForm]) {
      setErrors((prev) => { const n = { ...prev }; delete n[name as keyof EnrollForm]; return n; });
    }
  };

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!selectedCourse) return;

    setModalStatus('loading');

    const price = selectedCourse.pricing[classType][sessionsPerWeek];
    const orderPayload = {
      amount: price * 100, // paise
      currency: 'INR',
      receipt: `enroll_${selectedCourse.id}_${Date.now()}`,
      notes: {
        course: selectedCourse.title,
        classType,
        sessionsPerWeek,
        studentName: form.name,
        studentEmail: form.email,
        studentPhone: form.phone,
      },
    };

    let orderId: string;
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order creation failed');
      orderId = data.id;
    } catch {
      setModalStatus('error');
      return;
    }

    if (!razorpayReady) { setModalStatus('error'); return; }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: 'INR',
      name: 'Chaturangveda',
      description: `${selectedCourse.title} · ${classType === 'individual' ? 'Individual' : 'Group'} · ${sessionsPerWeek}×/week`,
      image: '/logo.png',
      order_id: orderId,
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          const vres = await fetch('/api/enroll/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              studentName: form.name,
              studentEmail: form.email,
              studentPhone: form.phone,
              course: selectedCourse.title,
              classType,
              sessionsPerWeek,
              amount: price,
            }),
          });
          if (!vres.ok) throw new Error('Verification failed');
          setModalStatus('success');
        } catch {
          setModalStatus('error');
        }
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: '#1565C0' },
      modal: {
        ondismiss: () => {
          if (modalStatus === 'loading') setModalStatus('idle');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setModalStatus('idle');
  };

  const selectedPrice = selectedCourse
    ? selectedCourse.pricing[classType][sessionsPerWeek]
    : 0;

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTag}>Course Enrollment</div>
        <h1 className={styles.heroTitle}>Choose Your Chess Course</h1>
        <p className={styles.heroSub}>
          Structured learning for all levels — from absolute beginners to FIDE-rated tournament players.
          All courses are 3-month bundles taught live by FIDE-rated coaches.
        </p>
      </section>

      {/* Config bar */}
      <div className={styles.configBar}>
        <div className={styles.configInner}>
          <div className={styles.configGroup}>
            <span className={styles.configLabel}>Class Type</span>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${classType === 'individual' ? styles.toggleActive : ''}`}
                onClick={() => setClassType('individual')}
              >
                Individual (1-on-1)
              </button>
              <button
                className={`${styles.toggleBtn} ${classType === 'group' ? styles.toggleActive : ''}`}
                onClick={() => setClassType('group')}
              >
                Group (4–6 Students)
              </button>
            </div>
          </div>

          <div className={styles.configGroup}>
            <span className={styles.configLabel}>Sessions / Week</span>
            <div className={styles.toggleGroup}>
              {([2, 3, 4] as SessionsPerWeek[]).map((n) => (
                <button
                  key={n}
                  className={`${styles.toggleBtn} ${sessionsPerWeek === n ? styles.toggleActive : ''}`}
                  onClick={() => setSessionsPerWeek(n)}
                >
                  {n}× / week
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className={styles.coursesSection}>
        <div className={styles.coursesGrid}>
          {courses.map((course) => {
            const price = course.pricing[classType][sessionsPerWeek];
            const totalSessions = sessionsPerWeek * 4 * 3;
            const perSession = Math.round(price / totalSessions);
            return (
              <div key={course.id} className={`${styles.courseCard} ${course.id === 'fide' ? styles.courseCardElite : ''}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{course.icon}</div>
                  <div>
                    <span className={styles.cardBadge} style={{ background: course.badgeColor }}>{course.badge}</span>
                    <h3 className={styles.cardTitle}>{course.title}</h3>
                    <p className={styles.cardSubtitle}>{course.subtitle}</p>
                  </div>
                </div>

                <p className={styles.cardOutcome}>{course.outcome}</p>

                <ul className={styles.topicsList}>
                  {course.topics.map((t) => (
                    <li key={t} className={styles.topicItem}>
                      <FaCheck className={styles.topicCheck} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.cardPricing}>
                  <div className={styles.priceMain}>
                    <span className={styles.priceAmount}>{formatINR(price)}</span>
                    <span className={styles.pricePeriod}>for 3 months</span>
                  </div>
                  <div className={styles.priceMeta}>
                    <span>{sessionsLabel(sessionsPerWeek)}</span>
                    <span className={styles.pricePerSession}>{formatINR(perSession)} / session</span>
                  </div>
                </div>

                <button
                  className={styles.enrollBtn}
                  onClick={() => setSelectedCourse(course)}
                >
                  Enroll in {course.title} →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note strip */}
      <div className={styles.noteStrip}>
        <div className={styles.noteInner}>
          <span className={styles.noteIcon}>♟</span>
          <span>All prices include live sessions, study material, and progress tracking. GST applicable.</span>
          <span className={styles.noteSep}>·</span>
          <span>Need a custom plan? <a href="/contact" className={styles.noteLink}>Contact us</a></span>
        </div>
      </div>

      {/* Enrollment Modal */}
      {selectedCourse && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close">
              <FaTimes />
            </button>

            {modalStatus === 'success' ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>Enrollment Confirmed!</h2>
                <p className={styles.successText}>
                  Welcome to Chaturangveda! A confirmation has been sent to <strong>{form.email}</strong>.
                  Our team will reach out within 24 hours to schedule your first session.
                </p>
                <button className={styles.successBtn} onClick={closeModal}>Done</button>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <span className={styles.modalIcon}>{selectedCourse.icon}</span>
                  <div>
                    <h2 className={styles.modalTitle}>Enroll in {selectedCourse.title}</h2>
                    <p className={styles.modalMeta}>
                      {classType === 'individual' ? 'Individual · 1-on-1' : 'Group · 4–6 Students'} &nbsp;·&nbsp; {sessionsPerWeek}× per week &nbsp;·&nbsp; 3 months
                    </p>
                  </div>
                </div>

                <div className={styles.modalPriceLine}>
                  <span className={styles.modalPrice}>{formatINR(selectedPrice)}</span>
                  <span className={styles.modalPriceNote}>total · {sessionsPerWeek * 4 * 3} sessions</span>
                </div>

                <form onSubmit={handleEnroll} className={styles.modalForm} noValidate>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel} htmlFor="m-name">Full Name <span className={styles.req}>*</span></label>
                    <div className={styles.modalInputWrap}>
                      <span className={styles.modalInputIcon}><FaUser /></span>
                      <input
                        id="m-name" name="name" type="text"
                        className={`${styles.modalInput} ${errors.name ? styles.modalInputErr : ''}`}
                        placeholder="Student's full name"
                        value={form.name} onChange={handleChange}
                      />
                    </div>
                    {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel} htmlFor="m-email">Email <span className={styles.req}>*</span></label>
                    <div className={styles.modalInputWrap}>
                      <span className={styles.modalInputIcon}><FaEnvelope /></span>
                      <input
                        id="m-email" name="email" type="email"
                        className={`${styles.modalInput} ${errors.email ? styles.modalInputErr : ''}`}
                        placeholder="your@email.com"
                        value={form.email} onChange={handleChange}
                      />
                    </div>
                    {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel} htmlFor="m-phone">Phone / WhatsApp <span className={styles.req}>*</span></label>
                    <div className={styles.modalInputWrap}>
                      <span className={styles.modalInputIcon}><FaMobileAlt /></span>
                      <input
                        id="m-phone" name="phone" type="tel"
                        className={`${styles.modalInput} ${errors.phone ? styles.modalInputErr : ''}`}
                        placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                    {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                  </div>

                  {modalStatus === 'error' && (
                    <div className={styles.errBanner}>
                      Payment failed or could not be verified. Please try again or contact us on WhatsApp.
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.payBtn}
                    disabled={modalStatus === 'loading'}
                  >
                    {modalStatus === 'loading' ? (
                      <><span className={styles.spinner} /> Processing…</>
                    ) : (
                      <><FaChessKnight /> Pay {formatINR(selectedPrice)} via Razorpay</>
                    )}
                  </button>

                  <p className={styles.modalFootNote}>
                    Secured by Razorpay · UPI, cards, net banking accepted · GST applicable
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
