import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProductById,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  GetProductsParams,
} from '../api/productsApi';
import { ProductFormData } from '../types/product';

/**
 * Query key factory for products to keep cache keys organized and consistent
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productKeys.details(), id] as const,
  categories: ['categories'] as const,
};

/**
 * Hook to fetch paginated/filtered products list
 */
export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: number | string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });
}

/**
 * Hook to fetch all product categories
 */
export function useCategories() {
  return useQuery({
    queryKey: productKeys.categories,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10, // Categories don't change often, keep fresh for 10 mins
  });
}

/**
 * Hook to add a new product (POST) with automatic query invalidation
 */
export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProduct: ProductFormData) => addProduct(newProduct),
    onSuccess: () => {
      // Invalidate products query so the list refetches
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

/**
 * Hook to update an existing product (PUT) with automatic query invalidation
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<ProductFormData> }) =>
      updateProduct(id, data),
    onSuccess: (_updatedProduct, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a product (DELETE) with automatic query invalidation
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteProduct(id),
    onSuccess: (_result, deletedId) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
    },
  });
}
