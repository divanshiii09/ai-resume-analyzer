import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

async function handleRegister() {
if (name === "") {
setError("Please enter your name");
return;
}

if (email === "") {
setError("Please enter your email");
return;
}

if (!isValidEmail(email)) {
setError("Please enter a valid email address");
return;
}

if (password === "") {
setError("Please enter password");
return;
}

if (confirmPassword === "") {
setError("Please confirm password");
return;
}

if (password !== confirmPassword) {
setError("Passwords do not match");
return;
}

try {
setError("");

const response = await axios.post(
  "http://localhost:3000/api/register",
  {
    name,
    email,
    password,
  }
);

console.log(response.data);

alert("Registration Successful");

navigate("/");

} catch (err) {
  console.log("REGISTER ERROR:", err);

  console.log(
    "SERVER RESPONSE:",
    err.response?.data
  );

  setError(
    err.response?.data?.message ||
    "Registration failed"
  );
}
}


  function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">ResumeAI</h1>

        <p className="subtitle">Create your account</p>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <input
          className="input-field"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input-field"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-container">
          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="show-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="password-container">
          <input
            className="input-field"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="show-btn"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="login-btn" onClick={handleRegister}>
          Create Account
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;