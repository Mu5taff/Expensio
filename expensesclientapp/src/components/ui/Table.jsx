import { useState, useEffect } from "react";
import "../../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import api from "../../../utilities/api.js";
import Loader from "../ui/Loader.jsx";

function Table({ expenses, setExpenses, statusFilter, dateFilter }) {
  // States
  const [sortColumn, setSortColumn] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [loading, setLoading] = useState(false);

  // Logic Functions

  async function fetchExpensesList(statusFilter, dateFilter) {
    setLoading(true); // ✅ Start loading
    try {
      const data = await api.getAllExpenses({
        status: statusFilter,
        date: dateFilter,
      });
      setExpenses(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }

  useEffect(() => {
    fetchExpensesList(statusFilter, dateFilter);
  }, [statusFilter]);

  async function onToggle(id, status) {
    const newStatus = !status;
    const previousExpenses = expenses;
    setExpenses((prevExpenses) => {
      let updatedExpenses = prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, isPaid: newStatus } : expense
      );

      setExpenses(updatedExpenses);
    });

    try {
      await api.updateExpenseStatus(id, newStatus);
    } catch (err) {
      console.error({ Error: err.message });
      setExpenses(previousExpenses);
    }
  }

  async function handleDelete(id, expense) {
    const previousExpenses = expense;
    try {
      setExpenses((prevExpenses) => {
        const newExpenses = prevExpenses.filter((expense) => expense.id !== id);
        return newExpenses;
      });
      await api.deleteExpense(expense);
    } catch (error) {
      console.error({ Error: error.message });
      setExpenses(previousExpenses);
    }
  }

  function sortByColumn(column, expenses) {
    if (!expenses.length) return;

    // Determine sorting order
    let newIsAscending;
    if (sortColumn === column) {
      newIsAscending = !isAscending;
    } else {
      newIsAscending = true;
    }

    // Sort the expenses array
    let sortedExpenses = [...expenses]; // Create a copy to avoid mutation
    if (column === "dueDate") {
      // Sort by date (convert to Date object for proper sorting)
      sortedExpenses.sort((a, b) =>
        newIsAscending
          ? new Date(a.dueDate) - new Date(b.dueDate)
          : new Date(b.dueDate) - new Date(a.dueDate)
      );
    } else {
      // Sort by string or number
      sortedExpenses.sort((a, b) => {
        if (a[column] > b[column]) return newIsAscending ? 1 : -1;
        if (a[column] < b[column]) return newIsAscending ? -1 : 1;
        return 0;
      });
    }

    // Update state **after sorting is done**
    setExpenses(sortedExpenses);
    setSortColumn(column);
    setIsAscending(newIsAscending);
  }

  // Sub-Components

  function TableHeader() {
    return (
      <thead className="table-dark">
        <tr>
          <th></th>
          <td scope="col">
            <i
              className="bi bi-calendar "
              onClick={() => sortByColumn("dueDate", expenses)}
              style={{ cursor: "pointer" }}
            ></i>{" "}
            Due Date
          </td>
          <td scope="col">
            <i
              className="bi bi-person"
              onClick={() => sortByColumn("description", expenses)}
              style={{ cursor: "pointer" }}
            ></i>{" "}
            Description
          </td>
          <td scope="col">
            <i
              className="bi bi-cash"
              fill=""
              onClick={() => sortByColumn("amount", expenses)}
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
    );
  }

  function TableRow({ item, onToggle, handleDelete }) {
    return (
      <>
        <tr>
          <th scope="row">
            <OptionsIcon
              expense={item}
              id={item.id}
              handleDelete={handleDelete}
            />
          </th>
          <td scope="col">{item.dueDate}</td>
          <td scope="col">{item.description}</td>
          <td scope="col">{`£${item.amount}`}</td>
          <td scope="col-auto">
            <PaidToggle id={item.id} isPaid={item.isPaid} onToggle={onToggle} />
          </td>
          <td scope="col" className="text-center">
            <RecurringStatus id={item.id} isRecurring={item.isRecurring} />
          </td>
        </tr>
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
              to={`/expenses/view/${expense.id}`}
              className="dropdown-item"
              state={expense}
            >
              View
            </Link>
          </li>
          <li>
            <Link
              to={`/expenses/edit/${expense.id}`}
              className="dropdown-item"
              state={expense}
            >
              Edit
            </Link>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => handleDelete(id, expense)}
            >
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
        <label className="form-check-label" htmlFor={id}>
          {isPaid ? "Paid" : "Unpaid"}
        </label>
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

  return (
    <>
      <div className="card shadow-lg rounded-4 p-3 position-relative">
        {loading && (
          <Loader className="position-absolute top-50 start-50 translate-middle" />
        )}
        <div className={`table-responsive-md ${loading ? "opacity-50" : ""}`}>
          <table className="table table-hover table-striped">
            <TableHeader />
            <tbody>
              {expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  item={expense}
                  onToggle={onToggle}
                  handleDelete={handleDelete}
                />
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

export default Table;
