import { cn } from "@/utils/cn";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-soft focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
