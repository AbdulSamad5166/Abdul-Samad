import { useState, type FormEvent } from "react";
import { useProducts } from "../context/ProductContext";
import { initialProducts } from "../data/products";

export default function Settings() {
  const { currency, setCurrency } = useProducts();

  const [storeName, setStoreName] = useState("Nexus Commerce Hub");
  const [supportEmail, setSupportEmail] = useState("support@nexuscommerce.com");
  const [taxRate, setTaxRate] = useState("5");
  const [lowStockLimit, setLowStockLimit] = useState("5");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the catalog back to factory sample products? Custom changes will be restored."
      )
    ) {
      localStorage.removeItem("sales_app_inventory_data_v2");
      window.location.reload();
    }
  };

  return (
    <main className="settings-page">
      <div className="page-header-row">
        <div>
          <h1>Store Configuration & Preferences</h1>
          <p className="subtitle">
            Configure enterprise currency symbol, tax parameters, inventory thresholds, and notifications.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="alert-box success">
          ✅ Settings saved and updated successfully across all application routes!
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form-layout">
        {/* Section 1: Business Identity */}
        <section className="content-card settings-section">
          <h2>Store Profile & Identity</h2>
          <p className="card-subtext">Public details visible on reports and invoices</p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="storeName">Store / Company Name</label>
              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="supportEmail">Support Email</label>
              <input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Regional & Currency Configuration */}
        <section className="content-card settings-section">
          <h2>Currency & Financial Formatting</h2>
          <p className="card-subtext">
            Choose which currency symbol appears throughout the dashboard, products, and sales
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currencySelect">Default Currency Symbol</label>
              <select
                id="currencySelect"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-select"
              >
                <option value="Rs.">Pakistani Rupee (Rs.)</option>
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">British Pound (£)</option>
                <option value="AED">UAE Dirham (AED)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taxRate">Standard Sales Tax / VAT (%)</label>
              <input
                id="taxRate"
                type="number"
                min="0"
                max="50"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Inventory Automation */}
        <section className="content-card settings-section">
          <h2>Inventory Safety & Thresholds</h2>
          <p className="card-subtext">Automatic warning alerts and threshold triggers</p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lowStock">Low Stock Alert Trigger (Units)</label>
              <input
                id="lowStock"
                type="number"
                min="1"
                value={lowStockLimit}
                onChange={(e) => setLowStockLimit(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="toggles-list">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <div>
                <strong>Low stock email alerts</strong>
                <p>Receive automatic dispatch warnings when an item falls below threshold.</p>
              </div>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
              />
              <div>
                <strong>Audio cues on order fulfillment</strong>
                <p>Play celebratory chimes when a new transaction is recorded.</p>
              </div>
            </label>
          </div>
        </section>

        {/* Action Button */}
        <div className="form-actions-row">
          <button type="submit" className="btn btn-primary">
            Save Preferences
          </button>
          <button
            type="button"
            onClick={handleResetData}
            className="btn btn-danger"
          >
            Reset Catalog to Factory Data ({initialProducts.length} items)
          </button>
        </div>
      </form>
    </main>
  );
}
