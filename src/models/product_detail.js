import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const ProductDetail = db.sequelize.define(
  "vw_products_complete_detail",
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

    description: {
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

    category_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    category_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    product_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    product_status_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "vw_products_complete_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
