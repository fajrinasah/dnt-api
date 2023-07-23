import { ValidationError } from "yup";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import moment from "moment";
import chalk from "chalk";

import * as config from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// EDIT CASHIER'S EMAIL
/*----------------------------------------------------*/
export const editEmailCashier = async (req, res, next) => {
  try {
    // VALIDATE DATA
    const { email, username } = req.body;
    await validation.addCashierValidationSchema.validate(req.body);

    // CHECK IF CASHIER EXISTS
    const user = await User?.findOne({ where: { username } });
    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // GET CASHIER'S OLD EMAIL TO SEND NOTIFICATION ABOUT EMAIL CHANGES
    const oldEmail = user?.dataValues?.email;

    // GENERATE OTP TOKEN FOR VERIFICATION PROCESS
    const otpToken = helpers.generateOtp();

    // EDIT CASHIER'S EMAIL USING CASHIER'S USERNAME AS IDENTIFIER
    await User?.update(
      {
        email,
        user_status_id: 1,
        otp: otpToken,
        otp_exp: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      },
      { where: { username } }
    );

    /*-------------------------------------------------------------------
    SEND NOTIFICATION MAIL TO OLD EMAIL
    -------------------------------------------------------------------*/
    // COMPOSE NOTIFICATION MAIL
    const notificationEmailTemplate = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "changeEmailNotification.html"),
      "utf8"
    );

    const notificationEmailData = handlebars.compile(notificationEmailTemplate)(
      {
        username,
      }
    );

    // SEND NOTIFICATION MAIL
    const notificationMailOptions = {
      from: config.GMAIL,
      to: oldEmail,
      subject: "[Notification] Email has been changed",
      html: notificationEmailData,
    };

    helpers.transporter.sendMail(notificationMailOptions, (error, info) => {
      if (error) throw error;
      console.log("Notification mail was sent successfully: " + info.response);
    });

    /*-------------------------------------------------------------------
    SEND VERIFICATION MAIL TO NEW EMAIL
    -------------------------------------------------------------------*/
    // COMPOSE VERIFICATION MAIL
    const emailTemplate = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "changeEmailVerification.html"),
      "utf8"
    );

    const emailData = handlebars.compile(emailTemplate)({
      email,
      otpToken,
      link:
        config.REDIRECT_URL + `/auth/activate/react-${user?.dataValues?.uuid}`,
    });

    // SEND VERIFICATION MAIL
    const mailOptions = {
      from: config.GMAIL,
      to: email,
      subject: "Changed Email Verification",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log(
        "Verification mail was sent successfully to new email: " + info.response
      );
    });

    // SEND RESPONSE
    res.status(200).json({
      message: `Email was successfully changed. Account verification mail was sent to ${email}`,
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
