import { Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/types/common";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="bg-muted-bg/50 py-20 sm:py-24">
      <div className="section-shell">
        <Reveal>
          <SectionHeading
            eyebrow="Client voices"
            title="Customer testimonials"
            description="Real ownership stories from drivers across Columbus and beyond."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex gap-1 text-secondary" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                  “{item.content}”
                </p>
                <footer className="mt-6">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted">{item.role}</p>
                  {item.vehiclePurchased ? (
                    <p className="mt-1 text-xs text-accent">{item.vehiclePurchased}</p>
                  ) : null}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
