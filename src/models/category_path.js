import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const CategoryPath = db.sequelize.define(
  "vw_category_path",
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

    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "vw_category_paths",
    timestamps: false,
  }
);
