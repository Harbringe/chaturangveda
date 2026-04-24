import mysql from 'mysql2/promise';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load .env.local manually since tsx does not auto-load it
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

const pool = mysql.createPool({
  uri: process.env.DB_CONN,
  waitForConnections: true,
  dateStrings: true,
});

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

const SRINIKA_POST = {
  slug: 'srinika-national-school-games-silver',
  title: 'Srinika Wins Silver at National School Games — U11 Chess Champion',
  excerpt:
    'Srinika, a proud Chaturangveda student, has won the Silver Medal at the 69th National School Games 2025-26 in the Under-11 Chess category, representing Karnataka on the national stage.',
  content: `<p>We are incredibly proud to share that Srinika, one of Chaturangveda's own, has won a <strong>Silver Medal</strong> at the <strong>69th National School Games 2025-26</strong> in the Under-11 Chess category. Competing as part of the Karnataka state team, Srinika delivered a remarkable performance against players from across the country to claim this prestigious honour.</p>

<p>The National School Games, organised under the aegis of the School Games Federation of India (SGFI), is one of India's most competitive scholastic sports platforms. Chess at the National School Games draws top young talents from every state — making a silver medal at the Under-11 level a truly exceptional achievement.</p>

<h2>Representing Karnataka</h2>
<p>Srinika earned her place on the Karnataka state team through consistent performances at the district and state selection rounds. The Karnataka contingent had strong representation across multiple chess categories — and Srinika's silver was a highlight of their campaign.</p>

<figure>
  <img src="/images/achievements/national_winner.png" alt="Srinika and the Karnataka chess team at the 69th National School Games" style="max-width:100%;border-radius:8px;margin:1.5rem 0" />
  <figcaption style="text-align:center;font-size:0.9rem;color:#666">The Karnataka team at the 69th National School Games 2025-26</figcaption>
</figure>

<h2>The Journey at Chaturangveda</h2>
<p>Srinika has been training at Chaturangveda under the guidance of our FIDE-rated coaches. Her progression through our curriculum — from mastering core tactical patterns to developing a solid tournament repertoire — laid the foundation for this achievement. The discipline, focus, and love for the game that she has shown in every session is what makes results like this possible.</p>

<blockquote>
  <p>"This is what we work towards with every student. Srinika's dedication in training sessions has always been exceptional. She brought that same focus to the national stage, and it showed."</p>
  <cite>— Manoj Reddy Maram, Head Coach, Chaturangveda</cite>
</blockquote>

<h2>What This Means</h2>
<p>A silver medal at the National School Games is not just a personal achievement — it is a milestone that opens doors. It places Srinika among the top Under-11 chess players in the country and marks her as a serious contender for even higher honours in the years ahead.</p>

<p>More than that, it sends a message to every student at Chaturangveda: with the right coaching, consistent training, and genuine love for the game, the national stage is within reach.</p>

<p>We cannot wait to see what Srinika achieves next. This is only the beginning.</p>

<p><em>Is your child ready to start their chess journey? <a href="/book-free-trial">Book a free trial class</a> with Chaturangveda today.</em></p>`,
  author: 'Manoj Reddy Maram',
  author_image: '/images/2025/02/ManojReddyMaram.jpg',
  date: '2026-04-10',
  image: '/images/achievements/national_winner_silver.png',
  category: 'Student Stories',
  tags: ['student achievement', 'national championship', 'u11', 'silver medal'],
  read_time: '4 min',
  featured: true,
  published: true,
};

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('Creating tables...');
    await conn.query(CREATE_POSTS);
    await conn.query(CREATE_SITE_CONTENT);
    console.log('Tables ready.');

    // Load existing posts from JSON
    const postsPath = join(process.cwd(), 'src', 'data', 'posts.json');
    const raw = readFileSync(postsPath, 'utf-8');
    const { posts } = JSON.parse(raw) as {
      posts: Array<{
        slug: string;
        title: string;
        excerpt?: string;
        content?: string;
        author?: string;
        authorImage?: string;
        date?: string;
        image?: string;
        category?: string;
        readTime?: string;
        featured?: boolean;
        published?: boolean;
      }>;
    };

    const allPosts = [SRINIKA_POST, ...posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? null,
      content: p.content ?? null,
      author: p.author ?? null,
      author_image: p.authorImage ?? null,
      date: p.date ?? null,
      image: p.image ?? null,
      category: p.category ?? null,
      tags: null as string[] | null,
      read_time: p.readTime ?? null,
      featured: p.featured ?? false,
      published: p.published ?? true,
    }))];

    let inserted = 0;
    for (const post of allPosts) {
      const [result] = await conn.query<mysql.ResultSetHeader>(
        `INSERT IGNORE INTO posts
           (slug, title, excerpt, content, author, author_image, date, image,
            category, tags, read_time, featured, published)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          post.slug, post.title, post.excerpt, post.content, post.author,
          post.author_image, post.date, post.image, post.category,
          post.tags ? JSON.stringify(post.tags) : null,
          post.read_time, post.featured ? 1 : 0, post.published ? 1 : 0,
        ]
      );
      if (result.affectedRows > 0) inserted++;
    }

    console.log(`Seeded ${inserted}/${allPosts.length} posts (skipped existing).`);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
