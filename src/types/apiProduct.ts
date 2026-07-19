export interface ApiAttachment {
  _id: string;
  url: string;
  original_name: string | null;
  mime_type: string | null;
  type: "image" | "video" | "file";
  uid: string;
  file_name: string | null;
}

export interface ApiCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiVehicle {
  make: string | null;
  model: string | null;
  model_code: string | null;
  year_from: number | null;
  year_to: number | null;
}

export interface ApiProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  status: string;
  is_published_online: boolean;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  brand: string | null;
  condition: string;
  authenticity: string | null;
  vehicle: ApiVehicle;
  attachments: ApiAttachment[];
  categories: ApiCategoryRef[];
  tags: string[];
  created_at?: string;
  stock_control: boolean;
  stock_count: number | null;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
}