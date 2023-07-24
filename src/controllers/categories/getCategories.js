import { Op } from "sequelize";

import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { CategoryPath } from "../../models/category_path.js";

/*----------------------------------------------------*/
// GET ALL CATEGORIES' DATA (with filtering and sorting)
/*----------------------------------------------------*/
export const getCategories = async (req, res, next) => {
  try {
    const { name, path, timesort, namesort } = req.query;

    /*------------------------------------------------------*/
    // WHERE CONDITION(S)
    /*------------------------------------------------------*/
    const whereCondition = {};

    if (name) {
      whereCondition.name = { [Op.substring]: name };
    }

    if (path) {
      whereCondition.path = { [Op.substring]: path };
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
    const categoryPaths = await CategoryPath.findAll({
      where: whereCondition,
      order: sortOption,
    });

    // CHECK IF THERE'S NO DATA
    if (!categoryPaths.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no categoy paths data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      categoryPaths,
    });
  } catch (error) {
    next(error);
  }
};
