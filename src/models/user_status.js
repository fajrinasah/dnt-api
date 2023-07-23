import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const UserStatus = db.sequelize.define(
  "user_status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "user_statuses",
    timestamps: false,
  }
);
