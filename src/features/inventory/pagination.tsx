import Link from "next/link";
import { cn } from "@/utils/cn";

export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    params.set("page", String(target));
    return `/inventory?${params.toString()}`;
  };

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <PaginationLink href={hrefFor(Math.max(1, page - 1))} disabled={page <= 1}>
        Previous
      </PaginationLink>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <PaginationLink key={item} href={hrefFor(item)} active={item === page}>
          {item}
        </PaginationLink>
      ))}
      <PaginationLink
        href={hrefFor(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  active,
  disabled,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="rounded-xl px-3 py-2 text-sm text-muted opacity-50">{children}</span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border bg-card hover:bg-muted-bg",
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
