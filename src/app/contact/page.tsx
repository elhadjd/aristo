import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/features/contact/contact-form";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/utils/cn";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Fellah Express LLC in Columbus, OH"
        description="Call, WhatsApp, email, or visit 3431 Westerville Rd to speak with sales, schedule a test drive, or ask about financing."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Company information</h2>
              <div className="mt-5 space-y-4 text-sm">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                  <a href={siteConfig.mapSearchUrl}>{siteConfig.address.full}</a>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-secondary" />
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-secondary" />
                  <a href={siteConfig.emailHref}>{siteConfig.email}</a>
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={siteConfig.phoneHref} className={cn(buttonVariants({ variant: "secondary" }))}>
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp" }))}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
              <div className="mt-8">
                <h3 className="font-medium">Working hours</h3>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {siteConfig.hours.map((item) => (
                    <li key={item.day}>
                      {item.day}: {item.time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                title="Fellah Express LLC Google Map"
                src={siteConfig.mapEmbedUrl}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-3xl">Send a message</h2>
            <p className="mt-2 text-sm text-muted">We typically respond within one business hour.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
