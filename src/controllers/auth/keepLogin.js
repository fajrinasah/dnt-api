import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// KEEP LOGIN
/*----------------------------------------------------*/
export const keepLogin = async (req, res, next) => {
  try {
    const { uuid } = req.user;

    // GET USER'S DATA AND PROFILE
    const user = await User?.findOne({ where: { uuid } });

    // CHECK USER'S STATUS (1: unverified, 2: active, 3: inactive)
    // IF STATUS = INACTIVE
    if (user?.dataValues?.user_status_id === 3) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };
    }

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
