import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductList component maps over the filtered products array to display individual product cards.
 */
export default function ProductList({ products }) {
  return (
    <section className="product-grid" aria-label="Product Catalog">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
