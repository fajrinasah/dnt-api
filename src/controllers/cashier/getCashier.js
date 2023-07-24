import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// GET CASHIER'S DATA
/*----------------------------------------------------*/
export const getCashier = async (req, res, next) => {
  try {
    const { username } = req.params;

    // CHECK IF CASHIER EXISTS
    const userData = await User?.findOne({ where: { username } });
    if (!userData)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // IF USER'S ROLE !== CASHIER
    if (userData?.dataValues?.role_id !== 2)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST + `: requested user's role is not cashier`,
      };

    // COMPILE NEEDED DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    const user = {
      email: userData?.dataValues?.email,
      username: userData?.dataValues?.username,
      photo_profile: userData?.dataValues?.photo_profile,
      user_status_id: userData?.dataValues?.user_status_id,
      created_at: userData?.dataValues?.created_at,
      updated_at: userData?.dataValues?.updated_at,
    };

    // SEND RESPONSE
    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};
