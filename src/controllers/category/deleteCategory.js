import { Category } from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// DELETE CATEGORY
/*----------------------------------------------------*/
export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // CHECK IF CATEGORY EXISTS
    const categoryExists = await Category?.findOne({
      where: { id: categoryId },
    });

    if (!categoryExists)
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message:
          errorMessage.DATA_NOT_FOUND +
          ": no category can be found based on id input.",
      };

    // DELETE ARTICLE'S DATA
    await Category.destroy({
      where: { id: categoryId },
    });

    // SEND RESPONSE
    res.status(200).json({
      message: "Category was deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
