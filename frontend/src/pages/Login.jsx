import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [error, setError] = useState("");

const handleLogin = async () => {
try {
setError("");


  const response = await axios.post(
    "http://localhost:3000/api/login",
    {
      email,
      password,
    }
  );

  console.log(
    "Login Success:",
    response.data
  );

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "userName",
    response.data.user.name
  );

  navigate("/dashboard");
} catch (err) {
  console.log(err);

  setError(
    err.response?.data?.message ||
    "Login failed"
  );
}
};

return ( <div className="login-container"> <div className="login-card"> <h1 className="logo">
ResumeAI </h1>

    <p className="subtitle">
      Sign in to continue
    </p>

    <input
      className="input-field"
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />

    <div className="password-container">
      <input
        className="input-field"
        type={
          showPassword
            ? "text"
            : "password"
        }
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button
        type="button"
        className="show-btn"
        onClick={() =>
          setShowPassword(
            !showPassword
          )
        }
      >
        {showPassword ? (
          <FaEyeSlash />
        ) : (
          <FaEye />
        )}
      </button>
    </div>

    {error && (
      <p className="error-text">
        {error}
      </p>
    )}

    <button
      className="login-btn"
      onClick={handleLogin}
    >
      Sign In
    </button>

    <p
      style={{
        textAlign: "center",
        marginTop: "15px",
      }}
    >
      Don't have an account?{" "}
      <Link to="/register">
        Register
      </Link>
    </p>
  </div>
</div>);
}

export default Login;
