import { getDb } from './db';

export async function getContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = getDb();
    const { rows } = await db.query(
      'SELECT value FROM site_content WHERE key = $1',
      [key]
    );
    if (rows.length === 0) return fallback;
    return rows[0].value as T;
  } catch {
    return fallback;
  }
}

export async function setContent<T>(key: string, value: T): Promise<void> {
  const db = getDb();
  await db.query(
    `INSERT INTO site_content (key, value, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}
