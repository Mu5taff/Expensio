import { useState } from "react";
import "../../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutBtn";

function NavBar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-5">
        <div className="container">
          <a className="navbar-brand fw-bold fs-3" href="#">
            Expensio
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* <!-- Navbar Links --> */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to={"/"} className="nav-link active">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/expenses"} className="nav-link active">
                  Expenses
                </Link>
              </li>
            </ul>

            <LogoutButton className="btn btn-danger ms-lg-3" />
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
