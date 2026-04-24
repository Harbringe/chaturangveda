import mysql, { Pool, RowDataPacket } from 'mysql2/promise';

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    if (!process.env.DB_CONN) {
      console.error('DB_CONN missing in runtime');
      throw new Error('DB_CONN environment variable is not set. Check .env.local.');
    }
    try {
      const dbUrl = new URL(process.env.DB_CONN);
      console.log('Creating MySQL pool', {
        host: dbUrl.hostname,
        database: dbUrl.pathname.replace(/^\//, ''),
        user: dbUrl.username,
      });
    } catch (error) {
      console.error('Failed to parse DB_CONN', error);
    }
    pool = mysql.createPool({
      uri: process.env.DB_CONN,
      waitForConnections: true,
      connectionLimit: 10,
      dateStrings: true,
    });
  }
  return pool;
}

export interface Post {
  id?: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  author?: string;
  authorImage?: string;
  date?: string;
  image?: string;
  category?: string;
  tags?: string[];
  readTime?: string;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
}

export function rowToPost(row: RowDataPacket): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    author: row.author ?? undefined,
    authorImage: row.author_image ?? undefined,
    date: row.date ? String(row.date).split('T')[0] : undefined,
    image: row.image ?? undefined,
    category: row.category ?? undefined,
    tags: row.tags ?? [],
    readTime: row.read_time ?? undefined,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    created_at: row.created_at ?? undefined,
  };
}
