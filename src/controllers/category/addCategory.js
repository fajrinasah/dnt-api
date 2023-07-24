import { ValidationError } from "yup";
import chalk from "chalk";

import { Category } from "../../models/category.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD CATEGORY
/*----------------------------------------------------*/
export const addCategory = async (req, res, next) => {
  try {
    // GET CATEGORY'S NAME AND PARENT ID
    // parent id can be blank
    const { name, parent_id } = req.body;

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
          ": category with the same name already exists.",
      };

    // CREATE NEW CATEGORY
    const category = await Category?.create({
      name,
      parent_id,
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
