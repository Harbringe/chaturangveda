'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FaClock, FaChartBar, FaBan,
  FaUser, FaChild, FaBirthdayCake,
  FaEnvelope, FaChessKnight, FaWhatsapp, FaChevronDown, FaCheck,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const countryCodes = [
  { code: 'IN', dial: '+91', label: 'IN +91' },
  { code: 'US', dial: '+1',  label: 'US +1'  },
  { code: 'GB', dial: '+44', label: 'GB +44' },
  { code: 'CA', dial: '+1',  label: 'CA +1'  },
  { code: 'AE', dial: '+971',label: 'AE +971'},
  { code: 'SG', dial: '+65', label: 'SG +65' },
  { code: 'AU', dial: '+61', label: 'AU +61' },
  { code: 'NZ', dial: '+64', label: 'NZ +64' },
  { code: 'ZA', dial: '+27', label: 'ZA +27' },
  { code: 'MY', dial: '+60', label: 'MY +60' },
  { code: 'PK', dial: '+92', label: 'PK +92' },
  { code: 'BD', dial: '+880',label: 'BD +880'},
  { code: 'LK', dial: '+94', label: 'LK +94' },
  { code: 'NP', dial: '+977',label: 'NP +977'},
];

const whatsIncluded = [
  { icon: <FaClock />, text: 'Full 45-minute session with a FIDE-rated coach' },
  { icon: <FaChartBar />, text: 'Level assessment and personalised feedback report' },
  { icon: <FaWhatsapp />, text: 'Instant WhatsApp confirmation of your slot' },
  { icon: <FaBan />, text: 'Zero obligation to continue after the trial' },
];

const levelOptions = [
  'Absolute Beginner — never played',
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
    countryCode: '+91',
    phone: '',
    email: '',
    level: levelOptions[0],
    preferredTime: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [levelOpen, setLevelOpen] = useState(false);
  const levelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) {
        setLevelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.parentName.trim()) e.parentName = 'Please enter your name.';
    if (!form.childName.trim()) e.childName = "Please enter your child's name.";
    if (!form.childAge || Number(form.childAge) < 3 || Number(form.childAge) > 18) e.childAge = 'Enter a valid age (3–18).';
    if (!form.phone.trim()) e.phone = 'Please enter a WhatsApp number.';
    else if (!/^\d{4,15}$/.test(form.phone.replace(/[\s\-()]/g, ''))) e.phone = 'Enter a valid phone number.';
    if (!form.email.trim()) e.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const buildWhatsAppUrl = () => {
    const fullPhone = `${form.countryCode}${form.phone}`;
    const text = `Hi Chaturangveda! I'd like to book a FREE TRIAL class.\n\nParent/Guardian: ${form.parentName}\nChild's Name: ${form.childName}\nChild's Age: ${form.childAge}\nPhone: ${fullPhone}\nEmail: ${form.email}\nLevel: ${form.level}\nPreferred Time: ${form.preferredTime || 'Flexible'}${form.message ? `\nMessage: ${form.message}` : ''}\n\nPlease confirm my free trial slot. Thank you!`;
    return `https://wa.me/+917569194709?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: `${form.countryCode}${form.phone}` }),
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
                <div className={`${styles.phoneWrap} ${errors.phone ? styles.phoneWrapError : ''}`}>
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
                    id="phone" name="phone" type="tel"
                    className={styles.phoneInput}
                    placeholder="98765 43210"
                    value={form.phone} onChange={handleChange}
                  />
                </div>
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><FaEnvelope /></span>
                <input
                  id="email" name="email" type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@email.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Current Level</label>
              <div ref={levelRef} className={styles.customDropdown}>
                <button
                  type="button"
                  className={`${styles.dropdownTrigger} ${levelOpen ? styles.dropdownTriggerOpen : ''}`}
                  onClick={() => setLevelOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={levelOpen}
                >
                  <span className={styles.dropdownTriggerIcon}><FaChessKnight /></span>
                  <span className={styles.dropdownTriggerValue}>{form.level}</span>
                  <FaChevronDown className={`${styles.dropdownChevron} ${levelOpen ? styles.dropdownChevronOpen : ''}`} />
                </button>
                {levelOpen && (
                  <ul className={styles.dropdownMenu} role="listbox">
                    {levelOptions.map((opt) => (
                      <li
                        key={opt}
                        role="option"
                        aria-selected={form.level === opt}
                        className={`${styles.dropdownOption} ${form.level === opt ? styles.dropdownOptionActive : ''}`}
                        onClick={() => {
                          setForm((prev) => ({ ...prev, level: opt }));
                          setLevelOpen(false);
                        }}
                      >
                        <span className={styles.dropdownOptionText}>{opt}</span>
                        {form.level === opt && <FaCheck className={styles.dropdownOptionCheck} />}
                      </li>
                    ))}
                  </ul>
                )}
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
