import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Brand } from "@/types/common";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  return (
    <section className="section-shell py-20 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Marques"
          title="Brands we represent"
          description="From German performance to American icons—discover your next signature vehicle."
          align="center"
        />
      </Reveal>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {brands.map((brand, index) => (
          <Reveal key={brand.id} delay={index * 0.03}>
            <Link
              href={`/inventory?brand=${encodeURIComponent(brand.name)}`}
              className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              {brand.name}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
