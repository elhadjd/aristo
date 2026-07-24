"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@aristo.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <form
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-lift"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          try {
            const response = await fetch("/api/admin/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
              toast.error(data.message || "Login failed");
              return;
            }
            toast.success("Welcome back");
            router.replace("/admin");
          } catch {
            toast.error("Login failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <p className="font-display text-3xl tracking-[0.18em]">ARISTO</p>
        <h1 className="mt-3 font-display text-3xl">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          Manage vehicles, galleries, services, articles, and site content.
        </p>
        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block font-medium">Email</span>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block font-medium">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <Button type="submit" variant="secondary" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
