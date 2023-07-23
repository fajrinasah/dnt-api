import { DataTypes } from "sequelize";
import db from "../database/index.js";

export const User = db.sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    photo_profile: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },

    user_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    otp: {
      type: DataTypes.STRING(10),
      defaultValue: null,
    },

    otp_exp: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
