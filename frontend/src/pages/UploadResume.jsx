import { useState } from "react";
import api from "../api/client";
import "../styles/UploadResume.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

function UploadResume() {
const [selectedFile, setSelectedFile] = useState(null);
const [error, setError] = useState("");
const [dragActive, setDragActive] = useState(false);
const [isUploading, setIsUploading] = useState(false);
const navigate = useNavigate();

function validateFile(file) {
// PDF only: the analyzer extracts text with pdf-parse, which cannot
// read DOC or DOCX.
if (file.type !== "application/pdf") {
  setError("Only PDF files are allowed.");

  setSelectedFile(null);

  return false;
}

// Vercel caps a serverless function request body at roughly 4.5 MB, and a
// larger file is rejected at the edge before the server can explain why.
// Catch it here so the user gets a clear message immediately.
if (file.size > MAX_FILE_BYTES) {
  setError("File is too large. Maximum size is 4 MB.");

  setSelectedFile(null);

  return false;
}

setError("");
setSelectedFile(file);

return true;


}

function handleFileChange(event) {
const file = event.target.files[0];


if (!file) return;

validateFile(file);


}

function handleDragOver(e) {
e.preventDefault();
setDragActive(true);
}

function handleDragLeave(e) {
e.preventDefault();
setDragActive(false);
}

function handleDrop(e) {
e.preventDefault();


setDragActive(false);

const file = e.dataTransfer.files[0];

if (!file) return;

validateFile(file);}

async function handleAnalyzeResume() {
  if (isUploading) return;

  try {
    setIsUploading(true);

    const formData = new FormData();

    // The server takes the owner from the verified token, so no userEmail
    // field is sent. Let the browser set Content-Type: it needs to add the
    // multipart boundary, which a hand-written header cannot supply.
    formData.append("resume", selectedFile);

    const response = await api.post("/api/resume", formData, {
      // Slightly above the function's maxDuration so the browser does not give
      // up before the server has had a chance to respond.
      timeout: 65000,
    });

    navigate(`/analysis/${response.data.resume._id}`);
  } catch (error) {
    console.log(error);

    // The server returns specific messages now (unreadable PDF, too large,
    // wrong type), so show those instead of a generic failure.
    setError(
      error.response?.data?.message ||
        "Failed to analyze resume. Please try again."
    );
  } finally {
    setIsUploading(false);
  }
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

      <div
        className={`drop-zone ${
          dragActive ? "drag-active" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          Supported: PDF (max 4 MB)
        </small>

        {error && (
          <p className="upload-error">
            {error}
          </p>
        )}

        {selectedFile && (
          <div className="file-info">
            <h4>
              📄 Resume Uploaded Successfully
            </h4>

            <p className="file-name">
              <strong>
                 File Name:
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
              {(selectedFile.size / 1024).toFixed(
                2
              )}{" "}
              KB
            </p>
          </div>
        )}

        {selectedFile && (
        <button
  className="analyze-btn"
  onClick={handleAnalyzeResume}
  disabled={isUploading}
>
  {isUploading ? (
    <>
      <span className="spinner"></span>
      Analyzing Resume...
    </>
  ) : (
    "Analyze Resume"
  )}
</button>
        )}
      </div>
    </div>
  </div>
</>


);
}

export default UploadResume;
