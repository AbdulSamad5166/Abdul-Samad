import { Link, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { getProductById, deleteProduct, updateStock, currency } = useProducts();

  const product = productId ? getProductById(Number(productId)) : undefined;

  if (!product) {
    return (
      <main className="details-not-found content-card">
        <h1>Product Not Found</h1>
        <p className="subtitle">
          The requested product ID #{productId} could not be located in your active catalog.
        </p>
        <div style={{ marginTop: "24px" }}>
          <Link to="/products" className="btn btn-primary">
            ← Return to Product Catalog
          </Link>
        </div>
      </main>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
      navigate("/products");
    }
  };

  return (
    <main className="product-details-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <Link to="/products">Products</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-details-container content-card">
        {/* Left: Product Media Gallery */}
        <div className="details-media-column">
          <div className="details-main-image-wrapper">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="details-main-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <span className="details-category-badge">{product.category}</span>
          </div>
          <div className="image-caption">
            SKU: <strong>{product.sku}</strong> | Database ID: #{product.id}
          </div>
        </div>

        {/* Right: Specifications & Operations */}
        <div className="details-content-column">
          <div className="details-header-row">
            <div>
              <h1 className="details-title">{product.name}</h1>
              <div className="details-rating-row">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-value">{product.rating} / 5.0 Rating</span>
                <span className="rating-divider">•</span>
                <span className="category-text">Category: {product.category}</span>
              </div>
            </div>
            <div className="details-price-badge">
              {currency} {product.price.toLocaleString()}
            </div>
          </div>

          <div className="details-stock-status-box">
            <div className="stock-info">
              <span className="stock-label">Stock Availability:</span>
              {product.stock > 0 ? (
                <span className="badge-in">In Stock ({product.stock} units ready)</span>
              ) : (
                <span className="badge-out">Currently Out of Stock</span>
              )}
            </div>

            {/* Quick Live Stock Adjuster */}
            <div className="stock-adjuster">
              <span className="adjuster-label">Adjust Stock:</span>
              <button
                type="button"
                onClick={() => updateStock(product.id, -1)}
                disabled={product.stock <= 0}
                className="stock-btn"
                title="Deduct 1"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => updateStock(product.id, 1)}
                className="stock-btn"
                title="Add 1"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => updateStock(product.id, 10)}
                className="stock-btn"
                title="Add batch of 10"
              >
                +10
              </button>
            </div>
          </div>

          <div className="details-section">
            <h3>Product Overview</h3>
            <p className="details-description">{product.description}</p>
          </div>

          <div className="details-specs-grid">
            <div className="spec-item">
              <span className="spec-label">Item SKU</span>
              <span className="spec-val">{product.sku}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Category</span>
              <span className="spec-val">{product.category}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Total Inventory Value</span>
              <span className="spec-val">
                {currency} {(product.price * product.stock).toLocaleString()}
              </span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Status</span>
              <span className="spec-val">
                {product.stock > 5 ? "Normal" : product.stock > 0 ? "Low Stock" : "Restock Needed"}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="details-actions-bar">
            <Link
              to={`/products/edit/${product.id}`}
              className="btn btn-primary"
            >
              ✏️ Edit Product Details
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
            >
              🗑 Delete Product
            </button>
            <Link to="/products" className="btn btn-secondary">
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}