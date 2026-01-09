import type { Color, Product } from "../Search/Product";
import type { Messurement } from "../sizeCalculator/Messurements";

export type CartItem = {
  id: string;
  productId: Product["id"];
  label: string;
  price: number;
  product: Product;
  qty: number;
  color: Color;
  imgUrl?: string;
  size: Messurement | null;
}

export type SavedItem = Pick<CartItem, "id" | "imgUrl" | "label" | "price" | "product" | "productId">