"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (value: string, successMessage = "Link copied") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage);
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      toast.error("Unable to copy");
      return false;
    }
  }, []);

  return { copied, copy };
}
