'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';

interface Stat {
  id: string;
  number: string;
  label: string;
}

const EMPTY: Omit<Stat, 'id'> = { number: '', label: '' };

export default function StatsAdminPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/stats')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.value)) setStats(d.value); });
  }, []);

  function addStat() {
    setStats((prev) => [...prev, { id: Math.random().toString(36).slice(2), ...EMPTY }]);
  }

  function updateStat(id: string, field: keyof Omit<Stat, 'id'>, value: string) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function deleteStat(id: string) {
    setStats((prev) => prev.filter((s) => s.id !== id));
  }

  async function save() {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: stats }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      setStatus('Saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Stats</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button onClick={addStat} className={`${styles.btn} ${styles.btnSecondary}`}>+ Add Stat</button>
          <button onClick={save} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.form} style={{ padding: '1rem', position: 'relative' }}>
            <button
              onClick={() => deleteStat(stat.id)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1rem', lineHeight: 1 }}
            >
              ×
            </button>
            <div className={styles.formGroup}>
              <label className={styles.label}>Number</label>
              <input
                className={styles.input}
                value={stat.number}
                onChange={(e) => updateStat(stat.id, 'number', e.target.value)}
                placeholder="2000+"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Label</label>
              <input
                className={styles.input}
                value={stat.label}
                onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                placeholder="Students Trained"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
