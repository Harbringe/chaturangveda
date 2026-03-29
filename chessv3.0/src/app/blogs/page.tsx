'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  authorImage: string;
  featured: boolean;
  published: boolean;
};

const categories = ['All', 'Student Stories', 'Education', 'Coaching', 'Tips & Tricks', 'News'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function SkeletonFeatured() {
  return (
    <div className={styles.skeletonFeatured}>
      <div className={styles.skeletonFeaturedImage} />
      <div className={styles.skeletonFeaturedInfo}>
        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonFull}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonMid}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonFull}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonFull}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonCardImage} />
      <div className={styles.skeletonCardBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonFull}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonMid}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        const published = (data.posts as Post[]).filter((p) => p.published !== false);
        setPosts(published);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts. Please try again.');
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory);
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const countFor = (cat: string) =>
    cat === 'All' ? posts.length : posts.filter((p) => p.category === cat).length;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Chaturangveda Blog</h1>
            <p className={styles.pageSubtitle}>
              Student success stories, coaching insights, and chess wisdom from our team.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.categories}>
          {categories.map((cat) => {
            const count = countFor(cat);
            if (count === 0 && cat !== 'All') return null;
            return (
              <button
                key={cat}
                className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {!loading && (
                  <span className={styles.catCount}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className={styles.error}>
            <span>♟</span>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <>
            <SkeletonFeatured />
            <div className={styles.postsGrid}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>♟</span>
            <p>No posts in this category yet — check back soon!</p>
          </div>
        )}

        {!loading && !error && featured && (
          <Link href={`/blogs/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredImageWrap}>
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                style={{ objectFit: 'cover', objectPosition: 'top' }}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className={styles.featuredInfo}>
              <span className={styles.featuredLabel}>Featured</span>
              <span className={styles.postCategory}>{featured.category}</span>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <div className={styles.authorStrip}>
                {featured.authorImage && (
                  <div className={styles.authorAvatar}>
                    <Image
                      src={featured.authorImage}
                      alt={featured.author}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={styles.authorMeta}>
                  <span className={styles.authorName}>{featured.author}</span>
                  <span className={styles.authorDivider}>·</span>
                  <span className={styles.postDate}>{formatDate(featured.date)}</span>
                  <span className={styles.authorDivider}>·</span>
                  <span className={styles.postReadTime}>{featured.readTime} read</span>
                </div>
              </div>
              <span className={styles.readMore}>Read Story →</span>
            </div>
          </Link>
        )}

        {!loading && !error && rest.length > 0 && (
          <div className={styles.postsGrid}>
            {rest.map((post) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`} className={styles.postCard}>
                <div className={styles.postImageWrap}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.postImage}
                  />
                </div>
                <div className={styles.postBody}>
                  <span className={styles.postCategory}>{post.category}</span>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.authorStrip}>
                    {post.authorImage && (
                      <div className={styles.authorAvatar}>
                        <Image
                          src={post.authorImage}
                          alt={post.author}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.authorMeta}>
                      <span className={styles.authorName}>{post.author}</span>
                      <span className={styles.authorDivider}>·</span>
                      <span className={styles.postDate}>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
