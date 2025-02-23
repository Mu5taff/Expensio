import { Sequelize } from "sequelize";
import "dotenv/config";

// Check if the app is running in production
const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DB_URL_PROD, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // ✅ Required for Render PostgreSQL
        },
      },
      logging: false, // ✅ Disable logging in production
    })
  : new Sequelize(
      process.env.DB_NAME_LOCAL,
      process.env.DB_USER_LOCAL,
      process.env.DB_PASSWORD_LOCAL,
      {
        host: process.env.DB_HOST_LOCAL,
        port: process.env.DB_PORT_LOCAL,
        dialect: "mysql",
        logging: true, // ✅ Enable logging in development
      }
    );

// ✅ Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `✅ Connected to ${
        isProduction ? "Render (Prod)" : "Local (Dev)"
      } SQL Database`
    );
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
})();

export default sequelize;
