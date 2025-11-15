import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const logged = localStorage.getItem("logged") === "true";
  return logged ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
