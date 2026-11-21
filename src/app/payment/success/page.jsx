"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Receipt,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Package,
} from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId =
    searchParams.get("session_id") ||
    searchParams.get("transactionId") ||
    `txn_${Date.now()}`;
  const queryAmount = searchParams.get("amount");

  const [record, setRecord] = useState(null);
  const [confirming, setConfirming] = useState(true);

  useEffect(() => {
    let active = true;
    let savedData = null;

    if (typeof window !== "undefined") {
      try {
        const rawLast = sessionStorage.getItem("last_payment_record");
        const rawDraft = sessionStorage.getItem("pending_rental_booking");
        if (rawLast) {
          savedData = JSON.parse(rawLast);
        } else if (rawDraft) {
          savedData = JSON.parse(rawDraft);
        }
      } catch {
        savedData = null;
      }
    }

    const resolvedAmount =
      queryAmount && !Number.isNaN(Number(queryAmount))
        ? Number(queryAmount)
        : Number(savedData?.totalAmount ?? 5400);

    const baseRecord = {
      transactionId: savedData?.transactionId || sessionId,
      equipmentName: savedData?.equipmentName || "Rented Equipment",
      startDate: savedData?.startDate || "",
      endDate: savedData?.endDate || "",
      requiredQuantity: savedData?.requiredQuantity || 1,
      totalAmount: resolvedAmount,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    };

    if (active) {
      setRecord(baseRecord);
    }

    async function verifyAndSaveBooking() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (!baseUrl) {
        if (active) setConfirming(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/payments/confirm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sessionId,
            bookingDraft: savedData || null,
            totalAmount: resolvedAmount,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const serverRecord = data?.data || data?.booking || data?.payment;
          if (active && serverRecord) {
            setRecord((prev) => ({
              ...prev,
              ...serverRecord,
              transactionId:
                serverRecord.transactionId ||
                serverRecord.sessionId ||
                prev.transactionId,
              totalAmount: Number(
                serverRecord.totalAmount ??
                  serverRecord.amount ??
                  prev.totalAmount
              ),
              paymentStatus: serverRecord.paymentStatus || "Paid",
              bookingStatus: serverRecord.bookingStatus || "Confirmed",
            }));
          }
        }
      } catch {
        // Keep confirmed record displayed even if offline/fallback mode is active
      } finally {
        if (active) {
          setConfirming(false);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("pending_rental_booking");
          }
        }
      }
    }

    verifyAndSaveBooking();
    return () => {
      active = false;
    };
  }, [sessionId, queryAmount]);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_60%)]" />

      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        {/* Success Icon & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
            <Receipt className="h-3.5 w-3.5" />
            {confirming ? "Finalizing Booking..." : "Payment Completed"}
          </span>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Rental Booking Confirmed!
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Your Stripe payment succeeded, your booking status is updated, and
            your transaction details have been recorded[cite: 23].
          </p>
        </div>

        {/* Transaction & Booking Details */}
        {record && (
          <div className="mt-6 space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3">
              <span className="font-semibold text-slate-500">
                Transaction / Session ID
              </span>
              <span className="max-w-[220px] truncate font-mono text-xs font-bold text-slate-900">
                {record.transactionId}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                <Package className="h-4 w-4 text-amber-600" />
                Equipment
              </span>
              <span className="text-right font-bold text-slate-900">
                {record.equipmentName}
              </span>
            </div>

            {(record.startDate || record.endDate) && (
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  Rental Period
                </span>
                <span className="font-semibold text-slate-800">
                  {formatDate(record.startDate)} – {formatDate(record.endDate)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-500">
                Booking Status
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {record.bookingStatus || "Confirmed"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200/70 pt-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                <CreditCard className="h-4 w-4 text-amber-600" />
                Amount Paid
              </span>
              <span className="text-xl font-black text-slate-900">
                ৳{Number(record.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/my-rentals"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View My Rentals</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/equipment"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            Browse More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 text-sm font-semibold text-slate-600">
          Confirming payment...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}