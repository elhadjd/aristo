import { ContactForm } from "@/features/contact/contact-form";
import { LoanCalculator } from "@/features/financing/loan-calculator";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Financing",
  description:
    "ARISTO financing specialists help structure competitive auto loans with transparent terms in Columbus, Ohio.",
  path: "/financing",
});

export default async function FinancingPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHero
        title="Financing"
        description={`Competitive rates from ${settings.financingRateFrom}% APR with guidance tailored to your goals.`}
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Financing" }]} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Clear monthly payments</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Whether you are purchasing your first luxury vehicle or upgrading a daily driver,
                our team partners with multiple lenders to present options that fit. Pre-qualify,
                estimate payments, and move forward with confidence.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                <li>• Multiple lender network</li>
                <li>• New, CPO, and used programs</li>
                <li>• Flexible terms from 36–84 months</li>
                <li>• Trade equity applied to your deal</li>
              </ul>
            </div>
            <LoanCalculator defaultRate={settings.financingRateFrom} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-3xl">Request a quote</h2>
            <p className="mt-2 text-sm text-muted">A specialist will respond during business hours.</p>
            <div className="mt-6">
              <ContactForm defaultInterest="financing" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
