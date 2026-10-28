import React from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';
import SortFilter from './SortFilter';

/**
 * FilterControls component consolidates all filter & search controls into a cohesive toolbar.
 */
export default function FilterControls({
  searchTerm,
  onSearchChange,
  onClearSearch,
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  minPrice,
  maxAllowedPrice,
  currentMaxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
  onResetFilters,
  activeFilterCount
}) {
  return (
    <section className="filter-controls-panel" aria-label="Catalog Filters">
      {/* Top Search & Reset Row */}
      <div className="search-and-actions-row">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onClear={onClearSearch}
        />

        <div className="actions-cluster">
          <SortFilter
            sortBy={sortBy}
            onSortChange={onSortChange}
          />

          <button
            type="button"
            className={`reset-btn ${activeFilterCount > 0 ? 'active' : ''}`}
            onClick={onResetFilters}
            disabled={activeFilterCount === 0}
            title={activeFilterCount > 0 ? `Reset ${activeFilterCount} active filters` : 'No filters applied'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
            <span>Reset Filters</span>
            {activeFilterCount > 0 && (
              <span className="active-filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Secondary Row: Category & Price Range */}
      <div className="filters-grid">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          categoryCounts={categoryCounts}
        />

        <PriceFilter
          minPrice={minPrice}
          maxAllowedPrice={maxAllowedPrice}
          currentMaxPrice={currentMaxPrice}
          onPriceChange={onPriceChange}
        />
      </div>
    </section>
  );
}
