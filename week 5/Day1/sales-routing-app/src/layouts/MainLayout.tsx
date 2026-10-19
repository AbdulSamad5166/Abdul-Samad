import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="page-container">
        <Outlet />
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>© 2026 NexusCommerce Systems. Multi-Page Enterprise Dashboard.</span>
          </div>
          <div className="footer-right">
            <span className="status-indicator">
              <span className="status-dot"></span> Live Local Storage Sync
            </span>
            <span className="footer-sep">•</span>
            <span>React Router v7</span>
          </div>
        </div>
      </footer>
    </div>
  );
}