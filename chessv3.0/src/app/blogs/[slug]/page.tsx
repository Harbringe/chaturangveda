export const dynamic = 'force-dynamic';

import sanitizeHtml from 'sanitize-html';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { getDb, rowToPost } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import styles from './page.module.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imagePosition?: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  authorImage?: string;
  featured: boolean;
  published: boolean;
  content: string;
};

type Params = { params: Promise<{ slug: string }> };

async function getAllPosts(): Promise<Post[]> {
  const db = getDb();
  const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY ISNULL(date), date DESC');
  return rows.map(rowToPost) as Post[];
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Blog | Chaturangveda' };

  const description = post.excerpt;
  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${SITE_URL}/blogs/${slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Chaturangveda'],
      section: post.category,
      images: [{ url: `${SITE_URL}${post.image}`, alt: post.title, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const publishedPosts = posts.filter((p) => p.published !== false);
  const post = publishedPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = publishedPosts.indexOf(post);
  const prev = publishedPosts[idx - 1];
  const next = publishedPosts[idx + 1];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_URL}/blogs/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}${post.image}`,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: post.author || 'Chaturangveda',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Chaturangveda',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${post.slug}`,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blogs`,
      name: 'Chaturangveda Chess Blog',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'p:first-of-type'],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blogs` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blogs/${post.slug}` },
    ],
  };

  return (
    <div className={styles.page}>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Navbar />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.postMeta}>
            <span className={styles.postCategory}>{post.category}</span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>
          {post.author && (
            <div className={styles.heroAuthor}>
              {post.authorImage && (
                <div className={styles.heroAuthorAvatar}>
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="48px"
                  />
                </div>
              )}
              <span className={styles.heroAuthorName}>{post.author}</span>
            </div>
          )}
        </div>
      </section>

      <div className={styles.featuredImage}>
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: 'cover', objectPosition: post.imagePosition || 'center' }}
            sizes="100vw"
            priority
          />
        )}
      </div>

      <article className={styles.article}>
        <div
          className={styles.articleBody}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'details', 'summary']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'width', 'height', 'style'],
                '*': ['class', 'id', 'style'],
              },
            }),
          }}
        />

        <div className={styles.postNav}>
          {prev ? (
            <Link href={`/blogs/${prev.slug}`} className={styles.navLink}>
              <span className={styles.navDir}>&#8592; Previous</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/blogs/${next.slug}`} className={`${styles.navLink} ${styles.navLinkRight}`}>
              <span className={styles.navDir}>Next &#8594;</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          ) : <div />}
        </div>

        <div className={styles.postCta}>
          <h3 className={styles.postCtaTitle}>Inspired? Start Your Chess Journey Today.</h3>
          <p className={styles.postCtaSub}>Book a free 45-minute trial with a FIDE-rated coach. Zero obligation.</p>
          <Link href="/book-free-trial" className="btn-primary">Book Free Trial &#8594;</Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
