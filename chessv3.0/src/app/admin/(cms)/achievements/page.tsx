'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import ImageUpload from '../../ImageUpload';
import FocusGrid, { FocusPosition } from '../../components/FocusGrid';
import SortableList from '../../components/SortableList';

interface Achievement {
  id: string;
  name: string;
  achievement: string;
  event: string;
  year: string;
  photo: string;
  photoFocus: FocusPosition;
  badge: 'gold' | 'silver' | 'bronze' | '';
  isKey?: boolean;
}

const EMPTY: Omit<Achievement, 'id'> = {
  name: '', achievement: '', event: '', year: '',
  photo: '', photoFocus: 'center center', badge: '',
  isKey: false,
};

const BADGE_COLORS: Record<string, string> = {
  gold: '#f6c90e',
  silver: '#a8a8a8',
  bronze: '#cd7f32',
  '': '#e2e8f0',
};

export default function AchievementsAdminPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/achievements')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.value)) setItems(d.value); });
  }, []);

  async function save(list: Achievement[]) {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: list }),
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

  function commitEdit() {
    if (!editing) return;
    const exists = items.find((a) => a.id === editing.id);
    const updated = exists
      ? items.map((a) => (a.id === editing.id ? editing : a))
      : [...items, editing];
    setItems(updated);
    save(updated);
    setEditing(null);
  }

  function deleteItem(id: string) {
    if (!confirm('Delete this achievement?')) return;
    const updated = items.filter((a) => a.id !== id);
    setItems(updated);
    save(updated);
  }

  function setKeyAchievement(id: string) {
    const updated = items.map((a) => ({ ...a, isKey: a.id === id }));
    setItems(updated);
    save(updated);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Student Achievements</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button
            onClick={() => setEditing({ id: Math.random().toString(36).slice(2), ...EMPTY })}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + Add Achievement
          </button>
        </div>
      </div>

      {editing && (
        <div className={styles.form} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.5rem' }}>
            <div>
              <ImageUpload label="Photo" value={editing.photo} onChange={(url) => setEditing({ ...editing, photo: url })} />
              <div style={{ marginTop: '1rem' }}>
                <FocusGrid value={editing.photoFocus} onChange={(pos) => setEditing({ ...editing, photoFocus: pos })} />
              </div>
            </div>
            <div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Student Name *</label>
                  <input className={styles.input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Achievement</label>
                  <input className={styles.input} value={editing.achievement} onChange={(e) => setEditing({ ...editing, achievement: e.target.value })} placeholder="Silver Medal" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Event / Tournament</label>
                  <input className={styles.input} value={editing.event} onChange={(e) => setEditing({ ...editing, event: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Year</label>
                  <input className={styles.input} value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} placeholder="2024" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Badge</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['gold', 'silver', 'bronze', ''] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditing({ ...editing, badge: b })}
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: 4,
                        border: '2px solid',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: editing.badge === b ? BADGE_COLORS[b] : '#fff',
                        borderColor: BADGE_COLORS[b],
                        color: editing.badge === b ? '#fff' : '#718096',
                      }}
                    >
                      {b || 'None'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={commitEdit} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Achievement'}
            </button>
            <button onClick={() => setEditing(null)} className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</button>
          </div>
        </div>
      )}

      <SortableList
        items={items}
        onChange={(updated) => { setItems(updated); save(updated); }}
        onEdit={(item) => setEditing(item)}
        onDelete={deleteItem}
        renderItem={(item) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{item.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                {item.achievement}{item.event ? ` · ${item.event}` : ''}{item.year ? ` (${item.year})` : ''}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setKeyAchievement(item.id); }}
              style={{
                marginLeft: 'auto',
                padding: '3px 10px',
                borderRadius: 6,
                border: '1.5px solid',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700,
                background: item.isKey ? '#e9c349' : '#fff',
                borderColor: item.isKey ? '#e9c349' : '#e2e8f0',
                color: item.isKey ? '#241a00' : '#718096',
                whiteSpace: 'nowrap',
              }}
            >
              {item.isKey ? '★ Key Achievement' : '☆ Set as Key'}
            </button>
          </div>
        )}
      />
    </div>
  );
}
