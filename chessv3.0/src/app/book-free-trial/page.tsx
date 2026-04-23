'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FaClock, FaChartBar, FaBan, FaChessKnight,
  FaUser, FaChild, FaBirthdayCake, FaEnvelope,
  FaWhatsapp, FaChevronDown, FaCheck,
} from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const BOOKING_BASE = 'https://chaturangveda.wise.live/book/consultation';

// Wise.live (Zoho Bookings) pre-fill param names
// Multiple aliases sent simultaneously — whichever the platform reads will work
function buildBookingUrl(name: string, email: string, phone: string, country: string) {
  const p = new URLSearchParams({
    // Zoho Bookings standard
    customer_name:  name,
    customer_email: email,
    customer_phone: phone,
    customer_country: country,
    // Aliases some Wise.live versions use
    name,
    email,
    phone,
  });
  return `${BOOKING_BASE}?${p.toString()}`;
}

const countryCodes = [
  { code: 'IN',  dial: '+91',  label: 'IN +91'  },
  { code: 'US',  dial: '+1',   label: 'US +1'   },
  { code: 'GB',  dial: '+44',  label: 'GB +44'  },
  { code: 'CA',  dial: '+1',   label: 'CA +1'   },
  { code: 'AE',  dial: '+971', label: 'AE +971' },
  { code: 'SG',  dial: '+65',  label: 'SG +65'  },
  { code: 'AU',  dial: '+61',  label: 'AU +61'  },
  { code: 'NZ',  dial: '+64',  label: 'NZ +64'  },
  { code: 'NL',  dial: '+31',  label: 'NL +31'  },
  { code: 'ZA',  dial: '+27',  label: 'ZA +27'  },
  { code: 'MY',  dial: '+60',  label: 'MY +60'  },
  { code: 'PK',  dial: '+92',  label: 'PK +92'  },
  { code: 'BD',  dial: '+880', label: 'BD +880' },
  { code: 'LK',  dial: '+94',  label: 'LK +94'  },
  { code: 'NP',  dial: '+977', label: 'NP +977' },
];

const levelOptions = [
  'Absolute Beginner — never played',
  'Casual — knows the rules',
  'Intermediate — plays regularly',
  'Tournament Player — competed before',
];

interface Form {
  parentName: string;
  childName: string;
  childAge: string;
  email: string;
  countryCode: string;
  phone: string;
  level: string;
  preferredTime: string;
  message: string;
}
type Errors = Partial<Record<keyof Form, string>>;
type Status = 'idle' | 'loading' | 'error';

const WHATSAPP_NUMBER = '917569194709';

export default function BookFreeTrial() {
  const [form, setForm] = useState<Form>({
    parentName: '',
    childName: '',
    childAge: '',
    email: '',
    countryCode: '+91',
    phone: '',
    level: '',
    preferredTime: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [levelOpen, setLevelOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const levelRef = useRef<HTMLDivElement>(null);

  // Close level dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) {
        setLevelOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof Form]) {
      setErrors((p) => { const n = { ...p }; delete n[name as keyof Form]; return n; });
    }
  };

  const selectLevel = (opt: string) => {
    setForm((p) => ({ ...p, level: opt }));
    setErrors((p) => { const n = { ...p }; delete n.level; return n; });
    setLevelOpen(false);
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.parentName.trim())  e.parentName  = 'Please enter your name.';
    if (!form.childName.trim())   e.childName   = "Please enter your child's name.";
    if (!form.childAge.trim())    e.childAge    = "Please enter your child's age.";
    if (!form.email.trim())       e.email       = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim())       e.phone       = 'Please enter your phone number.';
    else if (!/^\d{4,15}$/.test(form.phone.replace(/[\s\-()]/g, ''))) e.phone = 'Enter a valid phone number.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fullPhone = `${form.countryCode}${form.phone.replace(/[\s\-()]/g, '')}`;

    // Derive country label from selected dial code
    const countryEntry = countryCodes.find((c) => c.dial === form.countryCode);
    const country = countryEntry ? countryEntry.code : '';

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          parentName: form.parentName.trim(),
          childName: form.childName.trim(),
          email: form.email.trim(),
          phone: fullPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      setStatus('idle');
      window.open(buildBookingUrl(form.parentName.trim(), form.email.trim(), fullPhone, country), '_blank');
    } catch {
      setStatus('error');
    }
  };

  // WhatsApp fallback
  const handleWhatsApp = () => {
    const lines = [
      `*New Free Trial Request*`,
      `Parent: ${form.parentName || '—'}`,
      `Child: ${form.childName || '—'}, Age: ${form.childAge || '—'}`,
      `Email: ${form.email || '—'}`,
      `Phone: ${form.countryCode} ${form.phone || '—'}`,
      `Level: ${form.level || '—'}`,
      `Preferred Time: ${form.preferredTime || '—'}`,
      form.message ? `Message: ${form.message}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, '_blank');
  };

  const included = [
    { icon: <FaClock />,    text: 'Full 45-minute session with a FIDE-rated coach' },
    { icon: <FaChartBar />, text: 'Level assessment and personalised feedback report' },
    { icon: <FaChessKnight />, text: 'Custom learning plan built for your child' },
    { icon: <FaBan />,      text: 'Zero cost · Zero obligation to continue' },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroTag}>100% Free · Zero Obligation</div>
        <h1 className={styles.heroTitle}>Book Your Free Trial Class</h1>
        <p className={styles.heroSub}>
          Fill in your details below and we&apos;ll confirm your slot via WhatsApp within a few hours.
        </p>
      </section>

      <div className={styles.mainContent}>
        {/* ── Left info panel ── */}
        <aside className={styles.included}>
          <div className={styles.includedHeader}>
            <span className={styles.includedBadge}>FREE</span>
            <span className={styles.includedTitle}>What&apos;s included</span>
          </div>
          <ul className={styles.includedList}>
            {included.map((item, i) => (
              <li key={i} className={styles.includedItem}>
                <span className={styles.includedIcon}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className={styles.includedDivider} />
          <div className={styles.includedQuote}>
            <span className={styles.quoteMarks}>&ldquo;</span>
            <p>
              My son went from not knowing the rules to winning his first school
              tournament in just 6 months. The coaches are phenomenal!
            </p>
          </div>
        </aside>

        {/* ── Form card ── */}
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Your Details</h2>
            <p className={styles.formSub}>
              Takes less than a minute. Our team will reach out to confirm your slot.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* Parent name + Child name */}
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

            {/* Child age + Email */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="childAge">
                  Child&apos;s Age <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><FaBirthdayCake /></span>
                  <input
                    id="childAge" name="childAge" type="number"
                    min="4" max="20"
                    className={`${styles.input} ${errors.childAge ? styles.inputError : ''}`}
                    placeholder="e.g. 8"
                    value={form.childAge} onChange={handleChange}
                  />
                </div>
                {errors.childAge && <span className={styles.error}>{errors.childAge}</span>}
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
                    placeholder="your@email.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            {/* Phone */}
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

            {/* Current Level — custom dropdown */}
            <div className={styles.field}>
              <label className={styles.label}>
                Current Level <span className={styles.optional}>(optional)</span>
              </label>
              <div className={styles.customDropdown} ref={levelRef}>
                <button
                  type="button"
                  className={`${styles.dropdownTrigger} ${levelOpen ? styles.dropdownTriggerOpen : ''}`}
                  onClick={() => setLevelOpen((o) => !o)}
                >
                  <span className={styles.dropdownTriggerIcon}><FaChessKnight /></span>
                  <span className={`${styles.dropdownTriggerValue} ${!form.level ? styles.dropdownPlaceholder : ''}`}>
                    {form.level || 'Select current level…'}
                  </span>
                  <FaChevronDown className={`${styles.dropdownChevron} ${levelOpen ? styles.dropdownChevronOpen : ''}`} />
                </button>
                {levelOpen && (
                  <ul className={styles.dropdownMenu}>
                    {levelOptions.map((opt) => (
                      <li
                        key={opt}
                        className={`${styles.dropdownOption} ${form.level === opt ? styles.dropdownOptionActive : ''}`}
                        onClick={() => selectLevel(opt)}
                      >
                        <span className={styles.dropdownOptionText}>{opt}</span>
                        {form.level === opt && <FaCheck className={styles.dropdownOptionCheck} />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Preferred time */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="preferredTime">
                Preferred Time <span className={styles.optional}>(optional)</span>
              </label>
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

            {/* Message */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="message">
                Anything else? <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="message" name="message"
                className={styles.textarea}
                placeholder="Questions or special requirements…"
                value={form.message} onChange={handleChange}
              />
            </div>

            {status === 'error' && (
              <div className={styles.errorBanner}>
                We could not send the details by email. Please try again or use WhatsApp instead.
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <><span className={styles.spinner} /> Sending Details...</>
              ) : (
                <>Open Booking Calendar →</>
              )}
            </button>

            <div className={styles.orDivider}>or</div>

            <button type="button" className={styles.waBtn} onClick={handleWhatsApp}>
              <FaWhatsapp style={{ color: '#25D366', fontSize: '1.1rem' }} />
              Message us on WhatsApp instead
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
