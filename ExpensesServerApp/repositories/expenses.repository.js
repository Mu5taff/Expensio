import { raw } from "express";
import Expense from "../models/expense.model.js";

class ExpensesRepository {
  async createExpense(reqData) {
    return Expense.create(reqData);
  }

  async getAllExpenses(queryParams) {
    return Expense.findAll(queryParams);
  }

  async getExpenseById(id) {
    const expense = await Expense.findByPk(id);
    return expense;
  }

  async updateExpense(expenseId, expense) {
    await Expense.update(expense, {
      where: {
        id: expenseId,
      },
    });

    return Expense.findByPk(expenseId);
  }

  async updateExpenseStatus(expenseId, expenseStatus) {
    await Expense.update(
      { isPaid: expenseStatus },
      {
        where: {
          id: expenseId,
        },
      }
    );
    return Expense.findByPk(expenseId);
  }

  async deleteExpense(expenseId) {
    await Expense.destroy({
      where: {
        id: expenseId,
      },
    });
  }
}

export default new ExpensesRepository();
