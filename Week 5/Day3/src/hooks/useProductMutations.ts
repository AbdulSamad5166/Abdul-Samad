import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, updateProduct } from '../api/products.ts';
import type {
  NewProduct,
  Product,
  ProductsResponse,
  UpdateProductPayload,
} from '../types/product.ts';

interface MutationContext {
  previousQueries: Array<[readonly unknown[], ProductsResponse | undefined]>;
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  // Track IDs of user-created products because they do not exist on the DummyJSON server.
  const localCreatedIdsRef = useRef<Set<number>>(new Set());

  // 1. CREATE MUTATION
  const createMutation = useMutation<Product, Error, NewProduct>({
    mutationFn: async (newProduct: NewProduct) => {
      return createProduct(newProduct);
    },
    onSuccess: (createdProduct) => {
      // DummyJSON returns a static mock ID (e.g. 195) for all created products.
      // We assign a timestamp-based ID to ensure unique keys in the list.
      const assignedId = Date.now();
      const productWithId: Product = {
        ...createdProduct,
        id: assignedId,
        rating: createdProduct.rating ?? 5.0,
        stock: createdProduct.stock ?? 25,
        thumbnail:
          createdProduct.thumbnail ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
      };

      // Record ID so subsequent edit/delete operations skip API calls to DummyJSON server
      localCreatedIdsRef.current.add(assignedId);

      // DummyJSON is a simulated API and does not persist data to the server.
      // We manually update TanStack Query cache with setQueriesData instead of invalidateQueries,
      // because invalidating would trigger a refetch that erases newly created items.
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            total: old.total + 1,
            products: [productWithId, ...old.products],
          };
        }
      );
    },
  });

  // 2. UPDATE MUTATION (Optimistic UI)
  const updateMutation = useMutation<Product, Error, UpdateProductPayload, MutationContext>({
    mutationFn: async ({ id, changes }) => {
      if (localCreatedIdsRef.current.has(id)) {
        // User-created product does not exist on DummyJSON server; skip network call
        return { id, ...changes } as Product;
      }
      return updateProduct(id, changes);
    },
    onMutate: async ({ id, changes }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic UI update
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous query data for all product queries
      const previousQueries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: ['products'],
      });

      // Optimistically update cache immediately
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((item) =>
              item.id === id ? { ...item, ...changes } : item
            ),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback to the previous snapshot if server mutation fails
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSuccess: (updatedProduct) => {
      // Update cache with confirmed changes. InvalidateQueries is intentionally omitted
      // because DummyJSON is a mock backend that doesn't persist data.
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((item) =>
              item.id === updatedProduct.id ? { ...item, ...updatedProduct } : item
            ),
          };
        }
      );
    },
  });

  // 3. DELETE MUTATION (Optimistic UI)
  const deleteMutation = useMutation<Product, Error, number, MutationContext>({
    mutationFn: async (id: number) => {
      if (localCreatedIdsRef.current.has(id)) {
        // Product was created locally and doesn't exist on server; skip API call
        localCreatedIdsRef.current.delete(id);
        return { id } as Product;
      }
      return deleteProduct(id);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });

      const previousQueries = queryClient.getQueriesData<ProductsResponse>({
        queryKey: ['products'],
      });

      // Optimistically remove product from cache immediately
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            total: Math.max(0, old.total - 1),
            products: old.products.filter((item) => item.id !== id),
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      // Rollback cache to previous snapshot on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    // InvalidateQueries is omitted to prevent DummyJSON mock server from restoring the deleted item.
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
