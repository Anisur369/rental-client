"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Wrench } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[75vh] w-full items-center justify-center bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {/* Error Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <span className="mt-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
          Unexpected Error
        </span>

        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We encountered an unexpected issue while loading this page. You can
          try recovering the view or return to the homepage.
        </p>

        {error?.message && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-left font-mono text-xs text-slate-700 break-words">
            {error.message}
          </div>
        )}

        {/* Recovery Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/equipment"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Wrench className="h-4 w-4 text-amber-400" />
            <span>Equipment</span>
          </Link>
        </div>
      </div>
    </section>
  );
}