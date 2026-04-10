import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all crawlers, block internal routes
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // Explicitly allow major search engine AI crawlers (GEO / AEO)
      { userAgent: 'Googlebot',       allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini / AI Overviews
      { userAgent: 'Bingbot',         allow: '/' }, // Copilot
      { userAgent: 'GPTBot',          allow: '/' }, // ChatGPT
      { userAgent: 'ChatGPT-User',    allow: '/' },
      { userAgent: 'OAI-SearchBot',   allow: '/' }, // OpenAI SearchGPT
      { userAgent: 'anthropic-ai',    allow: '/' }, // Claude
      { userAgent: 'ClaudeBot',       allow: '/' },
      { userAgent: 'PerplexityBot',   allow: '/' }, // Perplexity
      { userAgent: 'Amazonbot',       allow: '/' }, // Alexa / Amazon AI
      { userAgent: 'Applebot',        allow: '/' }, // Siri / Apple AI
      { userAgent: 'Meta-ExternalAgent', allow: '/' }, // Meta AI
      { userAgent: 'facebookexternalhit', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
