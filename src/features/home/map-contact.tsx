import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";

export function MapContactSection() {
  return (
    <section className="bg-muted-bg/40 py-20 sm:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="Visit"
            title="Columbus showroom"
            description="Experience the inventory in person—or let us bring the vehicle to you."
          />
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
              <a href={siteConfig.mapSearchUrl} className="hover:text-secondary">
                {siteConfig.address.full}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-secondary" />
              <a href={siteConfig.phoneHref} className="hover:text-secondary">
                {siteConfig.phone}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-secondary" />
              <a href={siteConfig.emailHref} className="hover:text-secondary">
                {siteConfig.email}
              </a>
            </p>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 text-secondary" />
              <ul className="space-y-1">
                {siteConfig.hours.map((item) => (
                  <li key={item.day}>
                    <span className="font-medium">{item.day}:</span> {item.time}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link href="/contact" className={cn(buttonVariants({ variant: "primary" }), "mt-8 inline-flex")}>
            Contact us
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <iframe
              title="Fellah Express LLC location map"
              src={siteConfig.mapEmbedUrl}
              className="h-[360px] w-full border-0 sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
