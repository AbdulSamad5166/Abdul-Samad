import React from 'react';

/**
 * Header component displaying the brand logo, title, and current product count status.
 */
export default function Header({ totalCount, filteredCount }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Smart<span className="brand-highlight">Find</span></h1>
            <p className="brand-tagline">Search & Filter Catalog</p>
          </div>
        </div>

        <div className="header-badge">
          <span className="badge-pulse"></span>
          <span className="badge-text">
            Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> items
          </span>
        </div>
      </div>
    </header>
  );
}
