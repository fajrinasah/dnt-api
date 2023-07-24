import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { Product } from "../../models/product.js";

/*----------------------------------------------------*/
// CHANGE PRODUCT'S IMAGE
/*----------------------------------------------------*/
export const editProductImage = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // CHECK IF FILE IS UPLOADED
    if (!req.file) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + ": please upload an image.",
      }();
    }

    // UPDATE PRODUCT'S IMAGE
    await Product?.update(
      { image: req?.file?.path },
      { where: { id: productId } }
    );

    // SEND RESPONSE
    res.status(200).json({
      message: "Product's image was updated successfully.",
      imageUrl: req.file?.path,
    });
  } catch (error) {
    next(error);
  }
};
