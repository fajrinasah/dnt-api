import { ValidationError } from "yup";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import moment from "moment";
import chalk from "chalk";

import * as config from "../../configs/index.js";
import * as helpers from "../../helpers/index.js";
import { User } from "../../models/user.js";
import db from "../../database/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// GENERAL OTP REQUEST
/*----------------------------------------------------*/
export const requestOtp = async (req, res, next) => {
  // START TRANSACTION
  const transaction = await db.sequelize.transaction();

  try {
    const { email, context } = req.body;
    await validation.requestOtpValidationSchema.validate(req.body);

    // UUID CONTEXT IN REDIRECT URL BASED ON CONTEXT FROM REQ.BODY
    /*----------------------------------------------------------
    "reset password" = rpw
    "change data" = cdt
        --> for change password, email, username, or phone number
    -----------------------------------------------------------*/
    if (context !== "reset password" && context !== "change data")
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + `: context is not valid.`,
      };

    // CHECK IF USER EXISTS
    const user = await User?.findOne({ where: { email } });
    if (!user || user?.dataValues?.status_id === 3)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // IF USER WANTS TO CHANGE DATA, CHECK IF USER STATUS IS UNVERIFIED
    if (context === "change data") {
      if (user?.dataValues?.user_status_id === 1)
        throw {
          status: errorStatus.BAD_REQUEST_STATUS,
          message:
            errorMessage.UNAUTHORIZED +
            `: user's status is unverified. Please verify your account first before changing crucial data.`,
        };
    }

    // GENERATE OTP TOKEN
    const otpToken = helpers.generateOtp();

    // UPDATE USER'S OTP TOKEN DATA ON DB
    await User?.update(
      {
        otp: otpToken,
        otp_exp: moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss"),
      },
      { where: { email } }
    );

    // COMPOSE EMAIL
    const template = fs.readFileSync(
      path.join(process.cwd(), "src", "views", "otpVerification.html"),
      "utf8"
    );

    const linkContext = context === "reset password" ? "rpw" : "cdt";

    const emailData = handlebars.compile(template)({
      otpToken,
      link:
        config.REDIRECT_URL +
        `/auth/verify/${linkContext}-${user?.dataValues?.uuid}`,
    });

    // SEND EMAIL
    const mailOptions = {
      from: config.GMAIL,
      to: email,
      subject: "OTP Token for Verification",
      html: emailData,
    };

    helpers.transporter.sendMail(mailOptions, (error, info) => {
      if (error) throw error;
      console.log("Email was sent successfully: " + info.response);
    });

    // COMMIT TRANSACTION
    await transaction.commit();

    // SEND RESPONSE
    res.status(200).json({
      message: `OTP token was sent successfully to ${email}`,
    });
  } catch (error) {
    // CHECK IF THE ERROR COMES FROM VALIDATION
    if (error instanceof ValidationError) {
      console.error(chalk.bgRedBright("Validation Error: "));

      return next({
        status: errorStatus.BAD_REQUEST_STATUS,
        message: error?.errors?.[0],
      });
    }

    // PASS TO GLOBAL ERROR HANDLER
    next(error);
  }
};
