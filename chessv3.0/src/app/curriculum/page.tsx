'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaUser, FaEnvelope, FaChessKnight, FaTimes } from 'react-icons/fa';

const countryCodes = [
  { code: 'IN', dial: '+91',  label: 'IN +91'  },
  { code: 'US', dial: '+1',   label: 'US +1'   },
  { code: 'GB', dial: '+44',  label: 'GB +44'  },
  { code: 'CA', dial: '+1',   label: 'CA +1'   },
  { code: 'AE', dial: '+971', label: 'AE +971' },
  { code: 'SG', dial: '+65',  label: 'SG +65'  },
  { code: 'AU', dial: '+61',  label: 'AU +61'  },
  { code: 'NZ', dial: '+64',  label: 'NZ +64'  },
  { code: 'NL', dial: '+31',  label: 'NL +31'  },
  { code: 'ZA', dial: '+27',  label: 'ZA +27'  },
  { code: 'MY', dial: '+60',  label: 'MY +60'  },
  { code: 'PK', dial: '+92',  label: 'PK +92'  },
  { code: 'BD', dial: '+880', label: 'BD +880' },
  { code: 'LK', dial: '+94',  label: 'LK +94'  },
  { code: 'NP', dial: '+977', label: 'NP +977' },
];
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

/* ─── Course Data ─── */
// perSessionRate (INR): individual | group
// baseSessions = monthsDuration × 4 weeks × 2 sessions/week (the 2×/week baseline)
const levels = [
  {
    num: '01',
    title: 'Foundation',
    subtitle: '8×8 Beginner',
    badge: 'Start Here',
    monthsDuration: 3,
    topics: [
      'Rules & how all pieces move',
      'Attack, defence & piece value',
      'Check, checkmate & stalemate',
      'Basic checkmates (K+Q, K+R)',
      'Opening principles & pawn structure',
    ],
    outcome: 'Play a complete game confidently, understand the board, and enter your first school or club tournament.',
    description: 'Perfect for absolute beginners who have never played chess before. We build a rock-solid foundation — piece movement, basic tactics, and essential endgames — so every concept clicks before the next one is introduced.',
    perSessionRate: { individual: 1100, group: 550 },
  },
  {
    num: '02',
    title: 'Level 1',
    subtitle: '8×8 Elementary',
    badge: 'Beginner+',
    monthsDuration: 3,
    topics: [
      'Piece coordination & exchanges',
      'Tactical patterns: forks, pins, skewers',
      'Simple pawn endgames',
      'Intro to opening theory',
      'Tournament rules & etiquette',
    ],
    outcome: 'Compete confidently in school and club-level tournaments and start building a personal opening repertoire.',
    description: 'For students who know the basics and are ready to think more deeply. This level sharpens tactical vision, introduces structured openings, and prepares you for your first rated game.',
    perSessionRate: { individual: 1100, group: 550 },
  },
  {
    num: '03',
    title: 'Level 2',
    subtitle: '8×8 Intermediate',
    badge: 'Intermediate',
    monthsDuration: 4,
    topics: [
      'Opening theory (common systems)',
      'Tactical motifs: discovered attacks, zwischenzug',
      'Basic endgame theory',
      'Middlegame strategy & planning',
      'Game analysis & self-review',
    ],
    outcome: 'Win district & state-level tournaments, analyse your own games, and consistently play accurate middlegames.',
    description: 'A pivotal level where chess becomes strategic. Students learn to make long-term plans, exploit weaknesses, and systematically study their own games to accelerate improvement.',
    perSessionRate: { individual: 1100, group: 550 },
  },
  {
    num: '04',
    title: 'Level 3',
    subtitle: '8×8 Advanced',
    badge: 'Advanced',
    monthsDuration: 5,
    topics: [
      'Advanced tactical combinations (3–5 moves)',
      'Piece activity & coordination',
      'Advanced attacking patterns',
      'Full endgame theory (rook, minor piece)',
      'Positional play & pawn structures',
    ],
    outcome: 'Compete at national level, achieve strong performance in rated events, and work concretely towards earning your FIDE rating.',
    description: 'For serious players aiming for national recognition. Sessions combine deep calculation drills, classic game study, and personalised game analysis to rapidly raise your playing level.',
    perSessionRate: { individual: 1100, group: 550 },
  },
  {
    num: '05',
    title: 'Level 4',
    subtitle: '8×8 Expert / FIDE Prep',
    badge: 'FIDE Prep',
    monthsDuration: 6,
    topics: [
      'Deep opening preparation & repertoire',
      'Master-level endgame strategies',
      'Advanced calculation & visualisation',
      'International tournament preparation',
      'Tournament psychology & clock management',
    ],
    outcome: 'Ace international tournaments, earn your FIDE rating, and have the tools to continue improving independently.',
    description: 'The elite track — personalised, intensive, and built around your tournament schedule. Every session is tailored: opening prep, game analysis, and mental game coaching to prepare you for the world stage.',
    perSessionRate: { individual: 1100, group: 550 },
  },
];

type ClassType = 'individual' | 'group';
type SessionsPerWeek = 2 | 3;

interface EnrollForm {
  name: string;
  email: string;
  countryCode: string;
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

function computePrice(level: typeof levels[0], classType: ClassType, spw: SessionsPerWeek) {
  const baseSessions = level.monthsDuration * 4 * 2; // 2×/week baseline
  const sessions = baseSessions * (spw / 2);
  return Math.round(sessions * level.perSessionRate[classType]);
}

function sessionCount(level: typeof levels[0], spw: SessionsPerWeek) {
  return level.monthsDuration * 4 * spw;
}

export default function CurriculumPage() {
  const [classType, setClassType] = useState<ClassType | null>(null);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<SessionsPerWeek | null>(null);
  const priceConfigured = classType !== null && sessionsPerWeek !== null;
  const [selectedLevel, setSelectedLevel] = useState<typeof levels[0] | null>(null);
  const [form, setForm] = useState<EnrollForm>({ name: '', email: '', countryCode: '+91', phone: '' });
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
    setSelectedLevel(null);
    setForm({ name: '', email: '', countryCode: '+91', phone: '' });
    setErrors({});
    setModalStatus('idle');
  }, []);

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
    else if (!/^\d{4,15}$/.test(form.phone.replace(/[\s\-()]/g, ''))) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!selectedLevel || !classType || !sessionsPerWeek) return;

    setModalStatus('loading');

    const price = computePrice(selectedLevel, classType, sessionsPerWeek);
    const orderPayload = {
      amount: price * 100,
      currency: 'INR',
      receipt: `enroll_${selectedLevel.num}_${Date.now()}`,
      notes: {
        course: selectedLevel.title,
        classType,
        sessionsPerWeek,
        studentName: form.name,
        studentEmail: form.email,
        studentPhone: `${form.countryCode}${form.phone}`,
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

    const classLabel = classType === 'individual' ? 'Individual (1-on-1)' : 'Group (4–6 Students)';

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: 'INR',
      name: 'Chaturangveda',
      description: `${selectedLevel.title} · ${classLabel} · ${sessionsPerWeek}×/week`,
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
              studentPhone: `${form.countryCode}${form.phone}`,
              course: selectedLevel.title,
              classType,
              sessionsPerWeek,
              totalSessions: sessionCount(selectedLevel, sessionsPerWeek),
              monthsDuration: selectedLevel.monthsDuration,
              amount: price,
            }),
          });
          if (!vres.ok) throw new Error('Verification failed');
          setModalStatus('success');
        } catch {
          setModalStatus('error');
        }
      },
      prefill: { name: form.name, email: form.email, contact: `${form.countryCode}${form.phone}` },
      theme: { color: '#1565C0' },
      modal: {
        ondismiss: () => { if (modalStatus === 'loading') setModalStatus('idle'); },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setModalStatus('idle');
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>Curriculum &amp; Enroll</div>
        <h1 className={styles.heroTitle}>Structured Path From Beginner to Champion</h1>
        <p className={styles.heroSub}>
          Designed by FIDE-rated coaches — five progressive levels from your first move to international tournament play.
          Choose your level, pick your schedule, and enroll directly below.
        </p>
      </section>

      {/* ─── Pricing Calculator ─── */}
      <div className={styles.pricingCalc}>
        <div className={styles.pricingCalcInner}>
          <div className={styles.pricingCalcHeading}>Configure Your Plan</div>
          <p className={styles.pricingCalcSub}>Choose your class type and session frequency to see pricing on each level below.</p>
          <div className={styles.pricingCalcDropdowns}>
            <div className={styles.calcField}>
              <label className={styles.calcLabel}>Class Type</label>
              <div className={styles.calcSelectWrap}>
                <select
                  className={styles.calcSelect}
                  value={classType || ''}
                  onChange={(e) => setClassType((e.target.value as ClassType) || null)}
                >
                  <option value="">Select type…</option>
                  <option value="individual">Individual (1-on-1)</option>
                  <option value="group">Group (4–6 Students)</option>
                </select>
              </div>
            </div>
            <div className={styles.calcField}>
              <label className={styles.calcLabel}>Sessions / Week</label>
              <div className={styles.calcSelectWrap}>
                <select
                  className={styles.calcSelect}
                  value={sessionsPerWeek || ''}
                  onChange={(e) => setSessionsPerWeek(e.target.value ? (Number(e.target.value) as SessionsPerWeek) : null)}
                >
                  <option value="">Select frequency…</option>
                  <option value="2">2× per week</option>
                  <option value="3">3× per week</option>
                </select>
              </div>
            </div>
          </div>
          {!priceConfigured && (
            <p className={styles.calcHint}>↓ Pricing will appear on each level card once you make your selection</p>
          )}
        </div>
      </div>

      {/* ─── Level Cards ─── */}
      <div className={styles.levelsSection}>
        <div className={styles.sectionLabel}>Learning Path</div>
        <h2 className={styles.sectionTitle}>8×8 Chess Academy — Five Levels, One Journey</h2>
        <p className={styles.sectionSubtitle}>
          Our curriculum follows a structured progression from absolute beginner to FIDE-rated player.
          Every level builds on the last — start anywhere that fits your current skill.
        </p>

        <div className={styles.levelsGrid}>
          {levels.map((level) => {
            const price = priceConfigured ? computePrice(level, classType!, sessionsPerWeek!) : null;
            const sessions = priceConfigured ? sessionCount(level, sessionsPerWeek!) : level.monthsDuration * 4 * 2;
            return (
              <div key={level.num} className={styles.levelCard}>
                <div className={styles.levelHeader}>
                  <div className={styles.levelNum}>{level.num}</div>
                  <span className={styles.levelBadge}>{level.badge}</span>
                </div>

                <div className={styles.levelTitle}>{level.title}</div>
                <div className={styles.levelSubtitle}>{level.subtitle}</div>
                <div className={styles.levelDuration}>
                  {level.monthsDuration} Months · {sessions} Sessions
                </div>

                <p className={styles.levelDescription}>{level.description}</p>

                <div className={styles.topicsLabel}>Topics Covered</div>
                <ul className={styles.topics}>
                  {level.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>

                <div className={styles.levelGoal}>
                  <div className={styles.levelGoalLabel}>Goal</div>
                  {level.outcome}
                </div>

                {priceConfigured && price !== null ? (
                  <div className={styles.cardPricing}>
                    <div className={styles.priceRow}>
                      <span className={styles.priceAmount}>{formatINR(price)}</span>
                      <span className={styles.pricePeriod}>for {level.monthsDuration} months</span>
                    </div>
                    <div className={styles.priceMeta}>
                      <span>{sessions} sessions · {sessionsPerWeek}×/week</span>
                      <span className={styles.pricePerSession}>{formatINR(Math.round(price / sessions))}/session</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.pricePlaceholder}>
                    Select your plan above to see pricing
                  </div>
                )}

                <button
                  className={styles.enrollBtn}
                  onClick={() => setSelectedLevel(level)}
                  disabled={!priceConfigured}
                >
                  {priceConfigured ? `Enroll in ${level.title} →` : 'Configure plan to enroll'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Availability ─── */}
      <div className={styles.scheduleSection}>
        <div className={styles.sectionLabel}>Availability</div>
        <h2 className={styles.sectionTitle}>Flexible Scheduling — Your Timezone, Your Time</h2>
        <p className={styles.scheduleTimezoneNote}>
          We serve students across <strong>all US timezones</strong> — Eastern, Central, Mountain, and Pacific —
          as well as India (IST), UK, UAE, Canada, Singapore, Australia, New Zealand, Netherlands, and beyond.
          Reach out and we&apos;ll find a batch that fits your schedule perfectly.
        </p>
        <div className={styles.timezoneChips}>
          {[
            'IST · India', 'EST · US East', 'CST · US Central', 'MST · US Mountain', 'PST · US West',
            'GMT · UK', 'UAE · Gulf', 'SGT · Singapore', 'AEST · Australia', 'NZST · New Zealand', 'CET · Netherlands',
          ].map((tz) => (
            <span key={tz} className={styles.timezoneChip}>{tz}</span>
          ))}
        </div>
        <p className={styles.scheduleNote}>
          Sessions include a recording. Private 1-on-1 sessions are fully flexible — <Link href="/contact">contact us</Link> to arrange your preferred slot.
        </p>
      </div>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Not Sure Where to Start?</h2>
          <p className={styles.ctaSub}>
            Book a free 45-minute trial class. Our coaches will assess your level and recommend the right course for you.
          </p>
          <a href="https://chaturangveda.wise.live/book/consultation" target="_blank" rel="noopener noreferrer" className="btn-primary">
            Book Free Trial
          </a>
        </div>
      </section>

      {/* ─── Enrollment Modal ─── */}
      {selectedLevel && (
        <div
          className={styles.overlay}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
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
                  <div>
                    <h2 className={styles.modalTitle}>Enroll — {selectedLevel.title}</h2>
                    <p className={styles.modalMeta}>
                      {classType === 'individual' ? 'Individual · 1-on-1' : 'Group · 4–6 Students'}
                      &nbsp;·&nbsp; {sessionsPerWeek}× per week
                      &nbsp;·&nbsp; {selectedLevel.monthsDuration} month{selectedLevel.monthsDuration > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className={styles.modalPriceLine}>
                  <span className={styles.modalPrice}>
                    {formatINR(computePrice(selectedLevel, classType, sessionsPerWeek))}
                  </span>
                  <span className={styles.modalPriceNote}>
                    · {sessionCount(selectedLevel, sessionsPerWeek)} sessions total
                  </span>
                </div>

                <form onSubmit={handleEnroll} className={styles.modalForm} noValidate>
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel} htmlFor="m-name">
                      Full Name <span className={styles.req}>*</span>
                    </label>
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
                    <label className={styles.modalLabel} htmlFor="m-email">
                      Email <span className={styles.req}>*</span>
                    </label>
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
                    <label className={styles.modalLabel} htmlFor="m-phone">
                      Phone / WhatsApp <span className={styles.req}>*</span>
                    </label>
                    <div className={`${styles.phoneWrap} ${errors.phone ? styles.phoneWrapErr : ''}`}>
                      <select
                        name="countryCode"
                        className={styles.countryCodeSelect}
                        value={form.countryCode}
                        onChange={handleChange}
                        aria-label="Country code"
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.dial}>{c.label}</option>
                        ))}
                      </select>
                      <input
                        id="m-phone" name="phone" type="tel"
                        className={styles.phoneInput}
                        placeholder="98765 43210"
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

                  <button type="submit" className={styles.payBtn} disabled={modalStatus === 'loading'}>
                    {modalStatus === 'loading' ? (
                      <><span className={styles.spinner} /> Processing…</>
                    ) : (
                      <><FaChessKnight /> Pay {formatINR(computePrice(selectedLevel, classType, sessionsPerWeek))} via Razorpay</>
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
