import ExpenseService from "../services/expense.service.js";
class ExpenseController {
  // GET Controllers
  async displayAllExpenses(req, res) {
    try {
      const status = req.query.status;
      const date = req.query.date;
      const allExpenses = await ExpenseService.displayAllExpense(status, date);

      res.status(200).json(allExpenses);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
  async viewExpense(req, res) {
    try {
      const expense = await ExpenseService.viewExpense(req.params.id);
      console.log("✅ Controller Layer - Response before sending:", expense); // 🔍 Debugging
      res.status(200).json(expense);
    } catch (err) {
      if (err.name === "NotFoundError") {
        return res.status(404).send({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.msg });
    }
  }

  // POST Controllers
  async createExpense(req, res) {
    try {
      const newExpense = await ExpenseService.createExpense(req.body);
      res
        .status(201)
        .json({ message: "Expense created Successfully", expense: newExpense });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res
        .status(400)
        .json({ message: "Error creating expense", error: error.message });
    }
  }
  // PUT Controllers
  async editExpense(req, res) {
    try {
      const editedExpense = await ExpenseService.editExpense(
        req.params.id,
        req.body
      );
      res.status(200).json({
        message: "Expense edited successfully",
        expense: editedExpense,
      });
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.status(404).send({ message: error.message });
      }
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "Error editing expense", error: error.message });
    }
  }
  // PATCH Controllers
  async markExpenseAsPaid(req, res) {
    try {
      const newExpenseStatus = await ExpenseService.setExpensePaid(
        req.params.id,
        req.body.isPaid
      );
      res.status(200).json({
        message: "Expense marked as paid successfully",
        expenseStatus: newExpenseStatus,
      });
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.status(404).send({ message: error.message });
      }
      if (error.name === "InvalidStateTransitionError") {
        return res.status(400).send({ message: error.message });
      }
      res.status(400).json({ message: "Error editing expense status" });
    }
  }

  // DELETE Controllers
  async deleteExpense(req, res) {
    try {
      await ExpenseService.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.name === "NotFoundError") {
        return res.status(404).send({ message: error.message });
      }
      res.status(400).json({
        message: "Error editing expense status",
        error: error.message,
      });
    }
  }
}

export default new ExpenseController();
