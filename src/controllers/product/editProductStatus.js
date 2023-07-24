import { Product } from "../../models/product.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// EDIT PRODUCT'S STATUS
/*----------------------------------------------------*/
export const editProductStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { product_status_id } = req.body;

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

    // UPDATE CATEGORY DATA
    await Product?.update({ product_status_id }, { where: { id: productId } });

    if (product_status_id === 2) {
      // SEND RESPONSE
      res.status(200).json({
        message: "Product status was updated to unavailable.",
      });
    } else {
      // SEND RESPONSE
      res.status(200).json({
        message: "Product status was updated to available.",
      });
    }
  } catch (error) {
    next(error);
  }
};
