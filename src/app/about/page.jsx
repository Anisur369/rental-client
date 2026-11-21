import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Clock,
  CreditCard,
  Layers,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PLATFORM_PILLARS = [
  {
    icon: Layers,
    title: "Wide Equipment Catalog",
    description:
      "Access construction tools, cinema cameras, vehicles, agricultural gear, electronics, and event equipment in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Owners & RBAC",
    description:
      "Role-based workflows for Customers, Equipment Owners, and Admins keep listings vetted and transactions accountable.",
  },
  {
    icon: Clock,
    title: "Flexible Rental Durations",
    description:
      "Book by day, week, or month based on your project timeline, with transparent availability and clear terms.",
  },
  {
    icon: CreditCard,
    title: "Secure Stripe Payments",
    description:
      "Complete rental checkout safely through Stripe with instant booking confirmation and transaction tracking.",
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Browse & Filter Equipment",
    text: "Search by name, category, location, rental type, price range, or availability to find the exact gear you need.",
  },
  {
    step: "02",
    title: "Select Dates & Book",
    text: "Pick your rental start and end dates, required quantity, and delivery details to calculate your total automatically.",
  },
  {
    step: "03",
    title: "Pay & Track in Dashboard",
    text: "Complete payment via Stripe and monitor active rentals, payment status, and favorites from your dashboard.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30">
              <Wrench className="h-3.5 w-3.5" />
              About EquipRent
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built for Fast, Transparent{" "}
              <span className="text-amber-400">Equipment Rentals</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              EquipRent connects equipment owners with contractors, creators,
              event planners, and businesses who need reliable tools without
              the high cost of outright purchase.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
              >
                <span>Explore Equipment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-slate-800"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Stats */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Our Mission &amp; Platform Vision
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Heavy machinery, camera kits, power generators, and specialized
              gear often sit idle between projects. Our goal is to make
              high-value equipment accessible on demand while helping owners
              generate steady rental income.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              With dedicated Customer, Owner, and Admin workflows, every
              listing goes through structured review, every booking tracks
              duration and payment status clearly, and every user gets a
              focused dashboard experience.
            </p>

            <ul className="space-y-2.5 pt-2 text-sm font-semibold text-slate-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Clear daily, weekly, and monthly pricing with no hidden surprises</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Dedicated dashboards for renting, listing inventory, and oversight</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Responsive experience across mobile, tablet, and desktop screens</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-amber-600">6+</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Equipment Categories
              </p>
              <p className="mt-1 text-xs text-slate-500">
                From industrial tools to event &amp; media gear
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-slate-900">3 Roles</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                RBAC Dashboards
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Customer, Owner &amp; Admin controls
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-slate-900">Stripe</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Secure Checkout
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Instant confirmation &amp; records
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-3xl font-black text-amber-600">24/7</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Booking Access
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Manage rentals anytime online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Why EquipRent
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Designed for Reliability &amp; Speed
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs transition hover:border-amber-400 hover:bg-white"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              How It Works
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Three Simple Steps to Rent
            </h2>
          </div>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-600 hover:underline"
          >
            <Users className="h-4 w-4" />
            <span>Create a free account</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {WORKFLOW_STEPS.map((item) => (
            <div
              key={item.step}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="inline-flex w-fit rounded-xl bg-slate-950 px-3 py-1 text-xs font-extrabold text-amber-400">
                STEP {item.step}
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}