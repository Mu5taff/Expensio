import { Router } from "express";
import AuthController from "../Controllers/auth.controller.js"; // ✅ Ensure correct case

const router = Router();

// ✅ Authentication Routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login); // ✅ Fixed incorrect login route
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout); // ✅ Added missing logout route

export default router;
