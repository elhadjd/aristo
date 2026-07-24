"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitTradeIn } from "@/services/pages";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  make: z.string().min(1),
  model: z.string().min(1),
  mileage: z.number().min(0),
  condition: z.string().min(1),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function TradeInForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      condition: "Good",
      year: new Date().getFullYear() - 3,
      mileage: 0,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          const result = await submitTradeIn(values);
          toast.success(
            result.message || "Trade-in request received. We'll follow up with an appraisal.",
          );
          reset();
        } catch (error) {
          const err = error as { message?: string; detail?: string };
          toast.error(err.message || "Unable to submit trade-in");
          if (err.detail && err.detail !== err.message) {
            toast.message(err.detail);
          }
        }
      })}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <Input {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} />
        </Field>
      </div>
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Year" error={errors.year?.message}>
          <Input type="number" {...register("year", { valueAsNumber: true })} />
        </Field>
        <Field label="Make" error={errors.make?.message}>
          <Input {...register("make")} />
        </Field>
        <Field label="Model" error={errors.model?.message}>
          <Input {...register("model")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mileage" error={errors.mileage?.message}>
          <Input type="number" {...register("mileage", { valueAsNumber: true })} />
        </Field>
        <Field label="Condition" error={errors.condition?.message}>
          <Select {...register("condition")}>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Needs work</option>
          </Select>
        </Field>
      </div>
      <Field label="Notes" error={errors.notes?.message}>
        <Textarea {...register("notes")} placeholder="Options, accidents, service history…" />
      </Field>
      <Button type="submit" variant="secondary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Request appraisal"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-secondary">{error}</span> : null}
    </label>
  );
}
