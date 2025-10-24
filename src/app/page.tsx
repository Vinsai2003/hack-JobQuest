import { Banner } from "@/components/Banner";
import { BentoGrid } from "@/components/BentoGrid";
import FAQs from "@/components/FaqSection";
import { FeatureSection } from "@/components/FeatureSection";
import FeatureSectionTwo from "@/components/FeatureSectionTwo";
import { FeatureThree } from "@/components/FeatureThree";
import FooterSection from "@/components/FooterSection";
import { HeroHeader } from "@/components/header";
import HeroSection from "@/components/HeroSection";
import { TestimonialSection } from "@/components/TestimonialSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-violet-50">
      <Banner />
      <HeroHeader />
      <HeroSection />
      <FeatureSection />
      <FeatureSectionTwo />
      <BentoGrid />
      <FeatureThree />
      <TestimonialSection />
      <FAQs />
      <FooterSection />
    </div>
  );
}