import nodemailer from "nodemailer";
import * as config from "../configs/index.js";

// NODEMAILER TRANSPORTER
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GMAIL,
    pass: config.GMAIL_APP_KEY,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
