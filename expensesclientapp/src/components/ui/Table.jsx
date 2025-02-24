import { useState, useEffect } from "react";
import "../../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import api from "../../../utilities/api.js";
import Loader from "../ui/Loader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function Table({ expenses, setExpenses, statusFilter, dateFilter }) {
  // States
  const [sortColumn, setSortColumn] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setAccessToken, accessToken } = useAuth();

  // Logic Functions
  async function fetchExpensesList(statusFilter, dateFilter) {
    setLoading(true); //
    try {
      const data = await api.getAllExpenses(
        { status: statusFilter, date: dateFilter },
        setAccessToken
      );
      setExpenses(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setErrorMessage("Failed to load expenses. Please try again.");
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }

  useEffect(() => {
    fetchExpensesList(statusFilter, dateFilter);
  }, [statusFilter]);

  async function onToggle(id, status) {
    const newStatus = !status;
    const previousExpenses = [...expenses];

    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, isPaid: newStatus } : expense
      )
    );

    try {
      await api.updateExpenseStatus(id, newStatus, setAccessToken); //  Pass setAccessToken
    } catch (err) {
      console.error("Error updating status:", err);
      setExpenses(previousExpenses); //  Revert changes on failure
      setErrorMessage("Failed to update expense status.");
    }
  }

  async function handleDelete(id) {
    const previousExpenses = [...expenses]; //
    try {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      await api.deleteExpense(id, accessToken, setAccessToken); //
    } catch (error) {
      console.error("Error deleting expense:", error);
      setExpenses(previousExpenses); //
      setErrorMessage("Failed to delete expense.");
    }
  }

  function sortByColumn(column) {
    if (!expenses.length) return;

    let newIsAscending = sortColumn === column ? !isAscending : true;

    let sortedExpenses = [...expenses]; // Create a copy to avoid mutation
    sortedExpenses.sort((a, b) => {
      if (column === "dueDate") {
        return newIsAscending
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate);
      }
      return newIsAscending
        ? a[column] > b[column]
          ? 1
          : -1
        : a[column] < b[column]
        ? 1
        : -1;
    });

    setExpenses(sortedExpenses);
    setSortColumn(column);
    setIsAscending(newIsAscending);
  }

  return (
    <>
      <div className="card shadow-lg rounded-4 p-3 position-relative">
        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}{" "}
        {/* Show errors */}
        {/* Loader - Centered Over the Table */}
        {loading && (
          <div
            className="position-absolute top-50 start-50 translate-middle d-flex align-items-center"
            style={{ zIndex: 10 }}
          >
            <Loader />
            <p className="text-muted mt-2">Fetching expenses...</p>
          </div>
        )}
        <div
          className={`table-responsive-md ${loading ? "opacity-50" : ""}`}
          style={{ minHeight: "120px" }}
        >
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th></th>
                <td scope="col">
                  <i
                    className="bi bi-calendar"
                    onClick={() => sortByColumn("dueDate")}
                    style={{ cursor: "pointer" }}
                  ></i>{" "}
                  Due Date
                </td>
                <td scope="col">
                  <i
                    className="bi bi-person"
                    onClick={() => sortByColumn("description")}
                    style={{ cursor: "pointer" }}
                  ></i>{" "}
                  Description
                </td>
                <td scope="col">
                  <i
                    className="bi bi-cash"
                    onClick={() => sortByColumn("amount")}
                    style={{ cursor: "pointer" }}
                  ></i>{" "}
                  Amount
                </td>
                <td scope="col">
                  <i className="bi bi-bag-check"></i> Paid Status
                </td>
                <td scope="col" className="text-center px-6">
                  <i className="bi bi-arrow-repeat"></i> Recurring Status
                </td>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <th scope="row">
                      <OptionsIcon
                        expense={expense}
                        id={expense.id}
                        handleDelete={handleDelete}
                      />
                    </th>
                    <td>{expense.dueDate}</td>
                    <td>{expense.description}</td>
                    <td>{`£${expense.amount}`}</td>
                    <td>
                      <PaidToggle
                        id={expense.id}
                        isPaid={expense.isPaid}
                        onToggle={onToggle}
                      />
                    </td>
                    <td className="text-center">
                      <RecurringStatus isRecurring={expense.isRecurring} />
                    </td>
                  </tr>
                ))}
              {!expenses.length && !loading && (
                <tr className="text-center">
                  <td className="py-4" colSpan="6">
                    No Expenses Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function OptionsIcon({ expense, id, handleDelete }) {
  return (
    <div className="dropdown">
      <button
        className="btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      <ul className="dropdown-menu">
        <li>
          <Link
            to={`/expenses/view/${id}`}
            className="dropdown-item"
            state={expense}
          >
            View
          </Link>
        </li>
        <li>
          <Link
            to={`/expenses/edit/${id}`}
            className="dropdown-item"
            state={expense}
          >
            Edit
          </Link>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleDelete(id)}>
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}

function PaidToggle({ id, isPaid, onToggle }) {
  return (
    <div className="form-check form-switch">
      <input
        id={`toggle-${id}`}
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={isPaid}
        onChange={() => onToggle(id, isPaid)}
      />
      <label className="form-check-label">{isPaid ? "Paid" : "Unpaid"}</label>
    </div>
  );
}

function RecurringStatus({ isRecurring }) {
  return (
    <i
      className={
        isRecurring
          ? `bi bi-check-circle-fill text-success`
          : "bi bi-x-circle-fill text-danger"
      }
    ></i>
  );
}

export default Table;
