import "../styles/Analysis.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Analysis() {
const navigate = useNavigate();

const hasAnalysis = false;

return (
<> <Navbar />


  <div className="analysis-page">
    <div className="analysis-card">

      {!hasAnalysis ? (
        <>
          <h1>No Analysis Available</h1>

          <p>
            You haven't analyzed any resume yet.
          </p>

          <div className="analysis-empty">
            <h3>Upload Your First Resume</h3>

            <p>
              Get an ATS score, AI-powered feedback,
              and personalized improvement suggestions.
            </p>

            <button
              className="secondary-btn"
              onClick={() => navigate("/upload")}
            >
              Upload Resume
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>Resume Analysis Report</h1>

          <p>
            AI-powered analysis of your uploaded
            resume.
          </p>

          <div className="score-box">
            <h2>82%</h2>

            <p className="score-title">
              ATS Compatibility Score
            </p>

            <span className="score-status">
              Excellent Match
            </span>

            <p className="score-note">
              Your resume is highly compatible
              with most ATS systems.
            </p>
          </div>

          <div className="metrics-section">

            <div className="metric">
              <div className="metric-header">
                <span>Skills Match</span>
                <span>80%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Formatting</span>
                <span>90%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <div className="metric-header">
                <span>Keywords</span>
                <span>70%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>

          </div>

          <div className="suggestion-box">
            <h3>Suggestions</h3>

            <div className="suggestion-item">
              ✅ Add more action verbs
            </div>

            <div className="suggestion-item">
              ✅ Include measurable achievements
            </div>

            <div className="suggestion-item">
              ✅ Improve keyword matching
            </div>
          </div>

          <button
            className="secondary-btn"
            onClick={() => navigate("/upload")}
          >
            Upload Another Resume
          </button>
        </>
      )}

    </div>
  </div>
</>


);
}

export default Analysis;
