import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Package,
} from 'lucide-react';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Alert } from '../components/ui/Alert';
import { DeleteConfirmModal } from '../components/products/DeleteConfirmModal';
import { formatCurrency, getStockStatus } from '../utils/formatters';
import { parseApiError } from '../api/client';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch product by route ID param using TanStack Query
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useProduct(id);

  const deleteMutation = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <ErrorState
          title="Product not found"
          message={error ? parseApiError(error) : 'Unable to find product with the provided ID.'}
          onRetry={refetch}
          isRetrying={isRefetching}
        />
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock);
  const selectedImage = activeImage || product.thumbnail || product.images?.[0];

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(product.id);
      setIsDeleteModalOpen(false);
      navigate('/products');
    } catch (err) {
      setErrorMessage(parseApiError(err));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/products')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Products
        </Button>

        <div className="flex items-center gap-2">
          <Link to={`/products/${product.id}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>
              Edit Product
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-4 shadow-xs">
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-16 h-16 rounded-lg border-2 p-1 bg-white dark:bg-slate-900 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-indigo-600 dark:border-indigo-400'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="neutral">{product.category}</Badge>
              {product.brand && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating ?? '4.5'} / 5.0</span>
              </div>
              <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-1">
              Price
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(product.price)}
              </span>
              {product.discountPercentage && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Description
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Specs Card */}
          <Card>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> SKU
                </span>
                <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  {product.sku || `SKU-${product.id}`}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Warranty
                </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {product.warrantyInformation || '1 year standard warranty'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" /> Shipping
                </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {product.shippingInformation || 'Standard shipping: 3-5 business days'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Return Policy
                </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {product.returnPolicy || '30-day money back guarantee'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {rev.reviewerName}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    ★ {rev.rating}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">"{rev.comment}"</p>
                <p className="text-[10px] text-slate-400">
                  {new Date(rev.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        productTitle={product.title}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
