import { clsx } from "clsx";

export type ButtonVariantProps = {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg" | "icon";
};

export function buttonVariants({
  variant = "primary",
  size = "md",
}: ButtonVariantProps = {}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus-ring disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lift":
        variant === "primary",
      "bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:brightness-110":
        variant === "secondary",
      "bg-accent text-accent-foreground hover:-translate-y-0.5 hover:brightness-110":
        variant === "accent",
      "border border-border bg-transparent text-foreground hover:border-foreground/30 hover:bg-muted-bg":
        variant === "outline",
      "bg-transparent text-foreground hover:bg-muted-bg": variant === "ghost",
      "bg-[#25D366] text-white hover:-translate-y-0.5 hover:brightness-105":
        variant === "whatsapp",
      "h-9 px-3 text-sm": size === "sm",
      "h-11 px-5 text-sm": size === "md",
      "h-12 px-6 text-base": size === "lg",
      "h-11 w-11": size === "icon",
    },
  );
}
