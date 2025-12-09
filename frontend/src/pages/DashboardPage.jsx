import { startInterview } from "../api/interviewApi";

const DashboardPage = () => {
  const start = async () => {
    try {
      // Default parameters for now
      const payload = { topic: "General", difficulty: "Medium", n: "3" };
      const data = await startInterview(payload);

      localStorage.setItem("sessionId", data.interviewId);
      localStorage.setItem("questions", JSON.stringify(data.questions));
      localStorage.setItem("currentQuestionIndex", "0");
      localStorage.setItem("answers", "[]");

      window.location.href = "/interview";
    } catch (err) {
      console.error("Failed to start interview", err);
      alert("Failed to start interview. Check backend connection.");
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-4">Welcome back, Candidate</h1>
      <p className="text-muted mb-8">Ready to master your next interview?</p>

      {/* Stats Grid */}
      <div className="grid-cols-3 mb-8">
        <div className="stat-card">
          <h3 className="text-muted mb-2">Interviews Completed</h3>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <h3 className="text-muted mb-2">Average Score</h3>
          <div className="stat-value">85%</div>
        </div>
        <div className="stat-card">
          <h3 className="text-muted mb-2">Skills Improved</h3>
          <div className="stat-value">5</div>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Start New Session</h2>
        <p className="text-muted mb-8">
          Practice with AI-driven mock interviews tailored to your job description.
          Get real-time feedback on your answers.
        </p>
        <button className="btn-primary" onClick={start}>
          Start New Interview
        </button>
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <h2 className="text-xl font-bold mt-8 mb-4">Recent Activity</h2>
      <div className="card">
        <p className="text-muted">No recent interviews found.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
