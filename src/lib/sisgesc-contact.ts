export type SisgescContactSubmitPayload = {
  name: string;
  email: string;
  phone: string;
  message?: string;
  subject?: string;
  /** Numeric product id when known; otherwise omit and store label in metadata.service */
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

function getSisgescEnv() {
  // Read at call-time so Next.js / dotenv values are never stale across hot reloads.
  const baseUrl = (process.env.SISGESC_API_URL || "").trim().replace(/\/$/, "");
  const key = (
    process.env.SISGESC_SITE_API_KEY ||
    process.env.SISGESC_API_KEY ||
    ""
  ).trim();
  const contactUrl = (process.env.SISGESC_CONTACT_URL || "").trim();
  return { baseUrl, key, contactUrl };
}

export function isSisgescContactConfigured(): boolean {
  const { baseUrl, key, contactUrl } = getSisgescEnv();
  return Boolean(key && (contactUrl || baseUrl));
}

function getContactEndpoint() {
  const { baseUrl, contactUrl } = getSisgescEnv();
  if (contactUrl) return contactUrl;
  if (!baseUrl) return "";
  return `${baseUrl}/api/site/contacts/submit`;
}

function resolveServiceField(
  service?: number | string,
  vehicleId?: string,
): number | string | undefined {
  const raw = service ?? vehicleId;
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const text = String(raw).trim();
  if (/^\d+$/.test(text)) return Number(text);
  // Non-numeric ids (local cuid / slug) stay in metadata only.
  return undefined;
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
  configured?: boolean;
}> {
  const endpoint = getContactEndpoint();
  const { key } = getSisgescEnv();

  if (!endpoint || !key) {
    const error = !endpoint
      ? "SISGESC contact endpoint not configured (set SISGESC_API_URL or SISGESC_CONTACT_URL)"
      : "SISGESC site API key not configured (set SISGESC_SITE_API_KEY)";
    console.warn("[ARISTO] SISGESC contact sync skipped:", error);
    return { ok: false, configured: false, error };
  }

  const service = resolveServiceField(payload.service, payload.vehicleId);

  const body: SisgescContactSubmitPayload = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim().slice(0, 20),
    subject: payload.subject?.trim() || undefined,
    message: payload.message?.trim() || undefined,
    service,
    serviceType: payload.serviceType || payload.interest || undefined,
    metadata: {
      source: "aristo-website",
      interest: payload.interest,
      vehicleId: payload.vehicleId,
      service_label:
        service === undefined
          ? payload.service ?? payload.vehicleId ?? undefined
          : undefined,
      ...(payload.metadata || {}),
    },
  };

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    key,
  };

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return {
      ok: false,
      configured: true,
      error: `Invalid SISGESC contact URL: ${endpoint}`,
    };
  }
  url.searchParams.set("key", key);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
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
        configured: true,
        reference: String(data.contact?.id || `sisgesc_${Date.now()}`),
        status: response.status,
      };
    }

    if (response.status === 403) {
      const error = data.message || "Unauthorized (invalid site key)";
      console.error("[ARISTO] SISGESC contact sync failed:", error);
      return { ok: false, configured: true, status: 403, error };
    }

    if (response.status === 422) {
      const details = data.errors
        ? Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ")
        : data.message;
      const error = details || "Validation failed";
      console.error("[ARISTO] SISGESC contact validation failed:", error, body);
      return {
        ok: false,
        configured: true,
        status: 422,
        error,
      };
    }

    const error = data.message || `SISGESC contact failed (${response.status})`;
    console.error("[ARISTO] SISGESC contact sync failed:", error);
    return {
      ok: false,
      configured: true,
      status: response.status,
      error,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SISGESC contact request failed";
    console.error("[ARISTO] SISGESC contact request error:", message);
    return {
      ok: false,
      configured: true,
      error: message,
    };
  }
}
