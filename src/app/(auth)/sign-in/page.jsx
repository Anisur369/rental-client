"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";

export default function SignInPage() {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    const { data: resData, error } = await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true, 
    });
    console.log(resData, error);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with 1 uppercase and 1 number</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 cursor-pointer"
            >
              Submit
            </button>
            <button
              type="reset"
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition duration-200 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}