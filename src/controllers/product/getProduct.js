import { Product } from "../../models/product.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// GET PRODUCT'S DATA
/*----------------------------------------------------*/
export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // CHECK IF PRODUCT EXISTS
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

    // SEND RESPONSE
    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};
