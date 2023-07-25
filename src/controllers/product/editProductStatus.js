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

    // CHECK IF STATUS ID !== 1 && STATUS ID !== 2
    if (product_status_id !== 1 && product_status_id !== 2)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          ": status id is not valid. Input for available or 2 for unavailable.",
      };

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

    // CHECK IF CURRENT STATUS IS THE SAME AS NEW STATUS
    if (productExists?.dataValues?.product_status_id === product_status_id)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.BAD_REQUEST +
          ": no changes can be made because current status is equal to new status.",
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
