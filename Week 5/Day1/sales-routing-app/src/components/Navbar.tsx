import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

export default function Navbar() {
  const { products } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <nav className="navbar">
        {/* Brand Logo & Title */}
        <Link to="/dashboard" className="brand-container" onClick={closeMobileMenu}>
          <div className="brand-logo-icon">📊</div>
          <div>
            <span className="brand-title">NexusSales</span>
            <span className="brand-badge">Pro</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink
            to="/dashboard"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/products"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Products{" "}
            <span className="nav-count-badge">{products.length}</span>
          </NavLink>

          <NavLink
            to="/products/add"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active highlight-nav" : "nav-link highlight-nav"
            }
          >
            + Add Item
          </NavLink>

          <NavLink
            to="/sales"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Sales
          </NavLink>

          <NavLink
            to="/analytics"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Analytics
          </NavLink>

          <NavLink
            to="/customers"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Customers
          </NavLink>

          <NavLink
            to="/settings"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Settings
          </NavLink>
        </div>

        {/* Right User Bar */}
        <div className="navbar-user-bar">
          <div className="user-profile">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Admin Profile"
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">Manager</span>
              <span className="user-role">Operations Lead</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}