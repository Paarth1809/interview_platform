import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReports } from "../api/interviewApi";

const ReportsListPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // For now, if backend is not ready, we can mock data or try to fetch
        getReports()
            .then(setReports)
            .catch((err) => {
                console.error("Failed to load reports", err);
                // Fallback mock data for demo purposes if backend fails
                setReports([
                    { id: 1, date: "2023-10-01", topic: "Java Basics", score: 85 },
                    { id: 2, date: "2023-10-05", topic: "System Design", score: 72 },
                    { id: 3, date: "2023-10-10", topic: "Behavioral", score: 90 },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page-container"><p className="text-muted">Loading history...</p></div>;

    return (
        <div className="page-container">
            <div className="card mb-8">
                <h1 className="text-3xl font-bold mb-2">Your Reports</h1>
                <p className="text-muted">Review your past interview performance</p>
            </div>

            <div className="grid-cols-1 gap-4">
                {reports.length === 0 && <p className="text-muted">No reports found.</p>}
                {reports.map((r) => (
                    <Link to={`/report/${r.id}`} key={r.id} className="block">
                        <div className="card hover:border-indigo-500/50 transition-colors cursor-pointer flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{r.topic || "interview"}</h3>
                                <p className="text-muted text-sm">{r.date || "Unknown Date"}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-accent">{r.score != null ? r.score + "%" : "N/A"}</span>
                                <p className="text-xs text-muted uppercase tracking-wide">Score</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ReportsListPage;
