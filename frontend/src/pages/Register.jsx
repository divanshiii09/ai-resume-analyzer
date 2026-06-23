import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  function handleRegister() {
    if (name === "") {
      setError("Please enter your name");
      return;
    }

    if (email === "") {
      setError("Please enter your email");
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

    setError("");

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    alert("Registration Successful");
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">ResumeAI</h1>

        <p className="subtitle">Create your account</p>

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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "10px",
            }}
          >
            {error}
          </p>
        )}
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
