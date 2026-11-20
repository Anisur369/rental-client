"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Search, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function BannerSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle Background Grid & Amber Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_48%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Title, Description & CTA Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Trusted Equipment Rental Marketplace</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.15]"
            >
              Rent Reliable Gear.{" "}
              <span className="text-amber-400">List Idle Equipment</span> with
              Confidence.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0"
            >
              From construction tools and photography gear to vehicles,
              agriculture machinery, electronics, and event setups—browse verified
              listings, book for flexible durations, and pay securely online in
              one transparent platform[cite: 2, 4].
            </motion.p>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center gap-3.5 pt-1 sm:flex-row lg:justify-start"
            >
              <Link
                href="/equipment"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 sm:w-auto"
              >
                <Search className="h-4 w-4" />
                <span>Explore Equipment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 sm:w-auto"
              >
                <span>How It Works</span>
              </Link>
            </motion.div>

            {/* Quick Highlights */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-400 sm:text-sm lg:justify-start"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Owners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Daily, Weekly & Monthly Rentals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Stripe Protected Checkout</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Quality Banner Image with Floating Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative mx-auto max-w-xl lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80"
                  alt="Professional industrial and technical equipment ready for rent"
                  className="h-72 w-full object-cover sm:h-96 lg:h-[440px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              </div>

              {/* Floating Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md sm:absolute sm:-bottom-5 sm:left-5 sm:right-5 sm:mt-0"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-amber-400">
                    Flexible Booking
                  </p>
                  <p className="text-sm font-semibold text-white sm:text-base">
                    Instant availability & transparent pricing
                  </p>
                </div>
                <Link
                  href="/equipment"
                  className="shrink-0 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Browse All
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}