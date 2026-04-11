'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../admin.module.css';

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}

export default function MarkdownEditor({ label, value, onChange, rows = 8 }: Props) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.2rem 0.6rem',
    fontSize: '0.72rem',
    borderRadius: 4,
    border: '1px solid',
    cursor: 'pointer',
    background: active ? '#004D99' : '#fff',
    color: active ? '#fff' : '#718096',
    borderColor: active ? '#004D99' : '#e2e8f0',
  });

  return (
    <div className={styles.formGroup}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <label className={styles.label}>{label}</label>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button type="button" style={tabStyle(mode === 'write')} onClick={() => setMode('write')}>Write</button>
          <button type="button" style={tabStyle(mode === 'preview')} onClick={() => setMode('preview')}>Preview</button>
        </div>
      </div>
      {mode === 'write' ? (
        <textarea
          className={styles.textarea}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
      ) : (
        <div className={styles.markdownPreview}>
          <ReactMarkdown>{value || '_Nothing to preview_'}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
