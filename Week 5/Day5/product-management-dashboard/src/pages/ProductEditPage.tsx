import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { ProductForm } from '../components/products/ProductForm';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { parseApiError } from '../api/client';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch, isRefetching } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <ErrorState
          title="Cannot load product for editing"
          message={error ? parseApiError(error) : 'Product record could not be found.'}
          onRetry={refetch}
          isRetrying={isRefetching}
        />
      </div>
    );
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
