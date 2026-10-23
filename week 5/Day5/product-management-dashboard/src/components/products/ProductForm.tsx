import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import { Product, ProductFormData } from '../../types/product';
import { productFormSchema } from '../../schemas/productSchema';
import { useAddProduct, useUpdateProduct, useCategories } from '../../hooks/useProducts';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { parseApiError } from '../../api/client';

export interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  // Controlled form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    thumbnail: initialData?.thumbnail || '',
  });

  // Validation error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Form submission status states
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mutations
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  // Sync state if initialData arrives after render
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        category: initialData.category || '',
        brand: initialData.brand || '',
        thumbnail: initialData.thumbnail || '',
      });
    }
  }, [initialData]);

  // Handle controlled input changes
  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific validation error on change
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    // Validate with Zod
    const result = productFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isEditing && initialData) {
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: result.data,
        });
        setSuccessMessage(`Product "${result.data.title}" updated successfully! Redirecting...`);
      } else {
        await addMutation.mutateAsync(result.data);
        setSuccessMessage(`Product "${result.data.title}" added successfully! Redirecting...`);
      }

      // Smooth redirection back to products list
      setTimeout(() => {
        navigate('/products');
      }, 1200);
    } catch (err) {
      setServerError(parseApiError(err));
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/products')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Products
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? `Edit Product: ${initialData?.title || ''}` : 'Add New Product'}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? 'Update product details below. Changes are sent via PUT to DummyJSON.'
              : 'Fill in the information below to create a new product via POST to DummyJSON.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Status alerts */}
            {serverError && (
              <Alert variant="error" title="Error" onClose={() => setServerError(null)}>
                {serverError}
              </Alert>
            )}

            {successMessage && (
              <Alert variant="success" title="Success">
                {successMessage}
              </Alert>
            )}

            {/* Title field */}
            <Input
              label="Product Title"
              required
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              error={errors.title}
            />

            {/* Description field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="product-description"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="product-description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed description of features, materials, and specifications..."
                className={`w-full rounded-lg border py-2 px-3 text-sm transition-colors ${
                  errors.description
                    ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-rose-500 dark:text-rose-100'
                    : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price and Stock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Price (USD)"
                type="number"
                step="0.01"
                required
                value={formData.price === 0 && !isEditing ? '' : formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="49.99"
                error={errors.price}
              />

              <Input
                label="Stock Quantity"
                type="number"
                required
                value={formData.stock === 0 && !isEditing ? '' : formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value, 10) || 0)}
                placeholder="25"
                error={errors.stock}
              />
            </div>

            {/* Category and Brand Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                required
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder={isLoadingCategories ? 'Loading categories...' : 'Select category'}
                options={categoryOptions}
                error={errors.category}
              />

              <Input
                label="Brand"
                required
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g. Sony, Apple, Nike"
                error={errors.brand}
              />
            </div>

            {/* Thumbnail URL */}
            <Input
              label="Thumbnail Image URL (Optional)"
              type="url"
              value={formData.thumbnail || ''}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              placeholder="https://example.com/image.jpg"
              error={errors.thumbnail}
              helperText="Provide a direct image URL or leave blank to use placeholder"
            />

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate('/products')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={isEditing ? <Save className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              >
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
