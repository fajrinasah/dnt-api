import { Op } from "sequelize";

import { User } from "../../models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// GET ALL CASHIER'S DATA (with pagination, filtering, and sorting)
/*----------------------------------------------------*/
export const getAllCashiers = async (req, res, next) => {
  try {
    const { status, username, timesort, namesort, page = 1 } = req.query;

    /*------------------------------------------------------*/
    // PAGINATION OPTIONS
    /*------------------------------------------------------*/
    const options = {
      offset: page > 1 ? parseInt(page - 1) * 10 : 0,
      limit: page ? 10 : null,
    };

    /*------------------------------------------------------*/
    // WHERE CONDITION(S)
    /*------------------------------------------------------*/
    const whereCondition = { role_id: 2 };

    if (status) {
      whereCondition.user_status_id = status;
    }

    if (username) {
      whereCondition.username = { [Op.substring]: username };
    }

    /*------------------------------------------------------*/
    // SORT OPTION
    /*------------------------------------------------------*/
    let sortOption = [];

    if (timesort && namesort) {
      sortOption = [
        ["id", timesort === "ASC" ? "ASC" : "DESC"],
        ["username", namesort === "ASC" ? "ASC" : "DESC"],
      ];
    } else {
      sortOption = timesort
        ? [["id", timesort === "ASC" ? "ASC" : "DESC"]]
        : [["username", namesort === "ASC" ? "ASC" : "DESC"]];
    }

    /*------------------------------------------------------*/
    // GET DATA FROM DB
    /*------------------------------------------------------*/
    const cashiers = await User.findAll({
      attributes: {
        exclude: ["id", "uuid", "password", "role_id", "otp", "otp_exp"],
      },

      where: whereCondition,

      order: sortOption,

      // PAGINATION OPTIONS
      ...options,
    });

    // const total_cashiers = cashiers.length;
    const total_cashiers = await User?.count({ where: whereCondition });

    const total_pages = page ? Math.ceil(total_cashiers / options.limit) : null;

    // CHECK IF THERE'S NO DATA
    if (!cashiers.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no cashiers' data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      page,
      total_pages,
      total_cashiers,
      cashiers_limit: options.limit,
      cashiers,
    });
  } catch (error) {
    next(error);
  }
};
