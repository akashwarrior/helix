import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import NeuralSection from "@/components/NeuralSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";

export default async function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <div className="relative z-10 w-full">
        <Navigation />

        <div className="relative">
          <HeroSection />

          <NeuralSection />

          <FeaturesSection />

          <ShowcaseSection />

          <AboutSection />

          <CTASection />
        </div>
      </div>
    </main>
  );
}
