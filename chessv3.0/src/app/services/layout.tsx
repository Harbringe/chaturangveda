import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';
const ORG_ID = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  title: 'Chess Coaching Programs — Free Trial, Group & Private Classes',
  description:
    'Three flexible chess coaching programs for kids: a free 45-minute trial, small-group classes (max 5 students), and private 1-on-1 sessions. All taught by FIDE-rated coaches online.',
  keywords: [
    'online chess coaching programs',
    'chess group classes for kids',
    'private chess coaching online',
    'free chess trial class',
    'FIDE coach online lessons',
    'chess classes group vs private',
  ],
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: 'Chess Coaching Programs | Chaturangveda',
    description:
      'Free trial, group classes, and private 1-on-1 coaching — all with FIDE-rated coaches online.',
    url: `${SITE_URL}/services`,
    type: 'website',
  },
};

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Chaturangveda Chess Coaching Services',
  url: `${SITE_URL}/services`,
  numberOfItems: 3,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#free-trial`,
        name: 'Free Trial Chess Class',
        description: 'A full 45-minute free trial session with a FIDE-rated coach. Includes level assessment, fundamentals coaching, and personalised feedback. Completely free — no payment, no obligation.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        serviceType: 'Chess coaching trial',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/book-free-trial`,
        },
        serviceOutput: 'Level assessment report and personalised learning plan',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#group-classes`,
        name: 'Group Chess Classes',
        description: 'Small-group online chess coaching with a maximum of 5 students per batch. Includes opening theory, peer games, and monthly progress review. 2–3 sessions per week.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        serviceType: 'Group chess coaching',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/curriculum`,
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#private-coaching`,
        name: 'Private 1-on-1 Chess Coaching',
        description: 'Fully personalised chess coaching with 100% undivided coach attention. Custom curriculum, flexible scheduling, game analysis, and tournament preparation.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        serviceType: 'Private chess coaching',
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/curriculum`,
        },
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Programs', item: `${SITE_URL}/services` },
  ],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={servicesSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
