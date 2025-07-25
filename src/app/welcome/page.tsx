import HeroSection from "@/components/welcome/sections/HeroSection";
import ProblemSection from "@/components/welcome/sections/ProblemSection";
import SolutionSection from "@/components/welcome/sections/SolutionSection";
import FeaturesSection from "@/components/welcome/sections/FeaturesSection";
import ShowcaseSection from "@/components/welcome/sections/ShowcaseSection";
import CTASection from "@/components/welcome/sections/CTASection";
import Navigation from "@/components/welcome/Navigation";
import ScrollProgressBar from "@/components/welcome/ScrollProgressBar";

export default async function Welcome() {
  return (
    <>
      <Navigation />
      <ScrollProgressBar />
      <main className="will-change-transform">
        <div className="relative z-10">
          <div id="hero">
            <HeroSection />
          </div>

          <div id="problem">
            <ProblemSection />
          </div>

          <div id="solution">
            <SolutionSection />
          </div>

          <div id="features">
            <FeaturesSection />
          </div>

          <div id="showcase">
            <ShowcaseSection />
          </div>

          <div id="cta">
            <CTASection />
          </div>
        </div>
      </main>
    </>
  );
}
