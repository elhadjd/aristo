import type { ContactPayload, TradeInPayload } from "@/types/common";
import { http } from "./http";

export async function submitContact(payload: ContactPayload) {
  const { data } = await http.post<{ success: boolean; id?: string }>("/contact", payload);
  return data;
}

export async function submitTradeIn(payload: TradeInPayload) {
  const { data } = await http.post<{ success: boolean; id?: string }>("/contact", {
    ...payload,
    interest: "trade-in",
    subject: "Trade-In Appraisal Request",
    message: `Trade-in request for ${payload.year} ${payload.make} ${payload.model} (${payload.mileage} mi, ${payload.condition}). ${payload.notes || ""}`,
  });
  return data;
}
