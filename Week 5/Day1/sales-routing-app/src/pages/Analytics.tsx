import { useProducts } from "../context/ProductContext";

export default function Analytics() {
  const { products, currency } = useProducts();

  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // Calculate inventory distribution by category
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryStats = categories.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const catStock = items.reduce((acc, p) => acc + p.stock, 0);
    const catVal = items.reduce((acc, p) => acc + p.price * p.stock, 0);
    const percentage = totalValue > 0 ? Math.round((catVal / totalValue) * 100) : 0;
    return {
      category: cat,
      itemCount: items.length,
      stock: catStock,
      val: catVal,
      percentage,
    };
  });

  return (
    <main className="analytics-page">
      <div className="page-header-row">
        <div>
          <h1>Commerce Analytics & Intelligence</h1>
          <p className="subtitle">
            Deep dive into catalog valuation, inventory health, and category revenue share.
          </p>
        </div>
        <div className="time-badge">Last updated: Just now</div>
      </div>

      {/* Analytics KPI Row */}
      <div className="dashboard-grid">
        <div className="content-card kpi-card">
          <span className="kpi-title">Gross Inventory Capital</span>
          <p className="card-value">
            {currency} {totalValue.toLocaleString()}
          </p>
          <span className="card-subtext">Calculated across active catalog units</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Average Item Price</span>
          <p className="card-value">
            {currency}{" "}
            {products.length > 0
              ? Math.round(
                  products.reduce((acc, p) => acc + p.price, 0) / products.length
                ).toLocaleString()
              : 0}
          </p>
          <span className="card-subtext">Across {products.length} distinct listings</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Average Stock per SKU</span>
          <p className="card-value">
            {products.length > 0
              ? Math.round(
                  products.reduce((acc, p) => acc + p.stock, 0) / products.length
                )
              : 0}{" "}
            units
          </p>
          <span className="card-subtext">Warehouse safety buffer</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Catalog Satisfaction</span>
          <p className="card-value">
            {products.length > 0
              ? (
                  products.reduce((acc, p) => acc + (p.rating || 4.5), 0) /
                  products.length
                ).toFixed(1)
              : "5.0"}{" "}
            ★
          </p>
          <span className="card-subtext">Customer feedback rating score</span>
        </div>
      </div>

      {/* Category Distribution Charts */}
      <div className="dashboard-dual-section">
        <section className="content-card">
          <h2>Inventory Capital Distribution by Category</h2>
          <p className="card-subtext">
            Proportion of warehouse asset value assigned to each product category
          </p>

          <div className="category-bars-list">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="category-bar-item">
                <div className="category-bar-header">
                  <strong>{stat.category}</strong>
                  <span>
                    {currency} {stat.val.toLocaleString()} ({stat.percentage}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max(4, stat.percentage)}%`,
                    }}
                  />
                </div>
                <div className="category-bar-sub">
                  <span>{stat.itemCount} unique items</span>
                  <span>{stat.stock} units in stock</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="content-card">
          <h2>Quarterly Revenue Forecast</h2>
          <p className="card-subtext">Simulated performance vs. previous quarter target</p>

          <div className="chart-mockup">
            <div className="chart-bar-group">
              <div className="chart-bar-col">
                <div className="chart-bar-fill" style={{ height: "65%" }}>
                  <span className="chart-bar-label">65k</span>
                </div>
                <span className="chart-month">Jul</span>
              </div>
              <div className="chart-bar-col">
                <div className="chart-bar-fill" style={{ height: "78%" }}>
                  <span className="chart-bar-label">78k</span>
                </div>
                <span className="chart-month">Aug</span>
              </div>
              <div className="chart-bar-col">
                <div className="chart-bar-fill" style={{ height: "92%" }}>
                  <span className="chart-bar-label">92k</span>
                </div>
                <span className="chart-month">Sep</span>
              </div>
              <div className="chart-bar-col">
                <div
                  className="chart-bar-fill active"
                  style={{ height: "100%" }}
                >
                  <span className="chart-bar-label">142k</span>
                </div>
                <span className="chart-month">Oct (Current)</span>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot active" />
                <span>Current Velocity: +28.4% MoM</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" />
                <span>Target Realization: 94.2%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
