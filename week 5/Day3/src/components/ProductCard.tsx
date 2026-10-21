import { useState } from 'react';
import type { Product } from '../types/product.ts';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number, title: string) => void;
  isDeleting: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  isDeleting,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    product.thumbnail ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80'
  );

  return (
    <article className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() =>
            setImgSrc(
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80'
            )
          }
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 text-xs font-semibold bg-white/95 text-gray-800 rounded-md shadow-xs backdrop-blur-xs">
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3
              className="text-base font-semibold text-gray-900 line-clamp-1"
              title={product.title}
            >
              {product.title}
            </h3>
            <span className="text-base font-bold text-indigo-600 shrink-0">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description || 'No description provided.'}
          </p>
        </div>

        {/* Rating and Stock info */}
        <div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 font-medium text-amber-600">
              <svg
                className="w-3.5 h-3.5 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{product.rating !== undefined ? Number(product.rating).toFixed(1) : '5.0'}</span>
            </div>

            <div className="text-gray-500">
              <span className="font-medium text-gray-700">
                {product.stock ?? 25}
              </span>{' '}
              in stock
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(product.id, product.title)}
              disabled={isDeleting}
              className="py-1.5 px-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={`Delete ${product.title}`}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
