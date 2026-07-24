"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { VehicleSearch } from "@/features/inventory/vehicle-search";
import { cn } from "@/utils/cn";

export function HomeHero({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={image}
        alt="ARISTO luxury dealership showroom atmosphere"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--hero-overlay)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.22),transparent_35%)]" aria-hidden />

      <div className="section-shell relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32 sm:pb-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="font-display text-4xl tracking-[0.28em] text-white sm:text-5xl md:text-6xl">
            ARISTO
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/inventory"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Browse Inventory
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 bg-white/10 text-white hover:bg-white/20",
              )}
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-10"
        >
          <div className="glass max-w-4xl rounded-2xl p-3 shadow-lift sm:p-4">
            <div className="mb-3 flex items-center gap-2 px-1 text-sm text-white/80">
              <Search className="h-4 w-4" />
              Search vehicles
            </div>
            <VehicleSearch light />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
