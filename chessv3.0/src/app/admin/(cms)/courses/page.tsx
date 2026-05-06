'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import SortableList from '../../components/SortableList';

interface Course {
  id: string;
  title: string;
  price: string;
  features: string;
  cta: string;
  highlighted: boolean;
}

const EMPTY: Omit<Course, 'id'> = {
  title: '', price: '', features: '', cta: '', highlighted: false,
};

export default function CoursesAdminPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/courses')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.value)) {
          setItems(d.value.map((c: Course & { features: string[] | string }) => ({
            ...c,
            features: Array.isArray(c.features) ? c.features.join('\n') : (c.features ?? ''),
          })));
        }
      });
  }, []);

  async function save(list: Course[]) {
    setSaving(true);
    setSaveError('');
    const toSave = list.map((c) => ({
      ...c,
      features: c.features.split('\n').map((f) => f.trim()).filter(Boolean),
    }));
    try {
      const res = await fetch('/api/admin/content/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: toSave }),
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
    const exists = items.find((c) => c.id === editing.id);
    const updated = exists
      ? items.map((c) => (c.id === editing.id ? editing : c))
      : [...items, editing];
    setItems(updated);
    save(updated);
    setEditing(null);
  }

  function deleteItem(id: string) {
    if (!confirm('Delete this course?')) return;
    const updated = items.filter((c) => c.id !== id);
    setItems(updated);
    save(updated);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Courses</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button
            onClick={() => setEditing({ id: Math.random().toString(36).slice(2), ...EMPTY })}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + Add Course
          </button>
        </div>
      </div>

      {editing && (
        <div className={styles.form} style={{ marginBottom: '2rem' }}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Title *</label>
              <input className={styles.input} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Price</label>
              <input className={styles.input} value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="₹2,000/month" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Features (one per line)</label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={editing.features}
              onChange={(e) => setEditing({ ...editing, features: e.target.value })}
              placeholder="Opening theory&#10;Endgame techniques&#10;Tournament preparation"
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>CTA Button Text</label>
              <input className={styles.input} value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} placeholder="Enroll Now" />
            </div>
            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="highlighted"
                checked={editing.highlighted}
                onChange={(e) => setEditing({ ...editing, highlighted: e.target.checked })}
              />
              <label htmlFor="highlighted" className={styles.label} style={{ marginBottom: 0, cursor: 'pointer' }}>
                Highlighted (featured card)
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={commitEdit} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Course'}
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
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>
              {item.title}
              {item.highlighted && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: '#004D99', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: 3 }}>Featured</span>}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>{item.price}</div>
          </div>
        )}
      />
    </div>
  );
}
