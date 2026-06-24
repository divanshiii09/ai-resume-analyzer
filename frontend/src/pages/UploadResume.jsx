import "../styles/UploadResume.css";

function UploadResume() {
  return (
    <div className="upload-page">

      <div className="upload-card">

       <h1 className="upload-title">
  Upload Your Resume
</h1>

<p className="upload-description">
  Get instant ATS analysis, AI feedback,
  and personalized improvement suggestions.
</p>

        <div className="drop-zone">
<h3>Drag & Drop Your Resume</h3>
          <span>or</span>

          <button className="choose-btn">
            Choose File
          </button>

          <small>
            Supported: PDF, DOC, DOCX
          </small>
        </div>

      </div>

    </div>
  );
}

export default UploadResume;