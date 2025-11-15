import api from "../api/axios";

const DashboardPage = () => {
  const start = async () => {
    const res = await api.post("/interview/start");
    localStorage.setItem("sessionId", res.data.session_id);
    window.location.href = "/interview";
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Dashboard</h1>

      <button
        className="bg-green-600 text-white p-3"
        onClick={start}
      >
        Start Interview
      </button>
    </div>
  );
};

export default DashboardPage;
