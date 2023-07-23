import { ValidationError } from "yup";

import client from "../../configs/redis.config.js";
import * as helpers from "../../helpers/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { User } from "../../models/user.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// LOGIN
/*----------------------------------------------------*/
export const login = async (req, res, next) => {
  try {
    // USER CAN LOGIN USING THEIR EMAIL OR USERNAME
    const { data, password } = req.body;
    await validation.loginValidationSchema.validate(req.body);

    // CHECK IF DATA IS USER'S EMAIL
    const isEmail = await validation.isEmail(data);

    // BUILD A WHERE-QUERY BASED ON DATA'S CONTENT
    const whereQuery = isEmail ? { email: data } : { username: data };

    // CHECK IF USER EXISTS
    const user = await User?.findOne({
      where: whereQuery,
    });

    if (!user)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };

    // CHECK USER'S STATUS (1: unverified, 2: active, 3: inactive)
    // IF STATUS = INACTIVE
    if (user?.dataValues?.user_status_id === 3) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };
    }
    // IF STATUS = UNVERIFIED
    if (user?.dataValues?.user_status_id === 1) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          ": please activate your account first before login. Check your email to activate your account.",
      };
    }

    // CHECK IF PASSWORD CORRECT
    const decrypted = helpers.decrypt(password);

    const isPasswordCorrect = helpers.compare(
      decrypted,
      user?.dataValues?.password
    );

    if (!isPasswordCorrect) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.INVALID_CREDENTIALS + `: wrong password.`,
      };
    }

    // CHECK TOKEN IN REDIS
    const cachedToken = await client.get(user?.dataValues?.uuid);
    const tokenIsValid = cachedToken && helpers.verifyToken(cachedToken);

    let accessToken = null;

    if (tokenIsValid) {
      accessToken = cachedToken;
    } else {
      // GENERATE NEW ACCESS TOKEN
      accessToken = helpers.createToken({
        uuid: user?.dataValues?.uuid,
        role: user?.dataValues?.role_id,
        status: user?.dataValues?.user_status_id,
      });

      // SET ACCESS TOKEN
      await client.set(user?.dataValues?.uuid, accessToken, {
        EX: 86400, // 1d
      });
    }

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res
      .header("Authorization", `Bearer ${accessToken}`)
      .status(200)
      .json({ user });
  } catch (error) {
    // CHECK IF THE ERROR COMES FROM VALIDATION
    if (error instanceof ValidationError) {
      return next({
        status: errorStatus.BAD_REQUEST_STATUS,
        message: error?.errors?.[0],
      });
    }

    // PASS TO GLOBAL ERROR HANDLER
    next(error);
  }
};
