import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

export const metadata: Metadata = {
  title: 'Chess Curriculum & Pricing — 5 Levels, Beginner to FIDE',
  description:
    'Structured 5-level chess curriculum designed by FIDE-rated coaches — Foundation, Level 1, Level 2, Level 3, and FIDE Prep. Individual and group classes available. Enroll online today.',
  keywords: [
    'chess curriculum for kids',
    'chess levels beginner to advanced',
    'FIDE prep chess course',
    'online chess course India',
    'chess lessons pricing',
    'structured chess program',
    'chess course online enroll',
    'chess beginner to tournament',
  ],
  alternates: {
    canonical: `${SITE_URL}/curriculum`,
  },
  openGraph: {
    title: 'Chess Curriculum — 5 Levels, Beginner to FIDE | Chaturangveda',
    description:
      'Five progressive levels from absolute beginner to international tournament play. Choose your level and enroll directly.',
    url: `${SITE_URL}/curriculum`,
    type: 'website',
  },
};

const ORG_ID = `${SITE_URL}/#organization`;

// Course list schema — helps AI engines answer "what courses does Chaturangveda offer?"
const coursesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Chaturangveda Chess Curriculum',
  description: 'Five progressive chess levels from beginner to FIDE-rated tournament preparation.',
  url: `${SITE_URL}/curriculum`,
  numberOfItems: 5,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Course',
        name: 'Foundation — Beginner Chess',
        description: 'Rules, piece movement, basic tactics, simple checkmates, and opening principles. Perfect for absolute beginners.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        coursePrerequisites: 'No prior chess knowledge required',
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: 'P3M',
          instructor: { '@type': 'Organization', '@id': ORG_ID },
        },
        teaches: ['Chess piece movement', 'Basic checkmates', 'Opening principles', 'Pawn structure'],
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Course',
        name: 'Level 1 — Elementary Chess',
        description: 'Piece coordination, tactical patterns (forks, pins, skewers), pawn endgames, and opening theory.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: 'P3M',
        },
        teaches: ['Tactical patterns', 'Pawn endgames', 'Opening theory', 'Tournament rules'],
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Course',
        name: 'Level 2 — Intermediate Chess',
        description: 'Advanced tactics, positional play, rook endgames, opening repertoire building, and first-tournament preparation.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: 'P4M',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Course',
        name: 'Level 3 — Advanced Chess',
        description: 'Complex middlegame strategy, advanced endgames, opening preparation, grandmaster game analysis, and district/state tournament preparation.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: 'P5M',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 5,
      item: {
        '@type': 'Course',
        name: 'Level 4 — Expert & FIDE Preparation',
        description: 'Full competitive repertoire, advanced endgame theory, psychological preparation, and FIDE-rated tournament readiness.',
        provider: { '@type': 'Organization', '@id': ORG_ID },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          duration: 'P6M',
        },
      },
    },
  ],
};

// FAQ schema — high AEO value, targets "people also ask" and AI answer boxes
const curriculumFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many levels are in the Chaturangveda chess curriculum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chaturangveda offers a 5-level chess curriculum: Foundation (beginner, 3 months), Level 1 (elementary, 3 months), Level 2 (intermediate, 4 months), Level 3 (advanced, 5 months), and Level 4 (expert/FIDE prep, 6 months). Total duration is approximately 21 months from absolute beginner to FIDE-rated readiness.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn chess with Chaturangveda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The complete 5-level curriculum takes approximately 21 months from absolute beginner to FIDE-rated tournament preparation. Students can start at any level based on their current skill. Many students compete at district and state tournaments within 6–12 months of starting.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between group and individual chess classes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Group classes have a maximum of 5 students per batch and offer peer learning and healthy competition. Individual (private 1-on-1) classes give your child 100% of the coach\'s attention with a fully customised curriculum. Both formats are available for all 5 curriculum levels. Individual classes are recommended for students with serious tournament goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'What age can children start learning chess at Chaturangveda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Children from age 5 and above can join Chaturangveda. The Foundation level is specifically designed to be engaging and age-appropriate for young learners. The curriculum adapts to each child\'s age group, learning pace, and cognitive level.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does chess coaching cost at Chaturangveda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricing depends on the class type (individual or group) and the number of sessions per week (2 or 3). Group sessions start from ₹550 per session and individual sessions from ₹1,100 per session. A free 45-minute trial class is available at zero cost with no obligation.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Curriculum & Pricing', item: `${SITE_URL}/curriculum` },
  ],
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={coursesSchema} />
      <JsonLd data={curriculumFaqSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
