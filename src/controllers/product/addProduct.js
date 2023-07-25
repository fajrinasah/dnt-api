import { ValidationError } from "yup";
import chalk from "chalk";
import { v2 as cloudinary } from "cloudinary";

import {
  Product,
  Category,
  ProductCategory,
} from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import * as validation from "./validationSchemata/index.js";
import db from "../../database/index.js";
import * as config from "../../configs/index.js";

/*----------------------------------------------------*/
// ADD PRODUCT'S DATA
/*----------------------------------------------------*/
export const addProduct = async (req, res, next) => {
  // START TRANSACTION
  const transaction = await db.sequelize.transaction();

  try {
    const { data } = req.body;
    const body = JSON.parse(data);
    const { name, description, price, categoryIdArr } = body;

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
    const newProduct = await Product?.create({
      name,
      image: req?.file?.path,
      description,
      price,
    });

    // INSERT PRODUCT AND CATEGORY INTO PRODUCTS_CATEGORIES
    const createRows = [];

    for (let i = 0; i < categoryIdArr.length; i++) {
      createRows.push({
        product_id: newProduct?.dataValues?.id,
        category_id: categoryIdArr[i],
      });
    }

    await ProductCategory?.bulkCreate(createRows);

    // GET PRODUCT'S COMPLETE DATA
    const product = await Product?.findAll({
      where: { id: newProduct?.dataValues?.id },

      include: [
        {
          model: Category,
        },
      ],
    });

    // COMMIT TRANSACTION
    await transaction.commit();

    // SEND RESPONSE
    res.status(201).json({
      message: "Product was added successfully.",
      product,
    });
  } catch (error) {
    // ROLLBACK TRANSACTION IF THERE'S ANY ERROR
    await transaction.rollback();

    /*----------------------------------------------------*/
    // DELETE UPLOADED IMAGE FROM CLOUDINARY
    /*----------------------------------------------------*/
    const uploadedImage = req?.file?.path;

    // GET IMAGE'S PUBLIC ID FROM PROVIDED URL
    const splitted = uploadedImage.split("/");
    const imgName = splitted[8].split(".").splice(0, 1);
    const publicId = `${splitted[7]}/${imgName[0]}`;

    // CLOUDINARY CONFIG
    cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    });

    cloudinary.uploader.destroy(publicId, function (result) {
      console.log(result);
      console.log(
        `Image with public ID ${publicId} was destroyed successfully`
      );
    });

    /*----------------------------------------------------*/
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
