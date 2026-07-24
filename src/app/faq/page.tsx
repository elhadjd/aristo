import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { faqItems } from "@/constants/faq";
import { listFaq } from "@/lib/data";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("faq");

export default async function FaqPage() {
  const dbFaq = await listFaq();
  const items = dbFaq.length
    ? dbFaq.map((item) => ({ question: item.question, answer: item.answer }))
    : faqItems.map((item) => ({ question: item.question, answer: item.answer }));

  return (
    <>
      <JsonLd data={faqJsonLd(items)} />
      <PageHero
        title="FAQ"
        description="Answers about buying used and luxury cars, financing, trade-ins, warranties, and test drives at ARISTO in Columbus, Ohio."
      />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <div className="mx-auto max-w-3xl space-y-4">
          {items.map((item) => (
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
