"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  RotateCcw,
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const bookingId = searchParams.get("bookingId");

  const retryCheckoutHref = bookingId
    ? `/payment/checkout?bookingId=${encodeURIComponent(bookingId)}`
    : "/payment/checkout";

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.1),transparent_60%)]" />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 ring-8 ring-rose-50">
            <XCircle className="h-9 w-9" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            Payment Cancelled
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Payment Was Not Completed
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your Stripe payment session was cancelled or interrupted. No amount
            has been charged to your card, and your rental booking remains
            unconfirmed[cite: 23].
          </p>

          {reason && (
            <div className="mt-4 w-full rounded-xl border border-rose-200/80 bg-rose-50/70 px-4 py-2.5 text-xs font-semibold text-rose-800">
              Reason: {reason}
            </div>
          )}
        </div>

        <div className="mt-7 space-y-3">
          <Link
            href={retryCheckoutHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Payment Again</span>
          </Link>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/equipment"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Browse Equipment</span>
            </Link>

            <Link
              href="/dashboard/my-rentals"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>My Rentals</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 text-sm font-semibold text-slate-600">
          Loading...
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}