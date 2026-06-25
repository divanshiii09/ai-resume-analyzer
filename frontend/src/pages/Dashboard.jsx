import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
const navigate = useNavigate();

const [resumes, setResumes] = useState([]);
const [highlightedResume, setHighlightedResume] =
useState(null);

const userName =
localStorage.getItem("userName") || "User";

const userEmail =
localStorage.getItem("userEmail");

useEffect(() => {
axios
.get(
`http://localhost:3000/api/resumes/${userEmail}`
)
.then((res) => {
setResumes(res.data);
})
.catch((err) => {
console.log(err);
});
}, [userEmail]);

const totalAnalyses = resumes.length;
const highestResume =
resumes.length > 0
? resumes.reduce((best, current) =>
current.atsScore > best.atsScore
? current
: best
)
: null;

const averageScore =
resumes.length > 0
? Math.round(
resumes.reduce(
(sum, resume) =>
sum + resume.atsScore,
0
) / resumes.length
)
: "--";

return (
<> <Navbar />
  
<div className="dashboard-container">
<div className="header-section">
      <h2 className="dashboard-subtitle">
        AI-Powered Resume Analysis
        Platform
      </h2>

      <p className="welcome-text">
        Welcome back, {userName} 👋
      </p>

      <p className="description-text">
        Upload resumes, track ATS
        performance, and improve your
        chances of getting interviews.
      </p>

      <div className="quick-actions">
        <button
          className="upload-btn"
          onClick={() =>
            navigate("/upload")
          }
        >
          Upload Resume
        </button>

        <button
          className="action-btn"
          onClick={() =>
            navigate("/analysis")
          }
        >
          View Analysis
        </button>
      </div>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Analyses</h3>

        <p>{totalAnalyses}</p>
      </div>

      <div className="stat-card">
        <h3>Average ATS Score</h3>

        <p>
          {averageScore === "--"
            ? "--"
            : `${averageScore}%`}
        </p>
      </div>

     <div
  className="stat-card clickable-card"
  onClick={() => {
    if (highestResume) {
      setHighlightedResume(
        highestResume._id
      );

  document
    .getElementById(
      highestResume._id
    )
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
}


}}

>

  <h3>Highest ATS Score</h3>

  <p>
    {highestResume
      ? `${highestResume.atsScore}%`
      : "--"}
  </p>
</div>

      
    </div>

    <div className="recent-section">
      <h2>Recent Analyses</h2>

      {resumes.length === 0 ? (
        <div className="empty-state">
          <h3>No analyses yet</h3>

          <p>
            Upload your first resume
            to get an ATS score and
            personalized feedback.
          </p>
        </div>
      ) : (
        resumes.map((resume) => (

<div
  id={resume._id}
  key={resume._id}
  className={`resume-card ${
    highlightedResume === resume._id
      ? "highlighted-card"
      : ""
  }`}
>
  <div className="resume-card-header">
    <div className="resume-left">
      <span className="resume-name">
        {resume.fileName}
      </span>

      {highlightedResume === resume._id && (
        <span className="best-badge">
          Recommended
        </span>
      )}
    </div>

    <span className="resume-score">
      ATS Score: {resume.atsScore}%
    </span>
  </div>
</div>
        ))
      )}
    </div>
  </div>
</>

);
}

export default Dashboard;
