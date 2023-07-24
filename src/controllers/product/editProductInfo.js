import { ValidationError } from "yup";
import chalk from "chalk";

import { Product } from "../../models/product.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// EDIT PRODUCT'S INFO
/*----------------------------------------------------*/
export const editProductInfo = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category_id } = req.body;

    // VALIDATE DATA
    await validation.editProductValidationSchema.validate(req.body);

    // CHECK IF PRODUCT EXISTS
    const productExists = await Product?.findOne({
      where: { id: productId },
    });

    if (!productExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          ": no product can be found based on id input.",
      };

    // CHECK IF PRODUCT WITH THE SAME NAME ALREADY EXISTS
    const productAlreadyExists = await Product?.findOne({
      where: { name },
    });

    if (productAlreadyExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: product with the same name already exists (product with id ${productAlreadyExists?.dataValues?.id})`,
      };

    // COMPILE DATA THAT WILL BE UPDATED
    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (description) {
      updateFields.description = description;
    }

    if (price) {
      updateFields.price = price;
    }

    if (category_id) {
      updateFields.category_id = category_id;
    }

    // UPDATE CATEGORY DATA
    await Product?.update(updateFields, {
      where: { id: productId },
    });

    // SEND RESPONSE
    res.status(200).json({
      message: "Product information was updated successfully.",
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
