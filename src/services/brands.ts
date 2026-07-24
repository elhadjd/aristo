import type { Brand } from "@/types/common";
import { cachedGet, http } from "./http";

export async function getBrands(): Promise<Brand[]> {
  return cachedGet("brands", async () => {
    const { data } = await http.get<Brand[]>("/brands");
    return data;
  });
}
