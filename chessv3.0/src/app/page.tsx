import dynamic from 'next/dynamic';
import { unstable_cache } from 'next/cache';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import JsonLd from '@/components/JsonLd';
import { getContent } from '@/lib/content';

const AnimatedTextBanner = dynamic(() => import('@/components/AnimatedTextBanner'));
const StatsSection       = dynamic(() => import('@/components/StatsSection'));
const FeaturesSection    = dynamic(() => import('@/components/FeaturesSection'));
const CoursesSection     = dynamic(() => import('@/components/CoursesSection'));
const BenefitsSection    = dynamic(() => import('@/components/BenefitsSection'));
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'));
const CTASection         = dynamic(() => import('@/components/CTASection'));
const Footer             = dynamic(() => import('@/components/Footer'));

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
  image: `${SITE_URL}/chaturangveda_logo.png`,
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

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does online chess coaching for kids cost in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At Chaturangveda, group chess classes start from ₹550 per session and private 1-on-1 coaching starts from ₹1,100 per session. A free 45-minute trial class is available at absolutely no cost, with no obligation to continue.',
      },
    },
    {
      '@type': 'Question',
      name: 'What age can children start online chess coaching?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Children from age 5 and above can join Chaturangveda. The Foundation level curriculum is designed to be engaging and age-appropriate for young learners, adapting to each child's pace and cognitive level.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are online chess classes effective for children?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Chaturangveda's online chess classes are conducted live via Zoom with FIDE-rated coaches. Over 2,000 students have been trained with 150+ tournament wins. Students across India, USA, UK, UAE, Australia and more participate successfully in national and international tournaments.",
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to learn chess with proper coaching?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "With Chaturangveda's structured 5-level curriculum, students progress from absolute beginner to FIDE-rated tournament readiness in approximately 21 months (attending 2–3 classes per week). Many students compete at district and state tournaments within 6–12 months of starting.",
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Chaturangveda different from other online chess coaching academies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chaturangveda offers FIDE-rated coaches, a structured 5-level curriculum from beginner to FIDE-rated level, small batch sizes (maximum 5 students per group), 10+ years of coaching experience, students in 9+ countries, and a completely free 45-minute trial class. The academy was founded in Hyderabad and has trained 2,000+ students with 150+ tournament wins.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a free chess trial class for my child?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit chaturangveda.in/book-free-trial or WhatsApp +91 75691 94709. The free trial is a full 45-minute live session with a FIDE-rated coach — includes level assessment, fundamentals coaching, and personalised feedback. Completely free with no obligation to continue.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer chess coaching in group or individual format?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Both formats are available. Group classes have a maximum of 5 students per batch, offering peer learning and healthy competition. Private 1-on-1 classes give your child 100% undivided coach attention with a fully customised curriculum and flexible scheduling. Both are available at all 5 curriculum levels.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can children outside India join Chaturangveda chess coaching?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Chaturangveda teaches students from India, USA, UK, UAE, Australia, Singapore, New Zealand, Netherlands, Canada and more. All classes are conducted online via Zoom, so children from any country with a stable internet connection can join.',
      },
    },
  ],
};

const getHomeData = unstable_cache(
  async () => Promise.all([
    getContent<Array<{ name: string; achievement: string; event?: string; year?: string; photo?: string; badge?: string; isKey?: boolean }>>('achievements', []),
    getContent<Array<{ parentName: string; childName?: string; quote: string; rating: number }>>('testimonials', []),
    getContent<{
      headline1?: string; headline2?: string; description?: string;
      phrases?: string[]; stats?: Array<{ value: string; label: string }>;
    } | null>('hero-settings', null),
  ]),
  ['home-page-data'],
  { revalidate: 300 }
);

const DEFAULT_PHRASES = [
  "Strategic Thinking", "Grandmaster Curriculum", "FIDE-Rated Coaches",
  "Tournament Champions", "Critical Thinkers", "Future Leaders",
];

const DEFAULT_HERO_STATS = [
  { value: "2000+", label: "Students Trained" },
  { value: "10+",   label: "Years Experience" },
  { value: "10",    label: "FIDE-Rated Coaches" },
  { value: "150+",  label: "Tournament Wins" },
];

export default async function Home() {
  const [achievements, testimonials, heroSettingsRaw] = await getHomeData();

  const mappedAchievements = achievements.length > 0
    ? achievements.map((a) => ({
        name: a.name,
        achievement: a.achievement,
        detail: [a.event, a.year].filter(Boolean).join(' · ') || a.achievement,
        image: a.photo ?? '',
        badge: a.badge ?? '',
      }))
    : undefined;

  const keyAch = achievements.find((a) => a.isKey);
  const mappedKeyAchievement = keyAch
    ? {
        name: keyAch.name,
        achievement: keyAch.achievement,
        detail: [keyAch.event, keyAch.year].filter(Boolean).join(' · ') || keyAch.achievement,
        image: keyAch.photo ?? '',
        badge: keyAch.badge ?? '',
      }
    : undefined;

  const heroSettings = heroSettingsRaw
    ? {
        headline1:   heroSettingsRaw.headline1,
        headline2:   heroSettingsRaw.headline2,
        description: heroSettingsRaw.description,
        phrases:     heroSettingsRaw.phrases?.length ? heroSettingsRaw.phrases : DEFAULT_PHRASES,
        stats:       heroSettingsRaw.stats?.length   ? heroSettingsRaw.stats   : DEFAULT_HERO_STATS,
      }
    : undefined;

  const mappedTestimonials = testimonials.length > 0
    ? testimonials.map((t) => ({
        text: t.quote,
        name: t.parentName,
        detail: t.childName ? `Parent of ${t.childName}` : 'Chess Parent',
        initials: t.parentName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        stars: t.rating,
      }))
    : undefined;

  const reviewCount = testimonials.length;
  const avgRating =
    reviewCount > 0
      ? Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / reviewCount) * 10) / 10
      : null;

  const dynamicOrganizationSchema = {
    ...organizationSchema,
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  return (
    <>
      <JsonLd data={dynamicOrganizationSchema} />
      <JsonLd data={coachesSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={homeFaqSchema} />
      <Navbar />
      <main>
        <HeroSection
          achievements={mappedAchievements}
          keyAchievement={mappedKeyAchievement}
          heroSettings={heroSettings}
        />
        <AnimatedTextBanner />
        <StatsSection />
        <FeaturesSection />
        <CoursesSection />
        <BenefitsSection />
        <TestimonialsSection testimonials={mappedTestimonials} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
