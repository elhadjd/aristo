import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/features/contact/contact-form";
import { LoanCalculator } from "@/features/financing/loan-calculator";
import { VehicleActions } from "@/features/vehicles/vehicle-actions";
import { VehicleCard } from "@/features/vehicles/vehicle-card";
import { VehicleGallery } from "@/features/vehicles/vehicle-gallery";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import { getVehicle, listRelated } from "@/lib/data";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  vehicleJsonLd,
  vehicleSeoDescription,
  vehicleSeoKeywords,
} from "@/lib/seo";
import { cn } from "@/utils/cn";
import { formatCurrency, formatMileage } from "@/utils/format";
import { estimateMonthlyPayment } from "@/utils/vehicles";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) {
    return buildMetadata({ title: "Vehicle not found", path: `/vehicles/${id}`, noIndex: true });
  }
  return buildMetadata({
    title: `${vehicle.year} ${vehicle.brand} ${vehicle.model} for Sale in Columbus, OH`,
    description: vehicleSeoDescription({
      name: vehicle.name,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      description: vehicle.description,
    }),
    path: `/vehicles/${vehicle.id}`,
    image: vehicle.images[0],
    keywords: vehicleSeoKeywords({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      bodyStyle: vehicle.bodyStyle,
    }),
  });
}

export default async function VehicleDetailsPage({ params }: Params) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const related = await listRelated(vehicle.id, 3);
  const monthly = estimateMonthlyPayment(vehicle.price, 5000, 4.9, 60);
  const path = `/vehicles/${vehicle.id}`;

  return (
    <>
      <JsonLd
        data={[
          vehicleJsonLd({
            ...vehicle,
            url: absoluteUrl(path),
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Inventory", path: "/inventory" },
            { name: vehicle.name, path },
          ]),
        ]}
      />
      <section className="section-shell pt-28 pb-16 sm:pt-32">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Inventory", href: "/inventory" },
            { label: vehicle.name },
          ]}
        />
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <VehicleGallery images={vehicle.images} name={vehicle.name} />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{vehicle.brand}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">{vehicle.name}</h1>
            <p className="mt-4 font-display text-3xl text-secondary">
              {formatCurrency(vehicle.price)}
            </p>
            <p className="mt-2 text-sm text-muted">
              Est. {formatCurrency(monthly)}/mo with $5,000 down
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Spec label="Year" value={String(vehicle.year)} />
              <Spec label="Mileage" value={formatMileage(vehicle.mileage)} />
              <Spec label="Fuel" value={vehicle.fuel} />
              <Spec label="Transmission" value={vehicle.transmission} />
              <Spec label="Drivetrain" value={vehicle.driveType} />
              <Spec label="Body" value={vehicle.bodyStyle} />
              <Spec label="Color" value={vehicle.color} />
              <Spec label="Condition" value={vehicle.condition} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={siteConfig.phoneHref} className={cn(buttonVariants({ variant: "secondary" }))}>
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a
                href={`${siteConfig.whatsappHref}?text=${encodeURIComponent(`Hi Fellah Express LLC, I'm interested in the ${vehicle.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "whatsapp" }))}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
            <div className="mt-6">
              <VehicleActions id={vehicle.id} name={vehicle.name} />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Description</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{vehicle.description}</p>
            </section>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Specifications</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <Spec label="Engine" value={vehicle.engine} />
                <Spec label="Doors" value={String(vehicle.doors)} />
                <Spec label="VIN" value={vehicle.vin || "Available on request"} />
                <Spec
                  label="MPG"
                  value={
                    vehicle.mpgCity && vehicle.mpgHighway
                      ? `${vehicle.mpgCity} city / ${vehicle.mpgHighway} hwy`
                      : "—"
                  }
                />
              </dl>
            </section>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="text-sm text-muted">
                    • {feature}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Vehicle history</h2>
              <p className="mt-4 text-sm text-muted">
                Detailed history report placeholder — connect SISGESC / Carfax / AutoCheck for live
                title, accident, and service records.
              </p>
            </section>
          </div>
          <div className="space-y-6">
            <LoanCalculator defaultPrice={vehicle.price} />
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Dealer information</h2>
              <p className="mt-3 text-sm text-muted">{siteConfig.legalName}</p>
              <p className="mt-1 text-sm text-muted">{siteConfig.address.full}</p>
              <p className="mt-1 text-sm text-muted">{siteConfig.phone}</p>
              <Link href="/contact" className="mt-4 inline-block text-sm text-accent hover:underline">
                Get directions & hours
              </Link>
            </section>
            <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Inquire</h2>
              <div className="mt-4">
                <ContactForm vehicleId={vehicle.id} defaultInterest="purchase" />
              </div>
            </section>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl sm:text-4xl">Related vehicles</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted-bg px-3 py-3">
      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
