"use client";

import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";

export default function SignUpPage() {
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    
    const { data: resData, error } = await signUp.email({
        name: data.name,
        email: data.email, 
        password: data.password, 
        image: "https://example.com/image.png", 
        callbackURL: "/",
    });
    console.log("this is resData", resData, error);    
  }

  const handleGoogleSignIn = async () => {
    const data = await signIn.social({
      provider: "google",
    });
    console.log(data);
  };

  const handleGitHubSignIn = async () => {
    const data = await signIn.social({
      provider: "github",
    });
    console.log(data);
  };

  const handleDiscordSignIn = async () => {
    const data = await signIn.social({
      provider: "discord",
    });
    console.log(data);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h2>
        <p className="text-sm text-gray-600 mb-6">Update your profile information.</p>
        
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              minLength={3}
              placeholder="John Doe" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              Sign Up Submit
            </button>
            <button 
              type="reset" 
              className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-200 pt-6 space-y-3">
          <button 
            type="button"
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition duration-200 cursor-pointer" 
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
          <button 
            type="button"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md font-medium transition duration-200 cursor-pointer" 
            onClick={handleGitHubSignIn}
          >
            Sign in with GitHub
          </button>
          <button 
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 cursor-pointer" 
            onClick={handleDiscordSignIn}
          >
            Sign in with Discord
          </button>
        </div>
      </div>
    </div>
  );
}