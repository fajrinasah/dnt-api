import moment from "moment";

import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { User } from "../../models/user.js";

/*----------------------------------------------------*/
// VERIFY OTP TOKEN
/*----------------------------------------------------*/
export const verifyOtp = async (req, res, next) => {
  try {
    const { uuidWithContext } = req.params;
    const { token } = req.body;

    // CHECK CONTEXT FROM UUID PREFIX
    const context = uuidWithContext.split("-")[0];
    const cleanedUuid = uuidWithContext.split("-")?.slice(1)?.join("-");

    // CHECK IF USER EXISTS
    const user = await User?.findOne({ where: { uuid: cleanedUuid } });
    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // VERIFY OTP TOKEN
    if (token !== user?.dataValues?.otp)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.INVALID_CREDENTIALS + `: wrong OTP token.`,
      };

    // CHECK TOKEN'S EXPIRE DATE/TIME
    const isExpired = moment().isAfter(user?.dataValues?.otp_exp);
    if (isExpired)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.INVALID_CREDENTIALS +
          `: OTP token has expired. Please try to request OTP token again.`,
      };

    // DO ACTIONS BASED ON CONTEXT
    if (context === "act" || context === "react") {
      // UPDATE USER'S STATUS TO "active"
      await User?.update(
        { user_status_id: 2, otp: null, otp_exp: null },
        { where: { uuid: cleanedUuid } }
      );

      if (context === "act") {
        // SEND RESPONSE
        res.status(200).json({
          message: "Account was activated successfully.",
        });
      } else if (context === "react") {
        // SEND RESPONSE
        res.status(200).json({
          message: "Account was reactivated successfully.",
        });
      }
    }

    // SEND RESPONSE
    res.status(200).json({
      message: "Successfully verified.",
    });
  } catch (error) {
    next(error);
  }
};
