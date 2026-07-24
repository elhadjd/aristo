import type { DealershipService } from "@/types/common";
import { cachedGet, http } from "./http";

export async function getServices(): Promise<DealershipService[]> {
  return cachedGet("services", async () => {
    const { data } = await http.get<DealershipService[]>("/services");
    return data;
  });
}

export async function getServiceBySlug(slug: string): Promise<DealershipService | undefined> {
  const services = await getServices();
  return services.find((service) => service.slug === slug);
}
