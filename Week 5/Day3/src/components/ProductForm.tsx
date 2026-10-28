import { useState } from 'react';
import type { NewProduct, Product } from '../types/product.ts';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: string[];
  isPending: boolean;
  onSubmitCreate: (product: NewProduct) => void;
  onSubmitUpdate: (id: number, changes: Partial<NewProduct>) => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  price?: string;
}

export function ProductForm({
  initialProduct,
  categories,
  isPending,
  onSubmitCreate,
  onSubmitUpdate,
  onCancel,
}: ProductFormProps) {
  const [title, setTitle] = useState(initialProduct?.title ?? '');
  const [price, setPrice] = useState(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ''
  );
  const [category, setCategory] = useState(
    initialProduct?.category ?? (categories[0] || 'beauty')
  );
  const [description, setDescription] = useState(initialProduct?.description ?? '');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const numPrice = Number(price);
    if (!price.trim() || Number.isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price must be a number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedPrice = Number(price);

    if (initialProduct) {
      // For PATCH: send only changed fields
      const changes: Partial<NewProduct> = {};
      if (title.trim() !== initialProduct.title) {
        changes.title = title.trim();
      }
      if (parsedPrice !== initialProduct.price) {
        changes.price = parsedPrice;
      }
      if (category !== initialProduct.category) {
        changes.category = category;
      }
      if (description.trim() !== initialProduct.description) {
        changes.description = description.trim();
      }

      onSubmitUpdate(initialProduct.id, changes);
    } else {
      onSubmitCreate({
        title: title.trim(),
        price: parsedPrice,
        category: category || (categories[0] ?? 'beauty'),
        description: description.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Title */}
      <div>
        <label
          htmlFor="product-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="product-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
            errors.title
              ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 bg-white'
          }`}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.title}
          </p>
        )}
      </div>

      {/* Price & Category row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="product-price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
            }}
            placeholder="29.99"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
              errors.price
                ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 bg-white'
            }`}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? 'price-error' : undefined}
          />
          {errors.price && (
            <p id="price-error" className="mt-1 text-xs text-red-600 font-medium">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="product-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="product-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product details, specs, and features..."
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving...' : initialProduct ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
