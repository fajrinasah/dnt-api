import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const ProductStatus = db.sequelize.define(
  "product_status",
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
    tableName: "product_statuses",
    timestamps: false,
  }
);
