import { cn } from "@/utils/cn";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-soft placeholder:text-muted focus-ring",
        className,
      )}
      {...props}
    />
  );
}
