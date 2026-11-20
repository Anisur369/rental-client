"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const POPULAR_CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

function XLogo({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M13.5 22v-8.2h2.7l.4-3.2h-3.1V8.5c0-.9.3-1.6 1.6-1.6h1.7V4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.3v2.4H7.7v3.2h2.7V22h3.1z" />
    </svg>
  );
}

function LinkedInIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M6.94 8.5H3.56V19.5h3.38V8.5zM5.25 3.5a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94zM20.44 13.02c0-2.77-1.48-4.06-3.45-4.06-1.58 0-2.29.87-2.69 1.48V8.5h-3.38c.04.97 0 11 0 11h3.38v-6.14c0-.33.02-.66.12-.9.27-.66.88-1.35 1.9-1.35 1.34 0 1.88 1.02 1.88 2.52V19.5h3.38v-6.48z" />
    </svg>
  );
}

function YouTubeIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46a2.75 2.75 0 0 0-1.94 1.95A28.7 28.7 0 0 0 2 12a28.7 28.7 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 0 0 1.94-1.95A28.7 28.7 0 0 0 22 12a28.7 28.7 0 0 0-.42-4.81zM10 15.02V8.98L15.2 12 10 15.02z" />
    </svg>
  );
}

function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Logo, Website Name & Description */}
          <div className="space-y-4 lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-white transition hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-sm">
                <Wrench className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight leading-none text-white">
                  Equip<span className="text-amber-500">Rent</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Rental Platform
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              A transparent and secure equipment rental marketplace connecting
              verified equipment owners with businesses and individuals for
              daily, weekly, and monthly rentals.
            </p>

            {/* Social Links with New X Logo */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500 hover:text-slate-950"
              >
                <XLogo className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500 hover:text-slate-950"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500 hover:text-slate-950"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe on YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-amber-500/50 hover:bg-amber-500 hover:text-slate-950"
              >
                <YouTubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-slate-400 transition hover:text-amber-400"
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Equipment Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {POPULAR_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/all-equipment?category=${encodeURIComponent(
                      category
                    )}`}
                    className="inline-flex items-center gap-1 text-slate-400 transition hover:text-amber-400"
                  >
                    <span>{category}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Info
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>Sector 7, Uttara, Dhaka-1230, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="tel:+8801700000000"
                  className="transition hover:text-amber-400"
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="mailto:support@equiprent.com"
                  className="transition hover:text-amber-400"
                >
                  support@equiprent.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {currentYear}{" "}
            <span className="font-semibold text-white">EquipRent</span>. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="transition hover:text-amber-400">
              Privacy Policy
            </Link>
            <Link href="/about" className="transition hover:text-amber-400">
              Rental Terms
            </Link>
            <Link href="/contact" className="transition hover:text-amber-400">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;