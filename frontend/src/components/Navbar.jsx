import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";

function Navbar() {
const navigate = useNavigate();

function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("userName");
localStorage.removeItem("userEmail");


navigate("/");


}

async function handleAnalysis() {
try {
const email =
localStorage.getItem(
"userEmail"
);


  const response =
    await axios.get(
      `http://localhost:3000/api/resume/latest/${email}`
    );

  if (
    response.data &&
    response.data._id
  ) {
    navigate(
      `/analysis/${response.data._id}`
    );
  } else {
    navigate("/upload");
  }
} catch (error) {
  console.log(error);

  navigate("/upload");
}


}

return ( <nav className="navbar"> <h2 className="nav-logo">
ResumeAI </h2>


  <div className="nav-links">
    <Link to="/dashboard">
      Dashboard
    </Link>

    <Link to="/upload">
      Upload Resume
    </Link>

    <button
      className="nav-analysis"
      onClick={handleAnalysis}
    >
      Analysis
    </button>

    <button
      className="nav-logout"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</nav>


);
}

export default Navbar;
