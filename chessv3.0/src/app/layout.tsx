import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  ],
  authors: [{ name: "Chaturangveda", url: SITE_URL }],
  creator: "Chaturangveda",
  publisher: "Chaturangveda",
  category: "Education",
  alternates: {
    canonical: SITE_URL,
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
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chaturangveda — Online Chess Coaching for Kids",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chaturangveda — Online Chess Coaching for Kids",
    description:
      "FIDE-rated coaches. Structured 5-level curriculum. Students in 9+ countries. Book your free trial class today.",
    images: ["/og-image.jpg"],
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
    // Add your Google Search Console verification token here
    // google: "YOUR_VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
