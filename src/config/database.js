import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  "postgres://postgres:1050@localhost:5432/employee",
  {
    dialect: "postgres",
    logging: false,
    pool: {
      max: 50,
      min: 10,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      statement_timeout: 10000,
      prepare: true,
      ...(process.env.NODE_ENV === "production"
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    },
  }
);

if (process.env.NODE_ENV !== "production") {
  await sequelize.sync({ alter: true });
}

export default sequelize;
