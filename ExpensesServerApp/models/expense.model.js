import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";

class Expense extends Model {}

Expense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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

Expense.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Expense, { foreignKey: "userId" });

export default Expense;
