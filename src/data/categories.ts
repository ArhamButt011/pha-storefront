export interface CategoryMeta {
  slug: string;
  title: string;
  breadcrumbParent: string;
  description: string;
  img: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "engine",
    title: "Engine",
    breadcrumbParent: "Performance",
    description: "Pistons, gaskets, timing components and full engine builds for maximum output and reliability.",
    img: "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop",
  },
  {
    slug: "suspension",
    title: "Suspension Systems",
    breadcrumbParent: "Performance",
    description: "Precision-engineered suspension components designed for ultimate track performance and street comfort. Explore our curated range for your vehicle.",
    img: "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop",
  },
  {
    slug: "turbo-systems",
    title: "Turbo Systems",
    breadcrumbParent: "Performance",
    description: "Turbochargers, intercoolers and boost hardware to unlock serious power gains.",
    img: "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop",
  },
  {
    slug: "cooling",
    title: "Cooling",
    breadcrumbParent: "Performance",
    description: "Radiators, fans and oil coolers that keep your build running at its best under load.",
    img: "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop",
  },
  {
    slug: "brakes",
    title: "Brakes",
    breadcrumbParent: "Performance",
    description: "Pads, rotors, calipers and full big-brake kits engineered for repeatable stopping power.",
    img: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop",
  },
  {
    slug: "electrical",
    title: "Electrical",
    breadcrumbParent: "Performance",
    description: "Batteries, alternators, starters and wiring components for a dependable electrical system.",
    img: "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop",
  },
  {
    slug: "exhaust",
    title: "Exhaust Systems",
    breadcrumbParent: "Performance",
    description: "Cat-back systems, headers and mufflers engineered for flow, sound and weight savings.",
    img: "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop",
  },
  {
    slug: "drivetrain",
    title: "Drivetrain",
    breadcrumbParent: "Performance",
    description: "Clutches, differentials and driveshafts built to handle everything your engine can throw at them.",
    img: "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop",
  },
  {
    slug: "wheels-tyres",
    title: "Wheels & Tyres",
    breadcrumbParent: "Performance",
    description: "Forged wheels and performance rubber to put the power down with confidence.",
    img: "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop",
  },
  {
    slug: "lighting",
    title: "Lighting",
    breadcrumbParent: "Performance",
    description: "LED, HID and driving lights for better visibility and a sharper look.",
    img: "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop",
  },
  {
    slug: "interior",
    title: "Interior Accessories",
    breadcrumbParent: "Performance",
    description: "Gauges, pedals and trim upgrades that sharpen the cabin experience.",
    img: "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop",
  },
  {
    slug: "body-exterior",
    title: "Body & Exterior",
    breadcrumbParent: "Performance",
    description: "Splitters, bumpers and aero components engineered for form and function.",
    img: "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop",
  },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
