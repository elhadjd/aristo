import { AdminShell } from "@/features/admin/admin-shell";

export const metadata = {
  title: "ARISTO Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
