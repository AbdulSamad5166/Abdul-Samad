import { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "VIP" | "Active" | "New";
  totalSpent: number;
  ordersCount: number;
  avatarUrl: string;
  phone: string;
}

const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Ayesha Malik",
    email: "ayesha.malik@techcorp.io",
    company: "TechCorp Global",
    status: "VIP",
    totalSpent: 48500,
    ordersCount: 8,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    phone: "+92 300 1234567",
  },
  {
    id: "CUST-002",
    name: "Zubair Hashmi",
    email: "zubair@apexlogistics.com",
    company: "Apex Logistics Ltd",
    status: "VIP",
    totalSpent: 82000,
    ordersCount: 14,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    phone: "+92 321 7654321",
  },
  {
    id: "CUST-003",
    name: "Fatima Noor",
    email: "fatima@creativestudios.pk",
    company: "Creative Studios",
    status: "Active",
    totalSpent: 24500,
    ordersCount: 4,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    phone: "+92 333 9876543",
  },
  {
    id: "CUST-004",
    name: "Hamza Tariq",
    email: "hamza.tariq@nexussolutions.net",
    company: "Nexus Solutions",
    status: "Active",
    totalSpent: 16800,
    ordersCount: 3,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    phone: "+92 345 5554321",
  },
  {
    id: "CUST-005",
    name: "Mariam Bilal",
    email: "mariam.b@freelance.org",
    company: "Independent Consultant",
    status: "New",
    totalSpent: 6500,
    ordersCount: 1,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    phone: "+92 312 8889900",
  },
];

export default function Customers() {
  const { currency } = useProducts();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCust, setNewCust] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    status: "Active" as Customer["status"],
  });

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchQuery =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [customers, search, statusFilter]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name.trim() || !newCust.email.trim()) return;

    const added: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newCust.name.trim(),
      email: newCust.email.trim(),
      company: newCust.company.trim() || "Private Client",
      phone: newCust.phone.trim() || "+92 300 0000000",
      status: newCust.status,
      totalSpent: 0,
      ordersCount: 0,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + customers.length}?auto=format&fit=crop&w=200&q=80`,
    };

    setCustomers([added, ...customers]);
    setNewCust({ name: "", email: "", company: "", phone: "", status: "Active" });
    setShowAddModal(false);
  };

  return (
    <main className="customers-page">
      <div className="page-header-row">
        <div>
          <h1>Customer Relationship Directory</h1>
          <p className="subtitle">
            Manage commercial client accounts, lifetime revenue contributions, and contact details.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          + Add New Customer
        </button>
      </div>

      {/* KPI Quick Overview */}
      <div className="dashboard-grid">
        <div className="content-card kpi-card">
          <span className="kpi-title">Total Active Accounts</span>
          <p className="card-value">{customers.length}</p>
          <span className="card-subtext">Verified enterprise & retail clients</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">VIP Key Accounts</span>
          <p className="card-value">
            {customers.filter((c) => c.status === "VIP").length}
          </p>
          <span className="card-subtext">Generating 68% of gross revenue</span>
        </div>

        <div className="content-card kpi-card">
          <span className="kpi-title">Cumulative Client Spend</span>
          <p className="card-value">
            {currency}{" "}
            {customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}
          </p>
          <span className="card-subtext">Total client account turnover</span>
        </div>
      </div>

      {/* Search and Filter */}
      <section className="catalog-toolbar content-card">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by customer name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-pills" style={{ margin: 0 }}>
          {["All", "VIP", "Active", "New"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`category-pill-btn ${statusFilter === st ? "active" : ""}`}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* Customer Cards Grid */}
      <div className="customers-grid">
        {filtered.map((c) => (
          <div key={c.id} className="content-card customer-card">
            <div className="customer-card-header">
              <img
                src={c.avatarUrl}
                alt={c.name}
                className="customer-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                }}
              />
              <div className="customer-info">
                <h3>{c.name}</h3>
                <span className="customer-company">{c.company}</span>
              </div>
              <span
                className={
                  c.status === "VIP"
                    ? "badge-vip"
                    : c.status === "Active"
                    ? "badge-in"
                    : "badge-new"
                }
              >
                {c.status}
              </span>
            </div>

            <div className="customer-details-body">
              <div className="customer-detail-row">
                <span>Email:</span>
                <a href={`mailto:${c.email}`} className="customer-link">
                  {c.email}
                </a>
              </div>
              <div className="customer-detail-row">
                <span>Phone:</span>
                <span>{c.phone}</span>
              </div>
              <div className="customer-detail-row">
                <span>Orders:</span>
                <strong>{c.ordersCount} completed</strong>
              </div>
              <div className="customer-detail-row">
                <span>Lifetime Value:</span>
                <strong className="customer-spent">
                  {currency} {c.totalSpent.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-content content-card">
            <div className="modal-header">
              <h2>Register New Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="modal-form">
              <div className="form-group">
                <label>Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Rehman"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Global Tech"
                    value={newCust.company}
                    onChange={(e) =>
                      setNewCust({ ...newCust, company: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Account Tier</label>
                <select
                  value={newCust.status}
                  onChange={(e) =>
                    setNewCust({
                      ...newCust,
                      status: e.target.value as Customer["status"],
                    })
                  }
                  className="form-select"
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
