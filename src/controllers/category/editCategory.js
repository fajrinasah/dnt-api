import { ValidationError } from "yup";
import chalk from "chalk";

import { Category } from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// EDIT CATEGORY
/*----------------------------------------------------*/
export const editCategory = async (req, res, next) => {
  try {
    // GET CATEGORY'S NEW DATA
    const { categoryId } = req.params;
    const { name } = req.body;

    // VALIDATE DATA
    await validation.editCategoryValidationSchema.validate(req.body);

    // CHECK IF CATEGORY EXISTS
    const categoryExists = await Category?.findOne({
      where: { id: categoryId },
    });

    if (!categoryExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.DATA_NOT_FOUND +
          ": no category can be found based on id input.",
      };

    // CHECK IF CATEGORY'S NAME ALREADY EXISTS
    const categoryAlreadyExists = await Category?.findOne({
      where: { name },
    });

    if (categoryAlreadyExists) {
      if (
        categoryAlreadyExists?.dataValues?.id === categoryExists?.dataValues?.id
      )
        throw {
          status: errorStatus.BAD_REQUEST_STATUS,
          message:
            errorMessage.BAD_REQUEST +
            `: no changes applied because old name is same as the new one.`,
        };

      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: category with the same name already exists (category with id ${categoryAlreadyExists?.dataValues?.id})`,
      };
    }

    // UPDATE CATEGORY DATA
    await Category?.update({ name }, { where: { id: categoryId } });

    // SEND RESPONSE
    res.status(200).json({
      message: "Category's name was updated successfully.",
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
