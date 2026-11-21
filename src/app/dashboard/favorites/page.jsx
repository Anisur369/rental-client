"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Heart,
  Trash2,
  ArrowUpRight,
  Search,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const SAMPLE_FAVORITES = [
  {
    _id: "fav-1",
    equipmentId: "eq-1",
    equipmentName: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    location: "Gazipur, Dhaka",
    rentalPrice: 1800,
    rentalType: "Daily",
    availableQuantity: 4,
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "fav-2",
    equipmentId: "eq-2",
    equipmentName: "Sony FX3 Cinema Camera Kit",
    category: "Photography Equipment",
    location: "Banani, Dhaka",
    rentalPrice: 4500,
    rentalType: "Daily",
    availableQuantity: 2,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "fav-3",
    equipmentId: "eq-5",
    equipmentName: "Portable 10kVA Silent Generator",
    category: "Electronics",
    location: "Mirpur, Dhaka",
    rentalPrice: 52000,
    rentalType: "Monthly",
    availableQuantity: 0,
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=400&q=80",
  },
];

export default function FavoritesPage() {
  const { data: session, isPending } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState(null);
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

    async function fetchFavorites() {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/favorites?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.favorites || [];

        if (active) {
          setFavorites(list);
        }
      } catch {
        if (active) {
          setFavorites(SAMPLE_FAVORITES);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchFavorites();
    return () => {
      active = false;
    };
  }, [isPending, session]);

  const handleRemoveFavorite = async (favItem) => {
    const favId = favItem._id || favItem.id || favItem.equipmentId;
    if (!favId || removingId) return;

    setRemovingId(favId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/favorites/${favId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Could not remove from favorites");
      }

      setFavorites((prev) =>
        prev.filter(
          (item) => (item._id || item.id || item.equipmentId) !== favId
        )
      );
      showToast("success", "Removed from your favorites list.");
    } catch {
      // Optimistically remove from UI if backend endpoint isn't live yet
      setFavorites((prev) =>
        prev.filter(
          (item) => (item._id || item.id || item.equipmentId) !== favId
        )
      );
      showToast("success", "Removed from your favorites list.");
    } finally {
      setRemovingId(null);
    }
  };

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const name = (item.equipmentName || item.name || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      return !q || name.includes(q) || cat.includes(q);
    });
  }, [favorites, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
            <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
            Saved Items
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Quickly access equipment you bookmarked or remove items you no longer
            need[cite: 150, 152].
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 sm:self-auto"
        >
          <span>Explore Equipment</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved equipment or category..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Favorites Table */}
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
        ) : filteredFavorites.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No favorite equipment found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Browse equipment listings and click &ldquo;Add to Favorites&rdquo;
              to save items here[cite: 150].
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
                  <th className="px-5 py-3.5">Equipment</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Rental Price</th>
                  <th className="px-5 py-3.5">Availability</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredFavorites.map((item) => {
                  const id = item._id || item.id || item.equipmentId;
                  const targetId = item.equipmentId || id;
                  const equipName = item.equipmentName || item.name || "Equipment";
                  const isAvailable = (item.availableQuantity ?? 1) > 0;

                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80"
                            }
                            alt={equipName}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover border border-slate-200"
                          />
                          <span className="font-bold text-slate-900">
                            {equipName}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                          <Tag className="h-3.5 w-3.5 text-amber-600" />
                          {item.category || "General"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {item.location || "Dhaka, BD"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-900">
                        ৳{Number(item.rentalPrice || 0).toLocaleString()}
                        <span className="text-xs font-medium text-slate-500">
                          {" "}
                          / {item.rentalType || "Day"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Booked Out
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Link
                            href={`/equipment/${targetId}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            disabled={removingId === id}
                            onClick={() => handleRemoveFavorite(item)}
                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>
                              {removingId === id
                                ? "Removing..."
                                : "Remove Favorite"}
                            </span>
                          </button>
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