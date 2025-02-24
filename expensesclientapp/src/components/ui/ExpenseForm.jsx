import { useState, useEffect } from "react";
import "../../index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../../utilities/api.js";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; //  Import useAuth

function ExpenseForm({ data, form }) {
  const [formData, setFormData] = useState(data || []);
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); //  New state for API errors

  const navigate = useNavigate();
  const { setAccessToken, accessToken } = useAuth(); //  Get setAccessToken from AuthContext

  useEffect(() => {
    setIsDisabled(form === "view");
  }, [form]);

  const formatFieldName = (camelCase) => {
    return camelCase
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(formData).forEach((element) => {
      if (typeof formData[element] === "boolean") return;
      if (element === "recurringEndDate" && !formData.isRecurring) return;
      if (formData[element] === "" || formData[element] <= 0) {
        newErrors[element] = `Please fill in the ${formatFieldName(element)}`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      if (form === "edit") {
        await api.updateExpense(formData, setAccessToken);
      } else if (form === "new") {
        await api.postExpense(formData, setAccessToken);
      }
      navigate("/expenses");
    } catch (error) {
      setErrorMessage(error.message); // Display API errors
    }
  };

  const handleChange = (e) => {
    let elementValue = e.target.value;

    if (e.target.type === "number") {
      if (/^\d*\.?\d{0,2}$/.test(elementValue)) {
        if (elementValue.includes(".")) {
          elementValue = parseFloat(elementValue).toString();
        }
      } else {
        return;
      }
    }

    setFormData({
      ...formData,
      [e.target.id]:
        e.target.type === "checkbox" ? e.target.checked : elementValue,
    });

    let newErrors = { ...errors };

    if (e.target.value.trim() !== "") {
      delete newErrors[e.target.id];
    } else {
      newErrors[e.target.id] = `Please fill in the ${formatFieldName(
        e.target.id
      )}`;
    }

    setErrors(newErrors);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white p-3">
          <h4 className="mb-0">Expense Form</h4>
        </div>
        <div className="card-body">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}{" "}
          {/* Display API errors */}
          <form id="expenseForm" onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                placeholder="Enter expense description"
                onChange={handleChange}
                value={formData.description}
                disabled={isDisabled}
                required
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                id="amount"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                onChange={handleChange}
                value={formData.amount}
                disabled={isDisabled}
                required
              />
              {errors.amount && (
                <div className="invalid-feedback">{errors.amount}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <select
                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                id="type"
                onChange={handleChange}
                value={formData.type}
                disabled={isDisabled}
                required
              >
                <option value="" disabled>
                  Select an expense type
                </option>
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="hagbad">Hagbad</option>
                <option value="debt">Debt</option>
                <option value="qaraan">Qaraan</option>
                <option value="other">Other</option>
              </select>
              {errors.type && (
                <div className="invalid-feedback">{errors.type}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                type="date"
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
                id="dueDate"
                onChange={handleChange}
                value={formData.dueDate}
                disabled={isDisabled}
                required
              />
              {errors.dueDate && (
                <div className="invalid-feedback">{errors.dueDate}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                id="category"
                onChange={handleChange}
                value={formData.category}
                disabled={isDisabled}
                required
              >
                <option value="" disabled>
                  Select an expense category
                </option>
                <option value="transfer">Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>

            <div className="d-flex mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                <label className="form-check-label" htmlFor="paid">
                  Paid
                </label>
              </div>

              <div className="form-check mx-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                <label className="form-check-label" htmlFor="recurring">
                  Recurring
                </label>
              </div>
            </div>

            <div
              className="mb-3"
              id="recurringEndDateContainer"
              hidden={!formData.isRecurring}
            >
              <label htmlFor="recurringEndDate" className="form-label">
                Recurring End Date
              </label>
              <input
                type="date"
                className={`form-control ${
                  errors.recurringEndDate ? "is-invalid" : ""
                }`}
                id="recurringEndDate"
                onChange={handleChange}
                value={!formData.isRecurring ? "" : formData.recurringEndDate}
                disabled={isDisabled}
              />
              {errors.recurringEndDate && (
                <div className="invalid-feedback">
                  {errors.recurringEndDate}
                </div>
              )}
            </div>

            {!isDisabled && (
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success mx-3">
                  Save Expense
                </button>
                <Link to={"/expenses"}>
                  <button className="btn btn-danger">Close</button>
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExpenseForm;
