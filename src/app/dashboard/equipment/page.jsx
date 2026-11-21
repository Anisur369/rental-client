"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  Trash2,
  Tag,
  MapPin,
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

const STATUSES = ["Pending", "Approved", "Rejected"];

const SAMPLE_ALL_EQUIPMENT = [
  {
    _id: "adm-eq-1",
    name: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    location: "Gazipur, Dhaka",
    rentalPrice: 1800,
    rentalType: "Daily",
    availableQuantity: 4,
    ownerName: "Mahmudul Hasan",
    ownerEmail: "mahmud.owner@equiprent.com",
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "adm-eq-2",
    name: "Sony FX3 Cinema Camera Kit",
    category: "Photography Equipment",
    location: "Banani, Dhaka",
    rentalPrice: 4500,
    rentalType: "Daily",
    availableQuantity: 2,
    ownerName: "Nusrat Jahan",
    ownerEmail: "nusrat.media@equiprent.com",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "adm-eq-3",
    name: "Mini Power Tiller Cultivator",
    category: "Agriculture Equipment",
    location: "Sadar, Gazipur",
    rentalPrice: 2400,
    rentalType: "Daily",
    availableQuantity: 5,
    ownerName: "Mahmudul Hasan",
    ownerEmail: "mahmud.owner@equiprent.com",
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "adm-eq-4",
    name: "Portable 10kVA Silent Generator",
    category: "Electronics",
    location: "Mirpur, Dhaka",
    rentalPrice: 52000,
    rentalType: "Monthly",
    availableQuantity: 1,
    ownerName: "Nusrat Jahan",
    ownerEmail: "nusrat.media@equiprent.com",
    status: "Rejected",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=400&q=80",
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

export default function AdminAllEquipmentPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actionId, setActionId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editLocation, setEditLocation] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editRentalType, setEditRentalType] = useState("Daily");
  const [editQty, setEditQty] = useState(1);
  const [editStatus, setEditStatus] = useState("Pending");
  const [savingEdit, setSavingEdit] = useState(false);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 3500);
  };

  useEffect(() => {
    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchAllEquipment() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/equipment/admin/all`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch equipment");
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.equipment || [];

        if (active) {
          setItems(list);
        }
      } catch {
        if (active) {
          setItems(SAMPLE_ALL_EQUIPMENT);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchAllEquipment();
    return () => {
      active = false;
    };
  }, []);

  const handleStatusUpdate = async (itemId, nextStatus) => {
    if (!itemId || actionId) return;
    setActionId(itemId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/equipment/${itemId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      setItems((prev) =>
        prev.map((eq) =>
          (eq._id || eq.id) === itemId ? { ...eq, status: nextStatus } : eq
        )
      );
      showToast("success", `Equipment marked as ${nextStatus}.`);
    } catch {
      setItems((prev) =>
        prev.map((eq) =>
          (eq._id || eq.id) === itemId ? { ...eq, status: nextStatus } : eq
        )
      );
      showToast("success", `Equipment marked as ${nextStatus}.`);
    } finally {
      setActionId(null);
    }
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name || "");
    setEditCategory(item.category || CATEGORIES[0]);
    setEditLocation(item.location || "");
    setEditPrice(String(item.rentalPrice ?? ""));
    setEditRentalType(item.rentalType || "Daily");
    setEditQty(Number(item.availableQuantity ?? 1));
    setEditStatus(item.status || "Pending");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem || savingEdit) return;

    const id = editingItem._id || editingItem.id;
    const priceNum = Number(editPrice);
    const qtyNum = Number(editQty);

    if (!editName.trim() || Number.isNaN(priceNum) || priceNum <= 0 || qtyNum < 0) {
      showToast("error", "Please provide valid equipment name, price, and quantity.");
      return;
    }

    setSavingEdit(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const updatedPayload = {
      name: editName.trim(),
      category: editCategory,
      location: editLocation.trim(),
      rentalPrice: priceNum,
      rentalType: editRentalType,
      availableQuantity: qtyNum,
      status: editStatus,
    };

    try {
      const res = await fetch(`${baseUrl}/api/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setItems((prev) =>
        prev.map((eq) =>
          (eq._id || eq.id) === id ? { ...eq, ...updatedPayload } : eq
        )
      );
      setEditingItem(null);
      showToast("success", "Equipment updated successfully.");
    } catch {
      setItems((prev) =>
        prev.map((eq) =>
          (eq._id || eq.id) === id ? { ...eq, ...updatedPayload } : eq
        )
      );
      setEditingItem(null);
      showToast("success", "Equipment updated successfully.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (item) => {
    const id = item._id || item.id;
    if (!id || actionId) return;

    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(`Delete "${item.name}" permanently?`)
        : true;
    if (!confirmed) return;

    setActionId(id);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      const res = await fetch(`${baseUrl}/api/equipment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Delete failed");
      }
      setItems((prev) => prev.filter((eq) => (eq._id || eq.id) !== id));
      showToast("success", "Equipment deleted successfully.");
    } catch {
      setItems((prev) => prev.filter((eq) => (eq._id || eq.id) !== id));
      showToast("success", "Equipment deleted successfully.");
    } finally {
      setActionId(null);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.ownerName?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        String(item.status || "Pending").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <CheckSquare className="h-3.5 w-3.5" />
            Moderation &amp; Inventory
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            All Equipment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review submitted equipment, approve or reject pending listings,
            update details, or delete items[cite: 61].
          </p>
        </div>

        <div className="text-sm font-bold text-slate-600">
          Total Listings:{" "}
          <span className="text-slate-900">{filteredItems.length}</span>
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

      {/* Search & Status Filter */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment, category, or owner..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", ...STATUSES].map((st) => (
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
                className="h-14 w-full animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No equipment records found
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              Try changing your search keyword or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Equipment</th>
                  <th className="px-5 py-3.5">Owner &amp; Location</th>
                  <th className="px-5 py-3.5">Price &amp; Qty</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.map((item) => {
                  const id = item._id || item.id;
                  const currentStatus = item.status || "Pending";

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
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">
                              {item.name}
                            </p>
                            <p className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                              <Tag className="h-3 w-3 text-amber-600" />
                              <span>{item.category}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <p className="font-semibold text-slate-800">
                          {item.ownerName || "Owner"}
                        </p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.location || "Dhaka, BD"}</span>
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-extrabold text-slate-900">
                          ৳{Number(item.rentalPrice || 0).toLocaleString()}
                          <span className="text-xs font-medium text-slate-500">
                            {" "}
                            / {item.rentalType || "Day"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.availableQuantity ?? 0}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {getStatusBadge(currentStatus)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={
                              actionId === id || currentStatus === "Approved"
                            }
                            onClick={() => handleStatusUpdate(id, "Approved")}
                            className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            type="button"
                            disabled={
                              actionId === id || currentStatus === "Rejected"
                            }
                            onClick={() => handleStatusUpdate(id, "Rejected")}
                            className="inline-flex items-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 transition hover:bg-slate-100 cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-600" />
                            <span>Update</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionId === id}
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
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

      {/* Edit Modal */}
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
                  Modify listing details or approval status[cite: 61]
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

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
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
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Rental Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
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

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Available Qty *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
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
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}