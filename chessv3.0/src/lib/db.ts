import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DB_CONN,
      ssl: { rejectUnauthorized: false },
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

/** Map a DB row (snake_case) to the Post interface (camelCase) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToPost(row: Record<string, any>): Post {
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
    featured: row.featured ?? false,
    published: row.published ?? true,
    created_at: row.created_at ?? undefined,
  };
}
