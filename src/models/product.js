import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const Product = db.sequelize.define(
  "product",
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

    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
