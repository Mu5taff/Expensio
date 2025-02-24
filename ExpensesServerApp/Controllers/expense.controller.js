import ExpenseService from "../services/expense.service.js";

class ExpenseController {
  async displayAllExpenses(req, res) {
    try {
      console.log("📢 Fetching all expenses for user:", req.user.id); // ✅ Log user ID

      const { status, date } = req.query;
      console.log("🔹 Query Params - Status:", status, "Date:", date); // ✅ Log filters

      const allExpenses = await ExpenseService.displayAllExpense(
        req.user.id,
        status,
        date
      );

      console.log("✅ Successfully retrieved expenses:", allExpenses.length);
      res.status(200).json(allExpenses);
    } catch (error) {
      console.error("❌ Error in displayAllExpenses:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }

  async viewExpense(req, res) {
    try {
      const expense = await ExpenseService.viewExpense(
        req.user.id,
        req.params.id
      );
      res.status(200).json(expense);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createExpense(req, res) {
    try {
      const newExpense = await ExpenseService.createExpense(
        req.user.id,
        req.body
      );
      res
        .status(201)
        .json({ message: "Expense created successfully", expense: newExpense });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error creating expense", error: error.message });
    }
  }

  async editExpense(req, res) {
    try {
      const editedExpense = await ExpenseService.editExpense(
        req.params.id,
        req.user.id,
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
        req.user.id,
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

  async deleteExpense(req, res) {
    try {
      await ExpenseService.deleteExpense(req.user.id, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

export default new ExpenseController();
