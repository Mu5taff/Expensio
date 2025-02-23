import { ValidationError } from "sequelize";
import ExpensesRepository from "../repositories/expenses.repository.js";
import { InvalidStateTransitionError, NotFoundError } from "../Util/errors.js";
import { Op } from "sequelize";

class ExpenseService {
  async createExpense(reqData) {
    await this.validateExpenseFieldsAreFilled(reqData);
    return await ExpensesRepository.createExpense(reqData);
  }

  async editExpense(id, reqData) {
    await this.validateExpenseExists(id);
    await this.validateExpenseFieldsAreFilled(reqData);
    return await ExpensesRepository.updateExpense(id, reqData);
  }

  async viewExpense(id) {
    await this.validateExpenseExists(id);
    const expense = await ExpensesRepository.getExpenseById(id);
    return expense;
  }

  async deleteExpense(id) {
    await this.validateExpenseExists(id);
    await ExpensesRepository.deleteExpense(id);
  }

  async setExpensePaid(id, newStatus) {
    await this.validateExpenseExists(id);
    const ExpenseStatus = await ExpensesRepository.updateExpenseStatus(
      id,
      newStatus
    );

    return ExpenseStatus;
  }

  async displayAllExpense(status, date) {
    const queryOptions = { where: {} };

    if (status && status !== "all") {
      queryOptions.where.isPaid = status === "paid";
    }

    if (date === "upcoming") {
      const thisMonthDate = new Date();
      thisMonthDate.setDate(1);
      const futureMonthDate = new Date(thisMonthDate);
      futureMonthDate.setMonth(futureMonthDate.getMonth() + 1);

      const thisMonthDateStr = thisMonthDate.toISOString().split("T")[0];
      const futureMonthDateStr = futureMonthDate.toISOString().split("T")[0];

      queryOptions.where.dueDate = {
        [Op.gte]: thisMonthDateStr,
        [Op.lt]: futureMonthDateStr,
      };
    }

    if (date === "past") {
      const thisMonthDate = new Date();
      thisMonthDate.setDate(1);

      const thisMonthDateStr = thisMonthDate.toISOString().split("T")[0];

      queryOptions.where.dueDate = {
        [Op.lt]: thisMonthDateStr,
      };
    }

    const expenses = await ExpensesRepository.getAllExpenses(queryOptions);

    if (expenses.length === 0) {
      return [];
    }

    console.log(queryOptions);

    return expenses;
  }

  // Helper
  async validateExpenseExists(id) {
    const expense = await ExpensesRepository.getExpenseById(id);
    if (!expense) {
      throw new NotFoundError("Expense not found");
    }
  }

  async validateExpenseFieldsAreFilled(reqBody) {
    const reqBodyValues = Object.values(reqBody);
    await reqBodyValues.forEach((reqValue) => {
      if (reqValue === "") {
        throw new ValidationError(`${reqValue} is blank`);
      }
    });
  }
}

export default new ExpenseService();
