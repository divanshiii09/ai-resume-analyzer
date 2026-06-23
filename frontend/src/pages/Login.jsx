import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {

  if (email === "") {
    setError("Please enter email");
    return;
  }

  if (password === "") {
    setError("Please enter password");
    return;
  }

  setError("");

  console.log(email);
  console.log(password);

  alert("Login Successful");
}

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="logo">ResumeAI</h1>

        <p className="subtitle">Sign in to continue</p>

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
{error && <p>{error}</p>}
        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
  Don't have an account?{" "}
  <Link to="/register">
    Register
  </Link>
</p>
      </div>
    </div>
  );
}

export default Login;
