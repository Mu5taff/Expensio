import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import expenseRoutes from "./routes/expense.routes.js";

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/expenses", expenseRoutes);

// Start Server & Sync Database
async function startServer() {
  try {
    await sequelize.sync({ alter: true }); // ✅ Keeps data while updating schema
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
