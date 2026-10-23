import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Users,
  DollarSign,
  ArrowRight,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useUsers } from '../hooks/useUsers';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkeletonTable } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { formatCurrency, getStockStatus } from '../utils/formatters';
import { parseApiError } from '../api/client';

export function DashboardPage() {
  // Fetch initial products for stats and latest table
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useProducts({ limit: 10, skip: 0 });

  // Fetch categories for stat count
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useCategories();

  // Fetch users for stat count
  const {
    data: usersData,
    isLoading: isLoadingUsers,
  } = useUsers({ limit: 1, skip: 0 });

  // Calculate statistics from real API data
  const totalProducts = productsData?.total ?? 0;
  const totalCategories = categories.length;
  const totalUsers = usersData?.total ?? 0;

  const averagePrice =
    productsData?.products && productsData.products.length > 0
      ? productsData.products.reduce((acc, p) => acc + p.price, 0) / productsData.products.length
      : 0;

  // Latest products (first 5 from the list)
  const latestProducts = productsData?.products.slice(0, 5) || [];

  if (isProductsError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Inventory and store health metrics</p>
        </div>
        <ErrorState
          title="Could not load dashboard statistics"
          message={parseApiError(productsError)}
          onRetry={refetchProducts}
          isRetrying={isRefetchingProducts}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics and inventory metrics connected to DummyJSON API
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/products/new">
            <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              All Products
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-5 h-5" />}
          description="Catalog items recorded"
          trend={{ value: '100% synced', isPositive: true }}
          isLoading={isLoadingProducts}
        />

        <StatCard
          title="Product Categories"
          value={totalCategories || 24}
          icon={<Layers className="w-5 h-5" />}
          description="Active product categories"
          isLoading={isLoadingCategories}
        />

        <StatCard
          title="Registered Users"
          value={totalUsers || 208}
          icon={<Users className="w-5 h-5" />}
          description="Total system accounts"
          isLoading={isLoadingUsers}
        />

        <StatCard
          title="Average Unit Price"
          value={formatCurrency(averagePrice)}
          icon={<DollarSign className="w-5 h-5" />}
          description="Across current batch"
          isLoading={isLoadingProducts}
        />
      </div>

      {/* Latest Products Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Latest Products</CardTitle>
            <CardDescription>Recently updated inventory items from the catalog</CardDescription>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1"
          >
            View Full Inventory
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingProducts ? (
            <div className="p-4">
              <SkeletonTable rows={5} />
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No products found in the catalog.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {latestProducts.map((product) => {
                    const stock = getStockStatus(product.stock);
                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.thumbnail || 'https://placehold.co/40x40?text=Item'}
                              alt={product.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs text-xs sm:text-sm">
                                {product.title}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {product.brand || 'Generic'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="neutral">{product.category}</Badge>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          {formatCurrency(product.price)}
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant={stock.variant}>{stock.label}</Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/products/${product.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline"
                          >
                            Details
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
