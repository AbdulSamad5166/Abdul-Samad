import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function Dashboard() {
  const { products, updateStock, currency } = useProducts();

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 8);
  const totalInventoryUnits = products.reduce((acc, curr) => acc + curr.stock, 0);
  const totalInventoryValue = products.reduce((acc, curr) => acc + curr.price * curr.stock, 0);

  // Static sample sales overview
  const totalSalesRevenue = 186400;
  const totalOrdersCount = 42;

  return (
    <main className="dashboard-page">
      {/* Hero Welcome Banner with Background treatment */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">Enterprise Sales & Inventory Hub</div>
          <h1 className="hero-title">Executive Commerce Dashboard</h1>
          <p className="hero-subtitle">
            Real-time multi-channel overview of catalog performance, inventory turnover, stock alerts, and customer transactions.
          </p>
          <div className="hero-actions">
            <Link to="/products/add" className="btn btn-primary">
              + Add New Item
            </Link>
            <Link to="/products" className="btn btn-hero-secondary">
              Explore Products ({totalProducts})
            </Link>
            <Link to="/sales" className="btn btn-hero-secondary">
              View Transactions
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <section className="dashboard-grid">
        <div className="content-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Catalog Products</span>
            <span className="kpi-icon">📦</span>
          </div>
          <p className="card-value">{totalProducts}</p>
          <div className="kpi-footer">
            <span className="text-success">{inStockProducts.length} active in stock</span>
            <span className="bullet-sep">•</span>
            <span className="text-danger">{outOfStockProducts.length} out of stock</span>
          </div>
        </div>

        <div className="content-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Inventory Value</span>
            <span className="kpi-icon">💎</span>
          </div>
          <p className="card-value">
            {currency} {totalInventoryValue.toLocaleString()}
          </p>
          <div className="kpi-footer">
            <span>{totalInventoryUnits} physical units in warehouse</span>
          </div>
        </div>

        <div className="content-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Monthly Gross Sales</span>
            <span className="kpi-icon">📈</span>
          </div>
          <p className="card-value">
            {currency} {totalSalesRevenue.toLocaleString()}
          </p>
          <div className="kpi-footer">
            <span className="text-success">↑ 18.4% growth</span>
            <span className="bullet-sep">•</span>
            <span>{totalOrdersCount} fulfilled orders</span>
          </div>
        </div>

        <div className="content-card kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Stock Health Index</span>
            <span className="kpi-icon">🛡️</span>
          </div>
          <p className="card-value">
            {totalProducts > 0
              ? `${Math.round((inStockProducts.length / totalProducts) * 100)}%`
              : "0%"}
          </p>
          <div className="kpi-footer">
            <span>{lowStockProducts.length} items on low stock threshold</span>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Urgent Restock Alerts & Quick Catalog Highlights */}
      <div className="dashboard-dual-section">
        {/* Left Column: Restock Action Center */}
        <section className="content-card restock-card">
          <div className="section-header-row">
            <div>
              <h2>Inventory Priority & Restock Alerts</h2>
              <p className="card-subtext">Items requiring immediate reordering or replenishment</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              Manage All
            </Link>
          </div>

          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="healthy-stock-notice">
              <span className="healthy-icon">✅</span>
              <div>
                <strong>All items are well stocked!</strong>
                <p>No immediate stock replenishment required right now.</p>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Current Stock</th>
                    <th>Quick Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {[...outOfStockProducts, ...lowStockProducts].map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="table-item-cell">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="table-item-thumb"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <div>
                            <strong>{item.name}</strong>
                            <div className="table-item-sku">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>
                        {item.stock === 0 ? (
                          <span className="badge-out">Depleted</span>
                        ) : (
                          <span className="badge-warning">Low ({item.stock})</span>
                        )}
                      </td>
                      <td>{item.stock} units</td>
                      <td>
                        <div className="stock-quick-btns">
                          <button
                            type="button"
                            onClick={() => updateStock(item.id, 5)}
                            className="btn btn-secondary btn-sm"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStock(item.id, 20)}
                            className="btn btn-primary btn-sm"
                            title="Add 20 units"
                          >
                            +20
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right Column: Featured Catalog Items */}
        <section className="content-card featured-catalog-card">
          <div className="section-header-row">
            <div>
              <h2>Catalog Highlights</h2>
              <p className="card-subtext">Featured inventory items with live price & stock</p>
            </div>
            <Link to="/products" className="view-all-link">
              View Catalog →
            </Link>
          </div>

          <div className="highlight-items-list">
            {products.slice(0, 4).map((item) => (
              <div key={item.id} className="highlight-item-row">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="highlight-item-thumb"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="highlight-item-info">
                  <h4 className="highlight-item-title">{item.name}</h4>
                  <div className="highlight-item-meta">
                    <span>{item.category}</span>
                    <span className="bullet-sep">•</span>
                    <span>
                      {currency} {item.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Link
                    to={`/products/${item.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}