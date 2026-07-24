"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-shell flex min-h-[60vh] flex-col items-center justify-center py-28 text-center">
      <h1 className="font-display text-4xl sm:text-5xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted">
        Please try again. If the issue continues, contact ARISTO sales for assistance.
      </p>
      <Button className="mt-8" variant="secondary" onClick={reset}>
        Try again
      </Button>
    </section>
  );
}
