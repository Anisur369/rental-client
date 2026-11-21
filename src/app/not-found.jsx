"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Search, ArrowLeft, Compass } from "lucide-react";

function NotFound() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-28">
      {/* Subtle Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800">
          <Compass className="h-4 w-4 text-amber-600" />
          <span>404 · Page Not Found</span>
        </div>

        <h1 className="mt-5 text-6xl font-black tracking-tight text-slate-900 sm:text-7xl">
          4<span className="text-amber-500">0</span>4
        </h1>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Oops! This route doesn&apos;t exist
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
          The page or equipment link you are looking for might have been moved,
          removed, or never existed. Head back home or explore available
          equipment listings[cite: 100, 102].
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/equipment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/60 sm:w-auto"
          >
            <Search className="h-4 w-4 text-amber-600" />
            <span>Browse Equipment</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default NotFound;