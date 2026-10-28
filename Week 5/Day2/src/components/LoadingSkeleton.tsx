interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      aria-label="Loading products"
      aria-busy="true"
    >
      {items.map((key) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs animate-pulse flex flex-col"
        >
          {/* Thumbnail placeholder */}
          <div className="w-full h-48 bg-gray-200" />

          {/* Content placeholder */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>

            <div className="pt-2 flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
