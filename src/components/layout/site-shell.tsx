import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { BackToTop } from "@/components/layout/back-to-top";
import { ThemeInit } from "@/components/layout/theme-init";
import { Toaster } from "sonner";

export function SiteShell({ children }: { children: React.ReactNode }) {
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
