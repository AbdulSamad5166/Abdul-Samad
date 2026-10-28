import { useState } from 'react';
import type {
  Product,
  NewProduct,
  UpdateProductPayload,
} from '../types/product.ts';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: string[];
  submitting: boolean;
  onSubmitNew: (product: NewProduct) => Promise<boolean>;
  onSubmitEdit: (id: number, changedFields: UpdateProductPayload) => Promise<boolean>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  price?: string;
}

export function ProductForm({
  initialProduct,
  categories,
  submitting,
  onSubmitNew,
  onSubmitEdit,
  onCancel,
}: ProductFormProps) {
  const isEditMode = Boolean(initialProduct);

  // Controlled form input state
  const [title, setTitle] = useState<string>(initialProduct?.title ?? '');
  const [price, setPrice] = useState<string>(
    initialProduct?.price !== undefined ? String(initialProduct.price) : ''
  );
  const [category, setCategory] = useState<string>(
    initialProduct?.category ?? (categories[0] || 'general')
  );
  const [description, setDescription] = useState<string>(
    initialProduct?.description ?? ''
  );

  // Field validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation: required
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Price validation: must be a valid number greater than 0
    const parsedPrice = Number(price);
    if (!price.trim()) {
      newErrors.price = 'Price must be a number greater than 0';
    } else if (isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.price = 'Price must be a number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditMode && initialProduct) {
      // For PATCH: only send fields that have actually changed from the original product
      const changedFields: UpdateProductPayload = {};
      const trimmedTitle = title.trim();
      const numPrice = Number(price);
      const trimmedDescription = description.trim();

      if (trimmedTitle !== initialProduct.title) {
        changedFields.title = trimmedTitle;
      }
      if (numPrice !== initialProduct.price) {
        changedFields.price = numPrice;
      }
      if (category !== initialProduct.category) {
        changedFields.category = category;
      }
      if (trimmedDescription !== initialProduct.description) {
        changedFields.description = trimmedDescription;
      }

      // If nothing changed, we can safely close without sending a network request
      if (Object.keys(changedFields).length === 0) {
        onCancel();
        return;
      }

      await onSubmitEdit(initialProduct.id, changedFields);
    } else {
      // For POST: send full product data
      const newProductData: NewProduct = {
        title: title.trim(),
        price: Number(price),
        category: category || categories[0] || 'general',
        description: description.trim(),
      };
      await onSubmitNew(newProductData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Title Field */}
      <div>
        <label
          htmlFor="form-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Product Title <span className="text-red-500">*</span>
        </label>
        <input
          id="form-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({ ...prev, title: undefined }));
            }
          }}
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      {/* Price Field */}
      <div>
        <label
          htmlFor="form-price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Price (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
            $
          </div>
          <input
            id="form-price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) {
                setErrors((prev) => ({ ...prev, price: undefined }));
              }
            }}
            placeholder="29.99"
            className={`w-full pl-7 pr-3.5 py-2 text-sm bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 ${
              errors.price
                ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          />
        </div>
        {errors.price && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {errors.price}
          </p>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="form-category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="form-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat
                .split('-')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </option>
          ))}
          {categories.length === 0 && (
            <option value="general">General</option>
          )}
        </select>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="form-description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="form-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the product features and specs..."
          className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {submitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <span>{isEditMode ? 'Update Product' : 'Add Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
