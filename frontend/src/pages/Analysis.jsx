import "../styles/Analysis.css";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Analysis() {
  const navigate = useNavigate();
  const { id } = useParams();
const [jobDescription, setJobDescription] = useState("");
const [jobResult, setJobResult] = useState(null);
const [loadingJD, setLoadingJD] = useState(false);
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
const analyzeJob = async () => {
  if (loadingJD) return;
  if (!jobDescription.trim()) {
    alert("Please paste a Job Description.");
    return;
  }

  try {
    setLoadingJD(true);

    const res = await axios.post(
      "http://localhost:3000/api/analyze-job",
      {
        resumeId: resume._id,
        jobDescription,
      }
    );

    setJobResult(res.data);

  } catch (err) {
    console.log(err);
    alert("Failed to analyze Job Description.");
  } finally {
    setLoadingJD(false);
  }
};
  if (!resume) {
    return (
      <>
     <Navbar />

        <div className="analysis-page">
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


<div className="resume-overview">

    <div className="resume-left">

        <h1>Resume Analysis</h1>

        <p className="resume-file">
            📄 {resume.fileName}
        </p>

        <p>
            Uploaded on{" "}
            {new Date(resume.createdAt).toLocaleDateString()}
        </p>

    </div>

    <div className="resume-right">

        <div className="status-badge">
            {status}
        </div>

        <label>Select Resume</label>

        <select
            className="resume-dropdown"
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

</div>


        

<div className="ats-card">

<div className="score-left">

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

<div className="score-right">

<div>

<h4>Skills</h4>

<p>{skills}%</p>

</div>

<div>

<h4>Formatting</h4>

<p>{formatting}%</p>

</div>

<div>

<h4>Keywords</h4>

<p>{keywords}%</p>

</div>

</div>

</div> 
{/* ================= JOB DESCRIPTION ANALYZER ================= */}

<div className="jd-card">

  <h2>Analyze Against a Job Description</h2>

  <p>
    Paste any job description to see how well your resume matches the role.
  </p>
<div className="textarea-wrapper">

 <div
  className="jd-editor"
  contentEditable
  suppressContentEditableWarning={true}
  spellCheck={false}
  data-placeholder="Paste the complete Job Description here..."
  onInput={(e) => setJobDescription(e.currentTarget.innerText)}
></div>
</div>
 <button
  className="analyze-jd-btn"
  onClick={analyzeJob}
  disabled={loadingJD}
>
  {loadingJD ? (
    <>
      <span className="spinner"></span>
      Analyzing...
    </>
  ) : (
    "Analyze Job Match"
  )}
</button>

</div>

{/* ================= RESULTS ================= */}

{jobResult && (

<div className="jd-result-card">

  <h2>
    Job Match Result
  </h2>

  <div className="jd-score">

    <h1>{jobResult.overallMatch}%</h1>

<span
className={`match-status ${
jobResult.overallMatch>=80
? "excellent"
: jobResult.overallMatch>=60
? "good"
: "poor"
}`}
>

{jobResult.recommendation}

</span>
  </div>

  <div className="jd-grid">

    <div className="jd-box">

<h3>Matched Skills</h3>
    <div className="chip-container">

{jobResult.matchingSkills.map((skill,index)=>(

<div
key={index}
className="skill-chip success"
>

{skill}

</div>

))}

</div>

    </div>

    <div className="jd-box">

<h3>Skills to Improve</h3>
     <div className="chip-container">

{jobResult.missingSkills.map((skill,index)=>(

<div
key={index}
className="skill-chip danger"
>

{skill}

</div>

))}

</div>

    </div>

  </div>

  <div className="jd-info">

<h3>Experience Analysis</h3>
<div className="experience-card">

<p>{jobResult.experienceGap}</p>

</div>

    <h3>Education Match</h3>

<div className="experience-card">

<p>{jobResult.educationComment}</p>

</div>
    <h3>Keyword Match</h3>

<div className="progress-bar">

<div

className="progress-fill"

style={{

width:`${jobResult.keywordMatch}%`

}}

></div>

</div>

<p
style={{
marginTop:"10px"
}}
>

{jobResult.keywordMatch}%

</p>
  </div>

  <div className="jd-section">

    <h3>Suggestions</h3>

{jobResult.suggestions?.length > 0 ? (
  jobResult.suggestions.map((item, index) => (
  <motion.div
    key={index}
    className="suggestion-card"
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{
      duration: 0.45,
      delay: index * 0.08,
      ease: "easeOut",
    }}
  >
      <div
        className="suggestion-number"
        style={{ background: "#16a34a" }}
      >
        ✓
      </div>

      <div className="suggestion-text">
        {item}
      </div>
    </motion.div>
  ))
) : (
<motion.div
  className="suggestion-card"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.45 }}
>    <div
      className="suggestion-number"
      style={{ background: "#16a34a" }}
    >
      ✓
    </div>

    <div className="suggestion-text">
      No suggestions available.
    </div>
  </motion.div>
)}

  </div>

</div>

)}
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

{resume.summary && (
  <div className="summary-card">
    <h2>Recruiter Summary</h2>
    <p>{resume.summary}</p>
  </div>
)}

<div className="suggestion-box">

  <h2>What Your Resume Does Well</h2>

  {resume.strengths?.length ? (
resume.strengths.map((item,index)=>(

<div
key={index}
className="suggestion-card"
>

<div
className="suggestion-number"
style={{
background:"#16a34a"
}}
>

✓

</div>

<div className="suggestion-text">

{item}

</div>

</div>

))
  ) : (
  <div className="suggestion-card">

<div
className="suggestion-number"
style={{
background:"#16a34a"
}}
>

✓

</div>

<div className="suggestion-text">

{item}

</div>

</div>
  )}

  <h2 style={{ marginTop: "35px" }}>
    Recommended Improvements
  </h2>

  {resume.suggestions?.length ? (
    resume.suggestions.map((item, index) => (
      <div
        key={index}
        className="suggestion-card"
      >
        <div className="suggestion-number">
          {index + 1}
        </div>

        <div className="suggestion-text">
          {item}
        </div>
      </div>
    ))
  ) : (
   <div className="suggestion-card">

<div className="suggestion-number">

—

</div>

<div className="suggestion-text">

No strengths available.

</div>

</div>
  )}

</div>

          <button
            className="secondary-btn"
            onClick={() => navigate("/upload")}
          >
Analyze Another Resume
          </button>

        </div>
      </div>
    </>
  );
} export default Analysis;