export const siteConfig = {
  name: "ARISTO",
  legalName: "ARISTO Auto Group",
  tagline: "Premium vehicles. Exceptional ownership.",
  description:
    "ARISTO is a luxury automotive dealership in Columbus, Ohio offering curated inventory, transparent financing, trade-ins, and concierge delivery.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+1 (614) 592-0280",
  phoneHref: "tel:+16145920280",
  whatsapp: "+1 (614) 592-0280",
  whatsappHref: "https://wa.me/16145920280",
  email: "keitaarbaba9@gmail.com",
  emailHref: "mailto:keitaarbaba9@gmail.com",
  address: {
    street: "3431 Westerville Rd",
    city: "Columbus",
    state: "OH",
    zip: "43224",
    country: "US",
    full: "3431 Westerville Rd, Columbus, OH 43224",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3054.8!2d-82.945!3d40.060!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88388f4f0e0e0e0e%3A0x0!2s3431%20Westerville%20Rd%2C%20Columbus%2C%20OH%2043224!5e0!3m2!1sen!2sus!4v1700000000000",
  mapSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=3431+Westerville+Rd,+Columbus,+OH+43224",
  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
    { day: "Saturday", time: "10:00 AM – 6:00 PM" },
    { day: "Sunday", time: "By appointment" },
  ],
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
  },
  locale: "en_US",
} as const;

export type SiteConfig = typeof siteConfig;
