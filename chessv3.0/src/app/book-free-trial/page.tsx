'use client';

import { useState } from 'react';
import {
  FaClock, FaChartBar, FaBan,
  FaUser, FaChild, FaBirthdayCake, FaMobileAlt,
  FaEnvelope, FaChessKnight, FaWhatsapp,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const whatsIncluded = [
  { icon: <FaClock />, text: 'Full 45-minute session with a FIDE-rated coach' },
  { icon: <FaChartBar />, text: 'Level assessment and personalised feedback report' },
  { icon: <FaWhatsapp />, text: 'Instant WhatsApp confirmation of your slot' },
  { icon: <FaBan />, text: 'Zero obligation to continue after the trial' },
];

const levelOptions = [
  'Complete Beginner — never played',
  'Casual — knows the rules',
  'Intermediate — plays regularly',
  'Tournament Player — competed before',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function BookFreeTrialPage() {
  const [form, setForm] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    phone: '',
    email: '',
    level: levelOptions[0],
    preferredTime: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.parentName.trim()) e.parentName = 'Please enter your name.';
    if (!form.childName.trim()) e.childName = "Please enter your child's name.";
    if (!form.childAge || Number(form.childAge) < 3 || Number(form.childAge) > 18) e.childAge = 'Enter a valid age (3–18).';
    if (!form.phone.trim()) e.phone = 'Please enter a WhatsApp number.';
    else if (!/^[+\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const buildWhatsAppUrl = () => {
    const text = `Hi Chaturangveda! I'd like to book a FREE TRIAL class.\n\nParent/Guardian: ${form.parentName}\nChild's Name: ${form.childName}\nChild's Age: ${form.childAge}\nPhone: ${form.phone}\nLevel: ${form.level}\nPreferred Time: ${form.preferredTime || 'Flexible'}${form.message ? `\nMessage: ${form.message}` : ''}\n\nPlease confirm my free trial slot. Thank you!`;
    return `https://wa.me/+917569194709?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setStatus('success');
      // Also open WhatsApp as backup
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
            <h1 className={styles.successTitle}>Request Sent!</h1>
            <p className={styles.successText}>
              WhatsApp has opened with your details. Our team will confirm your slot within a few hours.
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
        <div className={styles.heroChess}>♟</div>
        <div className={styles.heroTag}>100% Free · Zero Obligation</div>
        <h1 className={styles.heroTitle}>Book Your Free Trial Class</h1>
        <p className={styles.heroSub}>
          Fill in your details and we&apos;ll confirm your slot via WhatsApp within a few hours.
        </p>
      </section>

      <div className={styles.mainContent}>
        {/* Left panel */}
        <div className={styles.included}>
          <div className={styles.includedHeader}>
            <span className={styles.includedBadge}>FREE</span>
            <div className={styles.includedTitle}>What&apos;s Included</div>
          </div>
          <ul className={styles.includedList}>
            {whatsIncluded.map((item) => (
              <li key={item.text} className={styles.includedItem}>
                <span className={styles.includedIcon}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className={styles.includedDivider} />
          <div className={styles.includedQuote}>
            <span className={styles.quoteMarks}>&ldquo;</span>
            <p>Start with a free trial and our coaches will recommend the perfect program for your child.</p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Your Details</h2>
            <p className={styles.formSub}>Takes about 2 minutes to fill</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="parentName">
                  Parent / Guardian Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaUser /></span>
                  <input
                    id="parentName" name="parentName" type="text"
                    className={`${styles.input} ${errors.parentName ? styles.inputError : ''}`}
                    placeholder="Your name"
                    value={form.parentName} onChange={handleChange}
                  />
                </div>
                {errors.parentName && <span className={styles.error}>{errors.parentName}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="childName">
                  Child&apos;s Name <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaChild /></span>
                  <input
                    id="childName" name="childName" type="text"
                    className={`${styles.input} ${errors.childName ? styles.inputError : ''}`}
                    placeholder="Child's name"
                    value={form.childName} onChange={handleChange}
                  />
                </div>
                {errors.childName && <span className={styles.error}>{errors.childName}</span>}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="childAge">
                  Child&apos;s Age <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaBirthdayCake /></span>
                  <input
                    id="childAge" name="childAge" type="number"
                    className={`${styles.input} ${errors.childAge ? styles.inputError : ''}`}
                    placeholder="e.g. 8" min={3} max={18}
                    value={form.childAge} onChange={handleChange}
                  />
                </div>
                {errors.childAge && <span className={styles.error}>{errors.childAge}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">
                  WhatsApp Number <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaMobileAlt /></span>
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

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email <span className={styles.optional}>(optional — for confirmation)</span>
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
              <label className={styles.label} htmlFor="level">Current Level</label>
              <div className={styles.selectWrap}>
                <span className={styles.inputIcon}><FaChessKnight /></span>
                <select id="level" name="level" className={styles.select} value={form.level} onChange={handleChange}>
                  {levelOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="preferredTime">Preferred Time</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><FaClock /></span>
                <input
                  id="preferredTime" name="preferredTime" type="text"
                  className={styles.input}
                  placeholder="e.g. Weekday evenings, Saturday mornings…"
                  value={form.preferredTime} onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">
                Anything else?
                <span className={styles.charCount}>{form.message.length}/300</span>
              </label>
              <textarea
                id="message" name="message"
                className={styles.textarea}
                placeholder="Questions, special requirements, or anything you'd like us to know…"
                maxLength={300}
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
                <><span className={styles.spinner} /> Sending…</>
              ) : (
                <>Book Free Trial →</>
              )}
            </button>

            <div className={styles.orDivider}><span>or</span></div>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBtn}
            >
              <FaWhatsapp /> Book directly via WhatsApp
            </a>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
