import { getDb } from './db';
import { RowDataPacket } from 'mysql2/promise';

export async function getContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT value FROM site_content WHERE `key` = ?',
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
    `INSERT INTO site_content (\`key\`, value, updated_at)
     VALUES (?, ?, NOW())
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );
}
