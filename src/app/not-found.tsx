import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/utils/cn";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description: "The Fellah Express LLC page you requested was not found. Browse used and luxury cars for sale in Columbus, Ohio.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[70vh] flex-col items-center justify-center py-28 text-center">
      <p className="font-display text-sm tracking-[0.28em] text-muted">404</p>
      <h1 className="mt-3 font-display text-5xl sm:text-6xl">Page not found</h1>
      <p className="mt-4 max-w-md text-muted">
        The page you are looking for has moved or no longer exists. Explore our Columbus, Ohio
        inventory of used and luxury cars instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "primary" }))}>
          Back home
        </Link>
        <Link href="/inventory" className={cn(buttonVariants({ variant: "secondary" }))}>
          Browse inventory
        </Link>
      </div>
    </section>
  );
}
