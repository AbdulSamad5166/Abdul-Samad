import { useMemo, useState } from 'react';
import {
  countActiveFilters,
  getCategoryCounts,
  getSortedAndFilteredProducts,
} from '../utils/productUtils';

export default function useCatalog(products, categories, defaultMaxPrice) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentMaxPrice, setCurrentMaxPrice] = useState(defaultMaxPrice);
  const [sortBy, setSortBy] = useState('featured');

  const categoryCounts = useMemo(
    () => getCategoryCounts(products, categories),
    [products, categories],
  );

  const sortedAndFilteredProducts = useMemo(
    () =>
      getSortedAndFilteredProducts(products, {
        searchTerm,
        selectedCategory,
        currentMaxPrice,
        sortBy,
      }),
    [products, searchTerm, selectedCategory, currentMaxPrice, sortBy],
  );

  const activeFilterCount = useMemo(
    () =>
      countActiveFilters({
        searchTerm,
        selectedCategory,
        currentMaxPrice,
        defaultMaxPrice,
      }),
    [searchTerm, selectedCategory, currentMaxPrice, defaultMaxPrice],
  );

  function resetFilters() {
    setSearchTerm('');
    setSelectedCategory('All');
    setCurrentMaxPrice(defaultMaxPrice);
    setSortBy('featured');
  }

  return {
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
  };
}
