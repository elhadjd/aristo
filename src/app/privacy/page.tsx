import { PageHero } from "@/components/shared/page-hero";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for ARISTO dealership website visitors and customers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="How ARISTO collects and protects your information." />
      <section className="section-shell py-12 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <article className="prose-sm max-w-3xl space-y-5 text-muted">
          <p>
            {siteConfig.legalName} (“ARISTO”, “we”, “us”) respects your privacy. This policy explains
            how we collect, use, and safeguard information when you use our website or contact our
            dealership.
          </p>
          <h2 className="font-display text-2xl text-foreground">Information we collect</h2>
          <p>
            Contact details you submit through forms (name, email, phone), vehicle inquiry data,
            trade-in details, and technical data such as browser type and pages visited.
          </p>
          <h2 className="font-display text-2xl text-foreground">How we use information</h2>
          <p>
            We use information to respond to inquiries, prepare financing or trade-in estimates,
            improve website performance, and communicate about inventory relevant to your request.
          </p>
          <h2 className="font-display text-2xl text-foreground">Sharing</h2>
          <p>
            We do not sell personal information. We may share data with financing partners, CRM /
            SISGESC systems, or service providers solely to fulfill your request.
          </p>
          <h2 className="font-display text-2xl text-foreground">Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href={siteConfig.emailHref}>{siteConfig.email}</a> or by calling {siteConfig.phone}.
          </p>
        </article>
      </section>
    </>
  );
}
