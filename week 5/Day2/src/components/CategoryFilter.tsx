interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  disabled = false,
}: CategoryFilterProps) {
  // Format slug category names like "home-decoration" to "Home Decoration"
  const formatCategoryName = (cat: string) => {
    return cat
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full sm:w-60">
      <label htmlFor="category-select" className="sr-only">
        Filter by category
      </label>
      <div className="relative">
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none px-3.5 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-lg shadow-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
