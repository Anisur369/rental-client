"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signIn, signUp } from "@/lib/auth-client";
import {
  Wrench,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  Image as ImageIcon,
  UserPlus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

function GoogleIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.54-1.14 2.85-2.4 3.72v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.22z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
      />
    </svg>
  );
}

function validatePassword(pwd) {
  if (!pwd || pwd.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (!/[A-Z]/.test(pwd)) {
    return "Password must contain at least one uppercase letter (A-Z).";
  }
  if (!/[a-z]/.test(pwd)) {
    return "Password must contain at least one lowercase letter (a-z).";
  }
  return "";
}

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const showErrorToast = (message) => {
    setErrorMsg(message);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3500,
    });
  };

  const handleImgbbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      showErrorToast(
        "NEXT_PUBLIC_IMGBB_API_KEY is not configured. Paste a direct photo URL instead."
      );
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error?.message || "Failed to upload photo to imgbb.");
      }

      setPhotoUrl(data.data.display_url || data.data.url);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Photo uploaded to imgbb!",
        showConfirmButton: false,
        timer: 2500,
      });
    } catch (err) {
      showErrorToast(err?.message || "Image upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim()) {
      showErrorToast("Please enter your name and email address.");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      showErrorToast(pwdError);
      return;
    }

    setSubmitting(true);
    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoUrl.trim() || undefined,
        role: "Customer",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Registration failed.");
      }

      // Sync default Customer role & profile with backend if API exists
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (baseUrl) {
        await fetch(`${baseUrl}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            image: photoUrl.trim() || "",
            role: "Customer",
          }),
        }).catch(() => {});
      }

      localStorage.setItem("userRole", "Customer");

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created with the Customer role.",
        confirmButtonColor: "#f59e0b",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err?.message || "Could not register. Please try again.";
      showErrorToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    localStorage.setItem("userRole", "Customer");

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error.message || "Google sign-up failed.");
      }
    } catch (err) {
      const msg = err?.message || "Could not start Google sign-up.";
      showErrorToast(msg);
      setGoogleLoading(false);
    }
  };

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative Amber Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_60%)]" />

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-sm">
              <Wrench className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Equip<span className="text-amber-500">Rent</span>
            </span>
          </Link>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Register to rent equipment, save favorites, or manage bookings
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs font-semibold text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Full Name *
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Photo: Direct Image Link or imgbb Upload */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Profile Photo (URL or imgbb Upload)
              </label>

              <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-200">
                <UploadCloud className="h-3.5 w-3.5" />
                <span>{uploadingPhoto ? "Uploading..." : "Upload imgbb"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingPhoto}
                  onChange={handleImgbbUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                />
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Password *
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Rules Checklist */}
            <div className="mt-2.5 grid grid-cols-1 gap-1.5 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  hasMinLength ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                At least 6 chars
              </span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  hasUppercase ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                1 Uppercase
              </span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  hasLowercase ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                1 Lowercase
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploadingPhoto || googleLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>{submitting ? "Creating Account..." : "Register"}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Or sign up with
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          disabled={submitting || uploadingPhoto || googleLoading}
          onClick={handleGoogleSignUp}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <GoogleIcon className="h-5 w-5" />
          <span>
            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </span>
        </button>

        {/* Redirect to Login */}
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-600 hover:underline"
          >
            <span>Sign in here</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </section>
  );
}