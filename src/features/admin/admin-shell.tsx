"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Car,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Tags,
  Wrench,
  X,
  BadgeCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button-variants";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: BadgeCheck },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/leads", label: "Contacts", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (isLogin) return;

    let active = true;
    fetch("/api/admin/auth/me")
      .then(async (response) => {
        if (!response.ok) {
          router.replace("/admin/login");
          return;
        }
        const data = await response.json();
        if (active) {
          setUser({ name: data.user.name, email: data.user.email });
          setReady(true);
        }
      })
      .catch(() => router.replace("/admin/login"));

    return () => {
      active = false;
    };
  }, [isLogin, router, pathname]);

  if (isLogin) return <>{children}</>;
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a] text-white">
        Loading admin…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted-bg text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-[#0f172a] text-white transition lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Link href="/admin" className="font-display text-xl tracking-wide">
              Fellah Express
            </Link>
            <button type="button" className="lg:hidden" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 px-3 pb-8">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
            <button type="button" className="rounded-lg p-2 hover:bg-muted-bg lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))} target="_blank">
                View site
              </Link>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                onClick={async () => {
                  await fetch("/api/admin/auth/logout", { method: "POST" });
                  router.replace("/admin/login");
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </header>
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
