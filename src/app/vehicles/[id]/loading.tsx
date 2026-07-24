import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleLoading() {
  return (
    <div className="section-shell grid gap-10 py-28 lg:grid-cols-2">
      <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
