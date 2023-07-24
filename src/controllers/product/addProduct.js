import { ValidationError } from "yup";
import chalk from "chalk";

import { Product } from "../../models/product.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// ADD PRODUCT'S DATA
/*----------------------------------------------------*/
export const addProduct = async (req, res, next) => {
  try {
    const { data } = req.body;
    const body = JSON.parse(data);
    const { name, description, price, category_id } = body;

    // VALIDATE DATA
    await validation.addProductValidationSchema.validate(body);

    // CHECK IF PRODUCT WITH THE SAME NAME ALREADY EXISTS
    const productExists = await Product?.findOne({
      where: { name },
    });

    if (productExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          `: product with the same name already exists (product with id ${productExists?.dataValues?.id})`,
      };

    // INSERT PRODUCT'S DATA INTO DB
    const product = await Product?.create({
      name,
      image: req?.file?.path,
      description,
      price,
      category_id,
    });

    // SEND RESPONSE
    res.status(201).json({
      message: "Product was added successfully.",
      product,
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
