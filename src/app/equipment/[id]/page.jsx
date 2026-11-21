"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  ArrowLeft,
  Heart,
  CalendarCheck,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Mail,
  Phone,
  ShieldCheck,
  FileText,
  X,
  CreditCard,
  Package,
} from "lucide-react";

const FALLBACK_EQUIPMENT_MAP = {
  "eq-1": {
    _id: "eq-1",
    name: "Bosch Heavy Duty Rotary Hammer",
    description:
      "Industrial-grade SDS-Plus rotary hammer designed for heavy concrete drilling, chiseling, and renovation tasks. Comes with auxiliary handle, depth gauge, and carrying case.",
    category: "Construction Equipment",
    rentalPrice: 1800,
    rentalType: "Daily",
    location: "Gazipur, Dhaka",
    availableQuantity: 4,
    brand: "Bosch",
    model: "GBH 2-26 DRE",
    condition: "Excellent",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80",
    owner: {
      name: "Apex Heavy Rentals",
      email: "owner.apex@equiprent.com",
      phone: "+880 1711-223344",
    },
    termsAndConditions:
      "1. Renter must return the equipment clean and in working condition.\n2. Valid NID copy required upon delivery or pickup.\n3. Late returns incur an additional daily charge.\n4. Physical damage caused by misuse is the renter's responsibility.",
  },
  "eq-2": {
    _id: "eq-2",
    name: "Sony FX3 Cinema Camera Kit",
    description:
      "Full-frame cinema line camera package with XLR top handle, two high-capacity batteries, dual charger, and protective hard case—ready for commercial and documentary shoots.",
    category: "Photography Equipment",
    rentalPrice: 4500,
    rentalType: "Daily",
    location: "Banani, Dhaka",
    availableQuantity: 2,
    brand: "Sony",
    model: "ILME-FX3",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    owner: {
      name: "LensCraft Media Hub",
      email: "lenscraft@equiprent.com",
      phone: "+880 1812-334455",
    },
    termsAndConditions:
      "1. Sensor and lens mount must remain capped when not in use.\n2. Do not expose to rain or extreme dust without weather protection.\n3. Return all batteries, cables, and accessories included in the kit.",
  },
};

function calculateRentalUnits(startDate, endDate, rentalType) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return 0;

  const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);

  if (rentalType === "Weekly") {
    return Math.max(1, Math.ceil(totalDays / 7));
  }
  if (rentalType === "Monthly") {
    return Math.max(1, Math.ceil(totalDays / 30));
  }
  return totalDays;
}

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const equipmentId = params?.id;

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Favorites state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Booking modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Protect Private Route without redirecting while session is still resolving
  useEffect(() => {
    if (!isPending && !session?.user && equipmentId) {
      router.replace(
        `/sign-in?callbackUrl=${encodeURIComponent(`/equipment/${equipmentId}`)}`
      );
    }
  }, [isPending, session, equipmentId, router]);

  // Fetch Equipment Details
  useEffect(() => {
    if (!equipmentId || isPending || !session?.user) return;

    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function loadDetails() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/equipment/${equipmentId}`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Equipment not found");

        const data = await res.json();
        const item = data?.data || data?.equipment || data;
        if (active) {
          setEquipment(item);
        }
      } catch {
        const fallback =
          FALLBACK_EQUIPMENT_MAP[equipmentId] || FALLBACK_EQUIPMENT_MAP["eq-1"];
        if (active) {
          setEquipment({ ...fallback, _id: equipmentId });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetails();
    return () => {
      active = false;
    };
  }, [equipmentId, isPending, session]);

  const billingUnits = useMemo(() => {
    return calculateRentalUnits(
      startDate,
      endDate,
      equipment?.rentalType || "Daily"
    );
  }, [startDate, endDate, equipment?.rentalType]);

  const totalAmount = useMemo(() => {
    const rate = Number(equipment?.rentalPrice || 0);
    const qty = Math.max(1, Number(requiredQuantity || 1));
    return billingUnits * rate * qty;
  }, [billingUnits, equipment?.rentalPrice, requiredQuantity]);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleAddToFavorites = async () => {
    if (!equipment || favLoading) return;
    setFavLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          equipmentId: equipment._id || equipmentId,
          equipmentName: equipment.name,
          category: equipment.category,
          rentalPrice: equipment.rentalPrice,
          rentalType: equipment.rentalType,
          image: equipment.image,
          userEmail: session?.user?.email,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Could not save favorite");
      }

      setIsFavorited(true);
      showToast("success", "Added to your favorites list!");
    } catch (err) {
      showToast(
        "error",
        err.message || "Failed to save favorite. Check backend connection."
      );
    } finally {
      setFavLoading(false);
    }
  };

  const handleBookingConfirm = async (e) => {
    e.preventDefault();
    setBookingError("");

    const available = Number(equipment?.availableQuantity ?? 0);
    const qty = Number(requiredQuantity);

    if (!startDate || !endDate) {
      setBookingError("Please select both rental start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setBookingError("Rental end date cannot be earlier than start date.");
      return;
    }

    if (qty < 1 || qty > available) {
      setBookingError(
        `Requested quantity must be between 1 and ${available} available units.`
      );
      return;
    }

    if (!contactNumber.trim() || !deliveryAddress.trim()) {
      setBookingError("Contact number and delivery address are required.");
      return;
    }

    setBookingSubmitting(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const bookingPayload = {
      equipmentId: equipment._id || equipmentId,
      equipmentName: equipment.name,
      ownerEmail: equipment.owner?.email || equipment.ownerEmail || "",
      customerName: session?.user?.name,
      customerEmail: session?.user?.email,
      startDate,
      endDate,
      requiredQuantity: qty,
      contactNumber: contactNumber.trim(),
      deliveryAddress: deliveryAddress.trim(),
      additionalNotes: additionalNotes.trim(),
      totalAmount,
      rentalType: equipment.rentalType || "Daily",
    };

    try {
      const res = await fetch(`${baseUrl}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Unable to initiate Stripe payment");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      if (data?.bookingId) {
        router.push(`/payment/${data.bookingId}`);
        return;
      }

      throw new Error("Stripe checkout URL was not returned by server.");
    } catch (err) {
      setBookingError(
        err.message || "Payment initialization failed. Please try again."
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <section className="min-h-screen bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-96 animate-pulse rounded-2xl bg-slate-200 lg:col-span-6" />
            <div className="space-y-4 lg:col-span-6">
              <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!session?.user || !equipment) {
    return null;
  }

  const availableQty = Number(equipment.availableQuantity ?? 0);
  const isAvailable = availableQty > 0;
  const ownerName =
    equipment.owner?.name || equipment.ownerName || "Verified Equipment Owner";
  const ownerEmail =
    equipment.owner?.email || equipment.ownerEmail || "owner@equiprent.com";
  const ownerPhone =
    equipment.owner?.phone || equipment.ownerPhone || "+880 1700-000000";

  return (
    <section className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Toast Notification Banner */}
        {feedback && (
          <div
            className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="ml-4 text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Equipment</span>
          </Link>
        </div>

        {/* Top Main Grid: Equipment Image + Core Details */}
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-12">
          {/* Left: Equipment Image */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={equipment.image}
                alt={equipment.name}
                className="h-72 w-full object-cover sm:h-[420px]"
              />
              <span
                className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    In Stock ({availableQty} available)
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Currently Unavailable
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Right: Equipment Info & Action Buttons */}
          <div className="flex flex-col lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                <Tag className="h-3.5 w-3.5" />
                {equipment.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {equipment.rentalType || "Daily"} Rental
              </span>
              {equipment.condition && (
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  Condition: {equipment.condition}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {equipment.name}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-600" />
                {equipment.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Package className="h-4 w-4 text-amber-600" />
                Available Qty: <strong className="text-slate-900">{availableQty}</strong>
              </span>
            </div>

            {/* Pricing Box */}
            <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                Rental Rate
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">
                  ৳{Number(equipment.rentalPrice).toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  / {equipment.rentalType || "Day"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Description
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {equipment.description}
              </p>
            </div>

            {(equipment.brand || equipment.model) && (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-sm">
                {equipment.brand && (
                  <div>
                    <span className="text-xs text-slate-500">Brand</span>
                    <p className="font-bold text-slate-900">{equipment.brand}</p>
                  </div>
                )}
                {equipment.model && (
                  <div>
                    <span className="text-xs text-slate-500">Model</span>
                    <p className="font-bold text-slate-900">{equipment.model}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons: Book Now + Add to Favorites */}
            <div className="mt-auto pt-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 cursor-pointer"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>{isAvailable ? "Book Now" : "Out of Stock"}</span>
                </button>

                <button
                  type="button"
                  disabled={favLoading || isFavorited}
                  onClick={handleAddToFavorites}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-bold transition cursor-pointer ${
                    isFavorited
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-300 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-700"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorited ? "fill-rose-600 text-rose-600" : ""
                    }`}
                  />
                  <span>
                    {favLoading
                      ? "Saving..."
                      : isFavorited
                      ? "Saved to Favorites"
                      : "Add to Favorites"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Two Cards: Owner Information + Rental Terms & Conditions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Owner Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <UserCheck className="h-5 w-5 text-amber-600" />
              <h2>Owner Information</h2>
            </div>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-extrabold text-amber-800">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-slate-900">{ownerName}</p>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">Verified Equipment Provider</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{ownerEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{ownerPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{equipment.location}</span>
              </li>
            </ul>
          </div>

          {/* Rental Terms and Conditions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <FileText className="h-5 w-5 text-amber-600" />
              <h2>Rental Terms and Conditions</h2>
            </div>

            <div className="mt-4 whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {equipment.termsAndConditions ||
                "Standard platform rental terms apply. Equipment must be returned on time and in its original working condition."}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Book Equipment
                </h2>
                <p className="text-xs text-slate-500">{equipment.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookingConfirm} className="mt-5 space-y-4">
              {bookingError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                  {bookingError}
                </div>
              )}

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Rental Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Rental End Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Required Quantity & Contact Number */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Required Quantity (Max {availableQty}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={availableQty}
                    value={requiredQuantity}
                    onChange={(e) => setRequiredQuantity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House, Road, Area, City"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Additional Notes
                </label>
                <textarea
                  rows="3"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Preferred delivery time or special instructions..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Live Price Calculation Summary */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm">
                <div className="flex items-center justify-between text-slate-700">
                  <span>
                    Duration ({equipment.rentalType || "Daily"} units):
                  </span>
                  <span className="font-semibold">{billingUnits}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-700">
                  <span>Rate &times; Quantity:</span>
                  <span className="font-semibold">
                    ৳{Number(equipment.rentalPrice).toLocaleString()} &times;{" "}
                    {Math.max(1, Number(requiredQuantity || 1))}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-amber-200 pt-2.5 text-base font-extrabold text-slate-900">
                  <span>Total Rental Amount:</span>
                  <span>৳{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting || totalAmount <= 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {bookingSubmitting
                      ? "Redirecting to Stripe..."
                      : "Confirm & Proceed to Payment"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}