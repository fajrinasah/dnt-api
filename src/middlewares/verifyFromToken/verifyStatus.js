import { verifyToken } from "../../helpers/token.js";
import * as errorStatus from "../globalErrorHandler/errorStatus.js";
import * as errorMessage from "../globalErrorHandler/errorMessage.js";

export async function verifyUser(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw { message: errorMessage.UNAUTHORIZED };

    const decoded = verifyToken(token);
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
