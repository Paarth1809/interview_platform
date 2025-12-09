import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import DashboardPage from "./pages/DashboardPage.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";
import ReportsListPage from "./pages/ReportsListPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Components
import RecordUpload from "./components/RecordUpload.jsx";
import Layout from "./components/Layout.jsx";


export default function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="record" element={<RecordUpload />} />
          <Route path="report" element={<ReportsListPage />} />
          <Route path="report/:id" element={<ReportPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </Router>
  );
}
