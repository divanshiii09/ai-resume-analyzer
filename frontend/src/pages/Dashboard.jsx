import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
const navigate = useNavigate();
const hasAnalyses = false;
const userName =
localStorage.getItem("userName") || "User";

useEffect(() => {
axios
.get("http://localhost:3000/api/test")
.then((res) => {
console.log(
"Backend Response:",
res.data
);
})
.catch((err) => {
console.log("Error:", err);
});
}, []);

return (
<> <Navbar />

  <div className="dashboard-container">

    <div className="header-section">

      <h2 className="dashboard-subtitle">
        AI-Powered Resume Analysis Platform
      </h2>

      <p className="welcome-text">
        Welcome back, {userName} 👋
      </p>

     <p className="description-text">
  Upload resumes, track ATS performance,
  and improve your chances of getting interviews.
</p>
<div className="quick-actions">
  <button
    className="upload-btn"
    onClick={() => navigate("/upload")}
  >
    Upload Resume
  </button>

  <button
    className="action-btn"
    onClick={() => navigate("/analysis")}
  >
    View Analysis
  </button>
</div>
    </div>

  <div className="stats-grid">

  <div className="stat-card">
    <h3>Total Analyses</h3>

    <p>
      {hasAnalyses ? "25" : "0"}
    </p>
  </div>

  <div className="stat-card">
    <h3>Average ATS Score</h3>

    <p>
      {hasAnalyses ? "82%" : "--"}
    </p>
  </div>

  <div className="stat-card">
    <h3>Resumes Uploaded</h3>

    <p>
      {hasAnalyses ? "12" : "0"}
    </p>
  </div>

</div>

<div className="recent-section">
  <h2>Recent Analyses</h2>

  {!hasAnalyses ? (
    <div className="empty-state">
      <h3>No analyses yet</h3>

      <p>
        Upload your first resume to get an ATS score
        and personalized feedback.
      </p>
    </div>
  ) : (
    <>
      <div className="resume-card">
        Software Engineer Resume.pdf - ATS Score: 85
      </div>

      <div className="resume-card">
        Frontend Resume.pdf - ATS Score: 78
      </div>

      <div className="resume-card">
        Data Analyst Resume.pdf - ATS Score: 88
      </div>
    </>
  )}
</div>
  </div>
</>


);
}

export default Dashboard;
