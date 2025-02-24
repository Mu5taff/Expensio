import ExpensesRepository from "../repositories/expenses.repository.js";
import { NotFoundError } from "../Util/errors.js";
import { Op } from "sequelize";

class ExpenseService {
  async createExpense(userId, reqData) {
    return await ExpensesRepository.createExpense({ ...reqData, userId });
  }

  async editExpense(id, userId, reqData) {
    await this.validateExpenseExists(userId, id);
    return await ExpensesRepository.updateExpense(id, userId, reqData);
  }

  async viewExpense(userId, id) {
    return await this.validateExpenseExists(userId, id);
  }

  async deleteExpense(userId, id) {
    await this.validateExpenseExists(userId, id);
    await ExpensesRepository.deleteExpense(id, userId);
  }

  async setExpensePaid(id, userId, newStatus) {
    await this.validateExpenseExists(userId, id);
    return await ExpensesRepository.updateExpenseStatus(id, userId, newStatus);
  }

  async displayAllExpense(userId, status, date) {
    const queryOptions = { where: {} };

    if (status && status !== "all") {
      queryOptions.where.isPaid = status === "paid";
    }

    if (date === "upcoming") {
      const today = new Date();
      today.setDate(1);
      queryOptions.where.dueDate = {
        [Op.gte]: today.toISOString().split("T")[0],
      };
    }

    if (date === "past") {
      const today = new Date();
      today.setDate(1);
      queryOptions.where.dueDate = {
        [Op.lt]: today.toISOString().split("T")[0],
      };
    }

    return await ExpensesRepository.getAllExpenses(userId, queryOptions);
  }

  async validateExpenseExists(userId, id) {
    const expense = await ExpensesRepository.getExpenseById(id, userId);
    if (!expense) {
      throw new NotFoundError("Expense not found");
    }
    return expense;
  }
}

export default new ExpenseService();
