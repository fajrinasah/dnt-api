import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const Category = db.sequelize.define(
  "category",
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

    parent_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
