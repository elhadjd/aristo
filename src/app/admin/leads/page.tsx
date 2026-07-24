"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: string;
  sisgescSync: string;
  sisgescRef: string;
  createdAt: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [resyncingId, setResyncingId] = useState<string | null>(null);
  const [sisgescConfigured, setSisgescConfigured] = useState<boolean | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then(setLeads);
  }, []);

  useEffect(() => {
    load();
    fetch("/api/admin/sisgesc-status")
      .then((res) => res.json())
      .then((data) => setSisgescConfigured(Boolean(data.configured)))
      .catch(() => setSisgescConfigured(false));
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Contact leads</h1>
        <p className="mt-2 text-sm text-muted">
          Form submissions are stored here and forwarded to SISGESC.
        </p>
        {sisgescConfigured === false ? (
          <p className="mt-2 text-sm text-secondary">
            SISGESC is not configured. Add `SISGESC_API_URL` and `SISGESC_SITE_API_KEY` to `.env`
            / `.env.local`, restart the server, then use Resync on each lead.
          </p>
        ) : null}
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-medium">{lead.name}</h2>
                <p className="text-sm text-muted">
                  {lead.email} {lead.phone ? `· ${lead.phone}` : ""}
                </p>
              </div>
              <div className="text-right text-xs text-muted">
                <p>{new Date(lead.createdAt).toLocaleString()}</p>
                <p>
                  SISGESC: {lead.sisgescSync}
                  {lead.sisgescRef ? ` (${lead.sisgescRef})` : ""}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm">
              <span className="font-medium">{lead.interest}</span>
              {lead.subject ? ` · ${lead.subject}` : ""}
            </p>
            <p className="mt-2 text-sm text-muted">{lead.message}</p>
            {lead.sisgescSync !== "synced" ? (
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={resyncingId === lead.id}
                  onClick={async () => {
                    setResyncingId(lead.id);
                    try {
                      const response = await fetch(`/api/admin/leads/${lead.id}/resync`, {
                        method: "POST",
                      });
                      const data = await response.json();
                      if (!response.ok) {
                        toast.error(data.message || "Resync failed");
                        load();
                        return;
                      }
                      toast.success("Lead synced to SISGESC");
                      load();
                    } catch {
                      toast.error("Resync failed");
                    } finally {
                      setResyncingId(null);
                    }
                  }}
                >
                  {resyncingId === lead.id ? "Syncing…" : "Resync to SISGESC"}
                </Button>
              </div>
            ) : null}
          </article>
        ))}
        {leads.length === 0 ? <p className="text-sm text-muted">No leads yet.</p> : null}
      </div>
    </div>
  );
}
