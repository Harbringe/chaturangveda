/**
 * One-time migration: Render PostgreSQL → Hostinger MySQL
 * Run: npx tsx src/scripts/migrate-postgres-to-mysql.ts
 */

import { Pool as PgPool } from 'pg';
import mysql from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load .env.local
const envLocalPath = join(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  const lines = readFileSync(envLocalPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

const PG_CONN = 'postgresql://plant:JPv6v2YOv2UpomL7DNugGMzRyvudTouC@dpg-d7bui194tr6s73bbhhjg-a.singapore-postgres.render.com/chaturangaveda';
const MYSQL_CONN = process.env.DB_CONN!;

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
);
`;

const CREATE_SITE_CONTENT = `
CREATE TABLE IF NOT EXISTS site_content (
  \`key\`      VARCHAR(255) PRIMARY KEY,
  value        JSON NOT NULL,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

async function migrate() {
  const pg = new PgPool({ connectionString: PG_CONN, ssl: { rejectUnauthorized: false } });
  const my = await mysql.createPool({ uri: MYSQL_CONN, waitForConnections: true, dateStrings: true });

  const myConn = await my.getConnection();

  try {
    // Create tables
    console.log('Creating MySQL tables...');
    await myConn.query(CREATE_POSTS);
    await myConn.query(CREATE_SITE_CONTENT);
    console.log('Tables ready.\n');

    // ── Migrate posts ──────────────────────────────────────────────
    const { rows: pgPosts } = await pg.query('SELECT * FROM posts ORDER BY id ASC');
    console.log(`Found ${pgPosts.length} posts in PostgreSQL.`);

    let postsDone = 0, postsSkipped = 0;
    for (const row of pgPosts) {
      const tags = Array.isArray(row.tags) ? JSON.stringify(row.tags) : null;
      const date = row.date ? String(row.date).split('T')[0] : null;

      const [result] = await myConn.query<mysql.ResultSetHeader>(
        `INSERT IGNORE INTO posts
           (slug, title, excerpt, content, author, author_image, date, image,
            category, tags, read_time, featured, published, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          row.slug, row.title, row.excerpt ?? null, row.content ?? null,
          row.author ?? null, row.author_image ?? null, date,
          row.image ?? null, row.category ?? null, tags,
          row.read_time ?? null, row.featured ? 1 : 0, row.published ? 1 : 0,
          row.created_at ? String(row.created_at).replace('T', ' ').split('.')[0] : null,
        ]
      );
      if (result.affectedRows > 0) { postsDone++; process.stdout.write('.'); }
      else { postsSkipped++; process.stdout.write('s'); }
    }
    console.log(`\nPosts: ${postsDone} migrated, ${postsSkipped} skipped (already exist).\n`);

    // ── Migrate site_content ───────────────────────────────────────
    let contentDone = 0, contentSkipped = 0;
    const pgContentExists = await pg.query(
      `SELECT to_regclass('public.site_content') AS t`
    );

    if (pgContentExists.rows[0].t) {
      const { rows: pgContent } = await pg.query('SELECT * FROM site_content');
      console.log(`Found ${pgContent.length} site_content rows in PostgreSQL.`);

      for (const row of pgContent) {
        const [result] = await myConn.query<mysql.ResultSetHeader>(
          `INSERT IGNORE INTO site_content (\`key\`, value, updated_at) VALUES (?, ?, ?)`,
          [row.key, JSON.stringify(row.value), row.updated_at ? String(row.updated_at).replace('T', ' ').split('.')[0] : null]
        );
        if (result.affectedRows > 0) contentDone++;
        else contentSkipped++;
      }
      console.log(`site_content: ${contentDone} migrated, ${contentSkipped} skipped.\n`);
    } else {
      console.log('No site_content table in PostgreSQL — skipping.\n');
    }

    console.log('Migration complete!');
  } finally {
    myConn.release();
    await my.end();
    await pg.end();
  }
}

migrate().catch((err) => {
  console.error('\nMigration failed:', err.message);
  process.exit(1);
});
