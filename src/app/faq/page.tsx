import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { faqItems } from "@/constants/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to common questions about buying, financing, trade-ins, and delivery at ARISTO.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        description="Everything you need to know before your next visit or purchase."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <div className="mx-auto max-w-3xl space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-card p-5 shadow-soft open:shadow-lift"
            >
              <summary className="cursor-pointer list-none font-medium focus-ring rounded-lg">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
