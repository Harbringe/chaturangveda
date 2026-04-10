import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';
const ORG_ID = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  title: 'Our Chess Coaches — FIDE-Rated Instructors',
  description:
    'Meet the Chaturangveda coaching team — FIDE-rated and national-level chess coaches with 10+ years of experience. Head coach Manoj Reddy Maram leads a team of 4 expert instructors.',
  keywords: [
    'FIDE rated chess coach',
    'chess coach for kids online',
    'chess coaching team India',
    'Manoj Reddy Maram chess',
    'Chaturangveda coaches',
    'online chess instructor',
    'national level chess coach',
  ],
  alternates: {
    canonical: `${SITE_URL}/coaches`,
  },
  openGraph: {
    title: 'Our Chess Coaches — FIDE-Rated Team | Chaturangveda',
    description:
      'Meet our FIDE-rated and national-level coaches. 10+ years of combined experience, 100+ students trained.',
    url: `${SITE_URL}/coaches`,
    type: 'website',
  },
};

// Full Person schemas for each coach — key for GEO entity recognition
const coachesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Chaturangveda Coaching Team',
  url: `${SITE_URL}/coaches`,
  numberOfItems: 4,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#manoj-reddy-maram`,
        name: 'Manoj Reddy Maram',
        givenName: 'Manoj',
        familyName: 'Maram',
        jobTitle: 'Head Coach & Founder',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'FIDE-rated chess coach with over 10 years of playing experience. Founder of Chaturangveda Chess Academy. Has trained 100+ students from absolute beginner to national-level competition.',
        image: `${SITE_URL}/images/2025/02/ManojReddyMaram.jpg`,
        knowsAbout: ['Chess opening theory', 'Endgame technique', 'Tournament preparation', 'Chess tactics', 'Youth chess coaching'],
        nationality: 'IN',
        alumniOf: 'FIDE',
        award: 'FIDE Rating',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#uttham-naresh-patti`,
        name: 'Uttham Naresh Patti',
        jobTitle: 'Senior Coach',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'National-level chess player and senior coach at Chaturangveda with 10+ years of playing experience and 5+ years of coaching. Specialises in tactical play and youth chess development.',
        knowsAbout: ['Tactical play', 'Middlegame strategy', 'National level chess preparation', 'Youth chess coaching'],
        nationality: 'IN',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#rajdip`,
        name: 'Rajdip',
        jobTitle: 'Coach',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'State-level chess coach specialising in beginner curriculum and fun, engaging learning for young students.',
        knowsAbout: ['Beginner chess curriculum', 'State-level preparation', 'Fun learning for kids'],
        nationality: 'IN',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#subham-prasad`,
        name: 'Subham Prasad',
        jobTitle: 'Coach',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'Arena FIDE Master with 3+ years of coaching experience and international tournament wins. Specialises in tournament preparation, tactical patterns, and rated play.',
        knowsAbout: ['Tournament preparation', 'Tactical patterns', 'Opening systems', 'Rated play', 'International chess'],
        nationality: 'IN',
        award: 'Arena FIDE Master',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Our Coaches', item: `${SITE_URL}/coaches` },
  ],
};

export default function CoachesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={coachesSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
