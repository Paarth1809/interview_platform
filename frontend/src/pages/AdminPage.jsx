import { useEffect, useState } from "react";
import { addQuestion, getQuestions } from "../api/interviewApi";

const AdminPage = () => {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    getQuestions().then(setList).catch(err => console.error(err));
  };

  const add = async () => {
    if (!text.trim()) return;
    try {
      await addQuestion(text);
      setText("");
      load();
    } catch (err) {
      console.error("Failed to add question", err);
    }
  };

  return (
    <div className="page-container">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        <div className="flex gap-4">
          <input
            className="input-field"
            placeholder="Enter a new interview question..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn-primary" onClick={add} style={{ whiteSpace: 'nowrap' }}>
            Add Question
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Question Bank</h2>
        <div className="flex flex-col gap-2">
          {(!list || list.length === 0) && <p className="text-muted">No questions added yet.</p>}
          {list && list.map((q, i) => (
            <div key={i} className="p-4 bg-black/20 rounded border border-white/5 hover:border-indigo-500/30 transition-colors">
              <span className="text-muted mr-4">#{i + 1}</span>
              {q.questionText || q.question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
