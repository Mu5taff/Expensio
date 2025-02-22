import ExpenseForm from "../components/ui/ExpenseForm";

function CreateExpenseForm() {
  const createFormData = {
    description: "",
    amount: "",
    type: "",
    dueDate: "",
    category: "",
    isPaid: false,
    isRecurring: false,
  };

  return <ExpenseForm data={createFormData} form={"new"} />;
}

export default CreateExpenseForm;
