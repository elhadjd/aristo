import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { VehicleCard } from "@/features/vehicles/vehicle-card";
import type { Vehicle } from "@/types/vehicle";

export function LatestVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="section-shell py-20 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Just arrived"
          title="Latest vehicles"
          description="Fresh listings synchronized from our SISGESC inventory system."
        />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {vehicles.slice(0, 4).map((vehicle, index) => (
          <Reveal key={vehicle.id} delay={index * 0.05}>
            <VehicleCard vehicle={vehicle} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
