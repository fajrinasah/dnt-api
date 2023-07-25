import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const ProductCategory = db.sequelize.define(
  "product_category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "products_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
