import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryLoading() {
  return (
    <div className="section-shell space-y-6 py-28">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-[560px] w-full" />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
