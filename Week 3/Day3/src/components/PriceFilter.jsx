import React from 'react';

/**
 * PriceFilter component allows the user to filter products below a maximum price threshold.
 */
export default function PriceFilter({
  minPrice = 0,
  maxAllowedPrice = 300,
  currentMaxPrice,
  onPriceChange
}) {
  const presets = [50, 100, 150, maxAllowedPrice];

  return (
    <div className="filter-group price-filter-group">
      <div className="filter-header-row">
        <label htmlFor="price-range" className="filter-label">
          Max Price
        </label>
        <div className="price-badge">
          {currentMaxPrice >= maxAllowedPrice ? (
            <span>Any Price (≤ ${maxAllowedPrice})</span>
          ) : (
            <span>Up to <strong>${currentMaxPrice.toFixed(0)}</strong></span>
          )}
        </div>
      </div>

      <div className="price-slider-container">
        <input
          id="price-range"
          type="range"
          min={minPrice}
          max={maxAllowedPrice}
          step={5}
          value={currentMaxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="price-slider"
          aria-label="Filter by maximum price"
        />
        <div className="price-range-labels">
          <span>${minPrice}</span>
          <span>${Math.round(maxAllowedPrice / 2)}</span>
          <span>${maxAllowedPrice}</span>
        </div>
      </div>

      <div className="price-presets">
        <span className="presets-label">Quick filter:</span>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`preset-btn ${currentMaxPrice === preset ? 'active' : ''}`}
            onClick={() => onPriceChange(preset)}
          >
            {preset === maxAllowedPrice ? 'All' : `< $${preset}`}
          </button>
        ))}
      </div>
    </div>
  );
}
