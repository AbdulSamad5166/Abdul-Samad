import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../api/products.ts';
import type { ProductsResponse } from '../types/product.ts';

export interface UseProductsQueryParams {
  search: string;
  category: string;
  page: number;
}

export const PRODUCTS_PAGE_SIZE = 12;

export function useProductsQuery({ search, category, page }: UseProductsQueryParams) {
  // Query key includes all active inputs: ['products', { search, category, page }].
  // Switching to a page or category already visited displays cached data immediately without refetch delay.
  const queryKey = ['products', { search, category, page }] as const;

  return useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: () => {
      const limit = PRODUCTS_PAGE_SIZE;
      const skip = (page - 1) * limit;

      if (search.trim()) {
        return searchProducts(search.trim(), limit, skip);
      }
      if (category) {
        return getProductsByCategory(category, limit, skip);
      }
      return getProducts(limit, skip);
    },
    placeholderData: keepPreviousData,
  });
}

export function useCategoriesQuery() {
  return useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    // List of categories is static and does not change over the session lifetime.
    staleTime: Infinity,
  });
}
