import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const ReportPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/interview/report/${id}`).then((r) => setData(r.data));
  }, []);

  if (!data) return "Loading...";

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4">
        Overall Score: {data.total_score}
      </h2>

      {data.questions.map((q, i) => (
        <div key={i} className="mt-4 border p-4">
          <p className="font-semibold">{q.question}</p>
          <p className="text-sm text-gray-600">Your Answer: {q.answer}</p>
          <p className="text-sm text-green-700">Feedback: {q.feedback}</p>
          <p className="font-bold">Score: {q.score}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportPage;
