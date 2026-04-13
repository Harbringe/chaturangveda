'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import MarkdownEditor from '../../components/MarkdownEditor';

interface BecomeCoachContent {
  intro: string;
  requirements: string;
  perks: string;
}

const DEFAULT: BecomeCoachContent = { intro: '', requirements: '', perks: '' };

export default function BecomeCoachAdminPage() {
  const [form, setForm] = useState<BecomeCoachContent>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/become_coach')
      .then((r) => r.json())
      .then((d) => { if (d.value && typeof d.value === 'object') setForm({ ...DEFAULT, ...d.value }); });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/admin/content/become_coach', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: form }),
    });
    setSaving(false); setStatus('Saved'); setTimeout(() => setStatus(''), 2000);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Become a Coach</h1>
        {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
      </div>
      <form onSubmit={save} className={styles.form}>
        <MarkdownEditor label="Introduction / Hero text" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} rows={5} />
        <MarkdownEditor label="Requirements (markdown list)" value={form.requirements} onChange={(v) => setForm({ ...form, requirements: v })} rows={5} />
        <MarkdownEditor label="Perks / Benefits (markdown list)" value={form.perks} onChange={(v) => setForm({ ...form, perks: v })} rows={5} />
        <div className={styles.formActions}>
          <button type="submit" disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save Page Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
