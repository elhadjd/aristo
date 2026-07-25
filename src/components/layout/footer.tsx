import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Share2, Video } from "lucide-react";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/constants/navigation";
import { NewsletterForm } from "@/features/contact/newsletter-form";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[#0f172a] text-white">
      <div className="section-shell grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl tracking-wide sm:text-3xl">{siteConfig.name}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            {siteConfig.tagline} Visit our Columbus showroom for curated inventory, clear financing,
            and concierge ownership support.
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <a href={siteConfig.mapSearchUrl} className="flex items-start gap-3 hover:text-white">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              {siteConfig.address.full}
            </a>
            <a href={siteConfig.phoneHref} className="flex items-center gap-3 hover:text-white">
              <Phone className="h-4 w-4 text-secondary" />
              {siteConfig.phone}
            </a>
            <a href={siteConfig.emailHref} className="flex items-center gap-3 hover:text-white">
              <Mail className="h-4 w-4 text-secondary" />
              {siteConfig.email}
            </a>
          </div>
          <div className="mt-6 flex gap-3">
            <a
              href={siteConfig.social.facebook}
              aria-label="Facebook"
              className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              aria-label="Instagram"
              className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.youtube}
              aria-label="YouTube"
              className="rounded-xl bg-white/5 p-2 hover:bg-white/10"
            >
              <Video className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Company" links={footerNav.company} />
        <FooterColumn title="Inventory" links={footerNav.inventory} />
        <FooterColumn title="Services" links={footerNav.services} />
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-6 py-8 lg:flex-row lg:items-end lg:justify-between">
          <NewsletterForm />
          <div className="text-sm text-white/60">
            <div className="mb-3 flex flex-wrap gap-4">
              {footerNav.legal.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/50">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/80 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
