import { CtaSection } from "@/components/home/cta-section"
import { HeroSection } from "@/components/home/hero-section"

export default function Page() {
  return (
    <main>
      <HeroSection />
      {/* Other homepage sections (stats, featured jobs…) go here */}
      <CtaSection />
    </main>
  )
}
