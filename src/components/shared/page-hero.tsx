import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#111827] pt-28 pb-14 text-white sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(220,38,38,0.28),transparent_30%),radial-gradient(circle_at_10%_80%,rgba(37,99,235,0.22),transparent_28%)]" />
      <div className="section-shell relative">
        <Reveal>
          <p className="font-display text-sm tracking-[0.28em] text-white/50">ARISTO</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{description}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
