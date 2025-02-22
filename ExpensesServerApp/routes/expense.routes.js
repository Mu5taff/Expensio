import { Router } from "express";
import ExpenseController from "../Controllers/expense.controller.js";

const router = Router();

router.get("/", ExpenseController.displayAllExpenses);
router.get("/:id", ExpenseController.viewExpense);
router.post("/", ExpenseController.createExpense);
router.put("/:id", ExpenseController.editExpense);
router.patch("/:id", ExpenseController.markExpenseAsPaid);
router.delete("/:id", ExpenseController.deleteExpense);

export default router;
