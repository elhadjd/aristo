import type { ContactPayload, TradeInPayload } from "@/types/common";
import { http } from "./http";

export type ContactSubmitResult = {
  success: boolean;
  id?: string;
  message?: string;
  sisgesc?: string;
  sisgescError?: string;
  detail?: string;
};

export async function submitContact(payload: ContactPayload) {
  const { data } = await http.post<ContactSubmitResult>("/contact", payload);
  if (!data?.success) {
    throw {
      message: data?.message || data?.detail || data?.sisgescError || "Unable to send message",
      detail: data?.detail || data?.sisgescError,
      data,
    };
  }
  return data;
}

export async function submitTradeIn(payload: TradeInPayload) {
  return submitContact({
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
}
