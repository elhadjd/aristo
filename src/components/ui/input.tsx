import { cn } from "@/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-soft placeholder:text-muted focus-ring",
        className,
      )}
      {...props}
    />
  );
}
