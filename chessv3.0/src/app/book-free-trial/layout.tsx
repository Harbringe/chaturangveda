import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

export const metadata: Metadata = {
  title: 'Book a Free Trial Chess Class — 45 Minutes, Zero Cost',
  description:
    'Book a free 45-minute trial chess class for your child with a FIDE-rated coach. Level assessment, personalised feedback, and zero obligation. Available for students worldwide.',
  keywords: [
    'free chess trial class',
    'book chess lesson online',
    'free chess class for kids',
    'chess demo class India',
    'free chess coaching session',
    'chess trial class online',
    'book chess class for child',
    'free online chess lesson',
  ],
  alternates: {
    canonical: `${SITE_URL}/book-free-trial`,
  },
  openGraph: {
    title: 'Book a Free Trial Chess Class | Chaturangveda',
    description:
      'Free 45-minute session with a FIDE-rated coach. Level assessment + personalised plan. Zero cost, zero obligation.',
    url: `${SITE_URL}/book-free-trial`,
    type: 'website',
  },
};

const freeTrialFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the free trial chess class really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free. The 45-minute trial session with a FIDE-rated Chaturangveda coach costs nothing. No credit card required, no hidden fees, and no obligation to enroll afterward.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens in the free trial chess class?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 45-minute free trial includes: a level assessment to understand your child\'s current chess ability, a live coaching session covering fundamentals or the appropriate level, and personalised feedback from the coach including a recommended learning plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a free chess trial class with Chaturangveda?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit chaturangveda.in/book-free-trial, fill in your child\'s details (name, age, current chess level), and click "Open Booking Calendar" to choose a time slot. Alternatively, message us on WhatsApp at +91 75691 94709 to book directly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What age group is the free trial for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The free trial is available for children aged 5 and above. Adults are also welcome. The session is tailored to the student\'s current skill level — from complete beginner to experienced club player.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the free trial class online or in-person?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The trial class is conducted online via Zoom. Students can join from anywhere in the world — India, USA, UK, UAE, Australia, Singapore, New Zealand, Netherlands, Canada, and more. All you need is a device with a stable internet connection.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Book Free Trial', item: `${SITE_URL}/book-free-trial` },
  ],
};

export default function BookFreeTrialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={freeTrialFaqSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
