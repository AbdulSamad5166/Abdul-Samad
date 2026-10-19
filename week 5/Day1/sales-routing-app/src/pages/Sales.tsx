import { useState } from "react";
import { useProducts } from "../context/ProductContext";

interface SaleRecord {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Shipped";
}

const initialSales: SaleRecord[] = [
  {
    id: "ORD-9021",
    customer: "Zubair Hashmi",
    product: "Mechanical Gaming Keyboard",
    quantity: 2,
    amount: 13000,
    date: "2026-10-18",
    status: "Completed",
  },
  {
    id: "ORD-9022",
    customer: "Ayesha Malik",
    product: "Ergonomic Executive Office Chair",
    quantity: 1,
    amount: 18000,
    date: "2026-10-18",
    status: "Completed",
  },
  {
    id: "ORD-9023",
    customer: "Fatima Noor",
    product: "Wireless Ergonomic Mouse",
    quantity: 3,
    amount: 7500,
    date: "2026-10-17",
    status: "Shipped",
  },
  {
    id: "ORD-9024",
    customer: "Hamza Tariq",
    product: "Active Noise-Cancelling Headphones",
    quantity: 1,
    amount: 12500,
    date: "2026-10-16",
    status: "Pending",
  },
  {
    id: "ORD-9025",
    customer: "Mariam Bilal",
    product: "Smart Health & Fitness Tracker",
    quantity: 1,
    amount: 4800,
    date: "2026-10-15",
    status: "Completed",
  },
];

export default function Sales() {
  const { products, updateStock, currency } = useProducts();
  const [sales, setSales] = useState<SaleRecord[]>(initialSales);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showRecordModal, setShowRecordModal] = useState(false);

  const [newOrder, setNewOrder] = useState({
    customer: "",
    productId: products[0]?.id?.toString() || "",
    quantity: "1",
    status: "Completed" as SaleRecord["status"],
  });

  const totalGrossRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const completedCount = sales.filter((s) => s.status === "Completed").length;
  const pendingCount = sales.filter((s) => s.status === "Pending").length;
  const avgOrderValue =
    sales.length > 0 ? Math.round(totalGrossRevenue / sales.length) : 0;

  const filteredSales = sales.filter(
    (s) => statusFilter === "All" || s.status === statusFilter
  );

  const handleRecordOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer.trim()) return;

    const selectedProduct = products.find(
      (p) => p.id === Number(newOrder.productId)
    );
    if (!selectedProduct) return;

    const qty = Math.max(1, Number(newOrder.quantity) || 1);
    const amount = selectedProduct.price * qty;

    const createdRecord: SaleRecord = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newOrder.customer.trim(),
      product: selectedProduct.name,
      quantity: qty,
      amount,
      date: new Date().toISOString().split("T")[0],
      status: newOrder.status,
    };

    // Deduct stock from inventory
    updateStock(selectedProduct.id, -qty);

    setSales([createdRecord, ...sales]);
    setShowRecordModal(false);
    setNewOrder({
      customer: "",
      productId: products[0]?.id?.toString() || "",
      quantity: "1",
      status: "Completed",
    });
  };

  return (
    <main className="sales-page">
      <div className="page-header-row">
        <div>
          <h1>Sales Ledger & Order Fulfillments</h1>
          <p className="subtitle">
            Monitor client orders, transaction volumes, and live dispatch statuses.
          </p>
        </div>
        <button
          onClick={() => setShowRecordModal(true)}
          className="btn btn-primary"
        >
          + Record New Order
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="dashboard-grid">
        <div className="content-card kpi-card">
          <span className="kpi-title">Gross Revenue</span>
          <p className="card-value">
            {currency} {totalGrossRevenue.toLocaleString()}
          </p>
          <span className="card-subtext">{sales.length} fulfilled client orders</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Completed Orders</span>
          <p className="card-value">{completedCount}</p>
          <span className="card-subtext">Delivered & verified accounts</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Pending / In-Transit</span>
          <p className="card-value">{pendingCount}</p>
          <span className="card-subtext">Awaiting payment verification</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Average Order Value</span>
          <p className="card-value">
            {currency} {avgOrderValue.toLocaleString()}
          </p>
          <span className="card-subtext">Per order transaction average</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="category-pills" style={{ marginTop: "24px" }}>
        {["All", "Completed", "Shipped", "Pending"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`category-pill-btn ${statusFilter === status ? "active" : ""}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="content-card" style={{ marginTop: "16px" }}>
        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Client Name</th>
                <th>Item Purchased</th>
                <th>Qty</th>
                <th>Total Value</th>
                <th>Order Date</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <strong>{sale.id}</strong>
                  </td>
                  <td>{sale.customer}</td>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}x</td>
                  <td>
                    <strong>
                      {currency} {sale.amount.toLocaleString()}
                    </strong>
                  </td>
                  <td>{sale.date}</td>
                  <td>
                    <span
                      className={
                        sale.status === "Completed"
                          ? "badge-in"
                          : sale.status === "Shipped"
                          ? "badge-vip"
                          : "badge-warning"
                      }
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Order Modal */}
      {showRecordModal && (
        <div className="modal-backdrop">
          <div className="modal-content content-card">
            <div className="modal-header">
              <h2>Record Customer Order</h2>
              <button
                onClick={() => setShowRecordModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRecordOrder} className="modal-form">
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Rehman"
                  value={newOrder.customer}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customer: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Select Product from Catalog *</label>
                <select
                  value={newOrder.productId}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, productId: e.target.value })
                  }
                  className="form-select"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {currency} {p.price.toLocaleString()} ({p.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newOrder.quantity}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, quantity: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Payment & Dispatch Status</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        status: e.target.value as SaleRecord["status"],
                      })
                    }
                    className="form-select"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Confirm & Deduct Stock
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}