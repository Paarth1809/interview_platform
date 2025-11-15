import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminPage = () => {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.get("/admin/questions").then((r) => setList(r.data));
  }, []);

  const add = async () => {
    await api.post("/admin/questions", { question: text });
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <input
        className="border p-2 w-full"
        placeholder="New question"
        onChange={(e) => setText(e.target.value)}
      />

      <button className="bg-purple-600 text-white p-2 mt-3" onClick={add}>
        Add Question
      </button>

      <div className="mt-6">
        {list.map((q, i) => (
          <div key={i} className="border-b p-2">
            {q.question}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
