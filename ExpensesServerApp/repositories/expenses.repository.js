import Expense from "../models/expense.model.js";

class ExpensesRepository {
  async createExpense(reqData) {
    return Expense.create(reqData);
  }

  async getAllExpenses(userId, queryParams) {
    return Expense.findAll({
      where: { userId, ...queryParams.where },
      order: [["dueDate", "DESC"]],
    });
  }

  async getExpenseById(id, userId) {
    return Expense.findOne({ where: { id, userId } });
  }

  async updateExpense(expenseId, userId, expense) {
    await Expense.update(expense, {
      where: { id: expenseId, userId },
    });

    return Expense.findOne({ where: { id: expenseId, userId } });
  }

  async updateExpenseStatus(expenseId, userId, expenseStatus) {
    await Expense.update(
      { isPaid: expenseStatus },
      { where: { id: expenseId, userId } }
    );

    return Expense.findOne({ where: { id: expenseId, userId } });
  }

  async deleteExpense(expenseId, userId) {
    await Expense.destroy({ where: { id: expenseId, userId } });
  }
}

export default new ExpensesRepository();
