import useCatalog from './hooks/useCatalog';
import Header from './components/Header';
import FilterControls from './components/FilterControls';
import ProductList from './components/ProductList';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';
import { initialProducts, CATEGORIES } from './data/products';
import './App.css';

const DEFAULT_MAX_PRICE = 300;

export default function App() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentMaxPrice,
    setCurrentMaxPrice,
    sortBy,
    setSortBy,
    categoryCounts,
    sortedAndFilteredProducts,
    activeFilterCount,
    resetFilters,
  } = useCatalog(initialProducts, CATEGORIES, DEFAULT_MAX_PRICE);

  return (
    <div className="app-layout">
      <Header
        totalCount={initialProducts.length}
        filteredCount={sortedAndFilteredProducts.length}
      />

      <main className="catalog-main">
        <div className="catalog-container">
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
            onResetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
          />

          <div className="results-container">
            {sortedAndFilteredProducts.length > 0 ? (
              <ProductList products={sortedAndFilteredProducts} />
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                currentMaxPrice={currentMaxPrice}
                maxAllowedPrice={DEFAULT_MAX_PRICE}
                onResetFilters={resetFilters}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
