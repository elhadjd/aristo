import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    step: "01",
    title: "Browse & shortlist",
    description: "Filter inventory by brand, price, mileage, and lifestyle fit.",
  },
  {
    step: "02",
    title: "Connect with sales",
    description: "Call, WhatsApp, or request a callback for pricing and availability.",
  },
  {
    step: "03",
    title: "Finance or trade",
    description: "Structure payments and apply trade equity with transparent terms.",
  },
  {
    step: "04",
    title: "Drive home",
    description: "Finalize paperwork and take delivery at the showroom or your door.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#111827] py-20 text-white sm:py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Simple process"
            title="How buying works"
            description="A refined path from first search to delivery day."
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-secondary">{item.step}</p>
                <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm text-white/70">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
