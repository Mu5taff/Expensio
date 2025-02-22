function SignInPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // if (e.target.id === "confirmPassword") {
    setError(
      formData.password !== e.target.value ? "Passwords do not match!" : ""
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match!");
    //   return;
    // }
    // alert("Account Created Successfully!");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg w-100" style={{ maxWidth: "450px" }}>
        <div className="card-header bg-dark text-white text-center py-3">
          <h3 className="mb-0">Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
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
                onChange={() => handleChange()}
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
              Don't have an account?{" "}
              <a href="#" className="text-success">
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
