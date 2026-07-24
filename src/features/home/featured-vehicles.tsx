import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { VehicleCard } from "@/features/vehicles/vehicle-card";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/utils/cn";

export function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="section-shell py-20 sm:py-24">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="Curated selection"
            title="Featured vehicles"
            description="Handpicked inventory with standout specification, condition, and value."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Link href="/inventory" className={cn(buttonVariants({ variant: "outline" }))}>
            View all inventory
          </Link>
        </Reveal>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle, index) => (
          <Reveal key={vehicle.id} delay={index * 0.05}>
            <VehicleCard vehicle={vehicle} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
