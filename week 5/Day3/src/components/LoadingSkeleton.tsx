export function LoadingSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs"
        >
          {/* Skeleton Thumbnail */}
          <div className="aspect-4/3 w-full bg-gray-200" />

          {/* Skeleton Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 bg-gray-200 rounded-md w-3/5" />
              <div className="h-4 bg-gray-200 rounded-md w-1/5" />
            </div>

            <div className="space-y-1.5">
              <div className="h-3 bg-gray-200 rounded-md w-full" />
              <div className="h-3 bg-gray-200 rounded-md w-4/5" />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/4" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <div className="h-7 bg-gray-200 rounded-lg flex-1" />
              <div className="h-7 bg-gray-200 rounded-lg w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
