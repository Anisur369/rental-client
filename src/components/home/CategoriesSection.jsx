"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HardHat,
  Camera,
  Truck,
  Sprout,
  Cpu,
  Speaker,
  ArrowRight,
  Grid,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "construction",
    name: "Construction Equipment",
    description:
      "Excavators, rotary hammers, scaffolding, concrete mixers, and heavy site tools.",
    count: "120+ Items",
    icon: HardHat,
    accentClass: "bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "photography",
    name: "Photography Equipment",
    description:
      "Cinema cameras, prime lenses, studio lighting, gimbals, and audio gear for shoots.",
    count: "85+ Items",
    icon: Camera,
    accentClass: "bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "vehicles",
    name: "Vehicles & Transportation",
    description:
      "Cargo vans, pickup trucks, utility vehicles, and transport carriers for logistics.",
    count: "60+ Items",
    icon: Truck,
    accentClass: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "agriculture",
    name: "Agriculture Equipment",
    description:
      "Power tillers, sprayers, harvesters, and irrigation tools for modern farming.",
    count: "70+ Items",
    icon: Sprout,
    accentClass: "bg-lime-100 text-lime-800 group-hover:bg-lime-600 group-hover:text-white",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "electronics",
    name: "Electronics",
    description:
      "Generators, projectors, testing meters, power stations, and diagnostic devices.",
    count: "95+ Items",
    icon: Cpu,
    accentClass: "bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "event",
    name: "Event Equipment",
    description:
      "PA sound systems, stage trusses, LED displays, canopies, and event lighting.",
    count: "50+ Items",
    icon: Speaker,
    accentClass: "bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const itemVariants = {
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

export default function CategoriesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center space-y-2.5"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Grid className="h-3.5 w-3.5" />
            Browse By Category
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Popular Equipment Categories
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Find specialized tools and machinery across high-demand categories
            tailored to your project timeline[cite: 32, 34].
          </p>
        </motion.div>

        {/* 3-Column Responsive Grid with Equal Card Heights */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            const queryUrl = `/equipment?category=${encodeURIComponent(
              category.name
            )}`;

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <Link
                  href={queryUrl}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all hover:border-amber-300 hover:shadow-xl"
                >
                  {/* Uniform Category Image */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {category.count}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${category.accentClass}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-amber-700">
                        {category.name}
                      </h3>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {category.description}
                    </p>

                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 transition-transform group-hover:translate-x-1">
                        <span>Browse {category.name.split(" ")[0]}</span>
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}