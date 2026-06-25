import { useState } from "react";
import "../styles/UploadResume.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function UploadResume() {
const [selectedFile, setSelectedFile] = useState(null);
const [error, setError] = useState("");

const navigate = useNavigate();

function handleFileChange(event) {
const file = event.target.files[0];


if (!file) return;

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

if (!allowedTypes.includes(file.type)) {
  setError(
    "Only PDF, DOC and DOCX files are allowed."
  );
  setSelectedFile(null);
  return;
}

setError("");
setSelectedFile(file);


}

return (
<> <Navbar />


  <div className="upload-page">
    <div className="upload-card">
      <h1 className="upload-title">
        Upload Your Resume
      </h1>

      <p className="upload-description">
        Get instant ATS analysis,
        AI feedback, and personalized
        improvement suggestions.
      </p>

      <div className="drop-zone">
        <h3>
          Drag & Drop Your Resume
        </h3>

        <span>or</span>

        <label className="choose-btn">
          Choose File

          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </label>

        <small>
          Supported: PDF, DOC, DOCX
        </small>

        {error && (
          <p className="upload-error">
            {error}
          </p>
        )}

        {selectedFile && (
          <div className="file-info">
            <h4>
              ✅ Resume Uploaded Successfully
            </h4>

            <p className="file-name">
              <strong>
                📄 File Name:
              </strong>{" "}
              {selectedFile.name}
            </p>

            <p>
              <strong>
                File Type:
              </strong>{" "}
              {selectedFile.type}
            </p>

            <p>
              <strong>
                File Size:
              </strong>{" "}
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {selectedFile && (
          <button
            className="analyze-btn"
            onClick={() =>
              navigate("/analysis")
            }
          >
            Analyze Resume
          </button>
        )}
      </div>
    </div>
  </div>
</>


);
}

export default UploadResume;
