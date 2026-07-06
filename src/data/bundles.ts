export interface Bundle {
  id: string;
  title: string;
  img: string;
  fitmentLabel: string;
  /** Makes this bundle fits — "all" means universal fitment */
  fits: string[] | "all";
  tags: string[];
  includes: string[];
  price: number;
  oldPrice: number;
}

export const BUNDLES: Bundle[] = [
  {
    id: "ultimate-brake-refresh-kit",
    title: "Ultimate Brake Refresh Kit",
    img: "https://images.unsplash.com/photo-1774902410486-648614277f1f?w=600&h=600&fit=crop",
    fitmentLabel: "BMW G80/G82",
    fits: ["BMW"],
    tags: ["Carbon-Ceramic Pads", "Grilled Rotors", "Braided Lines"],
    includes: [
      "2x Front Slotted Performance Rotors",
      "Front & Rear Brake Pad Set (Street/Track)",
      "2L Performance Dot 4 Brake Fluid",
    ],
    price: 1250,
    oldPrice: 1495,
  },
  {
    id: "complete-oil-service-bundle",
    title: "Complete Oil Service Bundle",
    img: "https://images.unsplash.com/photo-1590227763209-821c686b932f?w=600&h=600&fit=crop",
    fitmentLabel: "BMW Motors",
    fits: ["BMW"],
    tags: ["0W-20 Full Synth", "OEM Filter"],
    includes: [
      "7L Ravenol Synthetic Oil",
      "Magnetic Drain Plug Replacement",
      "High-Flow Oil Filter Cartridge",
    ],
    price: 168,
    oldPrice: 210,
  },
  {
    id: "suspension-overhaul-pack",
    title: "Suspension Overhaul Pack",
    img: "https://images.unsplash.com/photo-1729545321223-e597f91a25d9?w=600&h=600&fit=crop",
    fitmentLabel: "Universal Multi-Line",
    fits: "all",
    tags: ["Track-Ready", "Poly Bushings"],
    includes: [
      "Adjustable Front & Rear Coilovers",
      "Complete Polyurethane Bushing Set",
      "Front Upper Control Arms",
    ],
    price: 3270,
    oldPrice: 3850,
  },
];
