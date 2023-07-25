import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { Product, Category } from "../../models/associations.js";

/*----------------------------------------------------*/
// GET PRODUCT'S DATA
/*----------------------------------------------------*/
export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

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

    const product = await Product?.findAll({
      where: { id: productId },

      include: [
        {
          model: Category,
        },
      ],
    });

    // SEND RESPONSE
    res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};
