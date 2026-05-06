/**
 * Copies the production DB (DB_CONN) into the Aiven test DB.
 * Run: npx tsx src/scripts/copy-to-test-db.ts
 */

import mysql, { RowDataPacket } from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const envLocalPath = join(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  for (const line of readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(k in process.env)) process.env[k] = v;
  }
}

const TEST_DB_URL = process.env.TEST_DB_CONN;
if (!TEST_DB_URL) throw new Error('TEST_DB_CONN is not set in .env.local');

const CREATE_POSTS = `
CREATE TABLE IF NOT EXISTS posts (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  slug         VARCHAR(500) UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  content      LONGTEXT,
  author       TEXT,
  author_image TEXT,
  date         DATE,
  image        TEXT,
  category     TEXT,
  tags         JSON,
  read_time    VARCHAR(50),
  featured     TINYINT(1) DEFAULT 0,
  published    TINYINT(1) DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

const CREATE_SITE_CONTENT = `
CREATE TABLE IF NOT EXISTS site_content (
  \`key\`    VARCHAR(255) PRIMARY KEY,
  value      JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

async function main() {
  if (!process.env.DB_CONN) throw new Error('DB_CONN not set in .env.local');

  console.log('Connecting to production DB…');
  const prod = mysql.createPool({ uri: process.env.DB_CONN, waitForConnections: true, dateStrings: true });

  console.log('Connecting to Aiven test DB…');
  const test = mysql.createPool({
    uri: TEST_DB_URL,
    waitForConnections: true,
    dateStrings: true,
    ssl: { rejectUnauthorized: false },
  });

  const prodConn = await prod.getConnection();
  const testConn = await test.getConnection();

  try {
    // ── schema ────────────────────────────────────────────────────────────────
    console.log('\nCreating tables in test DB…');
    await testConn.query(CREATE_POSTS);
    await testConn.query(CREATE_SITE_CONTENT);
    console.log('  ✓ posts, site_content');

    // ── posts ─────────────────────────────────────────────────────────────────
    console.log('\nCopying posts…');
    const [posts] = await prodConn.query<RowDataPacket[]>(
      'SELECT slug, title, excerpt, content, author, author_image, date, image, category, tags, read_time, featured, published, created_at FROM posts'
    );
    let postCount = 0;
    for (const p of posts) {
      const safeDate = p.date && p.date !== '0000-00-00' ? p.date : null;
      const safeCreatedAt = p.created_at && !p.created_at.startsWith('0000') ? p.created_at : null;
      await testConn.query(
        `INSERT INTO posts (slug, title, excerpt, content, author, author_image, date, image, category, tags, read_time, featured, published, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE
           title=VALUES(title), excerpt=VALUES(excerpt), content=VALUES(content),
           author=VALUES(author), author_image=VALUES(author_image), date=VALUES(date),
           image=VALUES(image), category=VALUES(category), tags=VALUES(tags),
           read_time=VALUES(read_time), featured=VALUES(featured), published=VALUES(published)`,
        [
          p.slug, p.title, p.excerpt, p.content, p.author, p.author_image,
          safeDate, p.image, p.category,
          typeof p.tags === 'string' ? p.tags : JSON.stringify(p.tags),
          p.read_time, p.featured, p.published, safeCreatedAt,
        ]
      );
      postCount++;
    }
    console.log(`  ✓ ${postCount} posts copied`);

    // ── site_content ──────────────────────────────────────────────────────────
    console.log('\nCopying site_content…');
    const [rows] = await prodConn.query<RowDataPacket[]>('SELECT `key`, value FROM site_content');
    let contentCount = 0;
    for (const r of rows) {
      await testConn.query(
        `INSERT INTO site_content (\`key\`, value, updated_at) VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE value=VALUES(value), updated_at=NOW()`,
        [r.key, typeof r.value === 'string' ? r.value : JSON.stringify(r.value)]
      );
      contentCount++;
    }
    console.log(`  ✓ ${contentCount} site_content rows copied`);

    console.log('\nDone! Test DB is now a replica of production.');
    console.log(`\nTo use the test DB, set DB_CONN in .env.local to:\n  ${TEST_DB_URL}?ssl-mode=REQUIRED`);
  } finally {
    prodConn.release();
    testConn.release();
    await prod.end();
    await test.end();
  }
}

main().catch((err) => {
  console.error('Copy failed:', err.message);
  process.exit(1);
});
