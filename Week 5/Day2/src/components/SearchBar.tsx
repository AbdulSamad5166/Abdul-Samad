import { useState, useEffect } from 'react';

interface SearchBarProps {
  currentQuery: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
}

export function SearchBar({
  currentQuery,
  onSearch,
  disabled = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>(currentQuery);

  // Sync internal state if query was reset externally (e.g. by category filter)
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-[240px] max-w-lg">
      <label htmlFor="product-search-input" className="sr-only">
        Search products
      </label>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          id="product-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products (e.g., phone, perfume)..."
          disabled={disabled}
          className="w-full pl-10 pr-20 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search text"
            className="absolute right-18 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="absolute right-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
