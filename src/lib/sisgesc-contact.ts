import { apiConfig } from "@/config/api";

export type SisgescLeadPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  vehicleId?: string;
  interest?: string;
};

/**
 * Forward contact / trade-in leads to SISGESC.
 * Configure SISGESC_CONTACT_URL (full endpoint) or SISGESC_API_URL + default path.
 */
export async function sendLeadToSisgesc(payload: SisgescLeadPayload): Promise<{
  ok: boolean;
  reference?: string;
  error?: string;
}> {
  const endpoint =
    process.env.SISGESC_CONTACT_URL ||
    (apiConfig.sisgescBaseUrl
      ? `${apiConfig.sisgescBaseUrl.replace(/\/$/, "")}/api/site/contact`
      : "");

  if (!endpoint) {
    return { ok: false, error: "SISGESC contact endpoint not configured" };
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const key = apiConfig.sisgescSiteApiKey;
  const url = new URL(endpoint);
  if (key) {
    url.searchParams.set("key", key);
    headers.key = key;
  }

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        error: `SISGESC contact failed (${response.status}): ${text.slice(0, 200)}`,
      };
    }

    const data = (await response.json().catch(() => ({}))) as {
      id?: string | number;
      reference?: string;
    };

    return {
      ok: true,
      reference: String(data.reference || data.id || `sisgesc_${Date.now()}`),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "SISGESC contact request failed",
    };
  }
}
