export interface Product {
  productId: number;
  name: string;
  description?: string;
  price: number;
  color?: string;
  material?: string;
  size?: string;
  closure?: string;
  collection?: string;
  height?: number;
  width?: number;
  insideTexture?: string;
  insideColor?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductStock {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  totalStock: number;  // El backend devuelve "TotalStock" (mayúscula), Angular es case-insensitive por defecto en HTTP
}

export interface ProductCreate {
  name: string;
  description?: string;
  basePrice: number;
  price?: number;
  color?: string;
  material?: string;
  size?: string;
  closure?: string;
  collection?: string;
  height?: number;
  width?: number;
  insideTexture?: string;
  insideColor?: string;
  imageUrl?: string;
}
