import { Router } from "express";
import ExpenseController from "../Controllers/expense.controller.js";
import authenticate from "../Middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", ExpenseController.displayAllExpenses);
router.get("/:id", ExpenseController.viewExpense);
router.post("/", ExpenseController.createExpense);
router.patch("/:id", ExpenseController.markExpenseAsPaid);
router.delete("/:id", ExpenseController.deleteExpense);
router.put("/:id", ExpenseController.editExpense);

export default router;
