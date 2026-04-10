import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AnimatedTextBanner from '@/components/AnimatedTextBanner';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import CoursesSection from '@/components/CoursesSection';
import BenefitsSection from '@/components/BenefitsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const ORG_ID = `${SITE_URL}/#organization`;

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': ORG_ID,
  name: 'Chaturangveda',
  alternateName: ['Chaturangveda Chess Academy', 'Chaturangveda Online Chess'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 200,
    height: 200,
  },
  image: `${SITE_URL}/og-image.jpg`,
  description:
    'Expert online chess coaching for kids by FIDE-rated coaches. Structured 5-level curriculum from beginner to FIDE-rated player. Students across India, USA, UK, UAE, Australia, New Zealand, Netherlands and more.',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-75691-94709',
    contactType: 'customer service',
    areaServed: ['IN', 'US', 'GB', 'AE', 'SG', 'AU', 'NZ', 'NL', 'CA'],
    availableLanguage: ['English', 'Hindi', 'Telugu'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  },
  sameAs: [
    'https://wa.me/917569194709',
  ],
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 4,
  },
  knowsAbout: [
    'Chess coaching',
    'FIDE rated chess',
    'Tournament preparation',
    'Chess for children',
    'Online chess education',
    'Chess curriculum',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Chess Coaching Programs',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Free Trial Chess Class',
        price: '0',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/book-free-trial`,
        itemOffered: {
          '@type': 'Course',
          name: 'Free Trial Chess Class',
          description: 'Full 45-minute free trial session with a FIDE-rated coach. Level assessment, personalised feedback, zero cost and zero obligation.',
          provider: { '@type': 'Organization', '@id': ORG_ID },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            duration: 'PT45M',
          },
        },
      },
      {
        '@type': 'Offer',
        name: 'Group Chess Classes',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/curriculum`,
        itemOffered: {
          '@type': 'Course',
          name: 'Group Chess Classes',
          description: 'Small-group online chess coaching with a maximum of 5 students per batch. 2–3 sessions per week with FIDE-rated coaches.',
          provider: { '@type': 'Organization', '@id': ORG_ID },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: 'PT1H',
          },
        },
      },
      {
        '@type': 'Offer',
        name: 'Private 1-on-1 Chess Coaching',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/curriculum`,
        itemOffered: {
          '@type': 'Course',
          name: 'Private 1-on-1 Chess Coaching',
          description: 'Fully personalised online chess coaching with undivided coach attention. Custom curriculum, flexible scheduling, tournament preparation.',
          provider: { '@type': 'Organization', '@id': ORG_ID },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
          },
        },
      },
    ],
  },
};

// Coach Person schemas — helps AI engines identify authoritative entities
const coachesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Chaturangveda Chess Coaches',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#manoj-reddy-maram`,
        name: 'Manoj Reddy Maram',
        jobTitle: 'Head Coach & Founder',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'FIDE-rated chess coach with over 10 years of experience. Founder of Chaturangveda. Has trained 100+ students from beginner to national level.',
        knowsAbout: ['Chess opening theory', 'Endgame technique', 'Tournament preparation', 'Chess tactics'],
        image: `${SITE_URL}/images/2025/02/ManojReddyMaram.jpg`,
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
        description: 'National-level chess player and senior coach at Chaturangveda with 10+ years of playing experience and 5+ years of coaching.',
        knowsAbout: ['Tactical play', 'Middlegame strategy', 'National level chess preparation', 'Youth chess coaching'],
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Person',
        '@id': `${SITE_URL}/coaches#subham-prasad`,
        name: 'Subham Prasad',
        jobTitle: 'Coach',
        worksFor: { '@type': 'Organization', '@id': ORG_ID },
        description: 'Arena FIDE Master with 3+ years of coaching experience and international tournament wins.',
        knowsAbout: ['Tournament preparation', 'Tactical patterns', 'Opening systems', 'Rated play'],
      },
    },
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Chaturangveda',
  url: SITE_URL,
  publisher: { '@type': 'Organization', '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/blogs?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={coachesSchema} />
      <JsonLd data={websiteSchema} />
      <Navbar />
      <main>
        <HeroSection />
        <AnimatedTextBanner />
        <StatsSection />
        <FeaturesSection />
        <CoursesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
