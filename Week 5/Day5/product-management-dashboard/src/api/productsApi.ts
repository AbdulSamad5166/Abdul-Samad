import { apiClient } from './client';
import { Product, ProductsResponse, CategoryItem, ProductFormData } from '../types/product';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Fetch products list with optional search, category, pagination, and sorting
 */
export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { limit = 10, skip = 0, search = '', category = '', sortBy, order } = params;

  let url = '/products';
  const queryParams: Record<string, string | number> = {
    limit,
    skip,
  };

  if (sortBy) {
    queryParams.sortBy = sortBy;
    queryParams.order = order || 'asc';
  }

  if (search.trim()) {
    url = '/products/search';
    queryParams.q = search.trim();
  } else if (category && category !== 'all') {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const response = await apiClient.get<ProductsResponse>(url, {
    params: queryParams,
  });

  return response.data;
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: number | string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

/**
 * Fetch categories list (normalizes both array of strings and array of objects)
 */
export async function getCategories(): Promise<CategoryItem[]> {
  const response = await apiClient.get<Array<string | { slug: string; name: string; url?: string }>>('/products/categories');
  const data = response.data;

  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    if (typeof item === 'string') {
      const cleanName = item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' ');
      return { slug: item, name: cleanName };
    }
    return {
      slug: item.slug || item.name,
      name: item.name || item.slug,
      url: item.url,
    };
  });
}

/**
 * Add a new product (DummyJSON simulates POST)
 */
export async function addProduct(data: ProductFormData): Promise<Product> {
  const response = await apiClient.post<Product>('/products/add', data);
  return response.data;
}

/**
 * Update an existing product (DummyJSON simulates PUT)
 */
export async function updateProduct(id: number | string, data: Partial<ProductFormData>): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
}

/**
 * Delete a product (DummyJSON simulates DELETE)
 */
export async function deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean; title: string }> {
  const response = await apiClient.delete<{ id: number; isDeleted: boolean; title: string }>(`/products/${id}`);
  return response.data;
}
