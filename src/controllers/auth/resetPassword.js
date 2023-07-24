import { ValidationError } from "yup";
import chalk from "chalk";

import * as helpers from "../../helpers/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { User } from "../../models/user.js";
import db from "../../database/index.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// RESET PASSWORD
/*----------------------------------------------------*/
export const resetPassword = async (req, res, next) => {
  // START TRANSACTION
  const transaction = await db.sequelize.transaction();

  try {
    const { uuidWithContext } = req.params;
    const { password } = req.body;
    await validation.passwordValidationSchema.validate(req.body);

    // CHECK CONTEXT FROM UUID PREFIX
    const context = uuidWithContext.split("-")[0];
    const cleanedUuid = uuidWithContext.split("-")?.slice(1)?.join("-");

    // CHECK IF CONTEXT === "rpw" or "act"
    if (context !== "rpw" && context !== "act")
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST_STATUS + `: context is not valid.`,
      };

    // DECRYPT HASHED PASSWORD FROM CLIENT
    const decrypted = helpers.decrypt(password);

    // HASH DECRYPTED HASHED-PASSWORD
    const hashedPassword = helpers.hash(decrypted, 10);

    // UPDATE USER'S PASSWORD IN DB
    await User?.update(
      { password: hashedPassword },
      { where: { uuid: cleanedUuid } }
    );

    // COMMIT TRANSACTION
    await transaction.commit();

    if (context === "act") {
      // SEND RESPONSE
      res.status(200).json({
        message: "Password was added successfully. Please login.",
      });
    } else {
      // SEND RESPONSE
      res.status(200).json({
        message: "Password was successfully reset. Please login again.",
      });
    }
  } catch (error) {
    // ROLLBACK TRANSACTION IF THERE'S ANY ERROR
    await transaction.rollback();

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
