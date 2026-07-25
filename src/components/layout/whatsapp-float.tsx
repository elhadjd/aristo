"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppFloat() {
  return (
    <a
      href={`${siteConfig.whatsappHref}?text=${encodeURIComponent("Hello Fellah Express LLC, I'm interested in a vehicle.")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="no-print fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 focus-ring"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
