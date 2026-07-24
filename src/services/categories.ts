import type { Category } from "@/types/common";
import { cachedGet, http } from "./http";

export async function getCategories(): Promise<Category[]> {
  return cachedGet("categories", async () => {
    const { data } = await http.get<Category[]>("/categories");
    return data;
  });
}
