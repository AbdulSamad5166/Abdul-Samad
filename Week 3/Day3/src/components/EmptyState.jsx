import React from 'react';

/**
 * EmptyState component displayed when search or filters return 0 matching products.
 */
export default function EmptyState({
  searchTerm,
  selectedCategory,
  currentMaxPrice,
  onResetFilters
}) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-icon-wrapper" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      </div>

      <h3 className="empty-title">No products found</h3>
      
      <p className="empty-description">
        We couldn't find any products matching your current criteria.
      </p>

      {/* Breakdown of what's currently active */}
      <div className="empty-criteria-pills">
        {searchTerm && (
          <span className="criteria-pill">
            Keyword: <strong>"{searchTerm}"</strong>
          </span>
        )}
        {selectedCategory !== 'All' && (
          <span className="criteria-pill">
            Category: <strong>{selectedCategory}</strong>
          </span>
        )}
        {currentMaxPrice < 300 && (
          <span className="criteria-pill">
            Max Price: <strong>${currentMaxPrice}</strong>
          </span>
        )}
      </div>

      <p className="empty-suggestion">
        Try checking for spelling errors, increasing your price range, or clearing all filters.
      </p>

      <button
        type="button"
        className="reset-filters-btn primary-reset"
        onClick={onResetFilters}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
        Reset All Filters
      </button>
    </div>
  );
}
