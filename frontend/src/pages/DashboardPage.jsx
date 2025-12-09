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
      <header className="mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #fff, #94a3b8)' }}>
          Welcome back, Candidate
        </h1>
        <p className="text-xl text-muted">Ready to master your next interview?</p>
      </header>

      <div className="grid-cols-3 mb-10 gap-6">
        <div className="stat-card group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-muted text-sm uppercase tracking-wider font-semibold">Total Sessions</h3>
          <div className="stat-value">24</div>
        </div>

        <div className="stat-card group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">+5%</span>
          </div>
          <h3 className="text-muted text-sm uppercase tracking-wider font-semibold">Average Score</h3>
          <div className="stat-value">78%</div>
        </div>

        <div className="stat-card group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">Level 4</span>
          </div>
          <h3 className="text-muted text-sm uppercase tracking-wider font-semibold">Streak</h3>
          <div className="stat-value">5 Days</div>
        </div>
      </div>

      <div className="card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl -mr-32 -mt-32 transition duration-700 group-hover:opacity-10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-white">Start New Interview</h2>
          <p className="text-muted mb-8 max-w-xl text-lg">
            Challenge yourself with AI-driven mock interviews tailored to your specific job role. Get instant, detailed feedback on your answers.
          </p>
          <button className="btn-primary" onClick={start}>
            <span className="mr-2">Start Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-12 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        Recent Activity
      </h2>
      <div className="card border-dashed border-gray-800 bg-transparent">
        <div className="text-center py-8">
          <p className="text-muted">No recent interviews found. Start your first session today!</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
