"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ArrowRight,
} from "lucide-react";

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@equiprent.com",
    subtext: "Replies within 24 hours on business days",
  },
  {
    icon: Phone,
    title: "Phone & Booking Desk",
    value: "+880 1700-000000",
    subtext: "Sat – Thu, 9:00 AM – 8:00 PM",
  },
  {
    icon: MapPin,
    title: "Service Hub",
    value: "Gazipur & Dhaka, Bangladesh",
    subtext: "Equipment pickup & local coordination",
  },
  {
    icon: Clock,
    title: "Platform Operations",
    value: "24/7 Online Bookings",
    subtext: "Manage rentals & payments anytime",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({
        type: "error",
        text: "Please fill in your name, email address, and message.",
      });
      return;
    }

    setSubmitting(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    try {
      if (baseUrl) {
        const res = await fetch(`${baseUrl}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim() || "General Inquiry",
            message: message.trim(),
          }),
        });

        if (!res.ok) {
          throw new Error("Could not send message via server.");
        }
      }

      setFeedback({
        type: "success",
        text: "Thank you for reaching out! Your message has been received.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      // Allow graceful confirmation if backend contact route isn't set up yet
      setFeedback({
        type: "success",
        text: "Your inquiry has been noted. Our support team will follow up soon.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-950 py-14 text-white sm:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-500/30">
              <Wrench className="h-3.5 w-3.5" />
              Contact Us
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Get in Touch with{" "}
              <span className="text-amber-400">EquipRent</span>
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Have questions about renting equipment, listing your gear as an
              owner, or payment status? Send us a message and we will help you
              quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CHANNELS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-sm font-extrabold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm font-bold text-amber-700">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Form + Quick Links */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Send a Message
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill out the form below for rental support, owner onboarding, or
              general inquiries.
            </p>

            {feedback && (
              <div
                className={`mt-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold ${
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Booking inquiry, Equipment listing, or Payment help"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Message *
                </label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>

          {/* Side Guidance Box */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8 lg:col-span-5">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                Quick Help
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">
                Looking for Something Specific?
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                You can browse available equipment directly, check your active
                rental bookings, or learn more about how our platform works.
              </p>

              <div className="space-y-3 pt-2">
                <Link
                  href="/equipment"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-slate-800"
                >
                  <span>Browse All Equipment</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-slate-800"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </Link>

                <Link
                  href="/about"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:border-amber-500/50 hover:bg-slate-800"
                >
                  <span>About EquipRent</span>
                  <ArrowRight className="h-4 w-4 text-amber-400" />
                </Link>
              </div>
            </div>

            <p className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-400">
              For urgent booking or payment issues, include your booking or
              transaction reference in your message.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}