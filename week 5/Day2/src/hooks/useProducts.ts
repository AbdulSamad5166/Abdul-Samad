import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Product,
  NewProduct,
  UpdateProductPayload,
  ProductsResponse,
} from '../types/product.ts';
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products.ts';
import { getErrorMessage } from '../utils/getErrorMessage.ts';

const PAGE_LIMIT = 12;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Active filters and pagination state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // Modal and editing state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Track IDs of user-created products because they do not exist on DummyJSON server
  const userCreatedIdsRef = useRef<Set<number>>(new Set());

  // Fetch available categories once on mount
  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setIsCategoriesLoading(true);
      try {
        const categoryList = await getCategories();
        if (isMounted) {
          setCategories(categoryList);
        }
      } catch (err: unknown) {
        // Fallback: category dropdown will still work with available products
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) {
          setIsCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Main fetch function for product data
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const skip = (page - 1) * PAGE_LIMIT;

    try {
      let data: ProductsResponse;

      if (searchQuery.trim()) {
        data = await searchProducts(searchQuery.trim(), PAGE_LIMIT, skip);
      } else if (selectedCategory) {
        data = await getProductsByCategory(selectedCategory, PAGE_LIMIT, skip);
      } else {
        data = await getProducts(PAGE_LIMIT, skip);
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory]);

  // Trigger fetch when page, search query, or category changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Search handler
   * DummyJSON API does not support combining category filtering and keyword search in a single endpoint,
   * so applying a search resets the selected category and resets pagination to page 1.
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
    setPage(1);
  };

  /**
   * Category filter handler
   * DummyJSON API does not support combining category filtering and keyword search in a single endpoint,
   * so selecting a category resets the search query and resets pagination to page 1.
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setPage(1);
  };

  /**
   * Page navigation handler
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  /**
   * Open modal for creating a new product
   */
  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  /**
   * Open modal for editing an existing product
   */
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  /**
   * Close product form modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  /**
   * Add Product handler (POST)
   * DummyJSON is a simulated API that returns a success response with a simulated ID
   * but does not actually persist the record on the server. Therefore, we manually update
   * local React state and remember the generated ID so subsequent edits/deletes don't fail.
   */
  const handleAddProduct = async (productData: NewProduct): Promise<boolean> => {
    setFormSubmitting(true);
    try {
      const created = await createProduct(productData);

      // Default mock fields if server doesn't return full details
      const newProductItem: Product = {
        ...created,
        id: created.id || Date.now(),
        rating: created.rating || 5,
        stock: created.stock || 10,
        thumbnail:
          created.thumbnail ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=60',
        isLocalOnly: true,
      };

      // Record ID so we know not to call DummyJSON server for this product later
      userCreatedIdsRef.current.add(newProductItem.id);

      // Manually prepend to local list to show the new product immediately
      setProducts((prev) => [newProductItem, ...prev]);
      setTotal((prev) => prev + 1);
      closeModal();
      return true;
    } catch (err: unknown) {
      alert(getErrorMessage(err));
      return false;
    } finally {
      setFormSubmitting(false);
    }
  };

  /**
   * Edit Product handler (PATCH)
   * Only changed fields are submitted.
   * If the product was created by the user, we skip the API call because it does not exist
   * on the DummyJSON server; otherwise we call PATCH and then update local state manually.
   */
  const handleEditProduct = async (
    id: number,
    changedFields: UpdateProductPayload
  ): Promise<boolean> => {
    setFormSubmitting(true);
    const isUserCreated = userCreatedIdsRef.current.has(id);

    try {
      if (!isUserCreated) {
        // Only call PATCH on server for items that originated from the server
        await updateProduct(id, changedFields);
      }

      // Update local state manually because DummyJSON does not persist changes to its database
      setProducts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changedFields } : item))
      );

      closeModal();
      return true;
    } catch (err: unknown) {
      alert(getErrorMessage(err));
      return false;
    } finally {
      setFormSubmitting(false);
    }
  };

  /**
   * Delete Product handler (DELETE)
   * Prompts the user with window.confirm before deleting.
   * If the product was created locally, we delete only from local state;
   * otherwise we call the DELETE endpoint and update local state upon success.
   */
  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );
    if (!confirmed) {
      return;
    }

    const isUserCreated =
      userCreatedIdsRef.current.has(product.id) || product.isLocalOnly;

    setDeletingId(product.id);
    try {
      if (!isUserCreated) {
        // Send DELETE request to DummyJSON API for server-origin products
        await deleteProduct(product.id);
      }

      // Remove from local state manually since DummyJSON does not persist deletions
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return {
    products,
    categories,
    isCategoriesLoading,
    loading,
    error,
    searchQuery,
    selectedCategory,
    page,
    total,
    limit: PAGE_LIMIT,
    isModalOpen,
    editingProduct,
    formSubmitting,
    deletingId,
    handleSearch,
    handleCategoryChange,
    handlePageChange,
    openAddModal,
    openEditModal,
    closeModal,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    retry: fetchProducts,
  };
}
