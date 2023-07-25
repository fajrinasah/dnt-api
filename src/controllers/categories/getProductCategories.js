import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import {
  Product,
  Category,
  ProductCategory,
} from "../../models/associations.js";

/*----------------------------------------------------*/
// GET PRODUCT'S CATEGORIES
/*----------------------------------------------------*/
export const getProductCategories = async (req, res, next) => {
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

    const categories = await ProductCategory?.findAll({
      attributes: [],

      where: { product_id: productId },

      include: [
        {
          model: Category,
          attributes: ["id", "name"],
        },
      ],
    });

    // SEND RESPONSE
    res.status(200).json({
      categories,
    });
  } catch (error) {
    next(error);
  }
};
