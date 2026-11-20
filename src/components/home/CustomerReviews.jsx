"use client";

import { motion } from "framer-motion";
import { Star, Quote, MessageSquareQuote } from "lucide-react";

const REVIEWS = [
  {
    id: "rev-1",
    name: "Tanvir Ahmed",
    role: "Site Engineer · Construction",
    rating: 5,
    comment:
      "Rented a heavy-duty rotary hammer for a two-week site job. The equipment arrived in top condition and the daily pricing saved us significant upfront cost.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-2",
    name: "Nusrat Jahan",
    role: "Independent Filmmaker · Photography",
    rating: 5,
    comment:
      "Booking a cinema camera and lighting kit for our commercial shoot was super smooth. Transparent availability and secure online payment made planning stress-free.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-3",
    name: "Mahmudul Hasan",
    role: "Equipment Owner · Vehicles & Tools",
    rating: 5,
    comment:
      "Listing my idle cargo vans and generators on this platform has turned downtime into steady rental income. Managing bookings from the dashboard is very straightforward.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "rev-4",
    name: "Farhana Rahman",
    role: "Event Coordinator · Event Equipment",
    rating: 4.5,
    comment:
      "Flexible daily and weekly rental periods fit our event schedule perfectly. Verified owners and clear rental terms gave our team complete confidence.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function RatingStars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < fullStars;
        const isHalf = index === fullStars && hasHalfStar;

        return (
          <Star
            key={index}
            className={`h-4 w-4 ${
              isFilled
                ? "fill-amber-400 text-amber-400"
                : isHalf
                ? "fill-amber-400/50 text-amber-400"
                : "text-slate-300"
            }`}
          />
        );
      })}
      <span className="ml-1.5 text-xs font-bold text-slate-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function CustomerReviews() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center space-y-2.5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Testimonials
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Customer Reviews
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Hear from renters and equipment owners using our platform for
            projects, events, and daily operations[cite: 64, 66].
          </p>
        </motion.div>

        {/* 4 Equal-Height Review Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {REVIEWS.map((review) => (
            <motion.article
              key={review.id}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6 shadow-sm transition-all hover:border-amber-300 hover:bg-white hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-2">
                <RatingStars rating={review.rating} />
                <Quote className="h-5 w-5 shrink-0 text-amber-400/70" />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Customer Info pinned to bottom */}
              <div className="mt-auto flex items-center gap-3 border-t border-slate-200/80 pt-4 mt-5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/40"
                />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-900">
                    {review.name}
                  </h3>
                  <p className="truncate text-xs text-slate-500">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CustomerReviews;