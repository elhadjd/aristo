import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Category } from "@/types/common";

export function PopularCategories({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-muted-bg/60 py-20 sm:py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Explore"
            title="Popular categories"
            description="Start with the body style that fits your lifestyle."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.05}>
              <Link
                href={
                  category.slug === "electric"
                    ? "/inventory?fuel=Electric"
                    : `/inventory?bodyStyle=${encodeURIComponent(category.name.replace(/s$/, ""))}`
                }
                className="group relative block overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-display text-2xl">{category.name}</p>
                    <p className="mt-1 text-xs text-white/75">
                      {category.vehicleCount} available
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
