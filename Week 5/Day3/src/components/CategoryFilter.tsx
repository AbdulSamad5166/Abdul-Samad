interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading = false,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category-select" className="text-sm font-medium text-gray-700 shrink-0">
        Category:
      </label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        disabled={isLoading}
        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize transition-colors"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.replace(/-/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}
