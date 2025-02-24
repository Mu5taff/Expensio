import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../../utilities/api";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAccessToken } = useAuth(); //  Use global auth state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); //  Clear errors on new submission

    try {
      await api.login(formData.email, formData.password, setAccessToken); //  Pass setAccessToken
      navigate("/expenses"); //  Redirect after successful login
    } catch (error) {
      setError(error.message); //  Show error message inline
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg w-100" style={{ maxWidth: "450px" }}>
        <div className="card-header bg-dark text-white text-center py-3">
          <h3 className="mb-0">Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/*  Show error messages inline */}
            {error && <p className="text-danger text-center">{error}</p>}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="container-md">
              <div className="row">
                <button type="submit" className="btn btn-success">
                  Login
                </button>
              </div>
            </div>

            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
