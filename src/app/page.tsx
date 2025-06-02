import Hero from "@/components/hero/Hero";
import TabsContainer from "@/components/hero/TabsContainer";
import Gallery from "@/components/gallery/Gallery";
import Features from "@/components/features/Features";
import Statistics from "@/components/features/Statistics";
import Testimonials from "@/components/testimonials/Testimonials";
import FAQ from "@/components/faq/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="px-6 py-2">
        <TabsContainer />
      </div>
      <Gallery />
      <Features />
      <Statistics />
      <Testimonials />
      <FAQ />
    </>
  );
}
