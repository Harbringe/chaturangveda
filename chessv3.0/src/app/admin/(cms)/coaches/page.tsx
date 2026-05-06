'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import ImageUpload from '../../ImageUpload';
import FocusGrid, { FocusPosition } from '../../components/FocusGrid';
import MarkdownEditor from '../../components/MarkdownEditor';
import SortableList from '../../components/SortableList';

interface Coach {
  id: string;
  name: string;
  title: string;
  fideRating: string;
  experience: string;
  specialties: string;
  bio: string;
  photo: string;
  photoFocus: FocusPosition;
}

const EMPTY: Omit<Coach, 'id'> = {
  name: '', title: '', fideRating: '', experience: '',
  specialties: '', bio: '', photo: '', photoFocus: 'center center',
};

export default function CoachesAdminPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [editing, setEditing] = useState<Coach | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/coaches')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.value)) setCoaches(d.value); });
  }, []);

  async function save(list: Coach[]) {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/coaches', {
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
    const exists = coaches.find((c) => c.id === editing.id);
    const updated = exists
      ? coaches.map((c) => (c.id === editing.id ? editing : c))
      : [...coaches, editing];
    setCoaches(updated);
    save(updated);
    setEditing(null);
  }

  function deleteCoach(id: string) {
    if (!confirm('Delete this coach?')) return;
    const updated = coaches.filter((c) => c.id !== id);
    setCoaches(updated);
    save(updated);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Coaches</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button
            onClick={() => setEditing({ id: Math.random().toString(36).slice(2), ...EMPTY })}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + Add Coach
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
                  <label className={styles.label}>Full Name *</label>
                  <input className={styles.input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title / Role</label>
                  <input className={styles.input} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>FIDE Rating</label>
                  <input className={styles.input} value={editing.fideRating} onChange={(e) => setEditing({ ...editing, fideRating: e.target.value })} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Experience</label>
                  <input className={styles.input} value={editing.experience} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} placeholder="10+ years" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Specialties (comma separated)</label>
                <input className={styles.input} value={editing.specialties} onChange={(e) => setEditing({ ...editing, specialties: e.target.value })} />
              </div>
              <MarkdownEditor label="Bio" value={editing.bio} onChange={(v) => setEditing({ ...editing, bio: v })} rows={4} />
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={commitEdit} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Coach'}
            </button>
            <button onClick={() => setEditing(null)} className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</button>
          </div>
        </div>
      )}

      <SortableList
        items={coaches}
        onChange={(updated) => { setCoaches(updated); save(updated); }}
        onEdit={(coach) => setEditing(coach)}
        onDelete={deleteCoach}
        renderItem={(coach) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{coach.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>
              {coach.title}{coach.fideRating ? ` · FIDE ${coach.fideRating}` : ''}
            </div>
          </div>
        )}
      />
    </div>
  );
}
