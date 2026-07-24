import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/utils/cn";

export function EmptyState({
  title,
  description,
  actionHref = "/inventory",
  actionLabel = "Browse inventory",
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted">{description}</p>
      <Link href={actionHref} className={cn(buttonVariants({ variant: "secondary" }), "mt-6 inline-flex")}>
        {actionLabel}
      </Link>
    </div>
  );
}
