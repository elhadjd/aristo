"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { estimateMonthlyPayment } from "@/utils/vehicles";
import { formatCurrency } from "@/utils/format";

export function LoanCalculator({
  defaultPrice = 45000,
  defaultRate = 4.9,
}: {
  defaultPrice?: number;
  defaultRate?: number;
}) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(5000);
  const [rate, setRate] = useState(defaultRate);
  const [months, setMonths] = useState(60);

  const monthly = useMemo(
    () => estimateMonthlyPayment(price, downPayment, rate, months),
    [price, downPayment, rate, months],
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h3 className="font-display text-2xl">Loan estimator</h3>
      <p className="mt-2 text-sm text-muted">Estimate only. Final terms depend on credit approval.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle price">
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Down payment">
          <Input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="APR (%)">
          <Input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Term (months)">
          <Input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value) || 1)}
          />
        </Field>
      </div>
      <div className="mt-6 rounded-xl bg-muted-bg p-5">
        <p className="text-sm text-muted">Estimated monthly payment</p>
        <p className="mt-1 font-display text-4xl text-secondary">{formatCurrency(monthly)}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}
