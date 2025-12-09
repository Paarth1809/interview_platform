import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="app-shell">
      <header className="top-navbar">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /></svg>
          </div>
          <span className="brand-text">Interview AI</span>
        </div>

        {/* Navigation - Centered Pill */}
        <nav className="nav-menu">
          <Link to="/" className={`nav-link ${isActive("/")}`}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </Link>
          <Link to="/interview" className={`nav-link ${isActive("/interview")}`}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Practice
          </Link>
          <Link to="/record" className={`nav-link ${isActive("/record")}`}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            Record
          </Link>
          <Link to="/report" className={`nav-link ${isActive("/report")}`}>
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            History
          </Link>
        </nav>

        {/* User Profile */}
        <div className="user-profile">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-white">Candidate</span>
            <span className="text-xs text-muted">Free Plan</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary p-0.5 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-slate-900 border-2 border-transparent flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
