import "../../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

function ExpenseHeader() {
  return (
    <div className="row align-items-center mb-3">
      <div className="col">
        <h1 className="fs-2 text-primary fw-bold">Expenses</h1>
        <p className="text-muted mb-0">
          Manage and track your spending easily.
        </p>
      </div>

      <div class="col-auto dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Dropdown
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" type="button">
              Action
            </button>
          </li>
          <li>
            <button class="dropdown-item" type="button">
              Another action
            </button>
          </li>
          <li>
            <button class="dropdown-item" type="button">
              Something else here
            </button>
          </li>
        </ul>
      </div>

      <div className="col-auto">
        <Link to={"/expenses/new"}>
          <button className="btn btn-outline-success px-4 py-2 shadow-sm">
            <i className="bi bi-plus-lg"></i> Create Expense
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ExpenseHeader;
