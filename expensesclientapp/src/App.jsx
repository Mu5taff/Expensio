import { useState } from "react";
import "./index.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/ui/NavBar.jsx";
import ExpenseListPage from "./Pages//ExpenseListPage.jsx";
import ExpenseForm from "./Pages/CreateExpenseForm.jsx";
import EditExpenseForm from "./Pages/EditExpenseForm.jsx";
import ViewExpense from "./Pages/ViewExpense.jsx";
import SignInPage from "./Pages/SignInPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import HomePage from "./Pages/HomePage.jsx";

function App() {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpenseListPage />} />
        <Route path="/expenses/new" element={<ExpenseForm />} />
        <Route path="/expenses/edit/:id" element={<EditExpenseForm />} />
        <Route path="/expenses/view/:id" element={<ViewExpense />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  // Define pages where Navbar should NOT appear
  const hiddenRoutes = ["/signin", "/register"];

  return !hiddenRoutes.includes(location.pathname) ? <NavBar /> : null;
}

export default App;
