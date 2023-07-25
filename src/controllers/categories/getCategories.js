import { Op } from "sequelize";

import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { Category } from "../../models/Category.js";

/*----------------------------------------------------*/
// GET ALL CATEGORIES
/*----------------------------------------------------*/
export const getCategories = async (req, res, next) => {
  try {
    const { name, timesort, namesort } = req.query;

    /*------------------------------------------------------*/
    // WHERE CONDITION(S)
    /*------------------------------------------------------*/
    const whereCondition = {};

    if (name) {
      whereCondition.name = { [Op.substring]: name };
    }

    /*------------------------------------------------------*/
    // SORT OPTION
    /*------------------------------------------------------*/
    let sortOption = [];

    if (timesort && namesort) {
      sortOption = [
        ["id", timesort === "ASC" ? "ASC" : "DESC"],
        ["name", namesort === "ASC" ? "ASC" : "DESC"],
      ];
    } else {
      sortOption = timesort
        ? [["id", timesort === "ASC" ? "ASC" : "DESC"]]
        : [["name", namesort === "ASC" ? "ASC" : "DESC"]];
    }

    /*------------------------------------------------------*/
    // GET DATA FROM DB
    /*------------------------------------------------------*/
    const categories = await Category.findAll({
      where: whereCondition,
      order: sortOption,
    });

    // CHECK IF THERE'S NO DATA
    if (!categories.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message:
          errorMessage.DATA_NOT_FOUND + ": there is no category data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      categories,
    });
  } catch (error) {
    next(error);
  }
};
