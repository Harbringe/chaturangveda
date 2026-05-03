import type { Metadata } from "next";
import { Inter, Playfair_Display, Fraunces, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import OrganizationSchema from "@/components/OrganizationSchema";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chaturangveda.in';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Chaturangveda",
  title: {
    default: "Chaturangveda — Online Chess Coaching for Kids | FIDE-Rated Coaches",
    template: "%s | Chaturangveda",
  },
  description:
    "Expert online chess coaching for kids by FIDE-rated coaches. Structured curriculum from beginner to tournament level. Students across India, USA, UK, UAE, Australia & more. Book a free 45-min trial class today.",
  keywords: [
    "online chess coaching for kids",
    "chess classes for children",
    "FIDE rated chess coach",
    "chess coaching India",
    "online chess lessons kids",
    "chess coaching Hyderabad",
    "kids chess classes online",
    "chess for beginners kids",
    "tournament chess coaching",
    "chess coaching UAE",
    "chess coaching UK",
    "chess coaching Australia",
    "Chaturangveda",
    "chess coaching Singapore",
    "learn chess online children",
    "chess academy online",
    "chess for kids USA",
    "online chess school",
    "chess coaching for children India",
    "best chess coach online",
    "chess classes for kids online India",
    "chess tutor for kids",
    "chess coaching Bangalore",
    "chess coaching Mumbai",
    "chess coaching Delhi",
    "chess coaching Chennai",
    "chess coaching Pune",
    "chess training online",
    "chess lessons children",
    "private chess coach online",
    "group chess classes online",
    "FIDE chess coach India",
    "chess school online India",
    "chess coaching for beginners",
    "chess camp online",
  ],
  authors: [{ name: "Chaturangveda", url: SITE_URL }],
  creator: "Chaturangveda",
  publisher: "Chaturangveda",
  category: "Education",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: { url: '/chaturangveda_logo.png', type: 'image/png' },
    shortcut: '/favicon.svg',
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-IN': SITE_URL,
      'en-US': SITE_URL,
      'en-GB': SITE_URL,
      'en-AU': SITE_URL,
      'en-AE': SITE_URL,
      'en-SG': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "en_GB", "en_AU", "en_AE", "en_SG"],
    url: SITE_URL,
    siteName: "Chaturangveda",
    title: "Chaturangveda — Online Chess Coaching for Kids",
    description:
      "FIDE-rated coaches. Structured 5-level curriculum. Students in 9+ countries. Book your free trial class today.",
    images: [
      {
        url: "/chaturangveda_logo.png",
        width: 512,
        height: 512,
        alt: "Chaturangveda — Online Chess Coaching for Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaturangveda — Online Chess Coaching for Kids",
    description:
      "FIDE-rated coaches. Structured 5-level curriculum. Students in 9+ countries. Book your free trial class today.",
    images: ["/chaturangveda_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "23yurv9wtPV3WqP3IWvfNE0Ty7So8iAM-U0J-droOto",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${playfair.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <head>
        <OrganizationSchema />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
