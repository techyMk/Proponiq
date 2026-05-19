import { Hero } from "@/components/sections/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { Features } from "@/components/sections/features";
import { DashboardPreview } from "@/components/sections/dashboard-preview";
import { Benefits } from "@/components/sections/benefits";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { CTABanner } from "@/components/sections/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <DashboardPreview />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTABanner />
    </>
  );
}
