import { cn } from "@/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl text-foreground sm:text-4xl md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base text-muted sm:text-lg">{description}</p> : null}
    </div>
  );
}
