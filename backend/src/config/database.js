import { Sequelize, Op } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("====================================");
console.log(process.env.DB_NAME);
console.log("====================================");

const sequelize = new Sequelize("itopup", "admin_user", "StrongPassword123!", {
  host: "62.169.29.76",
  dialect: "mysql", // or your preferred database
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export { sequelize, Op };
