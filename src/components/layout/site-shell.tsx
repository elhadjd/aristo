"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { BackToTop } from "@/components/layout/back-to-top";
import { ThemeInit } from "@/components/layout/theme-init";
import { Toaster } from "sonner";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <ThemeInit />
        {children}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <>
      <ThemeInit />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
      <Toaster richColors position="top-right" />
    </>
  );
}
