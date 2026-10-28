import React from 'react';

/**
 * CategoryFilter component renders selectable pills for filtering products by category.
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {}
}) {
  return (
    <div className="filter-group">
      <span className="filter-label">Category</span>
      <div className="category-pills" role="radiogroup" aria-label="Product Categories">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const count = categoryCounts[category];

          return (
            <button
              key={category}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`category-pill ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              <span>{category}</span>
              {typeof count === 'number' && (
                <span className="category-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
