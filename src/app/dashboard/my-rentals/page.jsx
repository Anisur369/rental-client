"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const SAMPLE_RENTALS = [
  {
    _id: "rent-101",
    equipmentId: "eq-1",
    equipmentName: "Bosch Heavy Duty Rotary Hammer",
    startDate: "2026-11-10",
    endDate: "2026-11-13",
    bookingDate: "2026-11-08",
    requiredQuantity: 1,
    totalAmount: 7200,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
  },
  {
    _id: "rent-102",
    equipmentId: "eq-2",
    equipmentName: "Sony FX3 Cinema Camera Kit",
    startDate: "2026-11-22",
    endDate: "2026-11-24",
    bookingDate: "2026-11-19",
    requiredQuantity: 1,
    totalAmount: 13500,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    _id: "rent-103",
    equipmentId: "eq-4",
    equipmentName: "Mini Power Tiller Cultivator",
    startDate: "2026-11-26",
    endDate: "2026-11-28",
    bookingDate: "2026-11-20",
    requiredQuantity: 1,
    totalAmount: 7200,
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  },
];

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

function getPaymentBadge(status) {
  const normalized = String(status || "Pending").toLowerCase();
  if (normalized === "paid" || normalized === "succeeded") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Paid
      </span>
    );
  }
  if (normalized === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
        <XCircle className="h-3.5 w-3.5" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

function getBookingBadge(status) {
  const normalized = String(status || "Pending").toLowerCase();
  if (normalized === "completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-200">
        Completed
      </span>
    );
  }
  if (normalized === "confirmed" || normalized === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        Confirmed
      </span>
    );
  }
  if (normalized === "cancelled" || normalized === "rejected") {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
        Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
      Pending
    </span>
  );
}

export default function MyRentalsPage() {
  const { data: session, isPending } = useSession();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchMyRentals() {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/bookings/my-rentals?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch rentals");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.bookings || [];

        if (active) {
          setRentals(list);
        }
      } catch {
        if (active) {
          setRentals(SAMPLE_RENTALS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchMyRentals();
    return () => {
      active = false;
    };
  }, [isPending, session]);

  const filteredRentals = useMemo(() => {
    return rentals.filter((item) => {
      const matchesSearch = item.equipmentName
        ?.toLowerCase()
        .includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        String(item.bookingStatus).toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRentals.length / pageSize));
  const paginatedRentals = filteredRentals.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <ShoppingBag className="h-3.5 w-3.5" />
            Customer Rentals
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            My Rentals
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track all your equipment rental bookings, rental dates, payment
            status, and booking progress[cite: 151, 152].
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 sm:self-auto"
        >
          <span>Rent More Equipment</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by equipment name..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
            (statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => {
                  setStatusFilter(statusOption);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === statusOption
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {statusOption}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rentals Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-12 w-full animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : paginatedRentals.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No rental bookings found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              You haven&apos;t booked any equipment matching this filter yet.
            </p>
            <Link
              href="/equipment"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              <span>Browse Equipment</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Rental Start Date</th>
                  <th className="px-5 py-3.5">Rental End Date</th>
                  <th className="px-5 py-3.5">Booking Date</th>
                  <th className="px-5 py-3.5">Total Amount</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedRentals.map((rental) => {
                  const id = rental._id || rental.id;
                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">
                        <Link
                          href={`/equipment/${rental.equipmentId}`}
                          className="hover:text-amber-700 hover:underline"
                        >
                          {rental.equipmentName}
                        </Link>
                        {rental.requiredQuantity > 1 && (
                          <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            Qty: {rental.requiredQuantity}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(rental.startDate)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(rental.endDate)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(rental.bookingDate || rental.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-amber-600" />৳
                          {Number(rental.totalAmount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {getPaymentBadge(rental.paymentStatus)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {getBookingBadge(rental.bookingStatus)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3.5">
            <span className="text-xs font-semibold text-slate-600">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}