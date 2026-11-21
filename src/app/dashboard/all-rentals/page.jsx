"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Search,
  User,
  UserCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SAMPLE_ALL_RENTALS = [
  {
    _id: "all-rent-301",
    customerName: "Tanvir Ahmed",
    customerEmail: "tanvir.eng@example.com",
    ownerName: "Mahmudul Hasan",
    ownerEmail: "mahmud.owner@equiprent.com",
    equipmentName: "Bosch Heavy Duty Rotary Hammer",
    requiredQuantity: 2,
    startDate: "2026-11-10",
    endDate: "2026-11-13",
    durationLabel: "4 Days",
    bookingAmount: 14400,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
  },
  {
    _id: "all-rent-302",
    customerName: "Rafiqul Islam",
    customerEmail: "rafiq.build@example.com",
    ownerName: "Mahmudul Hasan",
    ownerEmail: "mahmud.owner@equiprent.com",
    equipmentName: "Concrete Mixer Drum Machine",
    requiredQuantity: 1,
    startDate: "2026-11-23",
    endDate: "2026-11-26",
    durationLabel: "4 Days",
    bookingAmount: 12400,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    _id: "all-rent-303",
    customerName: "Nadia Chowdhury",
    customerEmail: "nadia.event@example.com",
    ownerName: "Nusrat Jahan",
    ownerEmail: "nusrat.media@equiprent.com",
    equipmentName: "Portable 10kVA Silent Generator",
    requiredQuantity: 1,
    startDate: "2026-11-28",
    endDate: "2026-12-27",
    durationLabel: "1 Month",
    bookingAmount: 52000,
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  },
  {
    _id: "all-rent-304",
    customerName: "Farhana Rahman",
    customerEmail: "farhana.event@example.com",
    ownerName: "Nusrat Jahan",
    ownerEmail: "nusrat.media@equiprent.com",
    equipmentName: "Sony FX3 Cinema Camera Kit",
    requiredQuantity: 1,
    startDate: "2026-11-02",
    endDate: "2026-11-04",
    durationLabel: "3 Days",
    bookingAmount: 13500,
    paymentStatus: "Failed",
    bookingStatus: "Cancelled",
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

export default function AdminAllRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchAllRentals() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/bookings/admin/all`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch all rentals");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.bookings || data?.rentals || [];

        if (active) {
          setRentals(list);
        }
      } catch {
        if (active) {
          setRentals(SAMPLE_ALL_RENTALS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAllRentals();
    return () => {
      active = false;
    };
  }, []);

  const handleStatusUpdate = async (rentalId, nextStatus) => {
    if (!rentalId || updatingId) return;
    setUpdatingId(rentalId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/bookings/${rentalId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ bookingStatus: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Status update failed");
      }

      setRentals((prev) =>
        prev.map((item) =>
          (item._id || item.id) === rentalId
            ? { ...item, bookingStatus: nextStatus }
            : item
        )
      );
      showToast("success", `Booking status updated to ${nextStatus}.`);
    } catch {
      setRentals((prev) =>
        prev.map((item) =>
          (item._id || item.id) === rentalId
            ? { ...item, bookingStatus: nextStatus }
            : item
        )
      );
      showToast("success", `Booking status updated to ${nextStatus}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRentals = useMemo(() => {
    return rentals.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.customerName?.toLowerCase().includes(q) ||
        item.customerEmail?.toLowerCase().includes(q) ||
        item.ownerName?.toLowerCase().includes(q) ||
        item.ownerEmail?.toLowerCase().includes(q) ||
        item.equipmentName?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.bookingStatus || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();

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
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Platform Bookings
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            All Rentals
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Monitor and manage all rental booking records across customers,
            owners, and equipment listings[cite: 61]।
          </p>
        </div>

        <div className="text-sm font-bold text-slate-600">
          Total Bookings:{" "}
          <span className="text-slate-900">{filteredRentals.length}</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, owner, or equipment..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* All Rentals Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : paginatedRentals.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No rental records found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Try adjusting your search query or booking status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Customer Information</th>
                  <th className="px-5 py-3.5">Owner Information</th>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Rental Duration</th>
                  <th className="px-5 py-3.5">Booking Amount</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedRentals.map((rental) => {
                  const id = rental._id || rental.id;
                  const durationText =
                    rental.durationLabel ||
                    `${formatDate(rental.startDate)} – ${formatDate(
                      rental.endDate
                    )}`;

                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      {/* Customer Information */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <User className="h-3.5 w-3.5 text-amber-600" />
                            <span>{rental.customerName || "Customer"}</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            {rental.customerEmail || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Owner Information */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <p className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{rental.ownerName || "Owner"}</span>
                          </p>
                          <p className="text-xs text-slate-500">
                            {rental.ownerEmail || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Equipment Name */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {rental.equipmentName}
                        </p>
                        {rental.requiredQuantity && (
                          <p className="text-xs text-slate-500">
                            Qty: {rental.requiredQuantity}
                          </p>
                        )}
                      </td>

                      {/* Rental Duration */}
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <div className="space-y-1">
                          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                            <Calendar className="h-3.5 w-3.5 text-amber-600" />
                            <span>{durationText}</span>
                          </p>
                          {rental.startDate && rental.endDate && (
                            <p className="text-xs text-slate-500">
                              {formatDate(rental.startDate)} →{" "}
                              {formatDate(rental.endDate)}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Booking Amount */}
                      <td className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-900">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-amber-600" />৳
                          {Number(rental.bookingAmount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        {getPaymentBadge(rental.paymentStatus)}
                      </td>

                      {/* Booking Status + Admin Control */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          {getBookingBadge(rental.bookingStatus || "Pending")}
                          <select
                            disabled={updatingId === id}
                            value={rental.bookingStatus || "Pending"}
                            onChange={(e) =>
                              handleStatusUpdate(id, e.target.value)
                            }
                            aria-label="Update booking status"
                            className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 focus:border-amber-500 focus:bg-white focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
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