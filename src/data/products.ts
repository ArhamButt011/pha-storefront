export type StockStatus = "in-stock" | "limited" | "out-of-stock";
export type Badge = "top-rated" | "sale";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  categorySlug: string;
  brand: string;
  partType: string;
  title: string;
  img: string;
  rating: number;
  price: number;
  oldPrice?: number;
  badge?: Badge;
  stock: { status: StockStatus; label: string };
  /** Makes this part fits — "all" means universal fitment */
  fits: string[] | "all";

  // Optional product-detail-page fields
  grade?: string;
  gallery?: string[];
  sku?: string;
  brandFull?: string;
  warranty?: string;
  material?: string;
  shortDescription?: string;
  engineeringNote?: string;
  features?: string[];
  specs?: ProductSpec[];
  compatibility?: string[];
  fitmentConfirmedFor?: string;
  reviewCount?: number;
  reviews?: ProductReview[];
}

export const PRODUCTS: Product[] = [
  // Suspension
  {
    id: "kw-v3-coilover-911-gt3",
    categorySlug: "suspension",
    brand: "KW Automotive",
    partType: "Coilovers",
    title: "KW V3 Coilover Kit - Porsche 911 (992) GT3",
    img: "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?w=500&h=500&fit=crop",
    rating: 4.9,
    price: 3899,
    badge: "top-rated",
    stock: { status: "in-stock", label: "In Stock - Ready to Ship" },
    fits: ["Porsche"],
  },
  {
    id: "ohlins-road-track-damper",
    categorySlug: "suspension",
    brand: "Öhlins",
    partType: "Coilovers",
    title: "Öhlins Road & Track Damper Set",
    img: "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=500&h=500&fit=crop",
    rating: 5.0,
    price: 5100,
    oldPrice: 6600,
    badge: "sale",
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "bilstein-b16-pss10",
    categorySlug: "suspension",
    brand: "Bilstein",
    partType: "Coilovers",
    title: "Bilstein B16 (PSS10) Performance Suspension",
    img: "https://images.unsplash.com/photo-1729545321223-e597f91a25d9?w=500&h=500&fit=crop",
    rating: 4.8,
    price: 3240,
    stock: { status: "limited", label: "Limited Stock - 3 Remaining" },
    fits: ["Porsche"],
  },
  {
    id: "eibach-pro-kit-lowering-springs",
    categorySlug: "suspension",
    brand: "Eibach",
    partType: "Lowering Springs",
    title: "Eibach Pro-Kit Lowering Springs",
    img: "https://images.unsplash.com/photo-1770400770299-4940896a198b?w=500&h=500&fit=crop",
    rating: 4.7,
    price: 649,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "rss-tarmac-control-arms",
    categorySlug: "suspension",
    brand: "RSS Motorsport",
    partType: "Control Arms",
    title: "Tarmac Series Adjustable Control Arms",
    img: "https://images.unsplash.com/photo-1769218401807-5495675a2eb1?w=500&h=500&fit=crop",
    rating: 5.0,
    price: 1895,
    stock: { status: "out-of-stock", label: "Out of Stock - Enquire for ETA" },
    fits: ["Porsche"],
  },
  {
    id: "hr-adjustable-anti-roll-bar",
    categorySlug: "suspension",
    brand: "H&R Special Springs",
    partType: "Anti-Roll Bars",
    title: "H&R Adjustable Anti-Roll Bar Kit",
    img: "https://images.unsplash.com/photo-1698721565296-30eff2e0af15?w=500&h=500&fit=crop",
    rating: 4.9,
    price: 825,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },

  // Engine
  {
    id: "edelbrock-intake-manifold",
    categorySlug: "engine",
    brand: "Edelbrock",
    partType: "Intake",
    title: "Performance Intake Manifold",
    img: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=500&h=500&fit=crop",
    rating: 4.6,
    price: 1290,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "cosworth-forged-piston-set",
    categorySlug: "engine",
    brand: "Cosworth",
    partType: "Internals",
    title: "Forged Piston & Rod Set",
    img: "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=500&h=500&fit=crop",
    rating: 4.9,
    price: 2450,
    stock: { status: "limited", label: "Limited Stock - 5 Remaining" },
    fits: ["Porsche"],
  },

  // Turbo Systems
  {
    id: "garrett-g25-660-turbo",
    categorySlug: "turbo-systems",
    brand: "Garrett Performance",
    partType: "Turbochargers",
    title: "G-Series G25-660 Turbocharger",
    img: "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=500&h=500&fit=crop",
    rating: 4.9,
    price: 2850,
    badge: "top-rated",
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "turbo-inlet-pipe-kit",
    categorySlug: "turbo-systems",
    brand: "HKS",
    partType: "Piping",
    title: "Turbo Inlet Pipe Kit",
    img: "https://images.unsplash.com/photo-1591879742348-13012c2963bf?w=500&h=500&fit=crop",
    rating: 4.5,
    price: 320,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },

  // Cooling
  {
    id: "mishimoto-silicone-hose-kit",
    categorySlug: "cooling",
    brand: "Mishimoto",
    partType: "Hoses",
    title: "Silicone Radiator Hose Kit",
    img: "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=500&h=500&fit=crop",
    rating: 4.7,
    price: 289,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "flex-a-lite-electric-fan-kit",
    categorySlug: "cooling",
    brand: "Flex-a-lite",
    partType: "Fans",
    title: "Electric Cooling Fan Kit",
    img: "https://images.unsplash.com/photo-1591879742348-13012c2963bf?w=500&h=500&fit=crop",
    rating: 4.6,
    price: 245,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },

  // Brakes
  {
    id: "brembo-gt-series-braking-system",
    categorySlug: "brakes",
    brand: "Brembo Performance",
    partType: "Big Brake Kits",
    title: "GT Series Braking System",
    img: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=500&h=500&fit=crop",
    rating: 4.9,
    price: 4299,
    badge: "top-rated",
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "brembo-gts-slotted-rotor-kit",
    categorySlug: "brakes",
    brand: "Brembo",
    partType: "Rotors",
    title: "Brembo GT-S Type 3 Slotted Performance Rotor Kit",
    img: "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?w=700&h=700&fit=crop",
    rating: 4.9,
    price: 2499,
    oldPrice: 2850,
    stock: { status: "in-stock", label: "In Stock: Ready for Immediate Shipment" },
    fits: ["BMW"],
    grade: "Performance Grade",
    gallery: [
      "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1588017530244-c57df911f73b?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1774902410486-648614277f1f?w=900&h=900&fit=crop",
      "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=900&h=900&fit=crop",
    ],
    sku: "90-022J-X0R0",
    brandFull: "Brembo Italia",
    warranty: "24 Month / 60,000km",
    material: "High-Carbon Alloy",
    shortDescription: "Precision engineering for the track and street. Complete front rotor replacement kit.",
    engineeringNote:
      "The Brembo GT-S Braking System is designed for the enthusiast who demands maximum performance on track while maintaining street manners. Utilizing a unique high-carbon alloy, the rotors offer superior thermal stability and resistance to brake fade under extreme conditions.",
    features: [
      "Type 3 Slotted design for aggressive bite and pad cleaning",
      "Patented Pillar Vane Technology (PVT) for 20% more cooling",
      "Direct OEM Replacement - no modifications required",
    ],
    specs: [
      { label: "Rotor Diameter", value: "350mm" },
      { label: "Thickness (Nominal)", value: "31mm" },
      { label: "Bolt Pattern", value: "5 x 112" },
      { label: "Construction", value: "2-Piece Floating" },
    ],
    compatibility: ["BMW M3 (G80)", "BMW M4 (G82)", "BMW M3 Competition"],
    fitmentConfirmedFor: "2023 BMW M3 (G80)",
    reviewCount: 350,
    reviews: [
      { name: "Daniel R.", rating: 5, date: "2026-05-14", comment: "Massive improvement over the OEM rotors. Zero fade after a full track day." },
      { name: "Marcus T.", rating: 5, date: "2026-04-02", comment: "Fitment was spot on for my G80. Install took under an hour with basic tools." },
      { name: "Chris H.", rating: 4, date: "2026-02-27", comment: "Great rotors, a little more brake dust than stock but stopping power is night and day." },
    ],
  },
  {
    id: "wilwood-forged-superlite-calipers",
    categorySlug: "brakes",
    brand: "Wilwood",
    partType: "Calipers",
    title: "Forged Superlite Caliper Set",
    img: "https://images.unsplash.com/photo-1656232976683-7b688560e427?w=500&h=500&fit=crop",
    rating: 4.5,
    price: 1650,
    stock: { status: "limited", label: "Limited Stock - 4 Remaining" },
    fits: "all",
  },

  // Electrical
  {
    id: "newpowa-lithium-battery",
    categorySlug: "electrical",
    brand: "Newpowa",
    partType: "Batteries",
    title: "Lithium 12V 100Ah Battery",
    img: "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=500&h=500&fit=crop",
    rating: 4.8,
    price: 389,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
  {
    id: "odyssey-battery-terminal-kit",
    categorySlug: "electrical",
    brand: "Odyssey",
    partType: "Accessories",
    title: "Racing Battery Terminal Kit",
    img: "https://images.unsplash.com/photo-1742899273038-67ff67477663?w=500&h=500&fit=crop",
    rating: 4.4,
    price: 156,
    stock: { status: "in-stock", label: "In Stock" },
    fits: "all",
  },
];

export function getProductsByCategory(slug?: string) {
  if (!slug) return PRODUCTS;
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getProductById(id?: string) {
  return PRODUCTS.find((p) => p.id === id);
}
