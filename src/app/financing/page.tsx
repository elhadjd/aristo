import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buttonVariants } from "@/components/ui/button-variants";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/utils/cn";

export const metadata = pageMetadata("financing");

export default async function FinancingPage() {
  return (
    <>
      <PageHero
        title="Car Financing in Columbus, OH"
        description="Financing is coming soon — clear monthly payments and competitive APRs for used and luxury cars."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Financing" }]} />
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <p className="inline-flex rounded-full border border-border bg-muted-bg px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
            Coming soon
          </p>
          <h2 className="mt-5 font-display text-3xl">Financing launches shortly</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We are finalizing our lender network so you can estimate payments, pre-qualify, and
            structure a deal with confidence. In the meantime, browse inventory or contact our team
            about a specific vehicle.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/vehicles" className={cn(buttonVariants())}>
              Browse inventory
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
