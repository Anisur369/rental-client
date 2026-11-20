"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/auth-client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Better Auth ক্লায়েন্ট ব্যবহার করে পাসওয়ার্ড রিসেট রিকোয়েস্ট পাঠানো
      const { data, error } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password", // রিসেট করার পর ইউজারকে যে পেজে রিডাইরেক্ট করা হবে
      });
      console.log(data,error)

      if (error) {
        setError(error.message || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setError("unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            পাসওয়ার্ড ভুলে গেছেন?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্ট এর ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট করার লিংক পাঠিয়ে দেব।
          </p>
        </div>

        {submitted ? (
          <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-800">
            ইমেইলে পাসওয়ার্ড রিসেট করার নির্দেশিকা পাঠানো হয়েছে। দয়া করে আপনার ইনবক্স চেক করুন।
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                ইমেইল অ্যাড্রেস
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <Link className="font-medium text-indigo-600 hover:text-indigo-500" href="/sign-in">
            লগইন পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}