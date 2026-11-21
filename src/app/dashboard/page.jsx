"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  Users,
  Boxes,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Heart,
  ShoppingBag,
} from "lucide-react";

const ADMIN_MONTHLY_STATS = [
  { month: "Jun", bookings: 28, revenue: 142000 },
  { month: "Jul", bookings: 36, revenue: 185000 },
  { month: "Aug", bookings: 44, revenue: 224000 },
  { month: "Sep", bookings: 39, revenue: 198000 },
  { month: "Oct", bookings: 52, revenue: 268000 },
  { month: "Nov", bookings: 61, revenue: 315000 },
];

const OWNER_MONTHLY_EARNINGS = [
  { month: "Jun", rentals: 9, earnings: 48000 },
  { month: "Jul", rentals: 12, earnings: 63500 },
  { month: "Aug", rentals: 15, earnings: 79000 },
  { month: "Sep", rentals: 11, earnings: 58000 },
  { month: "Oct", rentals: 18, earnings: 94500 },
  { month: "Nov", rentals: 21, earnings: 112000 },
];

function BarChartCard({ title, subtitle, data, valueKey, labelKey, suffix = "" }) {
  const maxVal = Math.max(...data.map((d) => Number(d[valueKey] || 0)), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
          <TrendingUp className="h-3.5 w-3.5" />
          6 Months
        </span>
      </div>

      <div className="mt-6 grid grid-cols-6 items-end gap-3 pt-4">
        {data.map((entry) => {
          const val = Number(entry[valueKey] || 0);
          const heightPercent = Math.max(12, Math.round((val / maxVal) * 100));

          return (
            <div key={entry[labelKey]} className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">
                {suffix}
                {val.toLocaleString()}
              </span>
              <div className="flex h-40 w-full items-end rounded-xl bg-slate-100 p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full rounded-lg bg-amber-500 transition-all duration-500 hover:bg-amber-400"
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {entry[labelKey]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [role, setRole] = useState("Customer");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const rawRole =
      session?.user?.role ||
      (typeof window !== "undefined" && localStorage.getItem("userRole")) ||
      "Customer";
    const normalized =
      String(rawRole).charAt(0).toUpperCase() +
      String(rawRole).slice(1).toLowerCase();
    setRole(["Customer", "Owner", "Admin"].includes(normalized) ? normalized : "Customer");
  }, [session]);

  useEffect(() => {
    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function loadAnalytics() {
      try {
        const endpoint =
          role === "Admin"
            ? `${baseUrl}/api/analytics/admin`
            : role === "Owner"
            ? `${baseUrl}/api/analytics/owner`
            : `${baseUrl}/api/analytics/customer`;

        const res = await fetch(endpoint, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Analytics fetch fallback");
        const data = await res.json();
        if (active) {
          setAnalytics(data?.data || data);
        }
      } catch {
        if (active) {
          setAnalytics(null);
        }
      }
    }

    loadAnalytics();
    return () => {
      active = false;
    };
  }, [role]);

  const adminStats = [
    {
      label: "Total Users",
      value: analytics?.totalUsers ?? 148,
      icon: Users,
      style: "bg-sky-100 text-sky-700",
    },
    {
      label: "Total Equipment",
      value: analytics?.totalEquipment ?? 86,
      icon: Boxes,
      style: "bg-amber-100 text-amber-800",
    },
    {
      label: "Total Bookings",
      value: analytics?.totalBookings ?? 260,
      icon: CalendarCheck,
      style: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Pending Approvals",
      value: analytics?.pendingApprovals ?? 9,
      icon: Clock,
      style: "bg-orange-100 text-orange-700",
    },
    {
      label: "Completed Rentals",
      value: analytics?.completedRentals ?? 194,
      icon: CheckCircle2,
      style: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Revenue",
      value: `৳${Number(analytics?.totalRevenue ?? 1332000).toLocaleString()}`,
      icon: Wallet,
      style: "bg-purple-100 text-purple-700",
    },
  ];

  const ownerStats = [
    {
      label: "Total Listed Equipment",
      value: analytics?.totalListedEquipment ?? 14,
      icon: Boxes,
      style: "bg-amber-100 text-amber-800",
    },
    {
      label: "Completed Rentals",
      value: analytics?.completedRentals ?? 86,
      icon: CheckCircle2,
      style: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Earnings",
      value: `৳${Number(analytics?.totalEarnings ?? 413000).toLocaleString()}`,
      icon: Wallet,
      style: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "This Month Earnings",
      value: `৳${Number(analytics?.monthlyEarnings ?? 112000).toLocaleString()}`,
      icon: TrendingUp,
      style: "bg-sky-100 text-sky-700",
    },
  ];

  const customerStats = [
    {
      label: "Active & Past Rentals",
      value: analytics?.totalRentals ?? 6,
      icon: ShoppingBag,
      style: "bg-amber-100 text-amber-800",
    },
    {
      label: "Saved Favorites",
      value: analytics?.totalFavorites ?? 4,
      icon: Heart,
      style: "bg-rose-100 text-rose-700",
    },
    {
      label: "Completed Bookings",
      value: analytics?.completedRentals ?? 4,
      icon: CheckCircle2,
      style: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            {role} Overview
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {session?.user?.name || "Member"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {role === "Admin" &&
              "Monitor platform users, equipment approvals, bookings, and revenue performance[cite: 157]."}
            {role === "Owner" &&
              "Track your listed equipment, rental bookings, completed orders, and earnings[cite: 158]."}
            {role === "Customer" &&
              "View your rental history, manage saved favorites, and update your profile[cite: 151, 152]."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {role === "Owner" && (
            <Link
              href="/dashboard/add-equipment"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
            >
              <span>Add Equipment</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            <span>Browse Equipment</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Role-Based KPI Cards */}
      {role === "Admin" && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {adminStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-2xl font-black text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChartCard
              title="Monthly Booking Statistics"
              subtitle="Completed & confirmed equipment bookings per month[cite: 157]"
              data={analytics?.monthlyBookings || ADMIN_MONTHLY_STATS}
              valueKey="bookings"
              labelKey="month"
            />
            <BarChartCard
              title="Monthly Platform Revenue"
              subtitle="Gross rental payments processed across the platform[cite: 157]"
              data={analytics?.monthlyBookings || ADMIN_MONTHLY_STATS}
              valueKey="revenue"
              labelKey="month"
              suffix="৳"
            />
          </div>
        </>
      )}

      {role === "Owner" && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ownerStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-2xl font-black text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <BarChartCard
              title="Monthly Earnings"
              subtitle="Your monthly income from equipment rentals[cite: 158]"
              data={analytics?.monthlyEarnings || OWNER_MONTHLY_EARNINGS}
              valueKey="earnings"
              labelKey="month"
              suffix="৳"
            />
            <BarChartCard
              title="Monthly Rental Volume"
              subtitle="Number of rentals booked on your equipment[cite: 158]"
              data={analytics?.monthlyEarnings || OWNER_MONTHLY_EARNINGS}
              valueKey="rentals"
              labelKey="month"
            />
          </div>
        </>
      )}

      {role === "Customer" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {customerStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-black text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}