"use client";

import { useEffect } from "react";
import { Copy, Heart, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useCompareStore } from "@/store/compare-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/utils/cn";

export function VehicleActions({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const wishlist = useWishlistStore();
  const compare = useCompareStore();
  const addRecent = useRecentlyViewedStore((s) => s.add);
  const { copy } = useCopyToClipboard();
  const wished = wishlist.has(id);

  useEffect(() => {
    addRecent(id);
  }, [id, addRecent]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // fall through
      }
    }
    await copy(url, "Link copied");
  };

  return (
    <div className="no-print flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={() => {
          wishlist.toggle(id);
          toast.success(wished ? "Removed from favorites" : "Saved to favorites");
        }}
      >
        <Heart className={cn("h-4 w-4", wished && "fill-secondary text-secondary")} />
        Favorite
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const alreadyCompared = compare.has(id);
          if (!alreadyCompared && !compare.canAdd) {
            toast.error("Compare up to 3 vehicles");
            return;
          }
          compare.toggle(id);
          toast.success(alreadyCompared ? "Removed from compare" : "Added to compare");
        }}
      >
        Compare
      </Button>
      <Button variant="outline" onClick={share}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button
        variant="outline"
        onClick={() => copy(window.location.href)}
      >
        <Copy className="h-4 w-4" />
        Copy link
      </Button>
      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
}
