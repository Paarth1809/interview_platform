import { useEffect, useState } from "react";
import api from "../api/axios";

const InterviewPage = () => {
  const [q, setQ] = useState(null);
  const [ans, setAns] = useState("");

  useEffect(() => {
    api
      .get("/interview/next", {
        params: { session_id: localStorage.getItem("sessionId") },
      })
      .then((res) => setQ(res.data));
  }, []);

  const submit = async () => {
    await api.post("/interview/answer", {
      session_id: localStorage.getItem("sessionId"),
      answer: ans,
    });

    if (q.is_last) {
      window.location.href = `/report/${localStorage.getItem("sessionId")}`;
    } else {
      window.location.reload();
    }
  };

  if (!q) return "Loading...";

  return (
    <div className="p-6">
      <h1 className="font-bold mb-4">{q.question}</h1>

      <textarea
        className="border p-2 w-full"
        rows={6}
        onChange={(e) => setAns(e.target.value)}
      />

      <button className="bg-blue-600 text-white p-2 mt-3" onClick={submit}>
        Submit
      </button>
    </div>
  );
};

export default InterviewPage;
