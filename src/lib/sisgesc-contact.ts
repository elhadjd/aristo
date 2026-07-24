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

export type SisgescSyncResult = {
  ok: boolean;
  reference?: string;
  error?: string;
  status?: number;
  configured?: boolean;
  endpoint?: string;
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

export function getContactEndpoint() {
  const { baseUrl, contactUrl } = getSisgescEnv();
  if (contactUrl) return contactUrl.replace(/\/$/, "");
  if (!baseUrl) return "";

  // Allow pasting a full submit URL into SISGESC_API_URL by mistake.
  if (/\/contacts\/submit$/i.test(baseUrl)) return baseUrl;
  if (/\/api\/site$/i.test(baseUrl)) return `${baseUrl}/contacts/submit`;
  if (/\/api$/i.test(baseUrl)) return `${baseUrl}/site/contacts/submit`;
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

function describeHttpError(status: number, message?: string, endpoint?: string): string {
  if (status === 404) {
    return (
      message ||
      `SISGESC endpoint not found (404). Check SISGESC_API_URL / SISGESC_CONTACT_URL${
        endpoint ? ` → ${endpoint}` : ""
      }`
    );
  }
  if (status === 401 || status === 403) {
    return message || "Unauthorized (invalid SISGESC site key)";
  }
  if (status === 422) {
    return message || "SISGESC rejected the contact data (validation failed)";
  }
  if (status >= 500) {
    return message || `SISGESC server error (${status})`;
  }
  return message || `SISGESC contact failed (${status})`;
}

/**
 * POST /api/site/contacts/submit
 * Auth: site API `key` (query recommended + header).
 * Success: HTTP 201
 */
export async function sendLeadToSisgesc(payload: SisgescLeadPayload): Promise<SisgescSyncResult> {
  const endpoint = getContactEndpoint();
  const { key } = getSisgescEnv();

  if (!endpoint || !key) {
    const error = !endpoint
      ? "SISGESC contact endpoint not configured (set SISGESC_API_URL or SISGESC_CONTACT_URL)"
      : "SISGESC site API key not configured (set SISGESC_SITE_API_KEY)";
    console.warn("[ARISTO] SISGESC contact sync skipped:", error);
    return { ok: false, configured: false, error, endpoint: endpoint || undefined };
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
      endpoint,
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
        endpoint,
        reference: String(data.contact?.id || `sisgesc_${Date.now()}`),
        status: response.status,
      };
    }

    if (response.status === 422) {
      const details = data.errors
        ? Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ")
        : data.message;
      const error = describeHttpError(422, details || undefined, endpoint);
      console.error("[ARISTO] SISGESC contact validation failed:", error, {
        endpoint,
        body,
      });
      return {
        ok: false,
        configured: true,
        endpoint,
        status: 422,
        error,
      };
    }

    const error = describeHttpError(response.status, data.message, endpoint);
    console.error("[ARISTO] SISGESC contact sync failed:", error, {
      status: response.status,
      endpoint,
    });
    return {
      ok: false,
      configured: true,
      endpoint,
      status: response.status,
      error,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SISGESC contact request failed";
    console.error("[ARISTO] SISGESC contact request error:", message, { endpoint });
    return {
      ok: false,
      configured: true,
      endpoint,
      error: message,
    };
  }
}

export function sisgescUserMessage(sync: SisgescSyncResult): string {
  if (sync.ok) return "Message sent successfully.";
  if (sync.configured === false) {
    return "Contact service is not configured. Please try again later or call us directly.";
  }
  if (sync.status === 404) {
    return "Unable to deliver your message to our CRM (endpoint not found). Please try again later or call us.";
  }
  if (sync.status === 401 || sync.status === 403) {
    return "Unable to deliver your message to our CRM (authorization failed). Please try again later or call us.";
  }
  if (sync.status === 422) {
    return sync.error || "Some of your details were rejected. Please check the form and try again.";
  }
  return "Unable to deliver your message right now. Please try again later or call us directly.";
}
