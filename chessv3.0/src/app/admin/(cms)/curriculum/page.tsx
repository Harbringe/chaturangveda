'use client';

import { useState, useEffect } from 'react';
import styles from '../../admin.module.css';
import MarkdownEditor from '../../components/MarkdownEditor';
import SortableList from '../../components/SortableList';

interface CurriculumLevel {
  id: string;
  level: string;
  description: string;
  modules: string;
}

const EMPTY: Omit<CurriculumLevel, 'id'> = { level: '', description: '', modules: '' };

export default function CurriculumAdminPage() {
  const [items, setItems] = useState<CurriculumLevel[]>([]);
  const [editing, setEditing] = useState<CurriculumLevel | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetch('/api/admin/content/curriculum')
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.value)) setItems(d.value); });
  }, []);

  async function save(list: CurriculumLevel[]) {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/content/curriculum', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: list }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed');
      setStatus('Saved'); setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function commitEdit() {
    if (!editing) return;
    const exists = items.find((i) => i.id === editing.id);
    const updated = exists ? items.map((i) => (i.id === editing.id ? editing : i)) : [...items, editing];
    setItems(updated); save(updated); setEditing(null);
  }

  return (
    <div className={styles.adminContentInner}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Curriculum</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#276749' }}>{status}</span>}
          {saveError && <span style={{ fontSize: '0.85rem', color: '#c53030' }}>{saveError}</span>}
          <button
            onClick={() => setEditing({ id: Math.random().toString(36).slice(2), ...EMPTY })}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            + Add Level
          </button>
        </div>
      </div>

      {editing && (
        <div className={styles.form} style={{ marginBottom: '2rem' }}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Level Name *</label>
              <input className={styles.input} value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })} placeholder="Beginner" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Short Description</label>
              <input className={styles.input} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="For complete beginners aged 5+" />
            </div>
          </div>
          <MarkdownEditor
            label="Modules (markdown list)"
            value={editing.modules}
            onChange={(v) => setEditing({ ...editing, modules: v })}
            rows={6}
          />
          <div className={styles.formActions}>
            <button onClick={commitEdit} disabled={saving} className={`${styles.btn} ${styles.btnPrimary}`}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className={`${styles.btn} ${styles.btnSecondary}`}>Cancel</button>
          </div>
        </div>
      )}

      <SortableList
        items={items}
        onChange={(updated) => { setItems(updated); save(updated); }}
        onEdit={setEditing}
        onDelete={(id) => { const u = items.filter((i) => i.id !== id); setItems(u); save(u); }}
        renderItem={(item) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#2d3748' }}>{item.level}</div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>{item.description}</div>
          </div>
        )}
      />
    </div>
  );
}
