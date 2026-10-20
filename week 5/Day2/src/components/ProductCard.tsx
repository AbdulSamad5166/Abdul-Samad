import type { Product } from '../types/product.ts';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isDeleting?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  isDeleting = false,
}: ProductCardProps) {
  // Format price with 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <article className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback for broken image URLs
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=60';
          }}
        />
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          {product.category}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="text-base font-semibold text-gray-900 line-clamp-1 mb-1"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
            {product.description || 'No description provided.'}
          </p>
        </div>

        <div>
          {/* Rating and Stock */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 font-medium text-amber-600">
              <svg
                className="w-4 h-4 fill-amber-400 text-amber-400"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{product.rating ?? 4.5}</span>
            </div>

            <div className="text-gray-500">
              Stock:{' '}
              <span
                className={`font-semibold ${
                  product.stock > 0 ? 'text-gray-900' : 'text-red-600'
                }`}
              >
                {product.stock ?? 0}
              </span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-lg font-bold text-gray-900">
              {formattedPrice}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(product)}
                aria-label={`Edit ${product.title}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => onDelete(product)}
                disabled={isDeleting}
                aria-label={`Delete ${product.title}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 active:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
