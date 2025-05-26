import { Sequelize } from "sequelize-typescript";
import { User, Role, Permission, RolePermission, Task } from "../models";

export const credentials = {
  host: String(process.env.DB_HOST),
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  port: Number(process.env.DB_PORT),
};

const sequelize = new Sequelize(
  credentials.database,
  credentials.user,
  credentials.password,
  {
    host: credentials.host,
    dialect: "postgres",
    port: credentials.port,
    models: [User, Role, Permission, RolePermission, Task],
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export { sequelize };
