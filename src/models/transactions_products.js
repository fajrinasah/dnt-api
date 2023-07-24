import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const TransactionsProducts = db.sequelize.define(
  "transactions_products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    total_product_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "transactions_products",
    timestamps: false, // Assuming you don't need timestamps for this association table
  }
);
