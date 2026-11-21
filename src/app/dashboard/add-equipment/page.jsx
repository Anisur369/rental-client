"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  PackagePlus,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

const CONDITIONS = ["New", "Like New", "Excellent", "Good", "Fair"];

export default function AddEquipmentPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [location, setLocation] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [rentalType, setRentalType] = useState("Daily");
  const [availableQuantity, setAvailableQuantity] = useState(1);
  const [condition, setCondition] = useState("Excellent");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState(
    "1. Equipment must be returned on time in working condition.\n2. Valid ID verification may be requested upon delivery.\n3. Any damage from improper handling will be charged."
  );

  // Owner Information
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!isPending && session?.user) {
      setOwnerName((prev) => prev || session.user.name || "");
      setOwnerEmail((prev) => prev || session.user.email || "");
    }
  }, [isPending, session]);

  const handleImgbbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeedback(null);

    if (!file.type.startsWith("image/")) {
      setFeedback({
        type: "error",
        text: "Please select a valid image file (JPG, PNG, WEBP).",
      });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setFeedback({
        type: "error",
        text: "NEXT_PUBLIC_IMGBB_API_KEY is missing. You can paste a direct image URL below or add the key in .env.local.",
      });
      return;
    }

    setUploadingImage(true);
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
        throw new Error(data?.error?.message || "Image upload to imgbb failed");
      }

      setImageUrl(data.data.display_url || data.data.url);
      setFeedback({
        type: "success",
        text: "Equipment image uploaded to imgbb successfully!",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.message || "Failed to upload image to imgbb.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !description.trim() || !location.trim()) {
      setFeedback({
        type: "error",
        text: "Equipment name, description, and location are required.",
      });
      return;
    }

    const priceNum = Number(rentalPrice);
    const qtyNum = Number(availableQuantity);

    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setFeedback({
        type: "error",
        text: "Please enter a valid rental price greater than 0.",
      });
      return;
    }

    if (Number.isNaN(qtyNum) || qtyNum < 1) {
      setFeedback({
        type: "error",
        text: "Available quantity must be at least 1.",
      });
      return;
    }

    if (!imageUrl.trim()) {
      setFeedback({
        type: "error",
        text: "Please upload an equipment image via imgbb or provide an image URL.",
      });
      return;
    }

    setSubmitting(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      rentalPrice: priceNum,
      rentalType,
      availableQuantity: qtyNum,
      condition,
      brand: brand.trim(),
      model: model.trim(),
      image: imageUrl.trim(),
      termsAndConditions: termsAndConditions.trim(),
      status: "Pending",
      owner: {
        name: ownerName.trim() || session?.user?.name || "Equipment Owner",
        email: ownerEmail.trim() || session?.user?.email || "",
        phone: ownerPhone.trim(),
      },
      ownerEmail: ownerEmail.trim() || session?.user?.email || "",
    };

    try {
      const res = await fetch(`${baseUrl}/api/equipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Failed to add equipment");
      }

      setFeedback({
        type: "success",
        text: "Equipment submitted with Pending status! Redirecting to My Equipment...",
      });

      setTimeout(() => {
        router.push("/dashboard/my-equipment");
      }, 1200);
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err.message ||
          "Could not submit equipment. Please verify backend API connection.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <PackagePlus className="h-3.5 w-3.5" />
            Owner Listing
          </span>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            Add Equipment
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            List new equipment for rent. New listings start with{" "}
            <span className="font-bold text-amber-700">Pending</span> status
            until approved by an admin.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 self-start rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 sm:self-auto">
          <ShieldAlert className="h-4 w-4" />
          Initial Status: Pending
        </span>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Section 1: Basic Equipment Details */}
        <div className="space-y-4">
          <h2 className="border-b border-slate-100 pb-2.5 text-base font-extrabold text-slate-900">
            Equipment Information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Equipment Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bosch Heavy Duty Rotary Hammer"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Description *
            </label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe specifications, included accessories, power rating, or usage details..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gazipur, Dhaka"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Rental Price (৳) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                placeholder="1800"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Rental Type *
              </label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {RENTAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Available Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Equipment Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Brand *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Bosch, Sony, Makita"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Model *
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. GBH 2-26 DRE"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Equipment Image (imgbb Upload + Direct URL) */}
        <div className="space-y-4">
          <h2 className="border-b border-slate-100 pb-2.5 text-base font-extrabold text-slate-900">
            Equipment Image (imgbb)
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-8">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-amber-500 hover:bg-amber-50/40">
                <UploadCloud className="h-8 w-8 text-amber-600" />
                <span className="mt-2 text-sm font-bold text-slate-800">
                  {uploadingImage
                    ? "Uploading image to imgbb..."
                    : "Click to upload image via imgbb"}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG, or WEBP recommended
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImgbbUpload}
                  className="hidden"
                />
              </label>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Image URL (Auto-filled after imgbb upload or paste direct link) *
                </label>
                <div className="relative">
                  <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://i.ibb.co/..."
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-4">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-44 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-xs text-slate-400">
                  <ImageIcon className="mb-1.5 h-6 w-6" />
                  <span>Image Preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Rental Terms & Owner Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <h2 className="border-b border-slate-100 pb-2.5 text-base font-extrabold text-slate-900">
              Rental Terms and Conditions
            </h2>
            <textarea
              rows="5"
              required
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-3 lg:col-span-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-extrabold text-slate-900">
                Owner Information
              </h2>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Owner Name
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Owner Email
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Owner Contact Number
              </label>
              <input
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <p className="text-xs font-semibold text-slate-500">
            Status will automatically be set to{" "}
            <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">
              Pending
            </span>{" "}
            upon submission[cite: 93].
          </p>

          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <PackagePlus className="h-4 w-4" />
            <span>
              {submitting ? "Submitting Listing..." : "Submit Equipment"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}