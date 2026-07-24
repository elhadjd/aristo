"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then(setLeads);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Contact leads</h1>
        <p className="mt-2 text-sm text-muted">
          Form submissions are stored here and forwarded to SISGESC.
        </p>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-border bg-white p-5 shadow-soft"
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
          </article>
        ))}
        {leads.length === 0 ? <p className="text-sm text-muted">No leads yet.</p> : null}
      </div>
    </div>
  );
}
