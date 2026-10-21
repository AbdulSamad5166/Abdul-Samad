import { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { CategoryFilter } from './components/CategoryFilter.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { Pagination } from './components/Pagination.tsx';
import { LoadingSkeleton } from './components/LoadingSkeleton.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { Modal } from './components/Modal.tsx';
import { ProductForm } from './components/ProductForm.tsx';
import {
  PRODUCTS_PAGE_SIZE,
  useCategoriesQuery,
  useProductsQuery,
} from './hooks/useProductsQuery.ts';
import { useProductMutations } from './hooks/useProductMutations.ts';
import { getErrorMessage } from './utils/getErrorMessage.ts';
import type { NewProduct, Product } from './types/product.ts';

export default function App() {
  // Client state only - all server data is strictly handled via TanStack Query hooks
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // TanStack Query server state queries
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useProductsQuery({ search, category, page });

  const { data: categories = [], isLoading: isCategoriesLoading } = useCategoriesQuery();

  // TanStack Query server state mutations
  const { createMutation, updateMutation, deleteMutation } = useProductMutations();

  // Search and category cannot be active together (selecting one resets the other)
  // Changing search or category resets page to 1
  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setCategory('');
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setSearch('');
    setPage(1);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setActionError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setActionError(null);
  };

  const handleCreateProduct = (newProduct: NewProduct) => {
    setActionError(null);
    createMutation.mutate(newProduct, {
      onSuccess: () => {
        handleCloseModal();
      },
      onError: (err) => {
        setActionError(getErrorMessage(err));
      },
    });
  };

  const handleUpdateProduct = (id: number, changes: Partial<NewProduct>) => {
    setActionError(null);
    updateMutation.mutate(
      { id, changes },
      {
        onSuccess: () => {
          handleCloseModal();
        },
        onError: (err) => {
          setActionError(getErrorMessage(err));
        },
      }
    );
  };

  const handleDeleteProduct = (id: number, title: string) => {
    // Delete product with window.confirm
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setActionError(null);
      deleteMutation.mutate(id, {
        onError: (err) => {
          setActionError(getErrorMessage(err));
        },
      });
    }
  };

  const isFormPending = createMutation.isPending || updateMutation.isPending;
  const deletingId = deleteMutation.isPending ? (deleteMutation.variables as number) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      {/* Navbar with Title, Add button and Refresh button */}
      <Navbar onOpenAddModal={handleOpenAddModal} isFetching={isFetching} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mutation Error Notification Banner */}
        {actionError && (
          <div
            role="alert"
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-800"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium">{actionError}</p>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-red-500 hover:text-red-700 p-1 rounded-md"
              aria-label="Dismiss error notification"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Filter & Controls Toolbar */}
        <section
          aria-label="Filter products"
          className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        >
          <SearchBar currentSearch={search} onSearch={handleSearch} />
          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleCategoryChange}
            isLoading={isCategoriesLoading}
          />
        </section>

        {/* Query State Display: isPending -> skeleton, isError -> retry, success -> grid */}
        {isPending ? (
          <LoadingSkeleton count={PRODUCTS_PAGE_SIZE} />
        ) : isError ? (
          <ErrorMessage error={error} onRetry={() => refetch()} />
        ) : (
          <>
            <ProductGrid
              products={data?.products ?? []}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
              deletingId={deletingId}
            />
            <Pagination
              page={page}
              total={data?.total ?? 0}
              limit={PRODUCTS_PAGE_SIZE}
              onPageChange={setPage}
              isFetching={isFetching}
            />
          </>
        )}
      </main>

      {/* Add / Edit Product Modal Form */}
      <Modal
        isOpen={isModalOpen}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onClose={handleCloseModal}
      >
        <ProductForm
          initialProduct={editingProduct}
          categories={categories}
          isPending={isFormPending}
          onSubmitCreate={handleCreateProduct}
          onSubmitUpdate={handleUpdateProduct}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
