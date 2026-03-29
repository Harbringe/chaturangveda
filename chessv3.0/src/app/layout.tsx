import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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
  title: "Chaturangveda — New Era in Teaching Chess | Online Chess Coaching",
  description:
    "Chaturangveda offers world-class online chess coaching for kids. Grandmaster-designed curriculum, FIDE-rated trainers, interactive classes, and personalized progress tracking. Book a free demo today!",
  keywords: [
    "chess coaching",
    "online chess classes",
    "chess for kids",
    "FIDE rated trainers",
    "grandmaster curriculum",
    "learn chess online",
    "Chaturangveda",
  ],
  openGraph: {
    title: "Chaturangveda — New Era in Teaching Chess",
    description:
      "World-class online chess coaching for kids with grandmaster-designed curriculum and FIDE-rated trainers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
