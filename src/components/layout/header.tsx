"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Moon, Phone, Scale, Sun, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/constants/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useCompareStore } from "@/store/compare-store";
import { useUiStore } from "@/store/ui-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/utils/cn";

export function Header() {
  const pathname = usePathname();
  const scrollY = useScrollPosition();
  const { theme, toggleTheme, mobileNavOpen, setMobileNavOpen } = useUiStore();
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const solid = scrollY > 24 || pathname !== "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <div className="section-shell flex h-[4.5rem] items-center justify-between gap-4 py-3 sm:h-20">
        <Link
          href="/"
          className={cn(
            "max-w-[11rem] font-display text-lg leading-tight tracking-wide sm:max-w-none sm:text-2xl",
            solid ? "text-foreground" : "text-white",
          )}
          aria-label={`${siteConfig.name} home`}
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  solid
                    ? active
                      ? "text-secondary"
                      : "text-foreground/80 hover:text-foreground"
                    : active
                      ? "text-white"
                      : "text-white/80 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/inventory?view=wishlist"
            className={cn(
              "relative hidden rounded-xl p-2 transition sm:inline-flex",
              solid ? "hover:bg-muted-bg" : "text-white hover:bg-white/10",
            )}
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] text-white">
                {wishlistCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/inventory?view=compare"
            className={cn(
              "relative hidden rounded-xl p-2 transition sm:inline-flex",
              solid ? "hover:bg-muted-bg" : "text-white hover:bg-white/10",
            )}
            aria-label="Compare vehicles"
          >
            <Scale className="h-5 w-5" />
            {compareCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-white">
                {compareCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "rounded-xl p-2 transition",
              solid ? "hover:bg-muted-bg" : "text-white hover:bg-white/10",
            )}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <a
            href={siteConfig.phoneHref}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "hidden md:inline-flex")}
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          <button
            type="button"
            className={cn(
              "rounded-xl p-2 lg:hidden",
              solid ? "hover:bg-muted-bg" : "text-white hover:bg-white/10",
            )}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="glass border-t border-border lg:hidden">
          <nav className="section-shell flex flex-col gap-2 py-4" aria-label="Mobile">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-muted-bg"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.phoneHref}
              className={cn(buttonVariants({ variant: "secondary" }), "mt-2")}
            >
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
