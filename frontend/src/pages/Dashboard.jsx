import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  FiBarChart2,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";

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
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this resume?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:3000/api/resume/${id}`
    );

    setResumes((prev) => {
  const updated = prev.filter(
    (resume) => resume._id !== id
  );

  if (updated.length === 0) {
    setHighlightedResume(null);
  }

  return updated;
});

    if (highlightedResume === id) {
      setHighlightedResume(null);
    }
  } catch (err) {
    console.log(err);
    alert("Failed to delete resume.");
  }
};


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
  onClick={() => {
    if (highestResume) {
      navigate(`/analysis/${highestResume._id}`);
    } else {
      alert("Please upload a resume first.");
    }
  }}
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
    key={resume._id}
className={`resume-card interactive-card ${      highlightedResume === resume._id
        ? "highlighted-card"
        : ""
    }`}
  >

  {/*   */}
<div
  className="resume-card-header clickable-header"
  onClick={() => navigate(`/analysis/${resume._id}`)}
>

  <div className="resume-left">
<div className="resume-title-row">

  <span className="resume-name">
    {resume.fileName}
  </span>
{highlightedResume === resume._id &&
 highestResume?._id === resume._id && (
  <span className="best-badge">
    ⭐ Best Match
  </span>
)}

  <span
    className={`status-pill ${
      resume.atsScore >= 85
        ? "status-excellent"
        : resume.atsScore >= 70
        ? "status-good"
        : "status-needs"
    }`}
  >
    {resume.status}
  </span>

</div>

<span className="resume-date">
  Uploaded on{" "}
  {new Date(resume.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )}
</span>
  

  </div>

  <div className="score-box">

    <div className="resume-score">
      {resume.atsScore}%
    </div>

    <p>ATS Score</p>

  </div>
</div>

<div className="resume-actions">

<button
className="resume-icon-btn"
onClick={(e)=>{
e.stopPropagation();

const fileUrl = `http://localhost:3000/${resume.filePath
  .replace(/\\/g, "/")
  .replace(/^\/+/, "")}`;

window.open(fileUrl, "_blank");
}}
>
<FiFileText />
<span>Resume</span>
</button>

<button
className="resume-icon-btn"
onClick={(e)=>{
e.stopPropagation();
navigate(`/analysis/${resume._id}`);
}}
>
<FiBarChart2 />
<span>Analysis</span>
</button>

<button
className="resume-icon-btn delete-btn"
onClick={(e)=>{
e.stopPropagation();
handleDelete(resume._id);
}}
>
<FiTrash2 />
<span>Delete</span>
</button>

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
