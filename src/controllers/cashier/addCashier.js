import { ValidationError } from "yup";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import moment from "moment";
import chalk from "chalk";
import { Op } from "sequelize";

import * as config from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD CASHIER
/*----------------------------------------------------*/
export const addCashier = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { email, username } = req.body;
    await validation.addCashierValidationSchema.validate(req.body);

    // CHECK IF USER ALREADY EXIST
    const userExist = await User?.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (userExist)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_ALREADY_EXISTS,
      };

    // GENERATE OTP TOKEN FOR VERIFICATION PROCESS
    const otpToken = helpers.generateOtp();

    // INSERT USER'S DATA TO USERS TABLE
    const user = await User?.create({
      email,
      username,
      otp: otpToken,
      otp_exp: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
    });

    // COMPOSE "EMAIL VERIFICATION" MAIL
    const emailTemplate = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "accountVerification.html"),
      "utf8"
    );

    const emailData = handlebars.compile(emailTemplate)({
      email,
      username,
      otpToken,
      link: config.REDIRECT_URL + `/auth/verify/act-${user?.dataValues?.uuid}`,
    });

    // SEND "ACCOUNT VERIFICATION" MAIL
    const mailOptions = {
      from: config.GMAIL,
      to: email,
      subject: "Account Verification",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res.status(201).json({
      message: `Account was created successfully. Account verification mail was sent to ${email}`,
      user,
    });
  } catch (error) {
    // IF ERROR FROM VALIDATION
    if (error instanceof ValidationError) {
      console.error(chalk.bgRedBright("Validation Error: "));

      return next({
        status: errorStatus.BAD_REQUEST_STATUS,
        message: error?.errors?.[0],
      });
    }

    next(error);
  }
};
