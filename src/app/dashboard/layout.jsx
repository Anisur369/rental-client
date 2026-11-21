"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  ClipboardList,
  ShoppingBag,
  Heart,
  Users,
  CheckSquare,
  FileSpreadsheet,
  UserCircle,
  LogOut,
  Menu,
  X,
  Wrench,
  ShieldCheck,
  Home,
} from "lucide-react";

const ROLE_MENUS = {
  Customer: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Rentals", href: "/dashboard/my-rentals", icon: ShoppingBag },
    { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  Owner: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Equipment", href: "/dashboard/add-equipment", icon: PackagePlus },
    { name: "My Equipment", href: "/dashboard/my-equipment", icon: Boxes },
    {
      name: "My Equipment Rental",
      href: "/dashboard/my-equipment-rentals",
      icon: ClipboardList,
    },
    { name: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
  Admin: [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Users", href: "/dashboard/users", icon: Users },
    { name: "All Equipment", href: "/dashboard/equipment", icon: CheckSquare },
    { name: "All Rentals", href: "/dashboard/all-rentals", icon: FileSpreadsheet },
    { name: "My Profile", href: "/dashboard/profile", icon: UserCircle },
  ],
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const detectedRole =
    session?.user?.role ||
    (typeof window !== "undefined" && localStorage.getItem("userRole")) ||
    "Customer";

  const [activeRole, setActiveRole] = useState("Customer");

  useEffect(() => {
    const normalized =
      String(detectedRole).charAt(0).toUpperCase() +
      String(detectedRole).slice(1).toLowerCase();
    if (ROLE_MENUS[normalized]) {
      setActiveRole(normalized);
    } else {
      setActiveRole("Customer");
    }
  }, [detectedRole]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [isPending, session, pathname, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const menuItems = ROLE_MENUS[activeRole] || ROLE_MENUS.Customer;
  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";
  const userImage = session.user.image || "";

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand Header (Matches Home & Navbar) */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-slate-950">
                <Wrench className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight leading-none text-white">
                  Equip<span className="text-amber-500">Rent</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  {activeRole} Panel
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Summary in Sidebar */}
          <div className="border-b border-slate-800/90 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/50"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-base font-extrabold text-amber-400">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-400">{userEmail}</p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  <ShieldCheck className="h-3 w-3" />
                  {activeRole}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Menu
            </p>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? "text-slate-950" : "text-amber-400"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t border-slate-800 p-3">
            <Link
              href="/"
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>Back to Website</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-xl bg-rose-600/90 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-base font-extrabold text-slate-900 sm:text-lg">
                  {activeRole} Dashboard
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Manage equipment, rentals, payments, and account settings[cite: 146]
                </p>
              </div>
            </div>

            {/* Role View Switcher & Quick Profile Link */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:flex">
                {["Customer", "Owner", "Admin"].map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => {
                      setActiveRole(roleOption);
                      localStorage.setItem("userRole", roleOption);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                      activeRole === roleOption
                        ? "bg-amber-500 text-slate-950"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {roleOption}
                  </button>
                ))}
              </div>

              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <UserCircle className="h-4 w-4 text-amber-600" />
                <span className="hidden md:inline">Profile</span>
              </Link>
            </div>
          </header>

          {/* Dynamic Route Content */}
          <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}