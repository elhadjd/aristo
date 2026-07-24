import Image from "next/image";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { StatsSection } from "@/features/home/stats";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn about ARISTO—a premium Columbus dealership focused on curated inventory and elevated ownership.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About ARISTO"
        description="A modern dealership experience built on transparency, taste, and trusted guidance."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
              alt="ARISTO dealership atmosphere"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-4xl">Crafted for discerning drivers</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              ARISTO was founded to bring boutique dealership standards to Columbus. We curate
              inventory through SISGESC, present clear pricing, and support every client through
              financing, trade-in, inspection, and delivery.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Visit us at {siteConfig.address.full} or connect by phone and WhatsApp at{" "}
              {siteConfig.phone}.
            </p>
          </div>
        </div>
      </section>
      <StatsSection />
    </>
  );
}
