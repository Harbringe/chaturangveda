'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import ImageUpload from '../../ImageUpload';
import SortableList from '../../components/SortableList';

interface Testimonial {
  id: string;
  parentName: string;
  childName: string;
  quote: string;
  rating: number;
  photo: string;
}

const EMPTY: Omit<Testimonial, 'id'> = {
  parentName: '', childName: '', quote: '', rating: 5, photo: '',
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/testimonials')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.value)) setItems(d.value); });
  }, []);

  async function save(list: Testimonial[]) {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/testimonials', {
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
    const exists = items.find((t) => t.id === editing.id);
    const updated = exists
      ? items.map((t) => (t.id === editing.id ? editing : t))
      : [...items, editing];
    setItems(updated);
    save(updated);
    setEditing(null);
  }

  function deleteItem(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    const updated = items.filter((t) => t.id !== id);
    setItems(updated);
    save(updated);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Testimonials</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button
            onClick={() => setEditing({ id: Math.random().toString(36).slice(2), ...EMPTY })}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      {editing && (
        <div className={styles.form} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1.5rem' }}>
            <ImageUpload label="Photo" value={editing.photo} onChange={(url) => setEditing({ ...editing, photo: url })} />
            <div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Parent Name *</label>
                  <input className={styles.input} value={editing.parentName} onChange={(e) => setEditing({ ...editing, parentName: e.target.value })} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Child Name</label>
                  <input className={styles.input} value={editing.childName} onChange={(e) => setEditing({ ...editing, childName: e.target.value })} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Quote *</label>
                <textarea className={styles.textarea} rows={3} value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Rating</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setEditing({ ...editing, rating: n })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: n <= editing.rating ? '#f6c90e' : '#e2e8f0' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formActions}>
            <button onClick={commitEdit} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>
              {saving ? 'Saving…' : 'Save Testimonial'}
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
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{item.parentName}</div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>
              {item.childName ? `Parent of ${item.childName} · ` : ''}{'★'.repeat(item.rating)}
            </div>
          </div>
        )}
      />
    </div>
  );
}
