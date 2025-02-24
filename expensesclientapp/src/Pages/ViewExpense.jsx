import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ExpenseForm from "../components/ui/ExpenseForm";

function ViewExpense() {
  const location = useLocation();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    if (!location.state) return;

    async function fetchExpense() {
      try {
        const data = await location.state;
        console.log(data);
        setExpense(data);
      } catch (error) {
        console.error("Error fetching expense:", error);
      }
    }

    fetchExpense();
  }, [location.state]);

  if (!expense) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <ExpenseForm data={expense} form={"view"} />;
}

export default ViewExpense;
