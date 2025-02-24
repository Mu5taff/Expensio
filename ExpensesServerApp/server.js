import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import expenseRoutes from "./routes/expense.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ Enable parsing cookies

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Only allow frontend origin
    credentials: true, // ✅ Allow credentials (cookies, authorization headers)
  })
);

// Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

// Start Server & Sync Database
async function startServer() {
  try {
    await sequelize.sync({ force: true }); // ✅ Keeps data while updating schema
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database failed to sync:", error);
    process.exit(1);
  }
}

startServer();
