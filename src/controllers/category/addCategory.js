import { ValidationError } from "yup";
import chalk from "chalk";

import { Category } from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD CATEGORY
/*----------------------------------------------------*/
export const addCategory = async (req, res, next) => {
  try {
    // GET CATEGORY'S NAME
    const { name } = req.body;

    // VALIDATE DATA
    await validation.categoryValidationSchema.validate(req.body);

    // CHECK IF CATEGORY ALREADY EXISTS
    const categoryExists = await Category?.findOne({
      where: { name },
    });

    if (categoryExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: category with the same name already exists (category with id ${categoryExists?.dataValues?.id})`,
      };

    // CREATE NEW CATEGORY
    const category = await Category?.create({
      name,
    });

    // SEND RESPONSE
    res.status(201).json({
      message: "Category was created successfully.",
      category,
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
