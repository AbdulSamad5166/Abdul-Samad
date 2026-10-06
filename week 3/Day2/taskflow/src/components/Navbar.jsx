import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">T</div>
        <h1 className="navbar-title">TaskFlow</h1>
      </div>
      <p className="navbar-subtitle">Project & Task Management Dashboard</p>
    </nav>
  );
}

export default Navbar;