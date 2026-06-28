import "../styles/Analysis.css";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Analysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resume, setResume] = useState(null);
  const [allResumes, setAllResumes] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    axios
      .get(`http://localhost:3000/api/resumes/${email}`)
      .then((res) => {
        setAllResumes(res.data);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch(console.log);
  }, [id]);

  if (!resume) {
    return (
      <>
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
  const skills = resume.skillsMatch;
  const formatting = resume.formattingScore;
  const keywords = resume.keywordScore;
  const status = resume.status;

  return (
    <>
    <Navbar />

      <div className="analysis-page">
        <div className="analysis-card">

          <h1>Resume Analysis Report</h1>

          <div className="resume-selector">
            <label>Viewing Resume</label>

            <select
              value={resume._id}
              onChange={(e) =>
                navigate(`/analysis/${e.target.value}`)
              }
            >
              {allResumes.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="score-box">
            <h2>{score}%</h2>

            <p className="score-title">
              ATS Compatibility Score
            </p>

            <span className="score-status">
              {status}
            </span>

            <p className="score-note">
              AI-powered analysis of your uploaded resume.
            </p>
          </div>

          <div className="metrics-section">

            <div className="metric">
              <div className="metric-header">
                <span>Skills Match</span>
                <span>{skills}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${skills}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Formatting</span>
                <span>{formatting}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${formatting}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Keyword Match</span>
                <span>{keywords}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${keywords}%`,
                  }}
                ></div>
              </div>
            </div>

          </div>

          <div className="suggestion-box">

            <h3>✅ Strengths</h3>

            {resume.strengths?.length ? (
              resume.strengths.map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                >
                  ✅ {item}
                </div>
              ))
            ) : (
              <div className="suggestion-item">
                No strengths available.
              </div>
            )}

            <h3 style={{ marginTop: "30px" }}>
              ❌ Weaknesses
            </h3>

            {resume.weaknesses?.length ? (
              resume.weaknesses.map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                >
                  ❌ {item}
                </div>
              ))
            ) : (
              <div className="suggestion-item">
                No weaknesses available.
              </div>
            )}

            <h3 style={{ marginTop: "30px" }}>
              💡 Suggestions
            </h3>

            {resume.suggestions?.length ? (
              resume.suggestions.map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                >
                  💡 {item}
                </div>
              ))
            ) : (
              <div className="suggestion-item">
                No suggestions available.
              </div>
            )}

        </div>

          <button
            className="secondary-btn"
            onClick={() => navigate("/upload")}
          >
            Upload Another Resume
          </button>

        </div>
      </div>
    </>
  );
} export default Analysis;