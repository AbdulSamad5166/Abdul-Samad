import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function Products() {
  const { products, deleteProduct, updateStock, currency } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "stock">("featured");

  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...list];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "stock") return b.stock - a.stock;
        return 0; // default order
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from inventory?`)) {
      deleteProduct(id);
    }
  };

  return (
    <main>
      <div className="page-header-row">
        <div>
          <h1>Product Catalog</h1>
          <p className="subtitle">
            Manage inventory items, adjust stock levels, and review full product details.
          </p>
        </div>
        <Link to="/products/add" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <section className="catalog-toolbar content-card">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="search-clear-btn"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="toolbar-controls">
          <div className="sort-box">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="toolbar-select"
            >
              <option value="featured">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Highest Stock</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill-btn ${selectedCategory === cat ? "active" : ""}`}
          >
            {cat} {cat === "All" ? `(${products.length})` : `(${products.filter((p) => p.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state content-card">
          <p className="empty-icon">📦</p>
          <h3>No products match your criteria</h3>
          <p>Try adjusting your search query or category filter, or register a new item.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="btn btn-secondary"
            style={{ marginTop: "12px" }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="content-card product-card" key={product.id}>
              <div className="product-card-img-wrapper">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-card-img"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <span className="product-badge-category">{product.category}</span>
                {product.rating && (
                  <span className="product-rating-tag">★ {product.rating}</span>
                )}
              </div>

              <div className="product-card-body">
                <div className="product-card-header">
                  <h2 className="product-title">{product.name}</h2>
                  <span className="product-sku">SKU: {product.sku}</span>
                </div>

                <p className="product-card-desc">
                  {product.description.length > 80
                    ? `${product.description.substring(0, 80)}...`
                    : product.description}
                </p>

                <div className="product-card-pricing">
                  <div className="price-tag">
                    {currency} {product.price.toLocaleString()}
                  </div>
                  <div>
                    {product.stock > 0 ? (
                      <span className="badge-in">{product.stock} units</span>
                    ) : (
                      <span className="badge-out">Out of Stock</span>
                    )}
                  </div>
                </div>

                {/* Stock Quick Controller */}
                <div className="stock-quick-bar">
                  <span className="stock-quick-label">Quick Stock:</span>
                  <div className="stock-quick-btns">
                    <button
                      type="button"
                      onClick={() => updateStock(product.id, -1)}
                      disabled={product.stock <= 0}
                      className="stock-btn"
                      title="Decrease stock by 1"
                    >
                      -
                    </button>
                    <span className="stock-count">{product.stock}</span>
                    <button
                      type="button"
                      onClick={() => updateStock(product.id, 1)}
                      className="stock-btn"
                      title="Increase stock by 1"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="product-card-actions">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id, product.name)}
                    className="btn btn-danger-icon btn-sm"
                    title="Delete item"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}