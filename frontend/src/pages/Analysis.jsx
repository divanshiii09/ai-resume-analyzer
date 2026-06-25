import "../styles/Analysis.css";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Analysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!resume) {
    return (
      <>
        {" "}
        <Navbar />
        <div className="analysis-page">
          <div className="analysis-card">
            <h2>Loading Analysis...</h2>
          </div>
        </div>
      </>
    );
  }

  const score = resume.atsScore;

  let status = "Needs Improvement";

  if (score >= 85) {
    status = "Excellent Match";
  } else if (score >= 70) {
    status = "Good Match";
  }

  return (
    <>
      {" "}
      <Navbar />
      <div className="analysis-page">
        <div className="analysis-card">
          <h1>Resume Analysis Report</h1>

          <p>File: {resume.fileName}</p>

          <div className="score-box">
            <h2>{score}%</h2>

            <p className="score-title">ATS Compatibility Score</p>

            <span className="score-status">{status}</span>

            <p className="score-note">
              Analysis generated for your uploaded resume.
            </p>
          </div>

        <div className="metrics-section">
            <div className="metric">
              <div className="metric-header">
                <span>Skills Match</span>
                <span>{Math.max(score - 5, 50)}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.max(score - 5, 50)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Formatting</span>
                <span>{Math.min(score + 5, 100)}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(score + 5, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Keywords</span>
                <span>{score}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${score}%`,
                  }}
                ></div>
              </div>
            </div>
        </div>

          <div className="suggestion-box">
            <h3>Suggestions</h3>

            <div className="suggestion-item">✅ Add more action verbs</div>

            <div className="suggestion-item">
              ✅ Include measurable achievements
            </div>

            <div className="suggestion-item">✅ Improve keyword matching</div>
          </div>

          <button className="secondary-btn" onClick={() => navigate("/upload")}>
            Upload Another Resume
          </button>
        </div>
      </div>
    </>
  );
}

export default Analysis;
