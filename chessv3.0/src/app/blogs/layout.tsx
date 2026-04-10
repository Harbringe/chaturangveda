import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

export const metadata: Metadata = {
  title: 'Chess Blog — Student Stories, Tips & Coaching Insights',
  description:
    'Read student success stories, chess coaching tips, opening theory guides, and tournament preparation advice from the Chaturangveda coaches.',
  keywords: [
    'chess blog',
    'chess tips for kids',
    'chess student success stories',
    'chess coaching tips',
    'chess opening guide beginners',
    'chess tournament preparation',
    'chess benefits children',
    'online chess articles',
    'chess coaching India blog',
  ],
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
  openGraph: {
    title: 'Chess Blog — Stories & Insights | Chaturangveda',
    description:
      'Student success stories, chess coaching tips, and everything chess from the Chaturangveda team.',
    type: 'website',
    url: `${SITE_URL}/blogs`,
  },
};

const blogCollectionSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE_URL}/blogs`,
  name: 'Chaturangveda Chess Blog',
  description: 'Student success stories, chess coaching tips, opening theory guides, and tournament preparation advice.',
  url: `${SITE_URL}/blogs`,
  publisher: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Chaturangveda',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blogs` },
    ],
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={blogCollectionSchema} />
      {children}
    </>
  );
}
