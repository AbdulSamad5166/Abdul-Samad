export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  isLocalOnly?: boolean;
}

export interface NewProduct {
  title: string;
  price: number;
  category: string;
  description: string;
}

export interface UpdateProductPayload {
  title?: string;
  price?: number;
  category?: string;
  description?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
