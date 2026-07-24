import { TestimonialsSection } from "@/features/home/testimonials";
import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { listTestimonials } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("testimonials");

export default async function TestimonialsPage() {
  const testimonials = await listTestimonials();

  return (
    <>
      <PageHero
        title="Testimonials"
        description="Trusted by drivers who expect clarity, polish, and lasting value."
      />
      <section className="section-shell pt-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Testimonials" }]} />
      </section>
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
