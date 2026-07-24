import { HomeHero } from "@/features/home/hero";
import { FeaturedVehicles } from "@/features/home/featured-vehicles";
import { PopularCategories } from "@/features/home/categories";
import { WhyAristo } from "@/features/home/why-aristo";
import { HowItWorks } from "@/features/home/how-it-works";
import { ServicesPreview } from "@/features/home/services-preview";
import { TestimonialsSection } from "@/features/home/testimonials";
import { PromoBanners } from "@/features/home/promo-banners";
import { LatestVehicles } from "@/features/home/latest-vehicles";
import { StatsSection } from "@/features/home/stats";
import { BrandsSection } from "@/features/home/brands";
import { MapContactSection } from "@/features/home/map-contact";
import {
  getSiteSettings,
  listBrands,
  listCategories,
  listFeatured,
  listLatest,
  listServices,
  listTestimonials,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "ARISTO",
  description:
    "Premium automotive dealership in Columbus, OH. Browse curated inventory, financing, trade-ins, and concierge delivery.",
  path: "/",
});

export default async function HomePage() {
  const [settings, featured, latest, categories, services, testimonials, brands] =
    await Promise.all([
      getSiteSettings(),
      listFeatured(6),
      listLatest(8),
      listCategories(),
      listServices(),
      listTestimonials(),
      listBrands(),
    ]);

  return (
    <>
      <HomeHero
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        image={settings.heroImage}
      />
      <FeaturedVehicles vehicles={featured} />
      <PopularCategories categories={categories} />
      <WhyAristo />
      <HowItWorks />
      <ServicesPreview services={services} />
      <TestimonialsSection testimonials={testimonials} />
      <PromoBanners rateFrom={settings.financingRateFrom} />
      <LatestVehicles vehicles={latest} />
      <StatsSection />
      <BrandsSection brands={brands} />
      <MapContactSection />
    </>
  );
}
