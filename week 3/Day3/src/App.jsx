import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import ProductList from './components/ProductList';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import { initialProducts, CATEGORIES } from './data/products';
import './App.css';

const DEFAULT_MAX_PRICE = 300;

export default function App() {
  // State for search query
  const [searchTerm, setSearchTerm] = useState('');

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // State for max price filter
  const [currentMaxPrice, setCurrentMaxPrice] = useState(DEFAULT_MAX_PRICE);

  // State for sorting
  const [sortBy, setSortBy] = useState('featured');

  // Count items per category for the filter pills
  const categoryCounts = useMemo(() => {
    const counts = { All: initialProducts.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = initialProducts.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, []);

  // Filter products using array.filter() based on search, category, and price
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search filter: matches product name (case-insensitive)
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      // 2. Category filter: 'All' or matches specific category
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      // 3. Price filter: price must be less than or equal to currentMaxPrice
      const matchesPrice = product.price <= currentMaxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchTerm, selectedCategory, currentMaxPrice]);

  // Sort filtered products
  const sortedAndFilteredProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list; // 'featured' retains natural catalog order
    }
  }, [filteredProducts, sortBy]);

  // Compute number of active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim() !== '') count++;
    if (selectedCategory !== 'All') count++;
    if (currentMaxPrice < DEFAULT_MAX_PRICE) count++;
    return count;
  }, [searchTerm, selectedCategory, currentMaxPrice]);

  // Reset all filters back to default values
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setCurrentMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy('featured');
  };

  return (
    <div className="app-layout">
      {/* Top Application Header */}
      <Header
        totalCount={initialProducts.length}
        filteredCount={sortedAndFilteredProducts.length}
      />

      <main className="catalog-main">
        <div className="catalog-container">
          {/* Search, Categories, Price Slider, and Filter Actions */}
          <FilterControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={() => setSearchTerm('')}
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
            minPrice={0}
            maxAllowedPrice={DEFAULT_MAX_PRICE}
            currentMaxPrice={currentMaxPrice}
            onPriceChange={setCurrentMaxPrice}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Catalog Content Area */}
          <div className="results-container">
            {sortedAndFilteredProducts.length > 0 ? (
              <ProductList products={sortedAndFilteredProducts} />
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                currentMaxPrice={currentMaxPrice}
                onResetFilters={handleResetFilters}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
