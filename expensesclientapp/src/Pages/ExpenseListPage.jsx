import { useState, useEffect } from "react";
import Table from "../components/ui/Table.jsx";
import api from "../../utilities/api.js";
import { Link } from "react-router-dom";

function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("All");
  const [paidStatus, setPaidStatus] = useState(0);

  function ExpenseHeader() {
    return (
      <div className="row align-items-center mb-3">
        <div className="col">
          <h1 className="fs-2 text-primary fw-bold">Expenses</h1>
          <p className="text-muted mb-0">
            Manage and track your spending easily.
          </p>
        </div>

        <div className="col-auto dropdown ">
          <button
            className="btn btn-secondary dropdown-toggle px-4 py-2 shadow-sm"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {`View: ${view}`}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setView("All")}
              >
                All
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setView("Unpaid")}
              >
                Unpaid
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setView("Paid")}
              >
                Paid
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

  return (
    <div className="container-xl">
      <ExpenseHeader />
      <Table
        expenses={expenses}
        setExpenses={setExpenses}
        paidStatus={paidStatus}
        setPaidStatus={setPaidStatus}
        view={view.toLowerCase() || ""}
      />
    </div>
  );
}

export default ExpenseListPage;
