import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="empty-state content-card" style={{ maxWidth: "600px", margin: "40px auto" }}>
      <p className="empty-icon" style={{ fontSize: "64px", margin: 0 }}>🧭</p>
      <h1 style={{ fontSize: "64px", margin: "12px 0 0 0", color: "var(--danger)" }}>404</h1>
      <h2 style={{ fontSize: "22px", margin: "6px 0 12px 0" }}>Destination Route Not Found</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px", lineHeight: "1.6" }}>
        The page URL you navigated to does not exist in the routing table, may have been moved, or has an outdated link.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/dashboard" className="btn btn-primary">
          ← Return to Dashboard
        </Link>
        <Link to="/products" className="btn btn-secondary">
          Browse Products
        </Link>
      </div>
    </main>
  );
}