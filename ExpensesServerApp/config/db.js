import { Sequelize } from "sequelize";
import "dotenv/config";

const isRailway = process.env.ENVIRONMENT === "railway";

const sequelize = new Sequelize(
  isRailway ? process.env.DB_NAME_RAILWAY : process.env.DB_NAME_LOCAL,
  isRailway ? process.env.DB_USER_RAILWAY : process.env.DB_USER_LOCAL,
  isRailway ? process.env.DB_PASSWORD_RAILWAY : process.env.DB_PASSWORD_LOCAL,
  {
    host: isRailway ? process.env.DB_HOST_RAILWAY : process.env.DB_HOST_LOCAL,
    port: isRailway ? process.env.DB_PORT_RAILWAY : process.env.DB_PORT_LOCAL,
    dialect: "mysql",
    logging: false, // Set to true if you want to see SQL logs
  }
);

// Immediately invoked function that's run when this module is imported
(async () => {
  try {
    await sequelize.authenticate();
    console.log("COnnection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
})();

export default sequelize;
