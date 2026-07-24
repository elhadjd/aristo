import { ShieldCheck, Sparkles, Timer, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const items = [
  {
    icon: Sparkles,
    title: "Curated inventory",
    description: "Every vehicle is selected for condition, provenance, and ownership experience.",
  },
  {
    icon: ShieldCheck,
    title: "Inspected with rigor",
    description: "Multi-point evaluations and transparent history summaries before delivery.",
  },
  {
    icon: Timer,
    title: "Streamlined buying",
    description: "From inquiry to keys—clear timelines, digital paperwork, and responsive specialists.",
  },
  {
    icon: BadgeCheck,
    title: "Ownership support",
    description: "Financing, trade-in, warranty, and delivery coordinated under one roof.",
  },
];

export function WhyAristo() {
  return (
    <section className="section-shell py-20 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="The ARISTO standard"
          title="Why choose ARISTO"
          description="Luxury dealership polish with marketplace transparency—built for discerning Ohio drivers."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
              <div className="inline-flex rounded-xl bg-muted-bg p-3 text-secondary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
