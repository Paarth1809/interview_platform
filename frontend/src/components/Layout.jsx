import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Interview AI</h2>
        <nav>
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            Dashboard
          </Link>
          <Link to="/record" className={`nav-link ${isActive("/record")}`}>
            Record Interview
          </Link>
          <Link to="/report" className={`nav-link ${isActive("/report")}`}>
            Reports
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
