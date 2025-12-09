import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReport } from "../api/interviewApi";

const ReportPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getReport(id)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (!id) return <div className="page-container"><p className="text-muted">Select a report to view.</p></div>;
  if (loading) return <div className="page-container"><p className="text-muted">Loading report...</p></div>;
  if (!data) return <div className="page-container"><p className="text-muted">Report not found.</p></div>;

  return (
    <div className="page-container">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-2">Interview Report</h1>
        <div className="flex items-baseline gap-4">
          <span className="text-muted">Overall Score</span>
          <span className="text-3xl font-bold text-accent">{data.total_score}%</span>
        </div>
      </div>

      <div className="grid-cols-1 gap-6">
        {data.questions && data.questions.map((q, i) => (
          <div key={i} className="card">
            <h3 className="text-xl font-bold mb-3">Question {i + 1}</h3>
            <p className="mb-4 text-lg">{q.question}</p>

            <div className="mb-4 p-4 bg-black/20 rounded-lg border border-white/5">
              <p className="text-xs uppercase tracking-wide text-muted mb-1">Your Answer</p>
              <p className="text-gray-300">{q.answer}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wide text-muted mb-1">Feedback</p>
              <p className="text-green-400">{q.feedback}</p>
            </div>

            <div className="flex justify-end">
              <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Score: {q.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage;
