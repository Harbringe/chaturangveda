import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

export const metadata: Metadata = {
  title: 'Become a Chess Coach — Join Chaturangveda',
  description:
    'Are you a skilled chess player passionate about teaching? Join Chaturangveda as a coach. Competitive pay, flexible hours, and the chance to build the next generation of chess champions.',
  keywords: [
    'chess coach job online',
    'teach chess online',
    'chess coaching job India',
    'FIDE coach vacancy',
    'chess teacher online',
    'join chess coaching platform',
    'chess instructor job',
    'work from home chess coach',
  ],
  alternates: {
    canonical: `${SITE_URL}/become-a-coach`,
  },
  openGraph: {
    title: 'Become a Chess Coach | Chaturangveda',
    description:
      'Join our team of FIDE-rated coaches. Competitive pay, flexible schedule, and a chance to build champions.',
    url: `${SITE_URL}/become-a-coach`,
    type: 'website',
  },
};

const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Online Chess Coach',
  description: 'Chaturangveda is seeking skilled chess players passionate about teaching children. Join our team of FIDE-rated coaches to deliver online chess coaching to students across India, USA, UK, UAE, Australia, and other countries.',
  hiringOrganization: {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Chaturangveda',
    sameAs: SITE_URL,
  },
  jobLocationType: 'TELECOMMUTE',
  workHours: 'Flexible',
  employmentType: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'],
  applicantLocationRequirements: {
    '@type': 'Country',
    name: 'India',
  },
  skills: 'Chess, FIDE rating preferred, Teaching, Communication',
  qualifications: 'State-level or higher chess rating. Teaching experience preferred.',
  responsibilities: 'Deliver online chess coaching sessions, assess student progress, prepare students for tournaments.',
  url: `${SITE_URL}/become-a-coach`,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Become a Coach', item: `${SITE_URL}/become-a-coach` },
  ],
};

export default function BecomeACoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={jobPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
