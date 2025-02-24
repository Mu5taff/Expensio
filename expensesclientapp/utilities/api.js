const coreBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Default to local dev

const baseURL = `${coreBase}/api`;
const baseExpenseURL = `${baseURL}/expenses`;

//Generic Fetch Wrapper with Automatic Token Refresh
async function fetchWithAuth(url, options = {}, setAccessToken, retry = true) {
  if (!options.headers) options.headers = {};

  //  Always fetch the latest token from localStorage
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    options.headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    console.warn(`🔴 No Access Token provided for ${url}`);
  }

  options.credentials = "include"; //  Ensure cookies (refresh token) are sent

  try {
    const response = await fetch(url, options);

    if ((response.status === 401 || response.status === 403) && retry) {
      console.warn("🔴 Access token expired. Attempting to refresh...");
      const refreshedToken = await refreshAccessToken(setAccessToken);
      if (refreshedToken) {
        return fetchWithAuth(url, options, setAccessToken, false); // Retry with new token
      } else {
        throw new Error("Unauthorized. Please log in again.");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    throw err;
  }
}

/**
 * 🔹 Refresh Access Token (Now Works With HTTP-Only Cookies)
 */
async function refreshAccessToken(setAccessToken) {
  try {
    const response = await fetch(`${baseURL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken); // ✅ Update localStorage
    setAccessToken(data.accessToken); // ✅ Update global state

    console.log("🟢 Access token refreshed!");
    return data.accessToken;
  } catch (error) {
    console.error("🔴 Refresh token failed:", error.message);
    localStorage.removeItem("accessToken"); // ✅ Remove expired token
    setAccessToken(null);
    return null;
  }
}

/**
 * 🔹 User Registration
 */
async function register(username, email, password, setAccessToken) {
  const response = await fetch(`${baseURL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include", // ✅ Ensure refresh token is set in cookies
  });

  const data = await response.json();
  if (response.ok) {
    setAccessToken(data.accessToken);
    return true;
  } else {
    throw new Error(data.message);
  }
}

/**
 * 🔹 User Login
 */
async function login(email, password, setAccessToken) {
  const response = await fetch(`${baseURL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // ✅ Ensures refresh token is stored in cookies
  });

  const data = await response.json();
  if (response.ok) {
    setAccessToken(data.accessToken);
    localStorage.setItem("accessToken", data.accessToken);

    return true;
  } else {
    throw new Error(data.message);
  }
}

/**
 * 🔹 Logout (Now Clears Refresh Token Properly)
 */
async function logout(setAccessToken) {
  await fetch(`${baseURL}/auth/logout`, {
    method: "POST",
    credentials: "include", // Clears HTTP-only refresh token
  });

  localStorage.removeItem("accessToken"); // ✅ Remove token from localStorage
}

/**
 * 🔹 Expense APIs (Requires Auth)
 */
async function postExpense(formData, setAccessToken) {
  formData.amount = Number(formData.amount);
  formData.recurringEndDate =
    formData.recurringEndDate === "" ? null : formData.recurringEndDate;

  return fetchWithAuth(
    baseExpenseURL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    },
    setAccessToken
  );
}

async function getAllExpenses({ status, date }, setAccessToken) {
  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  if (date) queryParams.append("date", date);

  const url = queryParams.toString()
    ? `${baseExpenseURL}?${queryParams}`
    : baseExpenseURL;
  return fetchWithAuth(url, { method: "GET" }, setAccessToken);
}

async function updateExpenseStatus(id, expenseStatus, setAccessToken) {
  return fetchWithAuth(
    `${baseExpenseURL}/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPaid: expenseStatus }),
    },
    setAccessToken
  );
}

async function updateExpense(formData, setAccessToken) {
  formData.amount = Number(formData.amount);

  return fetchWithAuth(
    `${baseExpenseURL}/${formData.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    },
    setAccessToken
  );
}

async function deleteExpense(id, accessToken, setAccessToken) {
  return fetchWithAuth(
    `${baseExpenseURL}/${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
    accessToken, // ✅ Pass `accessToken`
    setAccessToken
  );
}

export default {
  postExpense,
  getAllExpenses,
  updateExpenseStatus,
  updateExpense,
  deleteExpense,
  login,
  register,
  logout,
};
