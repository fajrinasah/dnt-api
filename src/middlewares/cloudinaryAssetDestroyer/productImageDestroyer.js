import { v2 as cloudinary } from "cloudinary";

import { Product } from "../../models/product.js";
import * as config from "../../configs/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

export async function productImageDestroyer(req, res, next) {
  try {
    const { productId } = req.params;

    // CHECK CURRENT PHOTO PROFILE
    const product = await Product?.findOne({
      where: { id: productId },
    });

    if (!product)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          ": no product can be found based on id input.",
      };

    // DELETE CURRENT PHOTO PROFILE FROM CLOUDINARY (IF ANY)
    const currentProductImage = product?.dataValues?.image;

    if (currentProductImage !== null) {
      // GET IMAGE'S PUBLIC ID FROM PROVIDED URL
      const splitted = currentProductImage.split("/");
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
          `Old product image with public ID ${publicId} was destroyed successfully`
        );
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
