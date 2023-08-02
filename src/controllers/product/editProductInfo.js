import { ValidationError } from "yup";
import chalk from "chalk";

import {
  Product,
  Category,
  ProductCategory,
} from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import db from "../../database/index.js";

/*----------------------------------------------------*/
// EDIT PRODUCT'S INFO
/*----------------------------------------------------*/
export const editProductInfo = async (req, res, next) => {
  // START TRANSACTION
  const transaction = await db.sequelize.transaction();

  try {
    const { productId } = req.params;
    const { name, description, price, categoryIdArr } = req.body;

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

    /*--------------------------------------------------------------*/
    // UPDATE DATA IN PRODUCTS TABLE
    /*--------------------------------------------------------------*/
    if (name || description || price) {
      if (name) {
        // CHECK IF PRODUCT WITH THE SAME NAME ALREADY EXISTS
        const productAlreadyExists = await Product?.findOne({
          where: { name },
        });

        if (productAlreadyExists)
          throw {
            status: errorStatus.BAD_REQUEST_STATUS,
            message:
              errorMessage.BAD_REQUEST +
              (productAlreadyExists?.dataValues?.id == productId
                ? `: no changes can be made because old name is equal to the new one.`
                : `: product with the same name already exists (product with id ${productAlreadyExists?.dataValues?.id})`),
          };
      }
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

      // UPDATE CATEGORY DATA
      await Product?.update(updateFields, {
        where: { id: productId },
      });
    }

    /*--------------------------------------------------------------*/
    // UPDATE PRODUCT'S CATEGORIES
    /*--------------------------------------------------------------*/
    if (categoryIdArr.length !== 0) {
      for (let i = 0; i < categoryIdArr.length; i++) {
        // CHECK IF ROW ALREADY EXISTS
        let exists = await ProductCategory?.findOne({
          where: {
            product_id: productId,
            category_id: categoryIdArr[i],
          },
        });

        if (exists) continue;

        // IF ROW IS NOT EXISTS, CREATE A NEW ONE
        await ProductCategory?.create({
          product_id: productId,
          category_id: categoryIdArr[i],
        });
      }
    }

    // COMMIT TRANSACTION
    await transaction.commit();

    // GET UPDATED PRODUCT'S COMPLETE DATA
    const product = await Product?.findOne({
      where: { id: productId },
      include: [
        {
          model: Category,
        },
      ],
    });

    // SEND RESPONSE
    res.status(200).json({
      message: "Product information was updated successfully.",
      product,
    });
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
