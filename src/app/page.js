import BannerSection from "@/components/home/BannerSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CustomerReviews from "@/components/home/CustomerReviews";
import ExtraSections from "@/components/home/ExtraSections";
import FeaturedEquipment from "@/components/home/FeaturedEquipment";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <BannerSection />
      <FeaturedEquipment />
      <CategoriesSection />
      <WhyChooseUs />
      <CustomerReviews />
      <ExtraSections />
    </>
  );
}
