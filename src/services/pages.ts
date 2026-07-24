import type { ContactPayload, TradeInPayload } from "@/types/common";
import { http } from "./http";

export async function submitContact(payload: ContactPayload) {
  const { data } = await http.post<{ success: boolean; id?: string }>("/contact", payload);
  return data;
}

export async function submitTradeIn(payload: TradeInPayload) {
  const { data } = await http.post<{ success: boolean; id?: string }>("/contact", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    interest: "trade-in",
    serviceType: "trade-in",
    subject: "Trade-In Appraisal Request",
    message: `Trade-in request for ${payload.year} ${payload.make} ${payload.model} (${payload.mileage} mi, ${payload.condition}). ${payload.notes || ""}`,
    metadata: {
      form: "trade-in",
      year: payload.year,
      make: payload.make,
      model: payload.model,
      mileage: payload.mileage,
      condition: payload.condition,
      notes: payload.notes || "",
    },
  });
  return data;
}
