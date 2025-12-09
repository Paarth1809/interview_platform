import { useEffect, useState } from "react";
import { submitAnswers } from "../api/interviewApi";

const InterviewPage = () => {
  const [q, setQ] = useState(null);
  const [ans, setAns] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = () => {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const idx = parseInt(localStorage.getItem("currentQuestionIndex") || "0");

    if (questions.length > 0 && idx < questions.length) {
      setQ(questions[idx]);
      setAns("");
      setLoading(false);
    } else {
      // No questions or finished?
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!ans.trim()) return;

    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    let idx = parseInt(localStorage.getItem("currentQuestionIndex") || "0");
    const answers = JSON.parse(localStorage.getItem("answers") || "[]");

    // Add current answer
    answers.push({ questionId: q.id, responseText: ans });
    localStorage.setItem("answers", JSON.stringify(answers));

    // Next question or finish
    if (idx < questions.length - 1) {
      idx++;
      localStorage.setItem("currentQuestionIndex", idx.toString());
      loadQuestion();
    } else {
      // Finish
      setLoading(true);
      try {
        const sessionId = localStorage.getItem("sessionId");
        await submitAnswers(sessionId, answers);
        window.location.href = `/report/${sessionId}`;
      } catch (err) {
        console.error("Failed to submit answers", err);
        alert("Failed to submit. See console.");
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="page-container"><p className="text-muted">Loading...</p></div>;
  if (!q) return <div className="page-container"><p className="text-muted">No questions found.</p></div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="flex justify-between items-baseline mb-4">
          <h1 className="text-2xl font-bold">Interview Question</h1>
          <span className="text-muted text-sm">
            Question {parseInt(localStorage.getItem("currentQuestionIndex")) + 1} of {JSON.parse(localStorage.getItem("questions")).length}
          </span>
        </div>

        <p className="text-lg mb-6">{q.questionText}</p>

        <div className="mb-6">
          <textarea
            className="input-field"
            rows={10}
            placeholder="Type your answer here..."
            value={ans}
            onChange={(e) => setAns(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" onClick={submit}>
            {parseInt(localStorage.getItem("currentQuestionIndex")) === JSON.parse(localStorage.getItem("questions")).length - 1 ? "Finish Interview" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
