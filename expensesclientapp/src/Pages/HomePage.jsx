import { useState } from "react";
import Table from "../components/ui/Table.jsx";

function HomePage() {
  const [dueExpenses, setDueExpenses] = useState([]);
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);

  function HomeExpenseHeader({ Title, titleColor, paragraphText }) {
    return (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className={`fs-2 ${titleColor} fw-bold`}>{Title}</h1>
        <p className="text-muted mb-0">{paragraphText}</p>
      </div>
    );
  }

  return (
    <div className="container-xl">
      <div className="mb-5">
        <HomeExpenseHeader
          Title={"Outstanding Expenses"}
          titleColor={"text-danger"}
          paragraphText={"Please Clear out These Expenses ASAP"}
        />

        <Table
          expenses={dueExpenses}
          setExpenses={setDueExpenses}
          statusFilter={"paid"}
          dateFilter={"past"}
        />
      </div>

      <div className="">
        <HomeExpenseHeader
          Title={"Expenses This Month"}
          titleColor={"text-warning"}
          paragraphText={"Stay Ahead of Your Expenses!"}
        />

        <Table
          expenses={upcomingExpenses}
          setExpenses={setUpcomingExpenses}
          dateFilter={"upcoming"}
        />
      </div>
    </div>
  );
}

export default HomePage;
