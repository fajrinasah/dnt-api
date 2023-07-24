import { verifyToken } from "../../helpers/token.js";
import * as errorStatus from "../globalErrorHandler/errorStatus.js";
import * as errorMessage from "../globalErrorHandler/errorMessage.js";
import { User } from "../../models/user.js";

// CHECK IF USER'S ROLE IS ADMIN (status: 1)
export async function verifyRole(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      throw { message: errorMessage.UNAUTHORIZED + `: no token was provided.` };

    const decoded = verifyToken(token);

    const user = await User?.findOne({
      where: { uuid: decoded?.uuid },
    });

    if (user?.dataValues?.role_id !== 1)
      throw {
        message:
          errorMessage.UNAUTHORIZED + `: only admin can access this feature.`,
      };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(errorStatus.UNAUTHORIZED_STATUS).json({
      type: "error",
      status: errorStatus.UNAUTHORIZED_STATUS,
      message: error?.message,
      data: null,
    });
  }
}
