import { apiClient } from './client.ts';
import type { NewProduct, Product, ProductsResponse } from '../types/product.ts';

export async function getProducts(limit: number, skip: number): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products', {
    params: { limit, skip },
  });
  return response.data;
}

export async function searchProducts(
  query: string,
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products/search', {
    params: { q: query, limit, skip },
  });
  return response.data;
}

export async function getProductsByCategory(
  category: string,
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params: { limit, skip },
    }
  );
  return response.data;
}

export async function getCategories(): Promise<string[]> {
  const response = await apiClient.get<Array<string | { slug: string; name?: string }>>(
    '/products/category-list'
  );
  return response.data.map((item) => (typeof item === 'string' ? item : item.slug));
}

export async function createProduct(newProduct: NewProduct): Promise<Product> {
  const response = await apiClient.post<Product>('/products/add', newProduct);
  return response.data;
}

export async function updateProduct(
  id: number,
  changes: Partial<NewProduct>
): Promise<Product> {
  const response = await apiClient.patch<Product>(`/products/${id}`, changes);
  return response.data;
}

export async function deleteProduct(id: number): Promise<Product> {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}
