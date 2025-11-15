import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/AdminPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
