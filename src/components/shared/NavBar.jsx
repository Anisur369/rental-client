"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Wrench, Menu, X, LayoutDashboard, LogOut, User } from "lucide-react";

export default function NavBar() {
  const { data: session, isPending } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push("/sign-in");
  };

  // নেভিগেশন লিংকগুলোর তালিকা
  const navItems = [
    { name: "Home", href: "/" },
    { name: "All Equipment", href: "/equipment" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  // শুধুমাত্র ইউজার লগইন করা থাকলে Dashboard যুক্ত হবে
  if (session?.user) {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ১. Logo & Website Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-slate-900 transition hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-sm">
            <Wrench className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight leading-none">
              Equip<span className="text-amber-600">Rent</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
              Rental Platform
            </span>
          </div>
        </Link>

        {/* ২. Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ৩. Desktop Auth Buttons (Login, Register / User Info, Logout) */}
        <div className="hidden lg:flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-amber-600" />
                <span className="max-w-[120px] truncate">
                  {session.user.name}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-400"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* ৪. Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none lg:hidden"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* ৫. Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-3 shadow-lg lg:hidden">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium transition ${
                      isActive
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.name === "Dashboard" && (
                      <LayoutDashboard className="h-4 w-4 text-amber-600" />
                    )}
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Auth Section */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            {isPending ? (
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
            ) : session?.user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}