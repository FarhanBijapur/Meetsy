import { PricingTable } from "@clerk/nextjs";
import SectionHeading from "./section-heading";

export default function PricingSection() {
  return (
    <section className="section-container section-padding" id="pricing">
      <SectionHeading
        title="Simple, Transparent Pricing"
        description="Choose the plan that works best for you. Start free and upgrade as you grow."
      />
      <div className="max-w-6xl mx-auto">
        <PricingTable />
      </div>
    </section>
  );
}
