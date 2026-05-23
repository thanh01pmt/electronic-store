import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ValueMetrics } from "@/components/home/value-metrics";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyVichip } from "@/components/home/why-vichip";
import { Manufacturers } from "@/components/home/manufacturers";
import { RfqSection } from "@/components/home/rfq-section";

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-[#F3F5F7] min-h-screen">
      <Hero />
      <CategoryGrid />
      <ValueMetrics />
      <FeaturedProducts />
      <WhyVichip />
      <Manufacturers />
      <RfqSection />
    </div>
  );
}
