import { Op } from "sequelize";

import { Product } from "../../models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";

/*----------------------------------------------------*/
// GET ALL PRODUCT'S DATA (with pagination, filtering, and sorting)
/*----------------------------------------------------*/
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      status,
      category,
      name,
      timesort,
      pricesort,
      namesort,
    } = req.query;

    /*------------------------------------------------------*/
    // PAGINATION OPTIONS
    /*------------------------------------------------------*/
    const options = {
      offset: page > 1 ? parseInt(page - 1) * 5 : 0,
      limit: page ? 5 : null,
    };

    /*------------------------------------------------------*/
    // WHERE CONDITION(S)
    /*------------------------------------------------------*/
    const whereCondition = {};

    if (category) {
      whereCondition.category_id = category;
    }

    if (status) {
      whereCondition.product_status_id = status;
    }

    if (name) {
      whereCondition.name = { [Op.substring]: name };
    }

    /*------------------------------------------------------*/
    // SORT OPTION
    /*------------------------------------------------------*/
    let sortOption = [];

    if (timesort) {
      sortOption.push(["id", timesort === "ASC" ? "ASC" : "DESC"]);
    }
    if (pricesort) {
      sortOption.push(["price", pricesort === "ASC" ? "ASC" : "DESC"]);
    }
    if (namesort) {
      sortOption.push(["name", namesort === "ASC" ? "ASC" : "DESC"]);
    }

    /*------------------------------------------------------*/
    // GET DATA FROM DB
    /*------------------------------------------------------*/
    const products = await Product.findAll({
      where: whereCondition,

      order: sortOption,

      // PAGINATION OPTIONS
      ...options,
    });

    // const total_cashiers = cashiers.length;
    const total_products = await Product?.count({ where: whereCondition });

    const total_pages = page ? Math.ceil(total_products / options.limit) : null;

    // CHECK IF THERE'S NO DATA
    if (!products.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no products data yet",
      };

    // SEND RESPONSE
    res.status(200).json({
      page,
      total_pages,
      total_products,
      products_limit: options.limit,
      products,
    });
  } catch (error) {
    next(error);
  }
};
