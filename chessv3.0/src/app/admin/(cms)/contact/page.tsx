'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';

interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  hours: string;
}

const DEFAULT: ContactInfo = {
  phone: '+91 75691 94709',
  whatsapp: 'https://wa.me/+917569194709',
  email: '',
  location: 'Hyderabad, India',
  hours: 'Mon–Sat, 9am–8pm IST',
};

export default function ContactAdminPage() {
  const [form, setForm] = useState<ContactInfo>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/contact')
      .then((r) => r.json())
      .then((d) => { if (d.value && typeof d.value === 'object') setForm({ ...DEFAULT, ...d.value }); });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/content/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: form }),
    });
    setSaving(false); setStatus('Saved'); setTimeout(() => setStatus(''), 2000);
  }

  const fields: (keyof ContactInfo)[] = ['phone', 'whatsapp', 'email', 'location', 'hours'];

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Contact Info</h1>
        {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
      </div>
      <form onSubmit={save} className={styles.form} style={{ maxWidth: 600 }}>
        {fields.map((field) => (
          <div key={field} className={styles.formGroup}>
            <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              className={styles.input}
              value={form[field]}
              onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
            />
          </div>
        ))}
        <div className={styles.formActions}>
          <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save Contact Info'}
          </button>
        </div>
      </form>
    </div>
  );
}
