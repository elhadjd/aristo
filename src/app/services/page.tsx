import Image from "next/image";
import {
  ArrowLeftRight,
  ClipboardCheck,
  CreditCard,
  Ship,
  Truck,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { listServices } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "ARISTO services include financing, vehicle import, inspection, warranty, maintenance, trade-in, and delivery.",
  path: "/services",
});

const iconMap = {
  CreditCard,
  Ship,
  ClipboardCheck,
  ShieldCheck,
  Wrench,
  ArrowLeftRight,
  Truck,
} as const;

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <>
      <PageHero
        title="Services"
        description="Loaded from SISGESC—ownership support designed around a premium buying experience."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
        <div className="space-y-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Wrench;
            return (
              <article
                key={service.id}
                id={service.slug}
                className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:grid-cols-[360px_1fr]"
              >
                <div className="relative min-h-56">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="inline-flex rounded-xl bg-muted-bg p-3 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-3xl">{service.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {service.longDescription}
                  </p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="rounded-xl bg-muted-bg px-3 py-2 text-sm">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
