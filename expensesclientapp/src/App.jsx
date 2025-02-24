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
import SignInPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import HomePage from "./Pages/HomePage.jsx";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/expenses" element={<ExpenseListPage />} />
            <Route path="/expenses/new" element={<ExpenseForm />} />
            <Route path="/expenses/edit/:id" element={<EditExpenseForm />} />
            <Route path="/expenses/view/:id" element={<ViewExpense />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  // Define pages where Navbar should NOT appear
  const hiddenRoutes = ["/login", "/register"];

  return !hiddenRoutes.includes(location.pathname) ? <NavBar /> : null;
}

const PrivateRoute = () => {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default App;
