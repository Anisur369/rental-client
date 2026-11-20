"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import {
  MapPin,
  Tag,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const FALLBACK_EQUIPMENT = [
  {
    _id: "eq-1",
    name: "Bosch Heavy Duty Rotary Hammer",
    category: "Construction Equipment",
    rentalPrice: 1800,
    rentalType: "Daily",
    location: "Gazipur, Dhaka",
    availableQuantity: 4,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-2",
    name: "Sony FX3 Cinema Camera Kit",
    category: "Photography Equipment",
    rentalPrice: 4500,
    rentalType: "Daily",
    location: "Banani, Dhaka",
    availableQuantity: 2,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-3",
    name: "Compact Pickup Cargo Van",
    category: "Vehicles & Transportation",
    rentalPrice: 3200,
    rentalType: "Daily",
    location: "Uttara, Dhaka",
    availableQuantity: 3,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-4",
    name: "Mini Power Tiller Cultivator",
    category: "Agriculture Equipment",
    rentalPrice: 2400,
    rentalType: "Daily",
    location: "Sadar, Gazipur",
    availableQuantity: 5,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-5",
    name: "Portable 10kVA Silent Generator",
    category: "Electronics",
    rentalPrice: 2800,
    rentalType: "Daily",
    location: "Mirpur, Dhaka",
    availableQuantity: 2,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1000&q=80",
  },
  {
    _id: "eq-6",
    name: "Pro Line Array PA Sound System",
    category: "Event Equipment",
    rentalPrice: 6500,
    rentalType: "Daily",
    location: "Dhanmondi, Dhaka",
    availableQuantity: 0,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1000&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeaturedEquipment({ initialItems = null }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [equipmentList, setEquipmentList] = useState(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);

  useEffect(() => {
    if (initialItems) return;

    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchFeatured() {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/api/equipment/featured?limit=6`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch featured equipment");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.data || data?.equipment || [];

        const approvedOnly = list
          .filter((item) => !item.status || item.status === "Approved")
          .slice(0, 6);

        if (active) {
          setEquipmentList(
            approvedOnly.length > 0 ? approvedOnly : FALLBACK_EQUIPMENT
          );
        }
      } catch {
        if (active) {
          setEquipmentList(FALLBACK_EQUIPMENT);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchFeatured();
    return () => {
      active = false;
    };
  }, [initialItems]);

  const handleViewDetails = (id) => {
    const detailsPath = `/equipment/${id}`;
    if (isPending) return;

    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(detailsPath)}`);
      return;
    }

    router.push(detailsPath);
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Layers className="h-3.5 w-3.5" />
              Featured Listings
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Featured Equipment
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Verified, ready-to-rent equipment across construction, media,
              transport, agriculture, and events.
            </p>
          </div>

          <Link
            href="/all-equipment"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 sm:self-auto"
          >
            <span>View All Equipment</span>
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
          </Link>
        </motion.div>

        {/* Loading Skeletons */}
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
        ) : (
          /* 6 Approved Equipment Cards Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {equipmentList.slice(0, 6).map((item) => {
              const id = item._id || item.id;
              const isAvailable = (item.availableQuantity ?? 0) > 0;

              return (
                <motion.article
                  key={id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  {/* Uniform Equipment Image */}
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

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <Tag className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.category}</span>
                    </div>

                    <h3 className="mt-1.5 line-clamp-1 text-lg font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    {/* Price & CTA pushed to bottom for equal card heights */}
                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-baseline justify-between border-t border-slate-100 pt-3.5">
                        <span className="text-xs font-medium text-slate-500">
                          Rental Rate
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
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}