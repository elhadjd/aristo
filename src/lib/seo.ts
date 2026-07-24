import type { Metadata } from "next";
import { defaultKeywords, pageSeo, type PageSeoKey } from "@/config/seo";
import { siteConfig } from "@/config/site";

type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
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
  keywords = [...defaultKeywords],
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const uniqueKeywords = Array.from(new Set(keywords.map((item) => item.trim()).filter(Boolean)));

  return {
    title: fullTitle,
    description,
    keywords: uniqueKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    category: "automotive",
  };
}

export function pageMetadata(key: PageSeoKey, overrides?: Partial<BuildMetadataInput>): Metadata {
  const page = pageSeo[key];
  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    keywords: page.keywords,
    ...overrides,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$-$$$",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    description: siteConfig.description,
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
    areaServed: [
      { "@type": "City", name: "Columbus" },
      { "@type": "AdministrativeArea", name: "Ohio" },
    ],
    sameAs: Object.values(siteConfig.social).filter((url) => {
      try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        // Skip placeholder homepage-only social links until real profiles are set.
        return !["facebook.com", "instagram.com", "youtube.com", "x.com", "twitter.com"].includes(
          host,
        );
      } catch {
        return false;
      }
    }),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/inventory")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
        "@id": `${absoluteUrl("/")}#organization`,
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

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: absoluteUrl(article.path),
    image: article.image ? [article.image.startsWith("http") ? article.image : absoluteUrl(article.image)] : undefined,
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : article.publishedAt
        ? new Date(article.publishedAt).toISOString()
        : undefined,
    author: {
      "@type": "Organization",
      name: siteConfig.legalName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
    },
  };
}

export function vehicleSeoDescription(vehicle: {
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
}) {
  const base = `${vehicle.year} ${vehicle.brand} ${vehicle.model} for sale at ARISTO in Columbus, Ohio.`;
  const details = `Mileage ${vehicle.mileage.toLocaleString("en-US")} mi. Transparent pricing and financing available.`;
  const custom = vehicle.description?.trim();
  if (custom && custom.length >= 80) {
    return custom.length > 160 ? `${custom.slice(0, 157).trim()}…` : custom;
  }
  return `${base} ${details} Visit 3431 Westerville Rd or schedule a test drive.`;
}

export function vehicleSeoKeywords(vehicle: {
  brand: string;
  model: string;
  year: number;
  bodyStyle?: string;
}) {
  return [
    ...defaultKeywords,
    `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    `${vehicle.brand} ${vehicle.model} Columbus`,
    `${vehicle.brand} for sale Columbus OH`,
    `used ${vehicle.brand} Columbus`,
    vehicle.bodyStyle ? `${vehicle.bodyStyle} for sale Columbus` : "",
    `${vehicle.year} ${vehicle.brand} for sale`,
  ].filter(Boolean);
}
