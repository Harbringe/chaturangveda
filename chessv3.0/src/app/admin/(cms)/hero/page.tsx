'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';

interface HeroStat { id: string; value: string; label: string; }

interface HeroSettings {
  headline1: string;
  headline2: string;
  description: string;
  phrases: Array<{ id: string; text: string }>;
  stats: HeroStat[];
}

const DEFAULTS: HeroSettings = {
  headline1: 'Master Chess.',
  headline2: 'Master Life.',
  description:
    "Expert chess coaching for kids by FIDE-rated coaches. From your child's first move to tournament glory — online classes for students across India, USA, UK, Australia, UAE, Netherlands and beyond.",
  phrases: [
    { id: '1', text: 'Strategic Thinking' },
    { id: '2', text: 'Grandmaster Curriculum' },
    { id: '3', text: 'FIDE-Rated Coaches' },
    { id: '4', text: 'Tournament Champions' },
    { id: '5', text: 'Critical Thinkers' },
    { id: '6', text: 'Future Leaders' },
  ],
  stats: [
    { id: '1', value: '2000+', label: 'Students Trained' },
    { id: '2', value: '10+',   label: 'Years Experience' },
    { id: '3', value: '10',    label: 'FIDE-Rated Coaches' },
    { id: '4', value: '150+',  label: 'Tournament Wins' },
  ],
};

export default function HeroSettingsAdminPage() {
  const [settings, setSettings] = useState<HeroSettings>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/hero-settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.value) {
          const loaded = { ...DEFAULTS, ...d.value };
          if (Array.isArray(d.value.phrases) && typeof d.value.phrases[0] === 'string') {
            loaded.phrases = d.value.phrases.map((text: string, i: number) => ({
              id: String(i + 1),
              text,
            }));
          }
          setSettings(loaded);
        }
      });
  }, []);

  async function save() {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/hero-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: {
            ...settings,
            phrases: settings.phrases.map((p) => p.text),
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      setStatus('Saved');
      setTimeout(() => setStatus(''), 2500);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function addPhrase() {
    setSettings((p) => ({
      ...p,
      phrases: [...p.phrases, { id: Math.random().toString(36).slice(2), text: '' }],
    }));
  }

  function updatePhrase(id: string, val: string) {
    setSettings((p) => ({
      ...p,
      phrases: p.phrases.map((ph) => (ph.id === id ? { ...ph, text: val } : ph)),
    }));
  }

  function removePhrase(id: string) {
    setSettings((p) => ({ ...p, phrases: p.phrases.filter((ph) => ph.id !== id) }));
  }

  function addStat() {
    setSettings((p) => ({
      ...p,
      stats: [...p.stats, { id: Math.random().toString(36).slice(2), value: '', label: '' }],
    }));
  }

  function updateStat(id: string, field: 'value' | 'label', val: string) {
    setSettings((p) => ({
      ...p,
      stats: p.stats.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    }));
  }

  function removeStat(id: string) {
    setSettings((p) => ({ ...p, stats: p.stats.filter((s) => s.id !== id) }));
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Hero Settings</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button onClick={save} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Headline */}
      <div className={styles.form} style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748', marginBottom: '1rem' }}>Headline</h2>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Line 1</label>
            <input
              className={styles.input}
              value={settings.headline1}
              onChange={(e) => setSettings((p) => ({ ...p, headline1: e.target.value }))}
              placeholder="Master Chess."
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Line 2 (highlighted)</label>
            <input
              className={styles.input}
              value={settings.headline2}
              onChange={(e) => setSettings((p) => ({ ...p, headline2: e.target.value }))}
              placeholder="Master Life."
            />
          </div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Description Paragraph</label>
          <textarea
            className={styles.textarea}
            value={settings.description}
            rows={3}
            onChange={(e) => setSettings((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
      </div>

      {/* Rotating Phrases */}
      <div className={styles.form} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748' }}>Rotating Phrases ("We Build → ___")</h2>
          <button onClick={addPhrase} className={`${styles.btn} ${styles.btnSecondary}`}>+ Add Phrase</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {settings.phrases.map((phrase) => (
            <div key={phrase.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                className={styles.input}
                value={phrase.text}
                onChange={(e) => updatePhrase(phrase.id, e.target.value)}
                placeholder="Strategic Thinking"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => removePhrase(phrase.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1.1rem', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.form}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d3748' }}>Hero Stats</h2>
          <button onClick={addStat} className={`${styles.btn} ${styles.btnSecondary}`}>+ Add Stat</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {settings.stats.map((stat) => (
            <div key={stat.id} className={styles.form} style={{ padding: '1rem', position: 'relative' }}>
              <button
                onClick={() => removeStat(stat.id)}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#c53030', fontSize: '1rem', lineHeight: 1 }}
              >
                ×
              </button>
              <div className={styles.formGroup}>
                <label className={styles.label}>Value</label>
                <input className={styles.input} value={stat.value} onChange={(e) => updateStat(stat.id, 'value', e.target.value)} placeholder="2000+" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Label</label>
                <input className={styles.input} value={stat.label} onChange={(e) => updateStat(stat.id, 'label', e.target.value)} placeholder="Students Trained" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
