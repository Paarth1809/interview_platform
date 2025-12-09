import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const logged = localStorage.getItem("logged") === "true";
  return logged ? <Outlet /> : <Navigate to="/login" replace />;
}
