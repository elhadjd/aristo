import { TradeInForm } from "@/features/trade-in/trade-in-form";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Trade-In",
  description:
    "Get a fair trade-in appraisal from ARISTO and apply equity toward your next vehicle.",
  path: "/trade-in",
});

export default function TradeInPage() {
  return (
    <>
      <PageHero
        title="Trade-In"
        description="Unlock equity with a complimentary appraisal and a streamlined upgrade path."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trade-In" }]} />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-3xl">How it works</h2>
            <ol className="mt-5 space-y-4 text-sm text-muted">
              <li>
                <strong className="text-foreground">1. Submit details</strong>
                <br />
                Share year, make, model, mileage, and condition.
              </li>
              <li>
                <strong className="text-foreground">2. Receive appraisal</strong>
                <br />
                Our team reviews market comps and vehicle condition.
              </li>
              <li>
                <strong className="text-foreground">3. Apply equity</strong>
                <br />
                Use your offer toward any ARISTO inventory vehicle.
              </li>
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-3xl">Appraisal request</h2>
            <div className="mt-6">
              <TradeInForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
