import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms of service for using the ARISTO dealership website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" description="Guidelines for using the ARISTO website." />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
        <article className="max-w-3xl space-y-5 text-sm leading-relaxed text-muted">
          <p>
            By accessing {siteConfig.url}, you agree to these terms. Inventory pricing, availability,
            and specifications are subject to change and may synchronize from SISGESC systems with
            slight delay.
          </p>
          <h2 className="font-display text-2xl text-foreground">Vehicle information</h2>
          <p>
            While we strive for accuracy, listing details may contain errors. Final confirmation of
            price, options, and condition occurs with an ARISTO representative before purchase.
          </p>
          <h2 className="font-display text-2xl text-foreground">Financing estimates</h2>
          <p>
            Loan calculator results are estimates only and do not constitute a credit offer. Approval
            and APR depend on lender criteria and applicant creditworthiness.
          </p>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p>
            For questions, email <a href={siteConfig.emailHref}>{siteConfig.email}</a> or visit{" "}
            {siteConfig.address.full}.
          </p>
        </article>
      </section>
    </>
  );
}
