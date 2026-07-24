import type { Testimonial } from "@/types/common";
import { cachedGet, http } from "./http";

export async function getTestimonials(): Promise<Testimonial[]> {
  return cachedGet("testimonials", async () => {
    const { data } = await http.get<Testimonial[]>("/testimonials");
    return data;
  });
}
