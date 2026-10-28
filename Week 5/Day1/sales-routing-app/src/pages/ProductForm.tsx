import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../data/products";

const PRESET_IMAGES = [
  { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { label: "Smartwatch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { label: "Keyboard", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
  { label: "Mouse", url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80" },
  { label: "Chair", url: "https://images.unsplash.com/photo-1580481077195-c268801d9f82?auto=format&fit=crop&w=600&q=80" },
  { label: "Laptop Stand", url: "https://images.unsplash.com/photo-1616353071588-708dcff912e2?auto=format&fit=crop&w=600&q=80" },
];

export default function ProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById, currency } = useProducts();

  const isEditing = Boolean(productId);
  const existingProduct = productId ? getProductById(Number(productId)) : undefined;

  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics" as Product["category"],
    price: "",
    stock: "",
    sku: "",
    rating: "4.5",
    description: "",
    imageUrl: PRESET_IMAGES[0].url,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && existingProduct) {
      setFormData({
        name: existingProduct.name,
        category: existingProduct.category,
        price: existingProduct.price.toString(),
        stock: existingProduct.stock.toString(),
        sku: existingProduct.sku || "",
        rating: (existingProduct.rating || 4.5).toString(),
        description: existingProduct.description || "",
        imageUrl: existingProduct.imageUrl || PRESET_IMAGES[0].url,
      });
    }
  }, [isEditing, existingProduct]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Product title is required.");
      return;
    }

    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);
    const ratingNum = Number(formData.rating);

    if (isNaN(priceNum) || priceNum < 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError("Please enter a valid stock quantity (0 or greater).");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      rating: isNaN(ratingNum) ? 4.5 : Math.min(5, Math.max(1, ratingNum)),
      description: formData.description.trim() || "No description provided.",
      imageUrl: formData.imageUrl.trim() || PRESET_IMAGES[0].url,
    };

    if (isEditing && existingProduct) {
      updateProduct(existingProduct.id, payload);
      navigate(`/products/${existingProduct.id}`);
    } else {
      const created = addProduct(payload);
      navigate(`/products/${created.id}`);
    }
  };

  return (
    <main className="form-page">
      <div className="page-header-row">
        <div>
          <h1>{isEditing ? "Edit Product Details" : "Add New Product"}</h1>
          <p className="subtitle">
            {isEditing
              ? `Updating item specifications for #${existingProduct?.id} (${existingProduct?.name})`
              : "Expand your catalog by registering a new inventory item with photo & pricing"}
          </p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          ← Cancel & Return
        </Link>
      </div>

      {error && <div className="alert-box error">{error}</div>}

      <div className="product-form-layout">
        <form onSubmit={handleSubmit} className="product-form content-card">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              required
              placeholder="e.g. Mechanical Ergonomic Keyboard"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Product["category"],
                  })
                }
                className="form-select"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Accessories">Accessories</option>
                <option value="Wearables">Wearables</option>
                <option value="Office">Office</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU / Item Code</label>
              <input
                id="sku"
                type="text"
                placeholder="e.g. EL-KB-007"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Unit Price ({currency}) *</label>
              <input
                id="price"
                type="number"
                required
                min="0"
                step="any"
                placeholder="e.g. 4500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Available Stock *</label>
              <input
                id="stock"
                type="number"
                required
                min="0"
                placeholder="e.g. 15"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1 to 5)</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Product Photo URL</label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="form-input"
            />
            <div className="preset-container">
              <span className="preset-label">Quick preset images:</span>
              <div className="preset-buttons">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                    className="preset-btn"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description</label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide comprehensive details about material, features, technical specs, or warranty..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "+ Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate(isEditing ? `/products/${productId}` : "/products")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Live Preview Card */}
        <aside className="preview-pane">
          <div className="content-card preview-card">
            <span className="preview-tag">Live Card Preview</span>
            <div className="preview-img-wrapper">
              <img
                src={formData.imageUrl || PRESET_IMAGES[0].url}
                alt={formData.name || "Product Preview"}
                className="preview-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                }}
              />
            </div>
            <div className="preview-details">
              <div className="preview-header">
                <span className="category-pill">{formData.category}</span>
                <span className="rating-pill">★ {formData.rating || "4.5"}</span>
              </div>
              <h3 className="preview-title">{formData.name || "Sample Product Title"}</h3>
              <p className="preview-sku">SKU: {formData.sku || "AUTO-GENERATED"}</p>
              <div className="preview-pricing">
                <span className="preview-price">
                  {currency} {formData.price ? Number(formData.price).toLocaleString() : "0"}
                </span>
                <span className={Number(formData.stock) > 0 ? "badge-in" : "badge-out"}>
                  {Number(formData.stock) > 0 ? `${formData.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <p className="preview-desc">
                {formData.description || "The item description will appear here on the detailed product view."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
