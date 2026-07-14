// The backend Category model has no image field, so categories are styled
// entirely on the frontend. Known slugs get a matching curated image;
// anything the API returns that we don't recognize just cycles through
// DEFAULT_IMAGES by array index, so every category always gets a picture.
const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  engine: "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop",
  suspension: "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop",
  "turbo-systems": "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop",
  cooling: "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop",
  brakes: "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop",
  electrical: "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop",
  exhaust: "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop",
  drivetrain: "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop",
  "wheels-tyres": "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop",
  lighting: "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop",
  interior: "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop",
  "body-exterior": "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop",
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1720244253125-f39d7aeccccf?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1701836924325-3bdbfc2e8689?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1673153597250-ae20d69e7fde?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621579159856-d5251fd2b5c7?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1573939843624-b22996c1a31c?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1692309175422-b9d614f4764e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1725916631373-23184b9b9170?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1614689304159-273632ab5c5a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1608412217711-ab7d42cf7920?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611099711902-1228419f7113?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=600&h=600&fit=crop",
];

export function getCategoryImage(slug: string, index: number): string {
  return CATEGORY_IMAGE_BY_SLUG[slug] ?? DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
}