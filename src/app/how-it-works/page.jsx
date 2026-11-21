import Link from "next/link";
import {
  Wrench,
  Search,
  CalendarCheck,
  CreditCard,
  PackagePlus,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

const CUSTOMER_STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Find & Compare Equipment",
    description:
      "Browse approved listings by equipment name, category, location, rental type (Daily, Weekly, Monthly), price range, or availability[cite: 2, 8].",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Select Dates & Quantity",
    description:
      "Open equipment details, choose your rental start and end dates, required quantity, contact number, and delivery address[cite: 7].",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Pay Securely via Stripe",
    description:
      "Review the calculated rental amount, complete Stripe checkout, and track your booking status and payment history in My Rentals[cite: 2, 7, 9].",
  },
];

const OWNER_STEPS = [
  {
    step: "01",
    icon: PackagePlus,
    title: "List Your Equipment",
    description:
      "Add equipment details, brand, model, condition, rental pricing, rental terms, and upload photos via imgbb—starting with Pending status[cite: 10].",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Admin Approval & Visibility",
    description:
      "Admins review and approve listings so verified equipment becomes live for customers across the platform[cite: 2, 12].",
  },
  {
    step: "03",
    icon: ClipboardList,
    title: "Manage Inventory & Rentals",
    description:
      "Update pricing or quantities in My Equipment and monitor customer rental durations, booking amounts, and payment status[cite: 10, 11].",
  },
];

const FAQS = [
  {
    q: "How is the total rental amount calculated?",
    a: "The total rental amount is calculated from the equipment's rental rate (Daily, Weekly, or Monthly), rental duration, and required quantity before Stripe checkout[cite: 2, 7].",
  },
  {
    q: "What happens when a new equipment item is added?",
    a: "Newly added equipment starts in Pending status until an Admin reviews and approves it for public rental browsing[cite: 2, 10, 12].",
  },
  {
    q: "Where can I view my bookings and saved favorites?",
    a: "Logged-in customers can view active and past bookings under My Rentals and manage saved items under Favorites in the dashboard[cite: 9].",
  },
  {
    q: "What if a payment is cancelled or fails?",
    a: "If checkout is cancelled or not completed, no charge is finalized and you can retry payment or return to browse equipment[cite: 2].",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30">
              <Wrench className="h-3.5 w-3.5" />
              How It Works
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Simple Rental Flow for{" "}
              <span className="text-amber-400">Renters &amp; Owners</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
              See how customers book equipment with transparent pricing and
              Stripe checkout, and how equipment owners list inventory and
              track incoming rentals[cite: 2, 7, 11].
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                href="/equipment"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
              >
                <span>Browse Equipment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/dashboard/add-equipment"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-slate-800"
              >
                <span>List Equipment</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            For Customers
          </span>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            How to Rent Equipment in 3 Steps
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CUSTOMER_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-400"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-xl bg-slate-950 px-3 py-1 text-xs font-extrabold text-amber-400">
                    STEP {item.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* For Equipment Owners */}
      <section className="border-y border-slate-200 bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              For Equipment Owners
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              How to List &amp; Manage Rentals
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {OWNER_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs transition hover:border-amber-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex rounded-xl bg-amber-500 px-3 py-1 text-xs font-extrabold text-slate-950">
                      STEP {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">
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

      {/* Common Questions */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
              <HelpCircle className="h-4 w-4" />
              Quick Answers
            </span>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Frequently Asked Questions
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-600 hover:underline"
          >
            <span>Need more help? Contact Us</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FAQS.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="flex items-start gap-2.5 text-base font-extrabold text-slate-900">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-2.5 pl-6.5 text-sm leading-relaxed text-slate-600">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}