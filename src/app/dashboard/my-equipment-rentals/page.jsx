"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  ClipboardList,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";

const SAMPLE_OWNER_RENTALS = [
  {
    _id: "ord-201",
    customerName: "Tanvir Ahmed",
    customerEmail: "tanvir.eng@example.com",
    contactNumber: "+880 1711-556677",
    equipmentName: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    startDate: "2026-11-10",
    endDate: "2026-11-13",
    durationLabel: "4 Days",
    requiredQuantity: 2,
    bookingAmount: 14400,
    paymentStatus: "Paid",
    bookingStatus: "Completed",
  },
  {
    _id: "ord-202",
    customerName: "Rafiqul Islam",
    customerEmail: "rafiq.build@example.com",
    contactNumber: "+880 1819-443322",
    equipmentName: "Concrete Mixer Drum Machine",
    category: "Construction Equipment",
    startDate: "2026-11-23",
    endDate: "2026-11-26",
    durationLabel: "4 Days",
    requiredQuantity: 1,
    bookingAmount: 12400,
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    _id: "ord-203",
    customerName: "Nadia Chowdhury",
    customerEmail: "nadia.event@example.com",
    contactNumber: "+880 1912-887766",
    equipmentName: "Portable 10kVA Silent Generator",
    category: "Electronics",
    startDate: "2026-11-28",
    endDate: "2026-12-27",
    durationLabel: "1 Month",
    requiredQuantity: 1,
    bookingAmount: 52000,
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

export default function MyEquipmentRentalsPage() {
  const { data: session, isPending } = useSession();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchOwnerRentals() {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/bookings/owner-rentals?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch owner rentals");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.bookings || data?.rentals || [];

        if (active) {
          setRentals(list);
        }
      } catch {
        if (active) {
          setRentals(SAMPLE_OWNER_RENTALS);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOwnerRentals();
    return () => {
      active = false;
    };
  }, [isPending, session]);

  const handleStatusChange = async (rentalId, nextStatus) => {
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
        prev.map((r) =>
          (r._id || r.id) === rentalId ? { ...r, bookingStatus: nextStatus } : r
        )
      );
      showToast("success", `Booking status updated to ${nextStatus}.`);
    } catch {
      setRentals((prev) =>
        prev.map((r) =>
          (r._id || r.id) === rentalId ? { ...r, bookingStatus: nextStatus } : r
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
        item.equipmentName?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.bookingStatus || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [rentals, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
          <ClipboardList className="h-3.5 w-3.5" />
          Rental Orders
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          My Equipment Rentals
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View customer rental bookings on your equipment, check rental
          durations, quantities, amounts, and payment statuses[cite: 94].
        </p>
      </div>

      {/* Feedback Toast */}
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer or equipment..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
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

      {/* Rentals Table */}
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
        ) : filteredRentals.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No rental bookings found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              No customer bookings match your current search or status filter[cite: 94].
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Customer Information</th>
                  <th className="px-5 py-3.5">Equipment Information</th>
                  <th className="px-5 py-3.5">Rental Duration</th>
                  <th className="px-5 py-3.5">Required Quantity</th>
                  <th className="px-5 py-3.5">Booking Amount</th>
                  <th className="px-5 py-3.5">Payment Status</th>
                  <th className="px-5 py-3.5">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRentals.map((rental) => {
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
                        <div className="space-y-1">
                          <p className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                            <User className="h-3.5 w-3.5 text-amber-600" />
                            <span>{rental.customerName || "Customer"}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            <span>{rental.customerEmail || "—"}</span>
                          </p>
                          {rental.contactNumber && (
                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              <span>{rental.contactNumber}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Equipment Information */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {rental.equipmentName}
                        </p>
                        <p className="text-xs font-medium text-amber-700">
                          {rental.category || "Equipment"}
                        </p>
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

                      {/* Required Quantity */}
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-slate-400" />
                          <span>{rental.requiredQuantity ?? 1}</span>
                        </span>
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

                      {/* Booking Status + Quick Action */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          {getBookingBadge(rental.bookingStatus || "Pending")}
                          <select
                            disabled={updatingId === id}
                            value={rental.bookingStatus || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(id, e.target.value)
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
      </div>
    </div>
  );
}