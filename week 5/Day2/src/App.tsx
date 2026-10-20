import { Navbar } from './components/Navbar.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { CategoryFilter } from './components/CategoryFilter.tsx';
import { ProductGrid } from './components/ProductGrid.tsx';
import { Pagination } from './components/Pagination.tsx';
import { Modal } from './components/Modal.tsx';
import { ProductForm } from './components/ProductForm.tsx';
import { useProducts } from './hooks/useProducts.ts';

export default function App() {
  const {
    products,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    page,
    total,
    limit,
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
    retry,
  } = useProducts();

  const isFiltering = Boolean(searchQuery || selectedCategory);

  const handleResetFilters = () => {
    handleSearch('');
    handleCategoryChange('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 antialiased">
      {/* Navigation Bar */}
      <Navbar onAddProduct={openAddModal} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls Bar: Search & Category Filter */}
        <section
          aria-label="Filter and Search Controls"
          className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
        >
          <SearchBar
            currentQuery={searchQuery}
            onSearch={handleSearch}
            disabled={loading}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            disabled={loading}
          />
        </section>

        {/* Active Filter Pill Bar */}
        {isFiltering && (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-lg text-sm text-indigo-900">
            <div className="flex items-center gap-2">
              <span className="font-medium">Active filter:</span>
              {searchQuery && (
                <span>
                  Search &ldquo;<strong>{searchQuery}</strong>&rdquo;
                </span>
              )}
              {selectedCategory && (
                <span>
                  Category &ldquo;<strong>{selectedCategory}</strong>&rdquo;
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Products Grid (handles Loading, Error, Empty, and Data states) */}
        <section aria-label="Products Catalog">
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            deletingId={deletingId}
            onRetry={retry}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
            onResetFilters={isFiltering ? handleResetFilters : undefined}
          />
        </section>

        {/* Pagination Section */}
        {!loading && !error && total > 0 && (
          <section aria-label="Pagination">
            <Pagination
              currentPage={page}
              totalItems={total}
              limit={limit}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </section>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm
          key={editingProduct ? `edit-${editingProduct.id}` : 'add-new'}
          initialProduct={editingProduct}
          categories={categories}
          submitting={formSubmitting}
          onSubmitNew={handleAddProduct}
          onSubmitEdit={handleEditProduct}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
