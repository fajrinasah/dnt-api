import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const Transactions = db.sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    cashier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total_transaction_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Assuming you don't need the `updated_at` field
  }
);
