import React from 'react';

/**
 * SearchBar component for filtering products by name.
 */
export default function SearchBar({ searchTerm, onSearchChange, onClear }) {
  return (
    <div className="search-bar-wrapper">
      <label htmlFor="search-input" className="sr-only">
        Search products by name
      </label>
      <div className="search-input-container">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search products by name (e.g., headphones, watch, lamp)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />

        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search text"
            title="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
