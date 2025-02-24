import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { logout } = useAuth(); //
  const navigate = useNavigate(); //

  const handleLogout = async () => {
    try {
      await logout(); //
      navigate("/login"); //
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <button className="btn btn-light mx-3" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;
