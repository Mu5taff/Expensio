import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Expense extends Model {}

Expense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "rent",
        "utilities",
        "hagbad",
        "debt",
        "qaraan",
        "other"
      ),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("transfer", "cash", "cheque"),
      allowNull: false,
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    recurringEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize, // Ensure Sequelize instance is attached
    modelName: "Expense", // Define model name explicitly
    tableName: "expenses", // Ensure table name is explicitly defined
    timestamps: true, // Enables `createdAt` & `updatedAt`
  }
);

export default Expense;
