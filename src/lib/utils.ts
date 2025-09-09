import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function inr(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `INR ${amount.toLocaleString()}`;
  }
}

type ProductLike = { category_id?: string | null; brand?: string | null; image_url?: string | null };

export function productImageUrl(product: ProductLike | null | undefined): string {
  if (!product) return "/placeholder.svg";
  if (product.image_url) return product.image_url;
  switch (product.category_id) {
    case "cat-phones":
      return "/images/product-phone.svg";
    case "cat-accessories":
      return "/images/product-accessory.svg";
    case "cat-parts":
      return "/images/product-part.svg";
    case "cat-tools":
      return "/images/product-tool.svg";
    default:
      return "/placeholder.svg";
  }
}