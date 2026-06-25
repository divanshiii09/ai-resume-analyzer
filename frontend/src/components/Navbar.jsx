import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
const navigate = useNavigate();

function handleLogout() {
localStorage.removeItem("token");
localStorage.removeItem("userName");


navigate("/");


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

    <Link to="/analysis">
      Analysis
    </Link>

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
