"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.includes("@")) {
          toast.error("Enter a valid email");
          return;
        }
        toast.success("You're on the list. Welcome to Fellah Express LLC.");
        setEmail("");
      }}
    >
      <p className="text-sm font-medium text-white">Newsletter</p>
      <p className="mt-1 text-sm text-white/60">New arrivals and exclusive offers.</p>
      <div className="mt-3 flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Newsletter email"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
          required
        />
        <Button type="submit" variant="secondary">
          Join
        </Button>
      </div>
    </form>
  );
}
