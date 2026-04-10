'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './admin.module.css';

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();

    if (res.ok) {
      onChange(data.url);
    } else {
      setUploadError(data.error || 'Upload failed');
    }
    setUploading(false);
    // Reset so the same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>

      <div className={styles.imageUploadRow}>
        <input
          className={styles.input}
          style={{ flex: 1 }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
        />
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </div>

      {uploadError && <p className={styles.error}>{uploadError}</p>}

      {value && (
        <div className={styles.imagePreview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" />
        </div>
      )}
    </div>
  );
}
