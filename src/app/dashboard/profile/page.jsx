"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Customer");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (isPending) return;

    const userEmail = session?.user?.email || "";
    const fallbackRole =
      session?.user?.role ||
      (typeof window !== "undefined" && localStorage.getItem("userRole")) ||
      "Customer";

    const normalizedRole =
      String(fallbackRole).charAt(0).toUpperCase() +
      String(fallbackRole).slice(1).toLowerCase();

    setName(session?.user?.name || "");
    setEmail(userEmail);
    setImage(session?.user?.image || "");
    setRole(
      ["Customer", "Owner", "Admin"].includes(normalizedRole)
        ? normalizedRole
        : "Customer"
    );

    if (!userEmail) {
      setLoadingProfile(false);
      return;
    }

    let active = true;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    async function fetchUserProfile() {
      setLoadingProfile(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/users/profile?email=${encodeURIComponent(userEmail)}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Profile endpoint fallback");
        const data = await res.json();
        const profileData = data?.data || data?.user || data;

        if (active && profileData) {
          setName(profileData.name || session?.user?.name || "");
          setEmail(profileData.email || userEmail);
          setImage(profileData.image || profileData.photo || session?.user?.image || "");
          setPhone(profileData.phone || profileData.phoneNumber || "");
          setAddress(profileData.address || "");
          if (profileData.role) {
            const pRole =
              String(profileData.role).charAt(0).toUpperCase() +
              String(profileData.role).slice(1).toLowerCase();
            if (["Customer", "Owner", "Admin"].includes(pRole)) {
              setRole(pRole);
            }
          }
        }
      } catch {
        // Fallback to session values if backend route isn't connected yet
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    }

    fetchUserProfile();
    return () => {
      active = false;
    };
  }, [isPending, session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please enter your full name.",
      });
      return;
    }

    setSaving(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const updatedPayload = {
      name: name.trim(),
      email: email.trim(),
      image: image.trim(),
      phone: phone.trim(),
      phoneNumber: phone.trim(),
      address: address.trim(),
    };

    try {
      const res = await fetch(`${baseUrl}/api/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Failed to update profile");
      }

      setStatusMessage({
        type: "success",
        text: "Your profile information has been updated successfully!",
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err.message ||
          "Could not save changes to server. Please check your backend API.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isPending || loadingProfile) {
    return (
      <div className="space-y-6">
        <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200 lg:col-span-4" />
          <div className="h-96 animate-pulse rounded-2xl bg-slate-200 lg:col-span-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
          <UserCircle className="h-3.5 w-3.5" />
          Account Settings
        </span>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View and update your profile details including name, photo, phone
          number, and address.
        </p>
      </div>

      {/* Feedback Alert */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Layout: Left Preview Card + Right Edit Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Profile Preview Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <div className="flex flex-col items-center text-center">
            {image ? (
              <img
                src={image}
                alt={name || "User Avatar"}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-amber-400/30"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-100 text-3xl font-black text-amber-800 ring-4 ring-amber-400/20">
                {(name || "U").charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="mt-4 text-lg font-extrabold text-slate-900">
              {name || "Unnamed User"}
            </h2>
            <p className="text-sm text-slate-500">{email || "No email"}</p>

            <span className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              {role}
            </span>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span className="break-all">{email || "—"}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>{phone || "No phone number added"}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>{address || "No address added"}</span>
            </div>
          </div>
        </div>

        {/* Profile Update Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8"
        >
          <h2 className="border-b border-slate-100 pb-3 text-base font-extrabold text-slate-900">
            Update Profile Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Phone Number */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Profile Image URL */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Profile Image URL
              </label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Address
            </label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House / Street, Area, District"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}