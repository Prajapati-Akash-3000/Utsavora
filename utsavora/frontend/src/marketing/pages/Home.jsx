import { motion as Motion } from "framer-motion";
import HeroSection from "../../marketing/sections/HeroSection";
import SocialProofSection from "../../marketing/sections/SocialProofSection";
import FeatureSection from "../../marketing/sections/FeatureSection";
import CTASection from "../../marketing/sections/CTASection";
import HowItWorksSection from "../../marketing/sections/HowItWorksSection";
import PublicEventsSection from "../../marketing/sections/PublicEventsSection";
import TestimonialSection from "../../marketing/sections/TestimonialSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialProofSection />
      <FeatureSection />
      <HowItWorksSection />
      <PublicEventsSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
