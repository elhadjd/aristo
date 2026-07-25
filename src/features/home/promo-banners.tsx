import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/utils/cn";

export function PromoBanners({ rateFrom }: { rateFrom: number }) {
  return (
    <section className="section-shell grid gap-5 py-10 md:grid-cols-2">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-[#111827] p-8 text-white sm:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Financing
          </p>
          <h3 className="mt-3 font-display text-3xl sm:text-4xl">Rates from {rateFrom}% APR</h3>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Structure a payment plan that fits—transparent terms with specialist guidance.
          </p>
          <Link
            href="/financing"
            className={cn(buttonVariants({ variant: "secondary" }), "mt-6 inline-flex")}
          >
            Get pre-qualified
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Trade-In</p>
          <h3 className="mt-3 font-display text-3xl sm:text-4xl">Unlock equity today</h3>
          <p className="mt-3 max-w-md text-sm text-muted">
            Instant appraisal request. Apply value toward your next Fellah Express LLC vehicle.
          </p>
          <Link
            href="/trade-in"
            className={cn(buttonVariants({ variant: "accent" }), "mt-6 inline-flex")}
          >
            Start trade-in
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
