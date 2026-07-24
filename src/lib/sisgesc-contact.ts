import { apiConfig } from "@/config/api";

export type SisgescContactSubmitPayload = {
  name: string;
  email: string;
  phone: string;
  message?: string;
  subject?: string;
  /** Numeric product id when known; otherwise string label stored in metadata.service */
  service?: number | string;
  serviceType?: string;
  metadata?: Record<string, unknown>;
};

export type SisgescLeadPayload = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  vehicleId?: string;
  interest?: string;
  service?: number | string;
  serviceType?: string;
  metadata?: Record<string, unknown>;
};

function getContactEndpoint() {
  if (process.env.SISGESC_CONTACT_URL) {
    return process.env.SISGESC_CONTACT_URL;
  }
  if (!apiConfig.sisgescBaseUrl) return "";
  return `${apiConfig.sisgescBaseUrl.replace(/\/$/, "")}/api/site/contacts/submit`;
}

/**
 * POST /api/site/contacts/submit
 * Auth: site API `key` (query recommended + header).
 * Success: HTTP 201
 */
export async function sendLeadToSisgesc(payload: SisgescLeadPayload): Promise<{
  ok: boolean;
  reference?: string;
  error?: string;
  status?: number;
}> {
  const endpoint = getContactEndpoint();
  if (!endpoint) {
    return { ok: false, error: "SISGESC contact endpoint not configured" };
  }

  const key = apiConfig.sisgescSiteApiKey;
  if (!key) {
    return { ok: false, error: "SISGESC site API key not configured" };
  }

  const body: SisgescContactSubmitPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone.slice(0, 20),
    subject: payload.subject || undefined,
    message: payload.message || undefined,
    service: payload.service ?? payload.vehicleId ?? undefined,
    serviceType: payload.serviceType || payload.interest || undefined,
    metadata: {
      source: "aristo-website",
      interest: payload.interest,
      vehicleId: payload.vehicleId,
      ...(payload.metadata || {}),
    },
  };

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    key,
  };

  const url = new URL(endpoint);
  url.searchParams.set("key", key);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      contact?: { id?: number | string };
      errors?: Record<string, string[]>;
    };

    // Documented success status is 201
    if (response.status === 201 || (response.ok && data.success)) {
      return {
        ok: true,
        reference: String(data.contact?.id || `sisgesc_${Date.now()}`),
        status: response.status,
      };
    }

    if (response.status === 403) {
      return { ok: false, status: 403, error: data.message || "Unauthorized (invalid site key)" };
    }

    if (response.status === 422) {
      const details = data.errors
        ? Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ")
        : data.message;
      return {
        ok: false,
        status: 422,
        error: details || "Validation failed",
      };
    }

    return {
      ok: false,
      status: response.status,
      error:
        data.message ||
        `SISGESC contact failed (${response.status})`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SISGESC contact request failed",
    };
  }
}
