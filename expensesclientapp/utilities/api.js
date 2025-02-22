const baseURL = "http://localhost:3000/api/expenses";

async function postExpense(formData) {
  try {
    formData.amount = Number(formData.amount);
    formData.recurringEndDate =
      formData.recurringEndDate === "" ? null : formData.recurringEndDate;

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Expense successfully created:", result);
    return result;
  } catch (err) {
    console.error("Error posting expense:", err.message);
    throw err;
  }
}

async function getAllExpenses(status) {
  const queryParam = status ? `?status=${status}` : "";
  try {
    const response = await fetch(`${baseURL}${queryParam}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    result.dueDate = console.log("Fetched expenses:", result);

    return result;
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    return []; //
  }
}

async function updateExpenseStatus(id, expenseStatus) {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPaid: expenseStatus }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (err) {
    console.error("Error updating expense status:", err.message);
    throw err;
  }
}

async function getExpenseByID(id) {
  try {
    const response = await fetch(`${baseURL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    result.dueDate = console.log("Raw API Response Before Returning:", result);
    return result;
  } catch (err) {
    console.error("Error fetching expenses:", err.message);
    return []; //
  }
}

async function updateExpense(formData) {
  try {
    formData.amount = Number(formData.amount); // ✅ Ensure `amount` is always a number

    const response = await fetch(`${baseURL}/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Expense successfully updated:", result);
    return result;
  } catch (err) {
    console.error("Error updating expense:", err.message);
    throw err;
  }
}

async function deleteExpense(formData) {
  try {
    const response = await fetch(`${baseURL}/${formData.id}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    console.log("Expense successfully deleted");
  } catch (err) {
    console.error("Error updating expense:", err.message);
    throw err;
  }
}

export default {
  postExpense,
  getAllExpenses,
  updateExpenseStatus,
  getExpenseByID,
  updateExpense,
  deleteExpense,
};
