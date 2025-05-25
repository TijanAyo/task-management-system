import { DataTypes } from "sequelize";
import { sequelize } from "../config";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedFlag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export { User };
