const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Chaturangveda',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: ['https://wa.me/917569194709'],
});

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schema }}
    />
  );
}
