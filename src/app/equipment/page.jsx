"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["All", "Daily", "Weekly", "Monthly"];

const AVAILABILITY_OPTIONS = ["All", "Available", "Booked Out"];

const SORT_OPTIONS = [
  { label: "Recently Added", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const SAMPLE_EQUIPMENT = [
  {
    _id: "eq-101",
    name: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    rentalPrice: 1800,
    rentalType: "Daily",
    location: "Gazipur, Dhaka",
    availableQuantity: 4,
    status: "Approved",
    createdAt: "2026-11-18T10:00:00Z",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-102",
    name: "Sony FX3 Cinema Camera Kit",
    category: "Photography Equipment",
    rentalPrice: 4500,
    rentalType: "Daily",
    location: "Banani, Dhaka",
    availableQuantity: 2,
    status: "Approved",
    createdAt: "2026-11-19T12:00:00Z",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-103",
    name: "Compact Pickup Cargo Van",
    category: "Vehicles & Transportation",
    rentalPrice: 18500,
    rentalType: "Weekly",
    location: "Uttara, Dhaka",
    availableQuantity: 3,
    status: "Approved",
    createdAt: "2026-11-15T08:30:00Z",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-104",
    name: "Mini Power Tiller Cultivator",
    category: "Agriculture Equipment",
    rentalPrice: 2400,
    rentalType: "Daily",
    location: "Sadar, Gazipur",
    availableQuantity: 5,
    status: "Approved",
    createdAt: "2026-11-20T09:15:00Z",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-105",
    name: "Portable 10kVA Silent Generator",
    category: "Electronics",
    rentalPrice: 52000,
    rentalType: "Monthly",
    location: "Mirpur, Dhaka",
    availableQuantity: 2,
    status: "Approved",
    createdAt: "2026-11-14T14:20:00Z",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-106",
    name: "Pro Line Array PA Sound System",
    category: "Event Equipment",
    rentalPrice: 6500,
    rentalType: "Daily",
    location: "Dhanmondi, Dhaka",
    availableQuantity: 0,
    status: "Approved",
    createdAt: "2026-11-17T16:45:00Z",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-107",
    name: "Concrete Mixer Drum Machine",
    category: "Construction Equipment",
    rentalPrice: 3100,
    rentalType: "Daily",
    location: "Gazipur, Dhaka",
    availableQuantity: 2,
    status: "Approved",
    createdAt: "2026-11-16T11:10:00Z",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-108",
    name: "Aputure 600d Studio LED Light",
    category: "Photography Equipment",
    rentalPrice: 12000,
    rentalType: "Weekly",
    location: "Gulshan, Dhaka",
    availableQuantity: 4,
    status: "Approved",
    createdAt: "2026-11-19T18:00:00Z",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-109",
    name: "Stage Truss & Event Canopy Set",
    category: "Event Equipment",
    rentalPrice: 9500,
    rentalType: "Daily",
    location: "Uttara, Dhaka",
    availableQuantity: 3,
    status: "Approved",
    createdAt: "2026-11-13T09:00:00Z",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
  },
];

function applyLocalFilterAndSort(list, filters) {
  let result = list.filter((item) => !item.status || item.status === "Approved");

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  }

  if (filters.location.trim()) {
    const loc = filters.location.trim().toLowerCase();
    result = result.filter((item) =>
      item.location?.toLowerCase().includes(loc)
    );
  }

  if (filters.category && filters.category !== "All") {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.rentalType && filters.rentalType !== "All") {
    result = result.filter((item) => item.rentalType === filters.rentalType);
  }

  if (filters.availability === "Available") {
    result = result.filter((item) => (item.availableQuantity ?? 0) > 0);
  } else if (filters.availability === "Booked Out") {
    result = result.filter((item) => (item.availableQuantity ?? 0) <= 0);
  }

  if (filters.minPrice !== "") {
    const min = Number(filters.minPrice);
    if (!Number.isNaN(min)) {
      result = result.filter((item) => Number(item.rentalPrice) >= min);
    }
  }

  if (filters.maxPrice !== "") {
    const max = Number(filters.maxPrice);
    if (!Number.isNaN(max)) {
      result = result.filter((item) => Number(item.rentalPrice) <= max);
    }
  }

  if (filters.sort === "price_asc") {
    result.sort((a, b) => Number(a.rentalPrice) - Number(b.rentalPrice));
  } else if (filters.sort === "price_desc") {
    result.sort((a, b) => Number(b.rentalPrice) - Number(a.rentalPrice));
  } else {
    result.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }

  return result;
}

function AllEquipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();

  const initialCategory = searchParams.get("category") || "All";

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );
  const [rentalType, setRentalType] = useState(
    searchParams.get("rentalType") || "All"
  );
  const [availability, setAvailability] = useState(
    searchParams.get("availability") || "All"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(1);

  const pageSize = 6;
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlCat = searchParams.get("category");
    if (urlCat && CATEGORIES.includes(urlCat)) {
      setCategory(urlCat);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    if (category !== "All") params.set("category", category);
    if (rentalType !== "All") params.set("rentalType", rentalType);
    if (availability !== "All") params.set("availability", availability);
    if (minPrice !== "") params.set("minPrice", minPrice);
    if (maxPrice !== "") params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(pageSize));
    params.set("status", "Approved");

    async function fetchEquipment() {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/equipment?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Backend request failed");

        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data?.data || data?.equipment || [];

        if (active) {
          setItems(list);
          const count = data?.totalCount ?? data?.total ?? list.length;
          setTotalCount(count);
          setTotalPages(
            data?.totalPages ?? Math.max(1, Math.ceil(count / pageSize))
          );
        }
      } catch {
        const filtered = applyLocalFilterAndSort(SAMPLE_EQUIPMENT, {
          search,
          location,
          category,
          rentalType,
          availability,
          minPrice,
          maxPrice,
          sort,
        });
        const calcTotalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        const safePage = Math.min(page, calcTotalPages);
        const startIdx = (safePage - 1) * pageSize;
        const paged = filtered.slice(startIdx, startIdx + pageSize);

        if (active) {
          setItems(paged);
          setTotalCount(filtered.length);
          setTotalPages(calcTotalPages);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchEquipment();
    return () => {
      active = false;
    };
  }, [
    search,
    location,
    category,
    rentalType,
    availability,
    minPrice,
    maxPrice,
    sort,
    page,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("All");
    setRentalType("All");
    setAvailability("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
  };

  const handleViewDetails = (id) => {
    if (isPending) return;
    const detailsPath = `/equipment/${id}`;
    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(detailsPath)}`);
      return;
    }
    router.push(detailsPath);
  };

  return (
    <section className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Layers className="h-3.5 w-3.5" />
              Marketplace Catalog
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              All Equipment
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Search, filter by category, location, rental type, price, or
              availability, and sort approved listings[cite: 120].
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-600">
            Showing{" "}
            <span className="font-bold text-slate-900">{totalCount}</span>{" "}
            approved {totalCount === 1 ? "item" : "items"}[cite: 120]
          </div>
        </div>

        {/* Search, Filters & Sorting Bar */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <SlidersHorizontal className="h-4 w-4 text-amber-600" />
              <span>Search &amp; Filters</span>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All</span>
            </button>
          </div>

          {/* Row 1: Equipment Name Search, Location, Category, Sort */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search by Equipment Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Equipment Name
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search equipment..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Filter by Location */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. Dhaka, Gazipur"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Filter by Category */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Rental Type, Availability & Price Range */}
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Rental Type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rental Type
              </label>
              <select
                value={rentalType}
                onChange={(e) => {
                  setRentalType(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Rental Types" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {AVAILABILITY_OPTIONS.map((statusOpt) => (
                  <option key={statusOpt} value={statusOpt}>
                    {statusOpt === "All" ? "All Availability" : statusOpt}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Min Price (৳)
              </label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Max Price (৳)
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                placeholder="Any"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Equipment Grid */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="h-52 w-full animate-pulse rounded-xl bg-slate-200" />
                <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="mt-auto pt-6">
                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-bold text-slate-900">
              No matching equipment found
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
              Try adjusting your search keyword, category, location, or price
              range filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const id = item._id || item.id;
              const isAvailable = (item.availableQuantity ?? 0) > 0;

              return (
                <article
                  key={id}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Uniform Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span
                      className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Available ({item.availableQuantity})
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" />
                          Booked Out
                        </>
                      )}
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1 truncate text-amber-700">
                        <Tag className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.category}</span>
                      </span>
                      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-slate-700">
                        {item.rentalType || "Daily"}
                      </span>
                    </div>

                    <h2 className="mt-2 line-clamp-1 text-lg font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-baseline justify-between border-t border-slate-100 pt-3.5">
                        <span className="text-xs font-medium text-slate-500">
                          Rental Price
                        </span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-slate-900">
                            ৳{Number(item.rentalPrice).toLocaleString()}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {" "}
                            / {item.rentalType || "Day"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDetails(id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>

            <span className="px-3 text-sm font-semibold text-slate-700">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 py-16 text-center text-sm font-semibold text-slate-600">
          Loading equipment catalog...
        </div>
      }
    >
      <AllEquipmentContent />
    </Suspense>
  );
}