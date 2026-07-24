import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.0605,
      longitude: -82.9452,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "18:00",
      },
    ],
    sameAs: Object.values(siteConfig.social),
  };
}

export function vehicleJsonLd(vehicle: {
  name: string;
  description: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  vin?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicle.name,
    description: vehicle.description,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    image: vehicle.images,
    sku: vehicle.vin,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: vehicle.url,
      seller: {
        "@type": "AutoDealer",
        name: siteConfig.name,
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
