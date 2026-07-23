import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/sections/Hero";
import { VehicleSelector } from "@/sections/VehicleSelector";
import { Categories } from "@/sections/Categories";
import { Brands } from "@/sections/Brands";
import { Products } from "@/sections/Products";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { LogisticsStats } from "@/sections/LogisticsStats";

export function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <main>
      <Hero />
      <VehicleSelector />
      <Categories />
      <Brands />
      <Products />
      <WhyChooseUs />
      <LogisticsStats />
    </main>
  );
}
