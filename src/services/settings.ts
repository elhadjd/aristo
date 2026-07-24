import type { SiteSettings } from "@/types/common";
import { cachedGet, http } from "./http";

export async function getSettings(): Promise<SiteSettings> {
  return cachedGet("settings", async () => {
    const { data } = await http.get<SiteSettings>("/settings");
    return data;
  });
}
