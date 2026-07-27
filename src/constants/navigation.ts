export const mainNav = [
  { label: "Inventory", href: "/inventory" },
  { label: "Financing", href: "/financing" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  company: [
    { label: "About Fellah Express LLC", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Articles", href: "/articles" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  inventory: [
    { label: "All Vehicles", href: "/inventory" },
    { label: "Featured", href: "/inventory?sort=newest" },
    { label: "SUVs", href: "/inventory?bodyStyle=SUV" },
    { label: "Sedans", href: "/inventory?bodyStyle=Sedan" },
    { label: "Electric", href: "/inventory?fuel=Electric" },
  ],
  services: [
    { label: "All Services", href: "/services" },
    { label: "Financing", href: "/financing" },
    { label: "Trade-In", href: "/trade-in" },
    { label: "Inspection", href: "/services#inspection" },
    { label: "Delivery", href: "/services#delivery" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export const stats = [
  { label: "Vehicles Delivered", value: 2400, suffix: "+" },
  { label: "Years of Trust", value: 12, suffix: "+" },
  { label: "Customer Rating", value: 4.9, suffix: "/5", decimals: 1 },
  { label: "Brands Represented", value: 28, suffix: "+" },
] as const;
