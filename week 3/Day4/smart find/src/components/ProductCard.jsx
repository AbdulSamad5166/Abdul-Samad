import React, { useState } from 'react';
import Button from './Button';

/**
 * ProductCard component displays an individual product's details in a clean card layout.
 */
export default function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <article className="product-card" id={`product-${product.id}`}>
      {/* Product Image & Badges */}
      <div className="product-image-container">
        {!imageLoaded && <div className="image-skeleton" aria-hidden="true" />}
        <img
          src={product.image}
          alt={product.name}
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Fallback image if unsplash link fails
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80";
            setImageLoaded(true);
          }}
        />

        {product.badge && (
          <span className={`product-badge badge-${product.badge.toLowerCase().replace(/\s+/g, '-')}`}>
            {product.badge}
          </span>
        )}

        <span className="product-category-chip">
          {product.category}
        </span>
      </div>

      {/* Product Body */}
      <div className="product-content">
        <div className="product-meta-row">
          {/* Star rating */}
          <div className="rating-pill" title={`${product.rating} out of 5 stars`}>
            <svg
              className="star-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>

          {/* Stock indicator */}
          <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            <span className="stock-dot"></span>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <p className="product-description">
          {product.description}
        </p>

        {/* Card Footer with Price & CTA */}
        <div className="product-footer">
          <div className="product-price-container">
            <span className="price-currency">$</span>
            <span className="price-integer">{Math.floor(product.price)}</span>
            <span className="price-fraction">.{(product.price % 1).toFixed(2).substring(2)}</span>
          </div>

          <Button
            className={`add-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            title={product.inStock ? 'Add to cart' : 'Item currently unavailable'}
          >
            {isAdded ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
