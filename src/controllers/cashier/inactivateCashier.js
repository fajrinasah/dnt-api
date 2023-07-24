import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// INACTIVATE CASHIER
/*----------------------------------------------------*/
export const inactivateCashier = async (req, res, next) => {
  try {
    const { username } = req.params;

    // CHECK IF CASHIER EXISTS
    const user = await User?.findOne({ where: { username } });
    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // UPDATE CASHIER'S STATUS TO INACTIVE (user_status_id: 3)
    await User?.update(
      {
        user_status_id: 3,
      },
      { where: { username } }
    );

    // SEND RESPONSE
    res.status(200).json({ message: `Cashier was successfully inactivated.` });
  } catch (error) {
    next(error);
  }
};
