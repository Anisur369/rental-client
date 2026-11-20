"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  ShieldCheck,
  CalendarClock,
  LockKeyhole,
  Award,
  ArrowRight,
} from "lucide-react";

const BENEFITS = [
  {
    id: "affordable-prices",
    title: "Affordable Rental Prices",
    description:
      "Save big on capital costs by renting high-value equipment only when you need it, with clear and transparent rate structures.",
    badge: "Cost-Effective",
    icon: BadgeDollarSign,
    iconStyle:
      "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950",
  },
  {
    id: "verified-owners",
    title: "Verified Equipment Owners",
    description:
      "Every equipment owner and listing goes through review and approval so you can rent from trusted providers with peace of mind.",
    badge: "Vetted Providers",
    icon: ShieldCheck,
    iconStyle:
      "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    id: "flexible-periods",
    title: "Flexible Rental Periods",
    description:
      "Book on a daily, weekly, or monthly basis tailored to short sprints, seasonal work, or long-term projects without lock-in.",
    badge: "Daily · Weekly · Monthly",
    icon: CalendarClock,
    iconStyle:
      "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
  },
  {
    id: "secure-payments",
    title: "Secure Online Payments",
    description:
      "Complete bookings confidently through Stripe-powered checkout with instant confirmation and recorded transaction history.",
    badge: "Stripe Protected",
    icon: LockKeyhole,
    iconStyle:
      "bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center space-y-2.5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Award className="h-3.5 w-3.5" />
            Platform Advantages
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Why Choose Us
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Built to connect equipment owners and renters through a transparent,
            reliable, and hassle-free marketplace[cite: 47, 49].
          </p>
        </motion.div>

        {/* 4 Equal-Height Benefit Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map((benefit) => {
            const IconComponent = benefit.icon;

            return (
              <motion.div
                key={benefit.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${benefit.iconStyle}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {benefit.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {benefit.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {benefit.description}
                </p>

                <div className="mt-auto pt-5">
                  <div className="h-1 w-10 rounded-full bg-amber-400/70 transition-all duration-300 group-hover:w-16 group-hover:bg-amber-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row"
        >
          <div className="text-center sm:text-left">
            <p className="text-base font-bold text-slate-900">
              Have equipment sitting idle or need gear for your next project?
            </p>
            <p className="text-sm text-slate-600">
              Start browsing approved listings or register to manage rentals and
              bookings[cite: 48, 49, 51].
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Link
              href="/all-equipment"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
            >
              <span>Browse Equipment</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}