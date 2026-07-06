export const PRODUCT_TABS = ["Specifications", "Compatibility", "Installation Guide", "Shipping & Returns"] as const;
export type ProductTab = (typeof PRODUCT_TABS)[number];

export const GENERIC_INSTALLATION_GUIDE =
  "This part is designed for installation by a qualified technician or experienced enthusiast. Full torque specifications and step-by-step instructions are included in the box. Contact our support team if you have any questions before you start.";

export const GENERIC_SHIPPING_RETURNS =
  "Orders ship from our Melbourne and Sydney hubs, most within 1 business day. Returns are accepted within 30 days on unused parts in original packaging — see our full Returns Policy for details.";
