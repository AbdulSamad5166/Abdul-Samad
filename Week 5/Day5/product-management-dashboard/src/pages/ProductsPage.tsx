import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  SlidersHorizontal,
  PackageSearch,
} from 'lucide-react';
import { useProducts, useCategories, useDeleteProduct } from '../hooks/useProducts';
import { Product } from '../types/product';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { SearchBar } from '../components/ui/SearchBar';
import { Select } from '../components/ui/Select';
import { Pagination } from '../components/ui/Pagination';
import { SkeletonTable } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Alert } from '../components/ui/Alert';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { formatCurrency, getStockStatus } from '../utils/formatters';
import { parseApiError } from '../api/client';

export function ProductsPage() {
  const navigate = useNavigate();
  const limit = 10;

  // Filter and pagination states
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Categories query
  const { data: categories = [] } = useCategories();

  // Products query with page, category, and search in the query parameters
  const skip = (page - 1) * limit;
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useProducts({
    limit,
    skip,
    search: searchTerm,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  // Delete mutation
  const deleteMutation = useDeleteProduct();

  // Client-side sort if needed
  const displayProducts = useMemo(() => {
    if (!productsData?.products) return [];
    const list = [...productsData.products];

    if (sortBy === 'price') {
      list.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
    } else if (sortBy === 'title') {
      list.sort((a, b) =>
        sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
    } else if (sortBy === 'rating') {
      list.sort((a, b) =>
        sortOrder === 'asc' ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0)
      );
    }

    return list;
  }, [productsData?.products, sortBy, sortOrder]);

  const totalProducts = productsData?.total ?? 0;
  const totalPages = Math.ceil(totalProducts / limit) || 1;

  // Handlers for search and category
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setPage(1); // Reset to page 1 on search
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1); // Reset to page 1 on filter
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteMutation.mutateAsync(productToDelete.id);
      setNotification({
        type: 'success',
        message: `Product "${productToDelete.title}" was deleted successfully! (DummyJSON simulated)`,
      });
      setProductToDelete(null);
    } catch (err) {
      setNotification({
        type: 'error',
        message: parseApiError(err),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Product Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse, search, edit, and organize product catalog records
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/products/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Notification banner */}
      {notification && (
        <Alert
          variant={notification.type}
          title={notification.type === 'success' ? 'Success' : 'Error'}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Filter and Search Bar Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products by title..."
          />
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-52">
          <Select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
          />
        </div>

        {/* Sort selector */}
        <div className="w-full sm:w-48">
          <Select
            value={sortBy === 'none' ? 'none' : `${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'none') {
                setSortBy('none');
              } else {
                const [f, o] = val.split('-');
                setSortBy(f);
                setSortOrder(o as 'asc' | 'desc');
              }
            }}
            options={[
              { value: 'none', label: 'Default Order' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'title-asc', label: 'Title: A to Z' },
              { value: 'title-desc', label: 'Title: Z to A' },
              { value: 'rating-desc', label: 'Rating: Highest' },
            ]}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isError ? (
        <ErrorState
          title="Failed to retrieve products"
          message={parseApiError(error)}
          onRetry={refetch}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <SkeletonTable rows={10} />
      ) : displayProducts.length === 0 ? (
        <EmptyState
          icon={<PackageSearch className="w-10 h-10" />}
          title="No products match your criteria"
          description={
            searchTerm
              ? `No items found matching "${searchTerm}". Try adjusting your keywords or clearing the filter.`
              : 'There are currently no products in this category.'
          }
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('all');
            setSortBy('none');
            setPage(1);
          }}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayProducts.map((product) => {
                    const stock = getStockStatus(product.stock);
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.thumbnail || 'https://placehold.co/48x48?text=Product'}
                              alt={product.title}
                              className="w-11 h-11 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/products/${product.id}`}
                                className="font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-xs block text-xs sm:text-sm"
                              >
                                {product.title}
                              </Link>
                              <p className="text-xs text-slate-400 truncate">
                                {product.brand || 'No brand specified'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="neutral">{product.category}</Badge>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          {formatCurrency(product.price)}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant={stock.variant}>{stock.label}</Badge>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-medium text-amber-600 dark:text-amber-400">
                          ★ {product.rating ? product.rating.toFixed(1) : 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              to={`/products/${product.id}`}
                              aria-label={`View details of ${product.title}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/products/${product.id}/edit`}
                              aria-label={`Edit ${product.title}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(product)}
                              aria-label={`Delete ${product.title}`}
                              className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalProducts}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        productTitle={productToDelete?.title || ''}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
