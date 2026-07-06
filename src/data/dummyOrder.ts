export interface DummyOrderItem {
  partNumber: string;
  title: string;
  description: string;
  img: string;
  quantity: number;
  unitPrice: number;
}

export interface DummyOrderAddress {
  fullName: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

export const DUMMY_ORDER = {
  reference: "PH-77291",
  invoiceNumber: "PHA-99281-K",
  placedAt: "2026-06-24",
  vehicleLabel: "2024 BMW M3 (G80)",

  shippingAddress: {
    fullName: "Julian Vercetti",
    address: "42 High Performance Drive",
    suburb: "South Melbourne",
    state: "VIC",
    postcode: "3205",
    country: "Australia",
  } satisfies DummyOrderAddress,

  billingAddress: {
    fullName: "Julian Vercetti",
    address: "42 High Performance Drive",
    suburb: "South Melbourne",
    state: "VIC",
    postcode: "3205",
    country: "Australia",
  } satisfies DummyOrderAddress,

  paymentMethod: { brand: "Visa", last4: "8802" },

  items: [
    {
      partNumber: "BRK-3342-GT",
      title: "Brembo GT Series Brake Kit",
      description: "Front Axle | 6-Piston Monoblock | Slotted Rotors",
      img: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=200&h=200&fit=crop",
      quantity: 1,
      unitPrice: 3450,
    },
    {
      partNumber: "SUS-7710-KW",
      title: "KW V3 Coilover Suspension",
      description: "Inox-Line | Rebound & Compression Adjustable",
      img: "https://images.unsplash.com/photo-1760836395865-0c20fff2aefd?w=200&h=200&fit=crop",
      quantity: 1,
      unitPrice: 2890,
    },
    {
      partNumber: "FIL-102-K&N",
      title: "High-Flow Performance Air Filter",
      description: "Washable Cotton Gauze | Lifetime Warranty",
      img: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=200&h=200&fit=crop",
      quantity: 2,
      unitPrice: 125,
    },
  ] satisfies DummyOrderItem[],

  shippingCost: 45,
};

export function getDummyOrderTotals() {
  const subtotal = DUMMY_ORDER.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = DUMMY_ORDER.shippingCost;
  const gst = (subtotal + shipping) * 0.1;
  const total = subtotal + shipping + gst;
  return { subtotal, shipping, gst, total };
}
