import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import FeaturesSectionAlt from '@/components/sections/FeaturesSectionAlt';
import ShowcaseSection from '@/components/sections/ShowcaseSection';
import CTASection from '@/components/sections/CTASection';
import Navigation from '@/components/ui/Navigation';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';

export default async function Home() {
  return (
    <>
      <Navigation />
      <ScrollProgressBar />
      <main>
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
            {/* <FeaturesSection /> */}
            <FeaturesSectionAlt />
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
