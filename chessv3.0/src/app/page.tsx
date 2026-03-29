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

export default function Home() {
  return (
    <>
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
