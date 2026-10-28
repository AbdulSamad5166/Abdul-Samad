import { apiClient } from './client.ts';
import type {
  Product,
  NewProduct,
  UpdateProductPayload,
  ProductsResponse,
} from '../types/product.ts';

/**
 * Fetch paginated list of products.
 */
export async function getProducts(
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`
  );
  return response.data;
}

/**
 * Search products by keyword query.
 */
export async function searchProducts(
  query: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
  return response.data;
}

/**
 * Fetch products filtered by a specific category.
 */
export async function getProductsByCategory(
  category: string,
  limit: number = 12,
  skip: number = 0
): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
  );
  return response.data;
}

/**
 * Fetch all available product categories list.
 */
export async function getCategories(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/products/category-list');
  return response.data;
}

/**
 * Create a new product.
 * Returns the created product object with a simulated ID from DummyJSON.
 */
export async function createProduct(productData: NewProduct): Promise<Product> {
  const response = await apiClient.post<Product>('/products/add', productData);
  return response.data;
}

/**
 * Update an existing product sending only changed fields.
 */
export async function updateProduct(
  id: number,
  changedFields: UpdateProductPayload
): Promise<Product> {
  const response = await apiClient.patch<Product>(
    `/products/${id}`,
    changedFields
  );
  return response.data;
}

/**
 * Delete a product by its id.
 */
export async function deleteProduct(id: number): Promise<Product> {
  const response = await apiClient.delete<Product>(`/products/${id}`);
  return response.data;
}
