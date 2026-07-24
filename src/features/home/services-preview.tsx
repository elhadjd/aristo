import Link from "next/link";
import {
  ArrowLeftRight,
  ClipboardCheck,
  CreditCard,
  Ship,
  Truck,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import type { DealershipService } from "@/types/common";
import { cn } from "@/utils/cn";

const iconMap = {
  CreditCard,
  Ship,
  ClipboardCheck,
  ShieldCheck,
  Wrench,
  ArrowLeftRight,
  Truck,
} as const;

export function ServicesPreview({ services }: { services: DealershipService[] }) {
  return (
    <section className="section-shell py-20 sm:py-24">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="Ownership"
            title="Services"
            description="Beyond the sale—financing, inspection, warranty, trade-in, and delivery."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/services" className={cn(buttonVariants({ variant: "outline" }))}>
            Explore services
          </Link>
        </Reveal>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.slice(0, 6).map((service, index) => {
          const Icon = iconMap[service.icon as keyof typeof iconMap] || Wrench;
          return (
            <Reveal key={service.id} delay={index * 0.05}>
              <Link
                href={`/services#${service.slug}`}
                className="block h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              >
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-display text-2xl">{service.name}</h3>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
