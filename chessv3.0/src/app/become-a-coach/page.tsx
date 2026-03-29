'use client';

import { useState } from 'react';
import {
  FaMoneyBillWave, FaClock, FaChartLine,
  FaUser, FaMobileAlt, FaEnvelope, FaCalendarAlt,
  FaChessKnight, FaWhatsapp,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const perks = [
  { icon: <FaMoneyBillWave />, title: 'Competitive Pay', description: 'Attractive hourly rates with performance bonuses for student results.' },
  { icon: <FaClock />, title: 'Flexible Hours', description: 'Choose your availability — morning, evening, or weekend batches.' },
  { icon: <FaChartLine />, title: 'Grow With Us', description: 'Early coaches become senior coaches as the platform scales.' },
];

const requirements = [
  'Strong chess background (FIDE rating preferred)',
  'Passion for teaching and working with children',
  'Reliable internet connection and quiet space',
  'Ability to commit to a consistent weekly schedule',
  'Strong communication in English / Telugu / Hindi',
];

const experienceOptions = ['1–2 years', '3–5 years', '5–10 years', '10+ years'];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function BecomeACoachPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    experience: experienceOptions[0],
    rating: '',
    availability: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your full name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!/^[+\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const buildWhatsAppUrl = () => {
    const text = `Hi Chaturangveda! I'd like to apply as a coach.\n\nFull Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email || 'Not provided'}\nExperience: ${form.experience}\nFIDE Rating: ${form.rating || 'Not rated'}\nAvailability: ${form.availability || 'Flexible'}${form.message ? `\nAbout Me: ${form.message}` : ''}\n\nPlease review my application. Thank you!`;
    return `https://wa.me/+917569194709?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const res = await fetch('/api/coach-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStatus('success');
      window.open(buildWhatsAppUrl(), '_blank');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.successPage}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h1 className={styles.successTitle}>Application Sent!</h1>
            <p className={styles.successText}>
              WhatsApp has opened with your details. We&apos;ll review your application and get back to you within 2–3 business days.
              {form.email && <> A confirmation has also been sent to <strong>{form.email}</strong>.</>}
            </p>
            <div className={styles.successActions}>
              <a href="https://wa.me/+917569194709" target="_blank" rel="noopener noreferrer" className={`btn-primary ${styles.successBtn}`}>
                Open WhatsApp
              </a>
              <a href="/" className={`btn-secondary ${styles.successBtn}`}>Back to Home</a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>Join Our Team</div>
        <h1 className={styles.heroTitle}>Become a Chaturangveda Coach</h1>
        <p className={styles.heroSub}>
          Are you a skilled chess player with a passion for teaching? Join our team and help the next generation of champions grow.
        </p>
      </section>

      {/* Perks */}
      <div className={styles.perksSection}>
        <div className="container">
          <p className={styles.sectionLabel}>Why Join Us</p>
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <div className={styles.perksGrid}>
            {perks.map((perk) => (
              <div key={perk.title} className={styles.perkCard}>
                <div className={styles.perkIcon}>{perk.icon}</div>
                <div className={styles.perkTitle}>{perk.title}</div>
                <p className={styles.perkDesc}>{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main: requirements + form */}
      <div className={styles.mainContent}>
        <div className={styles.infoPanel}>
          <p className={styles.sectionLabel}>Requirements</p>
          <h2 className={styles.infoPanelTitle}>What We&apos;re Looking For</h2>
          <ul className={styles.requirementsList}>
            {requirements.map((req) => (
              <li key={req} className={styles.requirementItem}>
                <span className={styles.reqCheck}>✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
          <p className={styles.requirementsNote}>
            FIDE rating is preferred but not mandatory. Coaching ability and enthusiasm matter most.
          </p>
          <div className={styles.infoDivider} />
          <div className={styles.infoStats}>
            <div className={styles.infoStat}><span className={styles.infoStatNum}>100+</span><span className={styles.infoStatLabel}>Students to coach</span></div>
            <div className={styles.infoStat}><span className={styles.infoStatNum}>Flexible</span><span className={styles.infoStatLabel}>Your own schedule</span></div>
            <div className={styles.infoStat}><span className={styles.infoStatNum}>Online</span><span className={styles.infoStatLabel}>Work from anywhere</span></div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Apply Now</h2>
            <p className={styles.formSub}>Takes about 3 minutes to fill</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    id="name" name="name" type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder="Your full name"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">
                  Phone / WhatsApp <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>📱</span>
                  <input
                    id="phone" name="phone" type="tel"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    placeholder="+91 98765 43210"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email <span className={styles.optional}>(for confirmation)</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaEnvelope /></span>
                  <input
                    id="email" name="email" type="email"
                    className={styles.input}
                    placeholder="you@email.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="experience">
                  Years of Experience <span className={styles.required}>*</span>
                </label>
                <div className={styles.selectWrap}>
                  <span className={styles.inputIcon}>📅</span>
                  <select id="experience" name="experience" className={styles.select} value={form.experience} onChange={handleChange}>
                    {experienceOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="rating">
                  FIDE Rating <span className={styles.optional}>(if any)</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaChessKnight /></span>
                  <input
                    id="rating" name="rating" type="text"
                    className={styles.input}
                    placeholder="e.g. 1800"
                    value={form.rating} onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="availability">Availability</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>🕐</span>
                  <input
                    id="availability" name="availability" type="text"
                    className={styles.input}
                    placeholder="e.g. Weekday evenings, Saturdays…"
                    value={form.availability} onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">
                About You
                <span className={styles.charCount}>{form.message.length}/400</span>
              </label>
              <textarea
                id="message" name="message"
                className={styles.textarea}
                placeholder="Your chess background, tournament history, teaching experience, and coaching style…"
                maxLength={400}
                value={form.message} onChange={handleChange}
              />
            </div>

            {status === 'error' && (
              <div className={styles.errorBanner}>
                Something went wrong. Please try WhatsApp directly or refresh and try again.
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <><span className={styles.spinner} /> Sending Application…</>
              ) : (
                <>Submit Application →</>
              )}
            </button>

            <div className={styles.orDivider}><span>or</span></div>

            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className={styles.waBtn}>
              <span>💬</span> Apply directly via WhatsApp
            </a>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
