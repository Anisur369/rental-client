"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Boxes,
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  Search,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

const SAMPLE_OWNER_EQUIPMENT = [
  {
    _id: "own-eq-1",
    name: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    rentalPrice: 1800,
    rentalType: "Daily",
    availableQuantity: 4,
    location: "Gazipur, Dhaka",
    status: "Approved",
  },
  {
    _id: "own-eq-2",
    name: "Concrete Mixer Drum Machine",
    category: "Construction Equipment",
    rentalPrice: 3100,
    rentalType: "Daily",
    availableQuantity: 2,
    location: "Gazipur, Dhaka",
    status: "Pending",
  },
  {
    _id: "own-eq-3",
    name: "Portable 10kVA Silent Generator",
    category: "Electronics",
    rentalPrice: 52000,
    rentalType: "Monthly",
    availableQuantity: 1,
    location: "Gazipur, Dhaka",
    status: "Rejected",
  },
];

function getStatusBadge(status) {
  const normalized = String(status || "Pending").toLowerCase();
  if (normalized === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }
  if (normalized === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
        <XCircle className="h-3.5 w-3.5" />
        Rejected
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

export default function MyEquipmentPage() {
  const { data: session, isPending } = useSession();

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [feedback, setFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Update Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editRentalPrice, setEditRentalPrice] = useState("");
  const [editRentalType, setEditRentalType] = useState("Daily");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editLocation, setEditLocation] = useState("");
  const [updating, setUpdating] = useState(false);

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

    async function fetchOwnerEquipment() {
      setLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/equipment/owner?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Failed to load owner equipment");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.equipment || [];

        if (active) {
          setEquipmentList(list);
        }
      } catch {
        if (active) {
          setEquipmentList(SAMPLE_OWNER_EQUIPMENT);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchOwnerEquipment();
    return () => {
      active = false;
    };
  }, [isPending, session]);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditCategory(item.category || CATEGORIES[0]);
    setEditRentalPrice(String(item.rentalPrice ?? ""));
    setEditRentalType(item.rentalType || "Daily");
    setEditQuantity(Number(item.availableQuantity ?? 1));
    setEditLocation(item.location || "");
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || updating) return;

    const id = editingItem._id || editingItem.id;
    const priceNum = Number(editRentalPrice);
    const qtyNum = Number(editQuantity);

    if (!editName.trim() || Number.isNaN(priceNum) || priceNum <= 0 || qtyNum < 0) {
      showToast("error", "Please enter valid equipment name, price, and quantity.");
      return;
    }

    setUpdating(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const updatedFields = {
      name: editName.trim(),
      category: editCategory,
      rentalPrice: priceNum,
      rentalType: editRentalType,
      availableQuantity: qtyNum,
      location: editLocation.trim(),
    };

    try {
      const res = await fetch(`${baseUrl}/api/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error("Backend update failed");
      }

      setEquipmentList((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, ...updatedFields } : item
        )
      );
      setEditingItem(null);
      showToast("success", "Equipment updated successfully!");
    } catch {
      // Optimistically update local state if backend isn't connected yet
      setEquipmentList((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id ? { ...item, ...updatedFields } : item
        )
      );
      setEditingItem(null);
      showToast("success", "Equipment updated locally.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;
    if (!id || deletingId) return;

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(`Are you sure you want to delete "${item.name}"?`)
        : true;
    if (!confirmed) return;

    setDeletingId(id);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/equipment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Backend delete failed");
      }
      setEquipmentList((prev) => prev.filter((eq) => (eq._id || eq.id) !== id));
      showToast("success", "Equipment deleted successfully.");
    } catch {
      setEquipmentList((prev) => prev.filter((eq) => (eq._id || eq.id) !== id));
      showToast("success", "Equipment removed from list.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredList = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [equipmentList, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <Boxes className="h-3.5 w-3.5" />
            Owner Inventory
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            My Equipment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage all equipment you have listed—update details, view listings,
            or delete items[cite: 93, 94].
          </p>
        </div>

        <Link
          href="/dashboard/add-equipment"
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Equipment</span>
        </Link>
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

      {/* Search & Status Filter */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment or category..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((st) => (
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
          ))}
        </div>
      </div>

      {/* Equipment Table */}
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
        ) : filteredList.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No equipment found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Add your first equipment listing to start receiving rental
              bookings[cite: 93].
            </p>
            <Link
              href="/dashboard/add-equipment"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Equipment</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Equipment Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Rental Price</th>
                  <th className="px-5 py-3.5">Available Quantity</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredList.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {item.name}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                          <Tag className="h-3.5 w-3.5 text-amber-600" />
                          {item.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-extrabold text-slate-900">
                        ৳{Number(item.rentalPrice || 0).toLocaleString()}
                        <span className="text-xs font-medium text-slate-500">
                          {" "}
                          / {item.rentalType || "Day"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-700">
                        {item.availableQuantity ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        {getStatusBadge(item.status || "Pending")}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:border-amber-400 hover:bg-amber-50 cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5 text-amber-600" />
                            <span>Update</span>
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === id}
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </span>
                          </button>

                          <Link
                            href={`/equipment/${id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
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

      {/* Update Equipment Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Update Equipment
                </h2>
                <p className="text-xs text-slate-500">
                  Edit listing pricing, quantity, or category[cite: 93, 94]
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpdate} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Rental Type
                  </label>
                  <select
                    value={editRentalType}
                    onChange={(e) => setEditRentalType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {RENTAL_TYPES.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Rental Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editRentalPrice}
                    onChange={(e) => setEditRentalPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{updating ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}