const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Chaturangveda',
  alternateName: ['Chaturangveda Chess Academy', 'Chaturangveda Online Chess'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 200,
    height: 200,
  },
  description:
    'Expert online chess coaching for kids by FIDE-rated coaches. Structured 5-level curriculum from beginner to FIDE-rated player. Students across India, USA, UK, UAE, Australia, New Zealand, Netherlands and more.',
  telephone: '+91-75691-94709',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '17.3850',
    longitude: '78.4867',
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'United States' },
    { '@type': 'Country', name: 'United Kingdom' },
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Country', name: 'Australia' },
    { '@type': 'Country', name: 'Singapore' },
    { '@type': 'Country', name: 'New Zealand' },
    { '@type': 'Country', name: 'Netherlands' },
    { '@type': 'Country', name: 'Canada' },
  ],
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
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  sameAs: ['https://wa.me/917569194709'],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Bank Transfer, UPI',
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
    'Chess curriculum development',
  ],
});

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}
