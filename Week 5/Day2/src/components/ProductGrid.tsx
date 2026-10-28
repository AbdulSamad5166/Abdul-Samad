import type { Product } from '../types/product.ts';
import { ProductCard } from './ProductCard.tsx';
import { LoadingSkeleton } from './LoadingSkeleton.tsx';
import { ErrorMessage } from './ErrorMessage.tsx';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  deletingId?: number | null;
  onRetry: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  loading,
  error,
  deletingId,
  onRetry,
  onEdit,
  onDelete,
  onResetFilters,
}: ProductGridProps) {
  // 1. Loading UI state
  if (loading) {
    return <LoadingSkeleton count={12} />;
  }

  // 2. Error UI state
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  // 3. Empty UI state
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No products found
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          We couldn&apos;t find any products matching your current query or category filter.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  // 4. Data UI state: Responsive 1 col on mobile, 2 on tablet, 3-4 on desktop
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === product.id}
        />
      ))}
    </div>
  );
}
