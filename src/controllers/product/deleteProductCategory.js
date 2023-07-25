import { Product, ProductCategory } from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// DELETE PRODUCT'S CATEGORY
/*----------------------------------------------------*/
export const deleteProductCategory = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { categoryIdArr } = req.body;

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

    // IF THERE IS NO CATEGORY
    if (categoryIdArr.length === 0)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + ": no category to delete.",
      };

    // LOOP categoryIdArr TO DELETE
    for (let i = 0; i < categoryIdArr.length; i++) {
      // CHECK IF ROW ALREADY EXISTS
      let exists = await ProductCategory?.findOne({
        where: {
          product_id: productId,
          category_id: categoryIdArr[i],
        },
      });

      if (!exists)
        throw {
          status: errorStatus.BAD_REQUEST_STATUS,
          message:
            errorMessage.BAD_REQUEST +
            ": no data can be deleted based on product's id and category's id.",
        };

      // IF ROW IS EXISTS, DELETE IT
      await ProductCategory?.destroy({
        where: {
          product_id: productId,
          category_id: categoryIdArr[i],
        },
      });
    }

    if (categoryIdArr.length === 1) {
      // SEND RESPONSE
      res.status(200).json({
        message: "Category was deleted successfully.",
      });
    } else {
      // SEND RESPONSE
      res.status(200).json({
        message: "Categories were deleted successfully.",
      });
    }
  } catch (error) {
    next(error);
  }
};
