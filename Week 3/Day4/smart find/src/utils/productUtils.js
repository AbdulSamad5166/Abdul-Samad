export function getCategoryCounts(products, categories) {
  const counts = { All: products.length };

  categories.forEach((category) => {
    if (category !== 'All') {
      counts[category] = products.filter(
        (product) => product.category === category,
      ).length;
    }
  });

  return counts;
}

export function getSortedAndFilteredProducts(
  products,
  { searchTerm, selectedCategory, currentMaxPrice, sortBy },
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchingProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(normalizedSearch);
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= currentMaxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  switch (sortBy) {
    case 'price-asc':
      return matchingProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return matchingProducts.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return matchingProducts.sort((a, b) => b.rating - a.rating);
    case 'name-asc':
      return matchingProducts.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return matchingProducts;
  }
}

export function countActiveFilters({
  searchTerm,
  selectedCategory,
  currentMaxPrice,
  defaultMaxPrice,
}) {
  let count = 0;

  if (searchTerm.trim() !== '') count += 1;
  if (selectedCategory !== 'All') count += 1;
  if (currentMaxPrice < defaultMaxPrice) count += 1;

  return count;
}
