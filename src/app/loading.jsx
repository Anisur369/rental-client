import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex min-h-[75vh] w-full flex-col items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {/* Animated Industrial Brand Spinner */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-amber-400">
            <Wrench className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <h2 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
          Loading Equipment Rental Platform...
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Preparing your workspace, listings, and data. Please wait a moment.
        </p>

        {/* Subtle Skeleton Bars */}
        <div className="mt-6 space-y-2.5 text-left">
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-3/5 animate-pulse rounded-full bg-amber-100" />
        </div>
      </div>
    </section>
  );
}