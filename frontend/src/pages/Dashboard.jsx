import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
const navigate = useNavigate();
const userName =
localStorage.getItem("userName") || "User";

useEffect(() => {
  axios
    .get("http://localhost:3000/api/test")
    .then((res) => {
      console.log("Backend Response:", res.data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
}, []);

function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("userName");


navigate("/");

}

return ( <div className="dashboard-container"> <div className="header-section">

    <div className="header-top">
      <h1 className="dashboard-title">
        ResumeAI
      </h1>

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>

    <h2 className="dashboard-subtitle">
      AI-Powered Resume Analysis Platform
    </h2>

    <p className="welcome-text">
      Welcome back, {userName} 👋
    </p>

    <p className="description-text">
      Track your resume performance and improve
      your ATS score.
    </p>

  </div>

  <div className="stats-grid">
    <div className="stat-card">
      <h3>Total Analyses</h3>
      <p>25</p>
    </div>

    <div className="stat-card">
      <h3>Average ATS Score</h3>
      <p>82</p>
    </div>

    <div className="stat-card">
      <h3>Resumes Uploaded</h3>
      <p>12</p>
    </div>
  </div>

  <div className="upload-section">
    <button
      className="upload-btn"
      onClick={() => navigate("/upload")}
    >
      Upload Resume
    </button>
  </div>

  <div className="recent-section">
    <h2>Recent Analyses</h2>

    <div className="resume-card">
      Software Engineer Resume.pdf - ATS Score: 85
    </div>

    <div className="resume-card">
      Frontend Resume.pdf - ATS Score: 78
    </div>

    <div className="resume-card">
      Data Analyst Resume.pdf - ATS Score: 88
    </div>
  </div>
</div>

);
}

export default Dashboard;
