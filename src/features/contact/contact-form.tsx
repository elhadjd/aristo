"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/services/pages";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  interest: z.enum(["purchase", "financing", "trade-in", "service", "general"]),
  subject: z.string().optional(),
  message: z.string().min(10, "Please share a few more details"),
  vehicleId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm({
  vehicleId,
  defaultInterest = "general",
}: {
  vehicleId?: string;
  defaultInterest?: FormValues["interest"];
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      interest: defaultInterest,
      vehicleId,
      subject: vehicleId ? "Vehicle inquiry" : "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitContact(values);
      toast.success("Message sent. Our team will respond shortly.");
      reset({ interest: defaultInterest, vehicleId, name: "", email: "", phone: "", message: "", subject: vehicleId ? "Vehicle inquiry" : "" });
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || "Unable to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name?.message}>
          <Input {...register("name")} autoComplete="name" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" {...register("email")} autoComplete="email" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone?.message}>
          <Input type="tel" {...register("phone")} autoComplete="tel" />
        </Field>
        <Field label="Interest" error={errors.interest?.message}>
          <Select {...register("interest")}>
            <option value="general">General</option>
            <option value="purchase">Purchase</option>
            <option value="financing">Financing</option>
            <option value="trade-in">Trade-In</option>
            <option value="service">Service</option>
          </Select>
        </Field>
      </div>
      <Field label="Subject" error={errors.subject?.message}>
        <Input {...register("subject")} />
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} />
      </Field>
      <input type="hidden" {...register("vehicleId")} />
      <Button type="submit" variant="secondary" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Send message"}
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
