"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SearchCheck,
  CalendarRange,
  CreditCard,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Workflow,
  UserCheck,
  ArrowRight,
} from "lucide-react";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Browse & Compare",
    description:
      "Search approved equipment by category, location, price, or availability to find the exact tool you need[cite: 81, 84].",
    icon: SearchCheck,
    badgeStyle: "bg-amber-100 text-amber-800",
  },
  {
    step: "02",
    title: "Select Rental Period",
    description:
      "Pick your start and end dates, choose required quantity, and review transparent daily, weekly, or monthly rates[cite: 82, 83].",
    icon: CalendarRange,
    badgeStyle: "bg-sky-100 text-sky-800",
  },
  {
    step: "03",
    title: "Pay Securely via Stripe",
    description:
      "Complete checkout safely with Stripe and receive instant booking confirmation and transaction records in your dashboard[cite: 83, 85].",
    icon: CreditCard,
    badgeStyle: "bg-emerald-100 text-emerald-800",
  },
];

const TRUSTED_OWNERS = [
  {
    id: "owner-1",
    name: "Apex Heavy Rentals",
    specialty: "Construction & Power Tools",
    location: "Gazipur, Dhaka",
    verifiedItems: "38 Approved Items",
    completedRentals: "240+ Rentals",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "owner-2",
    name: "LensCraft Media Hub",
    specialty: "Cinema Cameras & Lighting",
    location: "Banani, Dhaka",
    verifiedItems: "26 Approved Items",
    completedRentals: "185+ Rentals",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: "owner-3",
    name: "GreenField Agro & Fleet",
    specialty: "Agriculture & Cargo Vehicles",
    location: "Sadar, Gazipur",
    verifiedItems: "31 Approved Items",
    completedRentals: "210+ Rentals",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
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

function ExtraSections() {
  return (
    <div className="bg-slate-50">
      {/* Extra Section 1: How It Works */}
      <section className="border-t border-slate-200/80 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center space-y-2.5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Workflow className="h-3.5 w-3.5" />
              Simple Process
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              How It Works
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Renting equipment takes just three straightforward steps from
              selection to secure payment confirmation[cite: 79, 82, 83].
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {HOW_IT_WORKS_STEPS.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.step}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.badgeStyle}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-200">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-5">
                    <div className="h-1 w-10 rounded-full bg-amber-400" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Extra Section 2: Trusted Equipment Owners */}
      <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                <UserCheck className="h-3.5 w-3.5" />
                Verified Providers
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Trusted Equipment Owners
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Partnering with reliable providers who keep their equipment
                well-maintained and ready for timely rentals[cite: 79, 82].
              </p>
            </div>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 sm:self-auto"
            >
              <span>Become an Owner</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {TRUSTED_OWNERS.map((owner) => (
              <motion.article
                key={owner.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-sm transition-all hover:border-amber-300 hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-amber-400/50"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-base font-bold text-slate-900">
                        {owner.name}
                      </h3>
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                    <p className="truncate text-xs font-medium text-amber-700">
                      {owner.specialty}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{owner.location}</span>
                </div>

                <div className="mt-auto pt-5">
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {owner.verifiedItems}
                    </span>
                    <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-slate-700">
                      {owner.completedRentals}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default ExtraSections;